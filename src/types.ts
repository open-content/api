export interface Paginated<T> {
  rows: Array<T>;
  page: number;
  limit: number;
  count: number;
}

export interface SingleProviderConfig {
  API_URL: string;
  ACCESS_KEY: string;
}

export interface ProviderConfig {
  unsplash: SingleProviderConfig;
  pixabay: SingleProviderConfig;
  pexels: SingleProviderConfig;
  giphy: SingleProviderConfig;
}
