# Routing

## Public routes
- `/login`
- `/f/[slug]`
- `/403`
- `404` catch-all

## Admin routes
All routes under `/admin` require authenticated user.

Examples:
- `/admin`
- `/admin/users`
- `/admin/units`
- `/admin/grades`
- `/admin/leads`
- `/admin/logs`
- `/admin/forms/[id]/fields`
- `/admin/forms/[id]/availability`
