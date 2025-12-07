/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const Modifier = require('app/sdk/modifiers/modifier');
const MoveAction = require('app/sdk/actions/moveAction.js');
const AttackAction =   require('app/sdk/actions/attackAction.js');
const CardType = require('app/sdk/cards/cardType.js');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const UtilsPosition = require('app/common/utils/utils_position');
const ModifierImmuneToAttacks = require('app/sdk/modifiers/modifierImmuneToAttacks');
const ModifierImmuneToAttacksByGeneral = require('app/sdk/modifiers/modifierImmuneToAttacksByGeneral');
const ModifierImmuneToAttacksByRanged = require('app/sdk/modifiers/modifierImmuneToAttacksByRanged');
const ModifierRanged = require('app/sdk/modifiers/modifierRanged');
const ModifierStunned = require('app/sdk/modifiers/modifierStunned');
const ModifierBlastAttack = require('app/sdk/modifiers/modifierBlastAttack');
const ModifierCannotAttackGeneral = require('app/sdk/modifiers/modifierCannotAttackGeneral');
const _ = require('underscore');

const i18next = require('i18next');

class ModifierBattlePet extends Modifier {
  static initClass() {
  
    this.prototype.type = "ModifierBattlePet";
    this.type = "ModifierBattlePet";
  
    this.isKeyworded = true;
    this.keywordDefinition = i18next.t("modifiers.battle_pet_def");
  
    this.modifierName =i18next.t("modifiers.battle_pet_name");
    this.description = "";
    this.isHiddenToUI = true;
  
    this.prototype.maxStacks = 1;
    this.prototype.isRemovable = false;
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeOnBoard = true;
  }

  generateActions() {
    let attackAction, target, validAttackTargets;
    const battlePetDesiredActions = [];

    // if battle pet is stunned, don't try to act
    if (this.getCard().hasModifierClass(ModifierStunned)) {
      return battlePetDesiredActions;
    }

    // get starting position
    let attackFromPosition = this.getCard().getPosition();

    // check whether battle pet can attack
    const canAttack = this.getCard().getCanAttack();

    if (canAttack) {
      // find attackable targets in melee range
      validAttackTargets = this.findAttackableTargetsAroundPosition(attackFromPosition, true);
    }

    // if any enemies can be attacked within melee range without moving, pick one and attack
    if ((validAttackTargets != null) && (validAttackTargets.length > 0)) {
      target = validAttackTargets[this.getGameSession().getRandomIntegerForExecution(validAttackTargets.length)];
      attackAction = this.getCard().actionAttack(target);
      attackAction.setIsAutomatic(true);
      battlePetDesiredActions.push(attackAction);
    } else if (!this.getCard().getIsProvoked()) {
      // couldn't find a valid target without moving
      if (this.getCard().getCanMove()) {
        // move towards closest attackable target
        let validMovePositions = [];
        for (var movePath of Array.from(this.getCard().getMovementRange().getValidPositions(this.getGameSession().getBoard(), this.getCard()))) {
          for (var moveLocation of Array.from(movePath)) {
            validMovePositions.push(moveLocation);
          }
        }
        if (validMovePositions.length > 0) {
          validMovePositions = UtilsPosition.getUniquePositions(validMovePositions);
          attackFromPosition = this.chooseAggressivePosition(validMovePositions);
          const moveAction = this.getCard().actionMove(attackFromPosition);
          moveAction.setIsAutomatic(true);
          battlePetDesiredActions.push(moveAction);
        }
      }

      if (canAttack) {
        // find attackable targets in full attack range
        validAttackTargets = this.findAttackableTargetsAroundPosition(attackFromPosition, false);

        // if we found any enemies to attack, pick one and attack now
        if (validAttackTargets.length > 0) {
          target = validAttackTargets[this.getGameSession().getRandomIntegerForExecution(validAttackTargets.length)];
          attackAction = this.getCard().actionAttack(target);
          // this attack will actually happen from where this unit is about to move to NOT where the unit is located when the attack action is created
          attackAction.setSourcePosition(attackFromPosition);
          attackAction.setIsAutomatic(true);
          battlePetDesiredActions.push(attackAction);
        }
      }
    }
    return battlePetDesiredActions;
  }

  findAttackableTargetsAroundPosition(position, meleeOnly) {
    const forRanged = this.getCard().hasActiveModifierClass(ModifierRanged);
    const forGeneral = this.getCard().getIsGeneral();
    const forBlast = this.getCard().hasActiveModifierClass(ModifierBlastAttack);
    let potentialAttackTargets = [];

    // find potential targets
    if (forRanged) {
      potentialAttackTargets = this.getGameSession().getBoard().getUnits();
    } else {
      potentialAttackTargets = this.getGameSession().getBoard().getCardsAroundPosition(position, CardType.Unit, 1);
    }

    if (forBlast) { //finally we'll add targets that can be hit by blast to the previously found potential targets
      const unitsInRow = this.getGameSession().getBoard().getEntitiesInRow(position.y, CardType.Unit);
      const unitsInCol = this.getGameSession().getBoard().getEntitiesInColumn(position.x, CardType.Unit);
      potentialAttackTargets = potentialAttackTargets.concat(unitsInRow);
      potentialAttackTargets = potentialAttackTargets.concat(unitsInCol);
      potentialAttackTargets = _.uniq(potentialAttackTargets);
    }

    // find all potential attackable targets
    const validAttackTargets = [];
    let foundRangedProvoker = false;
    let foundProvoker = false;
    for (var unit of Array.from(potentialAttackTargets)) {
      if (this.getIsTargetAttackable(unit, forRanged, forGeneral)) {
        // check for provokers
        if (forRanged && unit.getIsRangedProvoker()) {
          if (!foundRangedProvoker) { validAttackTargets.length = 0; }
          foundRangedProvoker = true;
          validAttackTargets.push(unit);
        } else if (unit.getIsProvoker() && ((Math.abs(unit.getPositionX() - position.x) <= 1) && (Math.abs(unit.getPositionY() - position.y) <= 1))) {
          if (!foundProvoker) { validAttackTargets.length = 0; }
          foundProvoker = true;
          validAttackTargets.push(unit);
        } else if (!foundProvoker && !foundRangedProvoker && (!meleeOnly || ((Math.abs(unit.getPositionX() - position.x) <= 1) && (Math.abs(unit.getPositionY() - position.y) <= 1)))) {
          validAttackTargets.push(unit);
        }
      }
    }

    // now that we've filtered targets that we can actually attack, pick the best one
    return this.getBestTargetUnitsfromPosition(position, validAttackTargets);
  }

  getIsTargetAttackable(target, forRanged, forGeneral) {
    let attackable = !target.getIsSameTeamAs(this.getCard()) &&
      (target.getHP() > 0) &&
      (!target.getIsGeneral() ||
        !this.getCard().hasActiveModifierClass(ModifierCannotAttackGeneral));
    if (attackable) {
      // immunity
      for (var modifier of Array.from(target.getModifiers())) {
        if (modifier.getIsActive()) {
          // attack immunity
          if (modifier instanceof ModifierImmuneToAttacks) {
            if (modifier instanceof ModifierImmuneToAttacksByRanged) {
              if (forRanged) {
                attackable = false;
                break;
              }
            } else if (modifier instanceof ModifierImmuneToAttacksByGeneral) {
              if (forGeneral) {
                attackable = false;
                break;
              }
            } else {
              attackable = false;
              break;
            }
          }
        }
      }
    }

    return attackable;
  }

  getBestTargetUnitsfromPosition(position, validTargets) {
    let closestUnits = [];
    // find the closest position to the desired position that this minion can actually attack
    let bestAbsoluteDistance = 9999;
    for (var unit of Array.from(validTargets)) {
      var targetPosition = unit.getPosition();
      var absoluteDistance = Math.abs(targetPosition.x - position.x) + Math.abs(targetPosition.y - position.y);
      // found a new best target position
      if (absoluteDistance < bestAbsoluteDistance) {
        bestAbsoluteDistance = absoluteDistance;
        closestUnits = []; // reset potential targets
        closestUnits.push(unit);
      //found an equally good target position
      } else if (absoluteDistance === bestAbsoluteDistance) {
        closestUnits.push(unit);
      }
    }
    return closestUnits;
  }

  chooseAggressivePosition(positions) {
    let absoluteDistance, position;
    const closestPositions = [];
    const forRanged = this.getCard().hasActiveModifierClass(ModifierRanged);
    const forGeneral = this.getCard().getIsGeneral();

    // find the closest enemy this minion can move to and melee
    let bestAbsoluteDistance = 9999;
    for (position of Array.from(positions)) { // check each position this unit could move to
      if (!this.getGameSession().getBoard().getUnitAtPosition(position)) { // if position is not obstructed
        // check for enemies within melee range of this position
        var enemyFound = false;
        for (var card of Array.from(this.getGameSession().getBoard().getCardsAroundPosition(position, CardType.Unit, 1))) {
          if (this.getIsTargetAttackable(card, forRanged, forGeneral)) {
            enemyFound = true;
            absoluteDistance = Math.abs(this.getCard().position.x - position.x) + Math.abs(this.getCard().position.y - position.y);
            // found a new best target position
            if (absoluteDistance < bestAbsoluteDistance) {
              bestAbsoluteDistance = absoluteDistance;
              closestPositions.length = 0; // reset potential target positions
              closestPositions.push(position);
            //found an equally good target position
            } else if (absoluteDistance === bestAbsoluteDistance) {
              closestPositions.push(position);
            }
          }
        }
      }
    }

    if (closestPositions.length === 0) { // haven't found any enemies we can move towards and melee, then just move towards the closest enemy
      for (position of Array.from(positions)) {
        if (!this.getGameSession().getBoard().getUnitAtPosition(position)) { // if position is not obstructed
          for (var potentialTarget of Array.from(this.getGameSession().getBoard().getEnemyEntitiesForEntity(this.getCard(), CardType.Unit))) {
            absoluteDistance = Math.abs(potentialTarget.position.x - position.x) + Math.abs(potentialTarget.position.y - position.y);
            // found a new best target position
            if (absoluteDistance < bestAbsoluteDistance) {
              bestAbsoluteDistance = absoluteDistance;
              closestPositions.length = 0; // reset potential target positions
              closestPositions.push(position);
              //found an equally good target position
            } else if (absoluteDistance === bestAbsoluteDistance) {
              closestPositions.push(position);
            }
          }
        }
      }
    }

    // pick a random position
    return closestPositions[this.getGameSession().getRandomIntegerForExecution(closestPositions.length)];
  }

  onValidateAction(actionEvent) {
    const a = actionEvent.action;
    if (a.getIsValid()) {
      const card = this.getCard();
      // cannot explicitly move or attack with battle pets UNLESS they are being modified to be player controllable
      if ((card != null) && (card === a.getSource()) && card.getIsUncontrollableBattlePet() && (a instanceof MoveAction || a instanceof AttackAction) && !a.getIsAutomatic() && !a.getIsImplicit()) {
        return this.invalidateAction(a, card.getPosition(), i18next.t("modifiers.battle_pet_error"));
      }
    }
  }
}
ModifierBattlePet.initClass();

module.exports = ModifierBattlePet;
