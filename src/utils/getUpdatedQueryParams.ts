/**
 * Обновляет параметры запроса, модифицируя или удаляя параметр 'query'
 *
 * @param {Record<string, any>} currentQuery - Текущие параметры запроса
 * @param {string} [queryValue] - Новое значение для параметра 'query'.
 *                               Если значение пустое или не передано - параметр 'query' будет удалён
 * @returns {Record<string, any>} Новый объект параметров запроса с обновлённым 'query'
 */

export function getUpdatedQueryParams(
  currentQuery: Record<string, any>,
  queryValue?: string,
): Record<string, any> {
  const newQuery = { ...currentQuery }
  if (queryValue) {
    newQuery.query = queryValue
  } else {
    delete newQuery.query
  }
  return newQuery
}
