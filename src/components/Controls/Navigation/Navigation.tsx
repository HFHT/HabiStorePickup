import { MainContext } from "@/contexts";
import { Button, Group } from "@mantine/core";
import { IconCaretLeftFilled, IconCaretRightFilled } from "@tabler/icons-react";
import { useContext, useEffect } from "react";

interface NavigationInterface {
    first?: boolean
    last?: boolean
    enable?: boolean
    autoAdvance?: boolean
    autoFocus?: boolean
    validate?: boolean
    callBack?: Function
}
export function Navigation({ first = false, last = false, enable = false, autoAdvance = false, autoFocus = false, validate = false, callBack = () => { } }: NavigationInterface) {
    const { dispatch } = useContext(MainContext)
    useEffect(() => {
        if (autoAdvance) {
            callBack()
            dispatch({ type: 'next' })
        }
    }, [autoAdvance])

    return (
        <Group justify='flex-start' grow>
            <Button style={first ? { background: 'transparent', fontSize: 0, cursor: 'default' } : {}}
                color='gray'
                radius={0}
                leftSection={first ? '' : <IconCaretLeftFilled size={14} />}
                tabIndex={first ? -1 : 0}
                onClick={() => dispatch({ type: 'back' })} >
                Previous
            </Button>
            <Button style={last ? { background: 'transparent', fontSize: 0, cursor: 'default' } : {}}
                color='gray'
                radius={0}
                rightSection={last ? '' : <IconCaretRightFilled size={14} />}
                tabIndex={last ? -1 : 0}
                autoFocus={autoFocus}
                onClick={() => {
                    if (validate) {
                        let isValid = callBack()
                        console.log(isValid)
                        isValid && dispatch({ type: 'next' })
                    } else {
                        callBack()
                        dispatch({ type: 'next' })
                    }
                }}
                disabled={!enable}>
                Next
            </Button>
        </Group>
    )
}
