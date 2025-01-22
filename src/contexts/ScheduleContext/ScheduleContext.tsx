// Deprecated: No longer used.


import { createContext, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useContext, useEffect, useReducer } from 'react';
import { SchedAndApptsType, StopDetailJoined, useGetApptsforDay } from './useGetApptsforDay';
import { SchedulerStopType } from "@/contexts/ScheduleContext/useGetApptsforDay";
import { putAppt, putImage } from '@/services';
import { MainContext } from '../MainContext/MainContext';
import { theDate } from '@/utils';

const initialState: SchedAndApptsType = {
    schedDate: undefined,
    appts: [],
    donors: [],
    donations: [],
    joined: undefined
}
export const ScheduleContext = createContext<ScheduleContextType>({
    state: initialState,
    dispatch: () => { },
    fetchSchedule: () => { },
    joinStopDetail: () => { },
    isBusy: false
});
export type ContextProviderType = {
    children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined,
    props: any
}
export const ScheduleContextProvider = (props: any) => {
    const { state: mainState } = useContext(MainContext)
    const [state, dispatch] = useReducer(reducer, initialState)
    const [both, fetchMongo, isBusy] = useGetApptsforDay()
    useEffect(() => {
        // console.log('ScheduleContextProvider-useEffect-both')
        dispatch({ type: 'set', payload: both })            //Set the reducer state when schedule changes
    }, [both])

    const joinStopDetail = (stopDetail: SchedulerStopType | undefined): StopDetailJoined | undefined => {
        if (!stopDetail) return undefined
        let theAppt = state.appts.find((af) => af._id === stopDetail.a_id)
        // if (!theAppt) { console.warn('StopCard appointment not found', stopDetail, state.appts); return }
        let theDonor = state.donors.find((df) => df._id == theAppt?._donorKey)
        let theDonation = state.donations.find((df) => df._id === stopDetail.d_id)
        // if (!theDonor || !theDonation) { console.warn('StopCard donor or donation not found', stopDetail, state.donors, state.donations); return }
        return { appt: theAppt, donor: theDonor, donation: theDonation }
    }
    return (
        <ScheduleContext.Provider value={{
            state: state,
            dispatch: dispatch,
            fetchSchedule: fetchMongo,
            joinStopDetail: joinStopDetail,
            isBusy: isBusy
        }}>
            {props.children}
        </ScheduleContext.Provider>
    )

    function reducer(state: SchedAndApptsType, action: ScheduleContextStateActionType): SchedAndApptsType {
        console.log(action, state)
        const proofImage = () => {
            return { cmd: 'NOOP', jsonValue: {} }
        }
        switch (action.type) {
            case "reset": return { ...initialState }
            case "set": return { ...state, ...action.payload }
            case "setStop": {
                const stopDetail = { ...action.payload }
                let theAppt = state.appts.find((af) => af._id === stopDetail.a_id)
                let theDonor = state.donors.find((df) => df._id == theAppt?._donorKey)
                let theDonation = state.donations.find((df) => df._id === stopDetail.d_id)
                return { ...state, joined: { appt: theAppt, donor: theDonor, donation: theDonation, stopNumber: stopDetail.stopNumber } }
            }
            case "clearStop": return { ...state, joined: undefined }
            case "addItem": {
                if (!state.joined || !state.joined.donation) {
                    console.warn('Schedule-Context-addItem state.joined is undefined')
                    return state
                }
                let theDonation = state.joined.donation
                if (theDonation.type === 'pickup') {
                    theDonation.pickup.items.push(action.payload)
                } else {
                    theDonation.delivery.items.push(action.payload)
                }
                return { ...state, joined: { ...state.joined, donation: theDonation } }
            }
            case 'itemComplete': {
                if (!state.joined || !state.joined.donation) {
                    console.warn('Schedule-Context-addItem state.joined is undefined')
                    return state
                }
                let theDonation = state.joined.donation
                if (theDonation.type === 'pickup') {
                    theDonation.pickup.items[action.payload.idx].c = action.payload.checked
                } else {
                    theDonation.delivery.items[action.payload.idx].c = action.payload.checked
                }
                return { ...state, joined: { ...state.joined, donation: theDonation } }
            }
            case "driverNote": {
                if (!state.joined || !state.joined.donation) {
                    console.warn('Schedule-Context-addItem state.joined is undefined')
                    return state
                }
                let theDonation = state.joined.donation
                theDonation.driverNote = action.payload
                return { ...state, joined: { ...state.joined, donation: theDonation } }
            }
            case "reschedule": {
                console.log(state.joined)
                if (!state.joined || !state.joined.donation || !state.joined.appt || !state.schedDate) {
                    console.warn('Schedule-Context-reschedule state.joined is undefined')
                    return state
                }
                const stopIdx = state.schedDate.stops.findIndex((ssf) => ssf.d_id === state.joined!.appt!.donationId)
                if (stopIdx === -1) return state
                state.schedDate.stops[stopIdx].status = { code: 'resched', date: mainState.date!, by: 'driver' }
                putAppt({
                    _id: state.schedDate._id,
                    showMessage: false,
                    cmds: [
                        {
                            cmd: 'reschedule',
                            jsonValue: {
                                _id: state.schedDate._id, d_id: state.joined.appt.donationId, status: { code: 'resched', date: theDate(), by: 'driver' }
                            }
                        },
                        { cmd: 'driverNote', jsonValue: { _id: state.joined.donation._id, driverNote: state.joined.donation.driverNote } }
                    ]
                })
                return { ...state, joined: undefined }
            }
            case "complete": {
                console.log(state.joined)
                if (!state.joined || !state.joined.donation || !state.joined.appt || !state.schedDate) {
                    console.warn('Schedule-Context-complete state.joined is undefined')
                    return state
                }
                const stopIdx = state.schedDate.stops.findIndex((ssf) => ssf.d_id === state.joined!.appt!.donationId)
                if (stopIdx === -1) return state
                state.schedDate.stops[stopIdx].status = { code: 'completed', date: mainState.date!, by: 'driver' }

                putAppt({
                    _id: state.schedDate._id,
                    showMessage: true,
                    cmds: [
                        {
                            cmd: 'complete',
                            jsonValue: {
                                _id: state.schedDate._id, d_id: state.joined.appt.donationId, status: { code: 'completed', date: theDate(), by: 'driver' }
                            }
                        },
                        {
                            cmd: 'items', jsonValue: {
                                _id: state.joined.donation._id, delivery: state.joined.donation.delivery.items, pickup: state.joined.donation.pickup.items
                            }
                        },
                        { cmd: 'driverNote', jsonValue: { _id: state.joined.donation._id, driverNote: state.joined.donation.driverNote } },
                        { cmd: 'receipt', jsonValue: { type: 'receipt', _id: state.joined.donor?._id, d_id: state.joined.donation._id } }
                    ]
                })
                return { ...state, joined: undefined }
            }
            case "proof": {
                console.log(state.joined)
                if (!state.joined || !state.joined.donation || !state.joined.donation._id || !state.schedDate) {
                    console.warn('Schedule-Context-proof state.joined is undefined')
                    return state
                }
                const donationIdx = state.donations.findIndex((ssf) => ssf._id === state.joined!.donation!._id)
                if (donationIdx === -1) {
                    console.warn('Schedule-Context-proof donation not found')
                    return state
                }
                if (action.payload.cmd === 'Delete') {
                    let updatedList = [...state.donations[donationIdx].proof === undefined ? [] : state.donations[donationIdx].proof]
                    state.donations[donationIdx].proof = [...updatedList.splice(action.payload.idx, 1)]
                } else {
                    state.donations[donationIdx].proof = [
                        ...state.donations[donationIdx].proof === undefined ? [] : state.donations[donationIdx].proof,
                        ...action.payload.img.map((im: any) => im.uniqueName)
                    ]
                }
                putImage({
                    _id: state.schedDate._id,
                    cmds: [
                        {
                            cmd: 'proof',
                            jsonValue: { ...action.payload, _id: state.joined.donation._id }
                        }
                    ]
                })
                return state
            }
            default: return state
        }
    }
}

export type ScheduleContextStateActionType = {
    payload: any
    type: 'reset' | 'set' | 'addItem' | 'itemComplete' | 'driverNote' | 'setStop' | 'clearStop' | 'complete' | 'reschedule' | 'proof'
}

export type ScheduleContextType = {
    state: SchedAndApptsType,
    dispatch: Function,
    fetchSchedule: Function,
    joinStopDetail: Function,
    isBusy: boolean
}
