import { jiraClient } from '../client/jiraClient.js';
import { handleJiraError } from '../utils/errorHandler.js';
import { GetIssueParams, JiraIssueResponse } from '../types/jira.js';

export const getIssueToolDefinition = {
  name: 'jira_get_issue',
  description: 'Retrieves comprehensive details for a specific Jira issue or asset by its ID or Key (e.g., "PROJ-123" or "10001"). Official API Doc Link: https://developer.atlassian.net/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-get',
  inputSchema: {
    type: 'object',
    properties: {
      issueIdOrKey: {
        type: 'string',
        description: 'The ID or Key of the issue to retrieve (e.g., "PROJ-123" or "10001").'
      }
    },
    required: ['issueIdOrKey']
  }
};

/**
 * Handles the jira_get_issue MCP tool call.
 * Official Endpoint: GET /rest/api/2/issue/{issueIdOrKey}
 */
export async function handleGetIssue(params: GetIssueParams) {
  try {
    const response = await jiraClient.get<JiraIssueResponse>(`/rest/api/2/issue/${params.issueIdOrKey}`);

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
