import { fetchJson } from "."

export const DEFAULT_ZIP = '85705'
export const DEFAULT_DAYS = 45
export const DEFAULT_LOADPCT = 80

export type getZipAvailabilityType = {
    zip?: string
}

export async function getZipAvailability({ zip = DEFAULT_ZIP }: getZipAvailabilityType) {
    const header: any = { method: "GET", headers: new Headers() }
    return await fetchJson(`${import.meta.env.VITE_PICKUP_URL}getZipAvailability?zip=${zip}&days=${DEFAULT_DAYS}&loadPct=${DEFAULT_LOADPCT}`, header)
}