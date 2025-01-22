import { ScheduleDatesType } from "../functions/getApptsForDay"

export async function fetchApptsForDay(theDate: string, client: any, context: any) {
    const schedDate: ScheduleDatesType = await client.db('Scheduler').collection('Dates').findOne({ _id: theDate })
    context.log(schedDate)
    if (schedDate === null) {
        return { schedDate: undefined, appts: [], err: false }
    }
    try {
        schedDate.stops.sort((a, b) => a.order > b.order ? 1 : -1).sort((c, d) => c.route > d.route ? 1 : 0)
        const { constituentInfo, error } = await getConstituents(schedDate.stops.map((sm) => (sm.a_id)), client)
        if (error) {
            context.error(error)
            return { err: true, error: error }
        }
        return { ...constituentInfo, schedDate: { ...schedDate }, err: false }
    } catch (error) {
        context.error(error)
        return { err: true, error: error }
    }
}
export async function getConstituents(allAppointments: number[], client: any) {
    let appointments = undefined
    let donors = undefined
    let donations = undefined
    try {
        appointments = await Promise.all(
            allAppointments.map(async (appt) => (
                (await client.db('Scheduler').collection('Appts').find({ _id: appt }).toArray())[0]
            )))
        donors = await Promise.all(
            appointments.map(async (appt) => (
                (await client.db('Scheduler').collection('Donors').find({ _id: appt._donorKey }).toArray())[0]
            )))
        donations = await Promise.all(
            appointments.map(async (appt) => (
                (await client.db('Scheduler').collection('Donations').find({ _id: appt.donationId }).toArray())[0]
            )))
        return { constituentInfo: { appts: appointments, donors: donors, donations: donations }, error: null }
    } catch (error) {
        return { error: error }
    }
}