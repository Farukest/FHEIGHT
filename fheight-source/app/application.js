/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */

// Polyfill for _.contains (renamed to _.includes in newer Underscore.js)
if (typeof _ !== 'undefined' && !_.contains && _.includes) {
  _.contains = _.includes;
}

// User Agent Parsing
const UAParser = require('ua-parser-js');
const uaparser = new UAParser();
uaparser.setUA(window.navigator.userAgent);
const userAgent = uaparser.getResult();
// userAgent now contains : browser, os, device, engine objects

// ---- Marionette Application ---- #
//
const App = new Backbone.Marionette.Application();

// require Firebase via browserify but temporarily alias it global scope
const Firebase = (window.Firebase = require('firebase'));
const Promise = require('bluebird');
const moment = require('moment');
const semver = require('semver');
const querystring = require('query-string');

// core
const Storage = require('app/common/storage');
const Logger = (window.Logger = require('app/common/logger'));

// Disable detailed logging in production.
Logger.enabled = process.env.NODE_ENV !== 'production';

const Landing = require('app/common/landing');
const Session = (window.Session = require('app/common/session2'));
const CONFIG = (window.CONFIG = require('app/common/config'));
const RSX = (window.RSX = require('app/data/resources'));
const PKGS = (window.PKGS = require('app/data/packages'));
const EventBus = (window.EventBus = require('app/common/eventbus'));
const EVENTS = require('app/common/event_types');
const SDK = (window.SDK = require('app/sdk'));
const Analytics = (window.Analytics = require('app/common/analytics'));
const AnalyticsUtil = require('app/common/analyticsUtil');
const UtilsJavascript = require('app/common/utils/utils_javascript');
const UtilsEnv = require('app/common/utils/utils_env');
const UtilsPointer = require('app/common/utils/utils_pointer');
const audio_engine = (window.audio_engine = require('app/audio/audio_engine'));
const openUrl = require('app/common/openUrl');
const i18next = require('i18next');

// models and collections
const CardModel = require('app/ui/models/card');
const FHEIGHTFirebase = require('app/ui/extensions/fheight_firebase');
const FHEIGHTBackbone = require('app/ui/extensions/fheight_backbone');

// Managers / Controllers
const PackageManager = (window.PackageManager = require('app/ui/managers/package_manager'));
const ProfileManager = (window.ProfileManager = require('app/ui/managers/profile_manager'));
const GameDataManager = (window.GameDataManager = require('app/ui/managers/game_data_manager'));
const GamesManager = (window.GamesManager = require('app/ui/managers/games_manager'));
const CrateManager = (window.CrateManager = require('app/ui/managers/crate_manager'));
const NotificationsManager = (window.NotificationsManager = require('app/ui/managers/notifications_manager'));
const NavigationManager = (window.NavigationManager = require('app/ui/managers/navigation_manager'));
const ChatManager = (window.ChatManager = require('app/ui/managers/chat_manager'));
const InventoryManager = (window.InventoryManager = require('app/ui/managers/inventory_manager'));
const QuestsManager = (window.QuestsManager = require('app/ui/managers/quests_manager'));
const TelemetryManager = (window.TelemetryManager = require('app/ui/managers/telemetry_manager'));
const ProgressionManager = (window.ProgressionManager = require('app/ui/managers/progression_manager'));
const ServerStatusManager = (window.ServerStatusManager = require('app/ui/managers/server_status_manager'));
const NewsManager = (window.NewsManager = require('app/ui/managers/news_manager'));
const NewPlayerManager = (window.NewPlayerManager = require('app/ui/managers/new_player_manager'));
const AchievementsManager = (window.AchievementsManager = require('app/ui/managers/achievements_manager'));
const TwitchManager = (window.TwitchManager = require('app/ui/managers/twitch_manager'));
const ShopManager = (window.ShopManager = require('app/ui/managers/shop_manager'));
const StreamManager = (window.StreamManager = require('app/ui/managers/stream_manager'));

// FHE Modules
const FHE = require('app/sdk/fhe');
const FHESession = require('app/common/fhe_session');
const Wallet = require('app/common/wallet');

// Views
const Helpers = require('app/ui/views/helpers');

const LoaderItemView = require('app/ui/views/item/loader');

const UtilityLoadingLoginMenuItemView = require('app/ui/views/item/utility_loading_login_menu');
const UtilityMainMenuItemView = require('app/ui/views/item/utility_main_menu');
const UtilityMatchmakingMenuItemView = require('app/ui/views/item/utility_matchmaking_menu');
const UtilityGameMenuItemView = require('app/ui/views/item/utility_game_menu');
const EscGameMenuItemView = require('app/ui/views/item/esc_game_menu');
const EscMainMenuItemView = require('app/ui/views/item/esc_main_menu');

const LoginMenuItemView = require('app/ui/views/item/login_menu');


const Discord = window.isDesktop ? require('app/common/discord') : null;

const SelectUsernameItemView = require('app/ui/views/item/select_username');

const Scene = require('app/view/Scene');
const GameLayer = require('app/view/layers/game/GameLayer');

const MainMenuItemView = require('app/ui/views/item/main_menu');
const CollectionLayout = require('app/ui/views2/collection/collection');

const PlayLayout = require('app/ui/views/layouts/play');
const PlayLayer = require('app/view/layers/pregame/PlayLayer');

const WatchLayout = require('app/ui/views2/watch/watch_layout');
const ShopLayout = require('app/ui/views2/shop/shop_layout');

const CodexLayout = require('app/ui/views2/codex/codex_layout');
const CodexLayer = require('app/view/layers/codex/CodexLayer');

const TutorialLessonsLayout = require('app/ui/views2/tutorial/tutorial_lessons_layout');
const QuestLogLayout = require('app/ui/views2/quests/quest_log_layout');

const BoosterPackUnlockLayout = require('app/ui/views/layouts/booster_pack_collection');
const BoosterPackOpeningLayer = require('app/view/layers/booster/BoosterPackOpeningLayer');

const VictoryLayer = require('app/view/layers/postgame/VictoryLayer');
const UnlockFactionLayer = require('app/view/layers/reward/UnlockFactionLayer.js');
const ProgressionRewardLayer = require('app/view/layers/reward/ProgressionRewardLayer.js');
const CosmeticKeyRewardLayer = require('app/view/layers/reward/CosmeticKeyRewardLayer.js');
const LadderProgressLayer = require('app/view/layers/postgame/LadderProgressLayer');
const RiftProgressLayer = require('app/view/layers/postgame/RiftProgressLayer');
const CurrencyRewardLayer = require('app/view/layers/reward/CurrencyRewardLayer.js');
const GauntletTicketRewardLayer = require('app/view/layers/reward/GauntletTicketRewardLayer.js');
const BoosterRewardLayer = require('app/view/layers/reward/BoosterRewardLayer.js');
const LootCrateRewardLayer = require('app/view/layers/reward/LootCrateRewardLayer.js');
const FreeCardOfTheDayLayer = require('app/view/layers/reward/FreeCardOfTheDayLayer.js');

const CrateOpeningLayer = require('app/view/layers/crate/CrateOpeningLayer');
const EndOfSeasonLayer = require('app/view/layers/season/EndOfSeasonLayer');

const ResumeGameItemView = require('app/ui/views/item/resume_game');
const FindingGameItemView = require('app/ui/views/item/finding_game');
const ReconnectToGameItemView = require('app/ui/views/item/reconnect_to_game');

const GameLayout = require('app/ui/views/layouts/game');
const TutorialLayout = require('app/ui/views/layouts/tutorial');

const VictoryItemView = require('app/ui/views/item/victory');

const MessagesCompositeView = require('app/ui/views/composite/messages');

const ConfirmDialogItemView = require('app/ui/views/item/confirm_dialog');
const PromptDialogItemView = require('app/ui/views/item/prompt_dialog');
const ActivityDialogItemView = require('app/ui/views/item/activity_dialog');
const ErrorDialogItemView = require('app/ui/views/item/error_dialog');
const AnnouncementModalView = require('app/ui/views/item/announcement_modal');
const ShopSpecialProductAvailableDialogItemView = require('app/ui/views2/shop/shop_special_product_available_dialog');

const ReplayEngine = require('app/replay/replayEngine');

const AnalyticsTracker = require('app/common/analyticsTracker');

// require the Handlebars Template Helpers extension here since it modifies core Marionette code
require('app/ui/extensions/handlebars_template_helpers');

localStorage.debug = 'session:*';

//
// --- Utility ---- #
//

App._screenBlurId = "AppScreenBlurId";
App._userNavLockId = "AppUserNavLockId";
App._queryStringParams = querystring.parse(location.search); // query string params

App.getIsLoggedIn = () => Storage.get('token');

// region AI DEV ROUTES #

if (process.env.AI_TOOLS_ENABLED) {

  /*
    Before using AI DEV ROUTES, make sure you have a terminal open and run `node server/ai/phase_ii_ai.js`.
  */

  window.ai_v1_findNextActions = (playerId, difficulty) => new Promise(function(resolve, reject) {
    const request = $.ajax({
      url: "http://localhost:5001/v1_find_next_actions",
      data: JSON.stringify({
        game_session_data: SDK.GameSession.getInstance().generateGameSessionSnapshot(),
        player_id: playerId,
        difficulty
      }),
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json'
    });

    request.done(function(res){
      const actionsData = JSON.parse(res.actions);
      const actions = [];
      for (var actionData of Array.from(actionsData)) {
        var action = SDK.GameSession.getInstance().deserializeActionFromFirebase(actionData);
        actions.push(action);
      }
      console.log("v1_find_next_actions -> ", actions);
      return resolve(actions);
    });

    return request.fail(function(jqXHR){
      let errorMessage;
      if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
        errorMessage = jqXHR.responseJSON.message;
      } else {
        errorMessage = "Something went wrong.";
      }
      return reject(errorMessage);
    });}).catch(App._error);

  window.ai_v2_findActionSequence = (playerId, depthLimit, msTimeLimit) => new Promise(function(resolve, reject) {
    const request = $.ajax({
      url: "http://localhost:5001/v2_find_action_sequence",
      data: JSON.stringify({
        game_session_data: SDK.GameSession.getInstance().generateGameSessionSnapshot(),
        player_id: playerId,
        depth_limit: depthLimit,
        ms_time_limit: msTimeLimit
      }),
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json'
    });

    request.done(function(res){
      const sequenceActionsData = JSON.parse(res.sequence_actions);
      console.log("ai_v2_findActionSequence -> ", sequenceActionsData);
      return resolve(sequenceActionsData);
    });

    return request.fail(function(jqXHR){
      let errorMessage;
      if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
        errorMessage = jqXHR.responseJSON.message;
      } else {
        errorMessage = "Something went wrong.";
      }
      return reject(errorMessage);
    });}).catch(App._error);

  window.ai_gameStarted = false;
  window.ai_gameRunning = false;
  window.ai_gameStepsData = null;
  window.ai_gameStepsDataPromise = null;
  window.ai_gamePromise = null;
  window.ai_gameNeedsMulligan = false;

  window.ai_stopAIvAIGame = function() {
    if (window.ai_gameStarted) {
      window.ai_gameStarted = false;
      window.ai_gameRunning = false;
      window.ai_gameStepsData = null;
      window.ai_gameNeedsMulligan = false;

      if (window.ai_gameStepsDataPromise != null) {
        window.ai_gameStepsDataPromise.cancel();
        window.ai_gameStepsDataPromise = null;
      }

      if (window.ai_gamePromise != null) {
        window.ai_gamePromise.cancel();
        window.ai_gamePromise = null;
      }
    }

    return new Promise(function(resolve, reject) {
      const request = $.ajax({
        url: "http://localhost:5001/stop_game",
        data: JSON.stringify({}),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });

      request.done(res => resolve());

      return request.fail(function(jqXHR){
        let errorMessage;
        if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
          errorMessage = jqXHR.responseJSON.message;
        } else {
          errorMessage = "Something went wrong.";
        }
        return reject(errorMessage);
      });}).catch(App._error);
  };

  window.ai_pauseAIvAIGame = function() {
    if (window.ai_gameRunning) {
      return window.ai_gameRunning = false;
    }
  };

  window.ai_resumeAIvAIGame = function() {
    if (!window.ai_gameRunning) {
      window.ai_gameRunning = true;
      return window.ai_stepAIvAIGame();
    }
  };

  window.ai_runAIvAIGame = function(ai1Version, ai2Version, ai1GeneralId, ai2GeneralId, depthLimit, msTimeLimit, ai1NumRandomCards, ai2NumRandomCards) {
    // pick random general if none provided
    if ((ai1GeneralId == null)) { ai1GeneralId = _.sample(_.sample(SDK.FactionFactory.getAllPlayableFactions()).generalIds); }
    if ((ai2GeneralId == null)) { ai2GeneralId = _.sample(_.sample(SDK.FactionFactory.getAllPlayableFactions()).generalIds); }
    const ai1FactionId = SDK.FactionFactory.factionIdForGeneralId(ai1GeneralId);
    const ai2FactionId = SDK.FactionFactory.factionIdForGeneralId(ai2GeneralId);

    // stop running game
    window.ai_gamePromise = ai_stopAIvAIGame().then(function() {
      Logger.module("APPLICATION").log(`ai_runAIvAIGame - > requesting for v${ai1Version} w/ general ${SDK.CardFactory.cardForIdentifier(ai1GeneralId, SDK.GameSession.getInstance()).getName()} vs v${ai2Version} w/ general ${SDK.CardFactory.cardForIdentifier(ai2GeneralId, SDK.GameSession.getInstance()).getName()}`);
      window.ai_gameStarted = true;
      window.ai_gameRunning = true;

      // request run simulation
      const startSimulationPromise = new Promise(function(resolve, reject) {
        const request = $.ajax({
          url: "http://localhost:5001/start_game",
          data: JSON.stringify({
            ai_1_version: ai1Version,
            ai_1_general_id: ai1GeneralId,
            ai_2_version: ai2Version,
            ai_2_general_id: ai2GeneralId,
            depth_limit: depthLimit,
            ms_time_limit: msTimeLimit,
            ai_1_num_random_cards: ai1NumRandomCards,
            ai_2_num_random_cards: ai2NumRandomCards
          }),
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json'
        });

        request.done(res => resolve(JSON.parse(res.game_session_data)));

        return request.fail(function(jqXHR){
          let errorMessage;
          if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
            errorMessage = jqXHR.responseJSON.message;
          } else {
            errorMessage = "Something went wrong.";
          }
          return reject(errorMessage);
        });
      });

      // start loading
      const loadingPromise = NavigationManager.getInstance().showDialogForLoad().then(() => PackageManager.getInstance().loadGamePackageWithoutActivation([ai1FactionId, ai2FactionId]));

      return Promise.all([
        startSimulationPromise,
        loadingPromise
      ]);}).spread(function(sessionData) {
      Logger.module("APPLICATION").log(`ai_runAIvAIGame - > starting ${sessionData.gameId} with data:`, sessionData);
      // reset and deserialize
      SDK.GameSession.reset();
      SDK.GameSession.getInstance().deserializeSessionFromFirebase(sessionData);

      // switch session game type to sandbox
      SDK.GameSession.getInstance().setGameType(SDK.GameType.Sandbox);

      // set game user id to match player 1
      SDK.GameSession.getInstance().setUserId(SDK.GameSession.getInstance().getPlayer1Id());

      return App._startGame();}).then(function() {
      Logger.module("APPLICATION").log(`ai_runAIvAIGame - > ${SDK.GameSession.getInstance().getGameId()} running`);
      // stop running game when game is terminated
      Scene.getInstance().getGameLayer().getEventBus().on(EVENTS.terminate, window.ai_stopAIvAIGame);

      // listen for finished showing step
      // wait for active (ai will already have mulliganed)
      return Scene.getInstance().getGameLayer().whenStatus(GameLayer.STATUS.ACTIVE).then(function() {
        Scene.getInstance().getGameLayer().getEventBus().on(EVENTS.after_show_step, window.ai_stepAIvAIGame);

        // execute first step in sequence
        return window.ai_stepAIvAIGame();
      });}).cancellable()
    .catch(Promise.CancellationError, e => Logger.module("APPLICATION").log("ai_runAIvAIGame -> promise chain cancelled")).catch(App._error);
    return ai_gamePromise;
  };

  window.ai_runAIvAIGameFromCurrentSession = function(ai1Version, ai2Version, depthLimit, msTimeLimit) {
    // stop running game
    window.ai_gamePromise = ai_stopAIvAIGame().then(function() {
      Logger.module("APPLICATION").log(`ai_runAIvAIGameFromCurrentSession - > requesting for v${ai1Version} vs v${ai2Version}`);
      window.ai_gameStarted = true;
      window.ai_gameRunning = true;

      // set as non authoritative
      // all steps will be coming from ai simulation server
      SDK.GameSession.getInstance().setIsRunningAsAuthoritative(false);

      // request run simulation
      return new Promise(function(resolve, reject) {
        const request = $.ajax({
          url: "http://localhost:5001/start_game_from_data",
          data: JSON.stringify({
            ai_1_version: ai1Version,
            ai_2_version: ai2Version,
            depth_limit: depthLimit,
            ms_time_limit: msTimeLimit,
            game_session_data: SDK.GameSession.getInstance().generateGameSessionSnapshot()
          }),
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json'
        });

        request.done(res => resolve());

        return request.fail(function(jqXHR){
          let errorMessage;
          if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
            errorMessage = jqXHR.responseJSON.message;
          } else {
            errorMessage = "Something went wrong.";
          }
          return reject(errorMessage);
        });
      });}).then(function() {
      // stop running game when game is terminated
      Scene.getInstance().getGameLayer().getEventBus().on(EVENTS.terminate, window.ai_stopAIvAIGame);

      // listen for finished showing step
      Scene.getInstance().getGameLayer().whenStatus(GameLayer.STATUS.ACTIVE).then(function() {
        Scene.getInstance().getGameLayer().getEventBus().on(EVENTS.after_show_step, window.ai_stepAIvAIGame);

        if (window.ai_gameNeedsMulligan) {
          Logger.module("APPLICATION").log("ai_stepAIvAIGame -> mulligan complete");
          window.ai_gameNeedsMulligan = false;
          return window.ai_stepAIvAIGame();
        }
      });

      // check if needs mulligan
      window.ai_gameNeedsMulligan = SDK.GameSession.getInstance().isNew();

      // execute first step in sequence
      return window.ai_stepAIvAIGame()
      .cancellable()
      .catch(Promise.CancellationError, e => Logger.module("APPLICATION").log("ai_runAIvAIGameFromCurrentSession -> promise chain cancelled"));}).catch(App._error);

    return ai_gamePromise;
  };

  window.ai_stepAIvAIGame = function(event) {
    if (__guard__(event != null ? event.step : undefined, x => x.action) instanceof SDK.EndTurnAction) { return; } // ignore auto stepping due to end turn action as start turn will cause auto step

    Logger.module("APPLICATION").log(`ai_stepAIvAIGame -> ${SDK.GameSession.getInstance().getGameId()} step queue length ${Scene.getInstance().getGameLayer()._stepQueue.length}`);
    if ((window.ai_gameStepsDataPromise == null) && (Scene.getInstance().getGameLayer()._stepQueue.length === 0)) {
      // request step game
      window.ai_gameStepsDataPromise = new Promise(function(resolve, reject) {
        const request = $.ajax({
          url: "http://localhost:5001/step_game",
          data: JSON.stringify({
            game_id: SDK.GameSession.getInstance().getGameId()
          }),
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json'
        });

        request.done(function(res){
          if (res.steps != null) {
            return resolve(JSON.parse(res.steps));
          } else {
            return resolve([]);
          }
        });

        return request.fail(function(jqXHR){
          let errorMessage;
          if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
            errorMessage = jqXHR.responseJSON.message;
          } else {
            errorMessage = "Something went wrong.";
          }
          return reject(errorMessage);
        });}).then(function(stepsData) {
        Logger.module("APPLICATION").log("ai_stepAIvAIGame -> steps:", stepsData.slice(0));
        return window.ai_gameStepsData = stepsData;}).cancellable()
      .catch(Promise.CancellationError, e => Logger.module("APPLICATION").log("ai_stepAIvAIGame -> promise chain cancelled"));
    }

    return window.ai_gameStepsDataPromise.then(function() {
      if (window.ai_gameRunning && !SDK.GameSession.getInstance().isOver() && (window.ai_gameStepsData != null) && (window.ai_gameStepsData.length > 0)) {
        // remove and deserialize next step in sequence
        const stepData = window.ai_gameStepsData.shift();
        const step = SDK.GameSession.getInstance().deserializeStepFromFirebase(stepData);
        Logger.module("APPLICATION").log("ai_stepAIvAIGame -> step:", step);

        // execute step
        SDK.GameSession.getInstance().executeAuthoritativeStep(step);

        // check game status and steps data
        if (SDK.GameSession.getInstance().isOver() || (window.ai_gameStepsData.length === 0)) {
          Logger.module("APPLICATION").log("ai_stepAIvAIGame -> done");
          window.ai_gameStepsData = null;
          return window.ai_gameStepsDataPromise = null;
        } else if (step.action instanceof SDK.EndTurnAction) {
          // auto step to start turn
          Logger.module("APPLICATION").log("ai_stepAIvAIGame -> continuing end turn");
          return window.ai_stepAIvAIGame();
        } else if (window.ai_gameNeedsMulligan) {
          // auto step to next mulligan
          Logger.module("APPLICATION").log("ai_stepAIvAIGame -> continuing mulligan");
          return window.ai_stepAIvAIGame();
        }
      }
    });
  };

  window.ai_runHeadlessAIvAIGames = function(numGames, ai1Version, ai2Version, ai1GeneralId, ai2GeneralId, depthLimit, msTimeLimit, ai1NumRandomCards, ai2NumRandomCards) {
    Logger.module("APPLICATION").log(`ai_runHeadlessAIvAIGames - > requesting ${numGames} games with v${ai1Version} vs v${ai2Version}`);

    // request run games
    return new Promise(function(resolve, reject) {
      const request = $.ajax({
        url: "http://localhost:5001/run_headless_games",
        data: JSON.stringify({
          ai_1_version: ai1Version,
          ai_1_general_id: ai1GeneralId,
          ai_2_version: ai2Version,
          ai_2_general_id: ai2GeneralId,
          num_games: numGames,
          depth_limit: depthLimit,
          ms_time_limit: msTimeLimit,
          ai_1_num_random_cards: ai1NumRandomCards,
          ai_2_num_random_cards: ai2NumRandomCards
        }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });

      request.done(res => resolve());

      return request.fail(function(jqXHR){
        let errorMessage;
        if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
          errorMessage = jqXHR.responseJSON.message;
        } else {
          errorMessage = "Something went wrong.";
        }
        return reject(errorMessage);
      });
    });
  };
}

// endregion AI DEV ROUTES #

//
// --- Main ---- #
//

App.getIsShowingMain = () => // temporary method to check if the user can navigate to main (i.e. not already there)
// this does NOT work for switching between main sub-screens
NavigationManager.getInstance().getIsShowingContentViewClass(LoginMenuItemView) || NavigationManager.getInstance().getIsShowingContentViewClass(MainMenuItemView) || NavigationManager.getInstance().getIsShowingContentViewClass(ResumeGameItemView);

App.main = function() {
  if ((App._mainPromise == null)) {
    App._mainPromise = App._startPromise.then(function() {
      Logger.module("APPLICATION").log("App:main");
      // get and reset last game data
      const {
        lastGameType
      } = CONFIG;
      const wasSpectate = CONFIG.lastGameWasSpectate;
      const wasTutorial = CONFIG.lastGameWasTutorial;
      const wasDeveloper = CONFIG.lastGameWasDeveloper;
      const wasDailyChallenge = CONFIG.lastGameWasDailyChallenge;
      CONFIG.resetLastGameData();

      // destroy game and clear game data
      App.cleanupGame();

      // always make sure we're disconnected from the last game
      SDK.NetworkManager.getInstance().disconnect();

      // reset routes to main
      NavigationManager.getInstance().resetRoutes();
      NavigationManager.getInstance().addMajorRoute("main", App.main, App);

      // always restore user triggered navigation
      NavigationManager.getInstance().requestUserTriggeredNavigationUnlocked(App._userNavLockId);

      if (App._queryStringParams["replayId"] != null) {
        Logger.module("APPLICATION").log("jumping straight into replay...");
        App.setCallbackWhenCancel(() => alert('all done!'));
        return PackageManager.getInstance().loadAndActivateMajorPackage("nongame", null, null, function() {
          EventBus.getInstance().trigger(EVENTS.start_replay, {
            replayId: App._queryStringParams["replayId"]
          });
          return Promise.resolve();
        });
      } else {
        if (!App.getIsLoggedIn()) {
          return App._showLoginMenu();
        } else {
          // all good, show main menu
          return App.managersReadyDeferred.promise.then(function() {
            // set user as loading
            ChatManager.getInstance().setStatus(ChatManager.STATUS_LOADING);

            // # EULA ACCEPTANCE CHECK HERE SO IT FIRES FOR ALREADY LOGGED IN PLAYERS

            // # strings used for session storage and profile storage
            // sessionAcceptedEula = Storage.namespace() + '.hasAcceptedEula'
            // storageAcceptedEula = 'hasAcceptedEula'
            // storageSentAcceptedEulaNotify = 'hasSentAcceptedEulaNotify'

            // # the user has accepted terms in the local session, ensure we are set in profile storage
            // if window.sessionStorage.getItem(sessionAcceptedEula)
            //   ProfileManager.getInstance().set(storageAcceptedEula, true)

            // # check in profile storage if the user has accepted terms
            // if !ProfileManager.getInstance().get(storageAcceptedEula)
            //   # TODO - This is not actually good, but we need to make a new terms and conditions page
            //   return App._showTerms()
            // # user has accepted, check if they have sent notification
            // else
            //   if !ProfileManager.getInstance().get(storageSentAcceptedEulaNotify)
            //     ProfileManager.getInstance().set(storageSentAcceptedEulaNotify, true)

            // check for an active game
            let lastGameModel = null;
            if (GamesManager.getInstance().playerGames.length > 0) {
              lastGameModel = GamesManager.getInstance().playerGames.first();
            }

            // calculate minutes since last game
            const msSinceLastGame = moment().utc().valueOf() - ((lastGameModel != null ? lastGameModel.get("created_at") : undefined) || 0);
            const minutesSinceLastGame = moment.duration(msSinceLastGame).asMinutes();

            // if the last game is an active multiplayer game within last 45 minutes, show the continue game screen
            if ((lastGameModel != null) && (lastGameModel.get("cancel_reconnect") !== true) && ((lastGameModel.get("status") === "active") || (lastGameModel.get("status") === "new")) && lastGameModel.get("created_at") && (minutesSinceLastGame < CONFIG.MINUTES_ALLOWED_TO_CONTINUE_GAME) && SDK.GameType.isMultiplayerGameType(lastGameModel.get("game_type"))) {
              // has active game, prompt user to resume
              Logger.module("UI").log("Last active game was on ", new Date(lastGameModel.get("created_at")), "with data", lastGameModel);
              return App._resumeGame(lastGameModel);
            } else if (!NewPlayerManager.getInstance().isDoneWithTutorial()) {
              // show tutorial layout
              return App._showTutorialLessons();
            } else if (QuestsManager.getInstance().hasUnreadQuests()) {
              // show main menu
              return App._showMainMenu();
            } else {
              // try to return to selection for previous game type
              if (wasSpectate) {
                return App._showMainMenu();
              } else if (wasDailyChallenge) {
                QuestsManager.getInstance().markDailyChallengeCompletionAsUnread();
                return App._showMainMenu();
              } else if ((lastGameType === SDK.GameType.Ranked) && !NewPlayerManager.getInstance().getEmphasizeBoosterUnlock()) {
                return App.showPlay(SDK.PlayModes.Ranked, true);
              } else if ((lastGameType === SDK.GameType.Casual) && !NewPlayerManager.getInstance().getEmphasizeBoosterUnlock()) {
                return App.showPlay(SDK.PlayModes.Casual, true);
              } else if (lastGameType === SDK.GameType.Gauntlet) {
                return App.showPlay(SDK.PlayModes.Gauntlet, true);
              } else if ((lastGameType === SDK.GameType.Challenge) && !wasTutorial) {
                return App.showPlay(SDK.PlayModes.Challenges, true);
              } else if (lastGameType === SDK.GameType.SinglePlayer) {
                return App.showPlay(SDK.PlayModes.Practice, true);
              } else if (lastGameType === SDK.GameType.BossBattle) {
                return App.showPlay(SDK.PlayModes.BossBattle, true);
              } else if ((lastGameType === SDK.GameType.Sandbox) && !wasDeveloper) {
                return App.showPlay(SDK.PlayModes.Sandbox, true);
              } else if (lastGameType === SDK.GameType.Rift) {
                return App.showPlay(SDK.PlayModes.Rift, true);
              } else {
                return App._showMainMenu();
              }
            }
          });
        }
      }
    }).finally(function() {
      App._mainPromise = null;
      return Promise.resolve();
    });
  }
  return App._mainPromise;
};

App._showLoginMenu = function(options) {
  Logger.module("APPLICATION").log("App:_showLoginMenu");
  return PackageManager.getInstance().loadAndActivateMajorPackage("nongame", null, null,
    (function() {
      // analytics call
      let utilityPromise;
      Analytics.page("Login",{ path: "/#login" });

      // show main scene
      const viewPromise = Scene.getInstance().showMain();

      // show login menu
      const contentPromise = NavigationManager.getInstance().showContentView(new LoginMenuItemView(options));

      // show utility menu for desktop only
      if (window.isDesktop) {
        utilityPromise = NavigationManager.getInstance().showUtilityView(new UtilityLoadingLoginMenuItemView());
      } else {
        utilityPromise = Promise.resolve();
      }

      return Promise.all([
        viewPromise,
        contentPromise,
        utilityPromise
      ]);
    })
  );
};

App._showSelectUsername = function(data) {
  Logger.module("APPLICATION").log("App:_showSelectUsername");
  return PackageManager.getInstance().loadAndActivateMajorPackage("nongame", null, null,
    (function() {
      // show main scene
      const viewPromise = Scene.getInstance().showMain();

      // show selection dialog
      const selectUsernameModel = new Backbone.Model({});
      const selectUsernameItemView = new SelectUsernameItemView({model: selectUsernameModel});
      selectUsernameItemView.listenToOnce(selectUsernameItemView, "success", () => {
        // TODO: move this into SelectUsernameItemView
        // We refresh token so the username property is now included
        return Session.refreshToken()
        .then(function(refreshed) {
          });
      });

      const contentPromise = NavigationManager.getInstance().showDialogView(selectUsernameItemView);

      return Promise.all([
        NavigationManager.getInstance().destroyModalView(),
        NavigationManager.getInstance().destroyContentView(),
        viewPromise,
        contentPromise
      ]);
    })
  );
};

App._showTerms = function(options) {
  if (options == null) { options = {}; }
  Logger.module("APPLICATION").log("App:_showTerms");
  return PackageManager.getInstance().loadAndActivateMajorPackage("nongame", null, null,
    (function() {
      // show main scene
      let mainPromise;
      const viewPromise = Scene.getInstance().showMain();

      if (App.getIsLoggedIn()) {
        ProfileManager.getInstance().set('hasAcceptedEula', true);
        mainPromise = App.main();
      } else {
        window.sessionStorage.setItem(Storage.namespace() + '.hasAcceptedEula', true);
        mainPromise = App._showLoginMenu({type: 'register'});
      }

      return Promise.all([
        viewPromise,
        // contentPromise
        mainPromise
      ]);
    })
  );
};

App._showTutorialLessons = function(lastCompletedChallenge) {
  Logger.module("APPLICATION").log("App:_showTutorialChallenges");

  return PackageManager.getInstance().loadAndActivateMajorPackage("nongame", null, null, function() {
    // analytics call
    Analytics.page("Tutorial Lessons",{ path: "/#tutorial_lessons" });

    // set status as online
    ChatManager.getInstance().setStatus(ChatManager.STATUS_ONLINE);

    // show main scene
    const viewPromise = Scene.getInstance().showMain().then(function() {
      // play main layer music
      const mainLayer = Scene.getInstance().getMainLayer();
      if (mainLayer != null) { return mainLayer.playMusic(); }
    });

    // show main menu
    const tutorialLessonsLayoutView = new TutorialLessonsLayout({
      lastCompletedChallenge,
    });
    const contentPromise = NavigationManager.getInstance().showContentView(tutorialLessonsLayoutView);

    return Promise.all([
      viewPromise,
      contentPromise
    ]);
  });
};

App._showMainMenu = function() {
  Logger.module("APPLICATION").log("App:_showMainMenu");

  return PackageManager.getInstance().loadAndActivateMajorPackage("nongame", null, null, function() {
    // analytics call
    Analytics.page("Main Menu",{ path: "/#main_menu" });

    // notify Discord status
    if (Discord) {
      const presence = {
        instance: 0,
        details: 'In Main Menu',
        largeImageKey: 'idle'
      };
      Discord.updatePresence(presence);
    }

    // show main scene
    const viewPromise = Scene.getInstance().showMain().then(function() {
      // play main layer music
      const mainLayer = Scene.getInstance().getMainLayer();
      if (mainLayer != null) { return mainLayer.playMusic(); }
    });

    const endOfSeasonRewardsPromise = App.showEndOfSeasonRewards();

    return endOfSeasonRewardsPromise.then( function() {

      // show achievement rewards
      const achievementsPromise = App.showAchievementCompletions();

      return achievementsPromise
      .then(function(){
        // show twitch rewards
        const twitchRewardPromise = App.showTwitchRewards();
        return twitchRewardPromise;
      }).then(function() {
        // set status as online
        let modalPromise;
        ChatManager.getInstance().setStatus(ChatManager.STATUS_ONLINE);

        // show main menu
        const contentPromise = NavigationManager.getInstance().showContentView(new MainMenuItemView({model: ProfileManager.getInstance().profile}));

        // show utility menu
        const utilityPromise = NavigationManager.getInstance().showUtilityView(new UtilityMainMenuItemView({model: ProfileManager.getInstance().profile}));

        if (NewsManager.getInstance().getFirstUnreadAnnouncement()) {
          // show announcment UI if we have an unread announcement
          modalPromise = NewsManager.getInstance().getFirstUnreadAnnouncementContentAsync().then(announcementContentModel => NavigationManager.getInstance().showModalView(new AnnouncementModalView({model:announcementContentModel})));
        } else {
          // show quests if any quests
          modalPromise = Promise.resolve();
          if (QuestsManager.getInstance().hasUnreadQuests() || QuestsManager.getInstance().hasUnreadDailyChallenges()) {
            modalPromise = NavigationManager.getInstance().toggleModalViewByClass(QuestLogLayout,{
              collection: QuestsManager.getInstance().getQuestCollection(),
              model: ProgressionManager.getInstance().gameCounterModel,
              showConfirm:true
            });
          }
        }

        return Promise.all([
          viewPromise,
          contentPromise,
          modalPromise,
          utilityPromise
        ]);
      });
    });
  });
};


//
// --- Major Layouts ---- #
//

App.showPlay = function(playModeIdentifier, showingDirectlyFromGame) {
  if (!App.getIsLoggedIn()) {
    return Promise.reject();
  } else {
    return PackageManager.getInstance().loadAndActivateMajorPackage("nongame", null, null, function() {
      // force play mode to string
      if (!_.isString(playModeIdentifier)) { playModeIdentifier = ""; }

      // add mode to route
      NavigationManager.getInstance().addMajorRoute("play_" + playModeIdentifier, App.showPlay, App, [playModeIdentifier]);

      // if currently in play modes, show new play mode direct
      const currentContentView = NavigationManager.getInstance().getContentView();
      if (currentContentView instanceof PlayLayout) {
        return currentContentView.showPlayMode(playModeIdentifier);
      } else {
        let achievementsPromise, viewPromise;
        if (showingDirectlyFromGame) {
          // show play layer
          viewPromise = Scene.getInstance().showContentByClass(PlayLayer, true);

          // show achievement rewards
          achievementsPromise = App.showAchievementCompletions();
        } else {
          achievementsPromise = (viewPromise = Promise.resolve());
        }

        return achievementsPromise.then(function() {
          // set status as online
          ChatManager.getInstance().setStatus(ChatManager.STATUS_ONLINE);

          // show UI
          return Promise.all([
            viewPromise,
            NavigationManager.getInstance().showContentView(new PlayLayout({model: new Backbone.Model({playModeIdentifier})}))
          ]).then(function(){
            // update available shop specials with current top rank and win count model and notify user if a new one has become available
            if (ShopManager.getInstance().isNewSpecialAvailable) {
              ShopManager.getInstance().markNewAvailableSpecialAsRead();
              return NavigationManager.getInstance().showDialogView(new ShopSpecialProductAvailableDialogItemView({
                model: ShopManager.getInstance().availableSpecials.at(ShopManager.getInstance().availableSpecials.length-1)
              }));
            }});
        });
      }
    });
  }
};

App.showWatch = function(){
  if (!App.getIsLoggedIn() || NavigationManager.getInstance().getContentView() instanceof WatchLayout) {
    return Promise.reject();
  } else {
    return PackageManager.getInstance().loadAndActivateMajorPackage("nongame", null, null, function() {
      Analytics.page("Watch",{ path: "/#watch" });

      // set status as online
      ChatManager.getInstance().setStatus(ChatManager.STATUS_ONLINE);

      // add mode to route
      NavigationManager.getInstance().addMajorRoute("watch", App.showWatch, App);

      // show layout
      return NavigationManager.getInstance().showContentView(new WatchLayout());
    });
  }
};

App.showShop = function(){
  if (!App.getIsLoggedIn()) {
    return Promise.reject();
  } else {
    return PackageManager.getInstance().loadAndActivateMajorPackage("nongame", null, null, function() {
      Analytics.page("Shop",{ path: "/#shop" });
      // add mode to route
      NavigationManager.getInstance().addMajorRoute("shop", App.showShop, App);
      // show layout
      return NavigationManager.getInstance().showContentView(new ShopLayout());
    });
  }
};

App.showCollection = function() {
  if (!App.getIsLoggedIn() || NavigationManager.getInstance().getContentView() instanceof CollectionLayout) {
    return Promise.reject();
  } else {
    return PackageManager.getInstance().loadAndActivateMajorPackage("nongame", null, null, function() {
      // set status as online
      ChatManager.getInstance().setStatus(ChatManager.STATUS_ONLINE);

      // add mode to route
      NavigationManager.getInstance().addMajorRoute("collection", App.showCollection, App);

      // notify Discord status
      if (Discord) {
        const presence = {
          instance: 0,
          details: 'Browsing Collection',
          largeImageKey: 'idle'
        };
        Discord.updatePresence(presence);
      }

      // show UI
      return Promise.all([
        Scene.getInstance().showMain(),
        NavigationManager.getInstance().showContentView(new CollectionLayout({model: new Backbone.Model()}))
      ]);
    });
  }
};

App.showCodex = function() {
  if (!App.getIsLoggedIn() || NavigationManager.getInstance().getContentView() instanceof CodexLayout) {
    return Promise.reject();
  } else {
    return PackageManager.getInstance().loadAndActivateMajorPackage("nongame", null, null, function() {
      // set status as online
      ChatManager.getInstance().setStatus(ChatManager.STATUS_ONLINE);

      // add mode to route
      NavigationManager.getInstance().addMajorRoute("codex", App.showCodex, App);

      // show UI
      return Promise.all([
        Scene.getInstance().showContent(new CodexLayer(), true),
        NavigationManager.getInstance().showContentView(new CodexLayout({model: new Backbone.Model()}))
      ]);
    });
  }
};

App.showBoosterPackUnlock = function() {
  if (!App.getIsLoggedIn() || NavigationManager.getInstance().getContentView() instanceof BoosterPackUnlockLayout) {
    return Promise.reject();
  } else {
    return PackageManager.getInstance().loadAndActivateMajorPackage("nongame", null, null, function() {
      // set status as online
      ChatManager.getInstance().setStatus(ChatManager.STATUS_ONLINE);

      // add route
      NavigationManager.getInstance().addMajorRoute("booster_pack_unlock", App.showBoosterPackUnlock, App);

      // show UI
      return Promise.all([
        Scene.getInstance().showContent(new BoosterPackOpeningLayer(), true),
        NavigationManager.getInstance().showContentView(new BoosterPackUnlockLayout())
      ]);
    });
  }
};

App.showCrateInventory = function() {
  if (!App.getIsLoggedIn() || Scene.getInstance().getOverlay() instanceof CrateOpeningLayer) {
    return Promise.reject();
  } else {
    return PackageManager.getInstance().loadAndActivateMajorPackage("nongame", null, null, function() {
      // set status as online
      ChatManager.getInstance().setStatus(ChatManager.STATUS_ONLINE);

      // add route
      NavigationManager.getInstance().addMajorRoute("crate_inventory", App.showCrateInventory, App);

      // show UI
      return Promise.all([
        NavigationManager.getInstance().destroyContentView(),
        Scene.getInstance().showOverlay(new CrateOpeningLayer())
      ]);
    });
  }
};

//
// --- Session Events ---- #
//

App.onLogin = function(data) {
  Logger.module("APPLICATION").log(`User logged in: ${data.userId}`);

  // save token to localStorage
  Storage.set('token', data.token);

  // setup ajax headers for jquery/backbone requests
  $.ajaxSetup({
    headers: {
      Authorization: `Bearer ${data.token}`,
      "Client-Version": window.BUILD_VERSION
    }});

  // check is new signup flag is passed
  // can't use analytics data since the first login may have
  // already happened on /register page
  if (Landing.isNewSignup()) {
    Landing.addPixelsToHead();
    Landing.firePixels();
  }

  // check for null username here
  // dialog should be uncancelleable
  // dialog success should re-trigger session login so new token contains all required params
  if (!Session.username) {
    return App._showSelectUsername(data);
  }

  // Trigger the eventbus login event for the utilty menus
  EventBus.getInstance().trigger(EVENTS.session_logged_in);

  // connect all managers
  ProfileManager.getInstance().connect({userId: data.userId});
  GameDataManager.getInstance().connect();
  GamesManager.getInstance().connect();
  ChatManager.getInstance().connect();
  QuestsManager.getInstance().connect();
  InventoryManager.getInstance().connect();
  NavigationManager.getInstance().connect();
  NotificationsManager.getInstance().connect();
  ProgressionManager.getInstance().connect();
  ServerStatusManager.getInstance().connect();
  TelemetryManager.getInstance().connect();
  NewsManager.getInstance().connect();
  NewPlayerManager.getInstance().connect();
  AchievementsManager.getInstance().connect();
  TwitchManager.getInstance().connect();
  CrateManager.getInstance().connect();
  ShopManager.getInstance().connect();
  StreamManager.getInstance().connect();

  TelemetryManager.getInstance().clearSignal("session","not-logged-in");
  TelemetryManager.getInstance().setSignal("session","logged-in");

  return Promise.all([
    ProfileManager.getInstance().onReady(),
    InventoryManager.getInstance().onReady(),
    QuestsManager.getInstance().onReady(),
    GamesManager.getInstance().onReady(),
    GameDataManager.getInstance().onReady(),
    ChatManager.getInstance().onReady(),
    ProgressionManager.getInstance().onReady(),
    ServerStatusManager.getInstance().onReady(),
    NewPlayerManager.getInstance().onReady(),
    AchievementsManager.getInstance().onReady(),
    TwitchManager.getInstance().onReady(),
    CrateManager.getInstance().onReady()
  ]).then(function() {
    // update resolution values as of login
    App._updateLastResolutionValues();

    // we're all done loading managers
    App.managersReadyDeferred.resolve();

    // setup analytics
    App.onLoginAnalyticsSetup(data);
    // show the main screen
    return App.main();}).catch(function(err) {
    App.managersReadyDeferred.reject();
    Logger.module("APPLICATION").log("ERROR initializing managers");
    if (err === null) { err = new Error("ERROR initializing managers"); }
    App._error(err.message);
    throw err;}).finally(function() {});
};
    // NavigationManager.getInstance().destroyDialogView()

App.onLoginAnalyticsSetup = function(loginData) {
  // region analytics data
  // Include users analytics data retrieved with session
  const identifyParams = {};
  let utmParams = {};
  let hadPreviousSession = false;
  if (loginData.analyticsData != null) {
    utmParams = _.extend(utmParams, loginData.analyticsData);
    if (utmParams.first_purchased_at != null) {
      // Shouldn't be necessary but just in case
      utmParams.first_purchased_at = moment.utc(utmParams.first_purchased_at).toISOString();
    }
    if (loginData.analyticsData.last_session_at) {
      delete utmParams.last_session_at;
      hadPreviousSession = true;
    }
  }

  // identify the user with the partial data until we connect managers
  Analytics.identify(loginData.userId, identifyParams, utmParams);


  if (!hadPreviousSession) {
    Analytics.track("first login",{
      category:Analytics.EventCategory.FTUE,
    },{
      nonInteraction:1,
      sendUTMData:true
    });
    Analytics.track("registered", {
      category:Analytics.EventCategory.Marketing
    },{
      sendUTMData:true,
      nonInteraction:1
    });
  }

  // endregion analytics data

  // region analytics data
  // identify the user with their current rank
  const gamesManager = GamesManager.getInstance();
  let rank = gamesManager.rankingModel.get("rank");
  // default rank to 30 if it's null
  if ((rank == null)) { rank = 30; }
  // top rank
  let topRank = gamesManager.topRankingModel.get("top_rank");
  if((topRank == null)) { topRank = gamesManager.topRankingModel.get("rank"); }
  if((topRank == null)) { topRank = 30; }
  // game count
  const gameCount = ProgressionManager.getInstance().getGameCount();

  // set up the params to pass for the identify call
  identifyParams.rank = rank;
  identifyParams.top_ever_rank = topRank;
  identifyParams.game_count = gameCount;
  // if we know the registration date
  if (ProfileManager.getInstance().get("created_at")) {
    // turn it to a sortable
    const registered_at = moment.utc(ProfileManager.getInstance().get("created_at")).toISOString();
    // set it on the identifyParams
    identifyParams.registration_date = registered_at;
  }

  // if this user has an LTV parameter
  if (ProfileManager.getInstance().get("ltv")) {
    // set it on the identifyParams
    identifyParams.ltv = ProfileManager.getInstance().get("ltv");
  }

  // Check if today is a recorded seen on day and add it to identifyParams
  const todaysSeenOnIndex = AnalyticsUtil.recordedDayIndexForRegistrationAndSeenOn(moment.utc(ProfileManager.getInstance().get("created_at")),moment.utc());
  if (todaysSeenOnIndex != null) {
    identifyParams[AnalyticsUtil.nameForSeenOnDay(todaysSeenOnIndex)] = 1;
  }

  // re-identify the user with better data now that we have managers connected and pass in the custom dimensions
  Analytics.identify(ProfileManager.getInstance().get('id'), identifyParams, utmParams);

  return Analytics.track("login", {
    category:Analytics.EventCategory.Marketing
  },{
    sendUTMData:true,
    nonInteraction:1
  });
};
  // endregion analytics data

App.onLogout = function() {
  Logger.module("APPLICATION").log("User logged out.");

  TelemetryManager.getInstance().clearSignal("session","logged-in");
  TelemetryManager.getInstance().setSignal("session","not-logged-in");

  // create a new deferred object for managers loading process
  App.managersReadyDeferred = new Promise.defer();

  // destroy out any login specific menus
  NavigationManager.getInstance().destroyNonContentViews();

  // stop playing any music
  audio_engine.current().stop_music();

  Analytics.reset();

  // reset config
  CONFIG.reset();

  // remove token
  Storage.remove('token');

  // remove ajax headers with new call to ajaxSetup
  $.ajaxSetup({
    headers: {
      Authorization: ""
    }});

  // Trigger the eventbus logout event for the ui/managers
  EventBus.getInstance().trigger(EVENTS.session_logged_out);

  // go back to main to show login menu
  return App.main();
};

// just logs the error for debugging
App.onSessionError = error => Logger.module("APPLICATION").log(`Session Error: ${error.message}`);

//
// ---- Pointer ---- #
//
App._$canvasMouseClassEl = null;
App._currentMouseClass = null;

App.onCanvasMouseState = function(e) {
  let mouseClass;
  if ((e != null ? e.state : undefined) != null) { mouseClass = "mouse-" + e.state.toLowerCase(); } else { mouseClass = "mouse-auto"; }
  if (App._currentMouseClass !== mouseClass) {
    if (App._$canvasMouseClassEl == null) { App._$canvasMouseClassEl = $(CONFIG.GAMECANVAS_SELECTOR); }
    if (App._currentMouseClass === "mouse-auto") {
      App._$canvasMouseClassEl.addClass(mouseClass);
    } else if (mouseClass === "mouse-auto") {
      App._$canvasMouseClassEl.removeClass(App._currentMouseClass);
    } else {
      App._$canvasMouseClassEl.removeClass(App._currentMouseClass).addClass(mouseClass);
    }
    return App._currentMouseClass = mouseClass;
  }
};

App.onPointerDown = function(event) {
  // update pointer
  if (event != null) {
    const $app = $(CONFIG.APP_SELECTOR);
    const offset = $app.offset();
    UtilsPointer.setPointerFromDownEvent(event, $app.height(), offset.left, offset.top);
  }

  // trigger pointer event
  const pointerEvent = UtilsPointer.getPointerEvent();
  pointerEvent.type = EVENTS.pointer_down;
  pointerEvent.target = event.target;
  EventBus.getInstance().trigger(pointerEvent.type, pointerEvent);
  // before passing event to view, stop propagation when the target of the pointer event is not the game canvas
  // however, continue pass the event down to the view and let listeners decide whether to use it
  if (!$(CONFIG.GAMECANVAS_SELECTOR).is(event.target)) {
    pointerEvent.stopPropagation();
  }
  Scene.getInstance().getEventBus().trigger(pointerEvent.type, pointerEvent);

  return true;
};

App.onPointerUp = function(event) {
  // update pointer
  if (event != null) {
    const $app = $(CONFIG.APP_SELECTOR);
    const offset = $app.offset();
    UtilsPointer.setPointerFromUpEvent(event, $app.height(), offset.left, offset.top);
  }

  // trigger pointer event
  const pointerEvent = UtilsPointer.getPointerEvent();
  pointerEvent.type = EVENTS.pointer_up;
  pointerEvent.target = event.target;
  EventBus.getInstance().trigger(pointerEvent.type, pointerEvent);
  // before passing event to view, stop propagation when the target of the pointer event is not the game canvas
  // however, continue pass the event down to the view and let listeners decide whether to use it
  if (!$(CONFIG.GAMECANVAS_SELECTOR).is(event.target)) {
    pointerEvent.stopPropagation();
  }
  Scene.getInstance().getEventBus().trigger(pointerEvent.type, pointerEvent);

  return true;
};

App.onPointerMove = function(event) {
  // update pointer
  if (event != null) {
    const $app = $(CONFIG.APP_SELECTOR);
    const offset = $app.offset();
    UtilsPointer.setPointerFromMoveEvent(event, $app.height(), offset.left, offset.top);
  }

  // trigger pointer events
  const pointerEvent = UtilsPointer.getPointerEvent();
  pointerEvent.type = EVENTS.pointer_move;
  pointerEvent.target = event.target;
  EventBus.getInstance().trigger(pointerEvent.type, pointerEvent);
  // before passing event to view, stop propagation when the target of the pointer event is not the game canvas
  // however, continue pass the event down to the view and let listeners decide whether to use it
  if (!$(CONFIG.GAMECANVAS_SELECTOR).is(event.target)) {
    pointerEvent.stopPropagation();
  }
  Scene.getInstance().getEventBus().trigger(pointerEvent.type, pointerEvent);

  return true;
};

App.onPointerWheel = function(event) {
  // update pointer
  let target;
  if (event != null) {
    ({
      target
    } = event);
    const $app = $(CONFIG.APP_SELECTOR);
    const offset = $app.offset();
    UtilsPointer.setPointerFromWheelEvent(event.originalEvent, $app.height(), offset.left, offset.top);
  }

  // trigger pointer events
  const pointerEvent = UtilsPointer.getPointerEvent();
  pointerEvent.type = EVENTS.pointer_wheel;
  pointerEvent.target = target;
  EventBus.getInstance().trigger(pointerEvent.type, pointerEvent);
  // before passing event to view, stop propagation when the target of the pointer event is not the game canvas
  // however, continue pass the event down to the view and let listeners decide whether to use it
  if (!$(CONFIG.GAMECANVAS_SELECTOR).is(target)) {
    pointerEvent.stopPropagation();
  }
  Scene.getInstance().getEventBus().trigger(pointerEvent.type, pointerEvent);

  return true;
};

//
// --- Game Invites ---- #
//

App._inviteAccepted = function(){
  Logger.module("APPLICATION").log("App._inviteAccepted");
  return App.showPlay(SDK.PlayModes.Friend);
};

App._inviteRejected = function() {
  Logger.module("APPLICATION").log("App._inviteRejected");
  return App.main().then(() => NavigationManager.getInstance().showDialogView(new PromptDialogItemView({title: i18next.t("buddy_list.message_rejected_game_invite")})));
};

App._inviteCancelled = function() {
  App._cleanupMatchmakingListeners();
  Logger.module("APPLICATION").log("App._inviteCancelled");
  return App.main().then(() => NavigationManager.getInstance().showDialogView(new PromptDialogItemView({title: i18next.t("buddy_list.message_cancelled_game_invite")})));
};

//
// --- Game Spectate ---- #
//
App._spectateGame = function(e) {
  if (ChatManager.getInstance().getStatusIsInBattle()) {
    Logger.module("APPLICATION").log("App._spectateGame -> cannot start game when already in a game!");
    return;
  }

  const gameListingData = e.gameData;
  const {
    playerId
  } = e;
  const spectateToken = e.token;

  Logger.module("APPLICATION").log("App._spectateGame", gameListingData);
  return NavigationManager.getInstance().showDialogForLoad()
  .then(() => // load resources for game
  PackageManager.getInstance().loadGamePackageWithoutActivation([
    gameListingData["faction_id"],
    gameListingData["opponent_faction_id"]
  ])).then(function() {
    // listen to join game events
    const joinGamePromise = App._subscribeToJoinGameEventsPromise();

    // join game and if a game server is assigned to this listing, connect there
    SDK.NetworkManager.getInstance().connect(
      gameListingData["game_type"],
      gameListingData["game_id"],
      playerId,
      gameListingData["game_server"],
      ProfileManager.getInstance().get('id'),
      spectateToken
    );

    return joinGamePromise.then(function(gameSessionData) {

      // reset and deserialize
      SDK.GameSession.reset();
      SDK.GameSession.getInstance().deserializeSessionFromFirebase(gameSessionData);
      SDK.GameSession.getInstance().setUserId(playerId);
      SDK.GameSession.getInstance().setIsSpectateMode(true);

      // do not start games that are already over
      if (!SDK.GameSession.getInstance().isOver()) {
        return App._startGame();
      } else {
        return Promise.reject();
      }

    }).catch(errorMessage => App._error(errorMessage));
  });
};

// See games_manager spectateBuddyGame method, works same way
App.spectateBuddyGame = buddyId => new Promise(function(resolve, reject) {
  const request = $.ajax({
    url: process.env.API_URL + '/api/me/spectate/' + buddyId,
    type: 'GET',
    contentType: 'application/json',
    dataType: 'json'
  });

  request.done(function(response) {
    App._spectateGame({
      gameData: response.gameData,
      token: response.token,
      playerId: buddyId
    });
    return resolve(response);
  });

  return request.fail(function(response) {
    const error = (response && response.responseJSON && response.responseJSON.error) || 'SPECTATE request failed';
    EventBus.getInstance().trigger(EVENTS.ajax_error, error);
    return reject(new Error(error));
  });
});

// Event handler fired when spectate is pressed in Discord with spectateSecret passed in
// We use the buddyId as the spectateSecret
App.onDiscordSpectate = function(...args) {
  const buddyId = args[0];
  Logger.module("DISCORD").log(`attempting to spectate ${buddyId}`);

  // we wait until managers are loaded as we need to be logged in
  return App.managersReadyDeferred.promise.then(function() {
    // do nothing if they are already in game or in queue
    if (ChatManager.getInstance().getStatusIsInBattle() || ChatManager.getInstance().getStatusQueue()) {
      Logger.module("DISCORD").log("cannot spectate game when already in a game!");
      return;
    }

    // do nothing if they are attempting to spectate theirselves
    if (ProfileManager.getInstance().get('id') === buddyId) {
      Logger.module("DISCORD").log("cannot spectate yourself!");
      return;
    }

    // fire spectate request
    return App.main().then(() => App.spectateBuddyGame(buddyId));
  });
};

//
// --- Game Matchmaking ---- #
//

App._error = function(errorMessage) {
  Logger.module("APPLICATION").log("App._error", errorMessage);
  // always unlock user triggered navigation
  NavigationManager.getInstance().requestUserTriggeredNavigationUnlocked(App._userNavLockId);

  if (errorMessage != null) {
    // if we're in the process of loading the main menu
    // show the error dialog and don't go to main menu
    // to avoid infinite loop of loading main menu
    if (App._mainPromise || (process.env.NODE_ENV === "local")) {
      return NavigationManager.getInstance().showDialogView(new ErrorDialogItemView({message:errorMessage}));
    } else {
      // otherwise load the main menu and show the error dialog
      return App.main().then(() => NavigationManager.getInstance().showDialogView(new ErrorDialogItemView({message:errorMessage})));
    }
  } else {
    return App.main();
  }
};

App._cleanupMatchmakingListeners = function(){
  // remove all found game listeners as new ones will be registered when we re-enter matchmaking
  GamesManager.getInstance().off("found_game");
  // force reject the existing found game promise when we cancel
  // this is important because this promise is wrapped around the "found_game" event and a chain of stuff is waiting for it to resolve!
  // if we don't cancel here, we will have a promise that never resolves and thus leaks memory
  if (App._foundGamePromise != null) {
    return App._foundGamePromise.cancel();
  }
};

App._matchmakingStart = () => Logger.module("APPLICATION").log("App._matchmakingStart");

App._matchmakingCancel = function() {
  Logger.module("APPLICATION").log("App._matchmakingCancel");
  return App._cleanupMatchmakingListeners();
};

App._matchmakingError = function(errorMessage) {
  Logger.module("APPLICATION").log("App._matchmakingError", errorMessage);
  App._cleanupMatchmakingListeners();
  return App._error(errorMessage);
};

App._playerDataFromGameListingData = function(gameListingData) {
  const myPlayerIsPlayer1 = gameListingData.is_player_1;
  const playerDataModel= new Backbone.Model({
    myPlayerIsPlayer1,
    myPlayerId: ProfileManager.getInstance().get('id'),
    myPlayerUsername: ProfileManager.getInstance().get("username"),
    myPlayerFactionId: gameListingData.faction_id,
    myPlayerGeneralId: gameListingData.general_id,
    opponentPlayerId: gameListingData.opponent_id,
    opponentPlayerUsername: gameListingData.opponent_username,
    opponentPlayerFactionId: gameListingData.opponent_faction_id,
    opponentPlayerGeneralId: gameListingData.opponent_general_id
  });
  if (myPlayerIsPlayer1) {
    playerDataModel.set({
      player1Id: playerDataModel.get("myPlayerId"),
      player1Username: playerDataModel.get("myPlayerUsername"),
      player1FactionId: playerDataModel.get("myPlayerFactionId"),
      player1GeneralId: playerDataModel.get("myPlayerGeneralId"),
      player2Id: playerDataModel.get("opponentPlayerId"),
      player2Username: playerDataModel.get("opponentPlayerUsername"),
      player2FactionId: playerDataModel.get("opponentPlayerFactionId"),
      player2GeneralId: playerDataModel.get("opponentPlayerGeneralId")
    });
  } else {
    playerDataModel.set({
      player1Id: playerDataModel.get("opponentPlayerId"),
      player1Username: playerDataModel.get("opponentPlayerUsername"),
      player1FactionId: playerDataModel.get("opponentPlayerFactionId"),
      player1GeneralId: playerDataModel.get("opponentPlayerGeneralId"),
      player2Id: playerDataModel.get("myPlayerId"),
      player2Username: playerDataModel.get("myPlayerUsername"),
      player2FactionId: playerDataModel.get("myPlayerFactionId"),
      player2GeneralId: playerDataModel.get("myPlayerGeneralId")
    });
  }

  return playerDataModel;
};

App._findingGame = function(gameMatchRequestData) {
  if (ChatManager.getInstance().getStatusIsInBattle()) {
    Logger.module("APPLICATION").log("App._findingGame -> cannot start game when already in a game!");
    return;
  }

  Logger.module("APPLICATION").log("App._findingGame", gameMatchRequestData);
  // analytics call
  Analytics.page("Finding Game",{ path: "/#finding_game" });

  // notify Discord status
  if (Discord) {
    const presence = {
      instance: 0,
      largeImageKey: 'idle'
    };
    if (gameMatchRequestData.gameType === 'ranked') {
      presence.details = 'In Ranked Queue';
    } else if (gameMatchRequestData.gameType === 'gauntlet') {
      presence.details = 'In Gauntlet Queue';
    } else if (gameMatchRequestData.gameType === 'rift') {
      presence.details = 'In Rift Queue';
    } else {
      presence.details = 'In Queue';
    }
    Discord.updatePresence(presence);
  }

  // set the chat presence status to in-queue so your buddies see that you're unreachable
  ChatManager.getInstance().setStatus(ChatManager.STATUS_QUEUE);

  // add route
  NavigationManager.getInstance().addMajorRoute("finding_game", App._findingGame, App, [gameMatchRequestData]);

  // initialize finding game view
  const findingGameItemView = new FindingGameItemView({model: new Backbone.Model({gameType: gameMatchRequestData.gameType, factionId: gameMatchRequestData.factionId, generalId: gameMatchRequestData.generalId})});

  // initialize found game promise
  let gameListingData = null;

  // load find game assets and show finding game
  const showFindingGamePromise = PackageManager.getInstance().loadAndActivateMajorPackage("nongame", null, null, () => Promise.all([
    Scene.getInstance().showContentByClass(PlayLayer, true),
    Scene.getInstance().showFindingGame(gameMatchRequestData.factionId, gameMatchRequestData.generalId),
    NavigationManager.getInstance().showContentView(findingGameItemView),
    NavigationManager.getInstance().showUtilityView(new UtilityMatchmakingMenuItemView({model: ProfileManager.getInstance().profile}))
  ]));

  // load my game assets as soon as possible
  const loadGamePromise = showFindingGamePromise.then(function() {
    Logger.module("APPLICATION").log("App._findingGame -> showFindingGamePromise DONE");
    return PackageManager.getInstance().loadGamePackageWithoutActivation([gameMatchRequestData.factionId]);
  });

  // save this promise to app object so it can be cancelled in the event of "cancelMatchmaking"
  // this is important because this promise is wrapped around the "found_game" event and a chain of stuff is waiting for it to resolve!
  // if we don't cancel this later, we will have a promise that never resolves and thus leaks memory
  App._foundGamePromise = new Promise(function(resolve, reject) {

    // listen for next found game
    var onFoundGame = function(foundGameListingData) {

      Logger.module("APPLICATION").log("App._findingGame -> onFoundGame()", foundGameListingData);
      // stop listening
      GamesManager.getInstance().off("found_game", onFoundGame);

      // store found data
      gameListingData = foundGameListingData;
      return showFindingGamePromise.then(function() {
        // don't allow user triggered navigation now that we've found a game
        NavigationManager.getInstance().requestUserTriggeredNavigationLocked(App._userNavLockId);
        NavigationManager.getInstance().destroyNonContentViews();
        Logger.module("APPLICATION").log("App._findingGame -> onFoundGame() App._foundGamePromise RESOLVED");
        return resolve(foundGameListingData);
      });
    };

    return GamesManager.getInstance().once("found_game", onFoundGame);

  }).cancellable();

  // wait show finding game and found game, then join found game
  return Promise.all([
    showFindingGamePromise,
    App._foundGamePromise
  ]).then(function() {
    Logger.module("APPLICATION").log("App._findingGame -> show found game", gameListingData);
    // analytics call
    Analytics.page("Found Game",{ path: "/#found_game" });

    // get found game data from game listing data
    const playerDataModel = App._playerDataFromGameListingData(gameListingData);

    // show found game
    return Promise.all([
      Scene.getInstance().showVsForGame(playerDataModel.get("myPlayerFactionId"), playerDataModel.get("opponentPlayerFactionId"), playerDataModel.get("myPlayerIsPlayer1"), CONFIG.ANIMATE_MEDIUM_DURATION, playerDataModel.get("myPlayerGeneralId"), playerDataModel.get("opponentPlayerGeneralId")),
      Scene.getInstance().showNewGame(playerDataModel.get("player1GeneralId"), playerDataModel.get("player2GeneralId")),
      findingGameItemView.showFoundGame(playerDataModel)
    ]).then(() => // join found game
    App._joinGame(gameListingData, loadGamePromise));
  }).catch(Promise.CancellationError, e => Logger.module("APPLICATION").log("App._findingGame -> promise chain cancelled"));
};

App._resumeGame = function(lastGameModel) {
  if (ChatManager.getInstance().getStatusIsInBattle()) {
    Logger.module("APPLICATION").log("App._resumeGame -> cannot start game when already in a game!");
    return;
  }


  const gameListingData = lastGameModel != null ? lastGameModel.attributes : undefined;
  Logger.module("APPLICATION").log("App._resumeGame", gameListingData);
  // analytics call
  Analytics.page("Resume Game",{ path: "/#resume_game" });

  // set status to in game
  ChatManager.getInstance().setStatus(ChatManager.STATUS_GAME);

  // get resume game data from game listing data
  const playerDataModel= App._playerDataFromGameListingData(gameListingData);
  // playerDataModel.set("gameModel", lastGameModel)

  // initialize resume ui
  const gameResumeItemView = new ResumeGameItemView({model: playerDataModel});

  // initialize continue promise
  const continueGamePromise = new Promise(function(resolve, reject) {
    const onContinueGame = function() {
      stopListeningForContinueGame();

      // don't allow user triggered navigation now that user has decided to continue
      NavigationManager.getInstance().requestUserTriggeredNavigationLocked(App._userNavLockId);
      NavigationManager.getInstance().destroyNonContentViews();

      return resolve();
    };

    const onCancelContinueGame = function(errorMessage) {
      stopListeningForContinueGame();

      // don't try to reconnect to this game again
      lastGameModel.set("cancel_reconnect",true);

      return reject(errorMessage);
    };

    var stopListeningForContinueGame = function() {
      gameResumeItemView.stopListening(gameResumeItemView, "continue", onContinueGame);
      gameResumeItemView.stopListening(lastGameModel, "change");
      return gameResumeItemView.stopListening(NavigationManager.getInstance(), "user_triggered_cancel", onContinueGame);
    };

    // listen for continue
    gameResumeItemView.listenToOnce(gameResumeItemView, "continue", onContinueGame);

    // listen for game over
    gameResumeItemView.listenTo(lastGameModel, "change", function() {
      if (lastGameModel.get("status") === "over") { return onCancelContinueGame("Oops... looks like that game is over!"); }
    });

    // listen for cancel
    return gameResumeItemView.listenTo(NavigationManager.getInstance(), EVENTS.user_triggered_cancel, function() {
      if (!NavigationManager.getInstance().getIsShowingModalView()) { return onCancelContinueGame(); }
    });
  });

  // load assets
  const loadAndShowResumeGamePromise = PackageManager.getInstance().loadAndActivateMajorPackage("nongame", null, null, () => // show UI
  Promise.all([
    Scene.getInstance().showContentByClass(PlayLayer, true),
    Scene.getInstance().showVsForGame(playerDataModel.get("myPlayerFactionId"), playerDataModel.get("opponentPlayerFactionId"), playerDataModel.get("myPlayerIsPlayer1"), CONFIG.ANIMATE_MEDIUM_DURATION, playerDataModel.get("myPlayerGeneralId"), playerDataModel.get("opponentPlayerGeneralId")),
    NavigationManager.getInstance().showContentView(gameResumeItemView),
    NavigationManager.getInstance().showUtilityView(new UtilityMatchmakingMenuItemView({model: ProfileManager.getInstance().profile}))
  ]));

  // wait for load, show resume game, and click continue, then join in progress game
  Promise.all([
    loadAndShowResumeGamePromise,
    continueGamePromise
  ]).then(function() {
    Logger.module("APPLICATION").log("App._resumeGame -> joining game");

    // join found game
    return App._joinGame(gameListingData);
  }).catch(errorMessage => App._error(errorMessage));

  // only return show promise
  return loadAndShowResumeGamePromise;
};

//
// --- Single Player ---- #
//

App._startSinglePlayerGame = function(myPlayerDeck, myPlayerFactionId, myPlayerGeneralId, myPlayerCardBackId, myPlayerBattleMapId, aiGeneralId, aiDifficulty, aiNumRandomCards) {
  if (ChatManager.getInstance().getStatusIsInBattle()) {
    Logger.module("APPLICATION").log("App._startSinglePlayerGame -> cannot start game when already in a game!");
    return;
  }

  Logger.module("APPLICATION").log("App._startSinglePlayerGame");

  // Check if FHE mode is enabled
  if (CONFIG.fheEnabled) {
    Logger.module("APPLICATION").log("App._startSinglePlayerGame -> FHE mode enabled, using blockchain flow");
    return App._startSinglePlayerGameFHE(myPlayerDeck, myPlayerFactionId, myPlayerGeneralId, myPlayerCardBackId, myPlayerBattleMapId, aiGeneralId, aiDifficulty, aiNumRandomCards);
  }

  // analytics call
  Analytics.page("Single Player Game",{ path: "/#single_player" });

  // set status to in game
  ChatManager.getInstance().setStatus(ChatManager.STATUS_GAME);

  let aiGeneralName = null;
  const aiGeneralCard = SDK.GameSession.getCardCaches().getCardById(aiGeneralId);
  if (aiGeneralCard != null) {
    aiGeneralName = aiGeneralCard.getName();
  }

  // request single player game
  // DEBUG: Log what we're sending to server
  Logger.module("APPLICATION").log("Sending to server - isDeveloperMode:", CONFIG.DEV_MODE_ENABLED);
  App._singlePlayerGamePromise = new Promise(function(resolve, reject) {
    const request = $.ajax({
      url: process.env.API_URL + '/api/me/games/single_player',
      data: JSON.stringify({
        deck: myPlayerDeck,
        cardBackId: myPlayerCardBackId,
        battleMapId: myPlayerBattleMapId,
        hasPremiumBattleMaps: InventoryManager.getInstance().hasAnyBattleMapCosmetics(),
        ai_general_id: aiGeneralId,
        ai_difficulty: aiDifficulty,
        ai_num_random_cards: aiNumRandomCards,
        ai_username: aiGeneralName,
        isDeveloperMode: CONFIG.DEV_MODE_ENABLED
      }),
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json'
    });

    request.done(res => resolve(res));

    return request.fail(jqXHR => reject((jqXHR && jqXHR.responseJSON && (jqXHR.responseJSON.error || jqXHR.responseJSON.message)) || "Connection error. Please retry."));
  }).cancellable();

  // init finding game view
  const findingGameItemView = new FindingGameItemView({model: new Backbone.Model({gameType: SDK.GameType.SinglePlayer})});
  findingGameItemView.listenTo(findingGameItemView, "destroy", App._cancelSinglePlayer);

  // show ui
  return Promise.all([
    Scene.getInstance().showContentByClass(PlayLayer, true),
    Scene.getInstance().showFindingGame(myPlayerFactionId, myPlayerGeneralId),
    NavigationManager.getInstance().showContentView(findingGameItemView),
    NavigationManager.getInstance().showUtilityView(new UtilityMatchmakingMenuItemView({model: ProfileManager.getInstance().profile}))
  ]).then(() => // when we have single player game data
  App._singlePlayerGamePromise != null ? App._singlePlayerGamePromise.then(function(gameListingData) {
    App._singlePlayerGamePromise = null;

    // don't allow user triggered navigation now that we've found a game
    NavigationManager.getInstance().requestUserTriggeredNavigationLocked(App._userNavLockId);

    // get found game data from game listing data
    const playerDataModel = App._playerDataFromGameListingData(gameListingData);

    // show found game
    return Promise.all([
      Scene.getInstance().showVsForGame(playerDataModel.get("myPlayerFactionId"), playerDataModel.get("opponentPlayerFactionId"), playerDataModel.get("myPlayerIsPlayer1"), CONFIG.ANIMATE_MEDIUM_DURATION, playerDataModel.get("myPlayerGeneralId"), playerDataModel.get("opponentPlayerGeneralId")),
      Scene.getInstance().showNewGame(playerDataModel.get("player1GeneralId"), playerDataModel.get("player2GeneralId")),
      NavigationManager.getInstance().destroyNonContentViews(),
      findingGameItemView.showFoundGame(playerDataModel)
    ]).then(() => // join found game
    App._joinGame(gameListingData));
  }) : undefined).catch(Promise.CancellationError, e => Logger.module("APPLICATION").log("App:_startSinglePlayerGame -> promise chain cancelled")).catch(errorMessage => App._error((errorMessage != null) ? "Failed to start single player game: " + errorMessage : undefined));
};

App._cancelSinglePlayer = function() {
  if (App._singlePlayerGamePromise != null) {
    App._singlePlayerGamePromise.cancel();
    return App._singlePlayerGamePromise = null;
  }
};

/**
 * FHE-enabled Single Player Game
 * Uses smart contract for encrypted game state
 */
App._startSinglePlayerGameFHE = function(myPlayerDeck, myPlayerFactionId, myPlayerGeneralId, myPlayerCardBackId, myPlayerBattleMapId, aiGeneralId, aiDifficulty, aiNumRandomCards) {
  Logger.module("APPLICATION").log("App._startSinglePlayerGameFHE");

  // analytics call
  Analytics.page("Single Player Game (FHE)",{ path: "/#single_player_fhe" });

  // set status to in game
  ChatManager.getInstance().setStatus(ChatManager.STATUS_GAME);

  let aiGeneralName = null;
  const aiGeneralCard = SDK.GameSession.getCardCaches().getCardById(aiGeneralId);
  if (aiGeneralCard != null) {
    aiGeneralName = aiGeneralCard.getName();
  }

  // init finding game view
  const findingGameItemView = new FindingGameItemView({model: new Backbone.Model({gameType: SDK.GameType.SinglePlayer, fheEnabled: true})});
  findingGameItemView.listenTo(findingGameItemView, "destroy", App._cancelSinglePlayer);

  // Extract card IDs from deck (deck is array of {id: cardId})
  // IMPORTANT: In normal flow, deck[0] is the general card which is placed on board, not in deck
  // We need to skip the first card (general) for FHE deck
  const deckCardIds = myPlayerDeck.slice(1).map(function(card) {
    return card.id;
  });
  Logger.module("APPLICATION").log("FHE: Deck card count (excluding general):", deckCardIds.length);

  // Get FHE session and contract addresses
  const fheSession = FHESession.getInstance();
  const walletManager = Wallet.getInstance();

  // FHE game creation promise
  App._singlePlayerGamePromise = new Promise(function(resolve, reject) {
    // Step 1: Ensure wallet is connected
    if (!walletManager.connected) {
      Logger.module("APPLICATION").log("FHE: Wallet not connected, connecting...");
      walletManager.connect()
        .then(function() {
          return proceedWithFHEGame();
        })
        .catch(reject);
    } else {
      proceedWithFHEGame().catch(reject);
    }

    function proceedWithFHEGame() {
      // Step 2: Initialize FHE Game Mode
      const fheGameMode = FHE.GameMode.getInstance();
      const contractAddresses = fheSession.getContractAddresses();
      const gameSessionAddress = contractAddresses.GameSession;

      Logger.module("APPLICATION").log("FHE: Initializing with contract:", gameSessionAddress);

      return fheGameMode.initialize(gameSessionAddress)
        .then(function() {
          Logger.module("APPLICATION").log("FHE: Creating SINGLE PLAYER game on blockchain...");

          // Step 3: Create single player game on contract
          // This uses createSinglePlayerGame which doesn't require joinGame
          // The game starts immediately without waiting for player 2
          return fheGameMode.createSinglePlayerGame(myPlayerGeneralId, deckCardIds);
        })
        .then(function(gameId) {
          Logger.module("APPLICATION").log("FHE: Game created with ID:", gameId);

          // Step 4: Now we need to start the game with traditional backend
          // But with FHE flag so backend knows to use contract state
          // DEBUG: Log what we're sending to server in FHE mode
          Logger.module("APPLICATION").log("FHE: Sending to server - isDeveloperMode:", CONFIG.DEV_MODE_ENABLED);
          const request = $.ajax({
            url: process.env.API_URL + '/api/me/games/single_player',
            data: JSON.stringify({
              deck: myPlayerDeck,
              cardBackId: myPlayerCardBackId,
              battleMapId: myPlayerBattleMapId,
              hasPremiumBattleMaps: InventoryManager.getInstance().hasAnyBattleMapCosmetics(),
              ai_general_id: aiGeneralId,
              ai_difficulty: aiDifficulty,
              ai_num_random_cards: aiNumRandomCards,
              ai_username: aiGeneralName,
              isDeveloperMode: CONFIG.DEV_MODE_ENABLED,
              // FHE specific data
              fhe_enabled: true,
              fhe_game_id: gameId,
              fhe_contract_address: gameSessionAddress,
              fhe_player_wallet: walletManager.address
            }),
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json'
          });

          request.done(function(res) {
            // Add FHE data to response
            res.fhe_enabled = true;
            res.fhe_game_id = gameId;
            res.fhe_contract_address = gameSessionAddress;
            resolve(res);
          });

          request.fail(function(jqXHR) {
            reject((jqXHR && jqXHR.responseJSON && (jqXHR.responseJSON.error || jqXHR.responseJSON.message)) || "Connection error. Please retry.");
          });
        });
    }
  }).cancellable();

  // show ui
  return Promise.all([
    Scene.getInstance().showContentByClass(PlayLayer, true),
    Scene.getInstance().showFindingGame(myPlayerFactionId, myPlayerGeneralId),
    NavigationManager.getInstance().showContentView(findingGameItemView),
    NavigationManager.getInstance().showUtilityView(new UtilityMatchmakingMenuItemView({model: ProfileManager.getInstance().profile}))
  ]).then(function() {
    // when we have single player game data
    if (App._singlePlayerGamePromise != null) {
      return App._singlePlayerGamePromise.then(function(gameListingData) {
        App._singlePlayerGamePromise = null;

        // don't allow user triggered navigation now that we've found a game
        NavigationManager.getInstance().requestUserTriggeredNavigationLocked(App._userNavLockId);

        // get found game data from game listing data
        const playerDataModel = App._playerDataFromGameListingData(gameListingData);

        // Store FHE info in game session
        if (gameListingData.fhe_enabled) {
          SDK.GameSession.getInstance().fheEnabled = true;
          SDK.GameSession.getInstance().fheGameId = gameListingData.fhe_game_id;
          SDK.GameSession.getInstance().fheContractAddress = gameListingData.fhe_contract_address;
          Logger.module("APPLICATION").log("FHE: Game session configured with FHE data");
        }

        // show found game
        return Promise.all([
          Scene.getInstance().showVsForGame(playerDataModel.get("myPlayerFactionId"), playerDataModel.get("opponentPlayerFactionId"), playerDataModel.get("myPlayerIsPlayer1"), CONFIG.ANIMATE_MEDIUM_DURATION, playerDataModel.get("myPlayerGeneralId"), playerDataModel.get("opponentPlayerGeneralId")),
          Scene.getInstance().showNewGame(playerDataModel.get("player1GeneralId"), playerDataModel.get("player2GeneralId")),
          NavigationManager.getInstance().destroyNonContentViews(),
          findingGameItemView.showFoundGame(playerDataModel)
        ]).then(function() {
          // join found game
          return App._joinGame(gameListingData);
        });
      });
    }
  }).catch(Promise.CancellationError, function(e) {
    Logger.module("APPLICATION").log("App:_startSinglePlayerGameFHE -> promise chain cancelled");
  }).catch(function(errorMessage) {
    // Shutdown FHE on error
    FHE.GameMode.getInstance().shutdown();
    return App._error((errorMessage != null) ? "Failed to start FHE single player game: " + errorMessage : undefined);
  });
};

App._startBossBattleGame = function(myPlayerDeck, myPlayerFactionId, myPlayerGeneralId, myPlayerCardBackId, myPlayerBattleMapId, aiGeneralId) {
  let ui_promise;
  if (ChatManager.getInstance().getStatusIsInBattle()) {
    Logger.module("APPLICATION").log("App._startBossBattleGame -> cannot start game when already in a game!");
    return;
  }

  Logger.module("APPLICATION").log("App._startBossBattleGame");

  // analytics call
  Analytics.page("Boss Battle Game",{ path: "/#boss_battle" });

  // don't allow user triggered navigation
  NavigationManager.getInstance().requestUserTriggeredNavigationLocked(App._userNavLockId);

  // set user as in game
  ChatManager.getInstance().setStatus(ChatManager.STATUS_GAME);

  let aiGeneralName = null;
  const aiGeneralCard = SDK.GameSession.getCardCaches().getCardById(aiGeneralId);
  if (aiGeneralCard != null) {
    aiGeneralName = aiGeneralCard.getName();
  }

  // request boss battle game
  const bossBattleGamePromise = new Promise(function(resolve, reject) {
    const request = $.ajax({
      url: process.env.API_URL + '/api/me/games/boss_battle',
      data: JSON.stringify({
        deck: myPlayerDeck,
        cardBackId: myPlayerCardBackId,
        battleMapId: myPlayerBattleMapId,
        ai_general_id: aiGeneralId,
        ai_username: aiGeneralName
      }),
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json'
    });

    request.done(res => resolve(res));

    return request.fail(jqXHR => reject((jqXHR && jqXHR.responseJSON && (jqXHR.responseJSON.error || jqXHR.responseJSON.message)) || "Connection error. Please retry."));
  });

  // get ui promise
  if (CONFIG.LOAD_ALL_AT_START) {
    ui_promise = Promise.resolve();
  } else {
    ui_promise = NavigationManager.getInstance().showDialogForLoad();
  }

  return Promise.all([
      bossBattleGamePromise,
      ui_promise
    ]).spread(gameListingData => App._joinGame(gameListingData)).catch(errorMessage => App._error((errorMessage != null) ? "Failed to start boss battle: " + errorMessage : undefined));
};

//
// --- Replays ---- #
//

App._startGameForReplay = function(replayData) {
  if (ChatManager.getInstance().getStatusIsInBattle()) {
    Logger.module("APPLICATION").log("App._startGameForReplay -> cannot start game when already in a game!");
    return;
  }

  const {
    userId
  } = replayData;
  const {
    gameId
  } = replayData;
  const {
    replayId
  } = replayData;
  const {
    promotedDivisionName
  } = replayData;

  // check for invalid replay data
  if ((replayId == null)) {
    if ((gameId == null)) {
      throw new Error("Cannot replay game without game id!");
    }
    if ((userId == null) && (promotedDivisionName == null)) {
      throw new Error("Cannot replay game without user id or division name!");
    }
  }

  // don't allow user triggered navigation
  NavigationManager.getInstance().requestUserTriggeredNavigationLocked(App._userNavLockId);

  // show loading
  return NavigationManager.getInstance().showDialogForLoad()
  .bind({})
  .then(function() {
    // load replay data
    let url;
    if (replayId != null) {
      url = `${process.env.API_URL}/replays/${replayId}`;
    } else if (promotedDivisionName != null) {
      url = `${process.env.API_URL}/api/me/games/watchable/${promotedDivisionName}/${gameId}/replay_data?playerId=${userId}`;
    } else {
      url = `${process.env.API_URL}/api/users/${userId}/games/${gameId}/replay_data`;
    }

    return new Promise(function(resolve, reject) {
      const request = $.ajax({
        url  ,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json'
      });
      return request.done(response => resolve(response)).fail(response => reject(new Error(`Error downloading replay data: ${__guard__(response != null ? response.responseJSON : undefined, x => x.message)}`)));
    });}).then(function(replayResponseData) {
    this.replayResponseData = replayResponseData;
    const {
      gameSessionData
    } = replayResponseData;
    const gameUIData = replayResponseData.mouseUIData;
    ({
      replayData
    } = replayResponseData);

    // validate data
    const gameSetupData = gameSessionData != null ? gameSessionData.gameSetupData : undefined;
    if ((gameSetupData == null)) {
      throw new Error("ReplayEngine -> loaded game does not have valid replay data!");
    }

    // store data
    this._loadedGameSessionData = gameSessionData;
    this._loadedGameUIEventData = gameUIData;

    // load resources for game
    return PackageManager.getInstance().loadGamePackageWithoutActivation([
      gameSetupData.players[0].factionId,
      gameSetupData.players[1].factionId
    ]);}).then(function() {
    // create new game instance but don't deserialize from existing data
    SDK.GameSession.reset();

    if (userId != null) { // if we explicity requested to spectate a user perspective
      SDK.GameSession.getInstance().setUserId(userId);
    } else if ((this.replayResponseData != null ? this.replayResponseData.replayData : undefined)) { // check if the server response includes a shared replay record so we can use that to determine who to spectate
      SDK.GameSession.getInstance().setUserId(this.replayResponseData != null ? this.replayResponseData.replayData.user_id : undefined);
    } else { // ultimately spectate player 1 if nothing provided
      SDK.GameSession.getInstance().setUserId(this._loadedGameSessionData.players[0].playerId);
    }

    SDK.GameSession.getInstance().setGameType(this._loadedGameSessionData.gameType);
    SDK.GameSession.getInstance().setIsRunningAsAuthoritative(false);
    SDK.GameSession.getInstance().setIsSpectateMode(true);
    SDK.GameSession.getInstance().setIsReplay(true);

    // setup GameSession from replay data
    SDK.GameSetup.setupNewSessionFromExistingSessionData(SDK.GameSession.getInstance(), this._loadedGameSessionData);

    return App._startGame();}).then(function() {
    // start watching replay
    return ReplayEngine.getInstance().watchReplay(this._loadedGameSessionData, this._loadedGameUIEventData);}).catch(function(errorMessage) {
    ReplayEngine.getInstance().stopCurrentReplay();
    return App._error(errorMessage);
  });
};

//
// --- Game Connecting ---- #
//
App._unsubscribeFromJoinGameEvents = function() {
  SDK.NetworkManager.getInstance().getEventBus().off(EVENTS.join_game);
  return SDK.NetworkManager.getInstance().getEventBus().off(EVENTS.reconnect_failed);
};

App._subscribeToJoinGameEventsPromise = function() {
  App._unsubscribeFromJoinGameEvents();

  return new Promise(function(resolve, reject) {
    // wait for join_game event
    SDK.NetworkManager.getInstance().getEventBus().once(EVENTS.join_game, function(response) {
      // handle response
      if (response.error) {
        return reject(response.error);
      } else {
        return resolve(response.gameSessionData);
      }
    });

    SDK.NetworkManager.getInstance().getEventBus().once(EVENTS.spectate_game, function(response) {
      // handle response
      if (response.error) {
        return reject(response.error);
      } else {
        return resolve(response.gameSessionData);
      }
    });

    // wait for reconnect_failed event
    return SDK.NetworkManager.getInstance().getEventBus().once(EVENTS.reconnect_failed, () => // reject and cancel reconnect
    reject("Reconnect failed!"));
  }).finally(() => // reset join game listeners
  App._unsubscribeFromJoinGameEvents());
};

App._joinGame = function(gameListingData, loadMyGameResourcesPromise, loadOpponentGameResourcesPromise) {
  Logger.module("APPLICATION").log("App._joinGame", gameListingData);

  // load my resources for game
  if (loadMyGameResourcesPromise == null) { loadMyGameResourcesPromise = PackageManager.getInstance().loadGamePackageWithoutActivation([gameListingData["faction_id"]]); }

  // load opponent resources for game
  if (loadOpponentGameResourcesPromise == null) { loadOpponentGameResourcesPromise = PackageManager.getInstance().loadMinorPackage(PKGS.getFactionGamePkgIdentifier(gameListingData["opponent_faction_id"]), null, "game"); }

  return Promise.all([
    loadMyGameResourcesPromise,
    loadOpponentGameResourcesPromise
  ]).then(function() {
    // listen to join game events
    const joinGamePromise = App._subscribeToJoinGameEventsPromise();

    // join game and if a game server is assigned to this listing, connect there
    SDK.NetworkManager.getInstance().connect(
      gameListingData["game_type"],
      gameListingData["game_id"],
      ProfileManager.getInstance().get('id'),
      gameListingData["game_server"]
    );

    return joinGamePromise.then(gameSessionData => App._startGameWithData(gameSessionData)).catch(errorMessage => App._error(errorMessage));
  });
};

App._onReconnectToGame = function(gameId) {
  Logger.module("APPLICATION").log("App._onReconnectToGame", gameId);
  // destroy the current game
  App.cleanupGame();

  // start listening to join game events
  const joinGamePromise = App._subscribeToJoinGameEventsPromise();

  // blur the view in engine
  Scene.getInstance().getFX().requestBlurScreen(App._screenBlurId);

  return Promise.all([
    // show user we're reconnecting
    NavigationManager.getInstance().showContentView(new ReconnectToGameItemView()),
    NavigationManager.getInstance().showUtilityView(new UtilityMatchmakingMenuItemView({model: ProfileManager.getInstance().profile}))
  ]).then(() => joinGamePromise.then(gameSessionData => // start game
  App._startGameWithData(gameSessionData)).catch(errorMessage => App._error(errorMessage)).finally(() => App.cleanupReconnectToGame()));
};

App.cleanupReconnectToGame = function() {
  // unsubscribe from events
  App._unsubscribeFromJoinGameEvents();

  // unblur screen
  return Scene.getInstance().getFX().requestUnblurScreen(App._screenBlurId);
};

//
// --- Game Events ---- #
//

App._onNetworkGameEvent = function(eventData) {
  if (eventData.type === EVENTS.step) {
    Logger.module("APPLICATION").log("App._onNetworkGameEvent -> step", eventData);
    // step event
    if (eventData.step != null) {
      // deserialize step
      const sdkStep = SDK.GameSession.getInstance().deserializeStepFromFirebase(eventData.step);
      // if we are spectating, and connected in the middle of a followup (so we don't have a snapshot), error out to main menu in the event of a rollback since we have nothing to roll back to
      if (SDK.GameSession.getInstance().getIsSpectateMode() && sdkStep.getAction() instanceof SDK.RollbackToSnapshotAction && !SDK.GameSession.getInstance().getRollbackSnapshotData()) {
        return App._error("You fell out of sync. Please try to spectate again to sync up.");
      }
      // mark step as transmitted
      sdkStep.setTransmitted(true);
      // execute step
      SDK.GameSession.getInstance().executeAuthoritativeStep(sdkStep);
      if (sdkStep.getAction()) {
        return AnalyticsTracker.sendAnalyticsForExplicitAction(sdkStep.getAction());
      }
    }
  } else if (eventData.type === EVENTS.invalid_action) {
    if (eventData.playerId === SDK.GameSession.getInstance().getMyPlayerId()) {
      if (eventData.desync) {
        // player is out of sync with server
        // force them to reconnect to game
        Analytics.track("player desync", {category:Analytics.EventCategory.Debug}, {nonInteraction:1});
        return App._error("Your current match appears to be out of sync. To avoid any issues, please select CONTINUE and reconnect to your match.");
      } else {
        // player isn't out of sync but may need to know their action was invalid
        // this may happen if a player attempts to submit actions after their turn is over
        return SDK.GameSession.getInstance().onAuthoritativeInvalidAction(eventData);
      }
    }
  } else if (eventData.type === EVENTS.network_game_hover) {
    return __guard__(Scene.getInstance().getGameLayer(), x => x.onNetworkHover(eventData));
  } else if (eventData.type === EVENTS.network_game_select) {
    return __guard__(Scene.getInstance().getGameLayer(), x1 => x1.onNetworkSelect(eventData));
  } else if (eventData.type === EVENTS.network_game_mouse_clear) {
    return __guard__(Scene.getInstance().getGameLayer(), x2 => x2.onNetworkMouseClear(eventData));
  } else if (eventData.type === EVENTS.turn_time) {
    // if we are behind in step count for some reason from the server step counter
    if (!SDK.GameSession.getInstance().getIsSpectateMode() && (eventData.stepCount > SDK.GameSession.getInstance().getStepCount())) {
      // we're going to start a pseudo-timeout to reload the game
      Logger.module("APPLICATION").warn("App._onNetworkGameEvent -> seems like game session is behind server step count");
      // if we haven't already detected a potential desync state and recorded the moment it started
      if (!App._gameDesyncStartedAt) {
        // record the moment the suspected desync started
        App._gameDesyncStartedAt = moment.utc();
        // otherwise if we suspect a desync state is already in progress and we have the time it started, see if it's been more than 10s
      } else if (moment.duration(moment.utc() - App._gameDesyncStartedAt).asSeconds() > 10.0) {
        // if it's been more than 10s in a desync state, fire off the error state
        App._error("Your current match appears to be out of sync. To avoid any issues, please select CONTINUE and reconnect to your match.");
        App._gameDesyncStartedAt = null;
        return;
      }
    } else {
      // if we're up to date with our step count, just clear out any suspected desync starting point
      App._gameDesyncStartedAt = null;
    }
    // the game session emits events from here that inform UI etc.
    return SDK.GameSession.getInstance().setTurnTimeRemaining(eventData.time);
  } else if (eventData.type === EVENTS.show_emote) {
    return EventBus.getInstance().trigger(EVENTS.show_emote, eventData);
  }
};

App._onOpponentConnectionStatusChanged = function(eventData) {
  // when opponent disconnects, force mouse clear
  if (!SDK.NetworkManager.getInstance().isOpponentConnected) {
    return __guard__(Scene.getInstance().getGameLayer(), x => x.onNetworkMouseClear({type:EVENTS.network_game_mouse_clear, timestamp: Date.now()}));
  }
};

App._onNetworkGameError = errorData => App._error(JSON.stringify(errorData));

App._onGameServerShutdown = function(errorData) {
  if (errorData.ip) {
    const {
      ip
    } = errorData;
    const lastGameModel = GamesManager.getInstance().playerGames.first();
    lastGameModel.set('gameServer',ip);

    // reconnect
    SDK.NetworkManager.getInstance().reconnect(ip);

    // show reconnecting
    return App._onReconnectToGame();
  } else {
    return App._error("Game server error, no ip!");
  }
};

//
// --- Game Setup ---- #
//

App._startGameWithChallenge = function(challenge) {
  let ui_promise;
  if (ChatManager.getInstance().getStatusIsInBattle()) {
    Logger.module("APPLICATION").log("App._startGameWithChallenge -> cannot start game when already in a game!");
    return;
  }
  Logger.module("APPLICATION").log("App:_startGameWithChallenge");

  // don't allow user triggered navigation
  NavigationManager.getInstance().requestUserTriggeredNavigationLocked(App._userNavLockId);

  // set user as in game
  ChatManager.getInstance().setStatus(ChatManager.STATUS_CHALLENGE);

  if (!challenge instanceof SDK.ChallengeRemote) {
    // mark challenge as attempted
    ProgressionManager.getInstance().markChallengeAsAttemptedWithType(challenge.type);
  }

  // challenge handles setting up game session
  SDK.GameSession.reset();
  SDK.GameSession.getInstance().setUserId(ProfileManager.getInstance().get('id'));
  challenge.setupSession(SDK.GameSession.getInstance());

  // apply developer mode setting (disables deck randomization for testing)
  if (CONFIG.DEV_MODE_ENABLED) {
    SDK.GameSession.getInstance().setIsDeveloperMode(true);
    console.log('=== DEV MODE APPLIED TO CHALLENGE ===');
    console.log('getIsDeveloperMode:', SDK.GameSession.getInstance().getIsDeveloperMode());
    console.log('getAreDecksRandomized:', SDK.GameSession.getInstance().getAreDecksRandomized());
  }

  // get ui promise
  if (CONFIG.LOAD_ALL_AT_START) {
    ui_promise = Promise.resolve();
  } else {
    ui_promise = NavigationManager.getInstance().showDialogForLoad();
  }

  return ui_promise.then(() => PackageManager.getInstance().loadGamePackageWithoutActivation([
    SDK.GameSession.getInstance().getGeneralForPlayer1().getFactionId(),
    SDK.GameSession.getInstance().getGeneralForPlayer2().getFactionId()
  ], [
    "tutorial",
    PKGS.getChallengePkgIdentifier(SDK.GameSession.getInstance().getChallenge().getType())
  ])).then(() => App._startGame()).catch(errorMessage => App._error(errorMessage));
};

App._startGameWithData = function(sessionData) {
  Logger.module("APPLICATION").log("App._startGameWithData", sessionData);
  // reset and deserialize
  SDK.GameSession.reset();
  SDK.GameSession.getInstance().deserializeSessionFromFirebase(sessionData);
  SDK.GameSession.getInstance().setUserId(ProfileManager.getInstance().get('id'));

  // apply developer mode setting (disables deck randomization for testing)
  if (CONFIG.DEV_MODE_ENABLED) {
    SDK.GameSession.getInstance().setIsDeveloperMode(true);
    Logger.module("APPLICATION").log("Developer mode ENABLED - deck randomization disabled");
  }

  // do not start games that are already over
  if (!SDK.GameSession.getInstance().isOver()) {
    return App._startGame();
  } else {
    return Promise.reject();
  }
};

App._startGame = function() {
  let card, card_id, card_pkg_id, card_preload_pkg_id, gameUIViewClass;
  let allowUntargetable;
  const gameSession = SDK.GameSession.getInstance();
  Logger.module("APPLICATION").log("App:_startGame", gameSession.getStatus());

  // Debug dev mode status
  console.log('=== _startGame DEV MODE STATUS ===');
  console.log('CONFIG.DEV_MODE_ENABLED:', CONFIG.DEV_MODE_ENABLED);
  console.log('gameSession.getIsDeveloperMode():', gameSession.getIsDeveloperMode());
  console.log('gameSession.getAreDecksRandomized():', gameSession.getAreDecksRandomized());
  console.log('gameSession.isChallenge():', gameSession.isChallenge());
  console.log('==================================');

  if (gameSession.getIsSpectateMode()) {
    ChatManager.getInstance().setStatus(ChatManager.STATUS_WATCHING);
  } else if (gameSession.isChallenge()) {
    ChatManager.getInstance().setStatus(ChatManager.STATUS_CHALLENGE);
  } else {
    ChatManager.getInstance().setStatus(ChatManager.STATUS_GAME);
  }

  NotificationsManager.getInstance().dismissNotificationsThatCantBeShown();

  if (Discord) {
    const getFactionImage = function(factionId, opponent) {
      if (opponent == null) { opponent = false; }
      let s = {key: '', text: ''};
      switch (factionId) {
        case 1: s = {key: 'f1', text: 'Lyonar'}; break;
        case 2: s = {key: 'f2', text: 'Songhai'}; break;
        case 3: s = {key: 'f3', text: 'Vetruvian'}; break;
        case 4: s = {key: 'f4', text: 'Abyssian'}; break;
        case 5: s = {key: 'f5', text: 'Magmar'}; break;
        case 6: s = {key: 'f6', text: 'Vanar'}; break;
        default: s = {key: 'neutral', text: 'Neutral'};
      }
      if (opponent) {
        s.key += '_small';
      }
      return s;
    };

    const opponentName = SDK.GameSession.getInstance().getOpponentPlayer().getUsername();
    const opponentFaction = SDK.GameSession.getInstance().getGeneralForPlayer(SDK.GameSession.getInstance().getOpponentPlayer()).factionId;
    const opponentFactionImage = getFactionImage(opponentFaction, true);
    const playerName = SDK.GameSession.getInstance().getMyPlayer().getUsername();
    const playerId = SDK.GameSession.getInstance().getMyPlayerId();
    const playerRank = GamesManager.getInstance().getCurrentRank();
    const playerFaction = SDK.GameSession.getInstance().getGeneralForPlayer(SDK.GameSession.getInstance().getMyPlayer()).factionId;
    const playerFactionImage = getFactionImage(playerFaction, false);

    const presence = {
      startTimestamp: Math.floor((new Date).getTime()/1000),
      instance: 1,
      largeImageKey: playerFactionImage.key,
      largeImageText: playerFactionImage.text,
      smallImageKey: opponentFactionImage.key,
      smallImageText: opponentFactionImage.text
    };

    if (gameSession.getIsSpectateMode()) {
      if (gameSession.getIsReplay()) {
        presence.details = `Watching: ${playerName} vs. ${opponentName} replay`;
        presence.state = "Spectating";
      } else {
        presence.details = `Watching: ${playerName} vs. ${opponentName} live`;
        presence.state = "Spectating";
      }
    } else if (gameSession.isRanked()) {
      presence.details = `Ranked: vs. ${opponentName}`;
      presence.state = "In Match";
      // check if block is enabled before allowing spectate
      if (!ProfileManager.getInstance().profile.get("blockSpectators")) {
        presence.spectateSecret = playerId;
      }
    } else if (gameSession.isGauntlet()) {
      presence.details = `Gauntlet: vs. ${opponentName}`;
      presence.state = "In Match";
      // check if block is enabled before allowing spectate
      if (!ProfileManager.getInstance().profile.get("blockSpectators")) {
        presence.spectateSecret = playerId;
      }
    } else if (gameSession.isRift()) {
      presence.details = `Rift: vs. ${opponentName}`;
      presence.state = "In Match";
      // check if block is enabled before allowing spectate
      if (!ProfileManager.getInstance().profile.get("blockSpectators")) {
        presence.spectateSecret = playerId;
      }
    } else if (gameSession.isFriendly()) {
      presence.details = `Friendly: vs. ${opponentName}`;
      presence.state = "In Game";
      // check if block is enabled before allowing spectate
      if (!ProfileManager.getInstance().profile.get("blockSpectators")) {
        presence.spectateSecret = playerId;
      }
    } else if (gameSession.isBossBattle()) {
      presence.details = `Boss Battle: vs. ${opponentName}`;
      presence.state = "Playing Solo";
    } else if (gameSession.isSinglePlayer() || gameSession.isSandbox() || gameSession.isChallenge()) {
      presence.state = "Playing Solo";
    }
    Discord.updatePresence(presence);
  }

  // analytics call
  Analytics.page("Game",{ path: "/#game" });

  // reset routes as soon as we lock into a game
  NavigationManager.getInstance().resetRoutes();

  // record last game data
  CONFIG.resetLastGameData();
  CONFIG.lastGameType = gameSession.getGameType();
  CONFIG.lastGameWasSpectate = gameSession.getIsSpectateMode();
  CONFIG.lastGameWasTutorial = gameSession.isTutorial();
  CONFIG.lastGameWasDeveloper = UtilsEnv.getIsInDevelopment() && gameSession.getIsDeveloperMode();
  CONFIG.lastGameWasDailyChallenge = gameSession.isDailyChallenge();

  // listen to game network events
  App._subscribeToGameNetworkEvents();

  // get game UI view class
  const challenge = gameSession.getChallenge();
  if ((challenge != null) && !(challenge instanceof SDK.Sandbox)) {
    gameUIViewClass = TutorialLayout;
  } else {
    gameUIViewClass = GameLayout;
  }

  // load resources for game session
  const load_promises = [
    // load battlemap assets required for game
    PackageManager.getInstance().loadMinorPackage(PKGS.getBattleMapPkgIdentifier(gameSession.getBattleMapTemplate().getMap()), null, "game")
  ];

  // load all cards in my player's hand
  const preloaded_package_ids = [];
  for (var cardIndex of Array.from(gameSession.getMyPlayer().getDeck().getHand())) {
    card = gameSession.getCardByIndex(cardIndex);
    if (card != null) {
      // get unique id for card preload
      card_id = card.id;
      card_pkg_id = PKGS.getCardGamePkgIdentifier(card_id);
      card_preload_pkg_id = card_pkg_id + "_preload_" + UtilsJavascript.generateIncrementalId();
      preloaded_package_ids.push(card_preload_pkg_id);
      load_promises.push(PackageManager.getInstance().loadMinorPackage(card_preload_pkg_id, PKGS.getPkgForIdentifier(card_pkg_id), "game"));
    }
  }

  // load all cards and modifiers on board
  for (card of Array.from(gameSession.getBoard().getCards(null, (allowUntargetable=true)))) {
    // get unique id for card preload
    card_id = card.getId();
    card_pkg_id = PKGS.getCardGamePkgIdentifier(card_id);
    var card_resources_pkg = PKGS.getPkgForIdentifier(card_pkg_id);
    card_preload_pkg_id = card_pkg_id + "_preload_" + UtilsJavascript.generateIncrementalId();
    preloaded_package_ids.push(card_preload_pkg_id);

    // include signature card resources
    if (card instanceof SDK.Entity && card.getWasGeneral()) {
      var referenceSignatureCard = card.getReferenceSignatureCard();
      if (referenceSignatureCard != null) {
        var signature_card_id = referenceSignatureCard.getId();
        var signature_card_pkg_id = PKGS.getCardGamePkgIdentifier(signature_card_id);
        var signature_card_resources_pkg = PKGS.getPkgForIdentifier(signature_card_pkg_id);
        card_resources_pkg = [].concat(card_resources_pkg, signature_card_resources_pkg);
      }
    }

    // load card resources
    load_promises.push(PackageManager.getInstance().loadMinorPackage(card_preload_pkg_id, card_resources_pkg, "game"));

    // modifiers
    for (var modifier of Array.from(card.getModifiers())) {
      if (modifier != null) {
        // get unique id for modifier preload
        var modifier_type = modifier.getType();
        var modifier_preload_package_id = modifier_type + "_preload_" + UtilsJavascript.generateIncrementalId();
        preloaded_package_ids.push(modifier_preload_package_id);
        load_promises.push(PackageManager.getInstance().loadMinorPackage(modifier_preload_package_id, PKGS.getPkgForIdentifier(modifier_type), "game"));

        // load artifact card if modifier is applied by an artifact
        if (modifier.getIsFromArtifact()) {
          var artifact_card = modifier.getSourceCard();
          if (artifact_card != null) {
            // get unique id for artifact card preload
            var artifact_card_id = artifact_card.getId();
            var artifact_card_pkg_id = PKGS.getCardInspectPkgIdentifier(artifact_card_id);
            var artifact_card_preload_pkg_id = artifact_card_pkg_id + "_preload_" + UtilsJavascript.generateIncrementalId();
            preloaded_package_ids.push(artifact_card_preload_pkg_id);
            load_promises.push(PackageManager.getInstance().loadMinorPackage(artifact_card_preload_pkg_id, PKGS.getPkgForIdentifier(artifact_card_pkg_id), "game"));
          }
        }
      }
    }
  }

  return Promise.all(load_promises).then(() => // destroy all views/layers
  NavigationManager.getInstance().destroyAllViewsAndLayers()).then(() => PackageManager.getInstance().activateGamePackage()).then(function() {
    // show game and ui
    const overlay_promise = Scene.getInstance().destroyOverlay();
    const game_promise = Scene.getInstance().showGame();
    const content_promise = NavigationManager.getInstance().showContentView(new gameUIViewClass({challenge}));
    const utility_promise = NavigationManager.getInstance().showUtilityView(new UtilityGameMenuItemView({model: ProfileManager.getInstance().profile}));

    // listen to game local events
    App._subscribeToGameLocalEvents();

    // wait for game to show as active (not status active) then unload all preloaded packages
    const scene = Scene.getInstance();
    const gameLayer = (scene != null) && scene.getGameLayer();
    if ((gameLayer == null) || (gameLayer.getStatus() === GameLayer.STATUS.ACTIVE)) {
      PackageManager.getInstance().unloadMajorMinorPackages(preloaded_package_ids);
    } else {
      var onActiveGame = function() {
        gameLayer.getEventBus().off(EVENTS.show_active_game, onActiveGame);
        gameLayer.getEventBus().off(EVENTS.terminate, onTerminate);
        return PackageManager.getInstance().unloadMajorMinorPackages(preloaded_package_ids);
      };
      var onTerminate = function() {
        gameLayer.getEventBus().off(EVENTS.show_active_game, onActiveGame);
        return gameLayer.getEventBus().off(EVENTS.terminate, onTerminate);
      };
      gameLayer.getEventBus().on(EVENTS.show_active_game, onActiveGame);
      gameLayer.getEventBus().on(EVENTS.terminate, onTerminate);
    }

    return Promise.all([
      overlay_promise,
      game_promise,
      content_promise,
      utility_promise
    ]);
  }).then(() => // enable user triggered navigation
  NavigationManager.getInstance().requestUserTriggeredNavigationUnlocked(App._userNavLockId));
};

//#######

App.onAfterShowEndTurn = function() {
  Logger.module("APPLICATION").log("App:onAfterShowEndTurn");
  // if we're playing in sandbox mode, we need to let the player play both sides so we swap players here
  if (SDK.GameSession.getInstance().isSandbox()) {
    // swap test user id
    const player1 = SDK.GameSession.getInstance().getPlayer1();
    const player2 = SDK.GameSession.getInstance().getPlayer2();
    if (player1.getIsCurrentPlayer()) { return SDK.GameSession.getInstance().setUserId(player1.getPlayerId()); } else { return SDK.GameSession.getInstance().setUserId(player2.getPlayerId()); }
  }
};

//
// --- Game Cleanup ---- #
//

App.cleanupGame = function() {
  Logger.module("APPLICATION").log("App.cleanupGame");
  // cleanup reconnect
  App.cleanupReconnectToGame();

  // cleanup events
  App.cleanupGameEvents();

  // terminate the game layer
  __guard__(Scene.getInstance().getGameLayer(), x => x.terminate());

  // reset the current instance of the game session
  return SDK.GameSession.reset();
};

App.cleanupGameEvents = function() {
  Logger.module("APPLICATION").log("App.cleanupGameEvents");
  // cleanup events
  App._unsubscribeFromGameLocalEvents();
  return App._unsubscribeFromGameNetworkEvents();
};

//
// --- Game Over Views ---- #
//

App._onGameOver = function() {
  Logger.module("APPLICATION").log("App:_onGameOver");

  // start loading data as soon as game is over, don't wait for animations
  App._startLoadingGameOverData();

  // disconnect from game room on network side
  // defer it until the call stack clears so any actions that caused the game to be over get broadcast during the current JS tick
  return _.defer(() => SDK.NetworkManager.getInstance().disconnect());
};

//
// --- Game Turn Over---- #
//

App._onEndTurn = e => AnalyticsTracker.sendAnalyticsForCompletedTurn(e.turn);

/**
 * This method de-registers all game listeners and initiates the game over screen flow. For visual sequencing purposes, it fires when it recieves an event that all game actions are done showing in the game layer.
 * @public
 */
App.onShowGameOver = function() {
  Logger.module("APPLICATION").log("App:onShowGameOver");

  // analytics call
  Analytics.page("Game Over",{ path: "/#game_over" });

  App.cleanupGameEvents();
  return App.showVictoryWhenGameDataReady();
};

/**
 * Load progression, rank, etc... data after a game is over.
 * @private
 */
App._startLoadingGameOverData = function(){

  // for specated games, don't load any data
  if (SDK.GameSession.current().getIsSpectateMode()) {
    App._gameOverDataThenable = Promise.resolve([null,[]]);
    return;
  }

  // resolve when the last game is confirmed as "over"
  const whenGameJobsProcessedAsync = new Promise(function(resolve,reject){
    const isGameReady = function(gameAttrs,jobAttrs){
      // if game is not over yet, the rest of the data is not valid
      if (gameAttrs.status !== SDK.GameStatus.over) {
        return false;
      }

      switch (gameAttrs.game_type) {
        case SDK.GameType.Friendly:
          return isFriendlyGameReady(gameAttrs,jobAttrs);
        case SDK.GameType.Ranked:
          return isRankedGameReady(gameAttrs,jobAttrs);
        case SDK.GameType.Casual:
          return isCasualGameReady(gameAttrs,jobAttrs);
        case SDK.GameType.Gauntlet:
          return isGauntletGameReady(gameAttrs,jobAttrs);
        case SDK.GameType.SinglePlayer:
          return isSinglePlayerGameReady(gameAttrs,jobAttrs);
        case SDK.GameType.BossBattle:
          return isBossBattleGameReady(gameAttrs,jobAttrs);
        case SDK.GameType.Rift:
          return isRiftGameReady(gameAttrs,jobAttrs);
        default:
          return Promise.resolve();
      }
    };

    var isFriendlyGameReady = function(gameAttrs,jobAttrs){
      if (gameAttrs.is_scored) {
        return jobAttrs.quests && jobAttrs.faction_progression;
      } else {
        return true;
      }
    };

    var isRankedGameReady = function(gameAttrs,jobAttrs){
      let doneProcessing = false;

      if (gameAttrs.is_scored) {
        doneProcessing = (jobAttrs.rank && jobAttrs.quests && jobAttrs.progression && jobAttrs.faction_progression);
      } else {
        doneProcessing = (jobAttrs.rank);
      }

      // if we're in diamond or above, wait for ladder, othwerwise don't since it's not guaranteed to process
      if (GamesManager.getInstance().getCurrentRank() <= SDK.RankDivisionLookup.Diamond) {
        doneProcessing = doneProcessing && jobAttrs.ladder;
      }

      return doneProcessing;
    };

    var isCasualGameReady = function(gameAttrs,jobAttrs){
      if (gameAttrs.is_scored) {
        return (jobAttrs.quests && jobAttrs.progression && jobAttrs.faction_progression);
      } else {
        return true;
      }
    };

    var isGauntletGameReady = function(gameAttrs,jobAttrs){
      if (gameAttrs.is_scored) {
        return (jobAttrs.gauntlet && jobAttrs.quests && jobAttrs.progression && jobAttrs.faction_progression);
      } else {
        return jobAttrs.gauntlet;
      }
    };

    var isSinglePlayerGameReady = function(gameAttrs,jobAttrs){
      if (gameAttrs.is_scored) {
        return jobAttrs.faction_progression;
      } else {
        return true;
      }
    };

    var isBossBattleGameReady = function(gameAttrs,jobAttrs){
      if (gameAttrs.is_winner) {
        return (jobAttrs.progression && jobAttrs.cosmetic_chests && jobAttrs.faction_progression);
      }
      if (gameAttrs.is_scored) {
        return jobAttrs.faction_progression;
      } else {
        return true;
      }
    };

    var isRiftGameReady = function(gameAttrs,jobAttrs){
      let doneProcessing;
      if (gameAttrs.is_scored) {
        return doneProcessing = (jobAttrs.rift && jobAttrs.quests);
      } else {
        return doneProcessing = (jobAttrs.rift);
      }
    };

    const gameSession = SDK.GameSession.getInstance();
    const lastGameModel = GamesManager.getInstance().playerGames.first();

    if ((lastGameModel != null) && SDK.GameType.isNetworkGameType(gameSession.getGameType())) {
      // lastGameModel.onSyncOrReady().then ()->
      if (isGameReady(lastGameModel.attributes,lastGameModel.attributes.job_status || {})) {
        return resolve([lastGameModel,null]);
      } else {
        return lastGameModel.on("change", function() {
          if (isGameReady(lastGameModel.attributes,lastGameModel.attributes.job_status || {})) {
            lastGameModel.off("change");
            return resolve([lastGameModel,null]);
          }
        });
      }
    } else if (gameSession.isChallenge()) {
      const challengeId = gameSession.getChallenge().type;
      if (gameSession.getChallenge() instanceof SDK.ChallengeRemote && gameSession.getChallenge().isDaily) {
        // Don't process daily challenges run by qa tool
        if (gameSession.getChallenge()._generatedForQA) {
          return resolve([null,null]);
        } else {
          return ProgressionManager.getInstance().completeDailyChallenge(challengeId).then(function(challengeData){
            const challengeModel = new Backbone.Model(challengeData);
            return resolve([null,challengeModel]);
          });
        }
      } else {
        return ProgressionManager.getInstance().completeChallengeWithType(challengeId).then(function(challengeData){
          NewPlayerManager.getInstance().setHasSeenBloodbornSpellInfo();
          const challengeModel = new Backbone.Model(challengeData);
          return resolve([null,challengeModel]);
        });
      }
    } else {
      return resolve([null, null]);
    }
  });

  return App._gameOverDataThenable = whenGameJobsProcessedAsync
  .bind({})
  .spread(function(userGameModel,challengeModel){
    let rewardId;
    this.userGameModel = userGameModel;
    this.challengeModel = challengeModel;
    const rewardIds = [];

    const gameSession = SDK.GameSession.getInstance();

    // Send game based analytics
    AnalyticsTracker.submitGameOverAnalytics(gameSession,userGameModel);

    // Mark first game of type completions
    if (gameSession.isRanked()) {
      NewPlayerManager.getInstance().setHasPlayedRanked(userGameModel);
    }
    if (gameSession.isSinglePlayer()) {
      NewPlayerManager.getInstance().setHasPlayedSinglePlayer(userGameModel);
    }

    if (this.userGameModel != null ? this.userGameModel.get('rewards') : undefined) {
      const object = this.userGameModel.get('rewards');
      for (rewardId in object) {
        var val = object[rewardId];
        rewardIds.push(rewardId);
      }
    }

    if (this.challengeModel != null ? this.challengeModel.get('reward_ids') : undefined) {
      for (rewardId of Array.from(this.challengeModel.get('reward_ids'))) {
        rewardIds.push(rewardId);
      }
    }

    return rewardIds;}).then(function(rewardIds){
    const allPromises = [];
    if (rewardIds != null) {
      for (var rewardId of Array.from(rewardIds)) {
        var rewardModel = new FHEIGHTBackbone.Model();
        rewardModel.url = process.env.API_URL + `/api/me/rewards/${rewardId}`;
        rewardModel.fetch();
        allPromises.push(rewardModel.onSyncOrReady());
      }
    }
    return Promise.all(allPromises);}).then(function(allRewardModels){
    this.rewardModels = allRewardModels;
    // if we're not done with core progression
    if (!NewPlayerManager.getInstance().isCoreProgressionDone()) {
      return NewPlayerManager.getInstance().updateCoreState();
    } else {
      return Promise.resolve();
    }}).then(function(newPlayerProgressionData){
    if ((newPlayerProgressionData != null ? newPlayerProgressionData.quests : undefined)) {
      return this.newBeginnerQuestsCollection = new Backbone.Collection(newPlayerProgressionData != null ? newPlayerProgressionData.quests : undefined);
    } else {
      return this.newBeginnerQuestsCollection = new Backbone.Collection();
    }}).then(function(){
    // if we're at a stage where we should start generating daily quests, request them in case any of the quest slots opened up
    if (NewPlayerManager.getInstance().shouldStartGeneratingDailyQuests()) {
      return QuestsManager.getInstance().requestNewDailyQuests();
    } else {
      return Promise.resolve();
    }}).then(function(){
    return Promise.all([this.userGameModel,this.rewardModels,this.newBeginnerQuestsCollection]);}).timeout(10000);
};

/**
 * Shows the victory screen after a game is over, all data is loaded, and assets for victory screen are allocated.
 * @public
 */
App.showVictoryWhenGameDataReady = function() {

  // show activity dialog
  NavigationManager.getInstance().showDialogView(new ActivityDialogItemView());

  // resolve when post game assets are done loading
  return PackageManager.getInstance().loadMinorPackage("postgame")
  .then(() => App._gameOverDataThenable).spread(function(userGameModel,rewardModels,newBeginnerQuestsCollection){
    if (!rewardModels) {
      throw new Error();
    }
    // destroy dialog
    NavigationManager.getInstance().destroyDialogView();
    // terminate game layer as we no longer need it to be active
    __guard__(Scene.getInstance().getGameLayer(), x => x.terminate());
    // show victory
    return App.showVictory(userGameModel,rewardModels,newBeginnerQuestsCollection);}).catch(Promise.TimeoutError, function(e) {
    // hide dialog
    NavigationManager.getInstance().destroyDialogView();
    return App._error("We're experiencing some delays in processing your game. Don't worry, you can keep playing and you'll receive credit shortly.");
  }).catch(function(e){
    // hide dialog
    NavigationManager.getInstance().destroyDialogView();
    return App._error(e.message);
  });
};

/**
 * Shows the victory screen after a game is over.
 * @public
 * @param  {Backbone.Model}        userGameModel           Game model that is finished loading / processing all jobs.
 * @param  {Array}              rewardModels           Rewards that this game needs to show.
 * @param  {Backbone.Collection}      newBeginnerQuestsCollection   Collection of new beginner quests as of game completion
 */
App.showVictory = function(userGameModel,rewardModels,newBeginnerQuestsCollection) {
  Logger.module("APPLICATION").log("App:showVictory");

  if (!SDK.GameSession.getInstance().getIsSpectateMode() && SDK.GameType.isNetworkGameType(SDK.GameSession.getInstance().getGameType())) {

    const faction_id = userGameModel.get('faction_id');
    const faction_xp = userGameModel.get('faction_xp');
    const faction_xp_earned = userGameModel.get('faction_xp_earned');
    const faction_level = SDK.FactionProgression.levelForXP(faction_xp + faction_xp_earned);
    const faction_prog_reward = SDK.FactionProgression.rewardDataForLevel(faction_id,faction_level);

    if (SDK.FactionProgression.hasLeveledUp(faction_xp + faction_xp_earned, faction_xp_earned) && faction_prog_reward) {
      App.setCallbackWhenCancel(App.showFactionXpReward.bind(App,userGameModel,rewardModels));
    } else if (SDK.GameSession.getInstance().isRanked()) {
      App.setCallbackWhenCancel(App.showLadderProgress.bind(App,userGameModel,rewardModels));
    } else if (SDK.GameSession.getInstance().isRift()) {
      App.setCallbackWhenCancel(App.showRiftProgress.bind(App,userGameModel,rewardModels));
    } else {
      App.addNextScreenCallbackToVictoryFlow(rewardModels);
    }

  } else {
    // local games
    if (SDK.GameSession.getInstance().isChallenge()) {

      // for challenges
      App.addNextScreenCallbackToVictoryFlow(rewardModels);
      if (userGameModel == null) { userGameModel = new Backbone.Model({}); }
    }
  }


  return Promise.all([
    Scene.getInstance().showOverlay(new VictoryLayer()),
    NavigationManager.getInstance().showContentView(new VictoryItemView({model:userGameModel || new Backbone.Model({})}))
  ]);
};

/**
 * Shows the next screen in the victory order: rank, quests, rewards etc.
 * @public
 * @param  {Backbone.Model}  userGameModel   Game model that is finished loading / processing all jobs.
 * @param  {Array}        rewardModels   Rewards that this game needs to show.
 */
App.addNextScreenCallbackToVictoryFlow = function(rewardModels) {
  Logger.module("APPLICATION").log("App:addNextScreenCallbackToVictoryFlow");

  // # if we have any faction progression rewards, show those first
  // if _.find(rewardModels, (rewardModel)-> rewardModel.get('reward_category') == "faction xp" and rewardModel.get('is_unread'))
  //   return App.setCallbackWhenCancel(App.showFactionXpReward.bind(App,rewardModels))

  // if we have any quest rewards, show those next
  if (_.find(rewardModels, rewardModel => (rewardModel.get('reward_category') === "quest") && rewardModel.get('is_unread'))) {
    return App.setCallbackWhenCancel(App.showQuestsCompleted.bind(App,rewardModels));
  }

  // if we have any progression rewards, show those next
  if (_.find(rewardModels, rewardModel => (rewardModel.get('reward_category') === "progression") && rewardModel.get('is_unread'))) {
    return App.setCallbackWhenCancel(App.showWinCounterReward.bind(App,rewardModels));
  }

  // ...
  if (_.find(rewardModels, rewardModel => (rewardModel.get('reward_category') === "challenge") && rewardModel.get('is_unread'))) {
    return App.setCallbackWhenCancel(App.showTutorialRewards.bind(App,rewardModels));
  }

  // ...
  if (_.find(rewardModels, rewardModel => (rewardModel.get('reward_category') === "daily challenge") && rewardModel.get('is_unread'))) {
    return App.setCallbackWhenCancel(App.showTutorialRewards.bind(App,rewardModels));
  }

  // if we have any ribbon rewards, show those next
  if (_.find(rewardModels, rewardModel => (rewardModel.get('reward_category') === "ribbon") && rewardModel.get('is_unread'))) {
    return App.setCallbackWhenCancel(App.showNextRibbonReward.bind(App,rewardModels));
  }

  // # if we have any gift crate rewards, show those next
  // if _.find(rewardModels, (rewardModel)-> rewardModel.get('reward_type') == "gift crate" and rewardModel.get('is_unread'))
  //   return App.setCallbackWhenCancel(App.showGiftCrateReward.bind(App,rewardModels))

  // if we have any cosmetic loot crate rewards, show those next
  if (_.find(rewardModels, rewardModel => (rewardModel.get('reward_category') === "loot crate") && rewardModel.get('is_unread'))) {
    return App.setCallbackWhenCancel(App.showLootCrateReward.bind(App,rewardModels));
  }

  // if we have any faction unlocks, show those next
  const factionUnlockedReward = _.find(rewardModels, rewardModel => (rewardModel.get('reward_category') === "faction unlock") && rewardModel.get('is_unread'));
  if (factionUnlockedReward) {
    return App.setCallbackWhenCancel(App.showUnlockedFaction.bind(App,factionUnlockedReward.get('unlocked_faction_id')));
  }

  // if we are doing a tutorial, kick us back to the tutorial screen, unless it's the last lesson: LessonFour, in which case, move along with normal flow (kicks to main menu)
  if (__guard__(SDK.GameSession.getInstance().getChallenge(), x => x.categoryType) === SDK.ChallengeCategory.tutorial.type) {
    // for tutorial go show tutorial layout
    if (SDK.GameSession.getInstance().getChallenge().type !== "LessonFour") {
      return App.setCallbackWhenCancel(App._showTutorialLessons.bind(App,SDK.GameSession.getInstance().getChallenge()));
    }
  }
};

/**
 * Show unlocked faction screen.
 * @public
 * @param  {String|Number}  factionId
 * @returns {Promise}
 */
App.showUnlockedFaction = function(factionId) {
  Logger.module("APPLICATION").log("App:showUnlockedFaction", factionId);
  const unlockFactionLayer = new UnlockFactionLayer(factionId);
  return Promise.all([
    NavigationManager.getInstance().destroyContentView(),
    NavigationManager.getInstance().destroyDialogView(),
    Scene.getInstance().showOverlay(unlockFactionLayer)
  ])
  .then(function() {
    if (Scene.getInstance().getOverlay() === unlockFactionLayer) {
      return unlockFactionLayer.animateReward();
    }}).catch(error => App._error(error));
};

/**
 * Show ribbon reward screen if there are any unread ribbon reward models.
 * @public
 * @param  {Array}  rewardModels  the reward models array.
 */
App.showNextRibbonReward = function(rewardModels) {

  Logger.module("APPLICATION").log("App:showNextRibbonReward");

  const nextReward = _.find(rewardModels, rewardModel => (rewardModel.get('reward_category') === "ribbon") && rewardModel.get('is_unread'));
  nextReward.set('is_unread',false);
  const ribbonId = __guard__(nextReward.get("ribbons"), x => x[0]);

  if (ribbonId != null) {

    const ribbonObject = SDK.RibbonFactory.ribbonForIdentifier(ribbonId);

    // clear ui
    NavigationManager.getInstance().destroyContentView();
    NavigationManager.getInstance().destroyDialogView();

    // show the in-engine card reward animation
    const progressionRewardLayer = new ProgressionRewardLayer();
    Scene.getInstance().showOverlay(progressionRewardLayer);
    return progressionRewardLayer.showRewardRibbons([ribbonId], `You've earned the ${ribbonObject.title} ribbon.`, "Ribbons show on your profile for performing in battle with distinction.");

  } else {

    return Logger.module("APPLICATION").log(`ERROR: ribbonId is undefined for reward ${nextReward.get("id")}`);
  }
};

/**
 * Show progression reward screen.
 * @public
 * @param  {Backbone.Model}  rewardModel progression reward model.
 */
App.showProgressReward = function(rewardModel) {

  let currencyRewardLayer, progressionRewardLayer;
  Logger.module("APPLICATION").log("App:showProgressReward");

  // clear ui
  NavigationManager.getInstance().destroyContentView();
  NavigationManager.getInstance().destroyDialogView();

  // show the in-engine card reward animation
  if (rewardModel.get("cards")) {
    // cards
    let cardIds = rewardModel.get("cards");
    if (rewardModel.get("_showStack")) {
      cardIds = [cardIds[0]];
    }
    progressionRewardLayer = new ProgressionRewardLayer();
    Scene.getInstance().showOverlay(progressionRewardLayer);
    return progressionRewardLayer.showRewardCards(cardIds, rewardModel.get("_showStack"), rewardModel.get("_title"), rewardModel.get("_subTitle"));
  } else if (rewardModel.get("cosmetics")) {
    // NOTE: only emotes and battle maps will work for this case
    progressionRewardLayer = new ProgressionRewardLayer();
    Scene.getInstance().showOverlay(progressionRewardLayer);
    if (SDK.CosmeticsFactory.cosmeticForIdentifier(rewardModel.get("cosmetics")[0]).typeId === SDK.CosmeticsTypeLookup.BattleMap) {
      return progressionRewardLayer.showRewardBattleMaps(rewardModel.get("cosmetics"), rewardModel.get("_title"), rewardModel.get("_subTitle"));
    } else {
      return progressionRewardLayer.showRewardEmotes(rewardModel.get("cosmetics"), rewardModel.get("_title"), rewardModel.get("_subTitle"));
    }
  } else if (rewardModel.get("gift_chests")) {
    CrateManager.getInstance().refreshGiftCrates();
    const rewardLayer = new LootCrateRewardLayer();
    Scene.getInstance().showOverlay(rewardLayer);
    return rewardLayer.animateReward(rewardModel.get("gift_chests"),rewardModel.get("_title"),rewardModel.get("_subTitle"));
  } else if (rewardModel.get("cosmetic_keys")) {
    // cosmetic keys
    const cosmeticKeyRewardLayer = new LootCrateRewardLayer();
    Scene.getInstance().showOverlay(cosmeticKeyRewardLayer);
    return cosmeticKeyRewardLayer.animateReward(rewardModel.get("cosmetic_keys"), rewardModel.get("_title"), rewardModel.get("_subTitle"));
  } else if (rewardModel.get("ribbons")) {
    // ribbons
    progressionRewardLayer = new ProgressionRewardLayer();
    Scene.getInstance().showOverlay(progressionRewardLayer);
    return progressionRewardLayer.showRewardRibbons(rewardModel.get("ribbons"), rewardModel.get("_title"), rewardModel.get("_subTitle"));
  } else if (rewardModel.get("spirit")) {
    // spirit
    currencyRewardLayer = new CurrencyRewardLayer();
    Scene.getInstance().showOverlay(currencyRewardLayer);
    return currencyRewardLayer.animateReward("spirit", rewardModel.get("spirit"), rewardModel.get("_title"), rewardModel.get("_subTitle"));
  } else if (rewardModel.get("gold")) {
    // gold
    currencyRewardLayer = new CurrencyRewardLayer();
    Scene.getInstance().showOverlay(currencyRewardLayer);
    return currencyRewardLayer.animateReward("gold", rewardModel.get("gold"), rewardModel.get("_title"), rewardModel.get("_subTitle"));
  } else if (rewardModel.get("spirit_orbs")) {
    // booster
    const boosterRewardLayer = new BoosterRewardLayer();
    Scene.getInstance().showOverlay(boosterRewardLayer);
    return boosterRewardLayer.animateReward(rewardModel.get("_title"), rewardModel.get("_subTitle"), rewardModel.get("spirit_orbs"));
  } else if (rewardModel.get("gauntlet_tickets")) {
    // gauntlet ticket
    const gauntletTicketRewardLayer = new GauntletTicketRewardLayer();
    Scene.getInstance().showOverlay(gauntletTicketRewardLayer);
    return gauntletTicketRewardLayer.animateReward(rewardModel.get("_title"), rewardModel.get("_subTitle"));
  } else {
    return Logger.module("APPLICATION").log("Application->showProgressReward: Attempt to show reward model without valid reward");
  }
};

/**
 * Show achievement reward screen if there are any unread ones.
 * @public
 */
App.showAchievementCompletions = function() {
  if (!AchievementsManager.getInstance().hasUnreadCompletedAchievements()) {
    Scene.getInstance().destroyOverlay();
    return Promise.resolve();
  } else {
    return new Promise( function(resolve, reject) {
      const locResolve = resolve;
      Logger.module("APPLICATION").log("App:showAchievementCompletions");
      const completedAchievementModel = AchievementsManager.getInstance().popNextUnreadAchievementModel();

      App.setCallbackWhenCancel(locResolve);

      // show reward
      return App.showProgressReward(completedAchievementModel);
    }).then(() => App.showAchievementCompletions());
  }
};

/**
 * Show twitch reward screen if there are any unread ones.
 * @public
 */
App.showTwitchRewards = function() {
  if (!TwitchManager.getInstance().hasUnclaimedTwitchRewards()) {
    Scene.getInstance().destroyOverlay();
    return Promise.resolve();
  } else {
    return new Promise( function(resolve, reject) {
      const locResolve = resolve;
      Logger.module("APPLICATION").log("App:showTwitchRewards");
      const twitchRewardModel = TwitchManager.getInstance().popNextUnclaimedTwitchRewardModel();

      App.setCallbackWhenCancel(locResolve);

      // show reward
      return App.showProgressReward(twitchRewardModel);
    }).then(() => App.showTwitchRewards());
  }
};

/**
 * Show season rewards screen if the player has an unread season rewards set.
 * @public
 */
App.showEndOfSeasonRewards = function() {
  const gamesManager = GamesManager.getInstance();
  if (gamesManager.hasUnreadSeasonReward()) {
    return new Promise( function(resolve, reject) {
      const locResolve = resolve;

      // get data
      const seasonModel = gamesManager.getSeasonsWithUnclaimedRewards()[0];

      const bonusChevrons = SDK.RankFactory.chevronsRewardedForReachingRank((seasonModel.get("top_rank") != null) || 30);
      const seasonRewardIds = seasonModel.get("reward_ids");

      if (bonusChevrons === 0) {
        // If there is no rewards we exit here
        return locResolve();
      } else {
        Logger.module("APPLICATION").log("App:showEndOfSeasonRewards");

        const endOfSeasonLayer = new EndOfSeasonLayer(seasonModel);
        return Promise.all([
          NavigationManager.getInstance().destroyContentView(),
          NavigationManager.getInstance().destroyDialogView(),
          Scene.getInstance().showOverlay(endOfSeasonLayer)
        ])
        .then(function() {
          App.setCallbackWhenCancel(function() {
            Scene.getInstance().destroyOverlay();
            return locResolve();
          });

          if (Scene.getInstance().getOverlay() === endOfSeasonLayer) {
            return endOfSeasonLayer.animateReward();
          }}).catch(function(error) {
          Logger.module("APPLICATION").log("App.showEndOfSeasonRewards error: ", error);

          return locResolve();});
      }
    });
  } else {
    return Promise.resolve();
  }
};


App.showTutorialRewards = function(rewardModels) {

  Logger.module("APPLICATION").log("App:showTutorialRewards");

  let nextReward = _.find(rewardModels, rewardModel => (rewardModel.get('reward_category') === "challenge") && rewardModel.get('is_unread'));
  nextReward = nextReward || _.find(rewardModels, rewardModel => (rewardModel.get('reward_category') === "daily challenge") && rewardModel.get('is_unread'));
  nextReward.set("is_unread",false);

  App.addNextScreenCallbackToVictoryFlow(rewardModels);

  // show reward
  if (nextReward.get("unlocked_faction_id")) {
    return App.showUnlockedFaction(nextReward.get("unlocked_faction_id"));
  } else {
    return App.showProgressReward(nextReward);
  }
};


App.showLadderProgress = function(userGameModel,rewardModels) {
  Logger.module("APPLICATION").log("App:showLadderProgress");

  // set the cancel callback to show the next screen
  App.addNextScreenCallbackToVictoryFlow(rewardModels);

  const ladderProgressLayer = new LadderProgressLayer();
  return Promise.all([
    NavigationManager.getInstance().destroyContentView(),
    NavigationManager.getInstance().destroyDialogView(),
    Scene.getInstance().showOverlay(ladderProgressLayer)
  ])
  .then(function() {
    if (Scene.getInstance().getOverlay() === ladderProgressLayer) {
      return ladderProgressLayer.showLadderProgress(userGameModel);
    }}).catch(error => App._error("App.showLadderProgress error: ", error));
};

App.showRiftProgress = function(userGameModel,rewardModels) {
  Logger.module("APPLICATION").log("App:showRiftProgress");

  // set the cancel callback to show the next screen
  App.addNextScreenCallbackToVictoryFlow(rewardModels);

  const riftProgressLayer = new RiftProgressLayer();
  return Promise.all([
    NavigationManager.getInstance().destroyContentView(),
    NavigationManager.getInstance().destroyDialogView(),
    Scene.getInstance().showOverlay(riftProgressLayer)
  ])
  .then(function() {
    if (Scene.getInstance().getOverlay() === riftProgressLayer) {
      return riftProgressLayer.showRiftProgress(userGameModel);
    }}).catch(error => App._error("App.showRiftProgress error: ", error));
};


App.showQuestsCompleted = function(rewardModels) {

  let rewardLayer;
  Logger.module("APPLICATION").log("App:showQuestsCompleted");

  const nextQuestReward = _.find(rewardModels, rewardModel => (rewardModel.get('reward_category') === "quest") && rewardModel.get('is_unread'));
  nextQuestReward.set('is_unread',false);
  const sdkQuest = SDK.QuestFactory.questForIdentifier(nextQuestReward.get('quest_type_id'));
  const questName = sdkQuest.getName();

  const gold = nextQuestReward.get("gold");
  const spiritOrbs = nextQuestReward.get("spirit_orbs");
  let giftChests = null;
  let cosmeticKeys = null;

  if ((sdkQuest.giftChests != null ? sdkQuest.giftChests.length : undefined) > 0) {
    ({
      giftChests
    } = sdkQuest);
  }

  if ((sdkQuest.cosmeticKeys != null ? sdkQuest.cosmeticKeys.length : undefined) > 0) {
    ({
      cosmeticKeys
    } = sdkQuest);
  }

  // track an event in analytics
  Analytics.track("quest complete", {
    category: Analytics.EventCategory.Quest,
    quest_type_id: nextQuestReward.get('quest_type_id'),
    gold_amount:nextQuestReward.get("gold") || 0
  },{
    labelKey:"quest_type_id",
    valueKey:"gold_amount",
    nonInteraction:1
  });

  // set the cancel callback to show the next screen
  App.addNextScreenCallbackToVictoryFlow(rewardModels);

  // show quest reward
  NavigationManager.getInstance().destroyContentView();
  if (gold) {
    const currencyRewardLayer = new CurrencyRewardLayer();
    Scene.getInstance().showOverlay(currencyRewardLayer);
    return currencyRewardLayer.animateReward(
      "gold",
      gold,
      i18next.t("rewards.quest_complete_title",{quest_name:questName}),
      `+${gold} GOLD for completing ${questName}`,
      "Quest Complete"
    );
  } else if (spiritOrbs) {
    // booster
    const boosterRewardLayer = new BoosterRewardLayer();
    Scene.getInstance().showOverlay(boosterRewardLayer);
    return boosterRewardLayer.animateReward(
      i18next.t("rewards.quest_complete_title",{quest_name:questName}),
      `+${spiritOrbs} SPIRIT ORBS for completing ${questName}`
    );
  } else if (giftChests) {
    Analytics.track("earned gift crate", {
      category: Analytics.EventCategory.Crate,
      product_id: giftChests[0]
    }, {
      labelKey: "product_id"
    });
    // show reward setup on the engine side
    NavigationManager.getInstance().destroyContentView();
    rewardLayer = new LootCrateRewardLayer();
    Scene.getInstance().showOverlay(rewardLayer);
    rewardLayer.animateReward(giftChests, null, i18next.t("rewards.quest_reward_gift_crate_title",{quest_name:questName}));
    return CrateManager.getInstance().refreshGiftCrates();
  } else if (cosmeticKeys) {
    Analytics.track("earned cosmetic key", {
      category: Analytics.EventCategory.Crate,
      product_id: cosmeticKeys[0]
    }, {
      labelKey: "product_id"
    });
    NavigationManager.getInstance().destroyContentView();
    rewardLayer = new CosmeticKeyRewardLayer();
    Scene.getInstance().showOverlay(rewardLayer);
    rewardLayer.showRewardKeys(cosmeticKeys, null, `FREE Cosmetic Crate Key for completing the ${questName} quest`);
    return CrateManager.getInstance().refreshGiftCrates();
  }
};


// Outdated name, really shows all progression rewards
App.showWinCounterReward = function(rewardModels) {

  Logger.module("APPLICATION").log("App:showWinCounterReward");

  const nextReward = _.find(rewardModels, rewardModel => (rewardModel.get('reward_category') === "progression") && rewardModel.get('is_unread'));
  nextReward.set("is_unread",false);

  App.addNextScreenCallbackToVictoryFlow(rewardModels);

  // show reward setup on the engine side
  NavigationManager.getInstance().destroyContentView();
//    Scene.getInstance().showOverlay(currencyRewardLayer) # TODO: merge How does this even work?

  const rewardView = null;

  switch (nextReward.get("reward_type")) {
    case "win count":
      var currencyRewardLayer = new CurrencyRewardLayer();
      Scene.getInstance().showOverlay(currencyRewardLayer);
      var goldAmount = nextReward.get("gold");
      var message = i18next.t("rewards.3_win_gold_reward_message",{gold_amount:goldAmount});
      return currencyRewardLayer.animateReward(
        "gold",
        goldAmount,
        i18next.t("rewards.3_win_gold_reward_title"),
        message
      );
    case "play count":
      currencyRewardLayer = new CurrencyRewardLayer();
      Scene.getInstance().showOverlay(currencyRewardLayer);
      goldAmount = nextReward.get("gold");
      return currencyRewardLayer.animateReward(
        "gold",
        goldAmount,
        i18next.t("rewards.4_play_gold_reward_title"),
        i18next.t("rewards.4_play_gold_reward_message",{gold_amount:goldAmount})
      );
    case "daily win":
      currencyRewardLayer = new CurrencyRewardLayer();
      Scene.getInstance().showOverlay(currencyRewardLayer);
      goldAmount = nextReward.get("gold");
      return currencyRewardLayer.animateReward(
        "gold",
        goldAmount,
        i18next.t("rewards.first_win_of_the_day_reward_title"),
        i18next.t("rewards.first_win_of_the_day_reward_message",{gold_amount:goldAmount})
      );
    case "first 3 games":
      currencyRewardLayer = new CurrencyRewardLayer();
      Scene.getInstance().showOverlay(currencyRewardLayer);
      goldAmount = nextReward.get("gold");
      return currencyRewardLayer.animateReward(
        "gold",
        goldAmount,
        i18next.t("rewards.first_3_games_reward_title"),
        i18next.t("rewards.first_3_games_reward_message",{gold_amount:goldAmount})
      );
    case "first 10 games":
      currencyRewardLayer = new CurrencyRewardLayer();
      Scene.getInstance().showOverlay(currencyRewardLayer);
      goldAmount = nextReward.get("gold");
      return currencyRewardLayer.animateReward(
        "gold",
        goldAmount,
        i18next.t("rewards.first_10_games_reward_title"),
        i18next.t("rewards.first_10_games_reward_message",{gold_amount:goldAmount})
      );
    case "boss battle":
      var boosterRewardLayer = new BoosterRewardLayer();
      Scene.getInstance().showOverlay(boosterRewardLayer);
      var cardSetId = nextReward.get("spirit_orbs");
      return boosterRewardLayer.animateReward(
        i18next.t("rewards.boss_defeated_reward_title"),
        i18next.t("rewards.boss_defeated_reward_message"),
        SDK.CardSet.Core
      );
  }
};

App.showLootCrateReward = function(rewardModels){
  Logger.module("APPLICATION").log("App:showLootCrateReward");

  const nextReward = _.find(rewardModels, rewardModel => (rewardModel.get('reward_category') === "loot crate") && rewardModel.get('is_unread'));
  nextReward.set("is_unread",false);

  Analytics.track("earned cosmetic crate", {
    category: Analytics.EventCategory.Crate,
    product_id: __guard__(nextReward.get("cosmetic_chests"), x => x[0])
  }, {
    labelKey: "product_id"
  });

  App.addNextScreenCallbackToVictoryFlow(rewardModels);

  // show reward setup on the engine side
  NavigationManager.getInstance().destroyContentView();
  const rewardLayer = new LootCrateRewardLayer();
  Scene.getInstance().showOverlay(rewardLayer);
  return rewardLayer.animateReward(nextReward.get("cosmetic_chests"));
};

// App.showGiftCrateReward = (rewardModels)->
//   Logger.module("APPLICATION").log "App:showGiftCrateReward"
//
//   nextReward = _.find(rewardModels, (rewardModel)-> rewardModel.get('reward_type') == "gift crate" and rewardModel.get('is_unread'))
//   nextReward.set("is_unread",false)
//
//   Analytics.track("earned gift crate", {
//     category: Analytics.EventCategory.Crate,
//     product_id: nextReward.get("gift_crates")?[0]
//   }, {
//     labelKey: "product_id"
//   })
//
//   App.addNextScreenCallbackToVictoryFlow(rewardModels)
//
//   # show reward setup on the engine side
//   NavigationManager.getInstance().destroyContentView()
//   rewardLayer = new LootCrateRewardLayer()
//   Scene.getInstance().showOverlay(rewardLayer)
//   rewardLayer.animateReward(nextReward.get("gift_crates"))

App.showFactionXpReward = function(userGameModel,rewardModels) {

  Logger.module("APPLICATION").log("App:showFactionXpReward");

  const nextUnreadReward = _.find(rewardModels, rewardModel => (rewardModel.get('reward_category') === "faction xp") && rewardModel.get('is_unread'));

  nextUnreadReward.set("is_unread",false);

  const factionId = userGameModel.get("faction_id");
  const factionName = SDK.FactionFactory.factionForIdentifier(factionId).name;
  const faction_xp = userGameModel.get('faction_xp');
  const faction_xp_earned = userGameModel.get('faction_xp_earned');
  const level = SDK.FactionProgression.levelForXP(faction_xp + faction_xp_earned) + 1;

  // set title
  nextUnreadReward.set("_title", i18next.t("rewards.level_up_reward_title",{ level }));

  // set reward model properties by reward
  if (nextUnreadReward.get("cards")) {
    // cards
    const factionCards = GameDataManager.getInstance().visibleCardsCollection.filter(c => (c.get("factionId") === factionId) && (c.get("rarityId") === SDK.Rarity.Fixed));
    const availableFactionCards = _.filter(factionCards, c => c.get("inventoryCount") > 0);
    const subtitle = i18next.t("rewards.card_reward_subtitle",{
      card_count: availableFactionCards.length,
      total: factionCards.length,
      factionName
    });
    nextUnreadReward.set("_subTitle", subtitle);
    nextUnreadReward.set("_showStack",true);

  } else if (nextUnreadReward.get("spirit")) {
    // sprit
    nextUnreadReward.set("_subTitle", i18next.t("rewards.spirit_for_faction_lvl_reward_message",{spirit:nextUnreadReward.get("spirit"),faction_name:factionName,level}));
  } else if (nextUnreadReward.get("gold")) {
    // gold
    nextUnreadReward.set("_subTitle", i18next.t("rewards.gold_for_faction_lvl_reward_message",{gold:nextUnreadReward.get("spirit"),faction_name:factionName,level}));
  } else if (nextUnreadReward.get("spirit_orbs")) {
    // booster
    nextUnreadReward.set("_subTitle", i18next.t("rewards.orb_for_faction_lvl_reward_message",{faction_name:factionName,level}));
  }

  // setup next screen
  if (SDK.GameSession.current().isRanked()) {
    App.setCallbackWhenCancel(App.showLadderProgress.bind(App,userGameModel,rewardModels));
  } else if (SDK.GameSession.current().isRift()) {
    App.setCallbackWhenCancel(App.showRiftProgress.bind(App,userGameModel,rewardModels));
  } else {
    App.addNextScreenCallbackToVictoryFlow(rewardModels);
  }

  // show reward
  return App.showProgressReward(nextUnreadReward);
};

App.showNewBeginnerQuests = beginnerQuestsCollection => NavigationManager.getInstance().toggleModalViewByClass(QuestLogLayout,{
  collection:beginnerQuestsCollection,
  showConfirm:true
});

App.showFreeCardOfTheDayReward = opts => Promise.all([
  NavigationManager.getInstance().destroyModalView(),
  NavigationManager.getInstance().destroyContentView(),
  NavigationManager.getInstance().destroyUtilityView()
]).then(()=> {
  const rewardLayer = new FreeCardOfTheDayLayer();
  Scene.getInstance().showOverlay(rewardLayer);
  rewardLayer.showCoreGem(opts.cardId);
  return App.setCallbackWhenCancel(function(){
    Scene.getInstance().destroyOverlay();
    return App._showMainMenu().then(function(){
      NavigationManager.getInstance().toggleModalViewByClass(QuestLogLayout,{
        collection:QuestsManager.getInstance().getQuestCollection(),
        model:ProgressionManager.getInstance().gameCounterModel
      });
      return Promise.resolve();
    });
  });
});

//
// ---- User Triggered Navigation ---- #
//

App.onUserTriggeredExit = function() {
  Logger.module("APPLICATION").log("App:onUserTriggeredExit");
  return App.main();
};

App.onUserTriggeredSkip = function() {
  Logger.module("APPLICATION").log("App:onUserTriggeredSkip");
  const gameSession = SDK.GameSession.getInstance();
  const scene = Scene.getInstance();
  const gameLayer = scene && scene.getGameLayer();
  if ((gameLayer != null) && gameLayer.getIsGameActive()) {
    // when in an active game
    if (gameSession.getIsMyFollowupActiveAndCancellable()) {
      audio_engine.current().play_effect_for_interaction(RSX.sfx_ui_cancel.audio, CONFIG.CANCEL_SFX_PRIORITY);
      gameSession.submitExplicitAction(gameSession.getMyPlayer().actionEndFollowup());
    } else if (gameLayer.getIsShowingActionCardSequence()) {
      audio_engine.current().play_effect_for_interaction(RSX.sfx_ui_cancel.audio, CONFIG.CANCEL_SFX_PRIORITY);
      // stop showing played card
      gameLayer.skipShowActionCardSequence();
    }
  }

  return Promise.resolve();
};

App.onUserTriggeredCancel = function() {
  Logger.module("APPLICATION").log("App:onUserTriggeredCancel");
  const cancelPromises = [];

  if (NavigationManager.getInstance().getIsShowingModalView()) {
    // close modal screens
    audio_engine.current().play_effect_for_interaction(RSX.sfx_ui_cancel.audio, CONFIG.CANCEL_SFX_PRIORITY);
    cancelPromises.push(NavigationManager.getInstance().destroyModalView());
  } else if (NavigationManager.getInstance().getHasLastRoute()) {
    // go to last route (handles own sfx)
    NavigationManager.getInstance().showLastRoute();
  } else {
    const gameSession = SDK.GameSession.getInstance();
    const scene = Scene.getInstance();
    const gameLayer = scene && scene.getGameLayer();

    if ((gameLayer != null) && !gameLayer.getIsDisabled() && NavigationManager.getInstance().getIsShowingContentViewClass(GameLayout)) {
      // when in game that is not over
      if (gameSession.getIsMyFollowupActiveAndCancellable()) {
        audio_engine.current().play_effect_for_interaction(RSX.sfx_ui_cancel.audio, CONFIG.CANCEL_SFX_PRIORITY);
        gameSession.submitExplicitAction(gameSession.actionRollbackSnapshot());
      } else {
        if (!gameLayer.getMyPlayer().getIsTakingSelectionAction() && !gameLayer.getIsShowingActionCardSequence()) {
          // show esc game menu if we are not selecting something in game and not showing an action sequence
          cancelPromises.push(NavigationManager.getInstance().showModalView(new EscGameMenuItemView()));
        }

        // always reset game active state
        gameLayer.resetActiveState();
      }
    } else {
      const callback = App.getCallbackWhenCancel();
      if (callback != null) {
        App.setCallbackWhenCancel(null);
        const callbackResult = callback();
        if (callbackResult instanceof Promise) {
          cancelPromises.push(callbackResult);
        }
      } else if ((App.getIsLoggedIn() || window.isDesktop) && (NavigationManager.getInstance().getIsShowingContentViewClass(LoaderItemView) || NavigationManager.getInstance().getIsShowingContentViewClass(LoginMenuItemView) || NavigationManager.getInstance().getIsShowingContentViewClass(MainMenuItemView) || NavigationManager.getInstance().getIsShowingContentViewClass(TutorialLessonsLayout))) {
        // show esc main menu when on loading or login or main
        cancelPromises.push(NavigationManager.getInstance().showModalView(new EscMainMenuItemView()));
      } else if (((gameLayer == null) || gameLayer.getIsDisabled()) && !App.getIsShowingMain()) {
        audio_engine.current().play_effect_for_interaction(RSX.sfx_ui_cancel.audio, CONFIG.CANCEL_SFX_PRIORITY);
        // for now just go back to main until we implement routing
        cancelPromises.push(App.main());
      }
    }
  }

  return Promise.all(cancelPromises);
};

App.setCallbackWhenCancel = callback => // this is a less than ideal method of setting the next step in cancel sequence
App._callbackWhenCancel = callback;

App.getCallbackWhenCancel = () => App._callbackWhenCancel;

App.onUserTriggeredConfirm = () => Logger.module("APPLICATION").log("App:onUserTriggeredConfirm");

//
// ---- Events: Client ---- #
//

App.beforeunload = function(e) {
  // return an empty string to trigger alert
  if ((App._reloadRequestIds.length === 0) && !window.isDesktop && !UtilsEnv.getIsInLocal()) {
    const confirmMessage = "";
    (e || window.event).returnValue = confirmMessage;
    return confirmMessage;
  }
};

App.unload = function() {
  // reset the global event bus so no more events will be handled
  EventBus.reset();

  // cancel any ongoing matchmaking
  return GamesManager.getInstance().cancelMatchmaking();
};

App.bindEvents = function() {
  // attach event listeners to document/window
  $(window).on('unload', App.unload.bind(App));
  $(window).on('mousemove',App.onPointerMove.bind(App));
  $(window).on('mousedown',App.onPointerDown.bind(App));
  $(window).on('mouseup',App.onPointerUp.bind(App));
  $(window).on('wheel',App.onPointerWheel.bind(App));
  $(window).on("resize", _.debounce(App.onResize.bind(App), 250));
  EventBus.getInstance().on(EVENTS.request_resize, _.debounce(App.onResize.bind(App), 250));
  $(document).on("visibilitychange",App.onVisibilityChange.bind(App));
  EventBus.getInstance().on(EVENTS.request_reload, App.onRequestReload);
  EventBus.getInstance().on(EVENTS.cancel_reload_request, App.onCancelReloadRequest);
  $(CONFIG.GAMECANVAS_SELECTOR).on("webglcontextlost", () => App.onRequestReload({
    id: "webgl_context_lost",
    message: `Your graphics hit a snag and requires a ${window.isDesktop ? "restart" : "reload"} to avoid any issues.`
  }));

  // session is a plain event emitter
  Session.on('login', App.onLogin);
  Session.on('logout', App.onLogout);
  Session.on('error', App.onSessionError);

  EventBus.getInstance().on(EVENTS.show_login, App._showLoginMenu, App);
  EventBus.getInstance().on(EVENTS.show_terms, App._showTerms, App);

  EventBus.getInstance().on(EVENTS.show_play, App.showPlay, App);
  EventBus.getInstance().on(EVENTS.show_watch, App.showWatch, App);
  EventBus.getInstance().on(EVENTS.show_shop, App.showShop, App);
  EventBus.getInstance().on(EVENTS.show_collection, App.showCollection, App);
  EventBus.getInstance().on(EVENTS.show_codex, App.showCodex, App);
  EventBus.getInstance().on(EVENTS.show_booster_pack_unlock, App.showBoosterPackUnlock, App);
  EventBus.getInstance().on(EVENTS.show_crate_inventory, App.showCrateInventory, App);
  EventBus.getInstance().on(EVENTS.start_challenge, App._startGameWithChallenge, App);
  EventBus.getInstance().on(EVENTS.start_single_player, App._startSinglePlayerGame, App);
  EventBus.getInstance().on(EVENTS.start_boss_battle, App._startBossBattleGame, App);
  EventBus.getInstance().on(EVENTS.start_replay, App._startGameForReplay, App);
  EventBus.getInstance().on(EVENTS.show_free_card_of_the_day, App.showFreeCardOfTheDayReward, App);
  EventBus.getInstance().on(EVENTS.discord_spectate, App.onDiscordSpectate, App);

  GamesManager.getInstance().on(EVENTS.matchmaking_start, App._matchmakingStart, App);
  GamesManager.getInstance().on(EVENTS.matchmaking_cancel, App._matchmakingCancel, App);
  GamesManager.getInstance().on(EVENTS.matchmaking_error, App._matchmakingError, App);
  GamesManager.getInstance().on(EVENTS.finding_game, App._findingGame, App);
  GamesManager.getInstance().on(EVENTS.invite_accepted, App._inviteAccepted, App);
  GamesManager.getInstance().on(EVENTS.invite_rejected, App._inviteRejected, App);
  GamesManager.getInstance().on(EVENTS.invite_cancelled, App._inviteCancelled, App);
  GamesManager.getInstance().on(EVENTS.start_spectate, App._spectateGame, App);

  EventBus.getInstance().on(EVENTS.canvas_mouse_state, App.onCanvasMouseState, App);

  NavigationManager.getInstance().on(EVENTS.user_triggered_exit, App.onUserTriggeredExit, App);
  NavigationManager.getInstance().on(EVENTS.user_triggered_skip, App.onUserTriggeredSkip, App);
  NavigationManager.getInstance().on(EVENTS.user_triggered_cancel, App.onUserTriggeredCancel, App);
  NavigationManager.getInstance().on(EVENTS.user_triggered_confirm, App.onUserTriggeredConfirm, App);

  EventBus.getInstance().on(EVENTS.error, App._error, App);
  return EventBus.getInstance().on(EVENTS.ajax_error, App._error, App);
};

App._subscribeToGameLocalEvents = function() {
  Logger.module("APPLICATION").log("App._subscribeToGameLocalEvents");
  const scene = Scene.getInstance();
  const gameLayer = scene != null ? scene.getGameLayer() : undefined;
  if (gameLayer != null) {
    gameLayer.getEventBus().on(EVENTS.after_show_end_turn, App.onAfterShowEndTurn, App);
    gameLayer.getEventBus().on(EVENTS.show_game_over, App.onShowGameOver, App);
    gameLayer.getEventBus().on(EVENTS.canvas_mouse_state, App.onCanvasMouseState, App);
  }

  SDK.GameSession.getInstance().getEventBus().on(EVENTS.game_over, App._onGameOver, App);
  return SDK.GameSession.getInstance().getEventBus().on(EVENTS.end_turn, App._onEndTurn, App);
};

App._unsubscribeFromGameLocalEvents = function() {
  Logger.module("APPLICATION").log("App._unsubscribeFromGameLocalEvents");
  const scene = Scene.getInstance();
  const gameLayer = scene != null ? scene.getGameLayer() : undefined;
  if (gameLayer != null) {
    gameLayer.getEventBus().off(EVENTS.after_show_end_turn, App.onAfterShowEndTurn, App);
    gameLayer.getEventBus().off(EVENTS.show_game_over, App.onShowGameOver, App);
    gameLayer.getEventBus().off(EVENTS.canvas_mouse_state, App.onCanvasMouseState, App);
  }

  SDK.GameSession.getInstance().getEventBus().off(EVENTS.game_over, App._onGameOver, App);
  return SDK.GameSession.getInstance().getEventBus().off(EVENTS.end_turn, App._onEndTurn, App);
};

App._subscribeToGameNetworkEvents = function() {
  Logger.module("APPLICATION").log("App._subscribeToGameNetworkEvents");
  SDK.NetworkManager.getInstance().getEventBus().on(EVENTS.network_game_event, App._onNetworkGameEvent, App);
  SDK.NetworkManager.getInstance().getEventBus().on(EVENTS.network_game_error, App._onNetworkGameError, App);
  SDK.NetworkManager.getInstance().getEventBus().on(EVENTS.game_server_shutdown, App._onGameServerShutdown, App);
  SDK.NetworkManager.getInstance().getEventBus().on(EVENTS.reconnect_to_game, App._onReconnectToGame, App);
  return SDK.NetworkManager.getInstance().getEventBus().on(EVENTS.opponent_connection_status_changed, App._onOpponentConnectionStatusChanged, App);
};

App._unsubscribeFromGameNetworkEvents = function() {
  Logger.module("APPLICATION").log("App._unsubscribeFromGameNetworkEvents");
  SDK.NetworkManager.getInstance().getEventBus().off(EVENTS.network_game_event, App._onNetworkGameEvent, App);
  SDK.NetworkManager.getInstance().getEventBus().off(EVENTS.network_game_error, App._onNetworkGameError, App);
  SDK.NetworkManager.getInstance().getEventBus().off(EVENTS.game_server_shutdown, App._onGameServerShutdown, App);
  SDK.NetworkManager.getInstance().getEventBus().off(EVENTS.reconnect_to_game, App._onReconnectToGame, App);
  return SDK.NetworkManager.getInstance().getEventBus().off(EVENTS.opponent_connection_status_changed, App._onOpponentConnectionStatusChanged, App);
};

App.onVisibilityChange = function() {
  // TODO: look into why this causes errors
  // Prevent sound effects that have been queued up from blasting all at once when app regains visibility
  if (document.hidden) {
    // Would rather do a resume and start of effects, it doesn't stop them from piling up though
    return audio_engine.current().stop_all_effects();
  } else {
    return audio_engine.current().stop_all_effects();
  }
};

//
// ---- RESIZE ---- #
//

App.onResize = function(e) {
  let confirmResolutionChange;
  Logger.module("APPLICATION").log("App.onResize");
  // store current resolution data
  const ignoreNextResolutionChange = App._ignoreNextResolutionChange;
  App._ignoreNextResolutionChange = false;
  if (!ignoreNextResolutionChange) {
    const currentResolution = CONFIG.resolution;
    confirmResolutionChange = (App._lastResolution != null) && (App._lastResolution !== currentResolution);
  }

  // before resize
  EventBus.getInstance().trigger(EVENTS.before_resize);

  // resize and update scale
  App._resizeAndScale();

  // resize the scene to match app
  Scene.getInstance().resize();

  // resize the UI
  EventBus.getInstance().trigger(EVENTS.resize);

  // after resize
  EventBus.getInstance().trigger(EVENTS.after_resize);

  // force user to restart if resource scale for engine has changed
  // CSS automatically handles resource scale changes
  // TODO: instead of restarting, destroy all current views, show loading screen, reload images at new scale, and return to current route
  App._needsRestart = (App._lastResourceScaleEngine != null) && (CONFIG.resourceScaleEngine !== App._lastResourceScaleEngine);
  if (!App._needsRestart) {
    // cancel forced reload in case user has restored original window size
    App._cancelReloadRequestForResolutionChange();
  }

  if (confirmResolutionChange) {
    // confirm resolution with user after resizing
    App._confirmResolutionChange();
  } else if (App._needsRestart) {
    // force reload as user has changed window size
    App._requestReloadForResolutionChange();
  } else {
    // update resolution values as no confirm or restart needed
    App._updateLastResolutionValues();
  }

  return true;
};

App._resizeAndScale = function() {
  Logger.module("APPLICATION").log("App._resizeAndScale");
  // resize canvas to match app size
  // engine bases its window size on the canvas size
  const $html = $("html");
  const $canvas = $(CONFIG.GAMECANVAS_SELECTOR);
  const width = Math.max(CONFIG.REF_WINDOW_SIZE.width, $html.width());
  const height = Math.max(CONFIG.REF_WINDOW_SIZE.height, $html.height());
  $canvas.width(width);
  $canvas.height(height);

  // set global scale
  CONFIG.globalScale = CONFIG.getGlobalScaleForResolution(CONFIG.resolution, width, height);

  // set css scales
  CONFIG.pixelScaleCSS = CONFIG.globalScale * window.devicePixelRatio;
  $html.removeClass("resource-scale-" + String(CONFIG.resourceScaleCSS).replace(".", "\."));
  CONFIG.resourceScaleCSS = 1;
  for (var resourceScale of Array.from(CONFIG.RESOURCE_SCALES)) {
    var scaleDiff = Math.abs(CONFIG.pixelScaleCSS - resourceScale);
    var currentScaleDiff = Math.abs(CONFIG.pixelScaleCSS - CONFIG.resourceScaleCSS);
    if ((scaleDiff < currentScaleDiff) || ((scaleDiff === currentScaleDiff) && (resourceScale > CONFIG.resourceScaleCSS))) {
      CONFIG.resourceScaleCSS = resourceScale;
    }
  }
  $html.addClass("resource-scale-" + String(CONFIG.resourceScaleCSS).replace(".", "\."));

  // html font size by global scale
  // css layout uses rems, which is based on html font size
  return $html.css("font-size", (CONFIG.globalScale * 10.0) + "px");
};

App._lastResolution = null;
App._lastResourceScaleEngine = null;
App._ignoreNextResolutionChange = false;
App._needsRestart = false;
App._updateLastResolutionValues = function() {
  App._lastResolution = CONFIG.resolution;
  return App._lastResourceScaleEngine = CONFIG.resourceScaleEngine;
};

App._confirmResolutionChange = function() {
  Logger.module("APPLICATION").log("App._confirmResolutionChange");
  const confirmData = {title: 'Do you wish to keep this viewport setting?'};
  if (App._needsRestart) {
    if (window.isDesktop) {
      confirmData.message = 'Warning: switching from your previous viewport to this viewport will require a restart!';
    } else {
      confirmData.message = 'Warning: switching from your previous viewport to this viewport will require a reload!';
    }
    if (ChatManager.getInstance().getStatusIsInBattle()) {
      confirmData.message += " You will be able to continue your game, but you may miss your turn!";
    }
  }
  const confirmDialogItemView = new ConfirmDialogItemView(confirmData);
  confirmDialogItemView.listenToOnce(confirmDialogItemView, 'confirm', function(){
    // update resolution after confirm
    App._lastResolution = CONFIG.resolution;
    if (App._needsRestart) {
      // defer to ensure this occurs after event resolves
      return _.defer(App._requestReloadForResolutionChange);
    } else {
      // update resource scale if no restart needed
      return App._lastResourceScaleEngine = CONFIG.resourceScaleEngine;
    }
  });
  confirmDialogItemView.listenToOnce(confirmDialogItemView, 'cancel', () => // defer to ensure this occurs after event resolves
  _.defer(function() {
    // reset resolution and don't prompt about changes
    App._ignoreNextResolutionChange = true;
    const res = App._lastResolution || CONFIG.RESOLUTION_DEFAULT;
    CONFIG.resolution = res;
    Storage.set("resolution", res);
    return App.onResize();
  }));

  // show confirm/cancel
  return NavigationManager.getInstance().showDialogView(confirmDialogItemView);
};

App._requestReloadForResolutionChangeId = "resolution_change";
App._requestReloadForResolutionChange = () => App.onRequestReload({
  id: App._requestReloadForResolutionChangeId,
  message: `Your viewport change requires a ${window.isDesktop ? "restart" : "reload"} to avoid any issues.`
});

App._cancelReloadRequestForResolutionChange = () => App.onCancelReloadRequest({
  id: App._requestReloadForResolutionChangeId
});

//
// ---- RELOAD ---- #
//

App._reloadRequestIds = [];

/*
  * Request a reload, optionally passing in a message and id (to avoid conflicts).
  **/
App.onRequestReload = function(event) {
  const requestId = (event != null ? event.id : undefined) || 0;
  if (!_.includes(App._reloadRequestIds, requestId)) {
    App._reloadRequestIds.push(requestId);
    if (App._reloadRequestIds.length === 1) {
      return App._reload(event != null ? event.message : undefined);
    }
  }
};

/*
  * Cancel a reload request, optionally passing in an id (to avoid conflicts).
  **/
App.onCancelReloadRequest = function(event) {
  const requestId = (event != null ? event.id : undefined) || 0;
  const index = _.indexOf(App._reloadRequestIds, requestId);
  if (index !== -1) {
    App._reloadRequestIds.splice(index, 1);
    if (App._reloadRequestIds.length === 0) {
      return App._cancelReload();
    }
  }
};

App._reload = function(message) {
  Logger.module("APPLICATION").log("App._reload");
  const promptDialogItemView = new PromptDialogItemView({title: `Please ${window.isDesktop ? "restart" : "reload"}!`, message});
  promptDialogItemView.listenTo(promptDialogItemView, 'cancel', function() {
    if (window.isDesktop) { return window.quitDesktop(); } else { return location.reload(); }
  });
  return NavigationManager.getInstance().showDialogView(promptDialogItemView);
};

App._cancelReload = function() {
  Logger.module("APPLICATION").log("App._cancelReload");
  return NavigationManager.getInstance().destroyDialogView();
};

//
// ---- Initialization Events ---- #
// Sequence of events started with App.start. Can pass options object.
//

// Pre-Start Event
App.on("before:start", function(options) {
  Logger.module("APPLICATION").log("----BEFORE START----");
  return App.$el = $("#app");
});


// Start Event
App.on("start", function(options) {
  Logger.module("APPLICATION").log("----START----");
  // set unload alert
  $(window).on('beforeunload', App.beforeunload.bind(App));

  // set initial selected scene
  let selectedScene = parseInt(Storage.get("selectedScene"));
  if (moment.utc().isAfter("2016-11-29") && moment.utc().isBefore("2017-01-01")) {
    selectedScene = SDK.CosmeticsLookup.Scene.Frostfire;
  }
  if (moment.utc().isAfter("2017-03-14") && moment.utc().isBefore("2017-05-01")) {
    selectedScene = SDK.CosmeticsLookup.Scene.Vetruvian;
  }
  if (moment.utc().isAfter("2017-07-01") && moment.utc().isBefore("2017-08-01")) {
    selectedScene = SDK.CosmeticsLookup.Scene.Shimzar;
  }
  if (moment.utc().isAfter("2017-12-01") && moment.utc().isBefore("2018-01-18")) {
    selectedScene = SDK.CosmeticsLookup.Scene.Frostfire;
  }
  if ((selectedScene != null) && !isNaN(selectedScene) && _.isNumber(selectedScene)) { CONFIG.selectedScene = selectedScene; }

  // set initial resolution
  const userResolution = parseInt(Storage.get("resolution"));
  if ((userResolution != null) && !isNaN(userResolution) && _.isNumber(userResolution)) { CONFIG.resolution = userResolution; }
  const userHiDPIEnabled = Storage.get("hiDPIEnabled");
  if (userHiDPIEnabled != null) {
    if (userHiDPIEnabled === "true") { CONFIG.hiDPIEnabled = true;
    } else if (userHiDPIEnabled === "false") { CONFIG.hiDPIEnabled = false; }
  }

  // load developer mode setting (admin only feature)
  const userDevModeEnabled = Storage.get("devModeEnabled");
  if (userDevModeEnabled != null) {
    CONFIG.DEV_MODE_ENABLED = userDevModeEnabled === "true" || userDevModeEnabled === true;
  }

  // update last resolution values to initial
  App._updateLastResolutionValues();

  // resize once for initial values
  App._resizeAndScale();

  // create a defered promise object for the loading and login process... sort of an anti-pattern but best for this use case
  App.managersReadyDeferred = new Promise.defer();

  // immediately connect the server status manager so we can get notified of any changes during the load process / on the login screen
  ServerStatusManager.getInstance().connect();

  // push a telemetry signal that a client is loading
  TelemetryManager.getInstance().setSignal("lifecycle","loading");
  TelemetryManager.getInstance().setSignal("session","not-logged-in");

  // authenticate defered, the isAuthed check must stay here so we can
  // clear the token in the event it is stale / isAuthed fails
  // the App._authenticationPromise below does not fire if there's no loading
  App._authenticationPromise = () => Session.isAuthenticated(Storage.get('token'))
    .then(function(isAuthed) {
      if (!isAuthed) {
        Storage.remove('token');
      }
      return isAuthed;
  });

  // VIEW/engine needs to be setup and cocos manages its own setup so we need to wait async
  Logger.module("APPLICATION").group("LOADING");
  App._loadingPromise = Scene.setup().then(function() {
    // update last resolution values to initial
    App._updateLastResolutionValues();

    // setup all events
    App.bindEvents();

    // load the package of resources that should always loaded
    return PackageManager.getInstance().loadPackage("alwaysloaded");
  }).then(() => // temporary bypass all loader
  Promise.resolve()

  /*
      * check if all assets should be loaded now or as needed
      * we want to know if the client has cached all resources for this version
      * we only care when not using the desktop client, on the production environment, and not loading all at start
      * if we need to cache all resources for this version, do a non allocating cache load first
      version_preloaded = Storage.get("version_preloaded")
      needs_non_allocating_cache_load = version_preloaded != process.env.VERSION && !window.isDesktop && !CONFIG.LOAD_ALL_AT_START && UtilsEnv.getIsInProduction()
      needs_non_allocating_cache_load = needs_non_allocating_cache_load && !App._queryStringParams['replayId']?
      if needs_non_allocating_cache_load || CONFIG.LOAD_ALL_AT_START
        * temporarily force disable the load all at start flag
        * this allows the preloader to setup as a major package
        * so that it gets loaded correctly before we load all
        load_all_at_start = CONFIG.LOAD_ALL_AT_START
        CONFIG.LOAD_ALL_AT_START = false
        * load preloader scene to show load of all resources
        return PackageManager.getInstance().loadAndActivateMajorPackage("preloader", null, null, () ->
          * reset load all at start flag
          CONFIG.LOAD_ALL_AT_START = load_all_at_start

          * hide loading dialog
          NavigationManager.getInstance().destroyDialogForLoad()

          * show load ui
          viewPromise = Scene.getInstance().showLoad()
          contentPromise = NavigationManager.getInstance().showContentView(new LoaderItemView())

          * once we've authenticated, show utility for loading/login
          * this way users can quit anytime on desktop, and logout or adjust settings while waiting for load
          App._authenticationPromise().then (isAuthed) ->
            if App.getIsLoggedIn() or window.isDesktop
              return NavigationManager.getInstance().showUtilityView(new UtilityLoadingLoginMenuItemView())
            else
              return Promise.resolve()

          return Promise.all([
            viewPromise,
            contentPromise
          ])
        ).then(() ->
          * load all resources
          return PackageManager.getInstance().loadPackage("all", null, ((progress) -> Scene.getInstance().getLoadLayer()?.showLoadProgress(progress)), needs_non_allocating_cache_load)
        ).then(() ->
          * set version assets were preloaded for
          if !window.isDesktop
            Storage.set("version_preloaded", process.env.VERSION)
        )
      else
        * no loading needed now
        return Promise.resolve()
      */).then(function() {
    // clear telemetry signal that a client is loading
    TelemetryManager.getInstance().clearSignal("lifecycle","loading");

    // end loading log group
    return Logger.module("APPLICATION").groupEnd();
  });

  // setup start promise
  App._startPromise = Promise.all([
    App._loadingPromise,
    App._authenticationPromise()
  ]);

  // goto main screen
  return App.main();
});

// get minimum browsers from Firebase
App.getMinBrowserVersions = function() {
  if (Storage.get("skipBrowserCheck")) { return Promise.resolve(); }
  return new Promise(function(resolve, reject) {
    const minBrowserVersionRef = new Firebase(process.env.FIREBASE_URL).child("system-status").child('browsers');

    const defaults = {
      "Chrome": 50,
      "Safari": 10,
      "Firefox": 57,
      "Edge": 15,
      "Mobile Safari": 10,
    };

    // create a timeout to skip check in case Firebase lags (so atleast user does not get stuck on black screen)
    const minBrowserVersionTimeout = setTimeout(function() {
      minBrowserVersionRef.off();
      return resolve(defaults);
    }
    , 5000);

    return minBrowserVersionRef.once('value', function(snapshot) {
      clearTimeout(minBrowserVersionTimeout);
      if (!snapshot.val()) {
        return resolve(defaults);
      } else {
        return resolve(snapshot.val());
      }
    });
  });
};

// check if given browser is valid when compared against list of allowed browsers
App.isBrowserValid = function(browserName, browserMajor, supportedBrowsers) {
  if (Storage.get("skipBrowserCheck")) { return true; }
  if (browserName === 'Electron') { return true; }

  if (Object.keys(supportedBrowsers).includes(browserName)) {
    return parseInt(browserMajor, 10) >= supportedBrowsers[browserName];
  } else {
    return false;
  }
};

App.generateBrowserHtml = function(browser, version) {
  if (browser === 'Chrome') {
    return `\
<p><a href='http://google.com/chrome'><strong>Google Chrome</strong> ${version} or newer.</a></p>\
`;
  } else if (browser === 'Safari') {
    return `\
<p><a href='https://www.apple.com/safari/'><strong>Apple Safari</strong> ${version} or newer.</a></p>\
`;
  } else if (browser === 'Firefox') {
    return `\
<p><a href='https://www.mozilla.org/firefox/'><strong>Mozilla Firefox</strong> ${version} or newer.</a></p>\
`;
  } else if (browser === 'Edge') {
    return `\
<p><a href='https://www.microsoft.com/en-us/windows/microsoft-edge'><strong>Microsoft Edge</strong> ${version} or newer.</a></p>\
`;
  }
};

// show some HTML saying the current browser is not supported if browser detection fails
App.browserTestFailed = function(browserName, browserVersion, supportedBrowsers) {
  let html = `\
<div style="margin:auto; position:absolute; height:50%; width:100%; top: 0px; bottom: 0px; font-size: 20px; color: white; text-align: center;">
  <p>Looks like your current browser is not supported.</p>
  <p>Your browser was detected as: ${browserName} version ${browserVersion}.</p>
  <p>Visit <a href='https://support.fheight.com' style="color: gray;">our support page</a> to submit a request for assistance.</p>
  <br>\
`;

  // dynamically create html containing list of support browsers
  Object.keys(supportedBrowsers).forEach(function(browser) {
    const version = supportedBrowsers[browser];
    return html += App.generateBrowserHtml(browser, version);
  });

  html += "</div>";
  $("#app-preloading").css({display:"none"});
  $("#app-content-region").css({margin:"auto", height:"50%", width: "50%"});
  return $("#app-content-region").html(html);
};

// ensure webgl is correctly running
App.glTest = function() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
};

App.glTestFailed = function() {
  let html;
  if (window.isDesktop) {
    html = `\
<div style="margin:auto; position:absolute; height:50%; width:100%; top: 0px; bottom: 0px; font-size: 20px; color: white; text-align: center;">
  <p>Looks like your video card is not supported.</p>
  <p>Ensure your video card drivers are up to date.</p>
  <p>Visit <a id='support-link' href='https://support.fheight.com' style="color: gray;">our support page</a> to submit a request for assistance.</p>
</div>\
`;
  } else {
    html = `\
<div style="margin:auto; position:absolute; height:50%; width:100%; top: 0px; bottom: 0px; font-size: 20px; color: white; text-align: center;">
  <p>Looks like WebGL is not enabled in your browser./p>
  <p>Visit the <a id='webgl-link' href='https://get.webgl.org/' style="color: gray;">WebGL test page</a> for more information.</p>
  <p>Visit <a id='support-link' href='https://support.fheight.com' style="color: gray;">our support page</a> to submit a request for assistance.</p>
</div>\
`;
  }
  $("#app-preloading").css({display:"none"});
  $("#app-content-region").css({margin:"auto", height:"50%", width: "50%"});
  $("#app-content-region").html(html);
  $("#webgl-link").click(function(e) {
    openUrl($(e.currentTarget).attr("href"));
    e.stopPropagation();
    return e.preventDefault();
  });
  return $("#support-link").click(function(e) {
    openUrl($(e.currentTarget).attr("href"));
    e.stopPropagation();
    return e.preventDefault();
  });
};

// show some HTML saying they are on an old client version
App.versionTestFailed = function() {
  let html;
  if (window.isDesktop) {
    html = `\
<div style="margin:auto; position:absolute; height:50%;  width:100%; top: 0px; bottom: 0px; font-size: 20px; color: white; text-align: center;">
  <p>Looks like you are running an old version of FHEIGHT.</p>
  <p>Exit and restart FHEIGHT to update to the latest version.</p>
  <p>Click <a id='reload-link' href='' style="color: gray;">here</a> to exit.</p>
</div>\
`;
  } else {
    html = `\
<div style="margin:auto; position:absolute; height:50%;  width:100%; top: 0px; bottom: 0px; font-size: 20px; color: white; text-align: center;">
  <p>Looks like you are running an old version of FHEIGHT.</p>
  <p>Click <a id='reload-link' href='' style="color: gray;">here</a> to refresh your browser to the latest version.</p>
</div>\
`;
  }
  $("#app-preloading").css({display:"none"});
  $("#app-content-region").css({margin:"auto", height:"50%", width: "50%"});
  $("#app-content-region").html(html);
  return $("#reload-link").click(function(e) {
    if (window.isDesktop) { return window.quitDesktop(); } else { return location.reload(); }
  });
};

// compare if process.env.VERSION is gte >= than provided minimum version
// if minimumVersion is undefined or null, we set to '0.0.0'
App.isVersionValid = function(minimumVersion) {
  Logger.module("APPLICATION").log(`${process.env.VERSION} >= ${minimumVersion || '0.0.0'}`);
  if (App._queryStringParams["replayId"]) {
    return true;
  } else {
    try {
      return semver.gte(process.env.VERSION, minimumVersion || '0.0.0');
    } catch (e) {
      return true;
    }
  }
};

// App.setup is the main entry function into Marionette app
// grabs configuration from server we're running on and call App.start()
App.setup = function() {
  // mark all requests with buld version
  $.ajaxSetup({
    headers: {
      "Client-Version": process.env.VERSION
    }
  });

  // check if it is a new user and we should redirect otherwise start as normal
  if (Landing.isNewUser() && Landing.shouldRedirect()) {
    return Landing.redirect();
  } else {
    return App.start();
  }
};

//
// ---- Application Start Sequence ---- #
//
App.getMinBrowserVersions()
.then(function(supportedBrowsers) {
  if (!App.isBrowserValid(userAgent.browser.name, userAgent.browser.major, supportedBrowsers)) {
    return App.browserTestFailed(userAgent.browser.name, userAgent.browser.major, supportedBrowsers);
  }

  if (!App.glTest()) {
    return App.glTestFailed();
  }

  App.minVersionRef = new Firebase(process.env.FIREBASE_URL).child("system-status").child('minimum_version');

  // wrap App.setup() in _.once() just to be safe from double calling
  App.setupOnce = _.once(App.setup);

  // create a timeout to skip version check in case Firebase lags (so atleast user does not get stuck on black screen)
  App.versionCheckTimeout = setTimeout(function() {
    App.minVersionRef.off();
    return App.setupOnce();
  }
  , 5000);

  // read minimum version from Firebase and perform check, if fails, show error html
  // otherwise start application as normal
  return App.minVersionRef.once('value', function(snapshot) {
    clearTimeout(App.versionCheckTimeout);
    if (!App.isVersionValid(snapshot.val())) {
      return App.versionTestFailed();
    } else {
      return App.setupOnce();
    }
  });
});

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}