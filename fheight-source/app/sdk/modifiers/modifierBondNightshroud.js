/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierBond =   require('./modifierBond');
const HealAction = require('app/sdk/actions/healAction');
const DamageAction = require('app/sdk/actions/damageAction');
const Races = require('app/sdk/cards/racesLookup');

class ModifierBondNightshroud extends ModifierBond {
  static initClass() {
  
    this.prototype.type ="ModifierBondNightshroud";
    this.type ="ModifierBondNightshroud";
  
    this.description = "Your General steals 1 Health from the enemy General for each friendly minion";
  }

  onBond() {

    let numFriendlyArcanysts = 0;
    for (var unit of Array.from(this.getGameSession().getBoard().getFriendlyEntitiesForEntity(this.getCard()))) {
      if (unit.getBelongsToTribe(Races.Arcanyst)) {
        numFriendlyArcanysts++;
      }
    }

    const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());

    const healAction = new HealAction(this.getGameSession());
    healAction.setOwnerId(this.getCard().getOwnerId());
    healAction.setTarget(general);
    healAction.setHealAmount(numFriendlyArcanysts);
    this.getGameSession().executeAction(healAction);

    const enemyGeneral = this.getCard().getGameSession().getGeneralForPlayerId(this.getGameSession().getOpponentPlayerIdOfPlayerId(this.getCard().getOwnerId()));

    const damageAction = new DamageAction(this.getGameSession());
    damageAction.setOwnerId(this.getOwnerId());
    damageAction.setTarget(enemyGeneral);
    damageAction.setDamageAmount(numFriendlyArcanysts);
    return this.getGameSession().executeAction(damageAction);
  }
}
ModifierBondNightshroud.initClass();

module.exports = ModifierBondNightshroud;
