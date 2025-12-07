/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const _ = require('underscore');

var DATA = DATA || {};

DATA.FX = require('app/data/fx');

// init caches
let _cache = {};
let _filterCache = {};

/*
  Finds, caches, and returns data for a string identifier.
  @param {String} identifier data identifier in the format: "LEVEL_1.LEVEL_2.LEVEL_N"
  @returns {*} data if found, else null
*/
DATA.dataForIdentifier = function(identifier) {
  if (identifier) {
    // get cached data for identifier
    let data = _cache[identifier];

    // find and cache data for identifier
    if ((data == null)) {
      const keys = identifier.split(".");

      data = DATA;
      for (var key of Array.from(keys)) {
        data = data[key];
        if ((data == null)) {
          return null;
        }
      }

      _cache[identifier] = data;
    }

    return data;
  }
};

/*
  Finds and returns array of data objects for an array of string identifiers
  @param {String|Array} identifiers string or array of data identifiers
  @returns {Array} array of data if found, else empty array
  @see DATA.dataForIdentifier
*/
DATA.dataForIdentifiers = function(identifiers) {
  let data = [];

  if (identifiers) {
    if (!_.isArray(identifiers)) { identifiers = [identifiers]; }
    for (var identifier of Array.from(identifiers)) {
      var datum = DATA.dataForIdentifier(identifier);
      if (datum != null) { data = data.concat(datum); }
    }
  }

  return data;
};

/*
  Finds and returns array of data objects for an array of string identifiers and an array of filter keys
  @param {String|Array} identifiers string or array of string identifiers that map to data
  @param {String|Array} filterKey keys to filter for only data that matches identifier + key
  @param {Object} [foundFilterKeys] filter keys that have already been found where foundFilterKeys[key] = true, usually internal
  @returns {Array} array of data if found, else empty array
  @see DATA.dataForIdentifier
*/
DATA.dataForIdentifiersWithFilter = function(identifiers, filterKeys, foundFilterKeys) {
  if (foundFilterKeys == null) { foundFilterKeys = {}; }
  let data = [];

  if (identifiers && filterKeys) {
    // enforce arrays
    if (!_.isArray(identifiers)) { identifiers = [identifiers]; }
    if (!_.isArray(filterKeys)) { filterKeys = [filterKeys]; }
    if ((identifiers.length > 0) && (filterKeys.length > 0)) {
      // find data for each identifier and filter
      // work from end of identifiers backwards
      // until we've found data for each filter once
      for (let i = identifiers.length - 1; i >= 0; i--) {
        var lastKey;
        var identifier = identifiers[i];
        var lastDotIndex = (lastKey = null);
        for (var filterKey of Array.from(filterKeys)) {
          // only find filter key once
          if (!foundFilterKeys[filterKey]) {
            var filteredIdentifier = identifier + "." + filterKey;

            // always try to use cache
            var datum = _filterCache[filteredIdentifier];

            // find and cache
            if ((datum == null)) {
              if (lastDotIndex == null) { lastDotIndex = identifier.lastIndexOf("."); }
              if (lastKey == null) { lastKey = (lastDotIndex !== -1 ? identifier.slice(lastDotIndex + 1) : identifier); }
              datum = (_filterCache[filteredIdentifier] = DATA.dataForIdentifier((lastKey !== filterKey ? filteredIdentifier : identifier)));
            }

            if (datum != null) {
              foundFilterKeys[filterKey] = true;
              data = data.concat(datum);
            }
          }
        }
      }
    }
  }

  return data;
};

/*
  Finds and returns array of data objects for an array of string identifiers and filter keys. Alternative to DATA.dataForIdentifiersWithFilter
  @param {Object|Array} identifiers object or array of objects where {identifiers: {String|Array}, filterKeys: {String|Array}}
  @param {String} [identifierKey="identifiers"] string name of key in each object that maps to identifiers
  @param {String} [filterKeysKey="filterKeys"] string name of key in each object that maps to filterKeys
  @returns {Array} array of data if found, else empty array
  @see DATA.dataForIdentifiersWithFilter
*/
DATA.dataForMappedIdentifiersWithFilter = function(filterKeyedIdentifiers, identifierKey, filterKeysKey) {
  if (identifierKey == null) { identifierKey = "identifiers"; }
  if (filterKeysKey == null) { filterKeysKey = "filterKeys"; }
  let data = [];
  if (filterKeyedIdentifiers) {
    const foundFilterKeys = {};

    // enforce arrays
    if (!_.isArray(filterKeyedIdentifiers)) { filterKeyedIdentifiers = [filterKeyedIdentifiers]; }

    for (var map of Array.from(filterKeyedIdentifiers)) {
      data = data.concat(DATA.dataForIdentifiersWithFilter(map[identifierKey], map[filterKeysKey], foundFilterKeys));
    }
  }

  return data;
};

/*
  Returns array of string identifiers from a base array of identifiers merged with filter keys
  @param {String|Array} identifiers string or array of data identifiers
  @param {String|Array} filterKeys string or array of filter keys
  @returns {Array} array of filter keyed identifiers
*/
DATA.getFilterKeyedIdentifiers = function(identifiers, filterKeys) {
  const filterKeyedIdentifiers = [];
  if (identifiers && filterKeys) {
    // enforce arrays
    if (!_.isArray(identifiers)) { identifiers = [identifiers]; }
    if (!_.isArray(filterKeys)) { filterKeys = [filterKeys]; }

    // for each identifier and filterKey, merge into a single identifier
    if ((identifiers.length > 0) && (filterKeys.length > 0)) {
      for (let i = identifiers.length - 1; i >= 0; i--) {
        var identifier = identifiers[i];
        var lastDotIndex = identifier.lastIndexOf(".");
        var lastKey = (lastDotIndex !== -1 ? identifier.slice(lastDotIndex + 1) : identifier);
        for (var filterKey of Array.from(filterKeys)) {
          var filterKeyedIdentifier = identifier;
          if (lastKey !== filterKey) { filterKeyedIdentifier += "." + filterKey; }
          filterKeyedIdentifiers.push(filterKeyedIdentifier);
        }
      }
    }
  }

  return filterKeyedIdentifiers;
};

/*
  Releases and resets search caches.
*/
DATA.releaseCaches = function() {
  _cache = {};
  return _filterCache = {};
};

module.exports = DATA;
