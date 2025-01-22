import { ScheduleStopsType } from "../types";

export function addStopSize(stops: ScheduleStopsType[]) {
    return stops.reduce((total, stop) => { return total + stop.size }, 0)
}

export function addCompleteSize(stops: ScheduleStopsType[]) {
    return stops.reduce((total, stop) => { return total + (stop.status.code === 'completed' ? stop.size : 0) }, 0)
}
