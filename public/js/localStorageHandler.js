
/***********************************/
/* Local Storage Handler */
/***********************************/
/*
Converts {objects} into "strings" to
be stored in browser localStorage
Converts "strings" read from
localStorage back into {objects}.
*/

var localStorageHandler = {

    get: function (string) {
        var object = localStorage.getItem(string);
        if (object === null)
            return false;
        else
            return JSON.parse(object);
    },
    set: function (key,object) {
        localStorage.setItem(key, JSON.stringify(object));
    },
    remove: function (key) {
        localStorage.removeItem(key);
    }
}

module.exports = localStorageHandler;
