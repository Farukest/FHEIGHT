// pragma PKGS: alwaysloaded

'use strict';

var RSX = require('app/data/resources');
var GAME_TIPS = require('app/data/game_tips');
var Animations = require('app/ui/views/animations');
var LoadingDialogViewTempl = require('app/ui/templates/item/loading_dialog.hbs');
var NavigationManager = require('app/ui/managers/navigation_manager');

var LoadingDialogItemView = Backbone.Marionette.ItemView.extend({

  id: 'app-loading-dialog',
  className: 'dialog',

  template: LoadingDialogViewTempl,

  // No fade animation - instant show to avoid flash during transitions
  animateIn: null,
  animateOut: null,

  initialize: function () {
    this.model = new Backbone.Model({
      tip: this.options.tip || GAME_TIPS.random_tip(),
      background: this.options.background,
    });
  },

});

// Expose the class either via CommonJS or the global object
module.exports = LoadingDialogItemView;
