import { expect } from 'chai'

import { expect as earlExpect } from '../../src'
import { AMatcher } from '../../src/matchers/A'

describe('A matcher', () => {
  it('should match string', () => {
    const m = new AMatcher(String)

    expect(m.check('m')).to.be.true
    // eslint-disable-next-line
    expect(m.check(new String('green'))).to.be.true

    expect(m.check(undefined)).to.be.false
    expect(m.check(null)).to.be.false
    expect(m.check(1)).to.be.false
    expect(m.check({})).to.be.false
  })

  it('should match numbers', () => {
    const m = new AMatcher(Number)

    expect(m.check(5)).to.be.true
    // eslint-disable-next-line
    expect(m.check(new Number(5))).to.be.true

    expect(m.check(NaN)).to.be.false
    expect(m.check(undefined)).to.be.false
    expect(m.check(null)).to.be.false
    expect(m.check([])).to.be.false
    expect(m.check({})).to.be.false
  })

  it('should match boolean', () => {
    const m = new AMatcher(Boolean)

    expect(m.check(true)).to.be.true
    // eslint-disable-next-line
    expect(m.check(new Boolean(false))).to.be.true

    expect(m.check(5)).to.be.false
    expect(m.check(undefined)).to.be.false
    expect(m.check(null)).to.be.false
    expect(m.check([])).to.be.false
    expect(m.check({})).to.be.false
  })

  it('should match bigint', () => {
    const m = new AMatcher(BigInt)

    // We eval here because of typescript compilation target being <ES2020
    // eslint-disable-next-line no-eval
    expect(m.check(eval('5n'))).to.be.true
    expect(m.check(BigInt(5))).to.be.true

    expect(m.check(5)).to.be.false
    expect(m.check(undefined)).to.be.false
    expect(m.check(null)).to.be.false
    expect(m.check([])).to.be.false
    expect(m.check({})).to.be.false
  })

  it('should match function', () => {
    const m = new AMatcher(Function)

    expect(m.check(() => {})).to.be.true

    expect(m.check(undefined)).to.be.false
    expect(m.check(null)).to.be.false
    expect(m.check([])).to.be.false
    expect(m.check({})).to.be.false
  })

  it('should match object', () => {
    const m = new AMatcher(Object)

    expect(m.check({})).to.be.true
    // eslint-disable-next-line
    expect(m.check(new Object({ m: 5 }))).to.be.true
    expect(m.check([])).to.be.true

    expect(m.check(undefined)).to.be.false
    expect(m.check(null)).to.be.false
  })

  it('should match symbol', () => {
    // eslint-disable-next-line
    const m = new AMatcher(Symbol)

    // eslint-disable-next-line
    expect(m.check(Symbol())).to.be.true

    expect(m.check(undefined)).to.be.false
    expect(m.check(null)).to.be.false
    expect(m.check([])).to.be.false
    expect(m.check({})).to.be.false
  })

  it('should match an array', () => {
    const m = new AMatcher(Array)

    expect(m.check([])).to.be.true

    expect(m.check(5)).to.be.false
    expect(m.check(undefined)).to.be.false
    expect(m.check(null)).to.be.false
    expect(m.check({})).to.be.false
  })

  describe('in expectation', () => {
    it('works with arrays', () => {
      earlExpect([1, 2, 3]).toEqual(earlExpect.a(Array))
    })

    it('works with functions', () => {
      // repro for #178
      earlExpect((v: number) => v + 1).toEqual(earlExpect.a(Function))
    })
  })
})
