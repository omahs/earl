import { expect } from 'chai'
import path from 'path'
import { spy } from 'sinon'

import { Control } from '../../../src/internals'
import { TestRunnerCtx } from '../../../src/test-runners'
import { toMatchSnapshot } from '../../../src/validators/snapshots'
import { CompareSnapshot } from '../../../src/validators/snapshots/compareSnapshot'

describe('toMatchSnapshot', () => {
  const makeDummyTestRunnerCtx = (): TestRunnerCtx => ({
    afterTestCase: spy(),
    beforeTestCase: spy(),
    testInfo: {
      suitName: ['Dummy suit'],
      testName: 'works',
      testFilePath: '/tests/dummy.test.ts',
    },
  })

  class DummyControl extends Control<any> {
    testRunnerCtx = makeDummyTestRunnerCtx()
    assert = spy() as any
    fail = spy() as any
  }

  it('creates new snapshots', () => {
    const dummyCtrl = new DummyControl('test123', false)
    const dummyCompareSnapshot: CompareSnapshot = spy(() => {
      return { success: true } as any
    })

    toMatchSnapshot(dummyCtrl, { compareSnapshot: dummyCompareSnapshot, env: {} })

    expect(dummyCompareSnapshot).to.have.been.calledOnceWithExactly({
      actual: 'test123',
      name: 'Dummy suit works',
      updateSnapshotMode: 'new',
      snapshotFilePath: path.normalize('/tests/__snapshots__/dummy.test.snap'),
    })

    expect(dummyCtrl.assert).to.have.been.calledOnceWithExactly({ success: true, negatedReason: '-', reason: '-' })
  })

  it('matches existing snapshots', () => {
    const dummyCtrl = new DummyControl('test123', false)
    const dummyCompareSnapshot: CompareSnapshot = spy(() => {
      return { success: false, actual: 'test123', expected: 'abc' } as any
    })

    toMatchSnapshot(dummyCtrl, { compareSnapshot: dummyCompareSnapshot, env: {} })

    expect(dummyCompareSnapshot).to.have.been.calledOnceWithExactly({
      actual: 'test123',
      name: 'Dummy suit works',
      updateSnapshotMode: 'new',
      snapshotFilePath: path.normalize('/tests/__snapshots__/dummy.test.snap'),
    })
    expect(dummyCtrl.assert).to.have.been.calledOnceWithExactly({
      success: false,
      actual: 'test123',
      expected: 'abc',
      reason: "Snapshot doesn't match",
      negatedReason: '-',
    })
  })
})
