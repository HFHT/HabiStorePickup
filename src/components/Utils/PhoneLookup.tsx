import PhoneInput from "react-phone-input-2";
import { Box, Button, CloseButton, Flex, Text } from "@mantine/core";
import { usePhoneLookup } from "./usePhoneLookup";
import { IconRefresh } from "@tabler/icons-react";
interface ShopifyPhoneInterface {
    open?: boolean
    callBack?: (e: any) => void
    disabled?: boolean
}
export function PhoneLookup({ open = true, disabled = false, callBack = () => { } }: ShopifyPhoneInterface) {
    const { phone, setPhone, state, dispatch } = usePhoneLookup()

    if (!open) return <Box pos='relative'></Box>
    return (
        <Box pos='relative'>
            {/* <Text size='md' mt='md'>Phone</Text> */}
            <Flex>
                <Button variant='light' color='gray' mt={20} mr={10} disabled={!disabled}
                    aria-label='Press to clear prior phone number and start Over'
                    onClick={() => {
                        dispatch({ type: 'setPhone', payload: '+1' })
                        dispatch({ type: 'setDonor', payload: undefined })
                    }}>
                    <IconRefresh />
                </Button>
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
