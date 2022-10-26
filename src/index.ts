import type { PiniaPlugin, PiniaPluginContext, StateTree, Store, SubscriptionCallbackMutation } from 'pinia'
import normalizeOptions from './normalize'
import pick from './pick'

import type {
  PersistedStateFactoryOptions,
  StorageLike,
} from './types'

function hydrateStore(store: Store, storage: StorageLike, key: string, debug: boolean) {
  try {
    const fromStorage = storage?.getStorageSync(key)
    if (fromStorage)
      store.$patch(fromStorage)
  }
  catch (err) {
    if (debug)
      console.error(err)
  }
}

export function createPersistedState(factoryOptions: PersistedStateFactoryOptions = {}): PiniaPlugin {
  return (context: PiniaPluginContext) => {
    const { options: { persist }, store } = context

    if (!persist)
      return

    const persistenceList = (
      Array.isArray(persist)
        ? persist.map(
          p => normalizeOptions(p, factoryOptions),
        )
        : [normalizeOptions(persist, factoryOptions)]
    ).map((
      {
        storage,
        beforeRestore = null,
        afterRestore = null,
        key = store.$id,
        paths = null,
        debug = false,
      },
    ) => ({
      storage,
      beforeRestore,
      afterRestore,
      key,
      paths,
      debug,
    }))

    persistenceList.forEach((persistence) => {
      const { storage, key, paths, beforeRestore, afterRestore, debug } = persistence

      beforeRestore?.(context)

      hydrateStore(store, storage!, key, debug)

      afterRestore?.(context)

      store.$subscribe((
        _mutation: SubscriptionCallbackMutation<StateTree>,
        state: StateTree,
      ) => {
        try {
          const toStore = Array.isArray(paths) ? pick(state, paths) : state

          storage!.setStorageSync(key, toStore)
        }
        catch (err) {
          if (debug)
            console.error(err)
        }
      }, { detached: true })

      store.$hydrate = ({ runHooks = true } = {}) => {
        persistenceList.forEach((persistence) => {
          const { beforeRestore, afterRestore, storage, key, debug } = persistence

          if (runHooks)
            beforeRestore?.(context)
          hydrateStore(store, storage!, key, debug)
          if (runHooks)
            afterRestore?.(context)
        })
      }
    })
  }
}
