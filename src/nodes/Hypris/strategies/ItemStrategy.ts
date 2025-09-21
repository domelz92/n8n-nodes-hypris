import { BaseResourceStrategy } from './BaseStrategy';
import type { OperationContext, OperationResult } from '../types';
import type { IDataObject } from 'n8n-workflow';

export class ItemStrategy extends BaseResourceStrategy {
	private static readonly DEFAULT_ITEM_STATE = 'published';
	private static readonly DEFAULT_LIMIT = 100;

	executeOperation(operation: string, context: OperationContext): OperationResult {
		const databaseId = this.getParameter(context, 'databaseId');

		switch (operation) {
			case 'getAll':
				return this.getAll(databaseId, context);
			case 'create':
				return this.create(databaseId, context);
			case 'update':
				return this.update(databaseId, context);
			case 'delete':
				return this.delete(databaseId, context);
			default:
				throw new Error(`Nieobsługiwana operacja: ${operation}`);
		}
	}
	
	/**
	 * Przetwarza pojedynczą wartość pola, konwertując string na odpowiedni typ
	 */
	private processFieldValue(rawValue: any): any {
		if (rawValue === undefined || rawValue === '') {
			return rawValue;
		}
		
		let value = rawValue;
		
		// Próbuj przekonwertować boolean
		if (value === 'true' || value === 'false') {
			return value === 'true';
		}
		
		// Próbuj przekonwertować liczbę
		if (!isNaN(Number(value)) && value !== '' && typeof value === 'string' && !value.includes(' ')) {
			const numValue = Number(value);
			// Sprawdź czy to rzeczywiście liczba (nie NaN)
			if (!isNaN(numValue)) {
				return numValue;
			}
		}
		
		return value;
	}
	
	/**
	 * Przetwarza wszystkie pola itemu, konwertując wartości na odpowiednie typy
	 */
	private processCellValues(itemFields: { field?: Array<{ propertyId: string; value: any }> }): IDataObject {
		const cellValues: IDataObject = {};
		
		if (itemFields.field) {
			for (const field of itemFields.field) {
				if (field.propertyId && field.value !== undefined && field.value !== '') {
					cellValues[field.propertyId] = this.processFieldValue(field.value);
				}
			}
		}
		
		return cellValues;
	}

	private getAll(databaseId: string, context: OperationContext): OperationResult {
		const includeAllFields = this.getParameter(context, 'includeAllFields');
		const propertyIds = this.getParameter(context, '_propertyIds') as string[] || [];
		
		// Struktura dla filter-groups powinna zawierać databasePropertyIds w każdej grupie
		const filterGroups = [{
			filters: [],
			offset: 0,
			limit: ItemStrategy.DEFAULT_LIMIT,
			databasePropertyIds: includeAllFields ? propertyIds : []
		}];
		
		return this.createResult(
			`/database/${databaseId}/items/filter-groups?sortDirection=1`,
			'POST',
			{
				filterGroups
			}
		);
	}

	private create(databaseId: string, context: OperationContext): OperationResult {
		const itemState = this.getParameter(context, 'itemState') || ItemStrategy.DEFAULT_ITEM_STATE;
		const itemFields = this.getParameter(context, 'itemFields') as { field?: Array<{ propertyId: string; value: any }> } || {};
		
		const cellValues = this.processCellValues(itemFields);
		
		const itemData = {
			state: itemState,
			cellValues,
		};
		
		return this.createResult(
			`/database/${databaseId}/item`,
			'POST',
			itemData
		);
	}

	private update(databaseId: string, context: OperationContext): OperationResult {
		const itemId = this.getParameter(context, 'itemId') as string;
		const itemState = this.getParameter(context, 'itemState') || ItemStrategy.DEFAULT_ITEM_STATE;
		const itemFields = this.getParameter(context, 'itemFields') as { field?: Array<{ propertyId: string; value: any }> } || {};
		
		const cellValues = this.processCellValues(itemFields);
		
		const itemData = {
			state: itemState,
			cellValues,
			filter: null,
			search: null,
			id: itemId,
		};
		
		return this.createResult(
			`/database/${databaseId}/item`,
			'POST',
			itemData
		);
	}

	private delete(databaseId: string, context: OperationContext): OperationResult {
		const itemIds = this.getParameter(context, 'itemIds') as string;
		const ids = itemIds.split(',').map(id => id.trim()).filter(id => id);
		
		return this.createResult(
			`/database/${databaseId}/items`,
			'DELETE',
			{
				ids
			}
		);
	}
}