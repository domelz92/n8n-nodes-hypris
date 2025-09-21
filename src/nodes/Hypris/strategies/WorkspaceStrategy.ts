import { BaseResourceStrategy } from './BaseStrategy';
import type { OperationContext, OperationResult } from '../types';

export class WorkspaceStrategy extends BaseResourceStrategy {
	executeOperation(operation: string, context: OperationContext): OperationResult {
		switch (operation) {
			case 'getAll':
				return this.getAll();
			case 'create':
				return this.create(context);
			case 'rename':
				return this.rename(context);
			default:
				throw new Error(`Nieobsługiwana operacja: ${operation}`);
		}
	}

	private getAll(): OperationResult {
		return this.createResult('/me/workspaces', 'GET');
	}

	private create(context: OperationContext): OperationResult {
		const workspaceName = this.getParameter(context, 'workspaceName');
		return this.createResult(
			'/workspace',
			'POST',
			{ name: workspaceName }
		);
	}

	private rename(context: OperationContext): OperationResult {
		const workspaceId = this.getParameter(context, 'workspaceId');
		const newWorkspaceName = this.getParameter(context, 'newWorkspaceName');
		return this.createResult(
			`/workspace/${workspaceId}`,
			'PATCH',
			{ name: newWorkspaceName }
		);
	}
}
