import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { GameSession, SessionKeyManager } from "../typechain-types";

describe("GameSession", function () {
  let gameSession: GameSession;
  let sessionKeyManager: SessionKeyManager;
  let owner: HardhatEthersSigner;
  let player1: HardhatEthersSigner;
  let player2: HardhatEthersSigner;
  let sessionKey: HardhatEthersSigner;

  // Sample deck (40 cards)
  const createDeck = (): bigint[] => {
    const deck: bigint[] = [];
    for (let i = 1; i <= 40; i++) {
      deck.push(BigInt(i));
    }
    return deck;
  };

  beforeEach(async function () {
    [owner, player1, player2, sessionKey] = await ethers.getSigners();

    // Deploy GameSession
    const GameSessionFactory = await ethers.getContractFactory("GameSession");
    gameSession = await GameSessionFactory.deploy();
    await gameSession.waitForDeployment();

    // Deploy SessionKeyManager
    const SessionKeyManagerFactory = await ethers.getContractFactory("SessionKeyManager");
    sessionKeyManager = await SessionKeyManagerFactory.deploy(await gameSession.getAddress());
    await sessionKeyManager.waitForDeployment();
  });

  describe("Game Creation", function () {
    it("should create a new game", async function () {
      const deck = createDeck();
      await gameSession.connect(player1).createGame(deck);

      const game = await gameSession.games(0);
      expect(game.player1).to.equal(player1.address);
      expect(game.player2).to.equal(ethers.ZeroAddress);
      expect(game.state).to.equal(0); // WaitingForPlayers
    });

    it("should allow player2 to join", async function () {
      const deck = createDeck();
      await gameSession.connect(player1).createGame(deck);
      await gameSession.connect(player2).joinGame(0, deck);

      const game = await gameSession.games(0);
      expect(game.player2).to.equal(player2.address);
      expect(game.state).to.equal(1); // MulliganPhase
    });

    it("should not allow player1 to join own game", async function () {
      const deck = createDeck();
      await gameSession.connect(player1).createGame(deck);

      await expect(
        gameSession.connect(player1).joinGame(0, deck)
      ).to.be.revertedWith("Cannot join own game");
    });
  });

  describe("Game Flow", function () {
    beforeEach(async function () {
      const deck = createDeck();
      await gameSession.connect(player1).createGame(deck);
      await gameSession.connect(player2).joinGame(0, deck);
    });

    it("should complete mulligan and start game", async function () {
      // Both players complete mulligan
      await gameSession.connect(player1).completeMulligan(0, []);

      const game = await gameSession.games(0);
      expect(game.state).to.equal(2); // InProgress
      expect(game.currentTurn).to.equal(player1.address);
      expect(game.turnNumber).to.equal(1);
    });

    it("should allow card replacement during mulligan", async function () {
      await gameSession.connect(player1).completeMulligan(0, [0, 1, 2]);

      const handSize = await gameSession.getHandSize(0, player1.address);
      expect(handSize).to.equal(5);
    });
  });

  describe("Turn Actions", function () {
    beforeEach(async function () {
      const deck = createDeck();
      await gameSession.connect(player1).createGame(deck);
      await gameSession.connect(player2).joinGame(0, deck);
      await gameSession.connect(player1).completeMulligan(0, []);
    });

    it("should draw a card", async function () {
      const handSizeBefore = await gameSession.getHandSize(0, player1.address);
      await gameSession.connect(player1).drawCard(0);
      const handSizeAfter = await gameSession.getHandSize(0, player1.address);

      expect(handSizeAfter).to.equal(handSizeBefore + BigInt(1));
    });

    it("should end turn and switch to player2", async function () {
      await gameSession.connect(player1).endTurn(0);

      const game = await gameSession.games(0);
      expect(game.currentTurn).to.equal(player2.address);
    });

    it("should not allow player2 to act during player1 turn", async function () {
      await expect(
        gameSession.connect(player2).drawCard(0)
      ).to.be.revertedWith("Not your turn");
    });

    it("should allow card replacement once per turn", async function () {
      await gameSession.connect(player1).replaceCard(0, 0);

      await expect(
        gameSession.connect(player1).replaceCard(0, 1)
      ).to.be.revertedWith("Already replaced this turn");
    });
  });

  describe("Board Actions", function () {
    beforeEach(async function () {
      const deck = createDeck();
      await gameSession.connect(player1).createGame(deck);
      await gameSession.connect(player2).joinGame(0, deck);
      await gameSession.connect(player1).completeMulligan(0, []);
    });

    it("should have generals spawned on board", async function () {
      const units = await gameSession.getBoardUnits(0);

      // Should have 2 generals
      const generals = units.filter(u => u.isGeneral);
      expect(generals.length).to.equal(2);

      // Check positions
      const p1General = generals.find(g => g.owner === player1.address);
      const p2General = generals.find(g => g.owner === player2.address);

      expect(p1General?.x).to.equal(0);
      expect(p1General?.y).to.equal(2);
      expect(p2General?.x).to.equal(8);
      expect(p2General?.y).to.equal(2);
    });

    it("should track general HP", async function () {
      const p1HP = await gameSession.generalHP(0, player1.address);
      const p2HP = await gameSession.generalHP(0, player2.address);

      expect(p1HP).to.equal(25);
      expect(p2HP).to.equal(25);
    });
  });
});

describe("SessionKeyManager", function () {
  let gameSession: GameSession;
  let sessionKeyManager: SessionKeyManager;
  let owner: HardhatEthersSigner;
  let player1: HardhatEthersSigner;
  let sessionKey: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, player1, sessionKey] = await ethers.getSigners();

    const GameSessionFactory = await ethers.getContractFactory("GameSession");
    gameSession = await GameSessionFactory.deploy();
    await gameSession.waitForDeployment();

    const SessionKeyManagerFactory = await ethers.getContractFactory("SessionKeyManager");
    sessionKeyManager = await SessionKeyManagerFactory.deploy(await gameSession.getAddress());
    await sessionKeyManager.waitForDeployment();
  });

  describe("Session Key Creation", function () {
    it("should create a session key", async function () {
      const duration = 3600; // 1 hour
      const gameIds = [0n, 1n];

      await sessionKeyManager.connect(player1).createSessionKey(
        sessionKey.address,
        duration,
        gameIds
      );

      expect(await sessionKeyManager.isActiveSession(sessionKey.address)).to.be.true;
      expect(await sessionKeyManager.sessionToOwner(sessionKey.address)).to.equal(player1.address);
    });

    it("should validate session for authorized games", async function () {
      await sessionKeyManager.connect(player1).createSessionKey(
        sessionKey.address,
        3600,
        [0n]
      );

      expect(await sessionKeyManager.canSessionPlayGame(sessionKey.address, 0)).to.be.true;
      expect(await sessionKeyManager.canSessionPlayGame(sessionKey.address, 1)).to.be.false;
    });

    it("should resolve player correctly", async function () {
      await sessionKeyManager.connect(player1).createSessionKey(
        sessionKey.address,
        3600,
        [0n]
      );

      const resolvedPlayer = await sessionKeyManager.resolvePlayer(sessionKey.address, 0);
      expect(resolvedPlayer).to.equal(player1.address);
    });
  });

  describe("Session Key Revocation", function () {
    beforeEach(async function () {
      await sessionKeyManager.connect(player1).createSessionKey(
        sessionKey.address,
        3600,
        [0n]
      );
    });

    it("should revoke a session key", async function () {
      await sessionKeyManager.connect(player1).revokeSessionKey(sessionKey.address);

      expect(await sessionKeyManager.isValidSession(sessionKey.address)).to.be.false;
    });

    it("should not allow non-owner to revoke", async function () {
      await expect(
        sessionKeyManager.connect(owner).revokeSessionKey(sessionKey.address)
      ).to.be.revertedWithCustomError(sessionKeyManager, "NotOwner");
    });
  });

  describe("Game Authorization", function () {
    beforeEach(async function () {
      await sessionKeyManager.connect(player1).createSessionKey(
        sessionKey.address,
        3600,
        [0n]
      );
    });

    it("should authorize additional games", async function () {
      await sessionKeyManager.connect(player1).authorizeGame(sessionKey.address, 1);

      expect(await sessionKeyManager.canSessionPlayGame(sessionKey.address, 1)).to.be.true;
    });

    it("should deauthorize games", async function () {
      await sessionKeyManager.connect(player1).deauthorizeGame(sessionKey.address, 0);

      expect(await sessionKeyManager.canSessionPlayGame(sessionKey.address, 0)).to.be.false;
    });
  });
});
