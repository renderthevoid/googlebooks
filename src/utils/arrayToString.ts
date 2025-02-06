/**
 * Преобразует массив строк в одну строку, разделяя элементы запятой и пробелом.
 *
 * @param {string[]} arr - Массив строк.
 * @returns {string} Строка, содержащая элементы массива, разделенные `", "`. Если массив пустой или `undefined`, возвращает пустую строку.
 */

export const arrayToString = (arr: string[]) => arr?.map((item) => item.toString()).join(', ')


