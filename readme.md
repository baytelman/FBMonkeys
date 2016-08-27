#Before deploying to production:

##Run `npm run gulp production`. This will change the following:

###1: Inside `./views/index.ejs`:
```
<script src="http://localhost:8080/app.js" charset="utf-8"></script>
```
####Will change to:
```
<script src="/js/app.js" charset="utf-8"></script>
```

##Important note: Run the `webpack` command (to recompile app.js, etc.) before committing and deploying to production.

---------------------------------------------------

#Before running locally:

##`npm run gulp dev` to update the app script url in index.ejs, reversing the corresponding gulp production command

##`npm run dev` will run webpack dev server at localhost:8080

##Run either `heroku local` or `node index.js` to start the application server on localhost:5000

##Important note: Don't forget to run a local redis server if you intend to use redis


#Remember to deploy/push to origin while app is in the `Production` state.
