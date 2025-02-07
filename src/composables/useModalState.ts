import { computed, ref } from 'vue';

interface ModalState<T> {
  isVisible: boolean;
  data?: T;
}

export const useModalState = <T = Book | undefined>() => {
  const modalState = ref<ModalState<T>>({
    isVisible: false,
    data: undefined,
  });

  const openModal = (data?: T) => {
    modalState.value = {
      isVisible: true,
      data: data || undefined,
    };
  };

  const closeModal = () => {
    modalState.value = {
      isVisible: false,
      data: undefined,
    };
  };

  return {
    modalState,
    openModal,
    closeModal,
    isVisible: computed(() => modalState.value.isVisible),
    dialogData: computed(() => modalState.value.data),
  };
};
