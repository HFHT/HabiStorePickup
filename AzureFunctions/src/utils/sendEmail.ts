import { emailFill, theDate, theTime } from "."
const { EmailClient, KnownEmailSendStatus } = require("@azure/communication-email");

export type RequestCmdsType = {
    cmd: any,
    jsonValue: { _id: string, d_id: string }
}
const connectionString = process.env.AzureCommunications
const senderAddress = process.env.AzureEmailSender
const POLLER_WAIT_TIME = 10

export async function sendEmail(client: any, reqObject: RequestCmdsType, context: any) {
    const donor = await client.db('Scheduler').collection('Donors').findOne({ _id: reqObject.jsonValue._id })
    const donation = await client.db('Scheduler').collection('Donations').findOne({ _id: reqObject.jsonValue.d_id })
    if (!donor || !donation) return 'email not sent'
    if (donation.type === 'pickup') {
        const template = await client.db('Habitat').collection('Templates').findOne({ _id: 'storeEmailDonationReceipt' })
        if (!template) return 'email not sent, missing template.'
        const printOutput = emailFill(template.template, donation.pickup.items.filter((pif: any) => pif.c), {
            DATE: theDate(), TIME: theTime(), NAME: `${donor.name.first} ${donor.name.last}`,
            COMPANY: donor.name.company ? donor.name.company : '',
            ADDRESS: `${donor.place.num} ${donor.place.route}`,
            CITY: donor.place.city,
            STATE: donor.place.state,
            ZIP: donor.place.zip
        })

        const message = {
            senderAddress: senderAddress,
            recipients: {
                to: [{ address: donor.email }],
                bcc: [{ address: process.env.AzureEmailBcc }]
            },
            content: {
                subject: 'HabiStore donation receipt.',
                plainText: '',
                html: printOutput
            },
        }
        try {
            const client = new EmailClient(connectionString);
            const poller = await client.beginSend(message);
            if (!poller.getOperationState().isStarted) {
                throw "Poller was not started."
            }

            let timeElapsed = 0;
            while (!poller.isDone()) {
                poller.poll();
                context.log("Email send polling in progress");

                await new Promise(resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
                timeElapsed += 10;

                if (timeElapsed > 18 * POLLER_WAIT_TIME) {
                    throw "Polling timed out.";
                }
            }

            if (poller.getResult().status === KnownEmailSendStatus.Succeeded) {
                context.log(`Successfully sent the email (operation id: ${poller.getResult().id})`);
                return `Successfully sent the email (operation id: ${poller.getResult().id})`
            }
            else {
                throw poller.getResult().error;

            }
        } catch (error: any) {
            return `Send of email, failed! ${error.message}`
        }
    }
    return 'delivery email sent.'
}
