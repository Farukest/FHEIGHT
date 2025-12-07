/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const EVENTS = require('app/common/event_types');
const PlayerModifier = require('app/sdk/playerModifiers/playerModifier.js');
const ModifierBattlePet = require('app/sdk/modifiers/modifierBattlePet.js');
const ModifierTranscendance = require('app/sdk/modifiers/modifierTranscendance.js');
const StartTurnAction = require('app/sdk/actions/startTurnAction.js');
const RefreshExhaustionAction =  require('app/sdk/actions/refreshExhaustionAction');

class PlayerModifierBattlePetManager extends PlayerModifier {
  static initClass() {
  
    this.prototype.type ="PlayerModifierBattlePetManager";
    this.type ="PlayerModifierBattlePetManager";
  
    this.prototype.maxStacks = 1;
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);
    p.battlePetsToAct = [];
    p.battlePetActions = [];
    p.queuedBattlePets = []; // manually queued up battle pets (activate a battle pet mid turn)
    return p;
  }

  onEvent(event) {
    super.onEvent(event);

    if (this._private.listeningToEvents) {
      if (this.getGameSession().getIsRunningAsAuthoritative() && (event.type === EVENTS.after_step)) {
        const {
          action
        } = event.step;
        if (action instanceof StartTurnAction && (action.getOwnerId() === this.getCard().getOwnerId())) {
          // watch for my turn to trigger my battle pets
          return this.startBattlePetActions();
        } else if (!this.getGameSession().getIsBufferingEvents() && (this._private.queuedBattlePets.length > 0)) {
          // manually trigger individual battle pets
          return this.startBattlePetActions();
        } else if (action.getIsAutomatic()) {
          // if battle pets are currently acting, try to execute next battle pet action
          // otherwise, find next battle pet that needs to act and generate a new set of actions
          if (this._private.battlePetActions.length > 0) {
            return this.executeNextBattlePetAction();
          } else if (this._private.battlePetsToAct.length > 0) {
            this.generateNextBattlePetActions();
            return this.executeNextBattlePetAction();
          }
        }
      }
    }
  }

  startBattlePetActions() {
    const myOwnerId = this.getCard().getOwnerId();

    // always reset battle pet list before generting new actions
    this._private.battlePetsToAct = [];
    this._private.battlePetActions = [];
    // manually queued some battle pets to act
    if (this._private.queuedBattlePets.length > 0) {
      for (var battlePet of Array.from(this._private.queuedBattlePets)) {
        this._private.battlePetsToAct.push(battlePet); // add it to the list of battle pets to generate actions for
        if (battlePet.hasModifierType(ModifierTranscendance.type)) { // if battle pet has celerity, give it 2 chances to act
          this._private.battlePetsToAct.push(battlePet);
        }
      }
      this._private.queuedBattlePets = []; // reset any individually queued up battle pets
    // if there are no manually queued battle pets, then we'll activate all battle pets for this player
    } else {
      for (var unit of Array.from(this.getGameSession().getBoard().getUnits())) {
        // check for my uncontrollable battle pets - but ignore "tamed" battle pets as those can be manually controlled
        if ((myOwnerId != null) && (unit.getOwnerId() === myOwnerId) && unit.getIsUncontrollableBattlePet()) {
          this._private.battlePetsToAct.push(unit); // add it to the list of battle pets to generate actions for
          if (unit.hasActiveModifierType(ModifierTranscendance.type)) { // if battle pet has celerity, give it 2 chances to act
            this._private.battlePetsToAct.push(unit);
          }
        }
      }
    }

    if (this._private.battlePetsToAct.length > 0) {
      this.generateNextBattlePetActions();
      return this.executeNextBattlePetAction();
    }
  }

  executeNextBattlePetAction() {
    if (this._private.battlePetActions.length > 0) {
      const nextAction = this._private.battlePetActions.shift();

      // execute next action as long as source unit is still active
      let isValid = nextAction.getSource().getIsActive();
      if (isValid) {
        this.getGameSession().executeAction(nextAction);
        isValid = nextAction.getIsValid();
      }

      // if action was invalid for any reason, try again
      if (!isValid) {
        return this.executeNextBattlePetAction();
      }
    }
  }

  generateNextBattlePetActions() {
    // create actions for next battle pet. if next battle pet in list doesn't create any actions
    // keep trimming battle pets list until we find one that generates actions (or no more pets left to act)
    return (() => {
      const result = [];
      while ((this._private.battlePetsToAct.length > 0) && (this._private.battlePetActions.length === 0)) {
      // extract next battle pet from list
        var battlePet = this._private.battlePetsToAct[0];
        this._private.battlePetsToAct.shift();

        // attempt to generate battle pet actions
        if (battlePet.getIsActive()) {
          var battlePetModifier = battlePet.getModifierByClass(ModifierBattlePet);
          if (battlePetModifier != null) {
            result.push(this._private.battlePetActions = battlePetModifier.generateActions());
          } else {
            result.push(undefined);
          }
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }

  triggerBattlePet(battlePet) {
    if (this.getGameSession().getIsRunningAsAuthoritative() && (battlePet != null)) {
      if (battlePet.getIsUncontrollableBattlePet()) {
        return this._private.queuedBattlePets.push(battlePet);
      } else {
        // controllable battle pets get refreshed on activate
        const refreshExhaustionAction = new RefreshExhaustionAction(this.getGameSession());
        refreshExhaustionAction.setTarget(battlePet);
        return this.getGameSession().executeAction(refreshExhaustionAction);
      }
    }
  }
}
PlayerModifierBattlePetManager.initClass();

module.exports = PlayerModifierBattlePetManager;
