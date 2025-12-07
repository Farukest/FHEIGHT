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
const EndTurnAction   = require('app/sdk/actions/endTurnAction');
const Cards       = require('app/sdk/cards/cardsLookupComplete');
const Deck       = require('app/sdk/cards/deck');
const AgentActions = require('app/sdk/agents/agentActions');
const CONFIG = require('app/common/config');
const RSX = require('app/data/resources');
const ChallengeCategory = require('app/sdk/challenges/challengeCategory');
const i18next = require('i18next');

class LessonThree extends Challenge {
  static initClass() {
  
    this.type = "LessonThree";
    this.prototype.type = "LessonThree";
    this.prototype.categoryType = ChallengeCategory.tutorial.type;
  
    this.prototype.name = i18next.t("tutorial.lesson_3_title");
    this.prototype.description = i18next.t("tutorial.lesson_3_description");
    this.prototype.difficulty = i18next.t("tutorial.lesson_3_difficulty");
    this.prototype.otkChallengeStartMessage = i18next.t("tutorial.lesson_3_start_message");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("tutorial.lesson_3_failure_message")
    ];
  
    // name:"Power Comes from Within"
    // description:"Learn the innate abilities of your minions: Ranged, Provoke, Flying, Opening Gambit."
    // difficulty:"2 Minutes"
    // otkChallengeStartMessage: "Finish off enemy General in ONE turn!"
    // otkChallengeFailureMessages: [
    //   "Finish off the Vaath in ONE turn."
    // ]
  
    this.prototype.iconUrl = RSX.speech_portrait_magmar.img;
    this.prototype._musicOverride = RSX.music_battlemap_bluemonolith.audio;
  
    this.prototype.userIsPlayer1 = false;
    this.prototype.battleMapTemplateIndex = 5;
    this.prototype.customBoard = false;
    this.prototype.startingHandSizeOpponent = 6;
    this.prototype.usesResetTurn = false;
  }

  constructor(){
    super();

    this.prerequisiteChallengeTypes.push(Lesson2.type);

    this.hiddenUIElements.push("CardCount");
    this.hiddenUIElements.push("Replace");

    this.addInstructionToQueueForTurnIndex(0,new Instruction({
      failedLabel:"[Move] your General forward.",
      sourcePosition: {
        x:8,
        y:2
      },
      targetPosition: {
        x:6,
        y:2
      },
      expectedActionType: MoveAction.type,
      instructionLabels:[{
        label:"[Move] your General forward.",
        position: {
          x:8,
          y:2
        },
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(0,new Instruction({
      failedLabel:"[Summon] your Bloodshard Golem onto the battlefield.",
      handIndex: 0,
      targetPosition: {
        x:5,
        y:2
      },
      expectedActionType: PlayCardFromHandAction.type,
      instructionLabels:[{
        label:"Take the [extra] Mana with your Golem.",
        positionAtHandIndex: 0,
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(0,new Instruction({
      failedLabel:"[Summon] Vox onto the battlefield.",
      handIndex: 1,
      targetPosition: {
        x:4,
        y:1
      },
      expectedActionType: PlayCardFromHandAction.type,
      instructionLabels:[{
        label:"[Summon] the adorable Vox onto the battlefield.",
        positionAtHandIndex: 1,
//        position
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(0,Instruction.createEndTurnInstruction());

    this.addInstructionToQueueForTurnIndex(1,new Instruction({
      failedLabel:"[Move] your General to attack the enemy minion.",
      sourcePosition: {
        x:6,
        y:2
      },
      targetPosition: {
        x:5,
        y:3
      },
      expectedActionType: MoveAction.type,
      preventSelectionUntilLabelIndex:1,
      instructionLabels:[{
        label:"This enemy has [PROVOKE]. Your nearby minions are rooted by it.",
        position: {
          x:4,
          y:2
        },
        duration: CONFIG.INSTRUCTIONAL_LONG_DURATION
      }
      , {
        label:"[Move] your General in range to damage Prixus.",
        position: {
          x:6,
          y:2
        },
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(1,new Instruction({
      failedLabel:"[Attack] the enemy Prixus Shieldmaster with your General.",
      expectedActionType: AttackAction.type,
      sourcePosition: {
        x:5,
        y:3
      },
      targetPosition: {
        x:4,
        y:2
      },
      instructionLabels:[{
        label:"[Attack] Prixus with your General.",
        position: {
          x:4,
          y:2
        },
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(1,new Instruction({
      failedLabel:"[Attack] the Shieldmaster with your Golem.",
      expectedActionType: AttackAction.type,
      sourcePosition: {
        x:5,
        y:2
      },
      targetPosition: {
        x:4,
        y:2
      },
      instructionLabels:[{
        label:"[Attack] Prixus with your Golem.",
        position: {
          x:4,
          y:2
        },
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(1,new Instruction({
      failedLabel:"[Attack] the Shieldmaster with Vox.",
      expectedActionType: AttackAction.type,
      sourcePosition: {
        x:4,
        y:1
      },
      targetPosition: {
        x:4,
        y:2
      },
      instructionLabels:[{
        label:"[Attack] Prixus with Vox.",
        position: {
          x:4,
          y:2
        },
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(1,new Instruction({
      failedLabel:"Finish off the provoking enemy Prixus with [True Strike].",
      handIndex: 2,
      targetPosition: {
        x:4,
        y:2
      },
      expectedActionType: PlayCardFromHandAction.type,
      instructionLabels:[{
        label:"[Destroy] Prixus so that your forces can move again.",
        positionAtHandIndex: 2
      }
      , {
        label:"Finish off Prixus with [True Strike].",
        position: {
          x:4,
          y:2
        },
        showAfterLabelAtIndex:0,
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(1,new Instruction({
      failedLabel:"[Summon] your flying Putrid Dreadflayer.",
      handIndex: 0,
      targetPosition: {
        x:4,
        y:4
      },
      expectedActionType: PlayCardFromHandAction.type,
      instructionLabels:[{
        label:"[Summon] your flying Putrid Dreadflayer.",
        positionAtHandIndex: 0,
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    // custom end turn for freeze
    this.addInstructionToQueueForTurnIndex(1,new Instruction({
      failedLabel:i18next.t("tutorial.must_end_turn_message"),
      expectedActionType:EndTurnAction.type,
      instructionLabels: [{
        label:"[FLYING] minions can move anywhere on the battlefield!",
        position: {
          x:5,
          y:4
        },
        focusLeft:true
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(2,new Instruction({
      failedLabel:"[Summon] your Repulsor Beast.",
      handIndex: 0,
      targetPosition: {
        x:5,
        y:1
      },
      expectedActionType: PlayCardFromHandAction.type,
      instructionLabels: [{
        label:"Minions with [OPENING GAMBIT] will trigger an effect when summoned.",
        positionAtHandIndex:0
      }
      , {
        label:"[Summon] your Repulsor Beast and see what it can do!",
        delay: CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY,
        positionAtHandIndex: 0,
        showAfterLabelAtIndex: 0
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(2,new Instruction({
      failedLabel:"Complete the [followup] and repulse Prixus across the battlefield.",
      targetPosition: {
        x:4,
        y:2
      },
      expectedActionType: PlayCardAction.type,
      instructionLabels: [{
        label:"[Choose] Prixus as your target to repulse across the battlefield.",
        position: {
          x:4,
          y:2
        }
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(2,new Instruction({
      failedLabel:"Complete [followup] and repulse the enemy Prixus over here.",
      targetPosition: {
        x:0,
        y:4
      },
      instructionLabels: [{
        label:"Click [HERE] to repulse Prixus to this corner!",
        position: {
          x:0,
          y:4
        }
      }
      ],
      expectedActionType: PlayCardAction.type
    }));


    this.addInstructionToQueueForTurnIndex(2,new Instruction({
      failedLabel:"[Fly] into the corner to attack the Ranged minion.",
      sourcePosition: {
        x:4,
        y:4
      },
      targetPosition: {
        x:0,
        y:0
      },
      instructionLabels: [{
        label:"[Fly] into the corner to attack the Ranged minion.",
        position: {
          x:6,
          y:4
        },
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ],
      expectedActionType: MoveAction.type
    }));

    this.addInstructionToQueueForTurnIndex(2,new Instruction({
      failedLabel:"[Attack] the Spirit Ranger with your Putrid Dreadflayer.",
      expectedActionType: AttackAction.type,
      sourcePosition: {
        x:0,
        y:0
      },
      targetPosition: {
        x:1,
        y:1
      },
      instructionLabels: [{
        label:"[Attack] the Spirit Ranger with your Putrid Dreadflayer.",
        position: {
          x:1,
          y:1
        },
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(2,new Instruction({
      failedLabel:"[Move] Vox in position to finally finish off the Spirit Ranger.",
      sourcePosition: {
        x:4,
        y:1
      },
      targetPosition: {
        x:2,
        y:1
      },
      expectedActionType: MoveAction.type,
      instructionLabels: [{
        label:"Finally! Now Vox can finish off this annoying Spirit Ranger.",
        position: {
          x:4,
          y:1
        },
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(2,new Instruction({
      failedLabel:"[Attack] with Vox!",
      expectedActionType: AttackAction.type,
      sourcePosition: {
        x:2,
        y:1
      },
      targetPosition: {
        x:1,
        y:1
      },
      instructionLabels: [{
        label:"[Attack] with Vox!",
        position: {
          x:1,
          y:1
        },
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(2,new Instruction({
      failedLabel:"Move your General away from danger",
      sourcePosition: {
        x:5,
        y:3
      },
      targetPosition: {
        x:7,
        y:3
      },
      expectedActionType: MoveAction.type,
      instructionLabels: [{
        label:"You have [1 Health] left! Time to pull back!!\n",
        position: {
          x:5,
          y:3
        }
      }
      , {
        label:"[Move] your General out of the way!",
        position: {
          x:5,
          y:3
        },
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(2,new Instruction({
      failedLabel:"Move Bloodshard Golem in in the way of his General",
      sourcePosition: {
        x:5,
        y:2
      },
      targetPosition: {
        x:5,
        y:3
      },
      expectedActionType: MoveAction.type,
      instructionLabels: [{
        label:"[Block] the enemy General with your Golem.",
        position: {
          x:5,
          y:2
        }
      }
      , {
        label:"[Move] your Golem.",
        position: {
          x:5,
          y:2
        },
        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY,
        showAfterLabelAtIndex:0
      }
      ]
    }));

    this.addInstructionToQueueForTurnIndex(2,Instruction.createEndTurnInstruction());

    this.snapShotOnPlayerTurn = 3;
  }

//    @addInstructionToQueueForTurnIndex(3,new Instruction(
//      failedLabel:"[Summon] your Saberspine Tiger onto the battlefield."
//      handIndex: 2
//      targetPosition:
//        x:4
//        y:2
//      expectedActionType: PlayCardFromHandAction.type
//      instructionLabels: [
//        label:"Minions with [RUSH] can attack right away!"
//        positionAtHandIndex: 2
//        showOnce:true
//      ,
//        label:"[Summon] your Saberspine Tiger to attack this turn!"
//        positionAtHandIndex: 2
//        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
//        showAfterLabelAtIndex:0
//      ]
//    ))
//
//    @addInstructionToQueueForTurnIndex(3,new Instruction(
//      failedLabel:"[Move] your Saberspine Tiger to attack the enemy General this turn!"
//      sourcePosition:
//        x:4
//        y:2
//      targetPosition:
//        x:4
//        y:3
//      expectedActionType: MoveAction.type
//      instructionLabels: [
//        label:"[Move] your Saberspine Tiger to attack the enemy General this turn!"
//        position:
//          x:4
//          y:2
//        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
//      ]
//    ))
//
//    @addInstructionToQueueForTurnIndex(3,new Instruction(
//      failedLabel:"[Attack] the enemy General with your Saberspine Tiger."
//      expectedActionType: AttackAction.type
//      sourcePosition:
//        x:4
//        y:3
//      targetPosition:
//        x:5
//        y:4
//      instructionLabels: [
//        label:"[Attack] the enemy General with your Saberspine Tiger."
//        position:
//          x:5
//          y:4
//        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
//      ]
//    ))
//
//    @addInstructionToQueueForTurnIndex(3,new Instruction(
//      failedLabel:"[Move] your Putrid Dreadflayer to finish off the enemy General."
//      sourcePosition:
//        x:0
//        y:0
//      targetPosition:
//        x:4
//        y:3
//      expectedActionType: MoveAction.type
//      instructionLabels: [
//        label:"Finally! [Finish off] the enemy General!"
//        showOnce:true
//        position:
//          x:0
//          y:0
//      ,
//        label:"[Move] your Putrid Dreadflayer to finish off the enemy General!"
//        position:
//          x:0
//          y:0
//        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
//        showAfterLabelAtIndex:0
//      ]
//    ))
//
//    @addInstructionToQueueForTurnIndex(3,new Instruction(
//      failedLabel:"[Attack] with your Putrid Dreadflayer to finish off the enemy General!"
//      expectedActionType: AttackAction.type
//      sourcePosition:
//        x:4
//        y:3
//      targetPosition:
//        x:5
//        y:4
//      instructionLabels: [
//        label:"[Finish off] the enemy General!"
//        position:
//          x:5
//          y:4
//        delay:CONFIG.INSTRUCTIONAL_MANUAL_DEFAULT_DELAY
//      ]
//    ))

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Tutorial.TutorialGeneral},
      {id: Cards.Tutorial.TutorialVox},
      {id: Cards.Tutorial.TutorialStormmetalGolem},
      {id: Cards.Tutorial.TutorialSaberspineTiger}, // hand 0
      {id: Cards.Tutorial.TutorialRepulsor}, // hand 0
      {id: Cards.Tutorial.TutorialStormmetalGolem}, // hand 1
      {id: Cards.TutorialSpell.TutorialPlayerTrueStrike}, // hand 2
      {id: Cards.Tutorial.TutorialVox}, // hand 1
      {id: Cards.Tutorial.TutorialBloodshardGolem} // hand 0
    ];
  }

  getOpponentPlayerDeckData(gameSession){
    return [
      {id: Cards.Tutorial.TutorialOpponentGeneral2},
      {id: Cards.Tutorial.TutorialKolossus},
      {id: Cards.Tutorial.TutorialValeHunter},
      {id: Cards.Tutorial.TutorialKolossus},
      {id: Cards.Tutorial.TutorialKolossus},
      {id: Cards.Tutorial.TutorialValeHunter}
    ];
  }

  setupBoard(gameSession) {
    super.setupBoard(gameSession);

    const myPlayerId = gameSession.getMyPlayerId();
    const opponentPlayerId = gameSession.getOpponentPlayerId();

    const general1 = gameSession.getGeneralForPlayerId(myPlayerId);
    general1.maxHP = 11;
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    return general2.maxHP = 11;
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentActionMoveUnit("general",{x:2,y:0}));
    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentActionPlayCard(0,{x:1,y:1}));
    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:"Beware, [RANGED] minions can attack you from anywhere!",
      delay:CONFIG.INSTRUCTIONAL_SHORT_DURATION,
      position: {
        x:1,
        y:2
      }
    }
    ]));
    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionTagUnitAtPosition("valuehunter",{x:1,y:1}));

    this._opponentAgent.addActionForTurn(1,AgentActions.createAgentActionMoveUnit("general",{x:1,y:0}));
    this._opponentAgent.addActionForTurn(1,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:"This will stop you in your tracks!",
      isSpeech:true,
      yPosition:.6,
      isPersistent: true,
      isOpponent: true
    }
    ]));
    this._opponentAgent.addActionForTurn(1,AgentActions.createAgentActionPlayCard(1,{x:4,y:2}));
    this._opponentAgent.addActionForTurn(1,AgentActions.createAgentActionAttackWithUnit("valuehunter",{x:6,y:2},true));
    this._opponentAgent.addActionForTurn(1,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:"I really hate Ranged units...",
      isSpeech:true,
      yPosition:.6,
      isPersistent: true,
      isOpponent: false
    }
    ]));

    this._opponentAgent.addActionForTurn(2,AgentActions.createAgentActionMoveUnit("general",{x:1,y:1}));
    this._opponentAgent.addActionForTurn(2,AgentActions.createAgentActionAttackWithUnit("general",{x:1,y:0},false));
    this._opponentAgent.addActionForTurn(2,AgentActions.createAgentActionAttackWithUnit("valuehunter",{x:5,y:3},true));
    this._opponentAgent.addActionForTurn(2,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:"The sweet smell of desperation.",
      isSpeech:true,
      yPosition:.6,
      isPersistent: true,
      isOpponent: true
    }
    ]));
    this._opponentAgent.addActionForTurn(2,AgentActions.createAgentActionPlayCard(2,{x:4,y:2}));
    this._opponentAgent.addActionForTurn(2,AgentActions.createAgentSoftActionTagUnitAtPosition("provoker",{x:4,y:2}));

    this._opponentAgent.addActionForTurn(3,AgentActions.createAgentActionMoveUnit("general",{x:1,y:1}));
    this._opponentAgent.addActionForTurn(3,AgentActions.createAgentActionAttackWithUnit("general",{x:0,y:-1},false));
    this._opponentAgent.addActionForTurn(3,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:"You're getting old, Argeon!",
      isSpeech:true,
      yPosition:.6,
      isPersistent: true,
      isOpponent: true
    }
    ]));
    this._opponentAgent.addActionForTurn(3,AgentActions.createAgentActionPlayCard(3,{x:4,y:4}));
    this._opponentAgent.addActionForTurn(3,AgentActions.createAgentActionPlayCard(4,{x:6,y:3}));
    this._opponentAgent.addActionForTurn(3,AgentActions.createAgentSoftActionTagUnitAtPosition("provoker2",{x:6,y:3}));
    this._opponentAgent.addActionForTurn(3,AgentActions.createAgentActionMoveUnit("provoker",{x:2,y:0}));
    this._opponentAgent.addActionForTurn(3,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:"Still fast enough to do this!",
      isSpeech:true,
      yPosition:.6,
      isPersistent: true,
      isOpponent: false
    }
    ]));


    this._opponentAgent.addActionForTurn(4,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:"--Is that all you got!?--",
      isSpeech:true,
      yPosition:.7,
      isOpponent: true
    }
    ]));
//    @_opponentAgent.addActionForTurn(4,AgentActions.createAgentActionPlayCardFindPosition(5,(() ->
//      return [GameSession.getInstance().getGeneralForPlayer2().getPosition()]
//    ).bind(this)))
    return this._opponentAgent.addActionForTurn(4,AgentActions.createAgentActionAttackWithUnit("provoker2",{x:1,y:0},false));
  }
}
LessonThree.initClass();

module.exports = LessonThree;
