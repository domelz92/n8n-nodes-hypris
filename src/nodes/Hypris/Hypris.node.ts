import {
    NodeConnectionType,
    type IDataObject,
    type IExecuteFunctions,
    type INodeExecutionData,
    type INodeType,
    type INodeTypeDescription,
    type IRequestOptions,
} from 'n8n-workflow';

export class Hypris implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Hypris',
        name: 'hypris',
        icon: 'file:hypris.svg',
        group: ['transform'],
        version: 1,
        description: 'Interact with the Hypris API',
        defaults: {
            name: 'Hypris',
        },
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        credentials: [
            {
                name: 'hyprisApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        name: 'List Workspaces',
                        value: 'listWorkspaces',
                        description: 'Return workspaces of the current user',
                    },
                    {
                        name: 'List Databases',
                        value: 'listDatabases',
                        description: 'Return databases in a workspace',
                    },
                    {
                        name: 'List Views',
                        value: 'listViews',
                        description: 'Return views in a database',
                    },
                    {
                        name: 'List Records',
                        value: 'listRecords',
                        description: 'Return records in a database',
                    },
                ],
                default: 'listWorkspaces',
            },
            {
                displayName: 'Workspace ID',
                name: 'workspaceId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: ['listDatabases'],
                    },
                },
            },
            {
                displayName: 'Database ID',
                name: 'databaseId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: ['listViews', 'listRecords'],
                    },
                },
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const operation = this.getNodeParameter('operation', 0) as string;
        const credentials = await this.getCredentials('hyprisApi');
        const username = credentials.username as string;
        const password = credentials.password as string;

        let endpoint = '';
        if (operation === 'listWorkspaces') {
            endpoint = '/me/workspaces';
        } else if (operation === 'listDatabases') {
            const workspaceId = this.getNodeParameter('workspaceId', 0) as string;
            endpoint = `/workspace/${workspaceId}/databases`;
        } else if (operation === 'listViews') {
            const databaseId = this.getNodeParameter('databaseId', 0) as string;
            endpoint = `/database/${databaseId}/views`;
        } else if (operation === 'listRecords') {
            const databaseId = this.getNodeParameter('databaseId', 0) as string;
            endpoint = `/database/${databaseId}/items/filter-groups`;
        }

        const options: IRequestOptions = {
            method: 'GET',
            uri: `https://api.hypris.com${endpoint}`,
            json: true,
            auth: {
                user: username,
                pass: password,
            },
        };

        const responseData = await this.helpers.request(options);
        return [this.helpers.returnJsonArray(responseData as IDataObject[])];
    }
}

