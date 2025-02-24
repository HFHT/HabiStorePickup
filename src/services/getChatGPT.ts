import { fetchJson } from "."

type OpenAiResponseType = {
    choices: OpenAiChoicesType[]
    usage: {
        prompt_token: number
        completion_tokens: number
        total_tokens: number
    }
    created: number
    id: string
    model: string
    object: 'text-completion'
}
export type OpenAiChoicesType = {
    finish_response: 'stop'
    index: number
    logprobes: null
    text: string
    message: { role: string, content: string, refusal: any }
}
export const getChatGPT = async (userData: string) => {
    if (!userData) return;
    const headers = new Headers();

    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            jsonValue: userData,
        })
    };
    try {
        const response: OpenAiResponseType = await fetchJson(`${import.meta.env.VITE_PICKUP_URL}getOpenAI4`, options)
        let initVal = [{ qty: 0, prod: '', category: '' }]
        console.log('ChatGPT-fetchJson', response)
        if (response.choices.length === 0) return [...initVal]
        try {
            let retObj = response.choices[0].message.content
            if (retObj) {
                let retVal = JSON.parse(retObj)
                if (retVal && retVal.products) return retVal.products
            }
        } catch (e) {
            console.log(response)
            console.log(e)
        }
        return [...initVal]
    }
    catch (error) {
        console.log(error);
        return []
    }
}