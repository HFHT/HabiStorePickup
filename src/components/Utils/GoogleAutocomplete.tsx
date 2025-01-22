//@ts-ignore
import { PlacePicker } from '@googlemaps/extended-component-library/react';
import './../../assets/google.css'
import { useGoogleAutocomplete } from './useGoogleAutocomplete';
// This line has to appear near the top of the React hierarchy
// <APILoader apiKey={import.meta.env.VITE_GOOGLE_APIKEY} solutionChannel="GMP_GCC_placepicker_v1" /> 

type GoogleAutocompleteType = {
  placeholder?: string
  countries?: string[]
  className?: string
  callBack: (e: any) => void
}
export function GoogleAutocomplete({ placeholder = 'Address...', countries = ['us'], callBack = () => { }, className = '' }: GoogleAutocompleteType) {
  const { handlePlaceChange } = useGoogleAutocomplete(callBack)
  return (
    <div className={className}>
      <div className="google-container">
        <PlacePicker autoFocus country={countries} placeholder={placeholder} onPlaceChange={handlePlaceChange} />
        <div className="google-result">
        </div>
      </div>
    </div>
  );
}
