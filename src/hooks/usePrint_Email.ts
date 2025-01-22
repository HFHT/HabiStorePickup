import { ImagesType } from "@/components"
import { MainContext } from "@/contexts"
import { sendEmailHTML } from "@/services"
import { notifications } from "@mantine/notifications"
import { useContext, useState } from "react"

export function usePrint_Email() {
    const { sasToken } = useContext(MainContext)
    const [isBusy, setIsBusy] = useState(false)

    const print = (printDocument: { _id: string, template: string } | undefined, itemList: { qty: number | string, prod: string }[], imageList: ImagesType[], replace: any) => {
        if (!printDocument) return
        const printOutput = formFill(printDocument.template, itemList, imageList, replace)
        var mywindow = window.open('', 'PRINT', 'popup')
        if (mywindow) {
            mywindow.document.write(printOutput)
            mywindow.document.close() // necessary for IE >= 10
            mywindow.focus() // necessary for IE >= 10*/
            mywindow.print()
            mywindow.close()
        }
    }

    const email = async (emailDocument: { _id: string, template: string } | undefined, itemList: { qty: number | string, prod: string }[], imageList: ImagesType[], replace: any, to_subject: { to: string, subject: string }) => {
        if (!emailDocument) return
        const emailOutput = formFill(emailDocument.template, itemList, imageList, replace, sasToken)
        setIsBusy(true)
        const confirmation = await sendEmailHTML({ ...to_subject, content: emailOutput })
        console.log(confirmation)
        setIsBusy(false)
        notifications.show({ color: 'green', title: 'Email sent.', message: '', autoClose: 5000 })
        return confirmation
    }

    return { email, print, isBusy }
}

export function formFill(printDocument: string, itemList: { qty: number | string, prod: string }[], imageList: ImagesType[], replace: any, sasToken?: any) {
    let printOutput: string = printDocument
    let printList: string = ''
    let imgList: string = ''
    Object.entries(replace).forEach(([key, value]: any) => {
        let regex = new RegExp(`{${key}}`, 'g')
        printOutput = printOutput.replace(regex, value)
    })
    itemList.forEach((il, j) => {
        printList = printList + `<tr><td>${il.qty} - ${il.prod}</td></tr>`
    })
    let regex = new RegExp(`{ITEMLIST}`, 'g')
    printOutput = printOutput.replace(regex, printList)
    imageList.forEach((il, j) => {
        if (!sasToken) {    // local image
            imgList = imgList + `<img src='${il.url}' width='100' height='100' fit='contain' style='margin: 5px;' />`
        } else {
            imgList = imgList + `<img src='${sasToken.url}/${il.uniqueName}' width='100' height='100' fit='contain' style='margin: 5px;' />`
        }
    })
    regex = new RegExp(`{IMGS}`, 'g')
    printOutput = printOutput.replace(regex, imgList)
    console.log(printOutput)
    return printOutput
}