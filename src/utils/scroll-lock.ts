export function lockScroll(id: string, element: HTMLElement = document.body): void {
  if (!element) return
  element.classList.add(`m-scroll-lock-${id}`)
}

export function unlockScroll(id: string, element: HTMLElement = document.body): void {
  if (!element) return
  element.classList.remove(`m-scroll-lock-${id}`)
}