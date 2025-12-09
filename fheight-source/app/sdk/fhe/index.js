'use strict';

/**
 * FHE Module Index
 *
 * ZAMA FHEVM entegrasyonu icin tum modulleri export eder.
 *
 * Kullanim:
 *   var FHE = require('app/sdk/fhe');
 *   var gameMode = FHE.GameMode.getInstance();
 *   var cardHandler = FHE.CardHandler.getInstance();
 *   var gameSession = FHE.GameSession.getInstance();
 */

module.exports = {
  // FHE Game Mode - Ana entegrasyon noktasi
  GameMode: require('./fheGameMode'),

  // FHE Game Session - Contract ile iletisim
  GameSession: require('./fheGameSession'),

  // FHE Card Handler - Kart islemleri entegrasyonu
  CardHandler: require('./fheCardHandler'),

  // FHE Session (common'dan) - Session key yonetimi
  Session: require('app/common/fhe_session')
};
