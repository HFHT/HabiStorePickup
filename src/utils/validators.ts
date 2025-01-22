export const isValue = (v: any) => {
    if (v === undefined || v === '' || v === 'None' || v === null) return null
    return v
}
export function isZip(zip: string | null): boolean {
    return !(/^\d{5}(?:[-\s]\d{4})?$/.test(zip === null ? '' : zip))
}
export function isEmail(email: string | null): boolean {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email === null ? '' : email)
}

export function isPhone(phone: string | number | null | undefined) {
    if (phone === null || phone === undefined) return false
    let cleaned = cleanPhone(phone.toString())
    if (cleaned === null || cleaned.length !== 11) return false
    return true
}

export const cleanPhone = (phone: string | null) => {
    if (phone === undefined || phone === null) return null
    // Filter only numbers from the input
    let cleaned = ('' + phone).replace(/\D/g, '');

    // Check if the input is of the correct format
    let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match === null) return null
    return [match[1], match[2], match[3], match[4]].join('');
}
export function numberOrNull(value: any): number | null {
    return (typeof value === 'number') ? value : null
}
export function stringOrBlank(value: any): string {
    return (typeof value === 'string') ? value : ''
}