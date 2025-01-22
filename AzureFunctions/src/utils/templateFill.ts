export function emailFill(printDocument: string, itemList: { qty: number | string, prod: string }[], replace: any) {
    let printOutput: string = printDocument
    let printList: string = ''
    Object.entries(replace).forEach(([key, value]: any) => {
        let regex = new RegExp(`{${key}}`, 'g')
        printOutput = printOutput.replace(regex, value)
    })
    itemList.forEach((il, j) => {
        printList = printList + `<tr><td>${il.qty} - ${il.prod}</td></tr>`
    })
    let regex = new RegExp(`{ITEMLIST}`, 'g')
    printOutput = printOutput.replace(regex, printList)

    return printOutput
}