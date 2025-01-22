import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
const OpenAI = require("openai");

async function getOpenAI(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const req: any = await request.json()
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        return {
            status: 200,
            body: JSON.stringify(
                await openai.completions.create({
                    model: req.model,
                    prompt: req.prompt,
                    temperature: req.temperature,
                    max_tokens: req.max_tokens,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                })
            )
        }
    } catch (error) {
        context.error(error)
        return { body: JSON.stringify({ err: true, error: error }), status: 501 }
    }
};

app.http('getOpenAI', {
    methods: ['POST'], authLevel: 'anonymous', handler: getOpenAI
});