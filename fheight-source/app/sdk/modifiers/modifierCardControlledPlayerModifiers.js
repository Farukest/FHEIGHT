/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Modifier = require('./modifier');

/*
  Modifier that applies player modifiers to either or both players and removes them when the applying card is silenced or removed.
*/
class ModifierCardControlledPlayerModifiers extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierCardControlledPlayerModifiers";
    this.type ="ModifierCardControlledPlayerModifiers";
  
    this.modifierName ="";
    this.description ="";
  
    this.prototype.modifiersContextObjects = null;
    this.prototype.applyToOwnPlayer = false;
    this.prototype.applyToEnemyPlayer = false;
  }

  static createContextObject(modifiersContextObjects, applyToOwnPlayer, applyToEnemyPlayer, activeInHand, activeInDeck, activeInSignatureCards, activeOnBoard, description, options) {
    if (applyToOwnPlayer == null) { applyToOwnPlayer = false; }
    if (applyToEnemyPlayer == null) { applyToEnemyPlayer = false; }
    if (activeInHand == null) { activeInHand = true; }
    if (activeInDeck == null) { activeInDeck = true; }
    if (activeInSignatureCards == null) { activeInSignatureCards = true; }
    if (activeOnBoard == null) { activeOnBoard = true; }
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    contextObject.applyToOwnPlayer = applyToOwnPlayer;
    contextObject.applyToEnemyPlayer = applyToEnemyPlayer;
    contextObject.activeInHand = activeInHand;
    contextObject.activeInDeck = activeInDeck;
    contextObject.activeInSignatureCards = activeInSignatureCards;
    contextObject.activeOnBoard = activeOnBoard;
    contextObject.description = description;
    return contextObject;
  }

  static createContextObjectToTargetOwnPlayer(modifiersContextObjects, activeInHand, activeInDeck, activeInSignatureCards, activeOnBoard, description, options) {
    return this.createContextObject(modifiersContextObjects, true, false, activeInHand, activeInDeck, activeInSignatureCards, activeOnBoard, description, options);
  }

  static createContextObjectOnBoardToTargetOwnPlayer(modifiersContextObjects, description, options) {
    return this.createContextObject(modifiersContextObjects, true, false, false, false, false, true, description, options);
  }

  static createContextObjectInHandDeckToTargetOwnPlayer(modifiersContextObjects,description, options) {
    return this.createContextObject(modifiersContextObjects, true, false, true, true, false, false, description, options);
  }

  static createContextObjectToTargetEnemyPlayer(modifiersContextObjects, activeInHand, activeInDeck, activeInSignatureCards, activeOnBoard, description, options) {
    return this.createContextObject(modifiersContextObjects, false, true, activeInHand, activeInDeck, activeInSignatureCards, activeOnBoard, description, options);
  }

  static createContextObjectOnBoardToTargetEnemyPlayer(modifiersContextObjects, description, options) {
    return this.createContextObject(modifiersContextObjects, false, true, false, false, false, true, description, options);
  }

  static createContextObjectInHandDeckToTargetEnemyPlayer(modifiersContextObjects, description, options) {
    return this.createContextObject(modifiersContextObjects, false, true, true, true, false, false, description, options);
  }

  static createContextObjectOnBoardToTargetBothPlayers(modifiersContextObjects, description, options) {
    return this.createContextObject(modifiersContextObjects, true, true, false, false, false, true, description, options);
  }

  static createContextObjectInHandDeckToTargetBothPlayers(modifiersContextObjects, description, options) {
    return this.createContextObject(modifiersContextObjects, true, true, true, true, false, false, description, options);
  }

  onActivate()  {
    super.onActivate();
    //Logger.module("SDK").debug("#{@getGameSession().gameId} #{@getLogName()}.onActivate #{@getCard().getLogName()} board? #{@getIsOnBoardAndActiveForCache()} hand? #{@getIsInHandAndActiveForCache()} deck? #{@getIsInDeckAndActiveForCache()}")
    if (this.applyToOwnPlayer) {
      const ownPlayerId = this.getCard().getOwnerId();
      const ownGeneral = this.getGameSession().getGeneralForPlayerId(ownPlayerId);
      this.applyManagedModifiersFromModifiersContextObjectsOnce(this.modifiersContextObjects, ownGeneral);
    }

    if (this.applyToEnemyPlayer) {
      const opponentPlayerId = this.getGameSession().getOpponentPlayerIdOfPlayerId(this.getCard().getOwnerId());
      const opponentGeneral = this.getGameSession().getGeneralForPlayerId(opponentPlayerId);
      return this.applyManagedModifiersFromModifiersContextObjectsOnce(this.modifiersContextObjects, opponentGeneral);
    }
  }

  onDeactivate() {
    super.onDeactivate();
    if (this.applyToOwnPlayer) {
      const ownPlayerId = this.getCard().getOwnerId();
      const ownGeneral = this.getGameSession().getGeneralForPlayerId(ownPlayerId);
      this.removeManagedModifiersFromCard(ownGeneral);
    }

    if (this.applyToEnemyPlayer) {
      const opponentPlayerId = this.getGameSession().getOpponentPlayerIdOfPlayerId(this.getCard().getOwnerId());
      const opponentGeneral = this.getGameSession().getGeneralForPlayerId(opponentPlayerId);
      return this.removeManagedModifiersFromCard(opponentGeneral);
    }
  }
}
ModifierCardControlledPlayerModifiers.initClass();

module.exports = ModifierCardControlledPlayerModifiers;
