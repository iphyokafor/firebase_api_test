import { Response } from "express";
import { db } from "./config/firebase";
// const functions = require("firebase-functions");

enum statusEnum {
  verified = "verified",
  unverified = "unverified",
}

type EntryType = {
  title: string;
  text: string;
  coverImageUrl: string;
  status: statusEnum;
};

type Request = {
  body: EntryType;
  params: { entryId: string };
};

const addEntry = async (req: Request, res: Response) => {
  const { title, text } = req.body;
  try {
    const entry = db.collection("entries").doc();
    const entryObject = {
      id: entry.id,
      title,
      text,
    };
    entry.set(entryObject);

    res.status(200).send({
      status: "success",
      message: "entry added successfully",
      data: entryObject,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// In firestore, a QuerySnapshot contains the result of a query
// Loop through the querySnapshot and push document data to allEntries array
// const getAllEntries = async (req: Request, res: Response) => {
//   try {
//     const allEntries: EntryType[] = [];
//     const querySnapshot = await db.collection("entries").get();
//     querySnapshot.forEach((doc: any) => allEntries.push(doc.data()));
//     return res.status(200).json(allEntries);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// };

// const getAllEntries = async (req: Request, res: Response) => {
//       try {
//         const observer = db.collection('entries').where('status', '==', 'verified')
//   .onSnapshot(querySnapshot => {
//     querySnapshot.docChanges().forEach(change => {
//       if (change.type === 'added') {
//         console.log('New city: ', change.doc.data());
//       }
//       if (change.type === 'modified') {
//         console.log('Modified city: ', change.doc.data());
//       }
//       if (change.type === 'removed') {
//         console.log('Removed city: ', change.doc.data());
//       }
//     });
//   })
//       } catch (error) {
//         return res.status(500).json(error);
//       }
//     };

// db.collection("entries")
//   .where("status", "==", "verified")
//   .onSnapshot((snapshot) => {
//     let changes = snapshot.docChanges();
//     changes.forEach((change) => {
//       console.log(change.doc.data());
//     });
//   });

const updateEntry = async (req: Request, res: Response) => {
  const {
    body: { text, title },
    params: { entryId },
  } = req;

  try {
    const entry = db.collection("entries").doc(entryId);
    const currentData = (await entry.get()).data() || {};
    const entryObject = {
      title: title || currentData.title,
      text: text || currentData.text,
    };

    await entry.set(entryObject).catch((error) => {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    });

    return res.status(200).json({
      status: "success",
      message: "entry updated successfully",
      data: entryObject,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteEntry = async (req: Request, res: Response) => {
  const { entryId } = req.params;

  try {
    const entry = db.collection("entries").doc(entryId);

    await entry.delete().catch((error) => {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    });

    return res.status(200).json({
      status: "success",
      message: "entry deleted successfully",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
// exports.newNodeDetected = functions.database
//   .ref("entries/XXDbfK7NTDLv6tlP8OW5/status")
//   .onCreate((snapshot: { val: () => any }, context: any) => {
//     var status = snapshot.val();
//     console.log(status);
//   });

export { addEntry, updateEntry, deleteEntry };
// export { addEntry, getAllEntries, updateEntry, deleteEntry };
