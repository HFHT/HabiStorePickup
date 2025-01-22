import { useState } from "react"
import { getApptsforDay } from "@/services"
import { theDate } from "@/utils"

export function useGetApptsforDay() {
    const [both, setBoth] = useState<SchedAndApptsType | undefined>()
    const [isBusy, setIsBusy] = useState(false)
    // const { showBoundary } = useErrorBoundary()

    async function fetchMongo(_id: string) {
        try {
            setIsBusy(true)
            const retVal = await getApptsforDay({ query: { _id: theDate(_id) } })
            if (retVal.err) {
                console.warn('getApptForDay error:', retVal.error)
            } else {
                setBoth(retVal)
            }
            setIsBusy(false)
        } catch (error) {
            setIsBusy(false)
            // showBoundary(error)
        }
    }
    return [both, fetchMongo, isBusy] as const
}

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



// export type SchedulerDonorDonationType =
//     SchedulerDonorType & { donation?: SchedulerDonationType }
