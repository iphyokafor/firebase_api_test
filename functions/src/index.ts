import * as functions from "firebase-functions";
import * as express from "express";

import {
  addEntry,
  deleteEntry,
  //   getAllEntries,
  updateEntry,
} from "./entryController";

const app = express();

app.get("/", (req, res) => res.status(200).send("Hey there!"));
app.post("/entries", addEntry);
// app.get("/entries", getAllEntries);
app.patch("/entries/:entryId", updateEntry);
app.delete("/entries/:entryId", deleteEntry);

exports.app = functions.https.onRequest(app);

exports.handleNewEntry = functions.firestore
  .document("entries/{entryId}")
  .onCreate(async (change) => {
    console.log("I am on create", change.data());
  });

exports.handleUpdateEntry = functions.firestore
  .document("entries/{entryId}")
  .onUpdate(async (change) => {
    console.log("I am on update after", change.after.data());
    console.log("I am on update before", change.before.data());
  });

// const OnCreateTrigger = async (snap) =>  {
// 	const { entryId, title, text } = snap.data();

//   console.log(title, text);
// };
// const OnUpdateTrigger = async (snap) =>  {
// 	const { entryId, title, text } = snap.data();

//   console.log(entryId, title, text);
// };

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
// const customerId = nanoid();
//  const verifcation =  debugger.collection('customers').doc(customerId).collction('payments').doc('paymentId').get();

//  debugger.collectionGroup('transactions').where('amount', '==', 100000)
//  const verifcationData = verifcation.data()
//   response.send("Hello from Firebase!");
// });
