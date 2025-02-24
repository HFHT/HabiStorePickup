import { GoogleAutocomplete, Navigation, PhoneLookup } from "@/components"
import { MainContext } from "@/contexts"
import { useTheme } from "@/hooks"
import { Stack, Text, Title } from "@mantine/core"
import { useContext, useEffect, useState } from "react"

export function ConstituentLookup({ open }: { open: boolean }) {
    const { state, dispatch } = useContext(MainContext)
    const { mobile } = useTheme()
    const [autoAdvance, setAutoAdvance] = useState(false)

    useEffect(() => {
        if (!state || !state.donor || !state.donor.donor) return
        if (state.donor.donor._id === '') return
        setAutoAdvance(true)
    }, [state.donor])

    if (!open) return <></>

    return (
        <Stack gap='xs' p='xs' style={{ minWidth: mobile ? document.documentElement.clientWidth - 90 : '20rem' }}>
            <Title size={22} order={2}>Phone Number</Title>
            <PhoneLookup open={true} disabled={state.phone !== '+1'} callBack={(constituent) => console.log(constituent)} />
            {state.donor && state.donor.donor && state.donor.donor.place.addr === '' &&
                <GoogleAutocomplete placeholder={'Address'} className={'pad-above-md'}
                    label={<Text size='sm' mt='sm'>Address</Text>}
                    callBack={(e: any) => {
                        console.log(e);
                        dispatch({ type: 'setDonorPlace', payload: e })
                        setAutoAdvance(true)
                    }} />
            }
            <Navigation first={false} autoAdvance={autoAdvance} enable={state.donor && state.donor.donor && state.donor.donor.place.addr !== ''} last={!state?.donor} callBack={() => {
                setAutoAdvance(false)
            }} />

        </Stack>
    )
}
