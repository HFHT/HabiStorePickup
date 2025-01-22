import { useState } from "react";

export function useGoogleAutocomplete(callBack: (e: any) => void) {
    const [address, setAddress] = useState<DonorPlaceType>({ ...DonorPlaceInit })
    const handlePlaceChange = (e: any) => {
        console.log(e.target.value?.addressComponents)
        console.log(e.target.value?.location.lat(), e.target.value?.location.lng())
        console.log(e.target.value?.types)
        let thePlace = {
            addr: `${getAddressComponent(e.target.value?.addressComponents, 'street_number')} ${getAddressComponent(e.target.value?.addressComponents, 'route')}, ${getAddressComponent(e.target.value?.addressComponents, 'locality')}, ${getAddressComponent(e.target.value?.addressComponents, 'administrative_area_level_1', true)} ${getAddressComponent(e.target.value?.addressComponents, 'postal_code')}`,
            c_cd: getAddressComponent(e.target.value?.addressComponents, 'country', true),
            c_nm: getAddressComponent(e.target.value?.addressComponents, 'country'),
            city: getAddressComponent(e.target.value?.addressComponents, 'locality'),
            lat: e.target.value?.location.lat(),
            lng: e.target.value?.location.lng(),
            num: getAddressComponent(e.target.value?.addressComponents, 'street_number'),
            route: getAddressComponent(e.target.value?.addressComponents, 'route'),
            state: getAddressComponent(e.target.value?.addressComponents, 'administrative_area_level_1'),
            zip: getAddressComponent(e.target.value?.addressComponents, 'postal_code')
        }
        // const addr = `${getAddressComponent(e.target.value?.addressComponents, 'street_number')} ${getAddressComponent(e.target.value?.addressComponents, 'route')}, ${getAddressComponent(e.target.value?.addressComponents, 'locality')}, ${getAddressComponent(e.target.value?.addressComponents, 'administrative_area_level_1', true)} ${getAddressComponent(e.target.value?.addressComponents, 'postal_code')}`
        // let retVal = { place: e.target.value?.addressComponents, formatted: addr, location: { lat: e.target.value?.location.lat(), lng: e.target.value?.location.lng() } }
        callBack(thePlace)
        setAddress(thePlace)
    };

    return { address, handlePlaceChange } as const
}

export function getAddressComponent(places: GooglePlaceType[] | undefined, type: GooglePlaceTypesType, short = false) {
    if (!places) return ''
    let retValue = ''
    places.length > 0 && places.forEach((geo) => {
        if (geo.types.includes(type)) retValue = short ? geo.shortText : geo.longText
    })
    return retValue
}
export type GooglePlaceType = {
    longText: string,
    shortText: string,
    types: GooglePlaceTypesType[]
}
export type GooglePlaceTypesType = 'street_number' | 'route' | 'neighborhood' | 'political' | 'locality' | 'administrative_area_level_1' | 'administrative_area_level_2' | 'country' | 'postal_code' | 'postal_code_suffix'

export type DonorPlaceType = {
    addr: string,
    address2?: string,
    c_cd: string,
    c_nm: string,
    city: string,
    lat: number,
    lng: number,
    num: string,
    route: string,
    state: string,
    zip: string
}

export const DonorPlaceInit = {
    addr: '',
    c_cd: '',
    c_nm: '',
    city: '',
    lat: 0,
    lng: 0,
    num: '',
    route: '',
    state: '',
    zip: ''
}