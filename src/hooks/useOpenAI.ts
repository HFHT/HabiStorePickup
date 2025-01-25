// deprecated model: text-davinci-003

import { useContext, useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { getChatGPT } from "@/services";
import { MainContext } from "@/contexts";

export const CONST_GPT_PROMPT = 'You will parse only the information provided into a list of products and quantities: {items}. Place into one of these categories: Furniture, Housewares, Art and Decor, Appliance, Plumbing, Cabinetry, Building materials, Flooring, Tile, Lamps, Lighting, Doors, Windows, Electronics, Clothing, Bedding, Other.  Your response should be in JSON format: [{"prod":string, "qty":number, "category":string}]'

export type ItemListType = {
    qty: number
    prod: string
}
export function useOpenAI() {
    const { isBusy, setIsBusy, templates } = useContext(MainContext)
    const [itemList, setItemList] = useState<ItemListType[] | undefined>(undefined);
    // const [isBusy, setIsBusy] = useState(false)
    const [haveResponse, { open: openDation, close: closeDonation, toggle: toggleDonation }] = useDisclosure(false);

    useEffect(() => {
        if (!itemList) {
            closeDonation()
            return
        }
        openDation()
    }, [itemList])

    const getOpenAI = async (userData: any) => {
        // if (!chatGPT) return;
        // console.log(userData)
        if (!userData || !templates) return;
        let template = templates.find((tf) => tf._id === 'storeOpenAIItemPrompt')
        if (!template) return
        let jsonString = JSON.stringify(template.jsonValue)
        console.log(jsonString)
        jsonString = jsonString.replace(new RegExp('{ITEMS}', 'g'), userData);
        console.log(JSON.parse(jsonString))
        setIsBusy(true)
        try {
            // setItemList((await getChatGPT(CONST_GPT_PROMPT.replace(/{items}/g, userData))))
            setItemList((await getChatGPT(JSON.parse(jsonString))))
        }
        catch (error) { console.log(error, 'Read of ChatGPT failed: ' + error) }
        setIsBusy(false)
    }

    const addToList = (e: ItemListType) => {
        if (!itemList) return
        setItemList([...itemList, e])
    }
    const removeFromList = (idx: number) => {
        if (!itemList) return
        let theList = [...itemList]
        theList.splice(idx, 1)
        setItemList([...theList])
    }

    const resetAI = (doIt: boolean) => {
        if (!doIt) return
        console.log('resetGPT')
        setItemList([])
    }

    return { itemList, addToList, removeFromList, getOpenAI, resetAI, isBusy, haveResponse, openDation, closeDonation, toggleDonation }
}