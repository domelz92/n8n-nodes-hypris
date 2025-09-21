import type { IDataObject } from 'n8n-workflow';
import type { ResponseParser } from '../types';

export class HyprisResponseParser implements ResponseParser {
	parseResponse(responseData: any, resource: string, operation: string): IDataObject | IDataObject[] {
		// Jeśli nie ma struktury success/data, zwróć surowe dane
		if (!responseData.success || !responseData.data) {
			return responseData;
		}

		const data = responseData.data;

		// Mapowanie odpowiedzi na podstawie zasobu i operacji
		const responseMap: Record<string, string> = {
			'workspace': 'workspaces',
			'database': 'databases',
			'view': 'databaseViews',
			'item': 'items',
			'property': 'properties',
			'resourceItem': 'resourceItems',
		};

		// Specjalna obsługa dla itemów z filter-groups
		if (resource === 'item' && operation === 'getAll') {
			if (data.databaseItemsGroups && Array.isArray(data.databaseItemsGroups)) {
				// Spłaszcz tablicę grup
				const allItems: IDataObject[] = [];
				for (const group of data.databaseItemsGroups) {
					if (Array.isArray(group)) {
						// Mapuj każdy item aby zawierał wszystkie dane
						const mappedItems = group.map((item: any) => {
							const result: IDataObject = {
								id: item.id,
								name: item.name || '',
							};
							
							// Dodaj cellValues jako właściwości
							if (item.cellValuesByPropertyId) {
								Object.entries(item.cellValuesByPropertyId).forEach(([propId, value]) => {
									result[`property_${propId}`] = value as any;
								});
							}
							
							// Dodaj inne metadane
							if (item.createdAt) result.createdAt = item.createdAt;
							if (item.updatedAt) result.updatedAt = item.updatedAt;
							if (item.state) result.state = item.state;
							
							return result;
						});
						allItems.push(...mappedItems);
					}
				}
				return allItems;
			} else if (data.items) {
				return data.items;
			}
		}

		// Specjalna obsługa dla baz danych pobieranych z resource-items
		if (resource === 'database' && operation === 'getAll' && data.resourceItems) {
			const resourceItems = data.resourceItems as IDataObject[];
			return resourceItems.filter((item: IDataObject) => {
				const resourceEntity = item.resourceEntity as IDataObject;
				return resourceEntity?.resourceType === 'database';
			});
		}

		// Standardowe mapowanie
		const key = responseMap[resource];
		if (key && data[key]) {
			return data[key];
		}

		// Zwróć całe dane jeśli nie znaleziono mapowania
		return data;
	}
}
