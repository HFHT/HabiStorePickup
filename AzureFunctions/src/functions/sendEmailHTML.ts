import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
const { EmailClient, KnownEmailSendStatus } = require("@azure/communication-email");

//Send the following in the body of a post
//{to:'xyz@xyz.com', subject:'Hi', content: HTML document

const connectionString = process.env.AzureCommunications
const senderAddress = process.env.AzureEmailSender
const POLLER_WAIT_TIME = 10

type eMailReqType = {
    to: string
    subject: string
    content: string            
}
async function sendEmailHTML(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const req = await request.json() as eMailReqType

    const message = {
        senderAddress: senderAddress,
        recipients: {
            to: [{ address: req.to }],
            bcc: [{ address: process.env.AzureEmailBcc }]
        },
        content: {
            subject: req.subject,
            plainText: '',
            html: req.content
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
            return { body: JSON.stringify(poller.getResult().id), status: 200 }
        }
        else {
            throw poller.getResult().error;

        }
    } catch (error) {
        context.error(error)
        return { body: JSON.stringify({ err: true, error: error }), status: 501 }
    }
};

app.http('sendEmailHTML', {
    methods: ['POST'], authLevel: 'anonymous', handler: sendEmailHTML
});
