export interface Crate {
  id: string;
  name: string;
  updated_at: string;
  versions: any | null;
  keywords: any | null;
  categories: any | null;
  badges: any[];
  created_at: string;
  downloads: number;
  recent_downloads: number;
  default_version: string;
  num_versions: number;
  yanked: boolean;
  max_version: string;
  newest_version: string;
  max_stable_version: string | null;
  description: string;
  homepage: string | null;
  documentation: string | null;
  repository: string;
  links: Links;
  exact_match: boolean;
}

export interface Links {
  version_downloads: string;
  versions: string;
  owners: string;
  owner_team: string;
  owner_user: string;
  reverse_dependencies: string;
}
