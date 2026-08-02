import { jiraClient } from '../client/jiraClient.js';
import { handleJiraError } from '../utils/errorHandler.js';
import { GetCreateIssueMetaFieldsParams } from '../types/jira.js';

export const getMetaFieldsToolDefinition = {
  name: 'jira_get_create_issue_meta_fields',
  description: 'Fetches the field configurations and custom fields for a specific project and issue type when creating an issue. This is a highly performant and granular alternative to the deprecated global getCreateMetadata endpoint. Official API Doc Link: https://developer.atlassian.net/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-createmeta-projectidorkey-issuetypes-issuetypeid-get',
  inputSchema: {
    type: 'object',
    properties: {
      projectIdOrKey: {
        type: 'string',
        description: 'The project ID or key (e.g., "10000" or "PROJ").'
      },
      issueTypeId: {
        type: 'string',
        description: 'The ID of the issue type (e.g., "10001").'
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
    required: ['projectIdOrKey', 'issueTypeId']
  }
};

/**
 * Handles the jira_get_create_issue_meta_fields MCP tool call.
 * Official Endpoint: GET /rest/api/3/issue/createmeta/{projectIdOrKey}/issuetypes/{issueTypeId}
 */
export async function handleGetCreateIssueMetaFields(params: GetCreateIssueMetaFieldsParams) {
  try {
    const queryParams: Record<string, any> = {};
    if (params.startAt !== undefined) {
      queryParams.startAt = params.startAt;
    }
    if (params.maxResults !== undefined) {
      queryParams.maxResults = params.maxResults;
    }

    const response = await jiraClient.get(
      `/rest/api/3/issue/createmeta/${params.projectIdOrKey}/issuetypes/${params.issueTypeId}`,
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
