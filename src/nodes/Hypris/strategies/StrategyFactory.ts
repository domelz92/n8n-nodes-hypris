import type { ResourceStrategy } from '../types';
import { WorkspaceStrategy } from './WorkspaceStrategy';
import { DatabaseStrategy } from './DatabaseStrategy';
import { ItemStrategy } from './ItemStrategy';
import { ViewStrategy } from './ViewStrategy';
import { PropertyStrategy } from './PropertyStrategy';
import { ResourceItemStrategy } from './ResourceItemStrategy';

export class StrategyFactory {
	private static strategies: Record<string, ResourceStrategy> = {
		workspace: new WorkspaceStrategy(),
		database: new DatabaseStrategy(),
		item: new ItemStrategy(),
		view: new ViewStrategy(),
		property: new PropertyStrategy(),
		resourceItem: new ResourceItemStrategy(),
	};

	static getStrategy(resource: string): ResourceStrategy {
		const strategy = this.strategies[resource];
		if (!strategy) {
			throw new Error(`Nieobsługiwany zasób: ${resource}`);
		}
		return strategy;
	}
}
