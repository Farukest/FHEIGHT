/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Challenge = require("app/sdk/challenges/challenge");
const Lesson1     = require('./lesson1');
const Instruction   = require('app/sdk/challenges/instruction');
const MoveAction     = require('app/sdk/actions/moveAction');
const AttackAction   = require('app/sdk/actions/attackAction');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const ReplaceCardFromHandAction = require('app/sdk/actions/replaceCardFromHandAction');
const EndTurnAction   = require('app/sdk/actions/endTurnAction');
const Cards       = require('app/sdk/cards/cardsLookupComplete');
const Deck       = require('app/sdk/cards/deck');
const AgentActions = require('app/sdk/agents/agentActions');
const CONFIG = require('app/common/config');
const CardType = require('app/sdk/cards/cardType');
const RSX = require('app/data/resources');
const GameSession = require('app/sdk/gameSession');
const ChallengeCategory = require('app/sdk/challenges/challengeCategory');
const i18next = require('i18next');

class LessonTwo extends Challenge {
  static initClass() {
  
    this.type = "LessonTwo";
    this.prototype.type = "LessonTwo";
    this.prototype.categoryType = ChallengeCategory.tutorial.type;
  
  
    this.prototype.name = i18next.t("tutorial.lesson_2_title");
    this.prototype.description = i18next.t("tutorial.lesson_2_description");
    this.prototype.difficulty = i18next.t("tutorial.lesson_2_difficulty");
    this.prototype.otkChallengeStartMessage = i18next.t("tutorial.lesson_2_start_message");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("tutorial.lesson_2_failure_message")
    ];
  
    this.prototype.iconUrl = RSX.speech_portrait_rook.img;
    this.prototype._musicOverride = RSX.music_battlemap_songhai.audio;
  
    this.prototype.userIsPlayer1 = false;
    this.prototype.startingHandSizePlayer = 2;
    this.prototype.battleMapTemplateIndex = 5;
    this.prototype.customBoard = false;
    this.prototype.usesResetTurn = false;
  }

  constructor(){
    super();

    this.prerequisiteChallengeTypes.push(Lesson1.type);

    this.hiddenUIElements.push("CardCount");

    this.addInstructionToQueueForTurnIndex(0,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_2_turn_0_failure_message_1"),
      sourcePosition: {
        x:8,
        y:2
      },
      targetPosition: {
        x:6,
        y:2
      },
      preventSelectionUntilLabelIndex:3,
      expectedActionType: MoveAction.type,
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_2_turn_0_instruction_1"),
        position: {
          x:8,
          y:2
        },
        duration: CONFIG.INSTRUCTIONAL_ULTRAFAST_DURATION
      }
      , {
        label:i18next.t("tutorial.lesson_2_turn_0_instruction_2"),
        positionAtManaIndex:2,
        focusUp:true,
        duration: CONFIG.INSTRUCTIONAL_ULTRAFAST_DURATION
      }
      , {
        label:i18next.t("tutorial.lesson_2_turn_0_instruction_3"),
        position: {
          x:5,
          y:2
        },
        instructionArrowPositions:[{x:4,y:0},{x:4,y:4}]
      }
      , {
        label:i18next.t("tutorial.lesson_2_turn_0_instruction_4"),
        position: {
          x:8,
          y:2
        },
        duration: CONFIG.INSTRUCTIONAL_ULTRAFAST_DURATION
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(0,Instruction.createEndTurnInstruction());

    this.addInstructionToQueueForTurnIndex(1,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_2_turn_1_failure_message_1"),
      sourcePosition: {
        x:6,
        y:2
      },
      targetPosition: {
        x:5,
        y:2
      },
      expectedActionType: MoveAction.type,
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_2_turn_1_instruction_1"),
        position: {
          x:5,
          y:2
        },
        duration: CONFIG.INSTRUCTIONAL_SHORT_DURATION
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(1,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_2_turn_1_failure_message_2"),
      handIndex: 0,
      targetPosition: {
        x:4,
        y:1
      },
      preventSelectionUntilLabelIndex:1,
      expectedActionType: PlayCardFromHandAction.type,
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_2_turn_1_instruction_2"),
        positionAtManaIndex:4,
        focusUp:true
      }
      , {
        label:i18next.t("tutorial.lesson_2_turn_1_instruction_3"),
        positionAtHandIndex:0,
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

//    @addInstructionToQueueForTurnIndex(1,new Instruction(
//      failedLabel:"Cast [True Strike] onto the enemy Gro."
//      handIndex: 4
//      targetPosition:
//        x:5
//        y:3
//      expectedActionType: PlayCardFromHandAction.type
//      instructionLabels:[
//        label:"Given the enemy minion's high Attack, use your spell to [destroy] it without hurting your General."
//        positionAtHandIndex: 4
//        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
//      ]
//    ))

//    @addInstructionToQueueForTurnIndex(1,new Instruction(
//      failedLabel:"[Move] your General closer to the Mana Spring."
//      sourcePosition:
//        x:5
//        y:2
//      targetPosition:
//        x:5
//        y:4
//      expectedActionType: MoveAction.type
//      instructionLabels:[
//        label:"[Move] your General towards the top Mana Spring."
//        position:
//          x:5
//          y:2
//        delay:CONFIG.INSTRUCTIONAL_SHORT_DURATION
//      ]
//    ))

    this.addInstructionToQueueForTurnIndex(1,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_2_turn_1_failure_message_3"),
      handIndex: 1,
      expectedActionType: ReplaceCardFromHandAction.type,
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_2_turn_1_instruction_4"),
        positionAtHandIndex: 1,
        duration: CONFIG.INSTRUCTIONAL_LONG_DURATION
      }
      , {
        label:i18next.t("tutorial.lesson_2_turn_1_instruction_5"),
        positionAtHandIndex: 1,
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(1,new Instruction({
      failedLabel:i18next.t("tutorial.lesson_2_turn_1_failure_message_4"),
      handIndex: 1,
      targetPosition: {
        x:5,
        y:1
      },
      expectedActionType: PlayCardFromHandAction.type,
      preventSelectionUntilLabelIndex:2,
      instructionLabels:[{
        label:i18next.t("tutorial.lesson_2_turn_1_instruction_6"),
        isSpeech:true,
        isPersistent: true,
        isOpponent:false,
        yPosition:.6
      }
      , {
        label:i18next.t("tutorial.lesson_2_turn_1_instruction_7"),
        positionAtHandIndex: 1
      }
      , {
        label:i18next.t("tutorial.lesson_2_turn_1_instruction_8"),
        positionAtHandIndex: 1,
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(1,Instruction.createEndTurnInstruction());

    this.snapShotOnPlayerTurn = 2;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Tutorial.TutorialGeneral},
      {id: Cards.TutorialSpell.TutorialPlayerTrueStrike},
      {id: Cards.Tutorial.TutorialStormmetalGolem},
      {id: Cards.Tutorial.TutorialDragoneboneGolem},
      {id: Cards.Tutorial.TutorialThornNeedler}
    ];
  }

  getOpponentPlayerDeckData(gameSession){
    return [
      {id: Cards.Tutorial.TutorialOpponentGeneral2},
      {id: Cards.TutorialSpell.TutorialFireOrb},
      {id: Cards.Tutorial.TutorialGro}
    ];
  }

  setupBoard(gameSession) {
    super.setupBoard(gameSession);

    const myPlayerId = gameSession.getMyPlayerId();
    const opponentPlayerId = gameSession.getOpponentPlayerId();

    const general1 = gameSession.getGeneralForPlayerId(myPlayerId);
    general1.maxHP = 4;
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    return general2.maxHP = 6;
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentActionMoveUnit("general",{x:2,y:0}));
    //@_opponentAgent.addActionForTurn(1,AgentActions.createAgentSoftActionShowInstructionLabels([
    //  label:"Here we make our stand!"
    //  isSpeech:true
    //  yPosition:.6
    //  isPersistent: true
    //  isOpponent: true
    //]))
    this._opponentAgent.addActionForTurn(1,AgentActions.createAgentActionMoveUnit("general",{x:2,y:0}));
    //@_opponentAgent.addActionForTurn(1,AgentActions.createAgentActionAttackWithUnit("general",{x:1,y:0},false))
    this._opponentAgent.addActionForTurn(1,AgentActions.createAgentActionPlayCard(0,{x:5,y:1}));
    //@_opponentAgent.addActionForTurn(1,AgentActions.createAgentActionPlayCard(1,{x:5,y:3}))


    this._opponentAgent.addActionForTurn(2,AgentActions.createAgentActionMoveUnit("general",{x:-2,y:0}));
    //@_opponentAgent.addActionForTurn(2,AgentActions.createAgentActionPlayCard(2,{x:3,y:1}))
    //@_opponentAgent.addActionForTurn(2,AgentActions.createAgentActionPlayFollowup(Cards.Spell.CloneSourceEntity2X,{x:3,y:1},{x:4,y:1}))
    //@_opponentAgent.addActionForTurn(2,AgentActions.createAgentActionPlayFollowup(Cards.Spell.CloneSourceEntity,{x:4,y:1},{x:5,y:1}))

    // cast spell on any enemy unit
//    @_opponentAgent.addActionForTurn(3,AgentActions.createAgentActionPlayCardFindPosition(3,(() ->
//        enemyUnits = _.filter(GameSession.getInstance().board.getEntities(), ((entity) ->
//          return entity.type == CardType.Unit and entity.ownerId != @_opponentAgent.playerId and !entity.isGeneral
//        ).bind(this))
//        return _.map(enemyUnits,(enemyUnit) -> return enemyUnit.getPosition())
//    ).bind(this)))

    // cast spell on enemy general
    this._opponentAgent.addActionForTurn(3,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("tutorial.lesson_2_taunt_1"),
      isSpeech:true,
      yPosition:.7,
      isPersistent: true,
      isOpponent: true
    }
    ]));
    return this._opponentAgent.addActionForTurn(3,AgentActions.createAgentActionPlayCardFindPosition(1,() => {
      return [GameSession.getInstance().getGeneralForPlayer2().getPosition()];
    }));
  }
}
LessonTwo.initClass();


module.exports = LessonTwo;
