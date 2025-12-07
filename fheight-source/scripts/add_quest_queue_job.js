// Configuration object
const Firebase = require('firebase');
const _ = require('underscore');
const config = require('../config/config');

const fheightFB = new Firebase('https://fheight-dev.firebaseio.com/');

if (process.argv[2]) {
  const userId = process.argv[2];
  const gameId = process.argv[3];
  fheightFB.auth((error) => {
    if (error) {
      console.log(`error authenticating with FB: ${error}`);
    } else {
      fheightFB.child('job-queues').child('user-quest-update').push({ playerId: userId, gameId });
    }
  });
} else {
  console.log('no user id provided');
}
