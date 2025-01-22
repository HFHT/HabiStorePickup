import { fetchJson } from "."
import { isEmail } from "../utils"

export type eMailHTMLReqType = {
    to: string
    subject: string
    content: string             // Template to pull from Mongo database
    noSend?: boolean
}
export async function sendEmailHTML(eMailReq: eMailHTMLReqType) {
    const header: any = { method: "POST", headers: new Headers() }
    header.body = JSON.stringify({ ...eMailReq })
    if (eMailReq.noSend) { console.log('sendEmail', header); return null }
    if (eMailReq.to === '' || !isEmail(eMailReq.to)) { console.log('sendEmail-bad address', eMailReq.to) }
    return await fetchJson(`${import.meta.env.VITE_PICKUP_URL}sendEmailHTML`, header)

}