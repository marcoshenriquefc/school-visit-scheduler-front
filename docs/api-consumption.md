# API Consumption

## `useApi`
Central HTTP wrapper with:
- `runtimeConfig.public.apiBaseUrl`
- auth header injection for protected requests
- friendly error handling
- 401 redirect handling
- optional global loading

## Service composables
Domain calls are split by module:
- auth
- users
- units
- grades
- forms
- form fields
- availability
- leads
- dashboard
- logs
- public forms
