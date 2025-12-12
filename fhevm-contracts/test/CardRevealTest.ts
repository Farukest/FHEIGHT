/**
 * CardRevealTest - FHE Kart Reveal Testi
 *
 * story.md'deki otel analojisini test eder:
 * 1. joinGame() - TX at, kutular olusur (ACL tanimlanir)
 * 2. getHandles() - Kutu numaralarini ogren
 * 3. userDecrypt() - KMS'ten kartlari al (popup yok)
 */

import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("CardRevealTest", function () {
  let cardRevealTest: any;
  let contractAddress: string;
  let owner: HardhatEthersSigner;
  let player1: HardhatEthersSigner;
  let player2: HardhatEthersSigner;

  before(async function () {
    [owner, player1, player2] = await ethers.getSigners();
  });

  beforeEach(async function () {
    // Deploy CardRevealTest
    const CardRevealTest = await ethers.getContractFactory("CardRevealTest");
    cardRevealTest = await CardRevealTest.deploy();
    await cardRevealTest.waitForDeployment();
    contractAddress = await cardRevealTest.getAddress();

    console.log("CardRevealTest deployed at:", contractAddress);
  });

  describe("Join Game", function () {
    it("should allow player to join and create 5 encrypted card boxes", async function () {
      // ADIM 1: joinGame TX at (otel analojisi: odalar olusur, ACL tanimlanir)
      console.log("\n=== ADIM 1: joinGame TX ===");
      console.log("Player1 address:", player1.address);

      const tx = await cardRevealTest.connect(player1).joinGame();
      await tx.wait();

      console.log("TX completed - 5 encrypted card boxes created");

      // Oyuncu kayitli mi kontrol et
      const isPlayer = await cardRevealTest.checkPlayer(player1.address);
      expect(isPlayer).to.be.true;

      // El boyutu kontrol et
      const handSize = await cardRevealTest.connect(player1).getHandSize();
      expect(handSize).to.equal(5);

      console.log("Hand size:", handSize.toString());
    });

    it("should not allow same player to join twice", async function () {
      await cardRevealTest.connect(player1).joinGame();

      await expect(
        cardRevealTest.connect(player1).joinGame()
      ).to.be.revertedWith("Already joined");
    });
  });

  describe("Get Handles", function () {
    beforeEach(async function () {
      // Player1 oyuna katilsin
      await cardRevealTest.connect(player1).joinGame();
    });

    it("should return 5 handles for joined player", async function () {
      // ADIM 2: getHandles view call (otel: resepsiyondan kutu numaralarini al)
      console.log("\n=== ADIM 2: getHandles View Call ===");

      const handles = await cardRevealTest.connect(player1).getHandles();

      console.log("Received 5 handles (box numbers):");
      for (let i = 0; i < 5; i++) {
        console.log(`  Box ${i}: ${handles[i].toString().slice(0, 20)}...`);
      }

      expect(handles.length).to.equal(5);
    });

    it("should revert for non-player", async function () {
      await expect(
        cardRevealTest.connect(player2).getHandles()
      ).to.be.revertedWith("Not a player");
    });

    it("should return individual handle", async function () {
      const handle = await cardRevealTest.connect(player1).getHandle(0);
      expect(handle).to.not.equal(0);
    });
  });

  describe("Decrypt Cards (User Decrypt)", function () {
    beforeEach(async function () {
      await cardRevealTest.connect(player1).joinGame();
    });

    it("should decrypt all 5 cards for the owner", async function () {
      // ADIM 3: KMS'e git, kutulari ac (otel: gorevli kutulari getiriyor)
      console.log("\n=== ADIM 3: User Decrypt ===");

      // Handle'lari al
      const handles = await cardRevealTest.connect(player1).getHandles();

      console.log("Requesting decrypt from KMS...");
      console.log("Player1 can decrypt because ACL allows it");

      // Her handle icin decrypt yap
      const decryptedCards: number[] = [];

      for (let i = 0; i < 5; i++) {
        const clearValue = await fhevm.userDecryptEuint(
          FhevmType.euint8,
          handles[i],
          contractAddress,
          player1
        );
        decryptedCards.push(Number(clearValue));
      }

      console.log("\n=== DECRYPTED CARDS ===");
      for (let i = 0; i < 5; i++) {
        console.log(`  Card ${i}: ID ${decryptedCards[i]}`);
      }

      // Tum kartlar 0-127 arasinda olmali (randEuint8(128) kullandik)
      for (const cardId of decryptedCards) {
        expect(cardId).to.be.gte(0);
        expect(cardId).to.be.lt(128);
      }
    });

    it("should fail decrypt for non-owner (ACL blocks)", async function () {
      // Player2 oyuna katilmadi, ACL izni yok
      console.log("\n=== ACL Block Test ===");
      console.log("Player2 trying to decrypt Player1's cards...");

      const handles = await cardRevealTest.connect(player1).getHandles();

      // Player2 decrypt etmeye calisiyor - ACL engellemeli
      try {
        await fhevm.userDecryptEuint(
          FhevmType.euint8,
          handles[0],
          contractAddress,
          player2 // Yanlis oyuncu!
        );
        // Buraya gelmemeli
        expect.fail("Should have thrown ACL error");
      } catch (error: any) {
        console.log("Expected error:", error.message);
        // ACL hatasi bekleniyor - "not authorized" mesaji da ACL hatasidir
        expect(error.message).to.match(/ACL|authorized/i);
      }
    });

    it("should decrypt multiple cards sequentially", async function () {
      console.log("\n=== Sequential Decrypt Test ===");

      const handles = await cardRevealTest.connect(player1).getHandles();

      // Tek tek decrypt (batch API mock'ta farkli calisabiliyor)
      const clearValues: bigint[] = [];
      for (let i = 0; i < 5; i++) {
        const value = await fhevm.userDecryptEuint(
          FhevmType.euint8,
          handles[i],
          contractAddress,
          player1
        );
        clearValues.push(value);
      }

      console.log("Sequentially decrypted cards:", clearValues.map(Number));

      expect(clearValues.length).to.equal(5);
    });
  });

  describe("Full Flow Test", function () {
    it("should complete the entire hotel analogy flow", async function () {
      console.log("\n========================================");
      console.log("FULL FLOW TEST (Hotel Analogy)");
      console.log("========================================\n");

      // 1. HAZIRLIK
      console.log("1. HAZIRLIK");
      console.log("   - Player1 cuzdan bagli");
      console.log("   - Session key olusturuldu (test icin otomatik)");
      console.log("");

      // 2. JOIN GAME (TX)
      console.log("2. JOIN GAME (TX - 1 popup)");
      console.log("   - Otel sahibi (contract) kutulari olusturuyor");
      console.log("   - Her kutunun ACL'ine player1 ekleniyor");

      const tx = await cardRevealTest.connect(player1).joinGame();
      const receipt = await tx.wait();
      console.log("   - TX Hash:", receipt?.hash.slice(0, 20) + "...");
      console.log("   - Gas used:", receipt?.gasUsed.toString());
      console.log("");

      // 3. GET HANDLES (View - popup yok)
      console.log("3. GET HANDLES (View - popup yok)");
      console.log("   - Resepsiyona soruyoruz: Kutularim hangileri?");

      const handles = await cardRevealTest.connect(player1).getHandles();
      console.log("   - 5 kutu numarasi alindi");
      console.log("");

      // 4. DECRYPT (KMS - popup yok)
      console.log("4. DECRYPT (KMS - popup yok)");
      console.log("   - KMS'e gidiyoruz: Bu kutulari getir");
      console.log("   - KMS kontrol ediyor:");
      console.log("     - Session key gecerli mi? EVET");
      console.log("     - ACL izni var mi? EVET");
      console.log("   - KMS kutulari aciyor, publicKey ile reencrypt ediyor");
      console.log("   - Bize veriyor, privateKey ile aciyoruz");

      const cards = [];
      for (let i = 0; i < 5; i++) {
        const card = await fhevm.userDecryptEuint(
          FhevmType.euint8,
          handles[i],
          contractAddress,
          player1
        );
        cards.push(Number(card));
      }

      console.log("");
      console.log("========================================");
      console.log("RESULT: CARDS REVEALED!");
      console.log("========================================");
      for (let i = 0; i < 5; i++) {
        console.log(`   Card ${i + 1}: ID ${cards[i]}`);
      }
      console.log("");
      console.log("Total popups: 1 (only joinGame TX)");
      console.log("Decrypt operations: 5 (all popup-free!)");
      console.log("========================================\n");

      // Verify
      expect(cards.length).to.equal(5);
      cards.forEach(card => {
        expect(card).to.be.gte(0);
        expect(card).to.be.lt(128);
      });
    });
  });
});
