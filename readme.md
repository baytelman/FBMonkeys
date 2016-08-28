#Before running locally:

##To install and run

`npm install`

`npm run gulp dev` to update the app script url in index.ejs, reversing the corresponding gulp production command

`npm run dev` will run webpack dev server at localhost:8080

####Run either `heroku local` or `node index.js` to start the application server on localhost:5000

##Testing

In order to run Unit Tests use:

`mocha --compilers js:babel-core/register`

###Note: Don't forget to run a local redis server if you intend to use redis

----------------------------------------------

#Before deploying to production:

####Run `npm run gulp production`. This will change the following:

#####1: Inside `./views/index.ejs`:
```
<script src="http://localhost:8080/app.js" charset="utf-8"></script>
```
#####Will change to:
```
<script src="/js/app.js" charset="utf-8"></script>
```

###Note: Run the `webpack` command (to recompile app.js, etc.) before committing and deploying to production.

----------------------------------------------

#Important Note: Deploy and/or push to origin while app is in the `Production` state.
