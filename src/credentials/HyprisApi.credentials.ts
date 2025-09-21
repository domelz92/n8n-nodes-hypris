import type {
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
	ICredentialTestFunctions,
} from 'n8n-workflow';

export class HyprisApi implements ICredentialType {
	name = 'hyprisApi';
	displayName = 'Hypris API';
	documentationUrl = 'httpsDocsHyprisComApi'; // TODO: Zaktualizuj na rzeczywisty URL dokumentacji Hypris API
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.hypris.com/v1',
			description: 'Base URL for Hypris API',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			description: 'Username for Hypris API authentication',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Password for Hypris API authentication',
			required: true,
		},
	];

	// Test connection method
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/me/workspaces',
			method: 'GET',
			auth: {
				username: '={{$credentials.username}}',
				password: '={{$credentials.password}}',
			},
		},
	};
}
