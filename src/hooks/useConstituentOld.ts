import { useContext, useState } from "react"
import { useErrorBoundary } from "react-error-boundary"
import { getConstituent, putScheduleDates } from "../services"
import { GoogleAddressType, SchedulerFunctionReturnType, SchedulerDonationType, SchedulerDonationItemType } from "../types"
import { putConstituent, putConstituentCmdType } from "../services/constituent/putConstituent"
import { ControlsContext, MainContext, NotificationsContext, ScheduleContext, SchedulerControlsEditType, SignalContext } from "../context"
import { dateFormat, getAddressComponent, imageObjectToString, uniqueKey } from "../utils"
import { ItemListType, useNotification } from "."
import { ImagesType } from "../components"
import { APPOINTMENT_INIT, SCHEDULE_DONATION_BASE, SCHEDULE_DONATION_ITEMS_IMGS } from "../constants";
import dayjs from "dayjs";


export function useConstituent() {
    const { setMessage } = useContext(MainContext)
    const { signalAppointment, signalCustomer } = useContext(SignalContext)
    const { dispatch: dispatchNotification } = useContext(NotificationsContext)
    const { dispatch, fetchBoth } = useContext(ScheduleContext)
    const { controlsPlace, controlsDate } = useContext(ControlsContext)
    const { updateNotification } = useNotification()

    const [constituent, setConstituent] = useState<SchedulerFunctionReturnType | undefined>()
    const [isBusy, setIsBusy] = useState(false)
    const { showBoundary } = useErrorBoundary()

    const donationKeys = (isNew: boolean, donorKey: string, donation: any) => {
        if (!isNew) return { ...donation }
        return {
            ...SCHEDULE_DONATION_BASE, _donorKey: donorKey, _id: uniqueKey(), date: dateFormat(controlsDate)

            // ...SCHEDULE_DONATION_BASE, type: 'pickup', _donorKey: donorKey, _id: uniqueKey(), date: dateFormat(controlsDate)
        }
    }
    const addOrUpdate = (cmdAdd: putConstituentCmdType, cmdUpdate: putConstituentCmdType): putConstituentCmdType => {
        if (signalCustomer === undefined) {
            console.warn('addOrUpdate-signalCustomer: is undefined')
            return 'NoOp'
        }
        return signalCustomer.newDonation ? cmdAdd : cmdUpdate
    }
    const itemsAndImgages = (type: SchedulerDonationType['type'] | undefined, items: ItemListType[] | undefined, imgs: ImagesType[] | undefined) => {
        console.log('itemsAndImage', type, items, imgs)
        if (type === undefined) {
            console.warn('useConstituent-itemsAndImages: type is undefined.')
            return {}
        }
        const theItems = items !== undefined ? [...items] : []
        if (type === 'pickup') return { pickup: { items: [...theItems], imgs: imageObjectToString(imgs) }, delivery: SCHEDULE_DONATION_ITEMS_IMGS }
        return { delivery: { items: [...theItems], imgs: imageObjectToString(imgs) }, pickup: SCHEDULE_DONATION_ITEMS_IMGS }
    }
    const fetchConstituent = async (find: any) => {
        try {
            setIsBusy(true)
            setConstituent(
                (
                    await getConstituent(find)
                )
            )
            setIsBusy(false)
        } catch (error) {
            setIsBusy(false)
            showBoundary(error)
        }
    }

    const updateConstituent = async (_id: string | undefined, formValues: any, donationChanged: boolean, itemList: ItemListType[] | undefined, imgs: ImagesType[] | undefined) => {
        //new donation and/or new donor create new _id and foreign creates
        console.log('updateConstituent', imgs, donationChanged, _id, formValues, signalCustomer, controlsPlace, itemList)
        // if (!_id) return
        if (signalCustomer === undefined) {
            console.warn('updateConstituent-signalCustomer: is undefined')
            return
        }
        const removeControlFlags = (theConstituent: any) => {
            const flags = ['donation', 'enable', 'allowSave', 'newDonation', 'new', 'notificationId', '_id']
            flags.forEach((tf) => {
                if (theConstituent[tf] !== undefined) {
                    delete theConstituent[tf]
                }
            })
        }
        const theDonorId = _id ? _id : formValues.phone
        let placeUpdate = formatPlace(controlsPlace, signalCustomer, formValues.address2)
        let constituent = {
            ...signalCustomer,
            name: { first: formValues.firstName, last: formValues.lastName, company: formValues.company },
            email: formValues.email,
            phone: formValues.phone,
            zip: formValues.zip,
            place: { ...placeUpdate }
        }

        removeControlFlags(constituent)

        let donations = {
            ...donationKeys(signalCustomer.newDonation, theDonorId, signalCustomer.donation),
            driverNote: formValues.driverNote,
            note: formValues.note,
            type: signalCustomer.donation.type,
            ...itemsAndImgages(signalCustomer.donation.type, itemList, imgs)
        }
        console.log(donations)
        if (signalCustomer.newDonation) {
            constituent.donations = [donations._id, ...constituent.donations]
        }
        let apptKey = uniqueKey()
        let resp = await putConstituent({
            _id: theDonorId,
            cmds: [
                { cmd: addOrUpdate('add', 'update'), jsonValue: { ...constituent } },
                { cmd: addOrUpdate('addDonation', 'updateDonation'), jsonValue: { ...donations } },
                { cmd: addOrUpdate('addAppointment', 'NoOp'), jsonValue: { ...APPOINTMENT_INIT, _id: apptKey, _donorKey: theDonorId, donationId: donations._id } }
            ]
        })
        if (signalCustomer.newDonation) {
            if (signalAppointment) {
                let resp1 = await putScheduleDates({
                    _id: dayjs(signalAppointment.date).format('YYYY-MM-DD'),
                    moveToDate: undefined,
                    cmds: [
                        {
                            cmd: 'add',
                            jsonValue: {
                                a_id: apptKey,
                                d_id: donations._id,
                                route: signalAppointment.route,
                                size: signalAppointment.size,
                                order: (signalAppointment.slot ? signalAppointment.slot : 18) * 100,
                                source: 'scheduler',
                                type: signalCustomer?.donation?.type,
                                status: { code: 'open', date: '', by: '' }
                            }
                        }
                    ]
                })
                resp1.err && console.warn(resp1)
                fetchBoth(dateFormat(controlsDate))
            } else {
                console.warn('useConstituent-newDonation: undefined Appointment signal')
            }
        }
        if (resp.err) {
            console.warn(resp)
        } else {
            let donationType = signalCustomer?.donation?.type
            dispatch({ type: 'updateDonor', payload: { ...resp.data.donor } })
            dispatch({ type: 'updateDonation', payload: { ...resp.data.donation } })
            dispatchNotification({ type: 'set', payload: [...resp.data.notifications] })
            if (signalCustomer.notificationId !== undefined) {
                updateNotification(
                    {
                        _id: signalCustomer.notificationId,
                        appt_fk: undefined,
                        cmds: [
                            { cmd: 'completed', jsonValue: true },
                        ]
                    },
                    signalCustomer.name
                )
                dispatch({ type: 'markComplete', payload: { _id: signalCustomer.notificationId } })

            }
            // donations && donationType && dispatch({ type: 'updateImages', payload: { _id: signalCustomer?.donation?._id, imgs: [...donations[donationType]!.imgs] } })
            setMessage({ title: 'Donor record updated.', detail: `Donor record for ${formValues.firstName} ${formValues.lastName} was updated.`, color: 'green' })
        }
        console.log(resp)

    }
    return { constituent, fetchConstituent, updateConstituent, isBusy } as const
}

export const formatPlace = (thePlace: GoogleAddressType, controlsEdit: SchedulerControlsEditType | undefined, addr2: string) => {
    //if place is undefined or hasn't changed then just return original place with an updated address2.
    if (!thePlace || thePlace.formatted === controlsEdit?.place.addr) return { ...controlsEdit?.place, address2: addr2 }

    return {
        addr: thePlace.formatted,
        lat: thePlace.location.lat,
        lng: thePlace.location.lng,
        num: getAddressComponent(thePlace.place, 'street_number'),
        route: getAddressComponent(thePlace.place, 'route'),
        city: getAddressComponent(thePlace.place, 'locality'),
        state: getAddressComponent(thePlace.place, 'administrative_area_level_1'),
        c_cd: getAddressComponent(thePlace.place, 'country', true),
        c_nm: getAddressComponent(thePlace.place, 'country'),
        zip: getAddressComponent(thePlace.place, 'postal_code'),
        address2: addr2
    }
}
