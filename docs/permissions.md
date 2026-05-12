# Permissions

## Profiles
- ADMIN
- MARKETING
- OPERATIONAL
- COMMERCIAL

## Frontend control
`usePermissions` centralizes permission checks and is used by middleware/pages/components.

## Key rules
- Manage users: ADMIN
- Manage API keys: ADMIN
- View logs: ADMIN
- Export leads: ADMIN, MARKETING, COMMERCIAL
- Resend Rubeus: ADMIN, MARKETING, COMMERCIAL
- Edit availability: ADMIN, MARKETING, COMMERCIAL
- View dashboard: all authenticated profiles
