import axios from 'axios';
import { config } from '../config/env.js';

const basicAuthToken = Buffer.from(`${config.JIRA_EMAIL}:${config.JIRA_API_TOKEN}`).toString('base64');

export const jiraClient = axios.create({
  baseURL: config.JIRA_HOST,
  headers: {
    'Authorization': `Basic ${basicAuthToken}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});
