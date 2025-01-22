import { useForm } from "@mantine/form"
import { isEmail, isPhone, isZip } from "@/utils"
import { useContext, useEffect, useState } from "react"
import { MainContext } from "@/contexts"

export function useConstituent() {
    const { state, uuid } = useContext(MainContext)
    const [addressOpen, setAddressOpen] = useState(false)
    const initialValues: FormValuesType = { firstName: '', lastName: '', phone: '+1', company: '', email: '', zip: '', address: '', address2: '', note: '' }

    useEffect(() => {
        if (!state) return
        let theValues = { ...initialValues }
        if (state.donor && state.donor.donor) {
            theValues = {
                firstName: state.donor.donor.name.first || '',
                lastName: state.donor.donor.name.last || '',
                phone: state.donor.donor.phone || '+1',
                company: state.donor.donor.name.company || '',
                email: state.donor.donor.email || '',
                zip: state.donor.donor.zip || '',
                address: state.donor.donor.place.addr || '',
                address2: state.donor.donor.place.address2 || '',
                note: state.donor.donor.note || ''
            }
        } else {
            theValues = {...theValues, phone: state.phone || '+1'}
        }
        form.setValues({ ...theValues })
    }, [state.donor])

    const form = useForm({
        mode: 'uncontrolled',
        // onValuesChange: (values) => {
        //     // setFormChanged(form.isTouched() && form.isDirty());
        //     // setDonationChanged(form.isTouched('donations') && form.isDirty('donations'))
        //     console.log('FORM!!!!', form.isTouched(), form.isDirty(), form.isTouched('donations'), form.isDirty('donations'))
        //     form.resetDirty()
        // },
        validateInputOnChange: true,
        initialValues: initialValues,
        validate: {
            firstName: (value) => (value === null || value === '' ? 'First name required' : null),
            lastName: (value) => (value === null || value === '' ? 'Last name required' : null),
            email: (value) => ((value === '' || isEmail(value)) ? null : 'Invalid email'),
            phone: (value) => (isPhone(value) ? null : 'Invalid phone'),
            zip: (value) => (isZip(value) ? 'Zip must have 5 characters' : null),
            address: (value) => (value === null || value === '' ? 'Address required' : null)
        },
    })

    return { form, addressOpen, setAddressOpen } as const
}

export type FormValuesType = {
    firstName: string | null
    lastName: string | null
    phone: string | null
    company: string | null
    email: string | null
    zip: string | null
    address: string | null
    address2: string | null
    note: string | null
}

//The following types are from the MongoDB schema for the Scheduler.
export type SchedAndApptsType = {
    schedDate: SchedulerDateType | undefined
    appts: SchedulerApptType[] | []
    donors: SchedulerDonorType[] | []
    donations: SchedulerDonationType[] | []
    joined: StopDetailJoined | undefined
}
export type SchedulerDateType = {
    _id: string                                                     // Date string YYYY-MM-DD
    archive: boolean
    block: string[]
    waitlist: string[]
    stops: SchedulerStopType[]
    cancelled: SchedulerStopType[] | undefined
}
export type SchedulerStopType = {
    a_id: number                                                    // SchedulerAppt foreign key -> link to _donorKey
    d_id: number                                                    // donation Id within SchedulerDonation
    route: string
    size: number
    order: number
    type: 'pickup' | 'delivery'
    source: 'scheduler' | 'web' | 'online'
    status: SchedulerStopStatusType
}
export type SchedulerStopStatusType = {
    code: 'open' | 'completed' | 'cancelled' | 'resched' | 'moved'
    date: string
    by: string
}

export type SchedulerApptType = {
    _id: number                                                     // Unique number
    _donorKey: string                                               // phone number -> key for SchedulerDonor and SchedulerDonation
    donationId: number                                              // donation Id within SchedulerDonation           
    calls: SchedulerApptCallType[]
}
export type SchedulerApptCallType = {
    dt: string
    note: string
}


export type SchedulerDonorType = {
    _id: string | undefined                                         // phone number 
    anonymous: boolean                                              // anonymous donor, _id will be 'anonymous'
    name: SchedulerDonorNameType
    email: string
    zip: string
    phone: string
    place: SchedulerDonorPlaceType
    shopify_id?: number | undefined
    donations: number[]                                              // Array of SchedulerDonation id
}
export type SchedulerDonorNameType = {
    first: string
    last: string
    company: string
}
export type SchedulerDonorPlaceType = {
    addr: string | null
    address2?: string | null | undefined
    latitude?: number | undefined
    longitude?: number | undefined
    lat: number | null
    lng: number | null
    num: string | null
    route: string | null
    city: string | null
    state: string | null
    c_cd: string | null
    c_nm: string | null
    zip: string | null
}

export type SchedulerDonationType = {
    _id: number | undefined
    _donorKey: string | undefined
    date: string
    driverNote: string
    note: string
    source: 'scheduler'
    type: 'pickup' | 'delivery' | undefined
    pickup: {
        items: SchedulerDonationItemType[]
        imgs: string[]
    }
    delivery: {
        items: SchedulerDonationItemType[]
        imgs: string[]
    }
    proof?: string[] | undefined
    cancelled: boolean
    completed: boolean
}

export type SchedulerDonationItemType = {
    prod: string
    qty: string
    c?: boolean
}

export type StopDetailJoined = {
    appt: SchedulerApptType | undefined,
    donor: SchedulerDonorType | undefined,
    donation: SchedulerDonationType | undefined
    stopNumber?: number | undefined
}