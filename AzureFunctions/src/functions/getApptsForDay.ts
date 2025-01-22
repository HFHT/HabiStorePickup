import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { fetchApptsForDay, queryGet } from "../utils";
var MongoClient = require('mongodb').MongoClient;
//
// Receives a date query {_id: 'yyyy-mm-dd'} and returns the associated ScheduleDates and ScheduleAppts
// Returns undefined ScheduleDates if date doesn't exist
// Returns empty ScheduleAppts if there are no stops for the date
//
// Also returns appts, donors, donations
// }

export async function getApptsForDay(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const client = new MongoClient(process.env.ATLAS_URI)
    await client.connect()
    try {
        const retVal = await fetchApptsForDay(queryGet(request.query.get('find')), client, context)
        //     context.log('params', request.query.get('find'), request.query.get('sort'), request.query.get('limit'))
        //     const schedDate: ScheduleDatesType = await client.db('Scheduler').collection('Dates').findOne(queryGet(request.query.get('find')))
        //     context.log(schedDate)
        //     if (schedDate === null) {
        //         return { status: 200, body: JSON.stringify({ schedDate: undefined, appts: [] }) }
        //     }

        //     const { constituentInfo, error } = await getConstituents(schedDate.stops.map((sm) => (sm.a_id)), client)

        //     if (error) {
        //         context.error(error)
        //         client.close()
        //         return { body: JSON.stringify({ err: true, error: error }), status: 311 }
        //     }
        client.close()
        return {
            status: 200,
            body: JSON.stringify({ ...retVal })
        }
    } catch (error) {
        context.error(error)
        client.close()
        return { body: JSON.stringify({ err: true, error: error }), status: 310 }
    }
};



export type ScheduleDatesType = {
    _id: string
    archive: boolean
    block: string[]
    waitlist: string[]
    stops: ScheduleStopsType[]
    cancelled: ScheduleStopsType[] | undefined
}
export type ScheduleStopsType = {
    a_id: number
    d_id: number
    route: string
    size: number
    order: number
    slot?: number
    _id?: string | undefined
    source: 'scheduler' | 'web' | 'online'
    type: 'pickup' | 'delivery'
    status: {
        code: 'order' | 'status' | 'size' | 'block' | 'archive' | 'completed' | 'calls' | 'move' | 'cancel'
        date: string | Date
        by: string
    }
}
app.http('getApptsForDay', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getApptsForDay
});