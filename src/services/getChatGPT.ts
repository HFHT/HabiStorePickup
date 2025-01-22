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
}
export const getChatGPT = async (userData: string) => {
    // console.log(userData)
    if (!userData) return;
    const headers = new Headers();

    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            model: import.meta.env.VITE_GPT_MODEL,
            prompt: userData,
            temperature: 0.2,
            max_tokens: 600
        })
    };
    try {
        const response: OpenAiResponseType = await fetchJson(`${import.meta.env.VITE_PICKUP_URL}getOpenAI`, options)
        console.log('ChatGPT-fetchJson', response)
        if (response.choices.length === 0) return undefined
        let retVal = undefined
        try {
            retVal = JSON.parse(response.choices[0].text)
        } catch (e) {
            console.log(response.choices[0].text)
            console.log(e)
        }
        return retVal
    }
    catch (error) {
        console.log(error);
        return []
    }
}