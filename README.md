# zombieaggies-api

## Setup

First, you're going to need a version of [Node.js](https://nodejs.org/en/) and a [Postgres](https://www.postgresql.org/) database. 
Both of those can be installed on nearly any machine, so there's no need to buy another server or set something crazy up.

After that, you're going to want to create a file in the base folder named `.env`. This will contain some configuration settings,
like the database password and a Discord token.

```env
SECRET=
NODE_ENV=development
ENABLE_POINTS=false
CODE_LENGTH=5
CLIENT_SECRET=
CLIENT_ID=
DISCORD_SERVER_ID=
DISCORD_BOT_TOKEN=
SENDGRID_API_KEY=
SENDGRID_USERNAME=
SENDGRID_PASSWORD=
```

* `SECRET` - Used to store passwords. I used a Fort Knox key from [here](https://randomkeygen.com/).
* `NODE_ENV` - Test, development or production. Doesn't change much.
* `ENABLE_POINTS` - Whether points should tick up on the map.
* `CODE_LENGTH` - How many characters should be in a player's tag.
* `CLIENT_SECRET` - Used for discord to get peoples' usernames.
* `CLIENT_ID` - See above.
* `DISCORD_SERVER_ID` - Which server the bot should work in.
* `DISCORD_BOT_TOKEN` - Used for discord to run the bot.
* `SENDGRID` - Would be used to send email, but this isn't currently implemented.

You'll also want to configure the development and test portions in the `knexfile.js` with the database information. 

```js
    test: {
        connection: 'postgres://USERNAME:PASSWORD@localhost:5432/zombieaggies_test',
        migrations: {
            directory: path.join(BASE_PATH, 'migrations'),
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds'),
        },
        client: 'pg',
    },
    development: {
        connection: 'postgres://USERNAME:PASSWORD@localhost:5432/zombieaggies_dev',
        migrations: {
            directory: path.join(BASE_PATH, 'migrations'),
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds'),
        },
        client: 'pg',
    },
```

Replace `USERNAME` and `PASSWORD` with what you configured during the postgres installation, or `postgres@localhost:5432`
if you didn't configure either of them.

Run `npm run migrate` to set the database up.

Once that's done, run `npm run build && npm run start`. It'll build the website content/styles, then start the server.

## Production

Production is set up at [Heroku](https://www.heroku.com/). Currently, heroku is on its own remote and builds off of the master branch, 
so I recommend keeping a clean, working master. If you need an 
explanation of branching, you can look [here](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell) or come talk to me.

As it stands, it's running on my heroku student credit until March 2021. After that, we'll either have to move accounts or switch to another solution.
If you're requesting credit for this or looking to pick it up, requesting your student credit through the [GitHub Student Developer Pack](https://education.github.com/pack) 
should be the first thing you do.

The [heroku command line utility](https://devcenter.heroku.com/articles/heroku-cli) is also useful for viewing logs and making changes on heroku.

## API Reference
 * `/api/v1`
   * `/teams`
     * `GET /` Returns a list of teams.
     * `GET /:id` Returns a given team.
   * `/locations`
     * `GET /` Returns a list of all locations.
     * `GET /:id` Returns a given location.
     * `PATCH /:id` *(Requires Auth, Perms)* Updates a given location.
   * `/lore` 
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

## Adding Lore

Honestly, this needs to have way better user experience, but here goes nothing:

If this is text lore, you'll want to JSON escape it. I used [this](https://www.freeformatter.com/json-escape.html).

Do `heroku psql`

```SQL
INSERT INTO lore (accessor, title, description) VALUES ('#something', 'A Cool Lore', 'Haha the default password\n\nis \n\nhunter2');
```

If you want to set other things (thumbnail, image, link), switch out description for whichever you want to use. Lore can have multiple,
 although `link` will redirect the page.

## Todo

* Switch to [Auth0](https://auth0.com/) or some other sign-on utility so that we don't have to provide security. Seriously, it's not
  something that we want to deal with. 
* Check the [issues](https://github.com/hhenrichsen/zombieaggies-api/issues), I've left some there for things that should be done 
  before the next game.
* Dockerize this? Would make it run nearly anywhere.