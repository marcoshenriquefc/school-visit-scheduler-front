# Public Form Flow (`/f/[slug]`)

## Data loading
Public form data is loaded by slug from backend public API.

## Step flow
1. Unit and grade selection
2. Date and time selection
3. Personal data + dynamic fields + LGPD
4. Success and scheduling summary

## Rules implemented
- show only active units/grades/fields
- blocked slots are hidden
- date range constrained by form campaign period
- submit payload to `POST /public/schedules`
- success screen with Google Calendar link
