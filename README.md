# n8n-nodes-hypris

This is an n8n community node. It lets you use Hypris in your n8n workflows.

[Hypris](https://hypris.com) is a collaborative workspace platform that helps teams organize and manage their data.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Workspace
- Get All - List all workspaces

### Database  
- Get All - List all databases in a workspace
- Create - Create a new database

### Record
- Get All - Get all records from a database  
- Create - Create a new record
- Delete - Delete records

### View
- Get All - List all views in a database
- Create - Create a new view
- Rename - Rename a view

### Property
- Get All - Get all properties from a database
- Create - Create a new property
- Delete - Delete a property

### Resource Item
- Get All - List all resource items in a workspace
- Rename - Rename a resource item

## Credentials

To use this node, you need to create credentials in n8n:
1. Go to Credentials > New
2. Select "Hypris API" 
3. Enter your:
   - Base URL (e.g., https://api.hypris.com/v1)
   - Username
   - Password

## Compatibility

- Tested with n8n version 1.110.1 and above

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Hypris API documentation](https://docs.hypris.com/api)

## License

[MIT](https://github.com/domelz92/n8n-nodes-hypris/blob/main/LICENSE)