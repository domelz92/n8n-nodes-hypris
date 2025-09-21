import type { IDataObject, IRequestOptions } from 'n8n-workflow';

export interface HyprisCredentials {
	baseUrl: string;
	username: string;
	password: string;
}

export interface OperationContext {
	credentials: HyprisCredentials;
	parameters: IDataObject;
	itemIndex: number;
}

export interface OperationResult {
	endpoint: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: IDataObject;
}

export interface ResourceStrategy {
	executeOperation(operation: string, context: OperationContext): OperationResult;
}

export interface ResponseParser {
	parseResponse(responseData: any, resource: string, operation: string): IDataObject | IDataObject[];
}

export interface RequestBuilder {
	buildRequest(result: OperationResult, credentials: HyprisCredentials): IRequestOptions;
}
