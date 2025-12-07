const path = require('path');
require('app-module-path').addPath(path.join(__dirname, '../../../'));
require('coffeescript/register');
const { expect } = require('chai');
const _ = require('underscore');

const config = require('../../../config/config');
const FheightFirebase = require('../../../server/lib/fheight_firebase_module.coffee');

const firebaseUrl = config.get('firebase.url');
const testRef = '/test-ref-server';
const testObject = { message: 'hello from firebase unit tests', timestamp: Date.now() };

describe('Firebase.ServerClient.IntegrationTests', () => {
  it('should reject on invalid firebase.url', () => FheightFirebase.connect('invalidurl').getRootRef()
    .then((rootRef) => {
      expect(rootRef).to.not.exist;
    })
    .catch((e) => {
      expect(e).to.exist;
      expect(e).to.be.instanceOf(Error);
      expect(FheightFirebase.getNumConnections()).to.be.equal(0);
    }));

  it('should resolve on success', () => FheightFirebase.connect(firebaseUrl).getRootRef()
    .then((rootRef) => {
      expect(rootRef).to.exist;
      expect(rootRef.toString()).to.be.equal(firebaseUrl);
      expect(FheightFirebase.getNumConnections()).to.be.equal(1);
      FheightFirebase.disconnect(firebaseUrl);
    }));

  it('should avoid recreating existing connections', () => {
    const firstRef = FheightFirebase.connect(firebaseUrl).getRootRef();

    return FheightFirebase.connect(firebaseUrl).getRootRef()
      .then((rootRef) => {
        expect(rootRef).to.exist;
        expect(rootRef.toString()).to.be.equal(firebaseUrl);
        expect(FheightFirebase.getNumConnections()).to.be.equal(1);
        FheightFirebase.disconnect(firebaseUrl);
      });
  });

  it('should create new connections for new URLs', () => {
    const anotherUrl = 'https://another-fheight-project.firebaseio.local/';
    const firstRef = FheightFirebase.connect(firebaseUrl).getRootRef();

    return FheightFirebase.connect(anotherUrl).getRootRef()
      .then((rootRef) => {
        expect(rootRef).to.exist;
        expect(FheightFirebase.getNumConnections()).to.be.equal(2);
        FheightFirebase.disconnect(firebaseUrl);
        FheightFirebase.disconnect(anotherUrl);
      });
  });

  it('should write test data', () => FheightFirebase.connect(firebaseUrl).getRootRef()
    .then((rootRef) => {
      rootRef.child(testRef)
        .set(testObject, (error) => {
          expect(error).to.not.exist;
          FheightFirebase.disconnect(firebaseUrl);
        });
    }));

  it('should read back test data', () => FheightFirebase.connect(firebaseUrl).getRootRef()
    .then((rootRef) => {
      rootRef.child(testRef)
        .once('value')
        .then((snapshot) => {
          expect(snapshot.val().to.be.equal(testObject));
          FheightFirebase.disconnect(firebaseUrl);
        });
    }));
});
