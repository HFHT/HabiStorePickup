import { notifications } from "@mantine/notifications"
import { fetchJson } from "."

export async function putImage(props: any) {
    const options = {
        method: "PUT",
        headers: new Headers(),
        body: JSON.stringify(props)
    }
    const retVal = await fetchJson(`${import.meta.env.VITE_DRIVER_URL}putAppt`, options)
    if (retVal.err) {
        notifications.show({ color: 'red', title: 'Image save failed.', message: retVal.error.message, autoClose: 9000 })
    }
    return

}
