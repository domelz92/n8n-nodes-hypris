import type { IRequestOptions } from 'n8n-workflow';
import type { HyprisCredentials, OperationResult, RequestBuilder } from '../types';

export class HyprisRequestBuilder implements RequestBuilder {
	buildRequest(result: OperationResult, credentials: HyprisCredentials): IRequestOptions {
		const options: IRequestOptions = {
			method: result.method,
			uri: `${credentials.baseUrl}${result.endpoint}`,
			json: true,
			auth: {
				user: credentials.username,
				pass: credentials.password,
			},
		};

		if (result.body) {
			options.body = result.body;
		}

		return options;
	}
}
