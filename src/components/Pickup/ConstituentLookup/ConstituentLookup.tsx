import { Navigation, PhoneLookup } from "@/components"
import { MainContext } from "@/contexts"
import { Stack, Title } from "@mantine/core"
import { useContext, useEffect, useState } from "react"

export function ConstituentLookup({ open }: { open: boolean }) {
    const { state, dispatch } = useContext(MainContext)
    const [autoAdvance, setAutoAdvance] = useState(false)
    useEffect(() => {
        if (!state || !state.donor) return
        setAutoAdvance(true)
    }, [state.donor])

    if (!open) return <></>

    return (
        <Stack gap='xs' p='xs'>
            <Title size={22} order={2}>Phone Number</Title>
            <PhoneLookup open={true} disabled={state.phone !== '+1'} />
            <Navigation first={false} autoAdvance={autoAdvance} enable={state.phone !== '+1'} last={!state?.donor} callBack={() => {
                setAutoAdvance(false)
            }} />

        </Stack>
    )
}
