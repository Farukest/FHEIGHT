/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Challenge = require("app/sdk/challenges/challenge");
const Lesson2     = require('./lesson2');
const Instruction   = require('app/sdk/challenges/instruction');
const MoveAction     = require('app/sdk/actions/moveAction');
const AttackAction   = require('app/sdk/actions/attackAction');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const PlayCardAction = require('app/sdk/actions/playCardAction');
const ReplaceCardFromHandAction = require('app/sdk/actions/replaceCardFromHandAction');
const EndTurnAction   = require('app/sdk/actions/endTurnAction');
const Cards       = require('app/sdk/cards/cardsLookupComplete');
const Deck       = require('app/sdk/cards/deck');
const AgentActions = require('app/sdk/agents/agentActions');
const CONFIG = require('app/common/config');
const RSX = require('app/data/resources');
const GameSession = require('app/sdk/gameSession');
const ChallengeCategory = require('app/sdk/challenges/challengeCategory');
const PlaySignatureCardAction = require('app/sdk/actions/playSignatureCardAction');
const _ = require('underscore');
const i18next = require('i18next');

class LessonFour extends Challenge {
  static initClass() {
  
    this.type = "LessonFour";
    this.prototype.type = "LessonFour";
    this.prototype.categoryType = ChallengeCategory.tutorial.type;
  
    this.prototype.name = i18next.t("tutorial.lesson_4_title");
    this.prototype.description = i18next.t("tutorial.lesson_4_description");
    this.prototype.difficulty = i18next.t("tutorial.lesson_4_difficulty");
    this.prototype.otkChallengeStartMessage = i18next.t("tutorial.lesson_4_start_message");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("tutorial.lesson_4_failure_message")
    ];
  
    this.prototype.iconUrl = RSX.speech_portrait_draugar.img;
    this.prototype._musicOverride = RSX.music_battlemap_vanar.audio;
  
    this.prototype.battleMapTemplateIndex = 0;
    this.prototype.customBoard = false;
    this.prototype.startingHandSizeOpponent = 6;
    this.prototype.usesResetTurn = false;
    this.prototype.skipMulligan = false;
  }

  constructor(){
    super();

    this.prerequisiteChallengeTypes.push(Lesson2.type);
    this.hiddenUIElements.push("CardCount");
    this.hiddenUIElements = _.without(this.hiddenUIElements, "SignatureCard");

    this.unmulliganableHandIndices = [0,1,2,3];
    this.requiredMulliganHandIndices = [4];

    this.mulliganInstructionLabel = {
      label:i18next.t("tutorial.lesson_4_mulligan_instruction_1"),
      positionAtHandIndex: 4,
      isPersistent: true,
      isNotDismissable: true
    };

    this.addInstructionToQueueForTurnIndex(0,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_4_turn_0_failure_message_1"),
      handIndex: 3,
      expectedActionType: PlayCardFromHandAction.type,
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_4_turn_0_instruction_1"),
        positionAtHandIndex: 3,
        duration: CONFIG.INSTRUCTIONAL_ULTRAFAST_DURATION
      }
      , {
        label:i18next.t("tutorial.lesson_4_turn_0_instruction_2"),
        positionAtHandIndex: 3,
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(0,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_4_turn_0_failure_message_2"),
      sourcePosition: {
        x:2,
        y:2
      },
      targetPosition: {
        x:4,
        y:2
      },
      preventSelectionUntilLabelIndex:1,
      expectedActionType: MoveAction.type,
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_4_turn_0_instruction_3"),
        isSpeech:true,
        isPersistent: true,
        isOpponent:false,
        yPosition:.6
      }
      , {
        label:i18next.t("tutorial.lesson_4_turn_0_instruction_4"),
        position: {
          x:2,
          y:2
        },
        focusDown:true,
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(0,Instruction.createEndTurnInstruction());

    this.addInstructionToQueueForTurnIndex(1,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_4_turn_1_failure_message_1"),
      handIndex: 1,
      targetPosition: {
        x:4,
        y:1
      },
      expectedActionType: PlayCardFromHandAction.type,
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_4_turn_1_instruction_1"),
        positionAtHandIndex:1,
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(1,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_4_turn_1_failure_message_2"),
      handIndex: 4,
      expectedActionType: PlayCardFromHandAction.type,
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_4_turn_1_instruction_2"),
        positionAtHandIndex: 4,
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(1,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_4_turn_1_failure_message_3"),
      expectedActionType: AttackAction.type,
      sourcePosition: {
        x:4,
        y:2
      },
      targetPosition: {
        x:5,
        y:2
      },
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_4_turn_1_instruction_3"),
        position: {
          x:4,
          y:2
        },
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(1,Instruction.createEndTurnInstruction());

    this.addInstructionToQueueForTurnIndex(2,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_4_turn_2_failure_message_1"),
      expectedActionType: PlaySignatureCardAction.type,
      targetPosition: {
        x:4,
        y:1
      },
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_4_turn_2_instruction_1"),
        positionAtSignatureSpell: true,
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(2,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_4_turn_2_failure_message_2"),
      expectedActionType: AttackAction.type,
      sourcePosition: {
        x:4,
        y:1
      },
      targetPosition: {
        x:5,
        y:2
      },
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_4_turn_2_instruction_2"),
        position: {
          x:5,
          y:2
        },
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(2,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_4_turn_2_failure_message_3"),
      expectedActionType: AttackAction.type,
      sourcePosition: {
        x:4,
        y:2
      },
      targetPosition: {
        x:5,
        y:2
      },
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_4_turn_2_instruction_3"),
        position: {
          x:5,
          y:2
        },
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(2,Instruction.createEndTurnInstruction());

    this.snapShotOnPlayerTurn = 3;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Tutorial.TutorialSignatureGeneral},
      {id: Cards.Tutorial.TutorialStormmetalGolem},
      {id: Cards.TutorialSpell.TutorialDragoneboneGolem},
      {id: Cards.Tutorial.TutorialThornNeedler},
      {id: Cards.TutorialArtifact.TutorialSunstoneBracers},
      {id: Cards.TutorialArtifact.TutorialSunstoneBracers},
      {id: Cards.TutorialArtifact.TutorialSunstoneBracers},
      {id: Cards.Tutorial.TutorialDragoneboneGolem},
      {id: Cards.TutorialArtifact.TutorialSunstoneBracers},
      {id: Cards.Tutorial.TutorialStormmetalGolem},
      {id: Cards.Tutorial.TutorialAdept},
      {id: Cards.Tutorial.TutorialStormmetalGolem}
    ];
  }

  getOpponentPlayerDeckData(gameSession){
    return [
      {id: Cards.Tutorial.TutorialOpponentGeneral4},
      {id: Cards.TutorialSpell.TutorialFireOrb}
    ];
  }

  setupBoard(gameSession) {
    super.setupBoard(gameSession);

    const myPlayerId = gameSession.getMyPlayerId();
    const opponentPlayerId = gameSession.getOpponentPlayerId();

    const general1 = gameSession.getGeneralForPlayerId(myPlayerId);
    general1.setPosition({x: 2, y: 2});
    general1.maxHP = 12;
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 6, y: 2});
    return general2.maxHP = 26;
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
        label:i18next.t("tutorial.lesson_4_artifact_instruction_1"),
        positionAtPlayerArtifactIndex: 0,
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      , {
        label:i18next.t("tutorial.lesson_4_artifact_instruction_2"),
        positionAtPlayerArtifactIndex: 0,
        duration: CONFIG.INSTRUCTIONAL_SHORT_DURATION
      }
    ]));
    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentActionMoveUnit("general",{x:-1,y:0}));
    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentActionAttackWithUnit("general",{x:4,y:2},true));
    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("tutorial.lesson_4_taunt_1"),
      isSpeech:true,
      yPosition:.6,
      isPersistent: true,
      isOpponent: true
    }
    ]));

    this._opponentAgent.addActionForTurn(1,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("tutorial.lesson_4_bloodborn_instruction_1"),
      positionAtSignatureSpell: true,
      delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
    }
    ]));
    this._opponentAgent.addActionForTurn(1,AgentActions.createAgentActionAttackWithUnit("general",{x:4,y:1},true));

    this._opponentAgent.addActionForTurn(2,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("tutorial.lesson_4_taunt_2"),
      isSpeech:true,
      yPosition:.6,
      isPersistent: true,
      isOpponent: true
    }
    ]));
    this._opponentAgent.addActionForTurn(2,AgentActions.createAgentActionAttackWithUnit("general",{x:4,y:2},true));

    //@_opponentAgent.addActionForTurn(1,AgentActions.createAgentActionMoveUnit("general",{x:1,y:-1}))
    //@_opponentAgent.addActionForTurn(1,AgentActions.createAgentSoftActionTagUnitAtPosition("enemygro",{x:5,y:2}))
    //@_opponentAgent.addActionForTurn(1,AgentActions.createAgentActionMoveUnit("enemygro",{x:-2,y:0}))
    //@_opponentAgent.addActionForTurn(1,AgentActions.createAgentActionAttackWithUnit("enemygro",{x:2,y:2},true))

    // cast otk finisher on player general
    this._opponentAgent.addActionForTurn(3,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("tutorial.lesson_4_taunt_3"),
      isSpeech:true,
      yPosition:.7,
      isPersistent: true,
      isOpponent: true
    }
    ]));
    return this._opponentAgent.addActionForTurn(3,AgentActions.createAgentActionPlayCardFindPosition(0,() => {
      return [GameSession.getInstance().getGeneralForPlayer1().getPosition()];
    }));
  }
}
LessonFour.initClass();

//    @_opponentAgent.addActionForTurn(1,AgentActions.createAgentActionPlayCard(1,{x:4,y:2}))
//    @_opponentAgent.addActionForTurn(1,AgentActions.createAgentActionAttackWithUnit("general",{x:4,y:2},true))
//    @_opponentAgent.addActionForTurn(1,AgentActions.createAgentActionPlayCard(2,{x:4,y:2}))
//    @_opponentAgent.addActionForTurn(1,AgentActions.createAgentSoftActionShowInstructionLabels([
//      label:"I really hate Ranged attacks..."
//      isSpeech:true
//      yPosition:.6
//      isPersistent: true
//      isOpponent: false
//    ]))

//    @_opponentAgent.addActionForTurn(2,AgentActions.createAgentActionMoveUnit("general",{x:1,y:-1}))
//    @_opponentAgent.addActionForTurn(2,AgentActions.createAgentActionPlayCard(3,{x:7,y:0}))
//    @_opponentAgent.addActionForTurn(2,AgentActions.createAgentActionPlayFollowup(Cards.Spell.CloneSourceEntity2X,{x:7,y:0},{x:7,y:1}))
//    @_opponentAgent.addActionForTurn(2,AgentActions.createAgentActionPlayFollowup(Cards.Spell.CloneSourceEntity,{x:7,y:1},{x:8,y:1}))
//    @_opponentAgent.addActionForTurn(2,AgentActions.createAgentActionAttackWithUnit("general",{x:6,y:2},true))
    //@_opponentAgent.addActionForTurn(2,AgentActions.createAgentActionPlayCard(4,{x:6,y:2}))
    //@_opponentAgent.addActionForTurn(2,AgentActions.createAgentActionPlayCard(5,{x:4,y:3}))




module.exports = LessonFour;
