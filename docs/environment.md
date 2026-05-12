# Environment Variables

## Required
- `API_BASE_URL`: backend API base URL.

## Example
```env
API_BASE_URL=http://localhost:3000
```

## Usage
The value is exposed through Nuxt `runtimeConfig.public.apiBaseUrl` and used in `useApi`.
