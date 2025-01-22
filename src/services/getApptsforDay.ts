import { fetchJson } from "."

export type getApptsforDayType = {
    query: {}
}
export async function getApptsforDay({ query }: getApptsforDayType) {
    const header: any = { method: "GET", headers: new Headers() }
    return await fetchJson(`${import.meta.env.VITE_SCHEDULER_URL}getApptsForDay?${new URLSearchParams({ find: JSON.stringify(query) })}`, header)
}
