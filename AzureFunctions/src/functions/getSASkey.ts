// NOT USED

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function getSASkey(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

    const { StorageSharedKeyCredential, generateBlobSASQueryParameters, ContainerSASPermissions } = require('@azure/storage-blob');

    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    const containerName = request.query.get('cont');

    const sasOptions = {
        containerName,
        permissions: ContainerSASPermissions.parse("r"), // Read permissions
        startsOn: new Date(),
        expiresOn: new Date(new Date().getHours() + 4) // 4 hours
    };

    const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
    const sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}/{blobName}?${sasToken}`;

    return {
        status: 200,
        body: JSON.stringify({ sasKey: sasToken, url: sasUrl })
    };
};

app.http('getSASkey', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getSASkey
});
