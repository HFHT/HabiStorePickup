import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { MongoClient } from "mongodb";

export type SettingsPins = {
    _id: 'Users'
    pins: { pin: string, person: string }[]
}

export async function validatePin(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const thePin = request.query.get('pin')
    const client = new MongoClient(process.env.ATLAS_URI)
    const isValid = (users: SettingsPins, thisPin: string) => {
        const theValue = users.pins.find((pf) => pf.pin === thisPin)
        if (theValue === undefined) return { valid: false, name: null }
        return { valid: true, name: theValue.person }
    }
    await client.connect()
    try {
        const users = await client.db('Scheduler').collection<SettingsPins>('Settings').findOne({ _id: "Users" })
        client.close()
        context.log('users', users)
        return { body: JSON.stringify({ err: false, results: isValid(users, thePin) }) }
    } catch (error) {
        context.error(error)
        client.close()
        return { body: JSON.stringify({ err: true, error: error }), status: 310 }
    }
};

app.http('validatePin', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: validatePin
});
