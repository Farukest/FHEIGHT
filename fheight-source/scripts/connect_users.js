const _ = require('underscore');
const Firebase = require('firebase');

const firebaseUrl = 'https://wargame.firebaseio.com';
const fheightFB = new Firebase(firebaseUrl);

const allUsernames = [
  'wb01@fheight.com',
  'wb02@fheight.com',
  'wb03@fheight.com',
  'wb04@fheight.com',

  'wb05@fheight.com', //
  'wb06@fheight.com',
  'wb07@fheight.com',
  'wb08@fheight.com',
  'wb09@fheight.com',
  'wb10@fheight.com',
  'wb11@fheight.com',
  'wb12@fheight.com',
  'wb13@fheight.com',
  'wb14@fheight.com',
];
const allUsers = [];

_.each(allUsernames, (username) => {
  console.log(`... Fetching User ${username}`);
  const ref = fheightFB.child('/users/').startAt(username).endAt(username).once('child_added', (snapshot) => {
    console.log(`DONE ... Fetching User ${username}`);
    allUsers.push(snapshot.val());
    amiDone();
  });
});

function amiDone() {
  if (allUsers.length === allUsernames.length) {
    _.each(allUsers, (user) => {
      const ref = fheightFB.child(`/users/${user.id}`);
      const buddiesRef = ref.child('buddies');

      console.log(`Handling User ${user.fullName}:${user.id}`);

      _.each(allUsers, (buddy) => {
        if (user.id !== buddy.id) {
          console.log(`Setting BUDDY ${buddy.id}`);
          buddiesRef.child(buddy.id).set({ id: buddy.id });
        }
      });
    });
  }
}
