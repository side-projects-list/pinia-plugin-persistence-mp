import { isObject } from './is'
import type {
  PersistedStateFactoryOptions,
  PersistedStateOptions,
} from './types'

export default function normalizeOptions(
  options: boolean | PersistedStateOptions | undefined,
  factoryOptions: PersistedStateFactoryOptions,
): PersistedStateOptions {
  options = isObject(options) ? options : Object.create(null)

  return new Proxy(options as object, {
    get(target, key, receiver) {
      return (
        Reflect.get(target, key, receiver)
          || Reflect.get(factoryOptions, key, receiver)
      )
    },
  })
}
