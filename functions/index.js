/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { admin, functions, auth } = require("./config");

// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.registerUser = functions.auth.user().onCreate(async (user) => {
  const adminEmails = [
    "danielalves.ef@gmail.com",
    "danielalves.ef@hotmail.com",
    "rapozoantonio@gmail.com",
  ];
  const adminClaims = {
    admin: true,
    role: "admin",
    levelAccess: 9,
  };
  const userClaims = {
    admin: false,
    role: "user",
    levelAccess: 1,
  };

  const customClaims = adminEmails.includes(user.email)
    ? adminClaims
    : userClaims;

  try {
    await admin.auth().setCustomUserClaims(user.uid, customClaims);

    const userDocument = {
      uid: user.uid,
      email: user.email,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      name: null,
      birthday: null,
      language: ,
      gender: null,
      country: "BR",
      region: null,
      $completed: false,
      customClaims: {
        ...customClaims,
      },
      metadata: {
        ...user.metadata,
      },
    };

    if (user.displayName) {
      userDocument.name = user.displayName;
    }

    

    await admin
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set(userDocument, { merge: true });
  } catch (error) {
    
  }
});

exports.deleteUser = functions.auth.user().onDelete(async (user) => {
  try {
    await admin.firestore().collection("users").doc(user.uid).delete();
  } catch (error) {
    
  }
});

exports.getAllUsers = functions.https.onCall(async () => {
  
  try {
    const userRecords = await auth.listUsers(100);
    const users = userRecords.users.map((user) => user.toJSON());
    return { data: users, ok: true };
  } catch (error) {
    return { error, ok: false };
  }
});

exports.updateRole = functions.https.onCall(async ({ uid, customClaims }) => {
  try {
    
    await auth.setCustomUserClaims(uid, customClaims);
    await admin
      .firestore()
      .collection("users")
      .doc(uid)
      .update({ customClaims });
    return { data: { customClaims }, ok: true };
  } catch (error) {
    
    return { error, ok: false };
  }
});

// exports.approvePromoterRequest = functions.https.onCall(async (request) => {
//   try {
//     await admin.firestore().collection("requests").doc(request.id).update({ approved: true, status: "approved" });
//     await admin.firestore().collection("promoters").doc(request.id).set(request.model, {merge: true});
//     await auth.setCustomUserClaims(request.id, customClaims);
//   } catch (error) {
    
//   }
// })


exports.updateGenresCount = functions.firestore
  .document('events/{eventId}')
  .onWrite(async (change, context) => {
    const isDeleted = !change.after.exists;
    const document = change.after.exists ? change.after.data() : change.before.data();
    const genres = document.genres;
    const region = document.region.id;
    const payload = {
      genresCount: {}
    };
    payload.genresCount[region] = {};
    const newCount = isDeleted ? -1 : 1

    genres.forEach(genre => {
      payload.genresCount[region][genre] = admin.firestore.FieldValue.increment(newCount);
    })
    await admin
    .firestore()
    .collection("meta")
    .doc("events")
    .update(payload, { merge: true });
  });
