# Architektura węzła Hypris

## Przegląd

Kod węzła Hypris został zrefaktoryzowany z użyciem następujących wzorców projektowych:

### 1. **Strategy Pattern**
Każdy zasób (workspace, database, record, view, property, resourceItem) ma swoją własną strategię implementującą interfejs `ResourceStrategy`.

```
strategies/
├── BaseStrategy.ts         - Klasa bazowa dla wszystkich strategii
├── WorkspaceStrategy.ts    - Obsługa operacji na workspace
├── DatabaseStrategy.ts     - Obsługa operacji na bazach danych
├── RecordStrategy.ts       - Obsługa operacji na rekordach
├── ViewStrategy.ts         - Obsługa operacji na widokach
├── PropertyStrategy.ts     - Obsługa operacji na właściwościach
├── ResourceItemStrategy.ts - Obsługa operacji na elementach zasobów
└── StrategyFactory.ts      - Fabryka tworzenia strategii
```

### 2. **Single Responsibility Principle**
Każda klasa ma jedną odpowiedzialność:
- `HyprisRequestBuilder` - budowanie żądań HTTP
- `HyprisResponseParser` - parsowanie odpowiedzi API
- Strategie - obsługa logiki biznesowej dla konkretnych zasobów

### 3. **Factory Pattern**
`StrategyFactory` tworzy odpowiednie strategie na podstawie typu zasobu.

## Dodawanie nowego zasobu

1. Stwórz nową strategię w `strategies/`:
```typescript
export class NewResourceStrategy extends BaseResourceStrategy {
    executeOperation(operation: string, context: OperationContext): OperationResult {
        // implementacja
    }
}
```

2. Dodaj strategię do `StrategyFactory`:
```typescript
private static strategies: Record<string, ResourceStrategy> = {
    // ...
    newResource: new NewResourceStrategy(),
};
```

3. Dodaj definicje parametrów w głównym pliku `Hypris.node.ts`.

## Struktura plików

```
Hypris/
├── types/
│   └── index.ts           - Definicje typów TypeScript
├── utils/
│   ├── RequestBuilder.ts  - Budowanie żądań HTTP
│   └── ResponseParser.ts  - Parsowanie odpowiedzi
├── strategies/
│   └── ...               - Implementacje strategii
└── Hypris.node.ts        - Główny plik węzła
```

## Zalety nowej architektury

1. **Łatwiejsze utrzymanie** - każdy zasób ma swoją własną klasę
2. **Rozszerzalność** - łatwe dodawanie nowych zasobów i operacji
3. **Testowalność** - każda klasa może być testowana niezależnie
4. **Czytelność** - kod jest bardziej zorganizowany i łatwiejszy do zrozumienia
5. **DRY** - wspólna logika jest w klasie bazowej i utility
