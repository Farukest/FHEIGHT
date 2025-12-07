const path = require('path');
require('app-module-path').addPath(path.join(__dirname, '../../../'));
require('coffeescript/register');
const { expect } = require('chai');
const _ = require('underscore');

const config = require('../../../config/config');
const FheightFirebase = require('../../../server/lib/fheight_firebase_module.coffee');

describe('Firebase.ServerClient.UnitTests', () => {
  const firebaseUrl = 'https://fheight-unit-tests.firebaseio.local/';

  describe('#connect()', () => {
    it('should reject on empty firebase.url', () => FheightFirebase.connect('').getRootRef()
      .then((rootRef) => {
        expect(rootRef).to.not.exist;
      })
      .error((e) => {
        expect(e).to.exist;
        expect(e).to.be.instanceOf(Error);
        expect(e.message).to.eql('firebase.url must be set');
        expect(FheightFirebase.getNumConnections()).to.be.equal(0);
      }));
  });
});
