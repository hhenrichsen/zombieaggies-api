# zombieaggies-api

### Permissions

* `x000` - `viewHiddenTeams`
* `0x00` - `accessLocationManagement`
* `00x0` - `useAdminRoutes`
* `000x` - `accessUserManagement`

### Routes

Format: `METHOD /path/to/route` `[A (authenticated) | 0000 (permissions required)]`

#### API
* `GET /api/v1/`
  * `GET /api/v1/teams`
    * `GET /api/v1/teams/:id`
  * `GET /api/v1/locations`
    * `GET /api/v1/locations/:id`
    * `PUT /api/v1/locations/:id` `[A | 0100]`

#### Auth
* `GET  /auth/login`
* `POST /auth/login`
* `GET  /auth/register`
* `GET  /auth/status` `[A | 0000]`

#### Manage
