const jp = require('jsonpath');

const replaceWithArray = function (str, array) {
    return str.replace(/\$([0-9])/g, (c, p1) => array[p1]);
};

const replaceWithJson = function (str, obj) {
    return str.replace(/(\$\.[^ ]+)/g, (c, p1) => jp.query(obj, p1)[0]);
};

const replaceWithAll = function (str, array, obj) {
    return replaceWithArray(replaceWithJson(str, obj), array);
};

/**
 * Map both the keys and the values of a object.
 * Original object is not modified.
 *
 * @param obj the object to map
 * @param func the function to apply, take 1 arg : the element.
 */
const mapObj = function (obj, func) {
    let res = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            res[func(key)] = func(obj[key]);
        }
    }
    return res;
};

exports.rArray = replaceWithArray;
exports.rJson = replaceWithJson;
exports.rAll = replaceWithAll;
exports.mapObj = mapObj;