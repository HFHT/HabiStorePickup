export const queryGet = (field: any, defaultValue = {}) => {
    if (field === undefined) return defaultValue
    if (field === null) return defaultValue
    if (field === '') return defaultValue
    return JSON.parse(field)
}