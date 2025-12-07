// Underscore compatibility shim
// Ensures _.contains exists for backward compatibility
(function() {
  if (typeof _ !== 'undefined') {
    if (!_.contains && _.includes) {
      _.contains = _.includes;
    }
    if (!_.includes && _.contains) {
      _.includes = _.contains;
    }
    // Also ensure _.include alias exists
    if (!_.include) {
      _.include = _.contains || _.includes;
    }
  }
})();
