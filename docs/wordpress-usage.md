# WordPress Usage (Future Integration)

## Objective
Allow WordPress to render/surface Handle public forms by slug.

## Suggested integration modes
1. Embed Handle frontend route (`/f/[slug]`) in iframe/container.
2. Use WP shortcode/plugin to fetch `GET /public/forms/:slug/data` and render UI.
3. Use WP page blocks to mount a JS widget that consumes Handle public endpoints.

## Technical considerations
- expose `slug` as shortcode/block parameter
- configure `API_BASE_URL` to Handle backend
- keep scheduling submission through `POST /public/schedules`
- preserve backend validations as source of truth
