import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DonorsType } from "../types";
var MongoClient = require('mongodb').MongoClient;

export async function getConstituent(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const client = new MongoClient(process.env.ATLAS_URI)
    const _id = request.query.get('phone')
    const zip = request.query.get('zip')

    const donorInitialValue: DonorsType = {
        _id: "",
        anonymous: false,
        name: {
            first: "",
            last: "",
            company: ""
        },
        phone: _id || "",
        email: "",
        zip: zip || "",
        place: {
            addr: "",
            lat: 0,
            lng: 0,
            num: "",
            route: "",
            city: "",
            state: "",
            c_cd: "",
            c_nm: "",
            zip: "",
            address2: ""
        },
        donations: []
    }
    await client.connect()
    try {
        var retVal = {}
        const constituent = await client.db('Scheduler').collection('Donors').find({ _id: _id }).toArray()
        context.log('constituent', constituent)
        if (constituent.length > 0) {
            const donations = await client.db('Scheduler').collection('Donations').find({ _donorKey: constituent[0]._id }).toArray()
            context.log('donations', donations)
            const appointments = await client.db('Scheduler').collection('Appts').find({ _donorKey: constituent[0]._id }).toArray()
            context.log('donations', appointments)
            retVal = { appts: appointments ? appointments : [], donor: constituent ? constituent[0] : donorInitialValue, donations: donations.length > 0 ? [...donations] : [] }
        } else {
            retVal = { appts: [], donor: donorInitialValue, donations: [] }
        }
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

app.http('getConstituent', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: getConstituent
});
