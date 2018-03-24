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

Check out the [Source Code](https://github.com/baytelman/FBMonkeys)!

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm run build`

Modify your `package.json` to point to the right `homepage`:
If you are deploying to something like `https://baytelman.github.io/FBMonkeys/build/` then set `"homepage": "/FBMonkeys/build"`.
If you are deploying to something like `https://your.domain.com` then set `"homepage": "/"`.

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!
