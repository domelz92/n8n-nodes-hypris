import { BaseResourceStrategy } from './BaseStrategy';
import type { OperationContext, OperationResult } from '../types';

export class ViewStrategy extends BaseResourceStrategy {
	executeOperation(operation: string, context: OperationContext): OperationResult {
		const databaseId = this.getParameter(context, 'databaseId');

		switch (operation) {
			case 'getAll':
				return this.getAll(databaseId);
			case 'create':
				return this.create(databaseId, context);
			case 'update':
				return this.update(context);
			default:
				throw new Error(`Nieobsługiwana operacja: ${operation}`);
		}
	}

	private getAll(databaseId: string): OperationResult {
		return this.createResult(`/database/${databaseId}/views`, 'GET');
	}

	private create(databaseId: string, context: OperationContext): OperationResult {
		const viewName = this.getParameter(context, 'viewName');
		const viewType = this.getParameter(context, 'viewType');
		return this.createResult(
			`/database/${databaseId}/view`,
			'POST',
			{ name: viewName, type: viewType }
		);
	}

	private update(context: OperationContext): OperationResult {
		const viewId = this.getParameter(context, 'viewId');
		const newViewName = this.getParameter(context, 'newViewName');
		return this.createResult(
			`/view/${viewId}`,
			'PATCH',
			{ name: newViewName }
		);
	}
}
