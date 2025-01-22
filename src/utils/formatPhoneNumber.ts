export function formatPhoneNumber(phoneNumber: string | undefined) {
    if (!phoneNumber) return null
    const cleaned = ('' + phoneNumber).replace(/\D/g, '')
    const match = cleaned.match(/^(\d{1,1})(\d{1,3})(\d{1,3})(\d{1,4})$/)
    if (match) {
        return `(${match[2]}) ${match[3]}-${match[4]}`
    }
    return null
}
