import { fetchJson } from "."

export type SchedulerAPIType = {
    _id: string | undefined
    appt_fk: number | undefined
    cmds: SchedulerAPICmdsType[]
}
type SchedulerAPICmdsType = {
    cmd: 'addPickup',
    route?: string | undefined,
    jsonValue?: any
    //addPickup - {_id: phone, constituent, donation, schedDate: YYYY-MM-DD, note: string, source: 'donor' }
}
export async function schedulerAPI(props: SchedulerAPIType) {
    console.log(props)
    const options = {
        method: "PUT",
        headers: new Headers(),
        body: JSON.stringify(props)
    }
    console.log(options)
    // return 
    return await fetchJson(`${import.meta.env.VITE_SCHEDULER_URL}SchedulerAPI`, options)
}
