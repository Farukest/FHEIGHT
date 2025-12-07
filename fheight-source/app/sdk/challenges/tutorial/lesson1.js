/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Challenge = require("app/sdk/challenges/challenge");
const Instruction   = require('app/sdk/challenges/instruction');
const MoveAction     = require('app/sdk/actions/moveAction');
const AttackAction   = require('app/sdk/actions/attackAction');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const EndTurnAction   = require('app/sdk/actions/endTurnAction');
const Cards       = require('app/sdk/cards/cardsLookupComplete');
const Deck       = require('app/sdk/cards/deck');
const AgentActions = require('app/sdk/agents/agentActions');
const CONFIG = require('app/common/config');
const RSX = require('app/data/resources');
const GameSession = require('app/sdk/gameSession');
const ChallengeCategory = require('app/sdk/challenges/challengeCategory');
const i18next = require('i18next');

class LessonOne extends Challenge {
  static initClass() {
  
    this.type = "LessonOne";
    this.prototype.type = "LessonOne";
    this.prototype.categoryType = ChallengeCategory.tutorial.type;
  
    this.prototype.name = i18next.t("tutorial.lesson_1_title");
    this.prototype.description = i18next.t("tutorial.lesson_1_description");
    this.prototype.difficulty = i18next.t("tutorial.lesson_1_difficulty");
    this.prototype.otkChallengeStartMessage = i18next.t("tutorial.lesson_1_start_message");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("tutorial.lesson_1_failure_message")
    ];
  
    this.prototype.iconUrl = RSX.speech_portrait_calibero.img;
    this.prototype._musicOverride = RSX.music_battle_tutorial.audio;
  
    this.prototype.battleMapTemplateIndex = 0;
    this.prototype.startingHandSizePlayer = 0;
    this.prototype.startingHandSizeOpponent = 4;
    this.prototype.usesResetTurn = false;
  }

  constructor(){
    super();

    this.showCardInstructionalTextForTurns = 7;

    this.hiddenUIElements.push("CardCount");
    this.hiddenUIElements.push("Replace");

    this.addInstructionToQueueForTurnIndex(0,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_1_turn_0_failure_message_1"),
      sourcePosition: {
        x:2,
        y:2
      },
      targetPosition: {
        x:4,
        y:2
      },
      expectedActionType: MoveAction.type,
      preventSelectionUntilLabelIndex: 5,
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_1_turn_0_instruction_1"),
        position: {
          x:2,
          y:2
        },
        triggersInstructionIndex:1,
        //focusRight:true
        duration: CONFIG.INSTRUCTIONAL_ULTRAFAST_DURATION
      }
      , {
        label:i18next.t("tutorial.lesson_1_turn_0_instruction_2"),
        position: {
          x:2,
          y:2
        },
        triggersInstructionIndex:2,
        duration: CONFIG.INSTRUCTIONAL_ULTRAFAST_DURATION
      }
      , {
        label:i18next.t("tutorial.lesson_1_turn_0_instruction_3"),
        positionAtMyHealth:true,
        triggersInstructionIndex:3,
        focusUp:true,
        duration: CONFIG.INSTRUCTIONAL_ULTRAFAST_DURATION
      }
      , {
//        label:"This is your [Enemy's Health]!"
        label:i18next.t("tutorial.lesson_1_turn_0_instruction_4"),
        positionAtEnemyHealth:true,
        triggersInstructionIndex:4,
        focusUp:true,
        duration: CONFIG.INSTRUCTIONAL_ULTRAFAST_DURATION
      }
      , {
        label:i18next.t("tutorial.lesson_1_turn_0_instruction_5"),
        position: {
          x:2,
          y:2
        },
        triggersInstructionIndex:5
      }
      , {
        label:i18next.t("tutorial.lesson_1_turn_0_instruction_6"),
        position: {
          x:2,
          y:2
        }
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(0,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_1_turn_0_failure_message_2"),
      sourcePosition: {
        x:4,
        y:2
      },
      targetPosition: {
        x:5,
        y:2
      },
      expectedActionType: AttackAction.type,
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_1_turn_0_instruction_7"),
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY,
        position: {
          x:5,
          y:2
        },
        triggersInstructionIndex:0
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(0, Instruction.createEndTurnInstruction());

    this.addInstructionToQueueForTurnIndex(1,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_1_turn_1_failure_message_1"),
      expectedActionType: PlayCardFromHandAction.type,
      handIndex: 0,
      preventSelectionUntilLabelIndex: 2,
      targetPosition: {
        x:5,
        y:1
      },
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_1_turn_1_instruction_1"),
        positionAtManaIndex:2,
        focusUp:true,
        triggersInstructionIndex:1,
        duration: CONFIG.INSTRUCTIONAL_ULTRAFAST_DURATION
      }
      , {
        label:i18next.t("tutorial.lesson_1_turn_1_instruction_2"),
        isSpeech:true,
        isPersistent:true,
        yPosition: .6,
        triggersInstructionIndex:2
      }
      , {
        label:i18next.t("tutorial.lesson_1_turn_1_instruction_3"),
        duration: 60,
        positionAtHandIndex: 0,
        triggersInstructionIndex:2
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(1,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_1_turn_1_failure_message_2"),
      expectedActionType: AttackAction.type,
      sourcePosition: {
        x:4,
        y:2
      },
      targetPosition: {
        x:5,
        y:2
      },
      preventSelectionUntilLabelIndex: 1,
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_1_turn_1_instruction_4"),
        position: {
          x:5,
          y:1
        },
        focusRight:true,
        duration: CONFIG.INSTRUCTIONAL_ULTRAFAST_DURATION,
        triggersInstructionIndex:1
      }
      , {
        label:i18next.t("tutorial.lesson_1_turn_1_instruction_4"),
        position: {
          x:5,
          y:2
        },
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(1,Instruction.createEndTurnInstruction());

    this.addInstructionToQueueForTurnIndex(2,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_1_turn_2_failure_message_1"),
      handIndex: 0,
      targetPosition: {
        x:5,
        y:2
      },
      expectedActionType: PlayCardFromHandAction.type,
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_1_turn_2_instruction_1"),
        positionAtHandIndex: 0,
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY,
        triggersInstructionIndex:0
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(2,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_1_turn_2_failure_message_2"),
      expectedActionType: AttackAction.type,
      sourcePosition: {
        x:4,
        y:2
      },
      targetPosition: {
        x:5,
        y:1
      },
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_1_turn_2_instruction_2"),
        position: {
          x:5,
          y:1
        },
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY,
        triggersInstructionIndex:0,
        focusLeft: true
      }
      ]
    }));

    // TODO: this needs to be click through
    this.addInstructionToQueueForTurnIndex(2,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_1_turn_2_failure_message_3"),
      expectedActionType:EndTurnAction.type,
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_1_turn_2_instruction_3"),
        isPersistent: true,
        isSpeech: true,
        yPosition: .6,
        triggersInstructionIndex:null
      }
      ]
    }));

    this.snapShotOnPlayerTurn = 3;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Tutorial.TutorialGeneral},
      {id: Cards.Tutorial.TutorialBrightmossGolem},
      {id: Cards.Tutorial.TutorialThornNeedler},
      {id: Cards.Tutorial.TutorialSkyrockGolem},
      {id: Cards.Tutorial.TutorialStormmetalGolem},
      {id: Cards.Tutorial.TutorialBrightmossGolem},
      {id: Cards.Tutorial.TutorialIceGolem},
      {id: Cards.Tutorial.TutorialBloodshardGolem}
    ];
  }

  getOpponentPlayerDeckData(gameSession){
    return [
      {id: Cards.Tutorial.TutorialOpponentGeneral1},
      {id: Cards.TutorialSpell.TutorialFireOrb},
      {id: Cards.Tutorial.TutorialGuardian},
      {id: Cards.Tutorial.TutorialLion},
      {id: Cards.Tutorial.TutorialBrawler}
    ];
  }

  setupBoard(gameSession) {
    super.setupBoard(gameSession);

    const myPlayerId = gameSession.getMyPlayerId();
    const opponentPlayerId = gameSession.getOpponentPlayerId();

    const general1 = gameSession.getGeneralForPlayerId(myPlayerId);
    general1.setPosition({x: 2, y: 2});
    general1.maxHP = 10;
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 5, y: 2});
    return general2.maxHP = 10;
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    // turn 1
    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("tutorial.lesson_1_turn_0_instruction_8"),
      positionAtHandIndex:0,
      triggersInstructionIndex:1,
      duration: CONFIG.INSTRUCTIONAL_ULTRAFAST_DURATION
    }
//    ,
//      label:"Bring it on!"
//      isSpeech:true
//      yPosition:.7
//      isPersistent: true
//      isOpponent: true
    ]));
    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentActionAttackWithUnit("general",{x:-1,y:0},false));
    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("tutorial.lesson_1_taunt_1"),
      isSpeech:true,
      yPosition:.6,
      isPersistent: true,
      isOpponent: true
    }
    ]));
    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentActionPlayCard(0,{x:6,y:1}));
    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionTagUnitAtPosition("golem",{x:6,y:1}));

    // turn 2
    this._opponentAgent.addActionForTurn(1,AgentActions.createAgentActionAttackWithUnit("golem",{x:-1,y:0},false));
    this._opponentAgent.addActionForTurn(1,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("tutorial.lesson_1_taunt_2"),
      isSpeech:true,
      yPosition:.6,
      isPersistent: true,
      isOpponent: true
    }
    ]));
    this._opponentAgent.addActionForTurn(1,AgentActions.createAgentActionMoveUnit("general",{x:1,y:-1}));
    this._opponentAgent.addActionForTurn(1,AgentActions.createAgentActionPlayCard(1,{x:5,y:1}));
    this._opponentAgent.addActionForTurn(1,AgentActions.createAgentSoftActionTagUnitAtPosition("tutorialLion",{x:5,y:1}));

    // turn 3
//    @_opponentAgent.addActionForTurn(2,AgentActions.createAgentSoftActionShowInstructionLabels([
//      label:"I will unleash my power."
//      isSpeech:true
//      yPosition:.6
//      isPersistent: true
//      isOpponent: true
//    ]))
    this._opponentAgent.addActionForTurn(2,AgentActions.createAgentActionMoveUnit("general",{x:2,y:0}));
    this._opponentAgent.addActionForTurn(2,AgentActions.createAgentActionPlayCard(2,{x:7,y:1}));

    // cast otk finisher on player general
    this._opponentAgent.addActionForTurn(3,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("tutorial.lesson_1_taunt_3"),
      isSpeech:true,
      yPosition:.7,
      isPersistent: true,
      isOpponent: true
    }
    ]));
    return this._opponentAgent.addActionForTurn(3,AgentActions.createAgentActionPlayCardFindPosition(3,() => {
      return [GameSession.getInstance().getGeneralForPlayer1().getPosition()];
    }));
  }
}
LessonOne.initClass();



module.exports = LessonOne;
