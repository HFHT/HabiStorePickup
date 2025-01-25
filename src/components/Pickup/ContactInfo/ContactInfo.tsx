import { GoogleAutocomplete } from "@/components"
import { Navigation } from "@/components/Controls"
import { MainContext } from "@/contexts"
import { useConstituent, useTheme } from "@/hooks"
import { schedulerAPI } from "@/services"
import { theDate, uniqueKey } from "@/utils"
import { Button, Grid, Modal, Stack, Text, Textarea, TextInput, Title } from "@mantine/core"
import { IconEdit } from "@tabler/icons-react"
import { useContext, useState } from "react"
import PhoneInput from "react-phone-input-2"

export function ContactInfo({ open }: { open: boolean }) {
  const { state, dispatch } = useContext(MainContext)
  const [advance, setAdvance] = useState(false)
  if (!open) return <></>

  const mapFields = (formValues: any, donationId: number) => {
    return {
      anonymous: false,
      name: {
        first: formValues.firstName,
        last: formValues.lastName,
        company: formValues.company
      },
      phone: formValues.phone,
      email: formValues.email,
      zip: formValues.zip,
      place: { ...state.donor.donor.place, address2: formValues.address2 },
      donations: [donationId, ...state.donor.donor.donations]
    }
  }
  const mapDonation = (donation: any, photos: any, formValues: any, donationId: number) => {
    return {
      _id: donationId,
      _donorKey: formValues.phone,
      date: theDate(),
      driverNote: '',
      note: formValues.note,
      source: 'donor',
      type: 'pickup',
      delivery: {items: [], imgs: []},
      pickup: {
        items: [...donation],
        imgs: [...photos]
      },
      cancelled: false,
      completed: false
    }
  }

  return (
    <Stack gap='xs' pt={6} pb={6} pl={0} pr={0}>
      <Title size={22} order={2}>Contact Information</Title>
      <EditPage open={state.donor} />
      <Navigation first={false} enable={true} last={true} autoAdvance={advance} callBack={() => {
        setAdvance(false)
      }} />

    </Stack>
  )

  function EditPage({ open }: { open: boolean }) {
    const { form, addressOpen, setAddressOpen } = useConstituent()
    const { mobile } = useTheme()
    if (!open) return <></>

    return (<>
      <form >
        <fieldset disabled={false}>
          <Grid grow justify="space-between" align="center" >
            <Grid.Col span={6}>
              <TextInput label="First Name" placeholder="First Name..." size='sm' withAsterisk
                key={form.key('firstName')}
                {...form.getInputProps('firstName')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Last Name" placeholder="Last Name..." size='sm' withAsterisk
                key={form.key('lastName')}
                {...form.getInputProps('lastName')}
              />
            </Grid.Col>
          </Grid>
          <Grid grow justify="space-between" align="center">
            <Grid.Col span={2}>
              <div className='pickphone'>
                <PhoneInput country={'us'} value={form.getValues().phone} inputClass='pickphoneinput' placeholder='Phone'
                  onChange={(p: any) => form.setFieldValue('phone', p)}
                />
              </div>
            </Grid.Col>
            <Grid.Col span={2}>
              <TextInput label="Zipcode" size='sm' placeholder="#####" withAsterisk
                key={form.key('zip')}
                {...form.getInputProps('zip')}
              />
            </Grid.Col>
            <Grid.Col span={mobile ? 10 : 4}>
              <TextInput label="Company Name" size='sm' placeholder="Company name..."
                key={form.key('company')}
                {...form.getInputProps('company')}
              />
            </Grid.Col>
          </Grid>
          <Grid grow justify="space-between" align="center" >
            <Grid.Col span={7}>
              <TextInput label="Email" size='sm' placeholder="Email"
                key={form.key('email')}
                {...form.getInputProps('email')}
              />
            </Grid.Col>
            <Grid.Col span={5}>
              <TextInput label="Address2" size='sm' placeholder="Suite, Lot, Apt..."
                key={form.key('address2')}
                {...form.getInputProps('address2')}
              />
            </Grid.Col>
          </Grid>
          <Grid grow justify="space-between" align="center" >
            <Address haveAddress={state && state.donor && state.donor.donor && state.donor.donor.place && state.donor.donor.place.addr ? true : false} />
          </Grid>
          <Grid grow justify="space-between" align="center" >
            <Grid.Col span={12}>
              <Textarea size="sm" label="Note: Gate code, item location, etc." autosize minRows={1}
                placeholder="Note..."
                key={form.key('note')}
                {...form.getInputProps('note')}
              />
            </Grid.Col>
          </Grid>
          <div className='pad-below' />
        </fieldset>

      </form>
      <Button disabled={!state.donor}
        onClick={() => {
          const donationId = uniqueKey()
          dispatch({ type: 'saveForm', payload: { ...mapFields(form.getValues(), donationId), note: form.getValues().note } })
          schedulerAPI({
            _id: form.getValues().phone!,
            appt_fk: undefined,
            cmds: [
              {
                cmd: 'addPickup',
                jsonValue: {
                  constituent: mapFields(form.getValues(), donationId),
                  donation: mapDonation(state.donation.map((dm) => ({ qty: dm.qty, prod: dm.prod })), state.photos.map((pm) => pm.uniqueName), form.getValues(), donationId),
                  schedDate: state!.selected!.date,
                  source: 'donor'
                }
              }
            ]
          })
          // setAdvance(true)
        }} >
        Submit
      </Button >
      <Modal opened={addressOpen} size={mobile ? 'md' : 'lg'} withCloseButton title="Address Lookup" onClose={() => {
        setAddressOpen(false)
        console.log('close!')
      }} >
        <GoogleAutocomplete placeholder={'Address'} className={'pad-above-md'}
          callBack={(e: any) => {
            console.log(e);
            setAddressOpen(false)
            dispatch({ type: 'setDonorPlace', payload: e })
            form.setFieldValue('address', e.formatted)
          }} />
      </Modal >
    </>
    )
    function Address({ haveAddress }: { haveAddress: boolean }) {
      return (
        <>
          {haveAddress ?
            <>
              <Grid.Col span={9}>
                <Textarea size="sm" label="Address" autosize minRows={1} readOnly={true}
                  key={form.key('address')}
                  {...form.getInputProps('address')}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <Button size='sm' className='edit-btn' leftSection={<IconEdit size={20} />} variant="outline" mt='lg'
                  disabled={state && state.donor && state.donor.donor && state.donor.donor.place && state.donor.donor.place.addr ? false : true}
                  aria-label="Click to edit the address."
                  onClick={() => { setAddressOpen(true) }} />
              </Grid.Col>
            </>
            :
            <Grid.Col span={12}>
              <GoogleAutocomplete placeholder={'Address'} className={'pad-above-md'}
                callBack={(e: any) => {
                  console.log(e);
                  setAddressOpen(false)
                  dispatch({ type: 'setDonorPlace', payload: e })
                  form.setFieldValue('address', e.formatted)
                }} />
            </Grid.Col>
          }
        </>
      )
    }
  }
}
