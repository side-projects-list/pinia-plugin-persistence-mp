import type { PiniaPluginContext } from 'pinia'

export type Recordable = Record<string, unknown>

export interface StorageLike {
  getStorageSync: (key: string) => any
  setStorageSync: (key: string, value: any) => void
}

export interface PersistedStateOptions {
  key?: string
  storage?: StorageLike
  paths?: Array<string>
  beforeRestore?: (context: PiniaPluginContext) => void

  afterRestore?: (context: PiniaPluginContext) => void

  debug?: boolean
}

export type PersistedStateFactoryOptions = Pick<
  PersistedStateOptions,
  'storage' | 'afterRestore' | 'beforeRestore' | 'debug'
>

declare module 'pinia' {
  /* eslint @typescript-eslint/no-unused-vars: "off" */
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    persist?: boolean | PersistedStateOptions | PersistedStateOptions[]
  }

  export interface PiniaCustomProperties {
    $hydrate: (opts?: { runHooks?: boolean }) => void
  }
}
