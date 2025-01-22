import { MainContext } from "@/contexts";
import { theDate } from "@/utils";
import { useContext } from "react";

export function useZipCode() {
    const { state, dispatch, zipAvailability } = useContext(MainContext)

    const selectZip = (selectedZip: string | undefined | null) => {
        if (!zipAvailability) return
        if (selectedZip === undefined || selectedZip === null) {
            dispatch({ type: 'setZipCode', payload: undefined })
            return
        }
        if (selectedZip.length === 5) {
            const available = zipAvailability.find((zf) => (zf.zip === selectedZip))
            if (!available) return
            const availableDates = available.dates.filter((adf) => (!adf.full))
            dispatch({ type: 'setZipCode', payload: { zip: selectedZip, available: [...availableDates], note: available.notes } })
            return
        }
        dispatch({ type: 'setZipCode', payload: { zip: selectedZip } })
    }
    const excludeDates = (date: any) => {
        if (!(state && state.selected && state.selected.available)) return true
        let dateMatch = state.selected.available.filter((zf) => zf.date === theDate(date))
        return dateMatch.length === 0
    }
    const selectDate = (date: any) => {
        if (!(state && state.selected && state.selected.available)) return
        dispatch({ type: 'setZipCode', payload: { ...state.selected, date: date } })
    }

    const availableDates = (selectedZip: string | undefined | null) => {
        if (!zipAvailability) return []
        let available = zipAvailability.find((zf) => (zf.zip === selectedZip))
        if (!available) return []
        return available.dates.filter((adf) => (!adf.full)).map((dm) => (dm.date))
    }

    return { state, dispatch, selectZip, selectDate, excludeDates, availableDates } as const
}

export type ZipAvailability = {
    zip: string
    notes: string
    dates: ZipDates[]
}
export type ZipDates = {
    date: string
    dow: number
    totalPickups: number
    stops: number
    blocks: number
    remaining: number
    full: boolean
}