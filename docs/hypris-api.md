# Hypris API Endpoints

## Authorization

- **Basic Auth**: `login` and `password` via Authorization header.

## Spaces

### Create Space
- `POST {{base_url}}/workspace/{{workspace_id}}/resource-space`

### Rename Space
- `PUT {{base_url}}/resource-space/{{space_id}}/name`
  - Body: `{"name":"Nowa nazwa"}`

### List User Workspaces
- `GET {{base_url}}/me/workspaces`

## Resource Items

### List Resource Items in Workspace
- `GET {{base_url}}/workspace/{{workspace_id}}/resource-items`

### Rename Resource Item
- `PUT {{base_url}}/resource-item/{{resourceItemId}}/name`
  - Body: `{"name":"Nowa nazwa"}`

## Databases

### Create Database
- `POST {{base_url}}/database`

### List Databases in Workspace
- `GET {{base_url}}/workspace/{{workspace_id}}/databases`

### Rename Database
- `PUT {{base_url}}/resource-item/{{resourceItemIdForRename}}/name`
  - Body: `{"name":"Twoja Nowa Nazwa Bazy Danych"}`

## Database Items

### Add Record
- `POST {{base_url}}/database/{{database_id}}/item`
  - Body example:
    ```json
    {
      "state": "published",
      "cellValues": {},
      "filter": null,
      "search": null,
      "id": null
    }
    ```

### Get Records via Filter Groups
- `GET {{base_url}}/database/{{database_id}}/items/filter-groups?sortDirection=1`

## Views

### List Views
- `GET {{base_url}}/database/{{database_id}}/views`

### Create View (Table/Map/Kanban/Timeline/Calendar)
- `POST {{base_url}}/database/{{database_id}}/view`
  - Body varies by type, e.g.:
    - `{"name":"kanban","type":"kanban","filterQuery":null,"position":3}`

### Rename View
- `PATCH {{base_url}}/view/{{view_id}}`
  - Body: `{"name":"Nowa nazwa"}`

## Properties

### Create Property
- `POST {{base_url}}/database/{{database_id}}/property`
  - Example body for teleport:
    `{"type":"teleport","state":"published","title":"Teleport test"}`

### Update Property (Time Tracker)
- `PATCH {{base_url}}/property/{{timeTrackerPropertyId}}`

### Update Property (Boolean)
- `PATCH {{base_url}}/property/{{booleanPropertyId}}`
  - Body: `{"title":"Nowy boolean","state":"published","metadata":{"type":"boolean"}}`

### Delete Property
- `DELETE {{base_url}}/property/{{propertyIdDelete}}`

## Filters

### Create Filter Definition
- `POST {{base_url}}/filter`

## Conversations

### Create Conversation
- `POST {{base_url}}/workspace/{{workspace_id}}/conversation`

### Find Conversation Resource Item
- `GET {{base_url}}/workspace/{{workspace_id}}/resource-items`

### Rename Conversation
- `PUT {{base_url}}/resource-item/{{conversationResourceItemId}}/name`
  - Body: `{"name":"Zmieniona nazwa konwersacji"}`

## Calls

### Create Call
- `POST {{base_url}}/workspace/{{workspace_id}}/call`

### Rename Call
- `PUT {{base_url}}/resource-item/{{dashboard_id}}/name`
  - Body: `{"name":"12334"}`

## Notes

- Many resources are renamed via the generic `PUT /resource-item/{id}/name` endpoint.
- Use filter definitions with database items for advanced querying.

