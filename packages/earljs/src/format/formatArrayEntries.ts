import { FormatOptions } from './FormatOptions'
import { formatUnknown } from './formatUnknown'
import { getOptionsWith } from './getOptionsWith'

export function formatArrayEntries(
  value: unknown[],
  sibling: unknown,
  options: FormatOptions,
  valueStack: unknown[],
  siblingStack: unknown[],
) {
  const entries: [number, string][] = []

  const passedOptions = getOptionsWith(options, {
    requireStrictEquality: false,
    maxLineLength: options.maxLineLength - 10,
  })

  let empty = 0
  for (let i = 0; i < value.length; i++) {
    if (!value.hasOwnProperty(i.toString())) {
      empty++
    } else {
      if (empty !== 0) {
        entries.push(formatEmpty(empty))
        empty = 0
      }

      const nestedOptions = getOptionsWith(passedOptions, {
        skipMatcherReplacement:
          passedOptions.skipMatcherReplacement ||
          (!!sibling && !Object.prototype.hasOwnProperty.call(sibling, i.toString())),
      })

      const valueFormat = formatUnknown(
        (value as any)[i],
        (sibling as any)?.[i],
        nestedOptions,
        valueStack,
        siblingStack,
      )
      for (const line of valueFormat) {
        line[0] += 1
      }
      entries.push(...valueFormat)
    }
  }
  if (empty !== 0) {
    entries.push(formatEmpty(empty))
  }
  return entries
}

function formatEmpty(empty: number): [number, string] {
  if (empty === 1) {
    return [1, '<empty>']
  } else {
    return [1, `<${empty} empty items>`]
  }
}
