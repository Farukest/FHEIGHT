'use strict';

var Logger = require('app/common/logger');
var CONFIG = require('app/common/config');
var EventBus = require('app/common/eventbus');
var EVENTS = require('app/common/event_types');
var UtilityMainMenuTmpl = require('app/ui/templates/item/utility_main_menu.hbs');
var ChatManager = require('app/ui/managers/chat_manager');
var QuestsManager = require('app/ui/managers/quests_manager');
var InventoryManager = require('app/ui/managers/inventory_manager');
var ServerStatusManager = require('app/ui/managers/server_status_manager');
var NavigationManager = require('app/ui/managers/navigation_manager');
var QuestLogLayout = require('app/ui/views2/quests/quest_log_layout');
var ProfileLayout = require('app/ui/views2/profile/profile_layout');
var ProgressionManager = require('app/ui/managers/progression_manager');
var NewPlayerManager = require('app/ui/managers/new_player_manager');
var ProfileManager = require('app/ui/managers/profile_manager');
var ShopManager = require('app/ui/managers/shop_manager');
var Session = require('app/common/session2');
var PremiumPurchaseDialog = require('app/ui/views2/shop/premium_purchase_dialog');
var openUrl = require('app/common/openUrl');
var i18next = require('i18next');
var BosterPackUnlockView = require('../layouts/booster_pack_collection');
var UtilityMenuItemView = require('./utility_menu');
var Wallet = require('app/common/wallet');

/**
 * Out of game utility menu that shows basic utilities plus buttons for quests, profile, shop, and gold/boosters.
 */
var UtilityMainMenuItemView = UtilityMenuItemView.extend({

  id: 'app-utility-main-menu',

  template: UtilityMainMenuTmpl,

  ui: {
    $goldCount: '.gold-count',
    $goldButton: '.gold',
    $diamondCount: '.diamond-count',
    $diamondButton: '.diamond',
    $networkIndicator: '.network-indicator',
    $networkName: '.network-name',
    $boosterPackCollection: '.booster-pack-collection',
    $boosterPackCountLabel: '.booster-pack-count-label',
    $boosterPackCountNumberLabel: '.booster-pack-count-label > span.count',
    $boosterPackStaticLabel: '.booster-pack-count-label > span.booster-pack-descriptor',
    $symbolBoosterPackCenter: '.symbol-booster-pack-center',
    $symbolBoosterPackRing: '.symbol-booster-pack-ring',
    $symbolBoosterPackCaret: '.symbol-booster-pack-caret',
    $btnGroup: '.btn-group',
    $questButton: '.quest-log',
    $profileButton: '.profile',
    $armoryButton: '.armory-button',
    $shopButton: '.shop',
  },

  events: {
    'click button': 'onClickRemoveEmphasis',
    'click button.shop': 'toggleShop',
    'click button.quest-log': 'toggleQuestLog',
    'click button.profile': 'toggleProfile',
    'click .gold': 'onGoldClicked',
    'click .diamond': 'onDiamondClicked',
    'click .armory-button': 'toggleShop',
    'click .booster-pack-collection': 'onClickBoosterPackCollection',
    'mouseenter .booster-pack-collection': 'activateSymbolBoosterPack',
    'mouseleave .booster-pack-collection': 'deactivateSymbolBoosterPack',
  },

  templateHelpers: {
    isShopEnabled: function () {
      return ServerStatusManager.getInstance().isShopEnabled();
    },
  },

  onBeforeRender: function () {
    // stop any activated symbols
    this.deactivateSymbolBoosterPack();

    this.$el.find('[data-toggle=\'tooltip\']').tooltip('destroy');
    this.$el.find('[data-toggle=\'popover\']').popover('destroy');
  },

  onDestroy: function () {
    UtilityMenuItemView.prototype.onDestroy.apply(this, arguments);

    this.deactivateSymbolBoosterPack();

    if (this._showNewPlayerUITimeoutId != null) {
      clearTimeout(this._showNewPlayerUITimeoutId);
      this._showNewPlayerUITimeoutId = null;
    }
  },

  onLoggedInShow: function () {
    UtilityMenuItemView.prototype.onLoggedInShow.apply(this, arguments);

    this.listenTo(InventoryManager.getInstance().walletModel, 'change:gold_amount', this.onUpdateGoldCount);
    this.listenTo(InventoryManager.getInstance().boosterPacksCollection, 'add remove', this.onUpdateBoosters);
    this.listenTo(InventoryManager.getInstance().walletModel, 'change:premium_amount', this.onPremiumCurrencyChange);

    // show new player UI after short delay
    this._showNewPlayerUITimeoutId = setTimeout(function () {
      this._showNewPlayerUITimeoutId = null;
      this._showNewPlayerUI();
    }.bind(this), 1500);

    this.onUpdateGoldCount();
    this.onUpdateBoosters();
    this.onPremiumCurrencyChange();
    this.onUpdateNetworkIndicator();

    // Listen for chain changes from wallet
    var self = this;
    var walletManager = Wallet.getInstance();

    // Store bound handlers for cleanup
    this._onChainChanged = function() {
      self.onUpdateNetworkIndicator();
    };

    this._onWalletDisconnected = function() {
      Logger.module('UI').log('Wallet disconnected, logging out...');
      Session.logout();
    };

    walletManager.on('chainChanged', this._onChainChanged);
    walletManager.on('disconnected', this._onWalletDisconnected);

    // Also listen directly to provider for chain changes and account changes (more reliable)
    if (walletManager.isProviderAvailable()) {
      var provider = walletManager.getProvider();
      if (provider) {
        this._onProviderChainChanged = function(chainId) {
          Logger.module('UI').log('Provider chainChanged event:', chainId);
          self.onUpdateNetworkIndicator();
        };
        provider.on('chainChanged', this._onProviderChainChanged);

        // Listen for accounts changed - empty array means disconnected
        this._onProviderAccountsChanged = function(accounts) {
          Logger.module('UI').log('Provider accountsChanged event:', accounts);
          if (!accounts || accounts.length === 0) {
            Logger.module('UI').log('No accounts - wallet disconnected, logging out...');
            Session.logout();
          }
        };
        provider.on('accountsChanged', this._onProviderAccountsChanged);
      }
    }
  },

  onLoggedOutShow: function () {
    UtilityMenuItemView.prototype.onLoggedOutShow.apply(this, arguments);

    this.stopListening(InventoryManager.getInstance().walletModel, 'change:gold_amount', this.onUpdateGoldCount);
    this.stopListening(InventoryManager.getInstance().boosterPacksCollection, 'add remove', this.onUpdateBoosters);
    this.stopListening(InventoryManager.getInstance().walletModel, 'change:premium_amount', this.onPremiumCurrencyChange);

    // Cleanup wallet event listeners
    var walletManager = Wallet.getInstance();
    if (this._onChainChanged) {
      walletManager.off('chainChanged', this._onChainChanged);
    }
    if (this._onWalletDisconnected) {
      walletManager.off('disconnected', this._onWalletDisconnected);
    }
    if (walletManager.isProviderAvailable()) {
      var provider = walletManager.getProvider();
      if (provider && provider.removeListener) {
        if (this._onProviderChainChanged) {
          provider.removeListener('chainChanged', this._onProviderChainChanged);
        }
        if (this._onProviderAccountsChanged) {
          provider.removeListener('accountsChanged', this._onProviderAccountsChanged);
        }
      }
    }
  },

  onLoggedInRender: function () {
    UtilityMenuItemView.prototype.onLoggedInRender.apply(this, arguments);

    var newPlayerManager = NewPlayerManager.getInstance();
    if (!newPlayerManager.canSeeArmory()) {
      this.ui.$armoryButton.addClass('hide');
      this.ui.$goldButton.addClass('hide');
      this.ui.$diamondButton.addClass('hide');
      this.ui.$shopButton.addClass('hide');
    } else {
      this.ui.$armoryButton.removeClass('hide');
      this.ui.$goldButton.removeClass('hide');
      this.ui.$diamondButton.removeClass('hide');
      this.ui.$shopButton.removeClass('hide');
      this.onUpdateGoldCount();
      this.onPremiumCurrencyChange();
    }

    if (!newPlayerManager.canSeeSpiritOrbs()) {
      this.ui.$symbolBoosterPackCaret.addClass('hide');
      this.ui.$boosterPackCountLabel.addClass('hide');
      this.ui.$boosterPackCollection.addClass('hide');
    } else {
      this.ui.$symbolBoosterPackCaret.removeClass('hide');
      this.ui.$boosterPackCountLabel.removeClass('hide');
      this.ui.$boosterPackCollection.removeClass('hide');
    }

    if (!newPlayerManager.canSeeQuests()) {
      this.ui.$questButton.addClass('hide');
    } else {
      this.ui.$questButton.removeClass('hide');
    }

    if (!newPlayerManager.canSeeProfile()) {
      this.ui.$profileButton.addClass('hide');
    } else {
      this.ui.$profileButton.removeClass('hide');
    }
  },

  onLoggedOutRender: function () {
    UtilityMenuItemView.prototype.onLoggedOutRender.apply(this, arguments);
    this.ui.$armoryButton.addClass('hide');
    this.ui.$goldButton.addClass('hide');
    this.ui.$diamondButton.addClass('hide');
    this.ui.$shopButton.addClass('hide');
    this.ui.$symbolBoosterPackCaret.addClass('hide');
    this.ui.$boosterPackCountLabel.addClass('hide');
    this.ui.$boosterPackCollection.addClass('hide');
    this.ui.$questButton.addClass('hide');
    this.ui.$profileButton.addClass('hide');
  },

  _showNewPlayerUI: function () {
    if (ProfileManager.getInstance().get('id')) {
      var newPlayerManager = NewPlayerManager.getInstance();

      if (newPlayerManager.canSeeSpiritOrbs() && !newPlayerManager.getHasOpenedSpiritOrb()) {
        this.ui.$boosterPackCollection.popover({
          content: i18next.t('new_player_experience.highlight_open_spirit_orbs_popover'),
          container: this.$el,
          animation: true,
        });
        this.ui.$boosterPackCollection.popover('show');
      }

      if (newPlayerManager.getEmphasizeQuests()) {
        this.ui.$questButton.popover({
          title: '',
          content: i18next.t('new_player_experience.new_quests_popover'),
          container: this.$el,
          placement: 'top',
          animation: true,
        });
        this.ui.$questButton.popover('show');
        this.ui.$questButton.addClass('glow');
      } else {
        this.ui.$questButton.removeClass('glow');
        this.ui.$questButton.popover('destroy');
      }
    }
  },

  onClickRemoveEmphasis: function (e) {
    $(e.currentTarget).removeClass('glow');
    $(e.currentTarget).popover('destroy');
  },

  onUpdateGoldCount: function () {
    var goldCount = InventoryManager.getInstance().walletModel.get('gold_amount') || 0;
    if (this.ui.$goldCount instanceof $) {
      this.ui.$goldCount.text(goldCount);
    }

    // if we have enough gold to buy a booster or have any boosters, activate the symbol animation
    if (goldCount > 100 || InventoryManager.getInstance().boosterPacksCollection.length > 0) {
      this.activateSymbolBoosterPack();
    }

    // emphasize armory
    var newPlayerManager = NewPlayerManager.getInstance();
    if (newPlayerManager.canSeeArmory()) {
      if (newPlayerManager.getEmphasizeBoosterUnlock()) {
        this.ui.$shopButton.popover({
          content: i18next.t('new_player_experience.buy_spirit_orb'),
          container: this.$el,
          placement: 'top',
          animation: true,
        });
        this.ui.$shopButton.popover('show');
        this.ui.$shopButton.addClass('glow');
      } else if (ShopManager.getInstance().availableSpecials.length > 0 && newPlayerManager.getModuleStage(ShopManager.getInstance().availableSpecials.at(ShopManager.getInstance().availableSpecials.length - 1).id.toLowerCase()) !== 'read') {
        this.ui.$shopButton.popover({
          content: i18next.t('main_menu.new_shop_special_available_popover'),
          container: this.$el,
          placement: 'top',
          animation: true,
        });
        this.ui.$shopButton.popover('show');
        this.ui.$shopButton.addClass('glow');
      } else {
        this.ui.$shopButton.removeClass('glow');
        this.ui.$shopButton.popover('destroy');
      }
    }
  },

  onPremiumCurrencyChange: function () {
    this.ui.$diamondCount.text(InventoryManager.getInstance().getWalletModelPremiumAmount());
  },

  onUpdateNetworkIndicator: function () {
    var self = this;
    var walletManager = Wallet.getInstance();

    // Check if we have a provider (wallet extension available)
    if (!walletManager.isProviderAvailable()) {
      if (self.ui.$networkIndicator instanceof $) {
        self.ui.$networkIndicator.removeClass('sepolia hardhat').addClass('unknown');
        self.ui.$networkName.text('No Wallet');
      }
      return;
    }

    // Get current network directly from provider
    var provider = walletManager.getProvider();
    if (!provider) {
      if (self.ui.$networkIndicator instanceof $) {
        self.ui.$networkIndicator.removeClass('sepolia hardhat').addClass('unknown');
        self.ui.$networkName.text('No Provider');
      }
      return;
    }

    // Query chainId directly from provider
    provider.request({ method: 'eth_chainId' })
      .then(function(chainId) {
        if (!(self.ui.$networkIndicator instanceof $)) return;

        var network = walletManager.getNetworkName(chainId);

        // Remove all network classes first
        self.ui.$networkIndicator.removeClass('sepolia hardhat unknown');

        if (network === 'sepolia') {
          self.ui.$networkIndicator.addClass('sepolia');
          self.ui.$networkName.text('Sepolia');
        } else if (network === 'hardhat') {
          self.ui.$networkIndicator.addClass('hardhat');
          self.ui.$networkName.text('Local H.');
        } else {
          self.ui.$networkIndicator.addClass('unknown');
          self.ui.$networkName.text('Chain ' + parseInt(chainId, 16));
        }

        Logger.module('UI').log('Network indicator updated:', network, chainId);
      })
      .catch(function(err) {
        Logger.module('UI').error('Failed to get chainId:', err);
        if (self.ui.$networkIndicator instanceof $) {
          self.ui.$networkIndicator.removeClass('sepolia hardhat').addClass('unknown');
          self.ui.$networkName.text('Error');
        }
      });
  },

  onUpdateBoosters: function () {
    var goldCount = InventoryManager.getInstance().walletModel.get('gold_amount');

    this.model.set('_booster_pack_count', InventoryManager.getInstance().boosterPacksCollection.length);
    this.ui.$boosterPackCountNumberLabel.text(InventoryManager.getInstance().boosterPacksCollection.length);
    var label = i18next.t('common.spirit_orb', { count: InventoryManager.getInstance().boosterPacksCollection.length });
    this.ui.$boosterPackStaticLabel.text(label);

    // if we have enough gold to buy a booster or have any boosters, activate the symbol animation
    if (goldCount > 100 || InventoryManager.getInstance().boosterPacksCollection.length > 0) {
      this.activateSymbolBoosterPack();
    }
  },

  activateSymbolBoosterPack: function () {
    if (this.ui.$symbolBoosterPackCenter instanceof $) {
      if (this.ui.$symbolBoosterPackCenter._animation == null) {
        this.ui.$symbolBoosterPackCenter._animation = this.ui.$symbolBoosterPackCenter[0].animate([
          { opacity: 0.7 },
          { opacity: 1.0 },
        ], {
          duration: CONFIG.PULSE_MEDIUM_DURATION * 1000.0,
          direction: 'alternate',
          iterations: Infinity,
        });
      } else {
        this.ui.$symbolBoosterPackCenter._animation.play();
      }
    }
    if (this.ui.$symbolBoosterPackRing instanceof $) {
      if (this.ui.$symbolBoosterPackRing._animation == null) {
        this.ui.$symbolBoosterPackRing._animation = this.ui.$symbolBoosterPackRing[0].animate([
          { transform: 'rotateZ(0deg)' },
          { transform: 'rotateZ(360deg)' },
        ], {
          duration: 12000.0,
          iterations: Infinity,
        });
      } else {
        this.ui.$symbolBoosterPackRing._animation.play();
      }
    }
  },

  deactivateSymbolBoosterPack: function () {
    if (this.ui.$symbolBoosterPackCenter instanceof $ && this.ui.$symbolBoosterPackCenter._animation != null) {
      this.ui.$symbolBoosterPackCenter._animation.pause();
    }
    if (this.ui.$symbolBoosterPackRing instanceof $ && this.ui.$symbolBoosterPackRing._animation != null) {
      this.ui.$symbolBoosterPackRing._animation.pause();
    }
  },

  toggleProfile: function () {
    NavigationManager.getInstance().toggleModalViewByClass(ProfileLayout, { model: ProfileManager.getInstance().profile });
  },

  toggleQuestLog: function () {
    NewPlayerManager.getInstance().removeQuestEmphasis();
    NavigationManager.getInstance().toggleModalViewByClass(QuestLogLayout, {
      collection: QuestsManager.getInstance().getQuestCollection(),
      model: ProgressionManager.getInstance().gameCounterModel,
    });
    this._showNewPlayerUI();
  },

  toggleShop: function () {
    EventBus.getInstance().trigger(EVENTS.show_shop);
  },

  onGoldClicked: function () {
    if (ServerStatusManager.getInstance().isShopEnabled()) {
      this.toggleShop();
    } else {
      EventBus.getInstance().trigger(EVENTS.show_booster_pack_unlock);
    }
  },

  onDiamondClicked: _.throttle(function (e) {
    // NavigationManager.getInstance().showModalView(new PremiumPurchaseDialog());
  }, 1500, { trailing: false }),

  onClickBoosterPackCollection: function () {
    EventBus.getInstance().trigger(EVENTS.show_booster_pack_unlock);
  },

});

// Expose the class either via CommonJS or the global object
module.exports = UtilityMainMenuItemView;
