import { MainContext } from "@/contexts"
import { fetchSAS, fetchServices } from "@/services"
import { useContext, useEffect, useState } from "react"
import { useCookie } from "@/hooks";

export function useMain() {
    const { dispatch } = useContext(MainContext)
    const [sasToken, setSasToken] = useState<{ url: any; sasKey: any; } | undefined>(undefined)
    const [mode, setMode] = useState<'pickup' | 'returning'>('pickup')
    const [uuid, setUUID] = useState<string | null>(null)
    const [cookie, setCookie] = useCookie('uuid')

    useEffect(() => {
        fetchSasToken()
        const urlSearchString = window.location.search
        const params = new URLSearchParams(urlSearchString)
        // console.log(params.get('uuid'))
        let paramUUID = params.get('uuid')
        if (paramUUID) {
            setCookie(paramUUID, 365)
            setMode('returning')
        } else {
            paramUUID = cookie
        }
        setUUID(paramUUID)
    }, [])

    const fetchSasToken = async () => {
        setSasToken(await fetchSAS())
    }
    const fetchSchedule = async (theDate: string | undefined) => {
        try {
            let retVal = await fetchServices({
                _id: theDate,
                cmds: [
                    { cmd: 'schedDate', jsonValue: {} },
                ]
            })
            if (retVal.err) {
                console.warn('fetchSchedule-error')
            } else {
                dispatch({ type: 'setSchedule', payload: retVal })
            }
        } catch (error) {
            console.warn('fetchSchedule-catch', error)
        }
    }
    return { fetchSchedule, mode, sasToken, uuid } as const
}
