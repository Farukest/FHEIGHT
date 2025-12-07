/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('../../common/config');
const SpellSpawnEntity = require('./spellSpawnEntity');
const UtilsGameSession = require('../../common/utils/utils_game_session.js');
const ModifierEgg = require('app/sdk/modifiers/modifierEgg');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const CardType = require('app/sdk/cards/cardType');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');

/*
  Spawns a new entity nearby my general.
*/
class SpellReggplicate extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.spawnSilently = true;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const minions = [];
      const actions = [];

      const currentTurn = this.getGameSession().getCurrentTurn();
      const turns = [].concat(this.getGameSession().getTurns(), currentTurn);

      for (var turn of Array.from(turns)) {
        for (var step of Array.from(turn.getSteps())) {
          actions.push(step.getAction().getFlattenedActionTree());
        }
        for (var action of Array.from(actions)) {
          for (var subaction of Array.from(action)) {
            if (subaction instanceof PlayCardFromHandAction &&
            (__guard__(__guard__(subaction.getCard(), x2 => x2.getRootCard()), x1 => x1.getType()) === CardType.Unit) &&
            (subaction.getCard().getRootCard() === subaction.getCard()) &&
            !subaction.getIsImplicit() &&
            (subaction.getOwnerId() === this.getOwnerId())) {
              minions.push(__guard__(subaction.getCard(), x3 => x3.getRootCard()));
            }
          }
        }
      }

      if (minions.length > 0) {
        this.cardDataOrIndexToSpawn = {id: Cards.Faction5.Egg};
        this.cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects = [ModifierEgg.createContextObject(minions[minions.length - 1].createNewCardData())];
        return super.onApplyEffectToBoardTile(board,x,y,sourceAction);
      }
    }
  }
}
SpellReggplicate.initClass();

module.exports = SpellReggplicate;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}