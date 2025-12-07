/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Modifier = require('./modifier');

class ModifierCollectable extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierCollectable";
    this.type ="ModifierCollectable";
  
    this.modifierName ="Collectable";
    this.description = "When another entity moves onto this location..";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
    this.prototype.depleted = false; // whether collectable has been used
    this.prototype.fxResource = ["FX.Modifiers.ModifierCollectable"];
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.collectingEntity = null;

    return p;
  }

  getDepleted(){
    return this.depleted;
  }

  getCollectingEntity() {
    const entities = this.getGameSession().getBoard().getEntitiesAtPosition(this.getCard().getPosition());
    for (var entity of Array.from(entities)) {
      // get the current obstructing entity at my entity's location
      // entity must also not be the same team as my entity
      if (entity.getIsObstructing() && (this.getCard().getIsSameTeamAs(entity) || this.getCard().isOwnedByGameSession())) {
        return entity;
      }
    }
  }

  _onActiveChange(e) {
    super._onActiveChange(e);
    if (this._private.cachedIsActive && !this.depleted) {
      // if there is an obstructing entity at my entity's location
      const collectingEntity = this.getCollectingEntity();
      if (collectingEntity != null) {
        this.depleted = true;

        // set self as triggering
        this.getGameSession().pushTriggeringModifierOntoStack(this);

        // set occupant
        this._private.collectingEntity = collectingEntity;
        this.getCard().setOccupant(this._private.collectingEntity);

        // do collection
        this.onCollect(collectingEntity);

        // deplete
        this.onDepleted();

        // stop triggering
        return this.getGameSession().popTriggeringModifierFromStack();
      }
    }
  }

  onCollect(entity) {}
    // override me in sub classes to implement special behavior

  onDepleted() {
    const entity = this.getCard();
    this.getGameSession().removeModifier(this);
    if (entity.getNumModifiersOfClass(ModifierCollectable) === 0) {
      return entity.setDepleted(true);
    }
  }

  postDeserialize() {
    super.postDeserialize();

    // get the current obstructing entity at my entity's location
    return this._private.collectingEntity = this.getCollectingEntity();
  }
}
ModifierCollectable.initClass();

module.exports = ModifierCollectable;
