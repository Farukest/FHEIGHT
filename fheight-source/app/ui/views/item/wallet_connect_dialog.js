// pragma PKGS: alwaysloaded

'use strict';

var CONFIG = require('app/common/config');
var EVENTS = require('app/common/event_types');
var RSX = require('app/data/resources');
var audio_engine = require('app/audio/audio_engine');
var Session = require('app/common/session2');
var WalletManager = require('app/common/wallet');
var NavigationManager = require('app/ui/managers/navigation_manager');
var WalletConnectDialogTempl = require('app/ui/templates/item/wallet_connect_dialog.hbs');
var i18next = require('i18next');

var WalletConnectDialogItemView = Backbone.Marionette.ItemView.extend({

  id: 'app-wallet-connect-dialog',
  className: 'modal prompt-modal wallet-modal',

  template: WalletConnectDialogTempl,

  events: {
    'click': 'onPress',
    'click .cancel-dialog': 'onCancel',
    'click .connect-wallet-btn': 'onConnectWallet',
    'click .sign-message-btn': 'onSignMessage',
  },

  // Current step: 1 = connect, 2 = sign
  _currentStep: 1,
  _isLoading: false,
  _walletAddress: null,
  _errorMessage: null,
  _loadingMessage: null,

  initialize: function() {
    this.model = new Backbone.Model({
      title: i18next.t('wallet.dialog_title'),
      isStep1: true,
      isStep2: false,
      walletAddress: null,
      errorMessage: null,
      isLoading: false,
      loadingMessage: null,
    });

    // Bind wallet manager events
    this._onWalletConnected = this._onWalletConnected.bind(this);
    this._onWalletDisconnected = this._onWalletDisconnected.bind(this);
  },

  onShow: function() {
    // Listen to specific user attempted actions as this is a dialog
    this.listenToOnce(NavigationManager.getInstance(), EVENTS.user_attempt_cancel, this.onCancel);
    this.listenToOnce(NavigationManager.getInstance(), EVENTS.user_attempt_confirm, this._handleConfirm);

    // Bind wallet events
    var wallet = WalletManager.getInstance();
    wallet.on('connected', this._onWalletConnected);
    wallet.on('disconnected', this._onWalletDisconnected);

    // Check if already connected
    if (wallet.connected && wallet.address) {
      this._walletAddress = wallet.getFormattedAddress();
      this._updateView();
    }
  },

  onDestroy: function() {
    // Unbind wallet events
    var wallet = WalletManager.getInstance();
    wallet.removeListener('connected', this._onWalletConnected);
    wallet.removeListener('disconnected', this._onWalletDisconnected);
  },

  _handleConfirm: function() {
    if (this._currentStep === 1) {
      this.onConnectWallet();
    } else if (this._currentStep === 2) {
      this.onSignMessage();
    }
  },

  _onWalletConnected: function(address) {
    this._walletAddress = WalletManager.getInstance().getFormattedAddress();
    this._updateView();
  },

  _onWalletDisconnected: function() {
    this._walletAddress = null;
    this._currentStep = 1;
    this._updateView();
  },

  _updateView: function() {
    this.model.set({
      isStep1: this._currentStep === 1,
      isStep2: this._currentStep === 2,
      walletAddress: this._walletAddress,
      errorMessage: this._errorMessage,
      isLoading: this._isLoading,
      loadingMessage: this._loadingMessage,
    });
    this.render();
  },

  _setLoading: function(isLoading, message) {
    this._isLoading = isLoading;
    this._loadingMessage = message || null;
    this._updateView();
  },

  _setError: function(message) {
    this._errorMessage = message;
    this._updateView();
  },

  _clearError: function() {
    this._errorMessage = null;
  },

  onPress: function(e) {
    if ($(e.target).attr('id') === this.id) {
      this.onCancel(e);
    }
  },

  onCancel: function() {
    audio_engine.current().play_effect_for_interaction(RSX.sfx_ui_cancel.audio, CONFIG.CANCEL_SFX_PRIORITY);
    this.trigger('cancel');
    NavigationManager.getInstance().destroyDialogView();
  },

  onConnectWallet: function() {
    var self = this;
    var wallet = WalletManager.getInstance();

    if (this._isLoading) return;

    // Clear any previous error
    this._clearError();

    // If already connected, move to step 2
    if (wallet.connected && wallet.address) {
      audio_engine.current().play_effect_for_interaction(RSX.sfx_ui_confirm.audio, CONFIG.CONFIRM_SFX_PRIORITY);
      this._currentStep = 2;
      this._updateView();
      return;
    }

    // Check if provider is available
    if (!wallet.isProviderAvailable()) {
      this._setError(i18next.t('wallet.error_no_provider'));
      audio_engine.current().play_effect_for_interaction(RSX.sfx_ui_error.audio, CONFIG.ERROR_SFX_PRIORITY);
      return;
    }

    // Start connecting
    this._setLoading(true, i18next.t('wallet.loading_connecting'));

    wallet.connect()
      .then(function(address) {
        self._walletAddress = wallet.getFormattedAddress();
        self._currentStep = 2;
        self._setLoading(false);
        audio_engine.current().play_effect_for_interaction(RSX.sfx_ui_confirm.audio, CONFIG.CONFIRM_SFX_PRIORITY);
      })
      .catch(function(error) {
        self._setLoading(false);
        self._setError(error.message || i18next.t('wallet.error_connect_failed'));
        audio_engine.current().play_effect_for_interaction(RSX.sfx_ui_error.audio, CONFIG.ERROR_SFX_PRIORITY);
      });
  },

  onSignMessage: function() {
    var self = this;
    var wallet = WalletManager.getInstance();

    if (this._isLoading) return;

    // Clear any previous error
    this._clearError();

    // Generate login message
    var message = wallet.generateLoginMessage();

    // Start signing
    this._setLoading(true, i18next.t('wallet.loading_signing'));

    wallet.signMessage(message)
      .then(function(signature) {
        self._setLoading(true, i18next.t('wallet.loading_authenticating'));

        // Authenticate with backend
        return Session.walletConnect(wallet.address, signature, message);
      })
      .then(function(data) {
        self._setLoading(false);
        audio_engine.current().play_effect_for_interaction(RSX.sfx_ui_confirm.audio, CONFIG.CONFIRM_SFX_PRIORITY);

        // Emit success event
        self.trigger('success', data);

        // Close dialog
        NavigationManager.getInstance().destroyDialogView();
      })
      .catch(function(error) {
        self._setLoading(false);
        self._setError(error.message || i18next.t('wallet.error_auth_failed'));
        audio_engine.current().play_effect_for_interaction(RSX.sfx_ui_error.audio, CONFIG.ERROR_SFX_PRIORITY);
      });
  },

});

module.exports = WalletConnectDialogItemView;
