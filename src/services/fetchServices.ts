import { fetchJson } from "./fetch";

export type fetchServicesType = {
    _id?: string | number
    cmds: {
        cmd: 'settings' | 'schedDate',
        jsonValue: any
    }[]
}
export async function fetchServices(props: fetchServicesType) {
    if (props._id === undefined) { console.warn('fetchServices undefined _id'); return }
    const options = {
        method: "PUT",
        headers: new Headers(),
        body: JSON.stringify(props)
    }
    return await fetchJson(`${import.meta.env.VITE_SCHEDULER_URL}fetchServices`, options)

}
