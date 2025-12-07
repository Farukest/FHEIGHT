
# Configuration object
config = require("../config/config.js")
Firebase = require("firebase")
_ = require("underscore")
fbRef = new Firebase(config.get("firebase"))

# Firebase secure token for fheight-dev.firebaseio.com
firebaseToken = config.get("firebaseToken")
FheightFirebase= require("../server/lib/fheight_firebase_module")
fbUtil = require '../app/common/utils/utils_firebase.js'
Promise = require 'bluebird'
uuid = require 'node-uuid'

console.log process.argv

count = process.argv[2] || 10
count = parseInt(count)
console.log "generating #{count} codes"

FheightFirebase.connect().getRootRef()
.bind({})
.then (fbRootRef) ->
  promises = []
  for [1..count]
    promise = new Promise (resolve,reject) ->
      id = uuid.v4()
      newCode = fbRootRef.child("invite-codes").child('active').child(id)
      newCode.setWithPriority {created_at:Firebase.ServerValue.TIMESTAMP}, Firebase.ServerValue.TIMESTAMP, (error) ->
        if error
          reject(error)
        else
          resolve(newCode.key())
    promises.push(promise)

  return Promise.all(promises)
.then (results) ->
  console.log("All done.")
  for result in results
    console.log(result)
  process.exit(1)
.catch (error) ->
  console.log(error)
  process.exit(1)
