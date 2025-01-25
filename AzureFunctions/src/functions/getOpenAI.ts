import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
// const OpenAI = require("openai");
import OpenAI from 'openai'
async function getOpenAI(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const req: any = await request.json()
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        return {
            status: 200,
            body: JSON.stringify(
                await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [
                      {
                        "role": "system",
                        "content": [
                          {
                            "type": "text",
                            "text": "You are a helpful assistant. parse the information into a list of products and quantities.  The categories are: Furniture, Housewares, Art and Decor, Appliance, Plumbing, Cabinetry, Building materials, Flooring, Tile, Lamps, Lighting, Doors, Windows, Electronics, Clothing, Bedding, Other. return results in json format: {products: [{\"prod\":string, \"qty\":number, \"category\":string}]}"
                          }
                        ]
                      },
                      {
                        "role": "user",
                        "content": [
                          {
                            "type": "text",
                            "text": req.items
                          }
                        ]
                      }
                    ],
                    response_format: {
                      "type": "json_object"
                    },
                    temperature: 1,
                    max_completion_tokens: 800,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0
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