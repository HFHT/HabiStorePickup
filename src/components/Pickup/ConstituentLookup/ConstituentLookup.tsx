import { Navigation, PhoneLookup } from "@/components"
import { MainContext } from "@/contexts"
import { useTheme } from "@/hooks"
import { Stack, Title } from "@mantine/core"
import { useContext, useEffect, useState } from "react"

export function ConstituentLookup({ open }: { open: boolean }) {
    const { state } = useContext(MainContext)
    const { mobile } = useTheme()
    const [autoAdvance, setAutoAdvance] = useState(false)
    useEffect(() => {
        if (!state || !state.donor) return
        setAutoAdvance(true)
    }, [state.donor])

    if (!open) return <></>

    return (
        <Stack gap='xs' p='xs' style={{ minWidth: mobile ? document.documentElement.clientWidth - 90 : '20rem' }}>
            <Title size={22} order={2}>Phone Number</Title>
            <PhoneLookup open={true} disabled={state.phone !== '+1'} />
            <Navigation first={false} autoAdvance={autoAdvance} enable={state.phone !== '+1'} last={!state?.donor} callBack={() => {
                setAutoAdvance(false)
            }} />

        </Stack>
    )
}
