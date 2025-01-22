import { theDate } from "@/utils";
import { createContext, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useReducer, useState } from "react";
import { useMain } from "..";

export const ConstituentContext = createContext<ConstituentContexType>({
    state: {
        pin: undefined,
        date: theDate(),
        online: true,
        route: 'Blue',
        truckLocations: [],
        view: 'Schedule',
        stopDetail: undefined,
        phone: undefined,
        zipCode: undefined
    },
    dispatch: () => { },
    scrollPosition: { x: 0, y: 0 },
    onScrollPositionChange: () => { },
})

export const ConstituentContextProvider = (props: ConstituentContextProviderType) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { sasToken } = useMain()
    const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 })


    function reducer(state: ConstituentContextStateType, action: { type: ConstituentContextActions, payload: any }) {
        console.log(action)
        switch (action.type) {
            case 'reset': return { ...initialState, pin: state.pin }
            case 'setDate': return { ...state, date: action.payload }
            case 'setOnline': return { ...state, online: action.payload }
            case 'setPin': return { ...state, pin: action.payload }
            case 'setRoute': return { ...state, route: action.payload }
            case 'setTrucks': return { ...state, truckLocations: action.payload }
            case 'setView': return { ...state, view: action.payload }
            case 'setSettings': return { ...state, settings: action.payload }

            case 'setPhone': return { ...state, phone: action.payload }
            case 'setZipCode': return { ...state, zipCode: action.payload }
            default: { console.log('default'); return state }
        }
    }
    return (
        <ConstituentContext.Provider value={{
            state: state,
            dispatch: dispatch,
            scrollPosition: scrollPosition,
            onScrollPositionChange: onScrollPositionChange
        }}>
            {props.children}
        </ConstituentContext.Provider>
    )
}

const initialState: ConstituentContextStateType = {
    date: theDate(),
    pin: undefined,
    online: true,
    route: 'Blue',
    truckLocations: [],
    view: 'Schedule',
    // editMode: false,
    stopDetail: undefined,
    phone: undefined,
    zipCode: undefined
}

export type ConstituentContextProviderType = {
    children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined,
    props: any
}


export type ConstituentContextStateType = {
    date: string | undefined
    pin: number | string | undefined
    online: boolean
    route: string,
    truckLocations: any[]
    view: 'Schedule' | 'Map',
    // editMode: boolean
    stopDetail: any,
    phone: string | undefined,
    zipCode: string | undefined
}


export type ConstituentContexType = {
    state: ConstituentContextStateType,
    dispatch: Function,
    scrollPosition: { x: number, y: number },
    onScrollPositionChange: Function,
}

export type ConstituentContextActions = 'setPhone' | 'setZipCode' | 'reset' | 'setDate' | 'setOnline' | 'setPin' | 'setRoute' | 'setTrucks' | 'setView' | 'setEditMode' | 'setSchedDate' | 'setSettings'
