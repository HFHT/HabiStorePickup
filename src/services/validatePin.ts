import { fetchJson } from "./fetch"

export async function validatePin(pinInput: string, theDate: string) {
    const header: any = { method: "GET", headers: new Headers() }
    return await fetchJson(`${import.meta.env.VITE_DRIVER_URL}validatePin?pin=${pinInput}&date=${theDate}`, header)

}
