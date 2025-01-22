import { notifications } from "@mantine/notifications"
import { fetchJson } from "."

export async function putAppt(props: any) {
    const hasError = (theResult: any, showMessage: boolean) => {
        if (theResult.err) return { err: true, color: 'red', title: 'Save failed!!', message: `Reason: ${theResult.error.message}` }
        return { err: false, color: 'green', title: 'Save complete.', message: showMessage ? 'Receipt email sent.' : '' }
    }
    const options = {
        method: "PUT",
        headers: new Headers(),
        body: JSON.stringify(props)
    }
    const retVal = await fetchJson(`${import.meta.env.VITE_DRIVER_URL}putAppt`, options)
    const error = hasError(retVal, props.showMessage)
    notifications.show({ color: error.color, title: error.title, message: error.message, autoClose: 9000 })
    return

}
