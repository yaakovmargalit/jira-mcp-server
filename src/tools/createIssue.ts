import { jiraClient } from '../client/jiraClient.js';
import { handleJiraError } from '../utils/errorHandler.js';
import { CreateIssueParams, JiraIssueResponse } from '../types/jira.js';

export const createIssueToolDefinition = {
  name: 'jira_create_issue',
  description: 'Creates a new issue, task, bug, or custom asset issue in Jira Cloud. Note: Description must be in Atlassian Document Format (ADF) - if you provide a plain string, this tool will automatically wrap it into a valid ADF paragraph node for you. Official API Doc Link: https://developer.atlassian.net/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-post',
  inputSchema: {
    type: 'object',
    properties: {
      projectKey: {
        type: 'string',
        description: 'The key of the project to create the issue in (e.g., "PROJ").'
      },
      summary: {
        type: 'string',
        description: 'A brief summary/title of the issue.'
      },
      description: {
        type: ['string', 'object'],
        description: 'The description of the issue. Can be a plain string (which will be auto-converted to ADF) or a full Atlassian Document Format (ADF) object.'
      },
      issueTypeName: {
        type: 'string',
        description: 'The name of the issue type (e.g., "Task", "Bug", "Story", "Epic").'
      },
      customFields: {
        type: 'object',
        description: 'Optional custom fields key-value pairs (e.g., {"customfield_10010": "Value"}).'
      }
    },
    required: ['projectKey', 'summary', 'issueTypeName']
  }
};

/**
 * Handles the jira_create_issue MCP tool call.
 * Official Endpoint: POST /rest/api/3/issue
 */
export async function handleCreateIssue(params: CreateIssueParams) {
  try {
    let descriptionPayload: any = undefined;

    if (params.description) {
      if (typeof params.description === 'string') {
        descriptionPayload = {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: params.description
                }
              ]
            }
          ]
        };
      } else {
        descriptionPayload = params.description;
      }
    }

    const fieldsPayload: Record<string, any> = {
      project: {
        key: params.projectKey
      },
      summary: params.summary,
      issuetype: {
        name: params.issueTypeName
      }
    };

    if (descriptionPayload !== undefined) {
      fieldsPayload.description = descriptionPayload;
    }

    // Merge in custom fields or other field overrides
    if (params.customFields && typeof params.customFields === 'object') {
      Object.assign(fieldsPayload, params.customFields);
    }

    const response = await jiraClient.post<JiraIssueResponse>('/rest/api/3/issue', {
      fields: fieldsPayload
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
