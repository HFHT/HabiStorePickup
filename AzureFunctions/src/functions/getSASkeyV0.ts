import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

const { StorageSharedKeyCredential, generateBlobSASQueryParameters, ContainerSASPermissions } = require('@azure/storage-blob');

export async function getSASkeyV0(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const containerName = request.query.get('cont');
    const permissions = 'c'
    const url = `${process.env.AZURE_STORAGE_ACCOUNT_URL}/${containerName}`
    const sharedKeyCredential = new StorageSharedKeyCredential(process.env.AZURE_STORAGE_ACCOUNT_NAME, process.env.AZURE_STORAGE_ACCOUNT_KEY);
    context.log(sharedKeyCredential)
    var expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 2);

    const sasKey = generateBlobSASQueryParameters({
        containerName: containerName,
        permissions: ContainerSASPermissions.parse(permissions),
        expiresOn: expiryDate,
    }, sharedKeyCredential);

    return {
        status: 200,
        body: JSON.stringify({sasKey: sasKey.toString(), url: url})
    };
};

app.http('getSASkeyV0', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getSASkeyV0
});
