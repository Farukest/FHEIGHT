'use strict';

var Promise = require('bluebird');
var Session = require('app/common/session2');
var Logger = require('app/common/logger');
var EVENTS = require('app/common/event_types');
var CONFIG = require('app/common/config');
var RSX = require('app/data/resources');
var audio_engine = require('app/audio/audio_engine');
var Animations = require('app/ui/views/animations');
var NavigationManager = require('app/ui/managers/navigation_manager');
var LoginMenuTmpl = require('app/ui/templates/item/login_menu.hbs');
var openUrl = require('app/common/openUrl');
var i18next = require('i18next');
var WalletConnectDialogItemView = require('./wallet_connect_dialog');
var ErrorDialogItemView = require('./error_dialog');

var LoginMenuItemView = Backbone.Marionette.ItemView.extend({

  template: LoginMenuTmpl,

  id: 'app-login',
  className: 'login-menu',

  /* ui selector cache */
  ui: {
    $brandDynamic: '.brand-dynamic',
    $loginForm: '.login-form',
    $connectWallet: '.connect-wallet',
    $walletStatus: '.wallet-status',
    $walletAddressDisplay: '.wallet-address-display',
  },

  /* Ui events hash */
  events: {
    'click .connect-wallet': 'onConnectWallet',
  },

  animateIn: Animations.fadeIn,
  animateOut: Animations.fadeOut,

  _userNavLockId: 'LoginUserNavLockId',

  /* region INITIALIZE */

  initialize: function () {
    // Bind wallet dialog success handler
    this._onWalletSuccess = this._onWalletSuccess.bind(this);
  },

  /* endregion INITIALIZE */

  /* region EVENTS */

  onBeforeRender: function () {
    this.$el.find('[data-toggle=\'tooltip\']').tooltip('destroy');
  },

  onRender: function () {
    this.$el.find('[data-toggle=\'tooltip\']').tooltip();
  },

  onShow: function () {
    var brandAnimationDuration = 2.0;

    // slight delay before showing brand to ensure dom is rendered
    this._brandTimeoutId = setTimeout(function () {
      this.showBrand(brandAnimationDuration);
    }.bind(this), 120.0);

    // show login form immediately
    this.ui.$loginForm.addClass('active');

    // handle confirm key to trigger wallet connect
    this.listenTo(NavigationManager.getInstance(), EVENTS.user_triggered_confirm, function () {
      this.onConnectWallet();
    });

    $('#tos').fadeIn(125);
    $('#tos').find('a').click(function (e) {
      openUrl($(e.currentTarget).attr('href'));
      e.stopPropagation();
      e.preventDefault();
    });
    $('.utility-links').find('a').click(function (e) {
      var href = $(e.currentTarget).attr('href');
      if (href.indexOf('http') == 0) {
        openUrl($(e.currentTarget).attr('href'));
        e.stopPropagation();
        e.preventDefault();
      }
    });
  },

  onDestroy: function () {
    // unlock user triggered navigation
    NavigationManager.getInstance().requestUserTriggeredNavigationUnlocked(this._userNavLockId);

    if (this._brandTimeoutId != null) {
      clearTimeout(this._brandTimeoutId);
      this._brandTimeoutId = null;
    }
  },

  /* endregion EVENTS */

  /* region ANIMATION */

  showBrand: function (animationDuration) {
    return new Promise(function (resolve, reject) {
      // animate brand in
      this.ui.$brandDynamic.addClass('active');
      this.ui.$brandDynamic.find('.draw-line').each(function () {
        var $element = $(this);
        var length = this.getTotalLength() / 5;
        $element.data('length', length);
        $element.css('stroke-dasharray', length);
        $element.css('stroke-dashoffset', length);

        length = $element.data('length');
        $element.css('transition', 'stroke-dashoffset ' + animationDuration + 's ease-in');
        $element.css('stroke-dashoffset', -length);
      });

      this.ui.$brandDynamic.find('.fill').each(function () {
        var $element = $(this);
        $element.css('transition', 'opacity ' + animationDuration * 0.5 + 's ease-out');
        $element.css('transition-delay', animationDuration * 0.5 + 's');
        $element.css('opacity', '1');
      });

      this.ui.$brandDynamic.find('.ring-blue').removeClass('active');
      this.ui.$brandDynamic.find('.ring-white').addClass('active');

      this._brandTimeoutId = setTimeout(function () {
        resolve();
      }.bind(this), animationDuration * 1000.0);
    }.bind(this));
  },

  /* endregion ANIMATION */

  /* region WALLET CONNECT */

  onConnectWallet: function () {
    audio_engine.current().play_effect_for_interaction(RSX.sfx_ui_confirm.audio, CONFIG.CONFIRM_SFX_PRIORITY);

    var walletDialog = new WalletConnectDialogItemView();
    this.listenToOnce(walletDialog, 'success', this._onWalletSuccess);
    NavigationManager.getInstance().showDialogView(walletDialog);
  },

  _onWalletSuccess: function (data) {
    // Wallet authentication successful
    // Session will emit 'login' event which is handled by the application
    Logger.module('UI').log('Wallet authentication successful');
  },

  onError: function (errorMessage) {
    NavigationManager.getInstance().showDialogViewByClass(ErrorDialogItemView, {
      title: i18next.t('wallet.error_auth_failed'),
      message: errorMessage
    });
  },

  /* endregion WALLET CONNECT */

});

module.exports = LoginMenuItemView;
