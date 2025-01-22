import { MainContext } from "@/contexts";
import { getConstituent } from "@/services";
import { useContext, useEffect, useState } from "react";

export function usePhoneLookup() {
    const { setIsBusy, state, dispatch } = useContext(MainContext)
    const [phone, setThePhone] = useState(state.phone ? state.phone : '')
    const [constituent, setConstituent] = useState(undefined)

    useEffect(() => {
        if (!state || !state.phone) return
        setThePhone(state.phone)
    }, [state.phone])

    const setPhone = async (p: string) => {
        if (p.length === 11) {
            setIsBusy(true)
            let theConstituent = await getConstituent(p, state && state.selected && state.selected.zip ? state.selected.zip : '')
            setConstituent({ ...theConstituent })
            dispatch({ type: 'setDonor', payload: { ...theConstituent } })
            dispatch({ type: 'setPhone', payload: p })
            setIsBusy(false)
        }
        setThePhone(p)
    }
    return { phone, setPhone, state, dispatch }
}
