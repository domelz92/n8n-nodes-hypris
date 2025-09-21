# Podsumowanie zmiany: Record → Item

## Co zostało zmienione:

### 1. **Nazwy plików:**
- `RecordStrategy.ts` → `ItemStrategy.ts`

### 2. **Nazwy klas:**
- `RecordStrategy` → `ItemStrategy`

### 3. **Wartość zasobu:**
- `resource: 'record'` → `resource: 'item'`

### 4. **Etykiety w UI:**
- "Record" → "Item"
- "Create a record" → "Create an item"
- "Delete a record" → "Delete an item"
- "Get many records" → "Get many items"

### 5. **Nazwy parametrów:**
- `recordState` → `itemState`
- `recordFields` → `itemFields`
- `recordIds` → `itemIds`
- `getRecordProperties` → `getItemProperties`

### 6. **Opisy i komentarze:**
- "The state of the new record" → "The state of the new item"
- "Fields values for the new record" → "Fields values for the new item"
- "Comma-separated list of record IDs to delete" → "Comma-separated list of item IDs to delete"

### 7. **Komunikaty błędów:**
- "Error loading record properties" → "Error loading item properties"
- "Error loading properties for records" → "Error loading properties for items"

### 8. **Zmienne wewnętrzne:**
- `recordData` → `itemData`
- `allRecords` → `allItems`

## Dlaczego ta zmiana jest lepsza:
- **Spójność z API** - API Hypris używa terminologii "item" (np. `/database/{id}/item`, `databaseItemIds`)
- **Klarowność** - "Item" lepiej opisuje dowolny element w bazie danych
- **Konsystencja** - wszystkie endpointy API używają słowa "item", nie "record"

## Wpływ na użytkowników:
Użytkownicy zobaczą teraz "Item" zamiast "Record" w interfejsie n8n, co jest bardziej zgodne z terminologią API Hypris.
