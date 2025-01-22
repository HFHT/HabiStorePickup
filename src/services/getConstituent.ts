import { fetchJson } from "."

export async function getConstituent(phone: string, zip: string) {
    const header: any = { method: "GET", headers: new Headers() }
    return await fetchJson(`${import.meta.env.VITE_PICKUP_URL}getConstituent?phone=${phone}&zip=${zip}`, header)
}
