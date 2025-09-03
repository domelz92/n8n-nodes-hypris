import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class HyprisApi implements ICredentialType {
    name = 'hyprisApi';
    displayName = 'Hypris API';
    documentationUrl = 'https://hypris.com/docs/api';
    properties: INodeProperties[] = [
        {
            displayName: 'Username',
            name: 'username',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
