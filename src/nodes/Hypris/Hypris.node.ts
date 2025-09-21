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
import { StrategyFactory } from './strategies';
import { HyprisRequestBuilder, HyprisResponseParser } from './utils';
import type { HyprisCredentials, OperationContext } from './types';

export class Hypris implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Hypris',
		name: 'hypris',
		icon: 'file:hypris.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Interact with the Hypris API',
		defaults: {
			name: 'Hypris',
		},
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		// @ts-ignore
		inputs: ['main'],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
		// @ts-ignore
		outputs: ['main'],
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
						name: 'Database',
						value: 'database',
					},
					{
						name: 'Item',
						value: 'item',
					},
					{
						name: 'Property',
						value: 'property',
					},
					{
						name: 'Resource Item',
						value: 'resourceItem',
					},
					{
						name: 'View',
						value: 'view',
					},
					{
						name: 'Workspace',
						value: 'workspace',
					},
				],
				default: 'database',
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
						name: 'Create',
						value: 'create',
						description: 'Create a workspace',
						action: 'Create a workspace',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many workspaces',
						action: 'Get many workspaces',
					},
					{
						name: 'Rename',
						value: 'rename',
						description: 'Rename a workspace',
						action: 'Rename a workspace',
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
			
			// ITEM OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['item'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create an item',
						action: 'Create an item',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an item',
						action: 'Delete an item',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many items',
						action: 'Get many items',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an item',
						action: 'Update an item',
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
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many properties',
						action: 'Get many properties',
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
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many resource items in a workspace',
						action: 'Get many resource items',
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
						resource: ['database', 'item', 'record', 'view', 'property', 'resourceItem'],
					},
					hide: {
						resource: ['workspace'],
					},
				},
				description: 'The workspace to operate on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getWorkspaces',
				},
			},
			{
				displayName: 'Workspace Name or ID',
				name: 'workspaceId',
				type: 'options',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['workspace'],
						operation: ['rename'],
					},
				},
				description: 'The workspace to rename. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
							resource: ['item', 'view', 'property'],
						},
					},
				description: 'The database to operate on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getDatabases',
					loadOptionsDependsOn: ['workspaceId'],
				},
			},
			
			// ===================================
			// Workspace Parameters
			// ===================================
			{
				displayName: 'Workspace Name',
				name: 'workspaceName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['workspace'],
						operation: ['create'],
					},
				},
				description: 'Name for the new workspace',
			},
			{
				displayName: 'New Workspace Name',
				name: 'newWorkspaceName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['workspace'],
						operation: ['rename'],
					},
				},
				description: 'New name for the workspace',
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
			// Item Parameters
			// ===================================
			{
				displayName: 'Item State',
				name: 'itemState',
				type: 'options',
				options: [
					{
						name: 'Published',
						value: 'published',
					},
					{
						name: 'Draft',
						value: 'draft',
					},
				],
				default: 'published',
					displayOptions: {
						show: {
							resource: ['item'],
							operation: ['create'],
						},
					},
					description: 'The state of the new item',
				},
				{
					displayName: 'Item Fields',
					name: 'itemFields',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add Field',
				default: {},
					displayOptions: {
						show: {
							resource: ['item'],
							operation: ['create'],
						},
					},
					options: [
						{
							name: 'field',
							displayName: 'Field',
							values: [
								{
									displayName: 'Property Name or ID',
									name: 'propertyId',
									type: 'options',
									default: '',
									description: 'Choose property from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
									typeOptions: {
										loadOptionsMethod: 'getItemProperties',
										loadOptionsDependsOn: ['databaseId'],
									},
								},
								{
									displayName: 'Value Name or ID',
									name: 'value',
									type: 'options',
									default: '',
									description: 'The value for this field. For select fields, choose from dropdown. For other fields, type the value or use an expression. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
									typeOptions: {
										loadOptionsMethod: 'getPropertyValueOptions',
										loadOptionsDependsOn: ['propertyId'],
									},
								},
							],
						},
					],
					description: 'Fields values for the new item',
			},
			{
				displayName: 'Include All Fields',
				name: 'includeAllFields',
				type: 'boolean',
				default: true,
					displayOptions: {
						show: {
							resource: ['item'],
							operation: ['getAll'],
						},
					},
					description: 'Whether to include all field values in the response',
				},
				{
					displayName: 'Item IDs',
					name: 'itemIds',
				type: 'string',
				default: '',
				required: true,
					displayOptions: {
						show: {
							resource: ['item'],
							operation: ['delete'],
						},
					},
					description: 'Comma-separated list of item IDs to delete',
			},
			{
				displayName: 'Item ID',
				name: 'itemId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['update'],
					},
				},
				description: 'ID of the item to update',
			},
			{
				displayName: 'Item State',
				name: 'itemState',
				type: 'options',
				options: [
					{
						name: 'Published',
						value: 'published',
					},
					{
						name: 'Draft',
						value: 'draft',
					},
				],
				default: 'published',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['update'],
					},
				},
				description: 'The state of the item',
			},
			{
				displayName: 'Item Fields',
				name: 'itemFields',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['update'],
					},
				},
				options: [
					{
						name: 'field',
						displayName: 'Field',
						values: [
							{
								displayName: 'Property Name or ID',
								name: 'propertyId',
								type: 'options',
								default: '',
								description: 'Choose property from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
								typeOptions: {
									loadOptionsMethod: 'getItemProperties',
									loadOptionsDependsOn: ['databaseId'],
								},
							},
							{
								displayName: 'Value Name or ID',
								name: 'value',
								type: 'options',
								default: '',
								description: 'The value for this field. For select fields, choose from dropdown. For other fields, type the value or use an expression. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
								typeOptions: {
									loadOptionsMethod: 'getPropertyValueOptions',
									loadOptionsDependsOn: ['propertyId'],
								},
							},
						],
					},
				],
				description: 'Fields values to update',
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
				let workspaceId: string;
				try {
					workspaceId = this.getNodeParameter('workspaceId') as string;
					
					if (!workspaceId) {
						return [];
					}
				} catch (error) {
					// If workspaceId parameter is not available yet, return empty array
					return [];
				}
				
				const credentials = await this.getCredentials('hyprisApi');
				const baseUrl = credentials.baseUrl as string;
				const username = credentials.username as string;
				const password = credentials.password as string;

				const options: IRequestOptions = {
					method: 'GET',
					uri: `${baseUrl}/workspace/${workspaceId}/resource-items?includeDrafts=false`,
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
					uri: `${baseUrl}/database/${databaseId}/properties?includeDrafts=false`,
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
					uri: `${baseUrl}/workspace/${workspaceId}/resource-items?includeDrafts=false`,
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
			
				async getItemProperties(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
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
					uri: `${baseUrl}/database/${databaseId}/properties?includeDrafts=false`,
					json: true,
					auth: { user: username, pass: password },
				};

				try {
					const response = await this.helpers.request(options);
					const properties = response.data?.properties || [];
					
					// Przechowaj pełne dane properties w kontekście węzła
					const context = this.getNode();
					if (!context.parameters) {
						context.parameters = {};
					}
					context.parameters._propertiesData = properties;
					
					return properties.map((prop: IDataObject) => {
						let name = prop.title as string || prop.type as string || prop.id as string;
						const type = prop.type as string;
						
						// Dodaj informację o typie pola
						if (type) {
							name += ` (${type})`;
						}
						
						// Dla pól typu select, dodaj dostępne opcje
						if (type === 'select' && prop.metadata) {
							const metadata = prop.metadata as IDataObject;
							const options = metadata.options as Array<{value: string, label: string}> || [];
							if (options.length > 0) {
								const optionsList = options.map(opt => opt.label || opt.value).join(', ');
								name += ` [${optionsList}]`;
							}
						}
						
						return {
							name,
							value: prop.id as string,
							description: `Type: ${type}`,
						};
					});
					} catch (error) {
						console.error('Error loading item properties:', error);
					return [];
				}
			},
			
			async getPropertyOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const propertyId = this.getCurrentNodeParameter('propertyId') as string;
				const context = this.getNode();
				
				if (!propertyId || !context.parameters?._propertiesData) {
					return [];
				}
				
				const propertiesData = context.parameters._propertiesData as IDataObject[];
				const property = propertiesData.find(p => p.id === propertyId);
				
				if (!property || property.type !== 'select' || !property.metadata) {
					return [];
				}
				
				const metadata = property.metadata as IDataObject;
				const options = metadata.options as Array<{value: string, label: string}> || [];
				
				return options.map(opt => ({
					name: opt.label || opt.value,
					value: opt.value,
				}));
			},
			
			async getPropertyValueOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				// Pobierz aktualnie wybraną property
				const propertyId = this.getCurrentNodeParameter('propertyId') as string;
				const databaseId = this.getNodeParameter('databaseId') as string;
				
				if (!propertyId || !databaseId) {
					return [];
				}
				
				try {
					// Pobierz informacje o properties
					const credentials = await this.getCredentials('hyprisApi');
					const baseUrl = credentials.baseUrl as string;
					const username = credentials.username as string;
					const password = credentials.password as string;
					
					const options: IRequestOptions = {
						method: 'GET',
						uri: `${baseUrl}/database/${databaseId}/properties?includeDrafts=false`,
						json: true,
						auth: { user: username, pass: password },
					};
					
					const response = await this.helpers.request(options);
					const properties = response.data?.properties || [];
					
					// Znajdź naszą property
					const property = properties.find((p: IDataObject) => p.id === propertyId);
					
					if (!property) {
						return [];
					}
					
					// Dla pól select zwracamy opcje
					if (property.type === 'select' && property.metadata) {
						const metadata = property.metadata as IDataObject;
						const selectOptions = metadata.options as Array<{value: string, label: string}> || [];
						
						return selectOptions.map(opt => ({
							name: opt.label || opt.value,
							value: opt.value,
						}));
					}
					
					// Dla innych typów pól zwracamy przykładowe wartości
					if (property.type === 'checkbox') {
						return [
							{ name: 'True', value: 'true' },
							{ name: 'False', value: 'false' },
						];
					}
					
					// Dla pozostałych typów zwracamy pustą listę - użytkownik może wpisać własną wartość
					return [];
				} catch (error) {
					console.error('Error loading property value options:', error);
					return [];
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		
		const credentials = await this.getCredentials('hyprisApi') as HyprisCredentials;
		const requestBuilder = new HyprisRequestBuilder();
		const responseParser = new HyprisResponseParser();

		for (let i = 0; i < items.length; i++) {
			try {
				// Pobierz wszystkie parametry dla bieżącego elementu
				const parameters: IDataObject = {};
				const node = this.getNode();
				
				// Dynamicznie zbierz wszystkie parametry
				if (node.parameters) {
					for (const [key, value] of Object.entries(node.parameters)) {
						try {
							parameters[key] = this.getNodeParameter(key, i, value);
						} catch (e) {
							// Parametr może nie być dostępny dla tej operacji
						}
					}
				}


				// Jeśli pobieramy itemy z włączoną opcją "Include All Fields", 
				// najpierw pobierz wszystkie właściwości bazy danych
				if (resource === 'item' && operation === 'getAll' && parameters.includeAllFields) {
					const databaseId = parameters.databaseId as string;
					if (databaseId) {
						try {
							const propertiesOptions: IRequestOptions = {
								method: 'GET',
								uri: `${credentials.baseUrl}/database/${databaseId}/properties?includeDrafts=false`,
								json: true,
								auth: {
									user: credentials.username,
									pass: credentials.password,
								},
							};
							
							const propertiesResponse = await this.helpers.request(propertiesOptions);
							const properties = propertiesResponse.data?.properties || [];
							
							// Zbierz ID wszystkich właściwości
							parameters._propertyIds = properties.map((prop: IDataObject) => prop.id as string);
							} catch (error) {
								console.error('Error loading properties for items:', error);
							// Kontynuuj bez właściwości jeśli wystąpił błąd
							parameters._propertyIds = [];
						}
					}
				}

				// Stwórz kontekst operacji
				const context: OperationContext = {
					credentials,
					parameters,
					itemIndex: i,
				};

				// Pobierz odpowiednią strategię i wykonaj operację
				const strategy = StrategyFactory.getStrategy(resource);
				const result = strategy.executeOperation(operation, context);

				// Zbuduj żądanie
				const options = requestBuilder.buildRequest(result, credentials);

				// Wykonaj żądanie
				const responseData = await this.helpers.request(options);
				
				// Parsuj odpowiedź
				const dataToReturn = responseParser.parseResponse(responseData, resource, operation);
				
				// Dodaj dane do zwrócenia
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
