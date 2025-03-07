import PhoneInput from "react-phone-input-2";
import { Box, Button, Flex, Tooltip } from "@mantine/core";
import { usePhoneLookup } from "./usePhoneLookup";
import { IconRefresh } from "@tabler/icons-react";
import { useEffect } from "react";
interface ShopifyPhoneInterface {
    open?: boolean
    callBack?: (e: any) => void
    disabled?: boolean
}
export function PhoneLookup({ open = true, disabled = false, callBack = () => { } }: ShopifyPhoneInterface) {
    const { phone, setPhone, dispatch, constituent } = usePhoneLookup()
    useEffect(() => {
        console.log('PhoneLookup-constituent-useEffect', constituent)
        if (!constituent) return
        if (constituent.donor._id === '') {
            callBack(constituent)
        }
    }, [constituent])

    if (!open) return <Box pos='relative'></Box>
    return (
        <Box pos='relative'>
            <Flex>
                <Tooltip disabled={!disabled} label='Reset and try again.' >
                    <Button variant='light' color='gray' mt={20} mr={10} disabled={!disabled}
                        aria-label='Press to clear prior phone number and start Over'
                        onClick={() => {
                            dispatch({ type: 'setPhone', payload: '+1' })
                            dispatch({ type: 'setDonor', payload: undefined })
                        }}>
                        <IconRefresh />
                    </Button>
                </Tooltip>
                <div className='pickphone'>
                    <PhoneInput country={'us'} value={phone} inputClass='pickphoneinput' disabled={disabled}
                        placeholder='Enter Phone number'
                        onChange={(p: any) => setPhone(p)}
                    />
                </div>

            </Flex>

        </Box>
    )
}
