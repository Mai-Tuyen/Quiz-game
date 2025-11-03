import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
type State = {
  isOpenModalLogin: boolean
  nextUrl: string
}

type Action = {
  setIsOpenModalLogin: (isOpenModalLogin: boolean) => void
  setNextUrl: (nextUrl: string) => void
}

export const useGlobalStore = create<State & Action>()(
  devtools(
    immer((set) => ({
      // initial state
      isOpenModalLogin: false,
      nextUrl: '/',

      // actions
      setIsOpenModalLogin: (isOpenModalLogin) =>
        set((state) => {
          state.isOpenModalLogin = isOpenModalLogin
        }),
      setNextUrl: (nextUrl) =>
        set((state) => {
          state.nextUrl = nextUrl
        })
    }))
  )
)
