import { jiraClient } from '../client/jiraClient.js';
import { handleJiraError } from '../utils/errorHandler.js';
import { GetCreateMetadataParams, JiraCreateMetaResponse } from '../types/jira.js';

export const getMetaToolDefinition = {
  name: 'jira_get_create_metadata',
  description: 'Fetches creation metadata and field configurations for a specific project and issue type, including custom fields (customfield_XXXXX), required states, and allowed option values. Required to know which fields are expected and what their types are before creating an issue. Official API Doc Link: https://developer.atlassian.net/cloud/jira/platform/rest/v3/api-group-issue-creation-metadata/#api-rest-api-3-issue-createmeta-get',
  inputSchema: {
    type: 'object',
    properties: {
      projectKeys: {
        type: 'string',
        description: 'Comma-separated list of project keys (e.g., "PROJ,TEST").'
      },
      issueTypeNames: {
        type: 'string',
        description: 'Comma-separated list of issue type names (e.g., "Bug,Task,Story").'
      }
    }
  }
};

/**
 * Handles the jira_get_create_metadata MCP tool call.
 * Official Endpoint: GET /rest/api/2/issue/createmeta
 */
export async function handleGetCreateMetadata(params: GetCreateMetadataParams) {
  try {
    const queryParams: Record<string, string> = {
      expand: 'projects.issuetypes.fields'
    };
    if (params.projectKeys) {
      queryParams.projectKeys = params.projectKeys;
    }
    if (params.issueTypeNames) {
      queryParams.issueTypeNames = params.issueTypeNames;
    }

    const response = await jiraClient.get<JiraCreateMetaResponse>('/rest/api/2/issue/createmeta', {
      params: queryParams
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }
      ]
    };
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: handleJiraError(error)
        }
      ]
    };
  }
}
