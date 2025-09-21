import { BaseResourceStrategy } from './BaseStrategy';
import type { OperationContext, OperationResult } from '../types';

export class ResourceItemStrategy extends BaseResourceStrategy {
	executeOperation(operation: string, context: OperationContext): OperationResult {
		const workspaceId = this.getParameter(context, 'workspaceId');

		switch (operation) {
			case 'getAll':
				return this.getAll(workspaceId);
			case 'rename':
				return this.rename(context);
			default:
				throw new Error(`Nieobsługiwana operacja: ${operation}`);
		}
	}

	private getAll(workspaceId: string): OperationResult {
		return this.createResult(`/workspace/${workspaceId}/resource-items`, 'GET');
	}

	private rename(context: OperationContext): OperationResult {
		const resourceItemId = this.getParameter(context, 'resourceItemId');
		const newName = this.getParameter(context, 'newName');
		return this.createResult(
			`/resource-item/${resourceItemId}/name`,
			'PUT',
			{ name: newName }
		);
	}
}
