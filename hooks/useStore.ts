import { NextRouter } from 'next/router'
import Rollbar from 'rollbar'
import create from 'zustand'

interface Store {
  router?: NextRouter
  dom: any
  onboarded: any
  rollbar: Rollbar
  isDropdownOpen: boolean
  setIsDropdownOpen: (isOpen: boolean) => void
}

export const useStore = create<Store>(set => {
  return {
    router: null,
    dom: null,
    onboarded: false,
    rollbar: null,
    isDropdownOpen: false,
    setIsDropdownOpen: (isOpen: boolean) => set(() => ({ isDropdownOpen: isOpen })),
  }
})
