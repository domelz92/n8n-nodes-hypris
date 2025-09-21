# Jak przetestować węzeł Hypris w n8n

## 1. Instalacja w n8n (lokalnie)

### Opcja A: Link symboliczny (zalecane dla developmentu)
```bash
# Przejdź do folderu z custom nodes n8n
cd ~/.n8n/nodes

# Stwórz link symboliczny do Twojego projektu
ln -s /Users/dominikborsa/Documents/projekty/hypris/n8n-nodes-hypris n8n-nodes-hypris

# Restart n8n
```

### Opcja B: Kopiowanie plików
```bash
# Skopiuj pliki do folderu n8n
cp -r /Users/dominikborsa/Documents/projekty/hypris/n8n-nodes-hypris ~/.n8n/nodes/

# Restart n8n
```

## 2. Restart n8n
```bash
# Zatrzymaj n8n (Ctrl+C jeśli działa w terminalu)
# Uruchom ponownie
n8n
```

## 3. Co przetestować

### Workspace Operations:
- ✅ **Get Many** - pobierz listę workspace'ów
- ✅ **Create** - stwórz nowy workspace
- ✅ **Rename** - zmień nazwę workspace

### Database Operations:
- ✅ **Get Many** - pobierz bazy danych z workspace
- ✅ **Create** - stwórz nową bazę danych

### Item Operations (dawniej Record):
- ✅ **Get Many** - pobierz itemy z bazy
  - Sprawdź czy "Include All Fields" działa poprawnie
  - Powinny zwracać się pełne dane z cellValues
- ✅ **Create** - stwórz nowy item
  - Dynamiczne pola - automatycznie pobiera kolumny!
  - Wybierz stan: published/draft
- ✅ **Delete** - usuń itemy po ID

### View Operations:
- ✅ **Get Many** - pobierz widoki
- ✅ **Create** - stwórz nowy widok (table, kanban, etc.)
- ✅ **Update** - zmień nazwę widoku

### Property Operations:
- ✅ **Get Many** - pobierz właściwości bazy
- ✅ **Create** - dodaj nową właściwość
- ✅ **Delete** - usuń właściwość

### Resource Item Operations:
- ✅ **Get Many** - pobierz elementy zasobów
- ✅ **Rename** - zmień nazwę elementu

## 4. Przykładowy workflow testowy

1. **Dodaj węzeł Hypris**
2. **Skonfiguruj credentials** (URL, username, password)
3. **Test podstawowy:**
   - Resource: Workspace
   - Operation: Get Many
   - Execute

4. **Test tworzenia itemu:**
   - Resource: Item
   - Operation: Create
   - Wybierz Workspace i Database
   - Kliknij "Add Field" - powinny się załadować kolumny!
   - Dodaj wartości dla pól
   - Execute

## 5. Troubleshooting

- **Węzeł się nie pojawia**: Sprawdź czy n8n został zrestartowany
- **Błąd credentials**: Sprawdź URL (bez slash na końcu), username, password
- **Puste cellValues**: Upewnij się, że "Include All Fields" jest włączone

## 6. Logi debugowania

W kodzie są console.log które pokazują:
- Full URL żądania
- Method (GET, POST, etc.)

Możesz je zobaczyć w konsoli gdzie uruchomiłeś n8n.
