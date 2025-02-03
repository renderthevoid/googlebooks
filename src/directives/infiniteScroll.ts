import { type DirectiveBinding } from "vue";


declare global {
  interface HTMLElement {
    __infiniteScrollObserver__?: IntersectionObserver;
  }
}

const intersectionDirective = {
  mounted(
    el: HTMLElement,
    binding: DirectiveBinding<() => void>
  ): void {
    const options: IntersectionObserverInit = {
      rootMargin: "0px",
      threshold: 1.0,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting) {
        binding.value();
      }
    };

    const observer = new IntersectionObserver(callback, options);
    observer.observe(el);
    el.__infiniteScrollObserver__ = observer;
  },

  unmounted(el: HTMLElement) {
    if (el.__infiniteScrollObserver__) {
      el.__infiniteScrollObserver__.disconnect();
      delete el.__infiniteScrollObserver__;
    }
  },
};

export default intersectionDirective;