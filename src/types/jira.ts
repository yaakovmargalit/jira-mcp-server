export interface ADFNode {
  type: string;
  text?: string;
  content?: ADFNode[];
  attrs?: Record<string, any>;
  marks?: Array<{
    type: string;
    attrs?: Record<string, any>;
  }>;
}

export interface ADFDocument {
  version: number;
  type: 'doc';
  content: ADFNode[];
}

export interface CreateIssueParams {
  projectKey: string;
  summary: string;
  description?: string | ADFDocument;
  issueTypeName: string;
  customFields?: Record<string, any>;
}

export interface GetIssueParams {
  issueIdOrKey: string;
}

export interface SearchJqlParams {
  jql: string;
  maxResults?: number;
}

export interface GetCreateMetadataParams {
  projectKeys?: string;
  issueTypeNames?: string;
}

export interface GetCreateIssueMetaFieldsParams {
  projectIdOrKey: string;
  issueTypeId: string;
  startAt?: number;
  maxResults?: number;
}

export interface GetProjectIssueTypesParams {
  projectIdOrKey: string;
  startAt?: number;
  maxResults?: number;
}

// Jira API Response Interfaces (Partial representation based on required fields)
export interface JiraIssueResponse {
  id: string;
  key: string;
  self: string;
  fields: Record<string, any>;
}

export interface JiraSearchResponse {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: JiraIssueResponse[];
}

export interface JiraCreateMetaResponse {
  expand: string;
  projects: Array<{
    self: string;
    id: string;
    key: string;
    name: string;
    avatarUrls: Record<string, string>;
    issuetypes: Array<{
      self: string;
      id: string;
      name: string;
      untranslatedName: string;
      description: string;
      iconUrl: string;
      subtask: boolean;
      expand?: string;
      fields?: Record<string, {
        required: boolean;
        schema: {
          type: string;
          items?: string;
          system?: string;
          custom?: string;
          customId?: number;
        };
        name: string;
        fieldId: string;
        key: string;
        autoCompleteUrl?: string;
        hasDefaultValue?: boolean;
        operations: string[];
        allowedValues?: any[];
        defaultValue?: any;
      }>;
    }>;
  }>;
}
