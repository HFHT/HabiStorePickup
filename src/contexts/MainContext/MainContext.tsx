import { theDate } from "@/utils";
import { createContext, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useEffect, useReducer, useState } from "react";
import { useMain } from "..";
import { DEFAULT_ZIP, getZipAvailability } from "@/services";
import { ItemListType, useExitPrompt } from "@/hooks";
export const MainContext = createContext<MainContexType>({
    state: {
        date: theDate(),
        donation: [],
        donor: undefined,
        online: true,
        page: 0,
        phone: '+1',
        photos: [],
        pin: undefined,
        selected: undefined,
        settings: undefined,
        stopDetail: undefined,
        view: 'Schedule',
    },
    notAcceptedItems: [],
    templates: undefined,
    isBusy: false,
    sasToken: undefined,
    mode: 'pickup',
    uuid: null,
    zipAvailability: undefined,
    dispatch: () => { },
    getZipCodes: () => { },
    setIsBusy: () => { },
    setShowExitPrompt: () => { }
})

export const MainContextProvider = (props: MainContextProviderType) => {
    const [zipAvailability, setZipAvailability] = useState<ZipAvailability[] | undefined>()
    const [notAcceptedItems, setNotAcceptedItems] = useState<string[]>([])
    const [templates, setTemplates] = useState<{ _id: string, template: string, jsonValue: any }[]>([])
    const [isBusy, setIsBusy] = useState<boolean>(false)
    const [state, dispatch] = useReducer(reducer, initialState)
    const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false)
    const { mode, sasToken, uuid } = useMain()

    const getZipCodes = async () => {
        try {
            setIsBusy(true)
            const availbility = await getZipAvailability({ zip: DEFAULT_ZIP })
            setZipAvailability(availbility.zip)
            setNotAcceptedItems(availbility.notAccepted)
            setTemplates(availbility.templates)
            setIsBusy(false)
        } catch (error) {
            setIsBusy(false)
        }
    }
    useEffect(() => {
        !showExitPrompt && setShowExitPrompt(true)
    }, [showExitPrompt])

    useEffect(() => {
        getZipCodes()
    }, [])

    function reducer(state: MainContextStateType, action: { type: MainContextActions, payload: any }) {
        console.log(action)
        switch (action.type) {
            case 'reset': return { ...initialState, pin: state.pin }
            case 'back': return { ...state, page: state.page - 1 }
            case 'next': return { ...state, page: state.page + 1 }
            case 'saveForm': return {
                ...state, donor: { ...state.donor, donor: { ...action.payload } }
            }
            case 'setDate': return { ...state, date: action.payload }
            case 'setDonation': return { ...state, donation: action.payload }
            case 'setDonor': return { ...state, donor: action.payload }
            case 'setDonorPlace': {
                if (!state.donor) {
                    console.warn('setDonorPlace', state)
                    return state
                }
                const place = { ...action.payload, address2: state.donor.donor.place.address2 }
                return { ...state, donor: { ...state.donor, donor: { ...state.donor.donor, place: { ...place } } } }
            }
            case 'setOnline': return { ...state, online: action.payload }
            case 'setPhone': return { ...state, phone: action.payload }
            case 'setPhotos': return { ...state, photos: action.payload }
            case 'setPin': return { ...state, pin: action.payload }
            case 'setSettings': return { ...state, settings: action.payload }
            case 'setView': return { ...state, view: action.payload }
            case 'setZipCode': return { ...state, selected: action.payload }
            default: { console.warn('default'); return state }
        }
    }
    return (
        <MainContext.Provider value={{
            state: state,
            dispatch: dispatch,
            mode: mode,
            sasToken: sasToken,
            uuid: uuid,
            zipAvailability: zipAvailability,
            notAcceptedItems: notAcceptedItems,
            templates: templates,
            isBusy: isBusy,
            setIsBusy: setIsBusy,
            setShowExitPrompt: setShowExitPrompt,
            getZipCodes: getZipCodes
        }}>
            {props.children}
        </MainContext.Provider>
    )
}

const initialState: MainContextStateType = {
    date: theDate(),
    donation: [],
    donor: undefined,
    online: true,
    page: 0,
    phone: '+1',
    photos: [],
    pin: undefined,
    selected: undefined,
    settings: undefined,
    stopDetail: undefined,
    view: 'Schedule',
}

export type MainContextProviderType = {
    children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined,
    props: any
}

export type MainContextStateType = {
    date: string | undefined
    donation: ItemListType[],
    donor: any,
    online: boolean
    page: number
    phone: string | undefined,
    photos: any[],
    pin: number | string | undefined
    selected: {
        zip: string,
        note: string | undefined,
        date: string | undefined,
        available: {
            blocks: number
            date: string,
            dow: number,
            full: boolean,
            remaining: number,
            stops: number,
            totalPickups: number
        }[],
    } | undefined,
    settings: SettingsType | undefined,
    stopDetail: any,
    view: 'Schedule' | 'Map'
}
export type SasTokenType = {
    sasKey: string
    url: string
}
export type MainContexType = {
    state: MainContextStateType,
    isBusy: boolean,
    mode: 'pickup' | 'returning',
    notAcceptedItems: string[],
    templates: { _id: string, template: string, jsonValue: any }[] | undefined,
    sasToken: SasTokenType | undefined,
    uuid: string | null,
    zipAvailability: ZipAvailability[] | undefined,
    dispatch: Function,
    getZipCodes: Function,
    setIsBusy: Function,
    setShowExitPrompt: Function
}

export type MainContextActions = 'reset' | 'back' | 'next' | 'saveForm' | 'setDate' | 'setDonation' | 'setDonor' | 'setDonorPlace' | 'setOnline' | 'setPhone' | 'setPhotos' | 'setPin' | 'setSettings' | 'setView' | 'setZipCode'

export type SettingsType = {
    site: SiteSettingsType | undefined
    trucks: any | undefined
}

export type SiteSettingsType = {
    StartDate: string
    locations: SiteLocationType[]
    mapCenter: { lat: number, lng: number }
    truckRefreshRate: number
    schedRefreshRate: number
}

export type SiteLocationType = {
    address: string
    mapLocation: { lat: number, lng: number }
    name: string
}

export type ZipAvailability = {
    zip: string
    notes: string
    dates: ZipDates[]
}
export type ZipDates = {
    date: string
    dow: number
    totalPickups: number
    stops: number
    blocks: number
    remaining: number
    full: boolean
}