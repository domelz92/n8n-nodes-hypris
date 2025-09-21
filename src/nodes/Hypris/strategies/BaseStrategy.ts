import type { OperationContext, OperationResult, ResourceStrategy } from '../types';

export abstract class BaseResourceStrategy implements ResourceStrategy {
	abstract executeOperation(operation: string, context: OperationContext): OperationResult;

	protected getParameter(context: OperationContext, paramName: string): any {
		return context.parameters[paramName];
	}

	protected createResult(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', body?: any): OperationResult {
		const result: OperationResult = { endpoint, method };
		if (body) {
			result.body = body;
		}
		return result;
	}
}
