//@ts-ignore
import { PlacePicker } from '@googlemaps/extended-component-library/react';
import './../../assets/google.css'
import { useGoogleAutocomplete } from './useGoogleAutocomplete';
import { ReactNode } from 'react';
// This line has to appear near the top of the React hierarchy
// <APILoader apiKey={import.meta.env.VITE_GOOGLE_APIKEY} solutionChannel="GMP_GCC_placepicker_v1" /> 

type GoogleAutocompleteType = {
  label?: string | ReactNode | undefined
  placeholder?: string
  countries?: string[]
  className?: string
  haveError?: any
  callBack: (e: any) => void
}
export function GoogleAutocomplete({ label, placeholder = 'Address...', countries = ['us'], haveError = undefined, callBack = () => { }, className = '' }: GoogleAutocompleteType) {
  const { handlePlaceChange } = useGoogleAutocomplete(callBack)
  return (
    <div className={className}>
      {label}
      <div className="google-container">
        <PlacePicker autoFocus country={countries} placeholder={placeholder} onPlaceChange={handlePlaceChange} />
        <div className="google-result">
          {haveError && <div className="google-error">{haveError}</div>}
        </div>
      </div>
    </div>
  );
}
