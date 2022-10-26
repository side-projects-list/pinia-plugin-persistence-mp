# pinia-plugin-persistence-mp

> 基于[pinia-plugin-persistedstate](https://github.com/prazdevs/pinia-plugin-persistedstate)修改而来

`pinia-plugin-persistence-mp`是 **pinia** 持久化存储插件，适用于[uni-app](https://uniapp.dcloud.net.cn/)、[taro](https://taro.jd.com/)。

## 🚀 快速开始

1. 选择您喜欢的包管理器安装:
   - **pnpm** : `pnpm i pinia-plugin-persistence-mp`
   - npm : `npm i pinia-plugin-persistence-mp`
   - yarn : `yarn add pinia-plugin-persistence-mp`

2. 添加插件到 **pinia** 中:
   ```ts
   // main.ts
   import { createPinia } from 'pinia'
   import { createPersistedState } from 'pinia-plugin-persistence-mp'

   const pinia = createPinia()
   pinia.use(createPersistedState(
     {
       // 全局配置存储操作对象，根据使用的是 uni-app 或 taro 而定
       storage: {
         // uni-app 方式
         setStorageSync: uni.setStorageSync,
         getStorageSync: uni.getStorageSync
       }
     },
   ))

   // taro 方式
   // import {getStorageSync, setStorageSync} from '@tarojs/taro'
   // pinia.use(createPersistedState(
   //    {
   //        // 全局配置存储操作对象
   //        storage: {
   //            setStorageSync,
   //            getStorageSync
   //        }
   //    },
   // ))
   ```

3. 添加 `persist` 选项到您想要持久化存储的 **store** 中:
    ```ts
    // store/counter.ts
    import { defineStore } from 'pinia'
    import { ref } from 'vue'

    export const useCounterStore = defineStore(
      'counter',
      () => {
        const count = ref(0)
        return {
          count
        }
      },
      {
        persist: true
      }
    )
    ```

## 🔧 配置
您可以通过指定持久化属性的选项来配置 **store** 的持久化方式。

```ts
// store/counter.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounterStore = defineStore(
  'counter',
  () => {
    const count = ref(0)
    return {
      count
    }
  },
  {
    persist: {
      storage: {
        // 单个store设置存储操作对象
        setStorageSync: uni.setStorageSync,
        getStorageSync: uni.getStorageSync
      },
      // 指定需要持久化的state
      paths: ['count']
    }
  }
)
```

更多的配置选项说明：[传送门](https://prazdevs.github.io/pinia-plugin-persistedstate/guide/config.html)

---
> ⚠️注意：必须要在全局或单个 store 里设置`persist.storage`为具体的存储操作对象，否则找不到对应的 `setStorageSync` 和 `getStorageSync` 方法。


## ⚠️ 限制

[插件所存在的限制](https://prazdevs.github.io/pinia-plugin-persistedstate/guide/limitations.html)