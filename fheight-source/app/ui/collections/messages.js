'use strict';

var Logger = require('app/common/logger');
var Message = require('app/ui/models/message');
var FHEIGHTFirebase = require('app/ui/extensions/fheight_firebase');

var Messages = FHEIGHTFirebase.Collection.extend({
  model: Message,
  initialize: function () {
    Logger.module('UI').log('initialize a Messages collection');
  },
});

// Expose the class either via CommonJS or the global object
module.exports = Messages;
