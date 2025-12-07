/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require("app/common/config");
const UtilsJavascript = require("app/common/utils/utils_javascript");
const Validator = require("./../validators/validator");
const EndTurnAction = require("app/sdk/actions/endTurnAction");
const _ = require('underscore');
const i18next = require('i18next');

class Instruction extends Validator {
  static initClass() {
  
    this.prototype.type ="Instruction";
    this.type ="Instruction";
  
    this.prototype.triggerStepIndex =null;
  
    this.prototype.isComplete =false;
    this.prototype.failedLabel ="Invalid move";
    this.prototype.showFailureOnSource = false; // whether to show failure label on source or target position
    this.prototype.sourcePosition =null; // Required source tile x-y indices
    this.prototype.targetPosition =null; // Required target tile x-y indices
    this.prototype.handIndex =null; // Required hand index
    this.prototype.instructionArrowPositions =null; // optional array of positions to drop instructional arrows at start of instruction
    this.prototype.persistentInstructionArrowPosition =null; // optional x-y tile index of where to place a persistent instruction arrow
    this.prototype.preventSelectionUntilLabelIndex = null; // optional integer, whether or not to prevent my player from selecting units until the label at this index plays
    this.prototype.disableReadiness = false; // optional boolean, disables readiness indicators on units (this may grow into filtering and applying visual tags)
    this.prototype.generalSpeech = null; //optional string of general speech
    this.prototype.generalSpeechYPosition = null; // optional y descriptor for positioning general speech
  
    // TODO: Convert into a class
    // array of objects containing 2 or more values
    // - label {string}
    // - position {object} - tile indices
    // - positionAtHandIndex {integer} - hand index to display at
    // - positionAtManaIndex {integer} - mana index to point to
    // - positionAtMyHealth {boolean} - whether to position at my health
    // - positionAtEnemyHealth {boolean} - whether to position at enemy health
    // - positionAtEndTurn {boolean} - whether to position at the end turn button
    // - positionAtPlayerArtifactIndex {ineger} - positions label at one of player's artifacts (0 1 or 2)
    // - positionAtReplace {boolean} - whether to position at replace node
    // - positionAtSignatureSpell {boolean} - whether to position at player's signature spell node
    // - duration {optional, number}
    // - delay {optional, number} seconds to delay before showing this message
    // - instructionArrowPositions {optional, array of positions} - places to drop an instructional arrow at start of instruction label
    // - isPersistent {optional, boolean} - whether or not this exits on it's own or waits for an interaction to continue sequence
    // - isNotDismissable {optional, boolean} - whether or not this instruction can be clicked to skip (defaults to false)
    // - triggersInstructionIndex {optional, integer} - which instruction label to play after this one completes, defaults to the next instruction (or itself if last)
    // instruction label focus directions:
    // - focusUp: {optional, boolean} - direction this instruction should focus, defaults to false which means focusDown
    // - focusDown: {optional, boolean} - direction this instruction should focus, defaults to false which means focusDown
    // - focusLeft: {optional, boolean} - direction this instruction should focus, defaults to false which means focusDown
    // - focusRight: {optional, boolean} - direction this instruction should focus, defaults to false which means focusDown
    // Speech label options
    // - isSpeech {boolean} - true to activate this as a general speech node instead of instruction node
    // - yPosition {Number} - percentage up the screen for speech to come in from
    // - isOpponent {boolean} - optional - defaults to false, if true
    this.prototype.instructionLabels = null; // array of objects with the options described above
  
    this.prototype.expectedActionType =null;
  }

  /**
   * Instruction constructor.
   * @param  {Object}  params  Parameters that will get copied into this object to override the default properties.
   * @public
   */
  constructor(params){
    super();

    UtilsJavascript.fastExtend(this,params);
  }

  /**
   * Check if a specified board position is valid as this instruction's source position.
   * @param  {Point}  p  Position to compare with source.
   * @public
   */
  isValidSourcePosition(p){
    return (this.sourcePosition == null) || ((p.x === this.sourcePosition.x) && (p.y === this.sourcePosition.y));
  }

  /**
   * Check if a specified board position is valid as this instruction's target position.
   * @param  {Point}  p  Position to compare with target.
   * @public
   */
  isValidTargetPosition(p){
    return (this.targetPosition == null) || ((p.x === this.targetPosition.x) && (p.y === this.targetPosition.y));
  }

  /**
   * Check if a specified hand index is valid as this instruction's required hand index
   * @param  {integer}  handIndex  handIndex to compare with required handIndex of instruction
   * @public
   */
  isValidHandIndex(handIndex){
    return (this.handIndex == null) || (this.handIndex === handIndex);
  }

  /**
   * Called when an action is executed on the .
   * @param  {Point}  p  Position to compare with target.
   * @public
   */
  onValidateAction(e){
    super.onValidateAction(e);
    const {
      action
    } = e;
    if ((action != null) && action.getIsValid() && !action.getIsImplicit() && !action.getIsAutomatic()) {
      if ((action.type === this.expectedActionType) && this.isValidTargetPosition(action.targetPosition) && this.isValidSourcePosition(action.sourcePosition) && this.isValidHandIndex(action.indexOfCardInHand)) {
        return action.setIsValid(true);
      } else {
        return this.invalidateAction(action, this._getFailureMessagePosition(), this.failedLabel);
      }
    }
  }

  _getFailureMessagePosition() {
    // first rely on the existence of source position, defaults to target position of no source
    if (!this.sourcePosition) {
      return this.targetPosition;
    }

    if (this.showFailureOnSource) {
      return this.sourcePosition;
    } else {
      return this.targetPosition;
    }
  }

  static createEndTurnInstruction(){
    const endTurnInstruction = new Instruction({
//      failedLabel:"Click Here."
      failedLabel:i18next.t("tutorial.end_your_turn_message"),
      expectedActionType:EndTurnAction.type,
      instructionLabels:[{
        label:i18next.t("tutorial.end_your_turn_message"),
        positionAtEndTurn:true,
        triggersInstructionIndex:0,
        delay: CONFIG.INSTRUCTIONAL_ULTRAFAST_DURATION,
        duration: CONFIG.INSTRUCTIONAL_SHORT_DURATION
      }
      ]
    });

    return endTurnInstruction;
  }

    // legacy - remove once there is less churn on tutorial
//  @getPositionForEndTurn: () ->
//    return {x:8.9,y:-.25}
//
//  @getPositionForManaBar: () ->
//#    return {x:-1,y:2.5}
//    return {x:-1,y:3.5} # points to 3rd mana crystal
//
//  @getPositionForReplace: () ->
//#    return {x:-1.5,y:-.5}
//    return {x:-1.5,y:-.5}

  // TODO: either tie to cardnode or use real pixel values
  static getPositionForHandIndex(index) {
//    return {x:index*7/5,y:-1}
    return {x:(-.1 + ((index*7)/5)),y:-.25};
  }
}
Instruction.initClass();

module.exports = Instruction;
