import { jiraClient } from '../client/jiraClient.js';
import { handleJiraError } from '../utils/errorHandler.js';
import { GetProjectIssueTypesParams } from '../types/jira.js';

export const getProjectIssueTypesToolDefinition = {
  name: 'jira_get_project_issue_types',
  description: 'Fetches the issue types available within a specific project, including their IDs (required for calling jira_get_create_issue_meta_fields). Official API Doc Link: https://developer.atlassian.net/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-createmeta-projectidorkey-issuetypes-get',
  inputSchema: {
    type: 'object',
    properties: {
      projectIdOrKey: {
        type: 'string',
        description: 'The project ID or key (e.g., "10000" or "PROJ").'
      },
      startAt: {
        type: 'number',
        description: 'The index of the first item to return in a page of results (default is 0).'
      },
      maxResults: {
        type: 'number',
        description: 'The maximum number of items to return per page (default is 50, maximum is 50).'
      }
    },
    required: ['projectIdOrKey']
  }
};

/**
 * Handles the jira_get_project_issue_types MCP tool call.
 * Official Endpoint: GET /rest/api/3/issue/createmeta/{projectIdOrKey}/issuetypes
 */
export async function handleGetProjectIssueTypes(params: GetProjectIssueTypesParams) {
  try {
    const queryParams: Record<string, any> = {};
    if (params.startAt !== undefined) {
      queryParams.startAt = params.startAt;
    }
    if (params.maxResults !== undefined) {
      queryParams.maxResults = params.maxResults;
    }

    const response = await jiraClient.get(
      `/rest/api/3/issue/createmeta/${params.projectIdOrKey}/issuetypes`,
      { params: queryParams }
    );

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
