import { type DirectiveBinding } from 'vue'

declare global {
  interface HTMLElement {
    __infiniteScrollObserver__?: IntersectionObserver
  }
}
/**
 * Кастомная Vue-директива `v-intersection` для обнаружения пересечения элемента с областью просмотра.
 *
 * Использование:
 * ```vue
 * <div v-intersection="onIntersect"></div>
 * ```
 *
 * @example
 * ```vue
 * <div v-intersection="loadMore"></div>
 * ```
 *
 * @type {Object}
 */

const intersectionDirective = {
  /**
   * Вызывается при монтировании элемента.
   * Создаёт `IntersectionObserver` для отслеживания видимости элемента.
   *
   * @param {HTMLElement} el - Целевой элемент, к которому применяется директива.
   * @param {DirectiveBinding<() => void>} binding - Объект привязки, содержащий переданное значение (функцию).
   */
  mounted(el: HTMLElement, binding: DirectiveBinding<() => void>): void {
    const options: IntersectionObserverInit = {
      rootMargin: '0px',
      threshold: 1.0,
    }

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting) {
        binding.value()
      }
    }

    const observer = new IntersectionObserver(callback, options)
    observer.observe(el)
    el.__infiniteScrollObserver__ = observer
  },

  unmounted(el: HTMLElement) {
    if (el.__infiniteScrollObserver__) {
      el.__infiniteScrollObserver__.disconnect()
      delete el.__infiniteScrollObserver__
    }
  },
}

export default intersectionDirective
