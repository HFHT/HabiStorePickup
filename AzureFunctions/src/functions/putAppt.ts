import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { sendEmail } from "../utils";
var MongoClient = require('mongodb').MongoClient;

export type RequestType = {
    _id: string | undefined
    appt_fk?: number | undefined
    cmds: RequestCmdsType[]
}
export type RequestCmdsType = {
    cmd: 'complete' | 'reschedule' | 'image' | 'proof' | 'driverNote' | 'items' | 'receipt',
    jsonValue: any
}
export async function putAppt(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const req = await request.json() as RequestType
    const client = new MongoClient(process.env.ATLAS_URI)
    await client.connect()

    try {
        let results: any[] = []
        for (var i = 0; i < req.cmds.length; i++) {
            switch (req.cmds[i].cmd) {
                case 'reschedule':
                case 'complete':
                    results = [...results, await stopUpdate(client, req.cmds[i], context)]
                    break
                case 'proof':
                case 'image':
                    results = [...results, await image(client, req.cmds[i], context)]
                    break
                case 'items':
                    results = [...results, await items(client, req.cmds[i], context)]
                    break
                case 'driverNote':
                    results = [...results, await driverNote(client, req.cmds[i], context)]
                    break
                case 'receipt':
                    results = [...results, await sendEmail(client, req.cmds[i], context)]
                    break
                default: results = [...results, 'bad command']
            }
        }
        return {
            status: 200,
            body: JSON.stringify({ data: [], request: req, results: results })
        }
    } catch (error) {
        context.error(error)
        client.close()
        return { body: JSON.stringify({ err: true, error: error }), status: 501 }
    }

};
const image = async (client: any, reqObject: RequestCmdsType, context: any) => {
    //reqObject.cmd: 'proof' | 'image'
    //jsonValue contains: {_id: d_id, cmd: 'add' | 'remove', img:[ uniqueName: string, name: string, url: string ] } }
    context.log('image', reqObject)
    if (reqObject.cmd === 'proof') {
        if (reqObject.jsonValue.cmd === 'Delete') {
            let theImg = reqObject.jsonValue.img[0].uniqueName || reqObject.jsonValue.img[0].name
            let result = await client.db('Scheduler').collection('Donations').updateOne({ _id: reqObject.jsonValue._id }, { $pull: { 'proof': theImg } })
            return result
        } else {
            const imageList = reqObject.jsonValue.img.map((im: any) => im.uniqueName)
            context.log('image', imageList)
            let result = await client.db('Scheduler').collection('Donations').updateOne({ _id: reqObject.jsonValue._id }, { $addToSet: { proof: { $each: [...imageList] } } })
            return result
        }
    }
}
const driverNote = async (client: any, reqObject: RequestCmdsType, context: any) => {
    //jsonValue contains: {_id: d_id, driverNote: string} }
    let result = await client.db('Scheduler').collection('Donations').updateOne({ _id: reqObject.jsonValue._id }, { $set: { driverNote: reqObject.jsonValue.driverNote } })
    return result
}
const items = async (client: any, reqObject: RequestCmdsType, context: any) => {
    //jsonValue contains: {_id: d_id, delivery: deliveryObject, pickup: pickupObject} }
    let result = await client.db('Scheduler').collection('Donations').updateOne({ _id: reqObject.jsonValue._id },
        {
            $set: {
                'delivery.items': reqObject.jsonValue.delivery,
                'pickup.items': reqObject.jsonValue.pickup
            }
        }
    )
    return result
}
const stopUpdate = async (client: any, reqObject: RequestCmdsType, context: any) => {
    //jsonValue contains: {_id: _id, d_id: d_id, status: {code:'completed' | 'rescheduled', date:string, by: string} }
    context.log('reqObject', reqObject)
    let schedDate = await client.db('Scheduler').collection('Dates').findOne({ _id: reqObject.jsonValue._id })
    context.log('schedDate', schedDate)
    let stopNumber = schedDate.stops.find((sf: any) => sf.d_id === reqObject.jsonValue.d_id)
    context.log('stopNumber', stopNumber)
    let result = await client.db('Scheduler').collection('Dates').updateOne({ _id: reqObject.jsonValue._id },
        { $set: { 'stops.$[element].status': { ...reqObject.jsonValue.status } } },
        { arrayFilters: [{ 'element': stopNumber }] }
    )
    return result
}

app.http('putAppt', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: putAppt
});
