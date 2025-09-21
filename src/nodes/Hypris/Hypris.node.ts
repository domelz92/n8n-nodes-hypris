import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IRequestOptions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeProperties,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class Hypris implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Hypris',
		name: 'hypris',
		icon: 'file:hypris.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
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
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Workspace',
						value: 'workspace',
					},
					{
						name: 'Database',
						value: 'database',
					},
					{
						name: 'Record',
						value: 'record',
					},
					{
						name: 'View',
						value: 'view',
					},
					{
						name: 'Property',
						value: 'property',
					},
					{
						name: 'Resource Item',
						value: 'resourceItem',
					},
				],
				default: 'workspace',
				description: 'The resource to operate on',
			},
			
			// WORKSPACE OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['workspace'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many workspaces',
						action: 'Get many workspaces',
					},
				],
				default: 'getAll',
			},
			
			// DATABASE OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['database'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a database',
						action: 'Create a database',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many databases',
						action: 'Get many databases',
					},
				],
				default: 'getAll',
			},
			
			// RECORD OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['record'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a record',
						action: 'Create a record',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a record',
						action: 'Delete a record',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many records',
						action: 'Get many records',
					},
				],
				default: 'getAll',
			},
			
			// VIEW OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['view'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a view',
						action: 'Create a view',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many views',
						action: 'Get many views',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a view',
						action: 'Update a view',
					},
				],
				default: 'getAll',
			},
			
			// PROPERTY OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['property'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a property',
						action: 'Create a property',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a property',
						action: 'Delete a property',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all properties',
						action: 'Get all properties',
					},
				],
				default: 'create',
			},
			
			// RESOURCE ITEM OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['resourceItem'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all resource items in a workspace',
						action: 'Get all resource items',
					},
					{
						name: 'Rename',
						value: 'rename',
						description: 'Rename a resource item',
						action: 'Rename a resource item',
					},
				],
				default: 'getAll',
			},
			
			// ===================================
			// Common Parameters
			// ===================================
			{
				displayName: 'Workspace Name or ID',
				name: 'workspaceId',
				type: 'options',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['database', 'record', 'view', 'property', 'resourceItem'],
					},
				},
				description: 'The workspace to operate on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getWorkspaces',
				},
			},
			{
				displayName: 'Database Name or ID',
				name: 'databaseId',
				type: 'options',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['record', 'view', 'property'],
					},
				},
				description: 'The database to operate on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getDatabases',
					loadOptionsDependsOn: ['workspaceId'],
				},
			},
			
			// ===================================
			// Database Parameters
			// ===================================
			{
				displayName: 'Database Name',
				name: 'databaseName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['database'],
						operation: ['create'],
					},
				},
				description: 'Name for the new database',
			},
			
			// ===================================
			// Record Parameters
			// ===================================
			{
				displayName: 'Record Data',
				name: 'recordData',
				type: 'json',
				default: '{\n  "state": "published",\n  "cellValues": {}\n}',
				required: true,
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['create'],
					},
				},
				description: 'The data for the new record',
			},
			{
				displayName: 'Record IDs',
				name: 'recordIds',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['record'],
						operation: ['delete'],
					},
				},
				description: 'Comma-separated list of record IDs to delete',
			},
			
			// ===================================
			// View Parameters
			// ===================================
			{
				displayName: 'View Name',
				name: 'viewName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['view'],
						operation: ['create'],
					},
				},
				description: 'Name for the new view',
			},
			{
				displayName: 'View Type',
				name: 'viewType',
				type: 'options',
				options: [
					{ name: 'Calendar', value: 'calendar' },
					{ name: 'Kanban', value: 'kanban' },
					{ name: 'Map', value: 'map' },
					{ name: 'Table', value: 'table' },
					{ name: 'Timeline', value: 'timeline' },
				],
				default: 'table',
				required: true,
				displayOptions: {
					show: {
						resource: ['view'],
						operation: ['create'],
					},
				},
				description: 'Type of view to create',
			},
			{
				displayName: 'View Name or ID',
				name: 'viewId',
				type: 'options',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['view'],
						operation: ['update'],
					},
				},
				description: 'The view to update. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getViews',
					loadOptionsDependsOn: ['databaseId'],
				},
			},
			{
				displayName: 'New View Name',
				name: 'newViewName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['view'],
						operation: ['update'],
					},
				},
				description: 'New name for the view',
			},
			
			// ===================================
			// Property Parameters
			// ===================================
			{
				displayName: 'Property Type',
				name: 'propertyType',
				type: 'options',
				options: [
					{ name: 'Auto ID', value: 'auto-id' },
					{ name: 'Boolean', value: 'boolean' },
					{ name: 'Checklist', value: 'checklist' },
					{ name: 'Comments', value: 'comments' },
					{ name: 'Created At', value: 'created-at' },
					{ name: 'Date', value: 'date' },
					{ name: 'Date Range', value: 'date-range' },
					{ name: 'Dropdown', value: 'dropdown' },
					{ name: 'Email', value: 'mail' },
					{ name: 'Files', value: 'files' },
					{ name: 'Formula', value: 'formula' },
					{ name: 'ID', value: 'id' },
					{ name: 'Link', value: 'link' },
					{ name: 'Location', value: 'location' },
					{ name: 'Long Text', value: 'long-text' },
					{ name: 'Number', value: 'number' },
					{ name: 'People', value: 'people' },
					{ name: 'Phone', value: 'phone' },
					{ name: 'Random ID', value: 'random-id' },
					{ name: 'Rating', value: 'rating' },
					{ name: 'Relation', value: 'relation' },
					{ name: 'Reverse Relation', value: 'reverse-relation' },
					{ name: 'Rich Text', value: 'rich-text' },
					{ name: 'Status', value: 'status' },
					{ name: 'Teleport', value: 'teleport' },
					{ name: 'Text', value: 'text' },
					{ name: 'Time', value: 'time' },
					{ name: 'Time Tracker', value: 'time-tracker' },
					{ name: 'Updated At', value: 'updated-at' },
				],
				default: 'text',
				required: true,
				displayOptions: {
					show: {
						resource: ['property'],
						operation: ['create'],
					},
				},
				description: 'Type of property to create',
			},
			{
				displayName: 'Property Title',
				name: 'propertyTitle',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['property'],
						operation: ['create'],
					},
				},
				description: 'Title for the new property',
			},
			{
				displayName: 'Property Name or ID',
				name: 'propertyId',
				type: 'options',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['property'],
						operation: ['delete'],
					},
				},
				description: 'The property to delete. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getProperties',
					loadOptionsDependsOn: ['databaseId'],
				},
			},
				
			// ===================================
			// Resource Item Parameters
			// ===================================
			{
				displayName: 'Resource Item Name or ID',
				name: 'resourceItemId',
				type: 'options',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['resourceItem'],
						operation: ['rename'],
					},
				},
				description: 'The resource item to rename. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getResourceItems',
					loadOptionsDependsOn: ['workspaceId'],
				},
			},
			{
				displayName: 'New Name',
				name: 'newName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['resourceItem'],
						operation: ['rename'],
					},
				},
				description: 'The new name for the resource item',
			},
		],
	};

	methods = {
		loadOptions: {
			async getWorkspaces(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('hyprisApi');
				const baseUrl = credentials.baseUrl as string;
				const username = credentials.username as string;
				const password = credentials.password as string;

				const options: IRequestOptions = {
					method: 'GET',
					uri: `${baseUrl}/me/workspaces`,
					json: true,
					auth: { user: username, pass: password },
				};

				const response = await this.helpers.request(options);
				const workspaces = response.data?.workspaces || [];
				
				return workspaces.map((ws: IDataObject) => ({
					name: ws.title as string || ws.name as string || ws.id as string,
					value: ws.id as string,
				}));
			},
			
			async getDatabases(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const workspaceId = this.getNodeParameter('workspaceId') as string;
				
				if (!workspaceId) {
					return [];
				}
				
				const credentials = await this.getCredentials('hyprisApi');
				const baseUrl = credentials.baseUrl as string;
				const username = credentials.username as string;
				const password = credentials.password as string;

				const options: IRequestOptions = {
					method: 'GET',
					uri: `${baseUrl}/workspace/${workspaceId}/resource-items`,
					json: true,
					auth: { user: username, pass: password },
				};

				try {
					const response = await this.helpers.request(options);
					const resourceItems = response.data?.resourceItems || [];
					
					// Filter only databases
					const databases = resourceItems.filter((item: IDataObject) => {
						const resourceEntity = item.resourceEntity as IDataObject;
						return resourceEntity?.resourceType === 'database';
					});
					
					return databases.map((item: IDataObject) => {
						const resourceEntity = item.resourceEntity as IDataObject;
						const payload = resourceEntity?.payload as IDataObject;
						return {
							name: item.name as string || payload?.title as string || payload?.id as string,
							value: resourceEntity?.resourceId as string,
						};
					});
				} catch (error) {
					console.error('Error loading databases:', error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					throw new NodeOperationError(this.getNode(), `Failed to load databases: ${errorMessage}`);
				}
			},
			
			async getViews(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const databaseId = this.getNodeParameter('databaseId') as string;
				
				if (!databaseId) {
					return [];
				}
				
				const credentials = await this.getCredentials('hyprisApi');
				const baseUrl = credentials.baseUrl as string;
				const username = credentials.username as string;
				const password = credentials.password as string;

				const options: IRequestOptions = {
					method: 'GET',
					uri: `${baseUrl}/database/${databaseId}/views`,
					json: true,
					auth: { user: username, pass: password },
				};

				try {
					const response = await this.helpers.request(options);
					const views = response.data?.databaseViews || [];
					
					return views.map((view: IDataObject) => ({
						name: view.name as string || view.type as string || view.id as string,
						value: view.id as string,
					}));
				} catch (error) {
					console.error('Error loading views:', error);
					return [];
				}
			},
			
			async getProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const databaseId = this.getNodeParameter('databaseId') as string;
				
				if (!databaseId) {
					return [];
				}
				
				const credentials = await this.getCredentials('hyprisApi');
				const baseUrl = credentials.baseUrl as string;
				const username = credentials.username as string;
				const password = credentials.password as string;

				const options: IRequestOptions = {
					method: 'GET',
					uri: `${baseUrl}/database/${databaseId}/properties`,
					json: true,
					auth: { user: username, pass: password },
				};

				const response = await this.helpers.request(options);
				const properties = response.data?.properties || [];
				
				return properties.map((prop: IDataObject) => ({
					name: prop.title as string || prop.type as string || prop.id as string,
					value: prop.id as string,
				}));
			},
			
			async getResourceItems(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const workspaceId = this.getNodeParameter('workspaceId') as string;
				
				if (!workspaceId) {
					return [];
				}
				
				const credentials = await this.getCredentials('hyprisApi');
				const baseUrl = credentials.baseUrl as string;
				const username = credentials.username as string;
				const password = credentials.password as string;

				const options: IRequestOptions = {
					method: 'GET',
					uri: `${baseUrl}/workspace/${workspaceId}/resource-items`,
					json: true,
					auth: { user: username, pass: password },
				};

				const response = await this.helpers.request(options);
				const resourceItems = response.data?.resourceItems || [];
				
				return resourceItems.map((item: IDataObject) => ({
					name: item.name as string || item.id as string,
					value: item.id as string,
				}));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		
		const credentials = await this.getCredentials('hyprisApi');
		const baseUrl = credentials.baseUrl as string;
		const username = credentials.username as string;
		const password = credentials.password as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let endpoint = '';
				const options: IRequestOptions = {
					method: 'GET',
					uri: '',
					json: true,
					auth: {
						user: username,
						pass: password,
					},
				};

				// WORKSPACE OPERATIONS
				if (resource === 'workspace') {
					if (operation === 'getAll') {
						endpoint = '/me/workspaces';
					}
				}
				
				// DATABASE OPERATIONS
				else if (resource === 'database') {
					const workspaceId = this.getNodeParameter('workspaceId', i) as string;
					
					if (operation === 'getAll') {
						endpoint = `/workspace/${workspaceId}/resource-items`;
					} else if (operation === 'create') {
						const databaseName = this.getNodeParameter('databaseName', i) as string;
						endpoint = `/workspace/${workspaceId}/database`;
						options.method = 'POST';
						options.body = { title: databaseName };
					}
				}
				
				// RECORD OPERATIONS
				else if (resource === 'record') {
					const databaseId = this.getNodeParameter('databaseId', i) as string;
					console.log('Database ID for records:', databaseId);
					
					if (operation === 'getAll') {
						endpoint = `/database/${databaseId}/items/filter-groups?sortDirection=1`;
						options.method = 'POST';
						options.body = {
							databasePropertyIds: [],
							filterGroups: [{
								filters: [],
								offset: 0,
								limit: 100
							}]
						};
					} else if (operation === 'create') {
						const recordData = this.getNodeParameter('recordData', i, {}) as IDataObject;
						endpoint = `/database/${databaseId}/item`;
						options.method = 'POST';
						options.body = recordData;
					} else if (operation === 'delete') {
						const recordIds = this.getNodeParameter('recordIds', i) as string;
						const recordIdArray = recordIds.split(',').map(id => id.trim());
						endpoint = `/database/${databaseId}/items`;
						options.method = 'DELETE';
						options.body = { databaseItemIds: recordIdArray };
					}
				}
				
				// VIEW OPERATIONS
				else if (resource === 'view') {
					const databaseId = this.getNodeParameter('databaseId', i) as string;
					
					if (operation === 'getAll') {
						endpoint = `/database/${databaseId}/views`;
					} else if (operation === 'create') {
						const viewName = this.getNodeParameter('viewName', i) as string;
						const viewType = this.getNodeParameter('viewType', i) as string;
						endpoint = `/database/${databaseId}/view`;
						options.method = 'POST';
						options.body = { name: viewName, type: viewType };
					} else if (operation === 'update') {
						const viewId = this.getNodeParameter('viewId', i) as string;
						const newViewName = this.getNodeParameter('newViewName', i) as string;
						endpoint = `/view/${viewId}`;
						options.method = 'PATCH';
						options.body = { name: newViewName };
					}
				}
				
				// PROPERTY OPERATIONS
				else if (resource === 'property') {
					const databaseId = this.getNodeParameter('databaseId', i) as string;
					
					if (operation === 'create') {
						const propertyType = this.getNodeParameter('propertyType', i) as string;
						const propertyTitle = this.getNodeParameter('propertyTitle', i) as string;
						endpoint = `/database/${databaseId}/property`;
						options.method = 'POST';
						options.body = { type: propertyType, title: propertyTitle, state: 'published' };
					} else if (operation === 'delete') {
						const propertyId = this.getNodeParameter('propertyId', i) as string;
						endpoint = `/property/${propertyId}`;
						options.method = 'DELETE';
					} else if (operation === 'getAll') {
						endpoint = `/database/${databaseId}/properties?includeDrafts=true`;
					}
				}
				
				// RESOURCE ITEM OPERATIONS
				else if (resource === 'resourceItem') {
					const workspaceId = this.getNodeParameter('workspaceId', i) as string;
					
					if (operation === 'getAll') {
						endpoint = `/workspace/${workspaceId}/resource-items`;
					} else if (operation === 'rename') {
						const resourceItemId = this.getNodeParameter('resourceItemId', i) as string;
						const newName = this.getNodeParameter('newName', i) as string;
						endpoint = `/resource-item/${resourceItemId}/name`;
						options.method = 'PUT';
						options.body = { name: newName };
					}
				}

				options.uri = `${baseUrl}${endpoint}`;
				console.log('Full URL:', options.uri);
				console.log('Method:', options.method);
				const responseData = await this.helpers.request(options);
				
				// Handle Hypris API response structure
				let dataToReturn: IDataObject | IDataObject[];
				
				if (responseData.success && responseData.data) {
					if (responseData.data.workspaces) {
						dataToReturn = responseData.data.workspaces;
					} else if (responseData.data.databases) {
						dataToReturn = responseData.data.databases;
					} else if (responseData.data.databaseViews) {
						dataToReturn = responseData.data.databaseViews;
					} else if (responseData.data.records) {
						dataToReturn = responseData.data.records;
					} else if (responseData.data.items) {
						dataToReturn = responseData.data.items;
					} else if (responseData.data.properties) {
						dataToReturn = responseData.data.properties;
					} else if (responseData.data.resourceItems && resource === 'database' && operation === 'getAll') {
						// Filter only databases from resource items
						const resourceItems = responseData.data.resourceItems as IDataObject[];
						dataToReturn = resourceItems.filter((item: IDataObject) => {
							const resourceEntity = item.resourceEntity as IDataObject;
							return resourceEntity?.resourceType === 'database';
						});
					} else {
						dataToReturn = responseData.data;
					}
				} else {
					dataToReturn = responseData;
				}
				
				if (Array.isArray(dataToReturn)) {
					returnData.push(...dataToReturn.map(item => ({ json: item })));
				} else {
					returnData.push({ json: dataToReturn });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : String(error);
					returnData.push({ json: { error: errorMessage } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
