export type ZipAvailability = {
    zip: string
    notes: string | undefined | null
    dates: {
        // dt: string
        // total: number
        // open: number
        // isFull: boolean
    }[]
}
export type AppointmentsType = {
    _id: number
    _donorKey: string
    donationId: number
    calls: AppointmentsCallsType[]
}
export type AppointmentsCallsType = {
    dt: string
    note: string
}
export type DonationsType = {
    _id: number
    _donorKey: string
    date: string
    driverNote: string
    note: string
    delivery: {
        items: DonationsItemsType[]
        imgs: string[]
    }
    pickup: {
        items: DonationsItemsType[]
        imgs: string[]
    }
    cancelled: boolean
    completed: boolean
}
export type DonationsItemsType = {
    qty: number
    prod: string
    c?: boolean | undefined
}
export type DonorsType = {
    _id: number | string
    anonymous: boolean
    name: { first: string, last: string, company: string }
    phone: string
    email: string
    zip: string
    place: DonorsPlaceType
    donations: number[]
}
export type DonorsPlaceType = {
    addr: string
    lat: number
    lng: number
    num: string
    route: string
    city: string
    state: string
    c_cd: string
    c_nm: string
    zip: string
    address2: string
}
export type ScheduleDatesType = {
    _id: string
    archive: boolean
    block: string[]
    waitlist: string[]
    stops: ScheduleStopsType[]
    cancelled: ScheduleStopsType[] | undefined
}

export type ScheduleStopsType = {
    a_id: number
    d_id: number
    route: string
    size: number
    order: number
    slot?: number
    _id?: string | undefined
    source: 'scheduler' | 'web' | 'online'
    type: 'pickup' | 'delivery'
    status: {
        code: 'order' | 'status' | 'size' | 'block' | 'archive' | 'completed' | 'calls' | 'move' | 'cancel'
        date: string | Date
        by: string
    }
}
export type SettingsPins = {
    _id: 'Users'
    pins: { pin: string, person: string }[]
}
export type SettingsRoutes = {
    _id: 'routes'
    trucks: any
    routes: any
    online: any
    notes: any
}
export type SettingsHolidays = {
    _id: 'Holidays'
    dates: { date: any, title: any }[]
}
export type TruckType<K> = {
    K: { order: number, pickup: { color: string, loadsize: number[] } }
}

//getCalendarMonth types
export type CalendarMonthType = {
    calendarRows?: number,
    theDate?: any,
    theMonth?: any,
    calendarDays?: CalendarDayType[]
}
export type CalendarDayType = {
    date: string,
    routes?: CalendarRouteType[]
}
export type CalendarRouteType = {
    route: string,
    blocked: boolean,
    fullPct: number,
    // stops: ScheduleDatesStopsType
}
// export type ScheduleDatesStopsType = {
//     'Unassigned': ScheduleStopsType[]
//     'Blue': ScheduleStopsType[]
//     'Red': ScheduleStopsType[]
//     '3rd': ScheduleStopsType[]
//     'Corp': ScheduleStopsType[]
// }

export type ConstituentType = {
    _id: number,
    name: { first: string, last: string, company: string },
    size: number
}

export type NotificationType = {
    _id: string | number | 'control'
    type: NotificationActionType
    _shopifyKey?: number
    donor: DonorsType
    appt: ScheduleStopsType
    appts?: AppointmentsType
    dbResponse?: any[]
    donation: DonationsType
    donations: any[]
    body: string
    by: NotificationUserType
    to: NotificationUserType
    date: string
    completed: boolean
    removed?: boolean | undefined
}


export type NotificationUserType = 'scheduler' | 'driver' | 'constituent' | 'system' | 'cashier'

export type NotificationActionType = 'reschedule' | 'cancel' | 'alert' | 'informational' | 'reminder' | 'newAppointment' | 'newDelivery'

export type ShopifyOrder = {
    body: {
        order: {
            customer: ShopifyOrderCustomer
        }
    }
}

export type ShopifyOrderCustomer = {
    id: number
    email: string | null
    first_name: string | null
    last_name: string | null
    phone: string | null        // +15205551212
    tags?: 'Delivery' | undefined
    default_address?: ShopifyOrderAddress | undefined
}

export type ShopifyOrderAddress = {
    id: number
    customer_id: number
    first_name: string
    last_name: string
    company: string
    address1: string
    address2: string
    city: string
    province: string
    country: string
    zip: string
    phone: string
    name: string
    province_code: string
    country_code: string
    default: boolean
}