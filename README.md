# zombieaggies-api

## API Reference
 * `/api/v1`
   * `/teams`
     * `GET /` Returns a list of teams.
     * `GET /:id` Returns a given team.
   * `/locations`
     * `GET /` Returns a list of all locations.
     * `GET /:id` Returns a given location.
     * `PATCH /:id` *(Requires Auth, Perms)* Updates a given location.
   * `/lore` **(NYI)**
     * `GET /` Returns a list of all unlocked lore.
     * `GET /:id` Returns an individual unlocked lore item.
     * `GET /unlock/:code` Unlocks lore with the given code.
   * `/tags` *(Requires Auth)*
     * `GET /`
     * `GET /add` **(DEPRECIATED)**
     * `POST /add`
   * `/players` *(Requires Auth)*
     * `GET /`
     * `GET /:id`
     * `POST /:id`
     * `GET /:id/regenCode` *(Requires Perms)*
     * `GET /:id/makeOZ` *(Requires Perms)*
     * `GET /:id/removeOZ` *(Requires Perms)*
     * `GET /:id/isOZ` *(Dev Only, Requires Perms)*
   * `/events` **(NYI)**

## Todo / Issues

### `master`
- [x] Create Mapping Application
- [x] Create API to manage locations
- [x] Add Auth to API
- [x] Add permissions system
- [x] Add base frontends
- [x] Migrate styling to flexbox based instead of static
- [x] Migrate styling to SASS
- [x] Add homepage and rules
- [x] Add basic user management
- [x] Test user management
- [x] Add rules page
- [x] Run initial registrations
### `feat-reorg-tags` **(Done)**
- [x] Add better frontend for user management
- [x] Re-Org Database and API
- [x] Tag Tracking
  - [x] Generate user codes
  - [x] Generate missing user codes
  - [x] Allow tag submission
  - [x] OZ Tracking
  - [x] `POST` tag submission
  - [x] Tag tracking form
- [x] Add case insensitivity to code submission
- [x] Create OZ management frontend
- [x] Push to master!
### `feat-minor-tweaks` (Before Tuesday Night)
- [ ] Remove requirement for Phone
- [x] Merge map views
- [ ] Somehow incorporate the admin options into one view with the users.
### `feat-additional-apis` (Goal: Wednesday)
- [ ] Lore API
  - [ ] Code Generation/Hardcoding
  - [ ] Unlocking / Locking
  - [ ] Discord Command
- [ ] Implement Events API
- [ ] Push to master!
### `feat-discord-integration` (Goal: Sunday Night)
- [ ] Discord Integration
  - [ ] User Field
  - [ ] Discord Route
- [ ] Harbinger Integration
  - [ ] Role Manipulation
  - [ ] Lore Reveals
- [ ] Push to master!
### Bugs
- [ ] Discord embedded browser registration issues?
