export interface Repos {
  data: Repo[];
};

export interface Repo {
  node_id: string;
  name: string;
  description: string;
  html_url: string;
  language: string;
};

export interface RepoUI extends Omit<Repo, 'node_id' | 'html_url'> {
  href: Repo['html_url']
};

export interface QueryParams {
  per_page?: string;
  sort?: string;
  since?: string
};
