/**
* Created by fbaytelm on 8/3/15.
*/

'use strict'

function getFunctionName(f) {
    var ownName = f.toString();
    ownName = ownName.substr('function '.length);        // trim off "function "
    ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
    return ownName;
}

function randomWithCenterAndSpread(center, spread) {
    var d = Math.round(center + Math.sqrt(Math.random()) * spread * (Math.round(Math.random()) * 2 - 1));
    if (d < 1) {
        d = 1;
    }
    return d;
}

String.prototype.format = function () {
    var content = this;
    for (var i = 0; i < arguments.length; i++) {
        var replacement = '{' + i + '}';
        content = content.replace(replacement, arguments[i]);
    }
    return content;
};

// Load text with Ajax synchronously: takes path to file and optional MIME type
function loadTextFileSync(filePath, mimeType)
{
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET",filePath,false);
    if (mimeType != null) {
        if (xmlhttp.overrideMimeType) {
            xmlhttp.overrideMimeType(mimeType);
        }
    }
    xmlhttp.send();
    if (xmlhttp.status==200)
    {
        return xmlhttp.responseText;
    }
    else {
        // TODO Throw exception
        return null;
    }
}

export class CyclicalJSON {
    static cyclicalObjectAsJSON(root, classesToEncode) {
        let prefix = 'json_encode_id_';
        let alreadyEncodedObjects = {};
        let object_ids = 0;

        function _isBasicType(object) {
            return object === undefined || object === null || typeof object != "object" || object.constructor == Array || object.constructor == Object;
        }
        function _cleanUp(object) {
            let prefix = 'json_encode';
            var alreadyCleaned = [];
            var f = function(object) {
                if (typeof object === "string") {
                    return;
                }
                if (alreadyCleaned.indexOf(object) >= 0) {
                    return;
                }
                alreadyCleaned.push(object);
                for (var key in object) {
                    if (key.indexOf(prefix) >= 0) {
                        object[key] = undefined;
                    } else {
                        f(object[key]);
                    }
                }
            }
            f(object);
        }

        function _applyId(object) {
            var json_encode_id = prefix + object.constructor.name + '_' + (++object_ids);
            object.json_encode_id = json_encode_id;
        }

        function _removeClasses(object, classesToBeSkipped) {
            if (_isBasicType(object)) {
                if (object && (object.constructor == Array || object.constructor == Object)) {
                    for (let key in object) {
                        /* Same classes to be skipped */
                        object[key] = _removeClasses(object[key], classesToBeSkipped);
                    }
                }
                return object;
            }

            let skipClass = false;
            if (classesToBeSkipped) {
                classesToBeSkipped.forEach(function(className) {
                    let c = eval(className);
                    if (object instanceof c) {
                        skipClass = true;
                    }
                });
            }
            if (skipClass) {
                if (object.json_encode_id === undefined) {
                    _applyId(object);
                    object.json_encode_pending = true;
                }
                return object.json_encode_id;
            }

            let encodeClass = false;
            let myClassesToBeSkipped = null;
            for (var className in classesToEncode) {
                let c = eval(className);
                if (object instanceof c) {
                    encodeClass = true;
                    myClassesToBeSkipped = classesToEncode[className];
                    break;
                }
            }
            if (!encodeClass) {
                return undefined;
            }

            if (object.json_encode_id === undefined || object.json_encode_pending !== undefined) {
                if (object.json_encode_id === undefined) {
                    _applyId(object);
                }

                object.json_encode_pending = undefined;

                for (let key in object) {
                    /* Same classes to be skipped */
                    object[key] = _removeClasses(object[key], myClassesToBeSkipped);
                }
                return object;
            } else {
                return object.json_encode_id;
            }
        }

        _cleanUp(root);
        _removeClasses(root, classesToEncode[root.constructor.name]);

        let json = JSON.stringify(root, function replacer(key, value) {
            if (value === null || value === undefined) {
                return undefined;
            }
            if (_isBasicType(value)) {
                return value;
            }
            /* Given we have already cleaned the house, we are good to encode everything */
            value.json_encode_type = value.constructor.name;
            alreadyEncodedObjects[value.json_encode_id] = value;

            return value;
        });

        /* Debug */
        if (json) {
            let prefix = 'json_encode_id';
            var object = CyclicalJSON.cyclicalObjectWithJSON(json);
            var checkNoPrefix = function(object) {
                if ((object instanceof Object) || (object instanceof Array)) {
                    if (object.checked !== undefined) {
                        return;
                    }
                    object.checked = true;
                    for (var key in object) {
                        checkNoPrefix(object[key]);
                    }
                } else if (typeof object === "string") {
                    if (object.indexOf(prefix) >= 0) {
                        throw new Error("Decoded object should have no remaining json references");
                    }
                }
            };
            checkNoPrefix(object);
        }
        return json;
    }
    static cyclicalObjectWithJSON(json, cleanupCallback) {
        let prefix = 'json_encode_id';
        let knownObjects = {};

        let object = JSON.parse(json, function(k, v) {
            if (v && v.json_encode_type) {
                let objectClass = eval(v.json_encode_type);
                let decodedObject = new objectClass();
                for (let k in v) {
                    // Don't add to resulting objects any json hints
                    if (k.indexOf('json_encode') == 0) {
                        continue;
                    }

                    decodedObject[k] = v[k];
                }
                if (v.json_encode_id) {
                    knownObjects[v.json_encode_id] = decodedObject;
                }
                return decodedObject;
            }
            return v;
        });
        function _fixReferences(v) {
            for (let k in v) {
                // If this is a future known property, fix this object later
                if (typeof v[k] === "string" && v[k].indexOf(prefix) == 0) {
                    v[k] = knownObjects[v[k]];
                } else {
                    if (v[k] && (v[k].constructor.name == "Array" || v[k].constructor.name == "Object")) {
                        _fixReferences(v[k]);
                    }
                }
            }
        }
        for (let id in knownObjects) {
            _fixReferences(knownObjects[id]);
        }

        if (cleanupCallback) {
            cleanupCallback(object);
        }
        return object;
    }
}
