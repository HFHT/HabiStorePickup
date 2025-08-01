import { Navigation } from "@/components/Controls"
import { MainContext } from "@/contexts"
import { formatPhoneNumber, uniqueKey } from "@/utils"
import { Anchor, Button, Divider, Flex, Image, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { useContext, useState } from "react"
import { schedulerAPI } from "@/services"
import { usePrint_Email } from "@/hooks"

export function Confirmation({ open }: { open: boolean }) {
    const { state, templates, uuid } = useContext(MainContext)
    const { email, isBusy } = usePrint_Email()

    const [advance, setAdvance] = useState(false)

    if (!open || !state || !state.selected || !state.donation || !state.donor || !state.donor.donor) return <></>
    const templateFields = (type: 'print' | 'email') => {
        const address2 = () => {
            if (state.donor.donor.place.address2) {
                return ` - ${state.donor.donor.place.address2}`
            }
            return ''
        }
        return {
            DATE: state && state.selected && state.selected.date ? state.selected.date : '',
            NAME: `${state.donor.donor.name.first} ${state.donor.donor.name.last}`,
            COMPANY: state.donor.donor.company || '',
            ADDRESS: `${state.donor.donor.place.num} ${state.donor.donor.place.route} ${address2()}`,
            CITY: state.donor.donor.place.city,
            STATE: state.donor.donor.place.state,
            ZIP: state.donor.donor.place.zip,
            PHONE: formatPhoneNumber(state.donor.donor.phone) || '',
            EMAIL: state.donor.donor.email || '',
            NOTE: state.donor.donor.note || '',
            ITEMS: state.donation.map((item) => `${item.prod}(${item.qty})`).join(', '),
        }
    }
    return (
        <>
            <Stack gap={2} >
                <Stack gap={2} p='xs' align='center' justify='center'>
                    <Title size={24} order={2}>Confirmation</Title>
                    <Text size='md' >Pickup scheduled for: {state.selected.date}</Text>
                </Stack>
                <Divider />
                <Stack gap={2} p='xs' >
                    <Text size='sm'>{`${state.donor.donor.name.first} ${state.donor.donor.name.last}`}</Text>
                    {state.donor.donor.name.company && <Text size='sm'>{state.donor.donor.name.company}</Text>}
                    <Text size='sm'>{state.donor.donor.place.addr}</Text>
                    {state.donor.donor.place.address2 && <Text size='sm'>{state.donor.donor.place.address2}</Text>}
                    <SimpleGrid cols={2}>
                        <Text size='sm'>{formatPhoneNumber(state.donor.donor.phone)}</Text>
                        <Text size='sm'>{state.donor.donor.email}</Text>
                    </SimpleGrid>
                    {state.donor.donor.note && <Text size='sm'>{`Note: ${state.donor.donor.note}`}</Text>}
                </Stack>
                <Divider />
                <Stack gap={2} p='xs' >
                    <Text size='sm' pb='xs'>Donation: {state.donation.map((item) => `${item.prod}(${item.qty})`).join(', ')}</Text>
                    <Flex gap={2} wrap='wrap'>
                        {state.photos.map((photo) => <Image key={uniqueKey()} src={photo.url} h={80} w={80} fit='contain' />)}
                    </Flex>
                </Stack>
                {uuid &&
                    <Flex gap={2} p='xs' >
                        <Text size='xs'>
                            You can view or update your donations at any time by visiting the
                            <Anchor target='habistore' href={`${import.meta.env.VITE_PICKUP_DONOR_URL}?uuid=${uuid}`} size='xs' > HabiStore Donations page.</Anchor>
                        </Text>
                    </Flex>
                }
                <Button disabled={!state.donor}
                    loading={isBusy}
                    onClick={() => {
                        setAdvance(true)
                        schedulerAPI({
                            _id: state.donor.donor.phone!,
                            appt_fk: undefined,
                            cmds: [
                                {
                                    cmd: 'addPickup',
                                    jsonValue: {
                                        constituent: state.donor.donor,
                                        donation: state.donor.donations,
                                        schedDate: state!.selected!.date,
                                        source: 'donor'
                                    }
                                }
                            ]
                        })
                        
                        if (templates && state && state.selected && state.selected.date) {
                            email(templates.find((tf) => tf._id === 'storePickupEmailConfirmation'), state.donation, state.photos, templateFields('email'), { to: state.donor.donor.email, subject: 'HabiStore donation pickup appointment.' })
                        }
                    }} >
                    Submit
                </Button >
                {!isBusy && <Navigation first={false} last={true} autoAdvance={advance} />}
            </Stack >
        </>
    )
}
