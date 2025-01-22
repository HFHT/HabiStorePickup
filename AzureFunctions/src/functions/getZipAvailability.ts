import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ScheduleDatesType, SettingsHolidays, SettingsRoutes, ZipAvailability } from "../types";
import { addStopSize, calculateDowPickups, dayjsRange, queryGet } from "../utils";
const dayjs = require('dayjs')
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");

var MongoClient = require('mongodb').MongoClient;

export async function getZipAvailability(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.tz(new Date(), 'America/Toronto').format('YYYY-MM-DD')

    context.log('params', request.query.get('zip'), request.query.get('days'), request.query.get('loadPct'))
    let calendar: { date: string, dow: number, totalPickups: number, stops: number, blocks: number, full: boolean }[] = dayjsRange(dayjs().add(1, 'day'), dayjs().add(queryGet(request.query.get('days'), 45), 'day'), 'day')
    let dbResponse = undefined
    const client = new MongoClient(process.env.ATLAS_URI)
    await client.connect()
    try {
        dbResponse = await Promise.all([
            client
                .db('Scheduler')
                .collection('Settings')
                .find({ _id: 'routes' }).toArray(),
            client
                .db('Scheduler')
                .collection('Dates')
                .find({
                    _id: {
                        $gte: dayjs(calendar[0].date).format('YYYY-MM-DD'),
                        $lte: dayjs(calendar[calendar.length - 1].date).format('YYYY-MM-DD'),
                    }
                }).toArray(),
            client
                .db('Scheduler')
                .collection('Settings')
                .findOne({ _id: 'Holidays' })
        ])
    } catch (error) {
        context.error(error)
        client.close()
        return { body: JSON.stringify({ err: true, error: error }), status: 310 }
    }
    let routes: SettingsRoutes = dbResponse[0][0]
    let scheduleDates: ScheduleDatesType[] = dbResponse[1]
    const holidays: SettingsHolidays = dbResponse[2]
    context.log('calendar', calendar)
    context.log('holidays', holidays)

    // Step 1 - calculate the total number of pickups (and deliveries) for each day of the week.
    let totalPickups = calculateDowPickups(routes)
    calendar = calendar.filter((cf) => !holidays.dates.find((hf) => hf.date === cf.date))
    context.log('calendar-no holidays', calendar)

    // Step 2 - create a calendar of all the days and the total number of pickups (and deliveries)
    calendar = calendar.map((d) => ({ ...d, totalPickups: totalPickups[d.dow] }))

    //Step 3 - Get the number of stops for each day that has appointments, save total into the calendar
    const trucks = [...Object.keys(routes.trucks), 'Unassigned']
    // return { body: JSON.stringify({ r: routes, zipAvailability: null, t: trucks, p: totalPickups, d: scheduleDates, c: calendar }) }
    scheduleDates.forEach((sd) => {
        // let dayStopTotal = 0
        // context.log('sd', sd)
        // trucks.forEach((tKey: string) => {
        //     if (Object.keys(sd.stops).includes(tKey)) {
        //         dayStopTotal = dayStopTotal + addStopSize(sd.stops[tKey])
        //     }
        // })
        let calendarIdx = calendar.findIndex((cf) => cf.date === sd._id)
        const dayBlockTotal = sd.block.reduce((total, value) => {
            // if calendarIdx is -1 then the day is a holiday and was removed above.
            let truckDow = calendarIdx === -1 ? 0 : routes.trucks[value].pickup.loadsize[calendar[calendarIdx].dow]
            return total + truckDow
        }, 0)

        calendar[calendarIdx] = { ...calendar[calendarIdx], stops: addStopSize(sd.stops), blocks: dayBlockTotal }
    })
    context.log('scheduleDates-after', scheduleDates)

    //Step 4 - For each calendar day, determine number of remaining slots, determine if day isFull.
    calendar = calendar.map((c) => {
        let isFull = true
        let remaining = c.totalPickups - queryGet(c.stops, 0) - queryGet(c.blocks, 0)
        if (remaining > 0) {
            isFull = c.totalPickups * (1 - (queryGet(request.query.get('loadPct'), 80) / 100)) > remaining
        }
        return { ...c, remaining: remaining, full: isFull }
    })

    //Step 5 - Create the return object, Zip code mapped to an array of dates
    let zipAvailability: ZipAvailability[] | [] = []
    //@ts-ignore
    Object.entries(routes.routes).forEach(([k, v]: [string, { dow: number }[]]) => {
        let tdays: {}[] = []
        v.forEach((vr) => {
            let td = calendar.filter((fv) => (fv.dow === vr.dow))
            tdays = [...tdays, ...td]
        })
        //@ts-ignore
        zipAvailability = [...zipAvailability, { zip: k, notes: routes.notes[k] !== undefined ? routes.notes[k] : '', dates: [...tdays.sort((ts1: { date: string }, ts2: { date: string }) => (ts1.date > ts2.date ? 1 : -1))] }]
    })
    const items = await client.db('Scheduler').collection('Settings').find({ _id: 'notAccepted' }).toArray()
    const templates = await client.db('Habitat').collection('Templates').find({ _id: { $in: ['storePickupConfirmation', 'storePickupEmailConfirmation'] } }).toArray()
    client.close()
    return { body: JSON.stringify({ zip: [...zipAvailability], notAccepted: [...items[0].items], templates: [...templates] }) }

};

app.http('getZipAvailability', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getZipAvailability
});
