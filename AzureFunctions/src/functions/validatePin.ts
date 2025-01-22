import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { MongoClient } from "mongodb";
import { fetchApptsForDay } from "../utils";

export type SettingsPins = {
    _id: 'Users'
    pins: { pin: string, person: string }[]
}
export type SettingsSite = {
    _id: 'Site'
    startDate: string
    mapCenter: any
    locations: any
}
export type SettingsRoutes = {
    _id: 'routes'
    trucks: any
    routes: any
    online: any
    notes: any
}

export async function validatePin(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const thePin = request.query.get('pin')
    const theDate = request.query.get('date')
    context.log('thePin', thePin)
    const client = new MongoClient(process.env.ATLAS_URI!)
    const isValid = (users: SettingsPins | null, thisPin: string | null) => {
        if (users === null || thisPin === null) return { valid: false, name: null }
        const theValue = users.pins.find((pf) => pf.pin === thisPin)
        if (theValue === undefined) return { valid: false, name: null }
        return { valid: true, name: theValue.person }
    }
    context.log('got to 1')
    await client.connect()
    context.log('got to 2')

    try {
        const users = await client.db('Scheduler').collection<SettingsPins>('Settings').findOne({ _id: "Users" })
        const site = await client.db('Scheduler').collection<SettingsSite>('Settings').findOne({ _id: "Site" })
        const routes = await client.db('Scheduler').collection<SettingsRoutes>('Settings').findOne({ _id: "routes" })
        const truckLocations = await client.db('Scheduler').collection('TruckLocation').find().toArray()

        context.log('users', users)
        const isUserValid = isValid(users, thePin)
        let retVal = {}
        if (isUserValid.valid && theDate) {
            retVal = await fetchApptsForDay(theDate, client, context)
        }
        client.close()
        return {
            status: 200,
            body: JSON.stringify({
                err: false,
                results: { ...isValid(users, thePin), ...retVal },
                settings: { site: site, trucks: routes ? routes.trucks : null },
                truckLocations: [...truckLocations]
            })
        }
    } catch (error) {
        context.error(error)
        client.close()
        return {
            status: 310,
            body: JSON.stringify({ err: true, error: error })
        }
    }
};

app.http('validatePin', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: validatePin
});

