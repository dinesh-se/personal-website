import { Octokit } from "octokit";

import { QueryParams, Repos } from '../types/github';

export const getRepos = async (params: QueryParams) => {
  const octokit = new Octokit({ 
    auth: process.env.GITHUB_TOKEN,
  });
  const queryParams = {
    sort: 'updated',
    ...params,
  };
  const queryString = new URLSearchParams(queryParams).toString();
  
  const { data }: Repos = await octokit.request(`GET /user/repos?${queryString}`, {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  return data;
};
