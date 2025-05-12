import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
  onSnapshot,
  collectionGroup,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// Utilities
import { defineStore } from "pinia";
import Swal from "sweetalert2";

import { auth, firestore, storage } from "@/core/plugins/firebase";

export const useFirebaseStore = defineStore("firebase", () => {
  // CONVERTERS

  const createDocumentConverter = {
    toFirestore: (document) => {
      const timestamp = serverTimestamp();
      const user = auth.currentUser
        ? { uid: auth.currentUser.uid, email: auth.currentUser.email }
        : null;
      const now = Date.now();

      return {
        ...document,
        created_at: timestamp,
        created_by: user,
        createdTime: now,
        updated_at: timestamp,
        updated_by: user,
        updatedTime: now,
      };
    },
    fromFirestore: (snapshot, options) => {
      return snapshot.data(options);
    },
  };

  const promoterRequestConverter = {
    toFirestore: (document) => {
      const timestamp = serverTimestamp();
      const user = auth.currentUser
        ? { uid: auth.currentUser.uid, email: auth.currentUser.email }
        : null;
      const now = Date.now();

      return {
        ...document,
        created_at: timestamp,
        created_by: user,
        createdTime: now,
        updated_at: timestamp,
        updated_by: user,
        updatedTime: now,
        entity: "promoters",
        approved: false,
        status: "pending",
      };
    },
    fromFirestore: (snapshot, options) => {
      return snapshot.data(options);
    },
  };

  const createEventConverter = {
    toFirestore: (event) => {
      const timestamp = serverTimestamp();
      const user = auth.currentUser
        ? { uid: auth.currentUser.uid, email: auth.currentUser.email }
        : null;
      const now = Date.now();

      return {
        ...event,
        created_at: timestamp,
        created_by: user,
        createdTime: now,
        updated_at: timestamp,
        updated_by: user,
        updatedTime: now,
        approved: false,
        featured: false,
        followers: 0,
      };
    },
    fromFirestore: (snapshot, options) => {
      return snapshot.data(options);
    },
  };

  const createPromoterConverter = {
    toFirestore: (promoter) => {
      const timestamp = serverTimestamp();
      const user = auth.currentUser
        ? { uid: auth.currentUser.uid, email: auth.currentUser.email }
        : null;
      const now = Date.now();

      return {
        ...promoter,
        created_at: timestamp,
        created_by: user,
        createdTime: now,
        updated_at: timestamp,
        updated_by: user,
        updatedTime: now,
        approved: true,
        featured: false,
        followers: 0,
      };
    },
    fromFirestore: (snapshot, options) => {
      return snapshot.data(options);
    },
  };

  const updatedocumentConverter = {
    toFirestore: (document) => {
      const d = { ...document };
      delete d.followers;
      const timestamp = serverTimestamp();
      const user = auth.currentUser
        ? { uid: auth.currentUser.uid, email: auth.currentUser.email }
        : null;
      const now = Date.now();

      return {
        ...d,
        updated_at: timestamp,
        updated_by: user,
        updatedTime: now,
      };
    },
    fromFirestore: (snapshot, options) => {
      return snapshot.data(options);
    },
  };

  const converter = {
    events: createEventConverter,
    update: updatedocumentConverter,
    create: createDocumentConverter,
    promoterRequest: promoterRequestConverter,
    promoters: createPromoterConverter,
  };

  // REGISTER USER
  async function registerUser(user) {
    const fireDocument = doc(firestore, "users", user.id).withConverter(
      createDocumentConverter
    );
    try {
      const docRef = await setDoc(fireDocument, user, { merge: true });
      const notify = () =>
        Swal.fire({
          title: "User created",
          html: `<p>User <strong>${user.id}</strong> added<p><p>Email: ${user.email}`,
          icon: "success",
        });
      return {
        ok: true,
        data: docRef,
        notify,
      };
    } catch (error) {
      notifyError(error);

      return {
        ok: false,
        error,
      };
    }
  }

  async function watchCollection(
    path,
    addedCallback,
    modifiedCallback,
    removedCallback
  ) {
    const q = query(collection(firestore, path));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("New doc: ", change.doc.data());
          addedCallback(change.doc.data());
        }
        if (change.type === "modified") {
          modifiedCallback(change.doc.data());
        }
        if (change.type === "removed") {
          console.log("Removed city: ", change.doc.data());
          removedCallback(change.doc.data());
        }
      });
    });
    return unsubscribe;
  }

  // UPLOAD PICTURES
  async function uploadPictures(pictures) {
    const promises = pictures.map(async (picture) => {
      try {
        const storageRef = ref(storage, picture.path);
        await uploadBytes(storageRef, picture.file);
        const url = await getDownloadURL(storageRef);
        return {
          name: picture.name,
          path: picture.path,
          url: url,
        };
      } catch (error) {
        return error;
      }
    });
    const result = await Promise.all(promises);

    return result;
  }

  // GET CURRENT USER
  function getCurrentUser() {
    if (auth.currentUser) {
      return {
        id: auth.currentUser.uid,
        email: auth.currentUser.email,
        name: auth.currentUser.displayName,
      };
    }
    return null;
  }

  // ADD FOLLOW
  async function addFollow(col, id, user) {
    try {
      // ADD ENTITY ID TO USER FOLLOW COLLECTION IN THE EVENT DOC
      const UserEntityFollows = doc(
        firestore,
        `users/${user.uid}/follows/${col}`
      );
      const docRef = await setDoc(
        UserEntityFollows,
        {
          following: arrayUnion(id),
        },
        { merge: true }
      );
      // ADD FOLLOW RECORD IN THE ENTITY FOLLOW COLLECTION
      const EntityFollows = doc(firestore, `${col}/${id}/follows/${user.uid}`);
      const docRef2 = await setDoc(
        EntityFollows,
        {
          user_id: user.uid,
          user_email: user.email,
          entity: col,
          entity_id: id,
          created_at: Date.now(),
        },
        { merge: true }
      );
      //  INCREASE COUNT OF FOLLOWS IN THE ENTITY DOCUMENT
      const entityDocument = doc(firestore, `${col}/${id}`);
      const docRef3 = await updateDoc(entityDocument, {
        followers: increment(1),
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  // REMOVE FOLLOW
  async function removeFollow(col, id, user) {
    try {
      // REMOVE ENTITY ID TO USER FOLLOW COLLECTION IN THE EVENT DOC
      const UserEntityFollows = doc(
        firestore,
        `users/${user.uid}/follows/${col}`
      );
      const docRef = await updateDoc(UserEntityFollows, {
        following: arrayRemove(id),
      });

      // REMOVE FOLLOW RECORD IN THE ENTITY FOLLOW COLLECTION
      const EntityFollows = doc(firestore, `${col}/${id}/follows/${user.uid}`);
      const docRef2 = await deleteDoc(EntityFollows);

      //  INCREASE COUNT OF FOLLOWS IN THE ENTITY DOCUMENT
      const entityDocument = doc(firestore, `${col}/${id}`);
      const docRef3 = await updateDoc(entityDocument, {
        followers: increment(-1),
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async function deleteDocument(col, docId) {
    try {
      const docRef = doc(firestore, `${col}/${docId}`);
      const deleteResponse = await deleteDoc(docRef);
      return {
        ok: true,
      };
    } catch (error) {
      console.log({ error });
      return { ok: false, error };
    }
  }

  async function countDocuments(col, queryDoc) {
    const coll = collection(firestore, col);
    console.log({ coll });
    const q = query(coll, where(...queryDoc));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  // GET DOC REF
  function getPostDocRef(col, converter = createDocumentConverter) {
    return doc(collection(firestore, col)).withConverter(converter);
  }

  // GET REF BY ID
  function getPostDocRefWithId(col, id, converter = createDocumentConverter) {
    return doc(firestore, `${col}/${id}`).withConverter(converter);
  }

  async function postBulkDocuments(col, docs) {
    const promises = docs.map((document) => {
      return postDocument(col, document);
    });
    try {
      const response = await Promise.all(promises);
      return {
        ok: true,
        data: response,
      };
    } catch (error) {
      notifyError(error);

      return {
        ok: false,
        error: error,
      };
    }
  }

  // POST DOCUMENT
  async function postDocument(col, docu, type = "create") {
    const document = { ...docu };

    let fireDocument = null;
    if (document.id) {
      fireDocument = getPostDocRefWithId(col, document.id, converter[type]);
    } else {
      fireDocument = getPostDocRef(col, converter[type]);
      document.id = fireDocument.id;
    }
    try {
      const docRef = await setDoc(fireDocument, document);

      const notify = (
        title = "Document added",
        text = `<p>Document added to <strong>${col}</strong> collection<p><p>ID: ${document.id}`,
        button = "OK"
      ) => {
        return Swal.fire({
          title: title,
          html: text,
          icon: "success",
          confirmButtonText: button,
        });
      };
      return {
        ok: true,
        data: { id: document.id, document },
        notify,
      };
    } catch (error) {
      notifyError(error);

      return {
        ok: false,
      };
    }
  }

  // BULK UPDATE DOCUMENTS
  async function bulkUpdateDocuments(operations, feedback = true) {
    if (Array.isArray(operations)) {
      const promises = operations.map(async ([col, id, document]) => {
        const fireDocument = doc(firestore, `${col}/${id}`);
        const docRef = await setDoc(fireDocument, document, { merge: true });
        return { ok: true };
      });
      try {
        const response = await Promise.all(promises);
        if (feedback) {
          Swal.fire({
            title: "Documents Updated",
            html: `Documents sucessfully updated!`,
            icon: "success",
          });
        }
      } catch (error) {
        notifyError(error);
      }
    } else {
      Swal.fire({
        text: "The value passed as argument is not an Array",
        icon: "error",
      });
    }
  }

  // PUT DOCUMENT
  async function putDocument(col, id, document) {
    const fireDocument = doc(firestore, `${col}/${id}`).withConverter(
      updatedocumentConverter
    );
    try {
      const docRef = await setDoc(fireDocument, document, {
        merge: true,
      });

      const notify = (
        title = "Document Updated",
        html = `Document <strong>${id}</strong> sucessfully updated at <strong>${col}</strong> collection`
      ) => {
        Swal.fire({
          title: title,
          html: html,
          icon: "success",
        });
      };

      return {
        ok: true,
        notify,
      };
    } catch (error) {
      notifyError(Error);

      return {
        ok: false,
        error,
      };
    }
  }

  // POST DOCUMENT 2
  async function postDocument2(col, document) {
    // document.created_at = serverTimestamp();
    // document.updated_at = serverTimestamp();
    // document.time = Date.now();
    // document.created_by = auth.currentUser ? { uid: auth.currentUser.uid, email: auth.currentUser.email } : null;
    // document.updated_by = auth.currentUser ? { uid: auth.currentUser.uid, email: auth.currentUser.email } : null;
    const fireDocument = doc(firestore, col, document.id).withConverter(
      documentConverter
    );

    try {
      if (document.id) {
        const docRef = await setDoc(fireDocument, document);
        Swal.fire({
          title: "Good job!",
          text: "Document added",
          icon: "success",
        });
        return {
          ok: true,
        };
      } else {
        const docRef = await addDoc(collection(firestore, col), document);
        Swal.fire({
          title: "Good job!",
          text: "Document added",
          icon: "success",
        });
        return {
          ok: true,
        };
      }
    } catch (error) {
      notifyError(error);

      return {
        ok: false,
        error,
      };
    }
  }

  // GET COLLECTION
  async function getCollection(data) {
    console.log("getCollection", data);
    const queries = data.query ? Object.entries(data.query) : [];
    const pageSize = data.limit || 15;
    const order = data.orderBy || "created_at";
    const direction = data.direction || "desc";

    const queryItems = queries.map((q) => {
      const operator = /\[contains\]/.test(q[0])
        ? "array-contains"
        : /\[in\]/.test(q[0])
        ? "in"
        : /\[any\]/.test(q[0])
        ? "array-contains-any"
        : /\[gt\]/.test(q[0])
        ? ">"
        : /\[gte\]/.test(q[0])
        ? ">="
        : /\[lt\]/.test(q[0])
        ? "<"
        : /\[lte\]/.test(q[0])
        ? "<="
        : "==";
      const key = q[0]
        .replace(/\[gte\]/, "")
        .replace(/\[lte\]/, "")
        .replace(/\[gt\]/, "")
        .replace(/\[lt\]/, "")
        .replace(/\[any\]/, "")
        .replace(/\[in\]/, "")
        .replace(/\[contains\]/, "");
      const value = Number(q[1]) ? Number(q[1]) : q[1];

      return where(key, operator, value);
    });

    try {
      if (data.collection) {
        // const timestamp = Timestamp.fromDate(new Date('2023-11-25'));
        // const q = query(collection(firestore, "products"), where("created_at", ">", timestamp));
        let q = query(
          collection(firestore, data.collection),
          ...queryItems,
          limit(pageSize),
          orderBy(order, direction)
        );

        const querySnapshot = await getDocs(q);
        const countSnapshot = await getCountFromServer(
          query(collection(firestore, data.collection), ...queryItems)
        );
        const totalCount = countSnapshot.data().count;

        const items = querySnapshot.docs.map((document) => document.data());
        let lastDoc = querySnapshot.docs[pageSize - 1];
        let next = null;
        if (items.length === pageSize) {
          next = async () => {
            console.log({ lastDoc });
            q = query(
              collection(firestore, data.collection),
              ...queryItems,
              limit(pageSize),
              orderBy(order, direction),
              startAfter(lastDoc)
            );

            const querySnapshot = await getDocs(q);
            const items = querySnapshot.docs.map((document) => document.data());
            lastDoc = querySnapshot.docs[pageSize - 1];
            if (items.length < pageSize || items.length === 0) {
              next = null;
            }
            return {
              ok: true,
              data: items,
              next: next,
              last: lastDoc,
              totalCount: totalCount,
            };
          };
        } else {
          next = null;
        }

        return {
          ok: true,
          data: items,
          next: next,
          last: lastDoc,
          totalCount: totalCount,
        };
      }
    } catch (error) {
      notifyError(error);

      return {
        ok: false,
        error,
      };
    }
  }

  // GET EVENTS BY CATEGORY
  async function getEventsByCategory(data) {
    const items = [];
    const queries = Object.entries(data.query);

    const queryItems = queries.map((q) => {
      const operator = /\[gt\]/.test(q[0])
        ? ">"
        : /\[gte\]/.test(q[0])
        ? ">="
        : /\[lt\]/.test(q[0])
        ? "<"
        : /\[lte\]/.test(q[0])
        ? "<="
        : "==";
      const key = q[0]
        .replace(/\[gte\]/, "")
        .replace(/\[lte\]/, "")
        .replace(/\[gt\]/, "")
        .replace(/\[lt\]/, "");
      const value = Number(q[1]) ? Number(q[1]) : q[1];

      return where(key, operator, value);
    });

    try {
      if (data.collection) {
        // const timestamp = Timestamp.fromDate(new Date('2023-11-25'));

        //
        // const q = query(collection(firestore, "products"), where("created_at", ">", timestamp));
        let q;
        if (queryItems.length > 0) {
          q = query(collection(firestore, data.collection), ...queryItems);
        } else {
          q = query(collection(firestore, data.collection));
        }
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((document) => {
          items.push(document.data());
        });
        // Swal.fire({
        //     title: "Documents fetched",
        //     text: "number of documents: " + items.length,
        //     icon: "success"
        // });
        return {
          ok: true,
          data: items,
        };
      }
    } catch (error) {
      notifyError();

      return {
        ok: false,
        error,
      };
    }
  }

  async function getCollection2(data) {
    const items = [];
    const queries = Object.entries(data.query);

    const queryItems = queries.map((q) => {
      const operator = /\[gt\]/.test(q[0])
        ? ">"
        : /\[gte\]/.test(q[0])
        ? ">="
        : /\[lt\]/.test(q[0])
        ? "<"
        : /\[lte\]/.test(q[0])
        ? "<="
        : "==";
      const key = q[0]
        .replace(/\[gte\]/, "")
        .replace(/\[lte\]/, "")
        .replace(/\[gt\]/, "")
        .replace(/\[lt\]/, "");
      const value = Number(q[1]) ? Number(q[1]) : q[1];

      return where(key, operator, value);
    });

    try {
      if (data.collection) {
        // const q = query(collection(firestore, "products"), where("price", "==", 11));
        let q;
        if (queryItems.length > 0) {
          q = query(collection(firestore, data.collection), ...queryItems);
        } else {
          q = query(collection(firestore, data.collection));
        }
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((document) => {
          items.push(document.data());
        });
        // Swal.fire({
        //     title: "Documents fetched",
        //     text: "number of documents: " + items.length,
        //     icon: "success"
        // });
        return {
          ok: true,
          data: items,
        };
      }
    } catch (error) {
      notifyError(error);

      return {
        ok: false,
        error,
      };
    }
  }

  async function getDocumentById2(data) {
    try {
      const docRef = await getDoc(
        doc(firestore, data.collection, data.id).withConverter(
          documentConverter
        )
      );
      const document = docRef.data();
      // document.created_at = new Date(document.created_at.toDate()).toLocaleString("pt-BR", { timeZone: 'Europe/Madrid' });
      // document.updated_at = new Date(document.updated_at.toDate()).toLocaleString("pt-BR", { timeZone: 'Europe/Madrid' });

      return {
        ok: true,
        data: document,
      };
    } catch (error) {
      notifyError(error);

      return {
        ok: false,
        error,
      };
    }
  }

  // NOTIFY ERROR
  function notifyError(error) {
    Swal.fire({
      title: error.code,
      text: error.message,
      icon: "error",
    });
  }

  async function getDocumentByName(col, name) {
    try {
      const q = query(collection(firestore, col), where("name", "==", name));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      return querySnapshot.docs[0].data();
    } catch (error) {}
  }

  // GET DOCUMENT BY ID
  async function getDocumentById(col, id) {
    try {
      const docRef = await getDoc(
        doc(firestore, col, id).withConverter(createDocumentConverter)
      );

      const document = docRef.data();
      // document.created_at = new Date(document.created_at.toDate()).toLocaleString("pt-BR", { timeZone: 'Europe/Madrid' });
      // document.updated_at = new Date(document.updated_at.toDate()).toLocaleString("pt-BR", { timeZone: 'Europe/Madrid' });

      return {
        ok: true,
        data: document,
      };
    } catch (error) {
      notifyError(error);

      return {
        ok: false,
        error,
      };
    }
  }

  //click increment saving

  return {
    postDocument,
    getCollection,
    getDocumentById,
    putDocument,
    bulkUpdateDocuments,
    registerUser,
    getPostDocRef,
    getPostDocRefWithId,
    uploadPictures,
    getCurrentUser,
    addFollow,
    removeFollow,
    getDocumentByName,
    countDocuments,
    getEventsByCategory,
    postBulkDocuments,
    watchCollection,
    deleteDocument,
  };
});
