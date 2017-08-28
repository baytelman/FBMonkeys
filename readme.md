# Monkeys

A village simulator inspired by [Kittens](http://bloodrizer.ru/games/kittens)

## It all starts with a banana

Pick up a banana, and open the doors towards building a civilization.

### [Play it!](https://baytelman.github.io/FBMonkeys/public/)

## About this game

This game is develop pure ES6 javascript for the game engine, and React for early visualizations. My goal is to practice Javascript, React and client-server architectures (soon). Ideally, this will become a great multiplayer game.

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

# Development

This game is develop pure ES6 javascript for the game engine, and React for early visualizations.

Check out the [Source Code](https://github.com/baytelman/FBMonkeys)!

## To install and run

`npm install`

`npm run gulp dev` to update the app script url in index.ejs, reversing the corresponding gulp production command

`npm run dev` will run webpack dev server at localhost:8080

#### Run `node index.js` to start the application server on localhost:5000

## Testing

In order to run Unit Tests use:

`npm test`
or
`npm run watch`
or run coverage with:
`npm run coverage`

# Before deploying to production:

#### Run `npm run gulp production`. This will change the following:

##### 1: Inside `./views/index.ejs`:
```
<script src="http://localhost:8080/app.js" charset="utf-8"></script>
```
##### Will change to:
```
<script src="/js/app.js" charset="utf-8"></script>
```

### Note: Run the `webpack` command (to recompile app.js, etc.) before committing and deploying to production.
```
npm run postinstall
```
----------------------------------------------

# Important Note: Deploy and/or push to origin while app is in the `Production` state.
