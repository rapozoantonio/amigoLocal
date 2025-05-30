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
  getAggregateFromServer,
  sum,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import {
  ref as refDatabase,
  set,
  update,
  increment as incrementDatabase,
} from "firebase/database";
// Utilities
import { defineStore } from "pinia";
import Swal from "sweetalert2";

import { auth, firestore, storage, database } from "@/core/plugins/firebase";
import guestSchema from "@/management/schemas/guestSchema";

export const useFirebaseStore = defineStore("firebase", () => {
  // CONVERTERS

  const createDocumentConverter = {
    toFirestore: (document) => {
      const timestamp = serverTimestamp();
      const user = auth.currentUser
        ? { id: auth.currentUser.uid, email: auth.currentUser.email }
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
        ? { id: auth.currentUser.uid, email: auth.currentUser.email }
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
        ? { id: auth.currentUser.uid, email: auth.currentUser.email }
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
        ? { id: auth.currentUser.uid, email: auth.currentUser.email }
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

  const updateDocumentConverter = {
    toFirestore: (document) => {
      const d = { ...document };
      delete d.followers;
      const timestamp = serverTimestamp();
      const user = auth.currentUser
        ? { id: auth.currentUser.uid, email: auth.currentUser.email }
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

  const createGuestConverter = {
    toFirestore: (document) => {
      const timestamp = serverTimestamp();
      const user = auth.currentUser
        ? { id: auth.currentUser.uid, email: auth.currentUser.email }
        : null;
      const now = Date.now();
      const keys = ["name", "taxId", "phone", "email", "instagram"];
      const ids = [];
      keys.forEach((key) => {
        if (document[key]) ids.push(document[key]);
      });

      const initialDocument = createDocumentFromSchema(guestSchema);

      return {
        ...initialDocument,
        ...document,
        created_at: timestamp,
        created_by: user,
        createdTime: now,
        updated_at: timestamp,
        updated_by: user,
        updatedTime: now,
        status: "pending",
        promoter: document.promoter ? document.promoter : user,
        promoterId: document.promoter?.id || user?.id,
        ids: ids,
      };
    },
    fromFirestore: (snapshot, options) => {
      return snapshot.data(options);
    },
  };

  const updateGuestConverter = {
    toFirestore: (document) => {
      const timestamp = serverTimestamp();
      const user = auth.currentUser
        ? { id: auth.currentUser.uid, email: auth.currentUser.email }
        : null;
      const now = Date.now();
      const keys = ["name", "taxId", "phone", "email", "instagram"];
      const ids = [];
      keys.forEach((key) => {
        if (document[key]) ids.push(document[key]);
      });

      const returnDocument = {
        ...document,
        updated_at: timestamp,
        updated_by: user,
        updatedTime: now,
        ids: ids,
      };

      if (!document.created_at) returnDocument.created_at = timestamp;
      if (!document.created_by) returnDocument.created_by = user;
      if (!document.createdTime) returnDocument.createdTime = now;

      return returnDocument;
    },
    fromFirestore: (snapshot, options) => {
      return snapshot.data(options);
    },
  };

  const converter = {
    events: createEventConverter,
    update: updateDocumentConverter,
    create: createDocumentConverter,
    promoterRequest: promoterRequestConverter,
    promoters: createPromoterConverter,
    guestCreate: createGuestConverter,
    guestUpdate: updateGuestConverter,
  };

  function createDocumentFromSchema(schema) {
    const fields = schema.sections.reduce((total, sec) => {
      total.push(...sec.fields);
      return total;
    }, []);
    return fields.reduce((total, field) => {
      total[field.id] = field.initial !== undefined ? field.initial : null;
      return total;
    }, {});
  }

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

  function watchDocument(options, setDocument) {
    const d = doc(firestore, options.path, options.docId);
    console.log({ d });
    const unsubscribe = onSnapshot(d, (snapshot) => {
      console.log("snapshot", snapshot.data());
      setDocument(snapshot.data());
    });
    return unsubscribe;
  }

  function watchCollection(
    options,
    addedCallback,
    modifiedCallback,
    removedCallback
  ) {
    try {
      const q = query(collection(firestore, options.path));
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
            console.log("Removed doc: ", change.doc.data());
            removedCallback(change.doc.data());
          }
        });
      });
      return unsubscribe;
    } catch (error) {
      console.log({ error });
      notifyError(error);
    }
  }

  // UPLOAD PICTURE
  async function uploadPicture(picture) {
    try {
      const storageRef = ref(storage, picture.path);
      await uploadBytes(storageRef, picture.file);
      const url = await getDownloadURL(storageRef);
      return {
        // name: picture.name,
        path: picture.path,
        url: url,
      };
    } catch (error) {
      return error;
    }
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

  async function processFileUpload(col, document) {
    try {
      const entries = Object.entries(document);

      const fields = entries.map(async ([fieldName, fieldValue]) => {
        if (fieldValue instanceof File) {
          const pictureToUpload = {
            name: fieldName,
            path: `${col}/${document.id}/${fieldName}.${fieldValue.type
              .split("/")
              .pop()}`,
            file: fieldValue,
          };
          const picture = await uploadPicture(pictureToUpload);
          return [fieldName, picture];
        } else if (Array.isArray(fieldValue)) {
          const hasFile = fieldValue.some((f) => f instanceof File);
          if (hasFile) {
            const picturesMap = fieldValue.map(async (value, index) => {
              if (value instanceof File) {
                const pictureToUpload = {
                  name: fieldName,
                  path: `${col}/${
                    document.id
                  }/${fieldName}-${index}.${value.type.split("/").pop()}`,
                  file: value,
                };
                const picture = await uploadPicture(pictureToUpload);
                return picture;
              }
              return value;
            });
            const pictures = await Promise.all(picturesMap);
            return [fieldName, pictures];
          }
          return [fieldName, fieldValue];
        }
        return [fieldName, fieldValue];
      });

      console.log({ fields });

      const fieldArray = await Promise.all(fields);

      const objMerge = fieldArray.reduce((total, [fieldName, fieldValue]) => {
        total[fieldName] = fieldValue;
        return total;
      }, {});

      console.log({ objMerge });
      return objMerge;
    } catch (error) {
      console.log({ error });
      return {};
    }
  }

  async function processFileUpload2(col, document) {
    try {
      const entries = Object.entries(document);
      const filesToUpload = entries.reduce((total, [fieldName, fieldValue]) => {
        if (fieldValue instanceof File) {
          total.push({
            name: fieldName,
            path: `${col}/${document.id}/${fieldName}.${fieldValue.type
              .split("/")
              .pop()}`,
            file: fieldValue,
          });
          return total;
        } else if (Array.isArray(fieldValue)) {
          if (fieldValue[0] instanceof File) {
            const fields = fieldValue.map((value, index) => {
              return {
                name: fieldName,
                path: `${col}/${document.id}/${fieldName}-${index}.${value.type
                  .split("/")
                  .pop()}`,
                file: value,
              };
            });

            total.push(...fields);
            return total;
          }
          return total;
        }
        return total;
      }, []);
      console.log({ filesToUpload });
      const pictures = await uploadPictures(filesToUpload);
      console.log({ pictures });
      const objMerge = pictures.reduce((total, picture) => {
        if (total[picture.name]) {
          if (Array.isArray(total[picture.name])) {
            total[picture.name] = [
              ...total[picture.name],
              { path: picture.path, url: picture.url },
            ];
            return total;
          } else {
            total[picture.name] = [
              total[picture.name],
              { path: picture.path, url: picture.url },
            ];
            return total;
          }
        } else {
          total[picture.name] = { path: picture.path, url: picture.url };
          return total;
        }
      }, {});
      console.log({ objMerge });
      return objMerge;
    } catch (error) {
      console.log({ error });
      return {};
    }
  }

  // POST DOCUMENT
  async function postDocumentWithFile(col, docu, type = "create") {
    let document = { ...docu };

    let fireDocument = null;
    if (document.id) {
      fireDocument = getPostDocRefWithId(col, document.id, converter[type]);
    } else {
      fireDocument = getPostDocRef(col, converter[type]);
      document.id = fireDocument.id;
    }
    try {
      // search for files.
      // PROCESS FILES IF HAVE

      const objMerge = await processFileUpload(col, document);
      document = { ...document, ...objMerge };

      console.log({ document });
      // FINISH PROCESS FILES
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

  // ADD ITEM TO AN ARRAY

  async function addItemToArrayField(path, fieldName, item, type = "update") {
    const fireDocument = doc(firestore, `${path}`).withConverter(
      converter[type]
    );
    try {
      const document = {};
      document[fieldName] = arrayUnion(item);

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
      notifyError(error);

      return {
        ok: false,
        error,
      };
    }
  }

  async function removeItemToArrayField(
    path,
    fieldName,
    item,
    type = "update"
  ) {
    const fireDocument = doc(firestore, `${path}`).withConverter(
      converter[type]
    );
    try {
      const document = {};
      document[fieldName] = arrayRemove(item);

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
      notifyError(error);

      return {
        ok: false,
        error,
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
  async function putDocument(col, id, document, type = "update") {
    const fireDocument = doc(firestore, `${col}/${id}`).withConverter(
      converter[type]
    );
    try {
      const objMerge = await processFileUpload(col, document);
      console.log({ objMerge });
      document = { ...document, ...objMerge };
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
      notifyError(error);

      return {
        ok: false,
        error,
      };
    }
  }

  // POST DOCUMENT 2
  async function postDocument2(col, document) {
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
    // const queries = data.query ? Object.entries(data.query) : [];
    // const queries = data.query ? Object.entries(data.query) : [];
    const pageSize = data.limit || 100;
    const order = data.orderBy;
    const direction = data.direction || "desc";

    let queries = [];
    let queryItems = [];
    // QUERY EM ARRAY
    if (data.query && Array.isArray(data.query)) {
      queries = data.query;
      queryItems = queries.map(([key, operator, value]) => {
        return where(key, operator, value);
      });
    }
    // QUERY EM OBJETO
    else {
      queries = data.query ? Object.entries(data.query) : [];
      queryItems = queries.map((q) => {
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
        // console.log({ key, operator, value });
        return where(key, operator, value);
      });
    }

    try {
      if (data.collection) {
        // const timestamp = Timestamp.fromDate(new Date('2023-11-25'));
        // const q = query(collection(firestore, "products"), where("created_at", ">", timestamp));
        // let q = query(
        //   collection(firestore, data.collection),
        //   ...queryItems,
        //   limit(pageSize),
        //   orderBy(order, direction)
        // );
        let q;
        if (order) {
          q = query(
            collection(firestore, data.collection),
            ...queryItems,
            limit(pageSize),
            orderBy(order, direction)
          );
        } else {
          q = query(
            collection(firestore, data.collection),
            ...queryItems,
            limit(pageSize)
          );
        }

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

  // GET COUNT
  async function getCount(data) {
    console.log("getCount", data);
    let queries = [];
    let queryItems = [];
    // QUERY EM ARRAY
    if (data.query && Array.isArray(data.query)) {
      queries = data.query;
      queryItems = queries.map(([key, operator, value]) => {
        return where(key, operator, value);
      });
    }
    // QUERY EM OBJETO
    else {
      queries = data.query ? Object.entries(data.query) : [];
      queryItems = queries.map((q) => {
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
        // console.log({ key, operator, value });
        return where(key, operator, value);
      });
    }
    try {
      if (data.collection) {
        let q;
        q = query(collection(firestore, data.collection), ...queryItems);
        const countSnapshot = await getCountFromServer(q);
        const totalCount = countSnapshot.data().count;
        return {
          ok: true,
          data: totalCount,
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

  // GET SUM
  async function getSum(data) {
    console.log("getSum", data);
    let queries = [];
    let queryItems = [];
    // QUERY EM ARRAY
    if (data.query && Array.isArray(data.query)) {
      queries = data.query;
      queryItems = queries.map(([key, operator, value]) => {
        return where(key, operator, value);
      });
    }
    // QUERY EM OBJETO
    else {
      queries = data.query ? Object.entries(data.query) : [];
      queryItems = queries.map((q) => {
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
        // console.log({ key, operator, value });
        return where(key, operator, value);
      });
    }
    try {
      if (data.collection) {
        let q;
        q = query(collection(firestore, data.collection), ...queryItems);

        const countSnapshot = await getAggregateFromServer(q, {
          total: sum(data.field),
        });
        const total = countSnapshot.data().total;
        return {
          ok: true,
          data: total,
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

  // DATABASE

  // async function addClickCountToEvent(eventId) {
  //   const updateClick = update(refDatabase(database, "events/" + eventId), {
  //     clickCount: incrementDatabase(1),
  //   });
  //   console.log({ updateClick });
  // }

  // addClickCountToEvent("25UBJKMC0NmNVYdU5ax1");
  console.log("firebase Store");

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
    watchDocument,
    removeItemToArrayField,
    addItemToArrayField,
    postDocumentWithFile,
    uploadPicture,
    getCount,
    getSum,
  };
});
