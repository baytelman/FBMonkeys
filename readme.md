# Monkeys

## It all starts with a banana

Pick up a banana, and open the doors towards building a civilization.

## What's this game about?

A village simulator inspired by [Kittens](http://bloodrizer.ru/games/kittens).

- Gather and create resources.
- Plan and manage buildings.
- Research new technologies.
- Recruit and manage monkeys.


## Wanna try it? [Click here to play!](https://baytelman.github.io/FBMonkeys/public/)

## Why am I writing this game

This game is develop pure ES6 javascript for the game engine, and React for early visualizations. My goal is to practice Javascript, React and client-server architectures (soon). Ideally, this will become a great multiplayer game.

The game engine (a.k.a. `cities`) is totally separated from the game play and storytelling. If you want to check how Monkeys' world is described, checkout the [GameModule.js](https://github.com/baytelman/FBMonkeys/blob/develop/lib/module/GameModule.js).

## Wish list

This is the current withlist, and what to expect soon:

- [ ] Better, original graphics.
- [ ] Mobile client.
- [ ] Server-side storage and logic.
- [ ] Async progress: Queuing actions (buildings, research, upgrades, etc).
- [ ] Collaboration between players: Commerce.
- [ ] Battles agains AI.
- [ ] Battles agains other players

### Storyline and gameplay:

- [ ] Monkeys get skills.
- [ ] Building get upgrades.
- [ ] Village organization.

### Technical wishlist:

- [ ] Centralize all interaction through the GameController, instead of calling methods directly from class instances.
- [ ] Better UI refreshment, based on events.
- [ ] Responsive design.


# Development

This game is develop pure ES6 javascript for the game engine, and React for early visualizations.

## To install and run

`npm install`

`npm run gulp dev` to update the app script url in index.ejs, reversing the corresponding gulp production command

`npm run dev` will run webpack dev server at localhost:8080

#### Run `node index.js` to start the application server on [localhost:5000](http://localhost:5000)

## Testing

In order to run Unit Tests use:

`npm test`
or
`npm run watch`
or run coverage with:
`npm run coverage`

# Before deploying to production:

The following steps should be executed by the CI engine. Currently, they must be executed manually.

## Prepare HTML for production:

Run `npm run gulp production`. This will change the following:

##### 1: Inside `./views/index.ejs`:
```
<script src="http://localhost:8080/app.js" charset="utf-8"></script>
```
##### Will change to:
```
<script src="/js/app.js" charset="utf-8"></script>
```

## Compile Javascript for production:

`npm run postinsall`
