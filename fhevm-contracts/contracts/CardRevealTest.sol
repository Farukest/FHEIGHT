// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint8} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title CardRevealTest
 * @notice Basit FHE test contract'i - kart kutulari olustur ve decrypt test et
 * @dev story.md'deki otel analojisinin implementasyonu
 *
 * AKIS:
 * 1. joinGame() - TX at, kutular olusur, ACL tanimlanir
 * 2. getHandles() - Kutu numaralarini ogren (view)
 * 3. KMS'e git, decrypt et
 */
contract CardRevealTest is ZamaEthereumConfig {
    // Sabit degerler
    uint8 public constant HAND_SIZE = 5;

    // Her oyuncunun el kartlari (sifreli kutular)
    mapping(address => euint8[HAND_SIZE]) private playerHands;

    // Oyuncu kayitli mi
    mapping(address => bool) public isPlayer;

    // Events
    event PlayerJoined(address indexed player, uint8 handSize);
    event CardRevealed(address indexed player, uint8 slot, uint8 cardId);

    /**
     * @notice Oyuna katil - 5 sifreli kutu olustur
     * @dev Her kutu random bir kart ID'si icerir (1-100 arasi)
     *      ACL ile sadece msg.sender bu kutulari acabilir
     */
    function joinGame() external {
        require(!isPlayer[msg.sender], "Already joined");

        // 5 kutu olustur (her biri sifreli kart ID'si)
        for (uint8 i = 0; i < HAND_SIZE; i++) {
            // Random kart ID (0-127 arasi) - upperBound 2'nin kati olmali
            euint8 cardId = FHE.randEuint8(128);

            // Kutuya koy
            playerHands[msg.sender][i] = cardId;

            // ACL: Contract kendisi erisebilir
            FHE.allowThis(cardId);

            // ACL: Oyuncu erisebilir (decrypt icin)
            FHE.allow(cardId, msg.sender);
        }

        isPlayer[msg.sender] = true;
        emit PlayerJoined(msg.sender, HAND_SIZE);
    }

    /**
     * @notice Kutu numaralarini (handle'lari) dondur
     * @dev View fonksiyonu - gas yok, popup yok
     *      msg.sender'a gore filtreliyor
     * @return handles 5 kutu handle'i
     */
    function getHandles() external view returns (euint8[HAND_SIZE] memory handles) {
        require(isPlayer[msg.sender], "Not a player");
        return playerHands[msg.sender];
    }

    /**
     * @notice Tek bir kutunun handle'ini dondur
     * @param slot Kutu indexi (0-4)
     * @return handle Kutu handle'i
     */
    function getHandle(uint8 slot) external view returns (euint8 handle) {
        require(isPlayer[msg.sender], "Not a player");
        require(slot < HAND_SIZE, "Invalid slot");
        return playerHands[msg.sender][slot];
    }

    /**
     * @notice Kart sayisini dondur
     * @return Oyuncunun kart sayisi (5)
     */
    function getHandSize() external view returns (uint8) {
        if (!isPlayer[msg.sender]) return 0;
        return HAND_SIZE;
    }

    /**
     * @notice Oyuncu kontrolu
     * @param player Kontrol edilecek adres
     * @return Oyuncu kayitli mi
     */
    function checkPlayer(address player) external view returns (bool) {
        return isPlayer[player];
    }
}
