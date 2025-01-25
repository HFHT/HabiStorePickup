// req.jsonValue contains the OpenAI object to be processed. Can use the OpenAI playground to generate the object.

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import OpenAI from 'openai'
async function getOpenAI4(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const req: any = await request.json()
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return {
      status: 200,
      body: JSON.stringify(
        await openai.chat.completions.create({ ...req.jsonValue })
      )
    }
  } catch (error) {
    context.error(error)
    return { body: JSON.stringify({ err: true, error: error }), status: 501 }
  }
};

app.http('getOpenAI4', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: getOpenAI4
});
