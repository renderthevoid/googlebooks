/**
 * Возвращает новую функцию, которая будет вызывать переданную функцию `fn` только после
 * того, как прошел указанный промежуток времени `delay` с последнего вызова.
 * Все предыдущие вызовы в течение этого времени будут отменены.
 *
 * @param {T} fn - Функция, выполнение которой нужно отложить.
 * @param {number} delay - Время задержки (в миллисекундах), перед тем как вызвать `fn`.
 * @returns {(...args: Parameters<T>) => void} Возвращает новую функцию.
 *
 * @template T - Тип функции, которую вы хотите дебаунсить.
 */
function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>

  return function (...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

export default debounce
