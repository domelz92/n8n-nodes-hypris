import { BaseResourceStrategy } from './BaseStrategy';
import type { OperationContext, OperationResult } from '../types';

export class DatabaseStrategy extends BaseResourceStrategy {
	executeOperation(operation: string, context: OperationContext): OperationResult {
		const workspaceId = this.getParameter(context, 'workspaceId');

		switch (operation) {
			case 'getAll':
				return this.getAll(workspaceId);
			case 'create':
				return this.create(workspaceId, context);
			default:
				throw new Error(`Nieobsługiwana operacja: ${operation}`);
		}
	}

	private getAll(workspaceId: string): OperationResult {
		return this.createResult(`/workspace/${workspaceId}/resource-items`, 'GET');
	}

	private create(workspaceId: string, context: OperationContext): OperationResult {
		const databaseName = this.getParameter(context, 'databaseName');
		return this.createResult(
			`/workspace/${workspaceId}/database`,
			'POST',
			{ title: databaseName }
		);
	}
}
