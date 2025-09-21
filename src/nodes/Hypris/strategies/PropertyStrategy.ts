import { BaseResourceStrategy } from './BaseStrategy';
import type { OperationContext, OperationResult } from '../types';

export class PropertyStrategy extends BaseResourceStrategy {
	executeOperation(operation: string, context: OperationContext): OperationResult {
		const databaseId = this.getParameter(context, 'databaseId');

		switch (operation) {
			case 'getAll':
				return this.getAll(databaseId);
			case 'create':
				return this.create(databaseId, context);
			case 'delete':
				return this.delete(context);
			default:
				throw new Error(`Nieobsługiwana operacja: ${operation}`);
		}
	}

	private getAll(databaseId: string): OperationResult {
		return this.createResult(`/database/${databaseId}/properties?includeDrafts=true`, 'GET');
	}

	private create(databaseId: string, context: OperationContext): OperationResult {
		const propertyType = this.getParameter(context, 'propertyType');
		const propertyTitle = this.getParameter(context, 'propertyTitle');
		return this.createResult(
			`/database/${databaseId}/property`,
			'POST',
			{ 
				type: propertyType, 
				title: propertyTitle, 
				state: 'published' 
			}
		);
	}

	private delete(context: OperationContext): OperationResult {
		const propertyId = this.getParameter(context, 'propertyId');
		return this.createResult(`/property/${propertyId}`, 'DELETE');
	}
}
