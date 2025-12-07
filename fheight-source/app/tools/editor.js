/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const whenLocalizationReady = require('app/localization/index');
whenLocalizationReady.then(function(){

  const Logger = require("app/common/logger");
  const CONFIG = require("app/common/config");
  let EVENTS = require("app/common/event_types");
  const UtilsJavascript = require("app/common/utils/utils_javascript");
  const UtilsEnv = require("app/common/utils/utils_env");
  const PackageManager = require("app/ui/managers/package_manager.js");
  const DATA = (window.DATA = require("app/data"));
  const SDK = (window.SDK = require("app/sdk"));
  const RSX = (window.RSX = require("app/data/resources"));
  const PERF = (window.PERF = require("./performance"));
  const Scene = require("app/view/Scene");
  const NodeFactory = require("app/view/helpers/NodeFactory");
  const EventBus = require('app/common/eventbus');
  EVENTS = require('app/common/event_types');
  const Promise = require("bluebird");

  const _ = require("underscore");
  const moment = require("moment");
  const dat = require("./dat.gui");
  const saveAs = require("./FileSaver.min");

  const QuestType = require("app/sdk/quests/questTypeLookup");
  const Analytics = require("app/common/analytics");
  const GameDataManager = require("app/ui/managers/game_data_manager");
  const CrateManager = require("app/ui/managers/crate_manager");

  const Storage = require('app/common/storage');

  const i18next = require('i18next');




  /*
    Simple Editor.
  */

  const Editor = {};

  Editor.setup = function() {
    // change some gui defaults
    dat.GUI.DEFAULT_WIDTH = 300;
    dat.GUI.TEXT_CLOSED = "Close Editor";
    dat.GUI.TEXT_OPEN = "Open Editor";

    // inject css overrides
    let css = "";
    css += ".editor { position: absolute; float:left; z-index: 99999; pointer-events: none; margin: 0; padding: 0; width: 100%; height: 100%; top: 0; bottom: 0; left: 0; right: 0; }";
    css += ".dg.container { position: relative; float:left; padding: 0; height: 100%; display: flex; flex-flow: column-reverse nowrap; }";
    css += ".dg.container > ul { overflow: hidden; overflow-y: auto; background-color: black; pointer-events: auto; max-height: 100%; }";
    css += ".dg.container > ul::-webkit-scrollbar { width: 5px; background: #1a1a1a; }";
    css += ".dg.container > ul::-webkit-scrollbar-thumb { border-radius: 5px; background: #676767; }";
    css += ".dg.container > ul::-webkit-scrollbar-corner { height: 0; display: none; }";
    css += ".dg.container > ul.closed { padding-bottom: 0; }";
    css += ".dg.container > ul > .title { padding-right: 25px; }";
    css += ".dg.container .primary-button { background-color: #222222; text-align: center; padding: 5px; pointer-events: auto; position: relative; height: 30px; font-size: 12px; line-height: 20px; }";
    css += ".dg.container .primary-button:hover { background-color: #333333; }";
    css += ".dg.container .close-button { }";
    css += ".dg.container .close-button:hover { }";
    css += ".dg.container .save-button { background-color: #0C7ED8; font-size: 14px; }";
    css += ".dg.container .save-button:hover { background-color: #2499f3; }";
    css += ".dg.container .reload-css-button { }";
    css += ".dg.container .reload-css-button:hover { }";
    css += ".dg.container .resource-validate-button { }";
    css += ".dg.container .resource-validate-button:hover { }";
    css += ".dg .action-button { position: absolute; z-index: 9999; top: 1px; right: 0px; padding: 2px; width: 25px; height: 25px; color: white; font-size: 16px; text-shadow: none; }";
    css += ".dg .closed .action-button { display: none; }";
    css += ".dg .action-button:last-child { right: 0; }";
    css += ".dg .action-button:nth-last-child(2) { right: 20px; }";
    css += ".dg .action-button:nth-last-child(3) { right: 40px; }";
    css += ".dg .action-button:nth-last-child(4) { right: 60px; }";
    css += ".dg .action-button:nth-last-child(5) { right: 80px; }";
    css += ".dg.main {position: absolute; left: 0;}";
    css += ".dg.main > ul {}";
    css += ".dg.main > ul > li.folder > .dg > ul > li.folder > .dg > ul > li.title { background: rgba(76, 76, 76, 1);}";
    css += ".dg.selected { position: absolute; right: 0; width: 300px; padding-left: 3px;}";
    css += ".dg.selected > ul > li.title { position: relative; width: 300px; z-index: 1; }";
    css += ".dg.selected > ul > li.function:nth-child(2) { position: relative; width: 297px; z-index: 1; }";
    css += ".dg.selected > ul > li.function:nth-child(3) { position: relative; width: 297px; z-index: 1; }";
    css += ".dg.container > ul.closed > li:nth-child(4) { margin-top: 0; }";
    css += ".dg.selected > ul > li.folder > .dg > ul > li.title { background: rgba(76, 76, 76, 1);}";
    css += ".dg.new-data { position: relative; width: 200px !important; }";
    css += ".dg.new-data .close-button { display: none; }";
    css += ".dg .c { padding-right: 20px; }";
    css += ".dg .c select { color: black; max-width: 100%; }";
    css += ".dg .c input[type=text] { line-height: 10px; height: 18px; }";
    css += ".dg li { position: relative; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }";
    css += ".dg li.title { padding-right: 48px; }";
    css += ".dg li.folder { border-left: 0; }";
    css += ".dg li.folder > .dg { border-left: 6px solid rgba(0,0,0,0); margin-left: -2px; }";
    css += ".dg li.folder > .dg > ul > li.title { border-left: 3px solid #9D32E7; }";
    css += ".dg .function .property-name { width: 90%; }";
    css += ".editor-popover { border-radius: 0; text-shadow: none; z-index: 100000; background: rgb(12, 126, 216); }";
    css += ".editor-popover .popover-content { padding: 2px; }";
    css += ".editor-popover.left > .arrow:after { border-left-color: #0C7ED8; }";
    css += ".editor-popover.right > .arrow:after { border-right-color: #0C7ED8; }";
    dat.utils.css.inject(css);

    // create gui
    Editor.gui = new dat.GUI({ autoPlace: false, closed: true });
    Editor.$guiEl = Editor.addGUIContainerToDOM(Editor.gui);

    // listen to close button and remove selected
    Editor.$closeButton = Editor.$guiEl.find(".close-button");
    Editor.$closeButton.addClass("primary-button");
    Editor.$closeButton.on("click", function() {
      Editor.onClose();
      return true;
    });

    // setup button to start editor fully
    Editor.gui.add({ "Start": Editor.start }, "Start");

    // start gui closed
    return Editor.$closeButton.trigger("click");
  };

  Editor.start = function() {
    // clear container
    let card, cardFactionTypeName, cardId, id;
    if (Editor.$container != null) {
      Editor.$container.remove();
      Editor.$container = null;
    }

    // create gui
    Editor.gui = new dat.GUI({ autoPlace: false, closed: false });
    Editor.$guiEl = Editor.addGUIContainerToDOM(Editor.gui);

    // list data
    Editor.maxNumSelectables = CONFIG.MAX_FX_PER_EVENT;
    Editor.selectableKeyMatches = ["FX"];
    Editor.listData(DATA, Editor.gui, "", Editor.selectableKeyMatches);

    // create list of all usable fx for easy preview
    const fxFolder = Editor.gui.getFolder("FX");
    const usableFXFolder = fxFolder.addFolder("Previews");
    const usableFXByFolder = [];
    const addResourceAsUsableFXAsNeeded = function(resourceName) {
      const resource = RSX[resourceName];
      if ((resource != null) && !_.isFunction(resource) && _.isObject(resource)) {
        const imgPath = resource.img;
        const plistPath = resource.plist;
        const isAnimatedSprite = (imgPath != null) && (plistPath != null) && !(/[\/](?:units|tiles|icons)[\/]/i.test(imgPath));
        const isParticles = /particle|ptcl/i.test(resourceName) || ((imgPath != null) && /particle|ptcl/i.test(imgPath)) || ((plistPath != null) && /particle|ptcl/i.test(plistPath));
        if (isAnimatedSprite || isParticles) {
          let resourceFXData;
          if (isParticles) {
            resourceFXData = {
              plistFile: plistPath,
              type: "Particles"
            };
          } else {
            resourceFXData = {
              spriteIdentifier: resourceName
            };
          }
          const resourcePreview = {name: resourceName, fxData: resourceFXData};
          resourcePreview[resourceName] = () => Editor.previewFXData(resourcePreview.fxData);
          const folderName = (imgPath || plistPath).replace(/^resources[\/]/i, "").match(/(.*?)[\/].+?\./)[1];
          if (usableFXByFolder[folderName] == null) { usableFXByFolder[folderName] = []; }
          return usableFXByFolder[folderName].push(resourcePreview);
        }
      }
    };

    const resourceKeys = Object.keys(RSX);
    for (var resourceName of Array.from(resourceKeys)) {
      addResourceAsUsableFXAsNeeded(resourceName);
    }

    const folderNames = Object.keys(usableFXByFolder);
    for (var folderName of Array.from(folderNames)) {
      var usableFXInFolder = usableFXByFolder[folderName];
      var usableFXSubFolder = usableFXFolder.addFolder(folderName);
      usableFXInFolder = _.sortBy(usableFXInFolder, "name");
      for (var resourcePreview of Array.from(usableFXInFolder)) {
        usableFXSubFolder.add(resourcePreview, resourcePreview.name);
      }
    }

    // listen to close button and remove selected
    Editor.$closeButton = Editor.$guiEl.find(".close-button");
    Editor.$closeButton.addClass("primary-button");
    Editor.$closeButton.on("click", function() {
      Editor.onClose();
      return true;
    });

    // define buttons
    const buttons = {};

    // qa tools
    const qaFolder = Editor.gui.addFolder('QA Tools');
    const qaQuestFolder = qaFolder.addFolder("Quest Tools");
    const qaRankFolder = qaFolder.addFolder("Rank Tools");
    const qaProgressionFolder = qaFolder.addFolder("Progression Tools");
    const qaGauntletFolder = qaFolder.addFolder("Gauntlet Tools");
    const qaInventoryFolder = qaFolder.addFolder("Inventory Tools");
    const qaReferralsFolder = qaFolder.addFolder("Referral Program Tools");
    const qaChallengeFolder = qaFolder.addFolder("Challenge Tools");
    const qaCrateFolder = qaFolder.addFolder("Crate Tools");
    const qaBossFolder = qaFolder.addFolder("Boss Tools");
    const qaMiscFolder = qaFolder.addFolder("Misc Tools");

    const qaButtons = {};
    qaButtons["Add Gift Crate"] = function() {
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/gift_crate/winter2015",
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => CrateManager.getInstance().refreshGiftCrates()
      .then(() => alert("Success: Added Gift Crate")));
      return request.fail(response => alert("FAILED: Add Gift Crate failed\n" + response.responseJSON.message));
    };

    qaButtons["Clear Crate Progression"] = function() {
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/user_progression/last_crate_awarded_at",
        type: 'DELETE',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("Success: Cleared Crate Progression Info. Next WIN should give crate."));
      return request.fail(response => alert("FAILED: Clear Crate Progression failed\n" + response.responseJSON.message));
    };

    qaButtons["Add Common Cosmetic Chest"] = function() {
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/cosmetic_chest/" + SDK.CosmeticsChestTypeLookup.Common,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("Success: Added Cosmetic Chest"));
      return request.fail(response => alert("FAILED: Add Cosmetic Chest failed\n" + response.responseJSON.message));
    };

    qaButtons["Add Rare Cosmetic Chest"] = function() {
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/cosmetic_chest/" + SDK.CosmeticsChestTypeLookup.Rare,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("Success: Added Cosmetic Chest"));
      return request.fail(response => alert("FAILED: Add Cosmetic Chest failed\n" + response.responseJSON.message));
    };

    qaButtons["Add Epic Cosmetic Chest"] = function() {
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/cosmetic_chest/" + SDK.CosmeticsChestTypeLookup.Epic,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("Success: Added Cosmetic Chest"));
      return request.fail(response => alert("FAILED: Add Cosmetic Chest failed\n" + response.responseJSON.message));
    };

    qaButtons["Add Boss Chest"] = function() {
      let hoursBack = prompt("Hours back to give the chest:",0) || 0;
      hoursBack = parseInt(hoursBack);
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/cosmetic_chest/" + SDK.CosmeticsChestTypeLookup.Boss,
        type: 'POST',
        data: JSON.stringify({
          hours_back:hoursBack
        }),
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("Success: Added Cosmetic Chest"));
      return request.fail(response => alert("FAILED: Add Cosmetic Chest failed\n" + response.responseJSON.message));
    };

    qaButtons["Add Common Cosmetic Chest Key"] = function() {
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/cosmetic_chest_key/" + SDK.CosmeticsChestTypeLookup.Common,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("Success: Added Cosmetic Chest Key"));
      return request.fail(response => alert("FAILED: Add Cosmetic Chest Key failed\n" + response.responseJSON.message));
    };

    qaButtons["Add Rare Cosmetic Chest Key"] = function() {
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/cosmetic_chest_key/" + SDK.CosmeticsChestTypeLookup.Rare,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("Success: Added Cosmetic Chest Key"));
      return request.fail(response => alert("FAILED: Add Cosmetic Chest Key failed\n" + response.responseJSON.message));
    };

    qaButtons["Add Epic Cosmetic Chest Key"] = function() {
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/cosmetic_chest_key/" + SDK.CosmeticsChestTypeLookup.Epic,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("Success: Added Cosmetic Chest Key"));
      return request.fail(response => alert("FAILED: Add Cosmetic Chest Key failed\n" + response.responseJSON.message));
    };

    qaButtons["Add Boss Chest Key"] = function() {
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/cosmetic_chest_key/" + SDK.CosmeticsChestTypeLookup.Boss,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("Success: Added Cosmetic Chest Key"));
      return request.fail(response => alert("FAILED: Add Cosmetic Chest Key failed\n" + response.responseJSON.message));
    };

    const skins = SDK.CosmeticsFactory.cosmeticsForType(SDK.CosmeticsTypeLookup.CardSkin);
    const skinNames = _.map(skins, skin => skin.name);
    skins.unshift(-1);
    skinNames.unshift("Choose a skin");

    const qaAddSkin = {"Skin": skinNames[0]};
    qaAddSkin["Add Selected Skin"] = function() {
      const skinName = qaAddSkin["Skin"];
      const skinNameIndex = skinNames.indexOf(skinName);
      if (skinNameIndex !== -1) {
        const skinData = skins[skinNameIndex];
        if (skinData !== -1) {
          console.log(skinName, "with id", skinData.id, "and data", skinData);
          const request = $.ajax({
            url: process.env.API_URL + "/api/me/qa/cosmetic/" + skinData.id,
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json'
          });
          request.done(data => alert("Success: Added Skin " + skinName));
          return request.fail(response => alert("FAILED: Add Skin failed\n" + response.responseJSON.message));
        }
      }
    };

    qaButtons["Toggle Analytics in console"] = function() {
      Analytics.toggleLoggingEnabled();
      return alert("Analytics in console toggled");
    };

    const qaQuestButtons = {};
    qaQuestButtons["Reset Daily Quests"] = () => $.ajax({
      url: process.env.API_URL + "/api/me/qa/quests/current",
      type: 'DELETE',
      contentType: 'application/json',
      dataType: 'json'
    }).done(() => alert("done!"));
    qaQuestButtons["Set Daily Quests"] = function() {
      let promptText = "";
      // Generate list of quest name/ids to show in prompt
      if ((SDK.QuestFactory._questCache == null)) {
        SDK.QuestFactory._generateQuestCache();
      }

      for (var k in SDK.QuestFactory._questCache) {
        var quest = SDK.QuestFactory._questCache[k];
        if (quest.isCatchUp || quest.isBeginner || _.includes(quest.types,QuestType.ExcludeFromSystem)) {
          continue;
        } else {
          promptText += `\n${quest.getName()}: ${quest.getId()}`;
        }
      }
      promptText += "\nExample: 401,500";
      promptText += "\nEnter Quest Ids:";
      const dailyQuestString = prompt(promptText,0,0);

      // validate and parse
      const questIdStrings = dailyQuestString.split(",");

      if ((questIdStrings == null) || (questIdStrings.length !== 2)) {
        alert("Invalid usage.");
        return;
      }

      const questIds = [];
      for (var questIdString of Array.from(questIdStrings)) {
        var questId = parseInt(questIdString);
        if (Number.isNaN(questId) || (SDK.QuestFactory.questForIdentifier(questId) == null)) {
          alert("Invalid usage.");
          return;
        } else {
          questIds.push(questId);
        }
      }

      return $.ajax({
        url: process.env.API_URL + "/api/me/qa/quests/current",
        data: JSON.stringify({
          quest_ids:questIds
        }),
        type: 'PUT',
        contentType: 'application/json',
        dataType: 'json'
      }).done(() => alert("done!"));
    };
    qaQuestButtons["Set Quest Generation Back X Days"] = function() {
      let days_back = prompt("Enter how many days to set back quest generation (e.g. 2)",1) || 1;
      days_back = Math.max(days_back,1);
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/quests/generated_at",
        type: 'PUT',
        data: JSON.stringify({
          days_back
        }),
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(function(data){
        alert("Success: Set quest generation back " + days_back + " days\nReload required");
        return location.reload();
      });
      return request.fail(response => alert("FAILED: Set quest generation back failed\n" + response.responseJSON.message));
    };
    qaQuestButtons["Setup Frostfire 2016"] = function() {
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/quests/setup_frostfire_2016",
        type: 'POST',
        data: JSON.stringify({}),
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("DONE"));
      return request.fail(response => alert("FAILED: setup Frostfire 2016 quests failed\n" + response.responseJSON.message));
    };
    qaQuestButtons["Setup Seasonal quest for date"] = function() {
      const inOneMonthMoment = moment.utc().add(1,"month");
      const generateQuestsAtString = prompt("Enter Date to generate seasonal quest at\nExample: 2016-12-31",inOneMonthMoment.format("YYYY-MM-DD"));
      if ((generateQuestsAtString == null)) {
        alert("No entry, canceling generation");
        return;
      }

      const generateQuestsAtMoment = moment.utc(generateQuestsAtString);
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/quests/setup_seasonal_quest",
        type: 'POST',
        data: JSON.stringify({
          generate_quests_at:generateQuestsAtMoment.valueOf()
        }),
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("DONE"));
      return request.fail(response => alert("FAILED: Setup seasonal quest failed\n" + response.responseJSON.message));
    };

    qaQuestButtons["Setup Promo quest for date"] = function() {
      const inOneMonthMoment = moment.utc().add(1,"month");
      const generateQuestsAtString = prompt("Enter Date to generate promo quest at\nExample: 2016-12-31",inOneMonthMoment.format("YYYY-MM-DD"));
      if ((generateQuestsAtString == null)) {
        alert("No entry, canceling generation");
        return;
      }

      const generateQuestsAtMoment = moment.utc(generateQuestsAtString);
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/quests/setup_promotional_quest",
        type: 'POST',
        data: JSON.stringify({
          generate_quests_at:generateQuestsAtMoment.valueOf()
        }),
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("DONE"));
      return request.fail(response => alert("FAILED: Setup Promo quest failed\n" + response.responseJSON.message));
    };

    //  '/quests/setup_seasonal_quest'
    // router.put '/quests/current/progress', (req, res, next) ->
    qaQuestButtons["Progress quests by 1"] = function() {
      const questSlotString = prompt("Enter list of quest slots you wish to progress\nDaily quests: 0 and 1\nWelcome Back quest: 10\nExample for all: 0,1,10");
      let questSlots = questSlotString.split(",");
      questSlots = _.map(questSlots,slot => parseInt(slot));
      questSlots = _.filter(questSlots,slot => _.isNumber(slot));

      if ((questSlots == null) || (questSlots.length === 0)) {
        alert("No valid indices, aborting");
        return;
      }

      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/quests/current/progress",
        type: 'PUT',
        data: JSON.stringify({
          quest_slots:questSlots
        }),
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(function(data){
        //      alert("Success")
      });
      return request.fail(response => alert("FAILED:\n" + response.responseJSON.message));
    };

    const qaRankButtons = {};
    qaRankButtons["Clear Last Season Rank Rewards"] = function() {
      const season_key = moment().utc().subtract(1,'month').format("YYYY-MM");
      return $.ajax({
        url: process.env.API_URL + `/api/me/qa/rank/history/${season_key}/rewards`,
        type: 'DELETE',
        contentType: 'application/json',
        dataType: 'json'
      }).done(function(){
        const historyRequest = __guard__(__guard__(GamesManager.getInstance(), x1 => x1.historyRankingModelCollection), x => x.fetch());
        return historyRequest.done(() => alert("done!"));
      });
    };
    qaRankButtons["Set Last Season Top Rank"] = function() {
      const rank = prompt("Enter Rank",0) || 0;
      const season_key = moment().utc().subtract(1,'month').format("YYYY-MM");
      return $.ajax({
        url: process.env.API_URL + `/api/me/qa/rank/history/${season_key}/top_rank`,
        data: JSON.stringify({
          rank
        }),
        type: 'PUT',
        contentType: 'application/json',
        dataType: 'json'
      }).done(function(){
        const historyRequest = __guard__(__guard__(GamesManager.getInstance(), x1 => x1.historyRankingModelCollection), x => x.fetch());
        return historyRequest.done(() => alert("done!"));
      });
    };
    qaRankButtons["Set Current Season Rank"] = function() {
      const rank = prompt("Enter Rank",30) || 0;
      return $.ajax({
        url: process.env.API_URL + "/api/me/qa/rank",
        data: JSON.stringify({
          rank
        }),
        type: 'PUT',
        contentType: 'application/json',
        dataType: 'json'
      }).done(response => alert(`Current season rank set. \n \
Current season rank: ${response.rank}\n \
Current season top_rank: ${response.top_rank}`));
    };
    qaRankButtons["Set Current Season SRank Rating"] = function() {
      let rank_rating = prompt("Enter Rating (Max 5000,Min 100)",1500) || 1500;
      rank_rating = Math.max(rank_rating,100);
      rank_rating = Math.min(rank_rating,5000);
      return $.ajax({
        url: process.env.API_URL + "/api/me/qa/rank_rating",
        data: JSON.stringify({
          rank_rating
        }),
        type: 'PUT',
        contentType: 'application/json',
        dataType: 'json'
      }).done(response => alert(`Current season S-Rank Rating set. \n \
New ladder position: ${response.ladder_position}`));
    };
    qaRankButtons["Reset Current Season SRank Rating"] = () => $.ajax({
      url: process.env.API_URL + "/api/me/qa/rank_rating",
      type: 'DELETE',
      contentType: 'application/json',
      dataType: 'json'
    }).done(() => alert("Current season S-Rank Rating reset."));
    qaRankButtons["Get Current SRank Ladder Position"] = () => $.ajax({
      url: process.env.API_URL + "/api/me/qa/ladder_position",
      type: 'GET',
      contentType: 'application/json',
      dataType: 'json'
    }).done(response => alert(`Current season S-Rank Ladder Position:\n${response.user_ladder_position}`));
    qaRankButtons["Get Current Season SRank Info"] = () => $.ajax({
      url: process.env.API_URL + "/api/me/qa/rank_rating",
      type: 'GET',
      contentType: 'application/json',
      dataType: 'json'
    }).done(response => alert(`Current season rank info: \n \
S-Rank Rating: ${response.user_rating_data.rating}\n \
S-Rank Game Count: ${response.user_rating_data.srank_game_count}\n \
S-Rank Win Count: ${response.user_rating_data.srank_win_count}\n \
S-Rank Ladder Rating: ${response.user_rating_data.ladder_rating}\n \
S-Rank Position: ${response.user_rating_data.ladder_position}`));
    qaRankButtons["Use Current Season To Trigger Season Rollover"] = () => $.ajax({
      url: process.env.API_URL + "/api/me/qa/rank/history/last",
      type: 'DELETE',
      contentType: 'application/json',
      dataType: 'json'
    }).done(() => GamesManager.getInstance()._requestRankUpdateFromServer()
    .then(() => alert("Current season has been used to simulate a season rollover")));
    qaRankButtons["Add queue time for BRONZE"] = function() {
      const ms = prompt("Enter Rank",parseInt(Math.random()*100)*1000);
      return $.ajax({
        url: process.env.API_URL + "/api/me/qa/matchmaking/time_series/bronze/values",
        data: JSON.stringify({
          ms
        }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      }).done(() => alert("done!"));
    };

    const qaProgressionButtons = {};
    qaProgressionButtons["Set all Faction Win Counts to 99"] = () => $.ajax({
      url: process.env.API_URL + "/api/me/qa/faction_progression/set_all_win_counts_to_99",
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json'
    }).done(() => alert("done!"));
    qaProgressionButtons["Complete Progression"] = function() {
      NewPlayerManager.getInstance()._completeProgression();
      return alert("Complete: Navigate away from main menu and back");
    };

    qaProgressionButtons["Set All Factions To Level 10"] = function() {
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/faction_progression/set_all_levels_to_10",
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });
      alert("This may take quite a while!\nDismiss this and wait for success prompt");
      request.done(data => alert("Success: All factions set to level 10"));
      return request.fail(response => alert("FAILED: Set all factions to level 10 failed\n" + response.responseJSON.message));
    };

    const qaAddFactionLevel = {"Faction": SDK.FactionFactory.getAllPlayableFactions()[0].name};
    qaAddFactionLevel["Add"] = function() {
      const factionName = qaAddFactionLevel["Faction"];
      const factionData = _.find(SDK.FactionFactory.getAllPlayableFactions(), factionData => factionData.name === factionName);
      if (factionData != null) {
        const request = $.ajax({
          url: process.env.API_URL + "/api/me/qa/faction_progression/add_level",
          data: JSON.stringify({
            faction_id: factionData.id
          }),
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json'
        });
        alert("This may take quite a while!\nDismiss this and wait for success prompt");
        request.done(data => alert("Success: faction level increased"));
        return request.fail(response => alert("FAILED: adding faction level failed\n" + response.responseJSON.message));
      }
    };
    const qaAddFactionLevelFolder = qaProgressionFolder.addFolder("Add Faction Level");
    qaAddFactionLevelFolder.add(qaAddFactionLevel, "Faction", _.map(SDK.FactionFactory.getAllPlayableFactions(), factionData => factionData.name));
    qaAddFactionLevelFolder.add(qaAddFactionLevel, "Add");

    const qaGauntletButtons = {};
    qaGauntletButtons["Add Gauntlet Victory"] = function() {
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/gauntlet/progress",
        data: JSON.stringify({
          is_winner:true
        }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("Added Gauntlet Victory\nWins: " + data.win_count + "\nLosses: " + data.loss_count));
      return request.fail(response => alert("FAILED: Add Gauntlet Victory failed\n" + response.responseJSON.message));
    };
    qaGauntletButtons["Add Gauntlet Loss"] = function() {
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/gauntlet/progress",
        data: JSON.stringify({
          is_winner:false
        }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("Added Gauntlet Loss\nWins: " + data.win_count + "\nLosses: " + data.loss_count));
      return request.fail(response => alert("FAILED: Add Gauntlet Loss failed\n" + response.responseJSON.message));
    };
    qaGauntletButtons["Fill Gauntlet Deck"] = function() {
      alert("Please wait for confirmation dialogue (May take up to 10 seconds).");
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/gauntlet/fill_deck",
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("Gauntlet deck filled\n"));
      return request.fail(response => alert("FAILED: Filling Gauntlet deck\n" + response.responseJSON.message));
    };
    qaGauntletButtons["Remove Gauntlet General"] = function() {
      alert("Removing general from current Gauntlet Deck.");
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/gauntlet/current/general",
        type: 'DELETE',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("Current Gauntlet deck General has been removed\n"));
      return request.fail(response => alert("FAILED: Removing Gauntlet deck General\n" + response.responseJSON.message));
    };

    qaGauntletButtons["Delete Current Gauntlet Run"] = function() {
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/gauntlet/current",
        type: 'DELETE',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("Current Gauntlet run has been removed\n"));
      return request.fail(function(response) {
        console.log("QA Error:\n" + JSON.stringify(response,null,2));
        return alert("FAILED: Removing Gauntlet run \n" + JSON.stringify(response,null,2));
      });
    };
    qaGauntletButtons["Enable Gauntlet/Rift"] = function() {
      SDK.PlayModeFactory.playModeForIdentifier(SDK.PlayModes.Gauntlet).availableOnDaysOfWeek = null;
      SDK.PlayModeFactory.playModeForIdentifier(SDK.PlayModes.Gauntlet).gamesRequiredToUnlock = null;
      SDK.PlayModeFactory.playModeForIdentifier(SDK.PlayModes.Rift).gamesRequiredToUnlock = null;

      return alert("Gauntlet has been enabled LOCALLY.\nRefreshing will clear this change.");
    };

    const qaReferralButtons = {};
    qaReferralButtons["Set Referring Username"] = function() {

      const username = prompt('enter username');
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/referrals/mark",
        data: JSON.stringify({
          username
        }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("Processed referral user."));
      return request.fail(response => alert("FAILED: Processed referral \n" + response.responseJSON.message));
    };
    qaReferralButtons["Add Referral SILVER Event"] = function() {

      const eventType = "silver";
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/referrals/events",
        data: JSON.stringify({
          event_type:eventType
        }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert(`Processed referral event '${eventType}'.`));
      return request.fail(response => alert("FAILED: Processed referral event\n" + response.responseJSON.message));
    };
    qaReferralButtons["Add Referral GOLD Event"] = function() {

      const eventType = "gold";
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/referrals/events",
        data: JSON.stringify({
          event_type:eventType
        }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert(`Processed referral event '${eventType}'.`));
      return request.fail(response => alert("FAILED: Processed referral event\n" + response.responseJSON.message));
    };

    const qaInventoryButtons = {};
    qaInventoryButtons["Fill Collection"] = function() {
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/inventory/fill_collection",
        data: JSON.stringify({}),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });
      alert("This may take quite a while!\nDismiss this and wait for success prompt");
      request.done(data => alert("Done!"));
      return request.fail(response => alert("FAILED: \n" + response.responseJSON.message));
    };
    qaInventoryButtons["Add X Gold"] = function() {
      let amount = prompt("Gold amount to add:",100) || 100;
      amount = parseInt(amount);
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/inventory/gold",
        data: JSON.stringify({
          amount
        }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });

      request.done(data => alert(`Added ${amount} Gold!`));
      return request.fail(response => alert("FAILED: Adding Gold\n" + response.responseJSON.message));
    };
    qaInventoryButtons["Add X Spirit"] = function() {
      let amount = prompt("Spirit amount to add:",900) || 900;
      amount = parseInt(amount);
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/inventory/spirit",
        data: JSON.stringify({
          amount
        }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });


      request.done(data => alert(`Added ${amount} Spirit!`));
      return request.fail(response => alert("FAILED: Adding Spirit\n" + response.responseJSON.message));
    };

    qaInventoryButtons["Add X Diamond"] = function() {
      let amount = prompt("Diamond amount to add:", 450) || 450;
      amount = parseInt(amount);
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/inventory/premium",
        data: JSON.stringify({
          amount
        }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });


      request.done(data => alert(`Added ${amount} Diamond!`));
      return request.fail(response => alert("FAILED: Adding Diamond\n" + response.responseJSON.message));
    };

    qaInventoryButtons["Add Rift Ticket"] = function() {
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/inventory/rift_ticket",
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });

      request.done(data => alert("Added 1 Rift Ticket!"));
      return request.fail(response => alert("FAILED: Adding Rift Ticket\n" + response.responseJSON.message));
    };
    qaInventoryButtons["Add 3x Rare"] = function(){

      let factionId = prompt("Enter Faction:",1) || 1;
      factionId = parseInt(factionId);

      let countToPop = prompt("Remove Any:",0) || 0;
      countToPop = parseInt(countToPop);

      const allCommonCards = _.filter(__guard__(GameDataManager.getInstance().visibleCardsCollection, x => x.models), c => (c.get("factionId") === factionId) && (c.get("rarityId") === SDK.Rarity.Rare));
      const allCommonCardIds = _.map(allCommonCards,c => c.get("id"));
      let cardIds = _.map(allCommonCardIds, c => [c,c,c]);
      cardIds = _.flatten(cardIds);

      if (countToPop > 0) {
        _.times(countToPop, () => cardIds.pop());
      }

      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/inventory/cards",
        data: JSON.stringify({
          card_ids:cardIds
        }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });
      alert("This may take quite a while!\nDismiss this and wait for success prompt");
      request.done(data => alert("Done!"));
      return request.fail(response => alert("FAILED: \n" + response.responseJSON.message));
    };

    qaInventoryButtons["Craft Orb Set with Spirit"] = function(){
      let cardSetId;
      let cardSetPromptStr = "Enter card set id:";
      for (var cardSetKey in SDK.CardSet) {
        cardSetId = SDK.CardSet[cardSetKey];
        cardSetPromptStr += `\n${SDK.CardSetFactory.cardSetForIdentifier(cardSetId).name}: ${cardSetId}`;
      }
      cardSetId = prompt(cardSetPromptStr) || null;
      if ((cardSetId == null)) {
        alert("No Card Set Selected");
        return;
      }
      cardSetId = parseInt(cardSetId);

      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/inventory/card_set_with_spirit",
        data: JSON.stringify({
          card_set_id:cardSetId
        }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("Purchased card set with spirit"));
      return request.fail(function(response) {
        let errorStr = __guard__(response != null ? response.responseJSON : undefined, x => x.message);
        if ((errorStr == null)) {
          errorStr = JSON.stringify(response,null,2);
        }
        errorStr = JSON.stringify(errorStr);

        return alert("FAILED: \n" + errorStr);
      });
    };

    qaInventoryButtons["Delete unused cards in inventory"] = function(){
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/inventory/unused",
        type: 'DELETE',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("All unused cardsremoved from inventory!"));
      return request.fail(response => alert("FAILED: \n" + response.responseJSON.message));
    };

    qaInventoryButtons["Delete Bloodbound inventory"] = function(){
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/inventory/bloodborn",
        type: 'DELETE',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("All Bloodbound cards and packs removed from inventory!"));
      return request.fail(response => alert("FAILED: \n" + response.responseJSON.message));
    };

    qaInventoryButtons["Delete Ancient Bonds inventory"] = function(){
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/inventory/unity",
        type: 'DELETE',
        contentType: 'application/json',
        dataType: 'json'
      });
      request.done(data => alert("All ancient bonds cards and packs removed from inventory!"));
      return request.fail(response => alert("FAILED: \n" + response.responseJSON.message));
    };

    const qaChallengeButtons = {};
    qaChallengeButtons["Enable Sandbox"] = function() {
      SDK.PlayModeFactory.playModeForIdentifier(SDK.PlayModes.Sandbox).isHiddenInUI = false;
      return alert("Sandbox is now enabled.");
    };
    qaChallengeButtons["Set my daily challenge completion time"] = function() {
      let relativeDays = prompt("Set daily challenge's last completion time X days relative to today:\n" +
          "Negative numbers for past, 0 for today, positive numbers for the future",0
      );
      relativeDays = parseInt(relativeDays);
      const newCompletionMoment = moment.utc().add(relativeDays,"day");
      return $.ajax({
        url: process.env.API_URL + "/api/me/qa/daily_challenge/completed_at",
        data: JSON.stringify({
          completed_at:newCompletionMoment.toDate()
        }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      }).done(function(){
        QuestsManager.getInstance().dailyChallengesLastCompletedAtModel.fetch();
        return alert("done!");
      });
    };
    qaChallengeButtons["Play daily challenge for date"] = function() {
      const dailyChallengeDateString = prompt("Enter date in to load daily challenge for:\n" +
          "This won't count as completing a daily challenge (no reward no daily challenge has already been completed\n" +
          "Format: YYYY-MM-DD"
      ,moment.utc().format("YYYY-MM-DD"));

      const dailyChallengeRef = new Firebase(process.env.FIREBASE_URL + "/daily-challenges/" + dailyChallengeDateString);
      return dailyChallengeRef.once("value",  function(dailyChallengeSnapshot) {
        if ((dailyChallengeSnapshot == null) || (dailyChallengeSnapshot.val() == null)) {
          alert("No challenge found for date provided: " + dailyChallengeDateString);
          return;
        } else {
          const dailyChallengeData = dailyChallengeSnapshot.val();
          // Insert a date key on the daily challenge to identify it when marking as QA
          dailyChallengeData.dateKey = dailyChallengeDateString;
          SDK.ChallengeRemote.loadAndCreateFromModelData(dailyChallengeData)
          .then(function(challenge) {
            challenge._generatedForQA = true;
            return EventBus.getInstance().trigger(EVENTS.start_challenge, challenge);
          });
          return;
        }
      });
    };
    qaChallengeButtons["Mark current daily challenge as passed QA"] = function() {
      const gameSession = SDK.GameSession.getInstance();
      if (!gameSession.isDailyChallenge()) {
        alert("Failed: Not currently in a daily challenge");
        return;
      }

      const dailyChallenge = gameSession.getChallenge();
      if ((dailyChallenge == null) || (dailyChallenge.dateKey == null)) {
        alert("Failed: Current daily challenge was not loaded from QA Tool\n" +
          "Use QA Tool 'Play daily challenge for date' to mark a challenge as QA passed");
        return;
      }

      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/daily_challenge/passed_qa",
        data: JSON.stringify({
          date_key:dailyChallenge.dateKey
        }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });


      request.done(data => alert("Success: Daily challenge marked as passing QA"));
      return request.fail(response => alert(`Failed: Daily challenge not set as passed qa\n${error.toString()}`));
    };

    qaChallengeButtons["Get list of daily challenges"] = function() {
      const startDateString = prompt("Enter start date of range:\nFormat: YYYY-MM-DD",moment.utc().format("YYYY-MM-DD"));
      const startDateMoment = moment.utc(startDateString);
      let numDays = prompt("Enter num days to search:",10);
      numDays = parseInt(numDays);

      const allDateKeys = [];
      for (let i = 0, end = numDays, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
        allDateKeys[i] = startDateMoment.clone().add(i,"days").format("YYYY-MM-DD");
      }

      const challengeResults = {};

      return Promise.each(allDateKeys, dateKey => new Promise(function(resolve,reject) {
        const dailyChallengeRef = new Firebase(process.env.FIREBASE_URL + "/daily-challenges/" + dateKey);
        return dailyChallengeRef.once('value', function(dataSnapshot) {
          challengeResults[dateKey] = dataSnapshot.val();
          return resolve({
            dateKey,
            challenge:dataSnapshot.val()
          });
        }
        , error => reject("fb error"));})).then(function(challengesData) {
        alert("Challenges: (This is also printed to console)\n" +
          JSON.stringify(challengeResults,null,2));
        return console.log(JSON.stringify(challengeResults,null,2));
      });
    };

    const qaBossButtons = {};

    // cache all boss cards
    const btBossNames = [];
    const btBossCardIds = [];
    let factionId = SDK.Factions.Boss;
    const generalIds = SDK.FactionFactory.generalIdsForFaction(factionId);
    for (id of Array.from(generalIds)) {
      var sdkCard = SDK.GameSession.getCardCaches().getCardById(id);
      btBossNames.push(sdkCard.getName());
      btBossCardIds.push(sdkCard.getId());
    }
    btBossNames.unshift("Choose a Boss");
    btBossCardIds.unshift(-1);

    const btSetupBossEvent = {"Boss": btBossNames[0], "Delta Time (ms)": 0};
    btSetupBossEvent['Create/Replace QA Boss Event'] = function() {
      const bossName = btSetupBossEvent["Boss"];
      if (bossName !== btBossNames[0]) {
        const bossIndex = _.indexOf(btBossNames, bossName);
        if (bossIndex !== -1) {
          const bossCardId = btBossCardIds[bossIndex];
          if ((bossCardId != null) && (bossCardId !== btBossCardIds[0])) {
            let adjustedMs = btSetupBossEvent["Delta Time (ms)"];
            if (isNaN(adjustedMs) || !_.isNumber(adjustedMs)) { adjustedMs = 0; }
            const request = $.ajax({
              url: process.env.API_URL + "/api/me/qa/boss_event",
              data: JSON.stringify({
                adjusted_ms: adjustedMs,
                boss_id: bossCardId
              }),
              type: 'PUT',
              contentType: 'application/json',
              dataType: 'json'
            });

            request.done(data => alert("Success: QA Boss Event Created (re-enter main menu to update UI)"));
            return request.fail(response => alert(`Failed: Could not create QA Boss Event \n${error.toString()}`));
          }
        }
      }
    };
    const btSetupBossEventFolder = qaBossFolder.addFolder("Setup QA Boss Event");
    btSetupBossEventFolder.add(btSetupBossEvent, "Boss", btBossNames);
    btSetupBossEventFolder.add(btSetupBossEvent, "Delta Time (ms)").step(1);
    btSetupBossEventFolder.add(btSetupBossEvent, "Create/Replace QA Boss Event");

    qaBossButtons['Remove QA Boss Event'] = function() {

      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/boss_event",
        type: 'DELETE',
        contentType: 'application/json',
        dataType: 'json'
      });

      request.done(data => alert("Success: QA Boss Event Removed (re-enter main menu to update UI)"));
      return request.fail(response => alert(`Failed: Could not remove QA Boss Event \n${error.toString()}`));
    };
    qaBossFolder.add(qaBossButtons, "Remove QA Boss Event");

    qaBossButtons['Reset Boss Rewards'] = function() {
      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/boss_event/rewards",
        type: 'DELETE',
        contentType: 'application/json',
        dataType: 'json'
      });

      request.done(data => alert("Success: Boss Rewards Removed"));
      return request.fail(response => alert(`Failed: Could not remove Boss Rewards \n${error.toString()}`));
    };
    qaBossFolder.add(qaBossButtons, "Reset Boss Rewards");

    const qaMiscButtons = {};

    // cache all achievements
    const mtAchievementNames = [];
    const mtAchievementIds = [];

    const enabledAchievementsMap = SDK.AchievementsFactory.getEnabledAchievementsMap();
//    enabledAchievementsDescription = "Enter one of the following ids to reset and mark achievement as completed:\n"
    for (var k in enabledAchievementsMap) {
//      enabledAchievementsDescription += v.getTitle() + ": " + v.id + "\n"
      var v = enabledAchievementsMap[k];
      mtAchievementNames.push(v.getTitle());
      mtAchievementIds.push(v.id);
    }

    mtAchievementNames.unshift("Choose Achievement");
    mtAchievementIds.unshift(-1);


//    btSetupBossEventFolder = qaBossFolder.addFolder("Setup QA Boss Event")
//    btSetupBossEventFolder.add(btSetupBossEvent, "Boss", btBossNames)
//    btSetupBossEventFolder.add(btSetupBossEvent, "Delta Time (ms)").step(1)
//    btSetupBossEventFolder.add(btSetupBossEvent, "Create/Replace QA Boss Event")

    const mtSetupAchievementReset = {"Achievements": mtAchievementNames[0]};
    const mtSetupAchievementResetFolder = qaMiscFolder.addFolder('Reset And Complete Achievement');

    mtSetupAchievementReset['Submit'] = function() {
//      enabledAchievementsMap = SDK.AchievementsFactory.getEnabledAchievementsMap()
//      enabledAchievementsDescription = "Enter one of the following ids to reset and mark achievement as completed:\n"
//      for k,v of enabledAchievementsMap
//        enabledAchievementsDescription += v.getTitle() + ": " + v.id + "\n"

//      achievementIdToReset = prompt(enabledAchievementsDescription)
      const achievementNameToReset = mtSetupAchievementReset["Achievements"];
      const achievementIdToReset = mtAchievementIds[_.indexOf(mtAchievementNames,achievementNameToReset)];


      if ((SDK.AchievementsFactory.achievementForIdentifier(achievementIdToReset) == null)) {
        alert("No achievement id matching: " + achievementIdToReset);
        return;
      }

      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/achievement/reset_and_complete",
        data: JSON.stringify({
          achievement_id:achievementIdToReset
        }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });


      request.done(data => alert("Success: Re-enter main menu to see achievement"));
      return request.fail(function(response) {
        console.dir(response);
        return alert(`Failed: Could not reset achievement:\n${error.responseJSON.message}`);
      });
    };
    mtSetupAchievementResetFolder.add(mtSetupAchievementReset, "Achievements", mtAchievementNames);
    mtSetupAchievementResetFolder.add(mtSetupAchievementReset, "Submit");


    qaMiscButtons['Set up account for prismatic backfill'] = function() {
      let numOrbs = prompt("Number of spirit orbs to add:\n",0);
      numOrbs = parseInt(numOrbs);

      const confirmation = prompt("Please enter 'confirm' to proceed");
      if (confirmation !== "confirm") {
        alert("Abandoning backfill set up");
        return;
      }

      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/migration/prismatic_backfill",
        data: JSON.stringify({
          num_orbs:numOrbs
        }),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
      });

      request.done(data => alert("Success: Reload FHEIGHT to trigger prismatic backfill"));
      return request.fail(function(response) {
        console.dir(response);
        return alert(`Failed: Could set up backfill:\n${response.responseJSON.message}`);
      });
    };

    qaMiscButtons['Fake Twitch Drop'] = function() {};


    qaMiscButtons['Fake Twitch Commerce'] = function() {};

    qaMiscButtons['Change Language'] = function() {
      let languageKey = prompt("Language key to change to:\n",'en');
      if (languageKey === "") {
        languageKey = null;
      }

      if ((languageKey === "cimode") && (languageKey !== null)) {
        return i18next.changeLanguage(languageKey, function(err,t) {
          if (err != null) {
            alert("Something went wrong changing language:\n" + err);
            return;
          }

          alert("Language change complete");
          Storage.set('preferredLanguageKey', languageKey);
          EventBus.getInstance().trigger(EVENTS.request_reload,{id: "language_changed", message: "Language Changed.  Please restart."});
        });
      } else if (languageKey !== null) {
        return i18next.loadLanguages(languageKey, function(err,t) {
          if (err != null) {
            alert("Something went wrong loading language:\n" + err);
            return;
          }
          Storage.set('preferredLanguageKey', languageKey);
          return EventBus.getInstance().trigger(EVENTS.request_reload,{id: "language_changed", message: "Language Changed.  Please restart."});
//          i18next.changeLanguage(languageKey, (err,t) ->
//            if (err?)
//              alert("Something went wrong changing language:\n" + err)
//              return
//
//            alert("Language load and change complete")
//            return
//          )
        });
      } else {
        return alert("Null language key, aborting language change");
      }
    };

    qaMiscButtons['Reset account and reload'] = function() {

      const confirmation = prompt("Please enter 'confirm' to proceed resetting account");
      if (confirmation !== "confirm") {
        alert("Abandoning account reset");
        return;
      }

      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/account/reset",
        type: 'put',
        contentType: 'application/json',
        dataType: 'json'
      });

      request.done(function(data){
        alert("Please reload");
        return location.reload();
      });
      return request.fail(response => alert(`Failed: Could not reset account:\n${response.responseJSON.message}`));
    };

    qaMiscButtons['Convert rift run to have duplicate card choices'] = function() {

      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/rift/duplicates",
        type: 'put',
        contentType: 'application/json',
        dataType: 'json'
      });

      request.done(data => alert("Any rift run with card choices now have duplicates"));
      return request.fail(response => alert(`Failed: Could not create rift duplicate card choices:\n${response.responseJSON.message}`));
    };

    qaMiscButtons['Retrieve Charge Log'] = function() {

      const request = $.ajax({
        url: process.env.API_URL + "/api/me/qa/shop/charge_log",
        type: 'get',
        contentType: 'application/json',
        dataType: 'json'
      });

      request.done(function(data){
        alert(JSON.stringify(data,null,2));
        return console.log(JSON.stringify(data,null,2));
      });
      return request.fail(response => alert(`Failed: Could not retrieve user charge log:\n${response.responseJSON.message}`));
    };

    // User qa buttons
    qaQuestFolder.add(qaQuestButtons,"Reset Daily Quests");
    qaQuestFolder.add(qaQuestButtons,"Set Daily Quests");
    qaQuestFolder.add(qaQuestButtons,"Set Quest Generation Back X Days");
    qaQuestFolder.add(qaQuestButtons,"Setup Frostfire 2016");
    qaQuestFolder.add(qaQuestButtons,"Setup Seasonal quest for date");
    qaQuestFolder.add(qaQuestButtons,"Setup Promo quest for date");
    qaQuestFolder.add(qaQuestButtons,"Progress quests by 1");

    // Rank qa buttons
    //  qaRankFolder.add(qaRankButtons,"Clear Last Season Rank Rewards")
    //  qaRankFolder.add(qaRankButtons,"Set Last Season Top Rank")# No current use
    qaRankFolder.add(qaRankButtons,"Set Current Season Rank");
    qaRankFolder.add(qaRankButtons,"Use Current Season To Trigger Season Rollover");
    qaRankFolder.add(qaRankButtons,"Set Current Season SRank Rating");
    qaRankFolder.add(qaRankButtons,"Reset Current Season SRank Rating");
    qaRankFolder.add(qaRankButtons,"Get Current SRank Ladder Position");
    qaRankFolder.add(qaRankButtons,"Get Current Season SRank Info");
    // qaFolder.add(qaRankButtons,"Add queue time for BRONZE")

    // Progression QA buttons
    qaProgressionFolder.add(qaProgressionButtons,"Set all Faction Win Counts to 99");
    qaProgressionFolder.add(qaProgressionButtons,"Complete Progression");
    qaProgressionFolder.add(qaProgressionButtons,"Set All Factions To Level 10");

    // Gauntlet QA buttons
    qaGauntletFolder.add(qaGauntletButtons,"Add Gauntlet Victory");
    qaGauntletFolder.add(qaGauntletButtons,"Add Gauntlet Loss");
    qaGauntletFolder.add(qaGauntletButtons,"Fill Gauntlet Deck");
    qaGauntletFolder.add(qaGauntletButtons,"Remove Gauntlet General");
    qaGauntletFolder.add(qaGauntletButtons,"Enable Gauntlet/Rift");
    qaGauntletFolder.add(qaGauntletButtons,"Delete Current Gauntlet Run");

    // Referrals QA buttons
    qaReferralsFolder.add(qaReferralButtons,"Set Referring Username");
    qaReferralsFolder.add(qaReferralButtons,"Add Referral SILVER Event");
    qaReferralsFolder.add(qaReferralButtons,"Add Referral GOLD Event");

    // Inventory QA buttons
    qaInventoryFolder.add(qaInventoryButtons,"Fill Collection");
    qaInventoryFolder.add(qaInventoryButtons,"Add X Gold");
    qaInventoryFolder.add(qaInventoryButtons,"Add X Spirit");
    qaInventoryFolder.add(qaInventoryButtons,"Add X Diamond");
    qaInventoryFolder.add(qaInventoryButtons,"Add 3x Rare");
    qaInventoryFolder.add(qaInventoryButtons,"Delete unused cards in inventory");
    qaInventoryFolder.add(qaInventoryButtons,"Add Rift Ticket");
    qaInventoryFolder.add(qaInventoryButtons,"Craft Orb Set with Spirit");
    qaInventoryFolder.add(qaInventoryButtons,"Delete Bloodbound inventory");
    qaInventoryFolder.add(qaInventoryButtons,"Delete Ancient Bonds inventory");

    // skins
    const qaAddSkinFolder = qaInventoryFolder.addFolder("Add Skin");
    qaAddSkinFolder.add(qaAddSkin, "Skin", skinNames);
    qaAddSkinFolder.add(qaAddSkin, "Add Selected Skin");

    // Challenge QA buttons
    qaChallengeFolder.add(qaChallengeButtons,"Enable Sandbox");
    qaChallengeFolder.add(qaChallengeButtons,"Set my daily challenge completion time");
    qaChallengeFolder.add(qaChallengeButtons, "Play daily challenge for date");
    qaChallengeFolder.add(qaChallengeButtons, "Mark current daily challenge as passed QA");
    qaChallengeFolder.add(qaChallengeButtons, "Get list of daily challenges");

    // crates
    qaCrateFolder.add(qaButtons,"Add Gift Crate");
    qaCrateFolder.add(qaButtons,"Clear Crate Progression");
    qaCrateFolder.add(qaButtons,"Add Common Cosmetic Chest");
    qaCrateFolder.add(qaButtons,"Add Common Cosmetic Chest Key");
    qaCrateFolder.add(qaButtons,"Add Rare Cosmetic Chest");
    qaCrateFolder.add(qaButtons,"Add Rare Cosmetic Chest Key");
    qaCrateFolder.add(qaButtons,"Add Epic Cosmetic Chest");
    qaCrateFolder.add(qaButtons,"Add Epic Cosmetic Chest Key");
    qaCrateFolder.add(qaButtons,"Add Boss Chest");
    qaCrateFolder.add(qaButtons,"Add Boss Chest Key");

    // Analytics
    qaFolder.add(qaButtons,"Toggle Analytics in console");

    // Misc tools
//    qaMiscFolder.add(qaMiscButtons, "Reset And Complete Achievement")
    qaMiscFolder.add(qaMiscButtons, "Fake Twitch Drop");
    qaMiscFolder.add(qaMiscButtons, "Fake Twitch Commerce");
    qaMiscFolder.add(qaMiscButtons, "Set up account for prismatic backfill");
    qaMiscFolder.add(qaMiscButtons, "Reset account and reload");
    qaMiscFolder.add(qaMiscButtons, "Convert rift run to have duplicate card choices");
    qaMiscFolder.add(qaMiscButtons, "Retrieve Charge Log");
    qaMiscFolder.add(qaMiscButtons, "Change Language");

    // game tools
    const gtFolder = Editor.gui.addFolder('Game Tools');

    // game tools: private method to bypass game session validation and allow any action to be executed
    const gtExecuteActionWithoutValidation = function(action) {
      const validators = SDK.GameSession.getInstance().getValidators();
      SDK.GameSession.getInstance().setValidators([]);
      SDK.GameSession.getInstance().executeAction(action);
      return SDK.GameSession.getInstance().setValidators(validators);
    };

    // game tools: cache all card names and ids
    let gtCards = [];
    const gtCardFactionTypeNames = [];
    const gtCardIds = [];
    for (var groupName in SDK.Cards) {
      var group = SDK.Cards[groupName];
      if (_.isObject(group)) {
        for (var cardName in group) {
          cardId = group[cardName];
          card = SDK.GameSession.getCardCaches().getCardById(cardId);
          if (card != null) {
            gtCards.push(card);
          }
        }
      }
    }

    gtCards = _.sortBy(gtCards, function(card) {
      factionId = card.getFactionId();
      const factionData = SDK.FactionFactory.factionForIdentifier(factionId);
      let sortVal = factionData.devName || factionData.name || "z";
      if (card instanceof SDK.Unit) {
        if (card.getIsGeneral()) {
          sortVal += "1";
        } else if (card.getRaceId() === SDK.Races.BattlePet) {
          sortVal += "2";
        } else {
          sortVal += "3";
        }
      } else if (card instanceof SDK.Tile) { sortVal += "4";
      } else if (card instanceof SDK.Spell) { sortVal += "5";
      } else if (card instanceof SDK.Artifact) { sortVal += "6"; }
      sortVal += card.getName();
      return sortVal;
    });

    for (card of Array.from(gtCards)) {
      cardId = card.getBaseCardId();
      gtCardIds.push(cardId);
      factionId = card.getFactionId();
      var factionData = SDK.FactionFactory.factionForIdentifier(factionId);
      cardFactionTypeName = (factionData.devName || factionData.name || "Unknown") + " / ";
      if (card instanceof SDK.Unit) {
        if (card.getIsGeneral()) {
          cardFactionTypeName += "general";
        } else if (card.getRaceId() === SDK.Races.BattlePet) {
          cardFactionTypeName += "battle pet";
        } else {
          cardFactionTypeName += "unit";
        }
      } else if (card instanceof SDK.Tile) {
        cardFactionTypeName += "tile";
      } else if (card instanceof SDK.Spell) {
        cardFactionTypeName += "spell";
      } else if (card instanceof SDK.Artifact) {
        cardFactionTypeName += "artifact";
      }
      cardFactionTypeName += " / " + card.getName();
      gtCardFactionTypeNames.push(cardFactionTypeName);
    }

    gtCards.unshift(-1);
    gtCardFactionTypeNames.unshift("Choose a card");
    gtCardIds.unshift(-1);

    // game tools: add or remove cards
    const gtAddCardToHand = {"Card": gtCardFactionTypeNames[0], "X": -1, "Y": -1, "Hand Slot": -1};
    gtAddCardToHand["Add Selected Card"] = function() {
      const player = SDK.GameSession.getInstance().getCurrentPlayer();
      cardFactionTypeName = gtAddCardToHand["Card"];
      if (cardFactionTypeName !== gtCardFactionTypeNames[0]) {
        const cardIndex = _.indexOf(gtCardFactionTypeNames, cardFactionTypeName);
        if (cardIndex !== -1) {
          card = gtCards[cardIndex];
          if (card != null) {
            const index = gtAddCardToHand["Hand Slot"];
            const x = gtAddCardToHand["X"];
            const y = gtAddCardToHand["Y"];
            if (index !== -1) {
              if (player.getDeck().getCardIndexInHandAtIndex(index) != null) {
                const removeCardFromHandAction = new SDK.RemoveCardFromHandAction(SDK.GameSession.getInstance(), index, player.getPlayerId());
                gtExecuteActionWithoutValidation(removeCardFromHandAction);
              }
              const putCardInHandAction = new SDK.PutCardInHandAction(SDK.GameSession.getInstance(), player.getPlayerId(), card.createNewCardData(), index);
              return gtExecuteActionWithoutValidation(putCardInHandAction);
            } else if ((x !== -1) && (y !== -1)) {
              if (card instanceof SDK.Unit) {
                const unitAtPosition = SDK.GameSession.getInstance().getBoard().getUnitAtPosition({x, y});
                if (unitAtPosition != null) {
                  const removeAction = new SDK.RemoveAction(SDK.GameSession.getInstance());
                  removeAction.setTarget(unitAtPosition);
                  gtExecuteActionWithoutValidation(removeAction);
                }
              }
              const applyCardToBoardAction = new SDK.ApplyCardToBoardAction(SDK.GameSession.getInstance(), player.getPlayerId(), x, y, card.createNewCardData());
              return gtExecuteActionWithoutValidation(applyCardToBoardAction);
            }
          }
        }
      }
    };
    gtAddCardToHand["Remove Any Card"] = function() {
      const player = SDK.GameSession.getInstance().getCurrentPlayer();
      const index = gtAddCardToHand["Hand Slot"];
      const x = gtAddCardToHand["X"];
      const y = gtAddCardToHand["Y"];
      if (index !== -1) {
        if (player.getDeck().getCardIndexInHandAtIndex(index) != null) {
          const removeCardFromHandAction = new SDK.RemoveCardFromHandAction(SDK.GameSession.getInstance(), index, player.getPlayerId());
          return gtExecuteActionWithoutValidation(removeCardFromHandAction);
        }
      } else if ((x !== -1) && (y !== -1)) {
        const unitAtPosition = SDK.GameSession.getInstance().getBoard().getUnitAtPosition({x, y});
        if (unitAtPosition != null) {
          const removeAction = new SDK.RemoveAction(SDK.GameSession.getInstance());
          removeAction.setTarget(unitAtPosition);
          return gtExecuteActionWithoutValidation(removeAction);
        }
      }
    };
    const gtAddCardToHandFolder = gtFolder.addFolder("Add or Remove Card");
    gtAddCardToHandFolder.add(gtAddCardToHand, "Card", gtCardFactionTypeNames);
    gtAddCardToHandFolder.add(gtAddCardToHand, "X").min(-1).max(CONFIG.BOARDCOL - 1).step(1);
    gtAddCardToHandFolder.add(gtAddCardToHand, "Y").min(-1).max(CONFIG.BOARDROW - 1).step(1);
    gtAddCardToHandFolder.add(gtAddCardToHand, "Hand Slot").min(-1).max(CONFIG.MAX_HAND_SIZE - 1).step(1);
    gtAddCardToHandFolder.add(gtAddCardToHand, "Add Selected Card");
    gtAddCardToHandFolder.add(gtAddCardToHand, "Remove Any Card");

    // game tools: change unit stats
    const gtChangeStats = {"Max HP": -1, "Attack": -1, "Damage": -1, "X": -1, "Y": -1, "Hand Slot": -1};
    gtChangeStats["Change"] = function() {
      const player = SDK.GameSession.getInstance().getCurrentPlayer();
      const index = gtChangeStats["Hand Slot"];
      const x = gtChangeStats["X"];
      const y = gtChangeStats["Y"];
      if (index !== -1) {
        card = player.getDeck().getCardInHandAtIndex(index);
      } else if ((x !== -1) && (y !== -1)) {
        card = SDK.GameSession.getInstance().getBoard().getUnitAtPosition({x, y});
      }
      if (card instanceof SDK.Unit) {
        if (gtChangeStats["Max HP"] !== -1) { card.maxHP = gtChangeStats["Max HP"]; }
        if (gtChangeStats["Attack"] !== -1) { card.atk = gtChangeStats["Attack"]; }
        if (gtChangeStats["Damage"] !== -1) { card.setDamage(gtChangeStats["Damage"]); }
        card.flushCachedAttributes();
        return gtExecuteActionWithoutValidation(new SDK.Action(SDK.GameSession.getInstance())); // execute generic action to update session and engine
      }
    };
    const gtChangeStatsFolder = gtFolder.addFolder("Change Unit Stats");
    gtChangeStatsFolder.add(gtChangeStats, "Max HP").min(-1).max(25).step(1);
    gtChangeStatsFolder.add(gtChangeStats, "Attack").min(-1).max(25).step(1);
    gtChangeStatsFolder.add(gtChangeStats, "Damage").min(-1).max(25).step(1);
    gtChangeStatsFolder.add(gtChangeStats, "X").min(-1).max(CONFIG.BOARDCOL - 1).step(1);
    gtChangeStatsFolder.add(gtChangeStats, "Y").min(-1).max(CONFIG.BOARDROW - 1).step(1);
    gtChangeStatsFolder.add(gtChangeStats, "Hand Slot").min(-1).max(CONFIG.MAX_HAND_SIZE - 1).step(1);
    gtChangeStatsFolder.add(gtChangeStats, "Change");

    // game tools: refresh unit on board
    const gtRefresh = {"X": 0, "Y": 0};
    gtRefresh["Refresh"] = function() {
      const unit = SDK.GameSession.getInstance().getBoard().getUnitAtPosition({x: gtRefresh["X"], y: gtRefresh["Y"]});
      if (unit != null) {
        const refreshExhaustionAction = new SDK.RefreshExhaustionAction(SDK.GameSession.getInstance());
        refreshExhaustionAction.setTarget(unit);
        return gtExecuteActionWithoutValidation(refreshExhaustionAction);
      }
    };
    const gtRefreshFolder = gtFolder.addFolder("Refresh Unit");
    gtRefreshFolder.add(gtRefresh, "X").min(0).max(CONFIG.BOARDCOL - 1).step(1);
    gtRefreshFolder.add(gtRefresh, "Y").min(0).max(CONFIG.BOARDROW - 1).step(1);
    gtRefreshFolder.add(gtRefresh, "Refresh");

    // game tools: change  mana
    const gtSetMana = {"Mana": 1};
    gtSetMana["Set Mana"] = function() {
      SDK.GameSession.getInstance().getCurrentPlayer().setStartingMana(gtSetMana["Mana"]);
      Scene.getInstance().getGameLayer().getBottomDeckLayer().bindHandUsability();
      Scene.getInstance().getGameLayer().getCurrentPlayerLayer().bindAndResetSignatureCard();
      return Scene.getInstance().getGameLayer().getEventBus().trigger(EVENTS.show_rollback);
    };
    const gtSetManaFolder = gtFolder.addFolder("Change Mana");
    gtSetManaFolder.add(gtSetMana, "Mana").min(1).max(9).step(1);
    gtSetManaFolder.add(gtSetMana, "Set Mana");

    // game tools: toggle Bloodbound spells
    const gtToggleBBS = {
      "Toggle Bloodbound Spell"() {
        const player = SDK.GameSession.getInstance().getCurrentPlayer();
        player.setIsSignatureCardActive(!player.getIsSignatureCardActive());
        return Scene.getInstance().getGameLayer().getCurrentPlayerLayer().bindAndResetSignatureCard();
      }
    };
    gtFolder.add(gtToggleBBS, "Toggle Bloodbound Spell");

    // game tools: set rotation format
    const gtRotationFormat = {"Format 0=S 1=L": -1};
    gtRotationFormat["Set Format"] = () => SDK.GameSession.getInstance().setGameFormat(gtRotationFormat["Format 0=S 1=L"]);
    const gtRotationFormatFolder = gtFolder.addFolder("Change Rotation Format");
    gtRotationFormatFolder.add(gtRotationFormat, "Format 0=S 1=L").min(-1).max(1).step(1);
    gtRotationFormatFolder.add(gtRotationFormat, "Set Format");

    //  gtSaveAndDownload = {
    //    "Save Game as Challenge": () ->
    //      json = SDK.GameSession.getInstance().generateGameSessionSnapshot()
    //
    //      # blob the content
    //      blob = new Blob([json], {type: "application/json;charset=utf-8"})
    //
    //      # save blob
    //      saveAs(blob, "challenge_" + moment.utc().format("YYYY-MM-DD_X") + ".json")
    //  }
    //  gtFolder.add(gtSaveAndDownload, "Save Game as Challenge")

    // Folder for configuring and pushing a daily challenge
    const defaultName = "Default Name";
    const defaultDescription = "Default Description";
    const defaultDifficulty = "X Minutes";
    const defaultInstructions = "Default Instructions";
    const defaultHint = "Default Hint";
    const gtPushToServer = {};
    gtPushToServer["UTC Date"] = moment.utc().format("YYYY-MM-DD");
    gtPushToServer["Challenge Name"] = defaultName;
    gtPushToServer["Challenge Desc"] = defaultDescription;
    gtPushToServer["Challenge Difficulty"] = defaultDifficulty;
    gtPushToServer["Challenge Instructions"] = defaultInstructions;
    gtPushToServer["Challenge Hint"] = defaultHint;
    gtPushToServer["Push Game as Challenge"] = function() {
      const challengeName = gtPushToServer["Challenge Name"];
      const challengeDesc = gtPushToServer["Challenge Desc"];
      const challengeDiff = gtPushToServer["Challenge Difficulty"];
      const challengeDate = gtPushToServer["UTC Date"];
      const challengeInstructions = gtPushToServer["Challenge Instructions"];
      const challengeHint = gtPushToServer["Challenge Hint"];

      //Check nothing is default
      if (challengeName === defaultName) {
        alert("Default name not changed, aborting");
        return;
      }
      if (defaultDescription === challengeDesc) {
        alert("Default description not changed, aborting");
        return;
      }
      if (defaultDifficulty === challengeDiff) {
        alert("Default difficulty not changed, aborting");
        return;
      }
      if (defaultInstructions === challengeInstructions) {
        alert("Default instructions not changed, aborting");
        return;
      }
      if (defaultHint === challengeHint) {
        alert("Default hint not changed, aborting");
        return;
      }

      return (new Promise(function(resolve,reject) {
        const dailyChallengeRef = new Firebase(process.env.FIREBASE_URL + "/daily-challenges/" + challengeDate);
        return dailyChallengeRef.once("value",  function(dailyChallengeSnapshot) {
          if ((dailyChallengeSnapshot == null) || (dailyChallengeSnapshot.val() == null)) {
            // No existing challenge
            return resolve(null);
          } else {
            const dailyChallengeData = dailyChallengeSnapshot.val();
            const overwriteText = prompt("Daily challenge already exists for provided date:\n" +
              `Date: ${moment.utc(challengeDate).format("YYYY-MM-DD")}\n` +
              `Name: ${challengeName}\n` +
              `Description: ${challengeDesc}\n` +
              `Difficulty: ${challengeDiff}\n` +
              `Instructions: ${challengeInstructions}\n` +
              `Hint: ${challengeHint}\n` +
              "\n" +
              "Please enter 'overwrite' to overwrite that challenge...","");

            if (overwriteText === "overwrite") {
              return resolve(dailyChallengeData);
            } else {
              return reject(new Error("Chose not to overwrite existing daily challenge at provided date"));
            }
          }
        });
      })).then(function()  {
        const confirmText = prompt("Preparing to push daily challenge with configuration:\n" +
          `Date: ${moment.utc(challengeDate).format("YYYY-MM-DD")}\n` +
          `Name: ${challengeName}\n` +
          `Description: ${challengeDesc}\n` +
          `Difficulty: ${challengeDiff}\n` +
          `Instructions: ${challengeInstructions}\n` +
          `Hint: ${challengeHint}\n` +
          "\n" +
          "Please enter 'confirm' to proceed...","");

        if (confirmText !== "confirm") {
          alert("Did not enter 'confirm', aborting");
          return;
        }

        const challengeJson = SDK.GameSession.getInstance().generateGameSessionSnapshot();
        const request = $.ajax({
          url: process.env.API_URL + "/api/me/qa/daily_challenge",
          data: JSON.stringify({
            challenge_name: challengeName,
            challenge_description: challengeDesc,
            challenge_json: challengeJson,
            challenge_difficulty: challengeDiff,
            challenge_date: challengeDate,
            challenge_instructions: challengeInstructions,
            challenge_hint: challengeHint

          }),
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json'
        });
        request.done(data => alert("Pushed daily challenge"));
        return request.fail(response => alert("FAILED: Pushing daily challenge \n" + response.responseJSON.message));}).catch(e => alert(`Failed pushing daily challenge: \n ${e.toString()}`));
    };

    const gtPushGameFolder = gtFolder.addFolder("Config and Push Challenge");
    gtPushGameFolder.add(gtPushToServer, "UTC Date");
    gtPushGameFolder.add(gtPushToServer, "Challenge Name");
    gtPushGameFolder.add(gtPushToServer, "Challenge Desc");
    gtPushGameFolder.add(gtPushToServer, "Challenge Difficulty");
    gtPushGameFolder.add(gtPushToServer, "Challenge Instructions");
    gtPushGameFolder.add(gtPushToServer, "Challenge Hint");
    gtPushGameFolder.add(gtPushToServer, "Push Game as Challenge");

    // toggle performance tools
    buttons["Toggle Performance Tools"] = Editor.toggle_performance_tools_gui;
    Editor.gui.add(buttons, "Toggle Performance Tools");

    // reload CSS
    if (UtilsEnv.getIsInLocal()) {
      buttons["Reload CSS"] = function() {
        const queryString = '?reload=' + new Date().getTime();
        return $('link[rel="stylesheet"]').each(function(){
          return this.href = this.href.replace(/\?.*|$/, queryString);
        });
      };

      Editor.gui.add(buttons, "Reload CSS");
    }

    // validate resources
    buttons["Validate Resources"] = function() {
      // resolve resources in fx data
      const result = Editor.getFXDataWithResolvedResources();

      if (result.brokenResources.length > 0) {
        // broken resources found, alert user to fix
        return alert("Found broken resources:\n\n" + result.brokenResources);
      } else if (result.overSelectableLimit.length > 0) {
        // over selectable limit found, alert user to fix
        return alert("Found FX with more than the maximum allowed " + Editor.maxNumSelectables + " items:\n\n" + result.overSelectableLimit);
      } else {
        return alert("Validated " + result.numResourcesResolved + " resources, all passed!");
      }
    };

    Editor.gui.add(buttons, "Validate Resources");

    // save edited data
    buttons["Save & Download"] = function() {
      // resolve resources in fx data
      const result = Editor.getFXDataWithResolvedResources();
      result.overSelectableLimit = "";

      if (result.brokenResources.length > 0) {
        // broken resources found, alert user to fix
        alert("Found broken resources:\n\n" + result.brokenResources);
      } else if (result.overSelectableLimit.length > 0) {
        // over selectable limit found, alert user to fix
        alert("Found FX with more than the maximum allowed " + Editor.maxNumSelectables + " items:\n\n" + result.overSelectableLimit);
      } else {
        const {
          fxData
        } = result;

        // stringify and format fx data to json
        let json = JSON.stringify(fxData, null, "\t");

        // remove line breaks between objects that don't contain other objects to compress data
        json = json.replace(/\{[^\{\}]+\}/g, (match, p1) => match.replace(/[\r\n][\s\t]*?(["'\}\]])/g, "$1"));

        // remove quotes around property names
        json = json.replace(/["'](\w+)["'][\s\t]*?:/g, "$1:");

        // remove quotes from all resources
        json = json.replace(/["'](RSX\..*?)["']/g, "$1");

        // edit the json to create a js file
        let content = "";
        content += 'var RSX = require("./resources.js");\n\n';
        content += '/**\n';
        content += ' * fx.js - map of fx options and resources.\n';
        content += '*/\n\n';
        content += "var FX = " + json + ";";
        content += "\nmodule.exports = FX;";

        // blob the content
        const blob = new Blob([content], {type: "application/js;charset=utf-8"});

        // save blob
        saveAs(blob, "fx.js");
      }

      return true;
    };

    return Editor.gui.add(buttons, "Save & Download");
  };

  Editor.getFXDataWithResolvedResources = function() {
    let path;
    const brokenResourcesByPath = {};
    let overSelectableLimitPaths = [];
    let numResourcesResolved = 0;

    const resolveResource = function(value, path, isForParticles) {
      numResourcesResolved++;
      let resourceAlias = null;
      const resourceData = RSX[value] || RSX.getResourcesByPath(value)[0];

      if (resourceData != null) {
        if (isForParticles) {
          resourceAlias = resourceData.name + ".plist";
        } else if ((resourceData.img != null) && (resourceData.plist == null)) {
          resourceAlias = resourceData.name + ".img";
        } else {
          resourceAlias = resourceData.name + ".name";
        }
      }

      if ((resourceAlias == null)) {
        // no matching resource found, record as broken
        let brokenPath, valuePath;
        const parts = path.match(/(.*?)\.(\w+FX\..*?$)/);
        if (parts && (parts.length === 3)) {
          brokenPath = parts[1];
          valuePath = parts[2] + ": " + value;
        } else {
          brokenPath = path;
          valuePath = value;
        }
        if ((brokenResourcesByPath[brokenPath] == null)) { brokenResourcesByPath[brokenPath] = []; }
        brokenResourcesByPath[brokenPath].push(valuePath);
        return value;
      } else {
        return "RSX." + resourceAlias;
      }
    };

    var walkData = function(data, parentPath, recursiveCountSelectableItems) {
      const dataResolved = {};

      const countSelectableItems = Editor.getSelectableTopLevelItemMatched(parentPath, Editor.selectableKeyMatches);
      if (countSelectableItems) {
        recursiveCountSelectableItems = true;
        dataResolved.numSelectableItems = 1;
      }

      for (var property in data) {
        var i, item, path, subDataResolved;
        var value = data[property];
        if (parentPath) { path = parentPath + "." + property; } else { path = property; }
        var isForParticles = property === "plistFile";
        if ((property === "spriteIdentifier") || isForParticles) {
          if (_.isArray(value)) {
            dataResolved[property] = [];
            for (i = 0; i < value.length; i++) {
              item = value[i];
              dataResolved[property].push(resolveResource(item, path + "." + i, isForParticles));
            }
          } else {
            dataResolved[property] = resolveResource(value, path, isForParticles);
          }
        } else if (_.isArray(value)) {
          dataResolved[property] = [];
          var totalNumSelectableItems = 0;
          for (i = 0; i < value.length; i++) {
            item = value[i];
            var subPath = path + "." + i;
            subDataResolved = walkData(item, subPath, recursiveCountSelectableItems);

            // extract selectable count
            if (recursiveCountSelectableItems) {
              if (dataResolved.numSelectableItems == null) { dataResolved.numSelectableItems = 0; }
              dataResolved.numSelectableItems += subDataResolved.numSelectableItems || 0;
              delete subDataResolved.numSelectableItems;
            } else if (subDataResolved.numSelectableItems != null) {
              totalNumSelectableItems += subDataResolved.numSelectableItems;
              delete subDataResolved.numSelectableItems;
            }

            // store resolved data
            dataResolved[property].push(subDataResolved);
          }

          // check selectable count
          if (totalNumSelectableItems > Editor.maxNumSelectables) {
            overSelectableLimitPaths.push(path);
          }
        } else if (_.isObject(value)) {
          subDataResolved = walkData(value, path, recursiveCountSelectableItems);

          // extract and check selectable count
          if (recursiveCountSelectableItems) {
            if (dataResolved.numSelectableItems == null) { dataResolved.numSelectableItems = 0; }
            dataResolved.numSelectableItems += subDataResolved.numSelectableItems || 0;
            delete subDataResolved.numSelectableItems;
          } else if (subDataResolved.numSelectableItems != null) {
            var {
              numSelectableItems
            } = subDataResolved;
            delete subDataResolved.numSelectableItems;
            if (numSelectableItems > Editor.maxNumSelectables) {
              overSelectableLimitPaths.push(path);
            }
          }

          // store resolved data
          dataResolved[property] = subDataResolved;
        } else {
          dataResolved[property] = value;
        }
      }

      return dataResolved;
    };

    // get data
    const fxData = walkData(DATA.FX);

    // format broken resources
    let brokenResources = "";
    for (path in brokenResourcesByPath) {
      var values = brokenResourcesByPath[path];
      brokenResources += path + ":\n";
      for (var value of Array.from(values)) {
        brokenResources += " > " + value + "\n";
      }
      brokenResources += "\n";
    }

    // make over selectable limit unique and format
    overSelectableLimitPaths = _.uniq(overSelectableLimitPaths);
    let overSelectableLimit = "";
    for (path of Array.from(overSelectableLimitPaths)) {
      overSelectableLimit += path + "\n";
    }

    return {fxData, brokenResources, overSelectableLimit, numResourcesResolved};
  };

  Editor.onClose = function() {
    Editor.removeSelectedGUI();
    return Editor.removeNewDataGUI();
  };

  // adds a gui container into the page
  Editor.addGUIContainerToDOM = function(gui) {
    const $el = $(gui.domElement);
    $el.addClass("container");

    // create container
    if ((Editor.$container == null)) {
      Editor.$container = $('<div class="editor"></div>');
      $("body").append(Editor.$container);
    }

    Editor.$container.append($el);
    return $el;
  };

  Editor.getIsPathForSelected = path => (Editor.pathSelected != null) && (path.length >= Editor.pathSelected.length);

  // lists all data in a JSON object
  Editor.listData = function(data, gui, path, selectableKeyMatches) {
    // get all keys
    let key;
    const keys = [];
    for (key in data) {
      keys.push(key);
    }

    if (!Editor.getIsPathForSelected(path)) {
      // sort keys alphabetically when not selecting
      keys.sort((a, b) => a.localeCompare(b));
    }

    return (() => {
      const result = [];
      for (key of Array.from(keys)) {
        result.push(Editor.listDataItem(data, gui, key, path, selectableKeyMatches));
      }
      return result;
    })();
  };

  // recursively lists all data for a key
  // will not list FXType data, instead will create a selectable for it
  Editor.listDataItem = function(data, gui, key, path, selectableKeyMatches) {
    const value = data[key];
    if (!_.isFunction(value) && data.hasOwnProperty(key)) {
      // when not top level
      let selectableMatched;
      if (path && (path.length > 0)) {
        path += ".";

        // we're not selecting a key and key ends in a selectable match
        // we want it to be selectable
        if (!Editor.getIsPathForSelected(path)) { selectableMatched = Editor.getSelectableMatched(key, selectableKeyMatches); }
      }

      // add key to full key
      path += key;

      // this key is a selectable so we'll stop listing data here
      if ((selectableMatched != null) && (selectableMatched.length > 0)) {
        return Editor.listDataForSelectable(value, gui, key, path, selectableMatched);
      } else {
        if (_.isArray(value)) {
          return Editor.listDataForArray(value, gui, key, path, selectableKeyMatches);
        } else if (_.isObject(value)) {
          return Editor.listDataForObject(value, gui, key, path, selectableKeyMatches);
        } else {
          return Editor.listDataForKey(data, gui, key, path);
        }
      }
    }
  };

  Editor.getSelectableMatched = function(key, selectableKeyMatches) {
    if ((key != null) && (selectableKeyMatches != null)) {
      for (var keyMatch of Array.from(selectableKeyMatches)) {
        if (key.lastIndexOf(keyMatch) !== -1) { return keyMatch; }
      }
    }
    return null;
  };

  Editor.getSelectableTopLevelItemMatched = function(key, selectableKeyMatches) {
    if ((key != null) && (selectableKeyMatches != null)) {
      for (var keyMatch of Array.from(selectableKeyMatches)) {
        if ((key.lastIndexOf(keyMatch) !== -1) && (new RegExp(keyMatch + "\$", "i").test(key) || new RegExp(keyMatch + "\\.\\d\+\$", "i").test(key))) { return keyMatch; }
      }
    }
    return null;
  };

  // adds a selectable to enable selecting the data in a separate tree
  Editor.listDataForSelectable = function(data, gui, key, path, selectableMatched) {
    // create selectable
    const selectable = {};
    selectable[key] = () => Editor.onSelectKey(data, gui, key, path, selectableMatched);
    const controller = gui.add(selectable, key);
    Editor.makeDataRemovable(controller, gui, path);
    // remember selectable in gui
    if (!gui.__selectables) {
      gui.__selectables = [];
    }
    return gui.__selectables.push(selectable);
  };

  // adds an object and lists its data (recursive)
  Editor.listDataForObject = function(data, gui, key, path, selectableKeyMatches) {
    const folder = gui.addFolder(key);
    const isForSelected = Editor.getIsPathForSelected(path);

    // make data previewable when for fx
    if (isForSelected && Editor.getSelectableTopLevelItemMatched(path, Editor.selectableKeyMatches)) {
      Editor.makeDataPreviewable(data, folder);
    }

    // make data modifiable
    Editor.makeDataIncreasable(data, folder, key, path, $(folder.domElement).parent());

    // make data removable
    Editor.makeDataRemovable(folder, gui, path);

    // open folder when selected path
    if (isForSelected) { folder.open(); }

    // list sub data
    Editor.listData(data, folder, path, selectableKeyMatches);

    return folder;
  };

  // adds an array and lists its data (recursive)
  Editor.listDataForArray = function(data, gui, key, path, selectableKeyMatches) {
    const folder = gui.addFolder(key);
    // make data modifiable
    Editor.makeDataIncreasable(data, folder, key, path, $(folder.domElement).parent());
    Editor.makeDataRemovable(folder, gui, path);
    // open folder when selected path
    if (Editor.getIsPathForSelected(path)) { folder.open(); }
    // list sub data
    for (let i = 0; i < data.length; i++) {
      var subValue = data[i];
      Editor.listDataItem(data, folder, i, path, selectableKeyMatches);
    }
    return folder;
  };

  // adds a key/value pair (end of the line)
  Editor.listDataForKey = function(data, gui, key, path) {
    const controller = gui.add(data, key);
    // make this data removable
    return Editor.makeDataRemovable(controller, gui, path);
  };

  // adds a button to inject new data under a key
  Editor.makeDataIncreasable = function(data, gui, key, path, $container) {
    // remove any existing buttons
    $container.find("> .add-button").remove();

    const isPathForSelected = Editor.getIsPathForSelected(path);

    // create a button to add
    const $addButton = $('<button type="button" class="close action-button add-button"><i class="fa fa-pencil-square-o"></i></button>');
    $addButton.on("click", function(event) {
      // we dont want clicks on the add to do anything to the data
      event.stopPropagation();

      // remove existing new data gui
      Editor.removeNewDataGUI();

      // check parent data type
      if (_.isArray(data)) {
        // special case for arrays
        if (key === "spriteIdentifier") {
          // skip ui and just add a string to the array
          Editor.onAddNewDataAtPath(data, gui, key, path, {
            "name": data.length,
            "value": "fxPlaceholderName",
            "type": "string"
          });
        } else {
          // skip ui and just add an object to the array
          Editor.onAddNewDataAtPath(data, gui, key, path, {
            "name": data.length,
            "type": "object"
          });
        }
      } else {
        // open the gui we're adding new data to
        gui.open();

        // setup new gui for new data
        Editor.pathNewData = path;
        Editor.guiNewData = new dat.GUI({autoPlace: false});
        const $guiEl = $(Editor.guiNewData.domElement);
        $guiEl.addClass("new-data");

        const options = {
          "name": "",
          "value": "",
          "type": ""
        };
        options["+ Add"] = () => Editor.onAddNewDataAtPath(data, gui, key, path, options);

        // show options
        const nameController = Editor.guiNewData.add(options, "name");
        if (gui.__selectables != null) {
          // special case for selectables container
          options.type = "array";
          // close selected gui
          Editor.removeSelectedGUI();
        } else if (!Editor.getIsPathForSelected(path)) {
          // special case for selectables container
          options.type = "object";
        } else {
          Editor.guiNewData.add(options, "value");
          Editor.guiNewData.add(options, "type", [ "string", "number", "vector", "boolean", "object", "array" ]);
        }
        Editor.guiNewData.add(options, "+ Add");
        Editor.guiNewData.open();

        // show popover
        Editor.$popoverNewDataSource = $(gui.domElement).find("> ul > li.title");
        Editor.$popoverNewDataSource.popover({
          // set the content to the html string of the gui
          // we just do this so the popover is positioned correctly
          content: $guiEl.prop('outerHTML'),
          html: true,
          animation: false,
          trigger: "manual",
          container: "body",
          placement: (isPathForSelected ? "left" : "right")
        });
        Editor.$popoverNewDataSource.popover("show");

        // store popover
        Editor.$popoverNewData = $("#" + Editor.$popoverNewDataSource.attr("aria-describedby"));
        Editor.$popoverNewData.addClass("editor-popover");

        // there are some layout bugs on the first time a popover is shown
        // toggle show the popover again to fix some layout issues
        if (Editor.$popoverNewDataSource.data("hasFirstPopover") !== true) {
          Editor.$popoverNewDataSource.data("hasFirstPopover", true);
          return $addButton.trigger("click");
        } else {
          // append actual element to popover so that all the gui events work
          Editor.$popoverNewData.find(".popover-content").empty().append($guiEl);
        }

        // listen for key presses
        Editor.onKeyUpNewData = function(e) {
          if (e.which === 13) { //enter
            Editor.onAddNewDataAtPath(data, gui, key, path, options);
          } else if (e.which === 27) { //esc
            Editor.removeNewDataGUI();
          }
          return true;
        };
        $(document).on("keyup", Editor.onKeyUpNewData);

        // listen for click
        Editor.onClickNewData = function(e) {
          // click is outside new data gui, close new data
          const $target = $(e.target);
          if ($target.closest(".new-data").length === 0) {
            Editor.removeNewDataEvents();
            if (!$target.hasClass("add-button") && ($target.closest(".add-button").length === 0)) {
              Editor.removeNewDataGUI();
            }
          }
          return true;
        };
        $(document).on("click", Editor.onClickNewData);

        // listen for scroll
        Editor.$scrollElNewData = (isPathForSelected ? Editor.$guiElSelected.find("> ul") : Editor.$guiEl.find("> ul"));
        Editor.onScrollNewData = e => Editor.removeNewDataGUI();
        Editor.$scrollElNewData.one("scroll", Editor.onScrollNewData);

        // focus on name controller
        $(nameController.domElement).find("input").focus();
      }

      return true;
    });

    // add to element
    return $container.append($addButton);
  };

  // adds new data at path
  Editor.onAddNewDataAtPath = function(data, gui, key, path, options) {
    if (options != null) {
      // get options
      let selectableMatched;
      let name = options.name + "";
      let value = options.value + "";
      const {
        type
      } = options;

      // remove spaces from name
      name = name.replace(/\s/g, "");

      // late check for if selectable matched
      if (!Editor.getIsPathForSelected(path)) { selectableMatched = Editor.getSelectableMatched(name, Editor.selectableKeyMatches); }

      // name must be present
      if ((name != null) && (name.length > 0)) {
        // cast value to type
        // default to string
        if (type === "number") {
          value = parseFloat(value) || 0;
        } else if (type === "boolean") {
          value = value.toLowerCase();
          if ((value === "true") || (value === "1")) { value = true;
          } else if ((value === "false") || (value === "0")) { value = false;
          } else { value = Boolean(value) || false; }
        } else if ((type === "array") || (selectableMatched != null)) {
          value = [];
        } else if (type === "vector") {
          value = {"x": 0, "y": 0};
        } else if (type === "object") {
          // give objects some default values when in a selection
          if (Editor.getIsPathForSelected(path) && (gui === Editor.guiSelected)) {
            value = {
              "spriteIdentifier": "fxPlaceholderName",
              "offset": { "x": 0, "y": 0 }
            };
          } else {
            value = {};
          }
        } else {
          value = value + "";
        }

        // remove new data gui
        Editor.removeNewDataGUI();

        // always change the data
        const dataExists = (data[name] != null);
        data[name] = value;
        Editor.changeOriginalDataAtPath(path + "." + name, value);

        // only list data when nothing exists at path already
        if (!dataExists) {
          if ((gui.__selectables != null) || (selectableMatched != null)) {
            return Editor.listDataItem(data, gui, name, path, Editor.selectableKeyMatches);
          } else {
            return Editor.listDataItem(data, gui, name, path);
          }
        } else {
          return gui.updateDisplay();
        }
      }
    }
  };

  // removes any gui for adding new data
  Editor.removeNewDataGUI = function() {
    Editor.removeNewDataEvents();

    if (Editor.$popoverNewDataSource) {
      Editor.$popoverNewDataSource.popover("hide");
      Editor.$popoverNewDataSource = null;
      Editor.$popoverNewData = null;
    }

    if (Editor.guiNewData != null) {
      $(Editor.guiNewData.domElement).remove();
      Editor.guiNewData = null;
    }

    if (Editor.pathNewData != null) {
      return Editor.pathNewData = null;
    }
  };

  Editor.removeNewDataEvents = function() {
    if (Editor.onKeyUpNewData) {
      $(document).off("keyup", Editor.onKeyUpNewData);
      Editor.onKeyUpNewData = null;
    }

    if (Editor.onClickNewData) {
      $(document).off("click", Editor.onClickNewData);
      Editor.onClickNewData = null;
    }

    if (Editor.$scrollElNewData) {
      Editor.$scrollElNewData.off("scroll", Editor.onScrollNewData);
      return Editor.onScrollNewData = null;
    }
  };

  // changes the original data at path
  Editor.changeOriginalDataAtPath = function(path, value) {
    if (path) {
      const keys = path.split(".");
      // search main data object for path
      let data = DATA;
      for (let i = 0, end = keys.length - 2, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
        var key = keys[i];
        data = data[key];
        if ((data == null)) { return; }
      }

      // set value at final key in path
      if (data != null) {
        data[keys[keys.length - 1]] = value;
        // clear original data cache
        return DATA.releaseCaches();
      }
    }
  };

  // makes the data and gui at a path removable
  Editor.makeDataRemovable = function(gui, guiParent, path) {
    const $container = $(gui.domElement).parent();

    // remove any existing buttons
    $container.find("> .remove-button").remove();

    // create a button to remove
    const $removeButton = $('<button type="button" class="close action-button remove-button"><i class="fa fa-trash-o"></i></button>');
    $removeButton.on("click", function(event) {
      // we dont want clicks on the close to do anything to the data
      event.stopPropagation();
      // remove the data from the gui
      guiParent.remove(gui);
      // remove data at path
      Editor.removeOriginalDataAtPath(path);
      // check for addon gui matching path
      if (Editor.pathSelected === path) { Editor.removeAddonGUIs();
      } else if (Editor.pathNewData === path) { Editor.removeNewDataGUI();
      } else if (Editor.getIsPathForSelected(path)) {
        // refresh selected GUI
        // when removing elements from array
        // this ensures the array indices are updated
        // so further removal removes the correct index
        let $guiSelectedScrollEl = $(Editor.guiSelected.domElement).find("> ul");
        const lastScrollTop = $guiSelectedScrollEl.scrollTop() || 0;
        const lastScrollHeight = $guiSelectedScrollEl.get(0).scrollHeight || 0;
        const parentGUI = Editor.guiSelected.parent;
        const {
          dataSelected
        } = Editor;
        const {
          pathSelected
        } = Editor;
        const {
          keySelected
        } = Editor;
        const {
          selectableMatched
        } = Editor;
        Editor.removeSelectedGUI();
        Editor.onSelectKey(dataSelected, parentGUI, keySelected, pathSelected, selectableMatched);

        // attempt to restore scroll position
        if ((lastScrollTop !== 0) && (lastScrollHeight !== 0)) {
          $guiSelectedScrollEl = $(Editor.guiSelected.domElement).find("> ul");
          const {
            scrollHeight
          } = $guiSelectedScrollEl.get(0);
          if (scrollHeight > 0) {
            $guiSelectedScrollEl.scrollTop(scrollHeight * (lastScrollTop / lastScrollHeight));
          }
        }
      }
      return true;
    });

    // add to element
    return $container.append($removeButton);
  };

  // makes the data and gui at a path previewable
  Editor.makeDataPreviewable = function(data, gui) {
    const $container = $(gui.domElement).parent();

    // remove any existing buttons
    $container.find("> .preview-button, > .remove-preview-button").remove();

    // create a button to preview
    const $previewButton = $('<button type="button" class="close action-button preview-button"><i class="fa fa-eye"></i></button>');
    $previewButton.on("click", function(event) {
      // we dont want clicks on the close to do anything to the data
      event.stopPropagation();

      // show preview of data
      Editor.previewFXData(data);

      return true;
    });

    // add to element
    $container.append($previewButton);

    // create a button to remove preview
    const $removeButton = $('<button type="button" class="close action-button remove-preview-button"><i class="fa fa-eye-slash"></i></button>');
    $removeButton.on("click", function(event) {
      // we dont want clicks on the close to do anything to the data
      event.stopPropagation();

      // remove any current preview
      Editor.removeFXPreview();

      return true;
    });

    // add to element
    return $container.append($removeButton);
  };

  // removes actual data at path
  Editor.removeOriginalDataAtPath = function(path) {
    if (path) {
      const keys = path.split(".");
      // search main data object for path
      let data = DATA;
      for (let i = 0, end = keys.length - 2, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
        var key = keys[i];
        data = data[key];
        if ((data == null)) { return; }
      }

      // delete final key in path
      if (data != null) {
        if (_.isArray(data)) {
          data.splice(keys[keys.length - 1], 1);
        } else if (_.isObject(data)) {
          delete data[keys[keys.length - 1]];
        }
        // clear original data cache
        return DATA.releaseCaches();
      }
    }
  };

  Editor.removeAddonGUIs = function() {
    Editor.removeSelectedGUI();
    Editor.removeNewDataGUI();
    return Editor.remove_performance_tools_gui();
  };

  // handler for when user selects a key with data
  Editor.onSelectKey = function(data, gui, key, path, selectableMatched) {
    if (Editor.pathSelected !== path) {
      // remove any addon guis
      Editor.removeAddonGUIs();

      // retain selected data
      Editor.dataSelected = data;
      Editor.keySelected = key;
      Editor.pathSelected = path;
      Editor.selectableMatched = selectableMatched;

      // setup new gui for selected
      Editor.guiSelected = new dat.GUI({ autoPlace: false, parent: gui });
      Editor.$guiElSelected = Editor.addGUIContainerToDOM(Editor.guiSelected);
      Editor.$guiElSelected.addClass("selected");
      Editor.$guiElSelected.find(".title").first().text(path);

      Editor.guiSelected.open();

      // setup selectable by matched type
      if (selectableMatched === "FX") {
        // setup fx preview button
        const previewKey = "Preview";
        const previewButton = {};
        previewButton[previewKey] = () => Editor.previewFXData(data);
        Editor.guiSelected.add(previewButton, previewKey);

        // setup fx preview remove button
        const removePreviewKey = "Remove Preview";
        const removePreviewButton = {};
        removePreviewButton[removePreviewKey] = Editor.removeFXPreview.bind(Editor);
        Editor.guiSelected.add(removePreviewButton, removePreviewKey);

        // setup fx add button
        const addItemKey = "Add FX";
        const addItemButton = {};
        addItemButton[addItemKey] = function() {
          // remove existing new data gui
          Editor.removeNewDataGUI();

          // add an object to the array
          return Editor.onAddNewDataAtPath(data, Editor.guiSelected, key, path, {
            "name": data.length,
            "type": "object"
          });
        };
        Editor.guiSelected.add(addItemButton, addItemKey);
      }

      // list all the data
      return Editor.listData(data, Editor.guiSelected, path);
    }
  };

  // removes currently selected gui if any exists
  Editor.removeSelectedGUI = function() {
    Editor.removeFXPreview();

    if (Editor.guiSelected != null) {
      Editor.$guiElSelected.remove();
      Editor.guiSelected = null;
    }

    if (Editor.dataSelected != null) {
      Editor.dataSelected = null;
    }

    if (Editor.keySelected != null) {
      Editor.keySelected = null;
    }

    if (Editor.pathSelected != null) {
      Editor.pathSelected = null;
    }

    if (Editor.selectableMatched != null) {
      return Editor.selectableMatched = null;
    }
  };

  // creates fx in the view for data
  Editor.previewFXData = function(data) {
    Editor.removeFXPreview();

    // load all resources needed for data
    const loadId = (Editor.fxNodesPreviewLoadId = "fx_preview_" + UtilsJavascript.generateIncrementalId());
    const resources = Editor.walkFXDataForResources(data);

    // check if num fx to create will exceed maximum
    if (_.isArray(data) && (data.length > CONFIG.MAX_FX_PER_EVENT)) {
      alert("Editor.previewFXData -> showing all " + data.length + " FX for preview, but in-game FX will be limited to first " + CONFIG.MAX_FX_PER_EVENT + " items!");
    }

    return PackageManager.getInstance().loadPackage(loadId, resources).then(function() {
      // create fx from data
      Editor.fxNodesPreviewing = NodeFactory.createFX(data, {
        sourceBoardPosition: CONFIG.BOARDCENTER,
        targetBoardPosition: CONFIG.BOARDCENTER,
        offset: {x: 0.0, y: CONFIG.TILESIZE * 0.5},
        noLimit: true
      });

      // attempt to use game layer to preview if exists
      const gameLayer = Scene.getInstance().getGameLayer();
      if (gameLayer != null) {
        return gameLayer.addNodes(Editor.fxNodesPreviewing);
      } else {
        return Array.from(Editor.fxNodesPreviewing).map((fxNode) =>
          Scene.getInstance().addChild(fxNode, 9999));
      }
    }).catch(error => alert("Editor.previewFXData -> error: " + error));
  };

  Editor.removeFXPreview = function() {
    if (Editor.fxNodesPreviewLoadId != null) {
      PackageManager.getInstance().unloadPackage(Editor.fxNodesPreviewLoadId);
      Editor.fxNodesPreviewLoadId = null;
    }

    if (Editor.fxNodesPreviewing != null) {
      const gameLayer = Scene.getInstance().getGameLayer();
      if (gameLayer != null) {
        gameLayer.removeNodes(Editor.fxNodesPreviewing);
      } else {
        for (var fxNode of Array.from(Editor.fxNodesPreviewing)) {
          fxNode.destroy();
        }
      }
      return Editor.fxNodesPreviewing = null;
    }
  };

  Editor.walkFXDataForResources = function(data) {
    let resources = [];
    const properties = Object.keys(data);
    for (var property of Array.from(properties)) {
      var value = data[property];
      if (value != null) {
        if (/spriteIdentifier|plistFile/.test(property)) {
          if (!_.isArray(value)) { value = [ value ]; }
          for (var resourceIdentifier of Array.from(value)) {
            var resourcesForIdentifier = RSX.getResourcesByPath(resourceIdentifier);

            // found missing/invalid resources
            if (resourcesForIdentifier.length === 0) {
              alert("Editor -> cannot find resources for " + resourceIdentifier);
            }

            resources = resources.concat(resourcesForIdentifier);
          }
        } else if (_.isObject(value)) {
          resources = resources.concat(Editor.walkFXDataForResources(value));
        }
      }
    }

    return resources;
  };


  // region PERFORMANCE #

  Editor.toggle_performance_tools_gui = function() {
    if (Editor.gui_performance_tools != null) {
      return Editor.remove_performance_tools_gui();
    } else {
      return Editor.show_performance_tools_gui();
    }
  };

  Editor.show_performance_tools_gui = function() {
    // remove any addon guis
    Editor.removeAddonGUIs();

    // create new selected gui
    Editor.gui_performance_tools = new dat.GUI({ autoPlace: false, parent: Editor.gui });
    Editor.$gui_el_performance_tools = Editor.addGUIContainerToDOM(Editor.gui_performance_tools);
    Editor.$gui_el_performance_tools.addClass("selected");
    const $performance_tools_title = Editor.$gui_el_performance_tools.find(".title").first();
    $performance_tools_title.text("Performance Tools");

    // add buttons and input
    const buttons = {};

    buttons["Start Profiling"] = function() {
      // swap ui
      $stop_button.removeClass("disabled");
      $start_button.addClass("disabled");
      $performance_tools_title.text("Performance Tools (running)");

      // start profiling
      return PERF.start();
    };
    const start_button = Editor.gui_performance_tools.add(buttons, "Start Profiling");
    var $start_button = $(start_button.domElement).closest("li");

    buttons["Stop Profiling"] = function() {
      // stop profiling
      PERF.stop();

      // swap ui
      $start_button.removeClass("disabled");
      $stop_button.addClass("disabled");
      return $performance_tools_title.text("Performance Tools");
    };
    const stop_button = Editor.gui_performance_tools.add(buttons, "Stop Profiling");
    var $stop_button = $(stop_button.domElement).closest("li");

    buttons["Log Performance"] = function() {
      // log to console
      PERF.log();

      // create gui for logs as needed
      if ((Editor.gui_performance_logs == null)) {
        Editor.gui_performance_logs = Editor.gui_performance_tools.addFolder("Performance Logs");
      }

      // get timestamp to name stats
      const timestamp = moment().format("YYYY[-]MM[-]DD [at] HH[:]mm[:]ss");

      // remove previous if timestamp is the same
      const stats_folder_prev = Editor.gui_performance_logs.getFolder(timestamp);
      if (stats_folder_prev != null) {
        Editor.gui_performance_logs.remove(stats_folder_prev);
      }

      // list all the data in editor
      const stats_data = PERF.get_stats_data();
      const stats_folder = Editor.listDataForObject(stats_data, Editor.gui_performance_logs, timestamp);

      // open performance logs and close all previous logs
      Editor.gui_performance_logs.open();
      Editor.gui_performance_logs.closeFolders(true);

      // open new performance log
      return stats_folder.open(true);
    };

    Editor.gui_performance_tools.add(buttons, "Log Performance");

    // start opened
    Editor.gui_performance_tools.open();

    // update performance tools ui
    if (PERF.get_started()) {
      return $start_button.trigger("click");
    } else {
      return $stop_button.trigger("click");
    }
  };

  // removes performance tools gui if any exists
  Editor.remove_performance_tools_gui = function() {
    if (Editor.gui_performance_tools) {
      Editor.$gui_el_performance_tools.remove();
      return Editor.gui_performance_tools= null;
    }
  };

  // endregion PERFORMANCE #

  // Editor should self initialize
  // as nothing in app should be aware of or use it
  Editor.setup();

  // expose globally
  return window.Editor = Editor;
});

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}