/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG =     require('app/common/config');
const Logger =     require('app/common/logger');
const ApplyCardToBoardAction =     require('./applyCardToBoardAction');
const CardType = require('app/sdk/cards/cardType');
const _ = require('underscore');

/*
Play a card to board and allow it to enact the full play card flow (followups, spawn effects, etc)
*/

class PlayCardAction extends ApplyCardToBoardAction {
  static initClass() {
  
    this.type ="PlayCardAction";
  }

  constructor() {
    super(...arguments);
    if (this.type == null) { this.type = PlayCardAction.type; }
  }
}
PlayCardAction.initClass();

module.exports = PlayCardAction;
