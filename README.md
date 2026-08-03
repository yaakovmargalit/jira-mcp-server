# Jira Cloud MCP Server

A production-ready, clean, and modular Model Context Protocol (MCP) server that enables LLMs to communicate directly with the official **Jira Cloud REST API v3** using standard STDIO transport. Built using TypeScript strict mode and `axios`.

## Features
- **jira_get_create_metadata**: Inspect projects, issue types, field requirements, and custom field IDs (`customfield_XXXXX`).
- **jira_get_create_issue_meta_fields**: Fetch the field configurations and custom fields for a specific project and issue type when creating an issue (granular and high-performance alternative).
- **jira_get_project_issue_types**: Fetch all issue types available for a specific project, including their IDs (used to retrieve metadata fields).
- **jira_create_issue**: Create new tickets, automatically converting plain text descriptions into the required Jira Cloud Atlassian Document Format (ADF). Supports optional custom fields.
- **jira_get_issue**: Fetch complete details for a ticket using its ID or Key.
- **jira_search_jql**: Query issues using Jira Query Language (JQL) with customizable limits.
- **jira_find_users**: Search for Jira users to retrieve their unique `accountId` (required for assigning issues or setting user fields in Jira v3).
- **jira_get_transitions**: Retrieve the workflow transitions and statuses available for a specific issue, along with their `transitionId`s.
- **jira_transition_issue**: Transition an issue to a new status (e.g., "Done", "QA") using a transition ID.

---

## Configuration & Authentication

The server supports both **Jira Data Center** (PAT Bearer Token) and **Jira Cloud** (Basic Auth).

### Jira Data Center (PAT Authentication - Recommended)
Define these environment variables:
| Environment Variable | Description | Example |
|----------------------|-------------|---------|
| `JIRA_HOST` | The root URL of your Jira Data Center instance | `https://jira.yourcompany.com` |
| `JIRA_API_TOKEN` | Your Personal Access Token (PAT) | `NjkxODMy...` |

> [!TIP]
> To create a PAT in Jira Data Center, navigate to **Profile > Personal Access Tokens** and click **Create token**. Keep `JIRA_EMAIL` undefined (or do not set it) to trigger Bearer Token authentication.

### Jira Cloud (Basic Auth)
Define these environment variables:
| Environment Variable | Description | Example |
|----------------------|-------------|---------|
| `JIRA_HOST` | The root URL of your Jira Cloud instance | `https://your-domain.atlassian.net` |
| `JIRA_EMAIL` | The email associated with your Atlassian account | `user@company.com` |
| `JIRA_API_TOKEN` | Atlassian API Token | `ATATT...` |

---

## Local Setup & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory for local testing:

**Jira Data Center (PAT):**
```env
JIRA_HOST=https://jira.yourcompany.com
JIRA_API_TOKEN=your-personal-access-token
# Leave JIRA_EMAIL blank or omit it
```

**Jira Cloud (Basic):**
```env
JIRA_HOST=https://your-domain.atlassian.net
JIRA_EMAIL=user@company.com
JIRA_API_TOKEN=your-api-token
```

### 3. Build the Server
Compiles the TypeScript source files into executable ESM JavaScript in the `dist/` directory:
```bash
npm run build
```

---

## Direct Execution (npx)

Once built or published, the server can be executed directly using Node.js:

```bash
# Run the local build
node bin/index.js
```

Or run via `npx` (if published or linked):
```bash
npx jira-mcp-server
```

---

## Client Integration

To connect this MCP server to a client (e.g., Claude Desktop, Cursor, or Antigravity), use the following configuration layouts.

### Claude Desktop Integration

Add the configuration snippet below to your Claude Desktop config file:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "jira-mcp-server": {
      "command": "node",
      "args": [
        "/absolute/path/to/jira-mcp/bin/index.js"
      ],
      "env": {
        "JIRA_HOST": "https://your-domain.atlassian.net",
        "JIRA_EMAIL": "user@company.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

### Cursor / Antigravity Integration

Configure a command-based MCP server in your IDE:
- **Type:** `command`
- **Command:** `node /absolute/path/to/jira-mcp/bin/index.js`
- Set the environment variables `JIRA_HOST`, `JIRA_EMAIL`, and `JIRA_API_TOKEN` in your system or project configuration.

---

## Publishing to Corporate JFrog Artifactory

To distribute this package inside your organization using JFrog Artifactory as your private NPM registry:

### 1. Configure the Target Registry
Add a `publishConfig` object to your [package.json](file:///Users/yaakov.margalit/dev/jira-mcp/package.json) to redirect publishing to Artifactory:
```json
"publishConfig": {
  "registry": "https://<your-jfrog-domain>/artifactory/api/npm/<npm-repository-name>/"
}
```

Alternatively, create a `.npmrc` file in the root of the project:
```ini
registry=https://<your-jfrog-domain>/artifactory/api/npm/<npm-repository-name>/
```

### 2. Authenticate with JFrog Artifactory
Log in to your private registry using your corporate credentials:
```bash
npm login --registry=https://<your-jfrog-domain>/artifactory/api/npm/<npm-repository-name>/
```

### 3. Build & Publish
Compile the TypeScript code and upload the package:
```bash
npm run build
npm publish
```

### 4. Consume via `npx`
To run the server dynamically using `npx` from your private JFrog repository, specify the registry parameter:
```bash
npx --registry=https://<your-jfrog-domain>/artifactory/api/npm/<npm-repository-name>/ jira-mcp-server
```

*(Optional)* If you set your global npm registry configuration to point to your Artifactory NPM proxy (which resolves both local and public NPM packages):
```bash
npm config set registry https://<your-jfrog-domain>/artifactory/api/npm/<npm-repository-name>/
npx jira-mcp-server
```

