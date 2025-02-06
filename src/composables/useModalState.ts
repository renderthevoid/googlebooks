// useModalState.ts
import { ref } from 'vue';

interface ModalState<T> {
  isVisible: boolean; 
  data?: T;          
}

/**
 * Composable для управления состоянием модальных окон в PrimeVue.
 * @returns Объект с методами и состоянием для работы с диалоговым окном.
 */
export const useModalState = <T = undefined>() => {

  const modalState = ref<ModalState<T>>({
    isVisible: false,
    data: undefined,
  });

  // Метод для открытия диалога
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
    isVisible: modalState.value.isVisible,
    dialogData: modalState.value.data,    
  };
};