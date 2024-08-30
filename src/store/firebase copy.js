import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
// Utilities
import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

import {
  auth,
  firestore,
  storage,
} from '@/plugins/firebase';

export const useFirebaseStore = defineStore("firebase", () => {
  const createdocumentConverter = {
    toFirestore: (document) => {
      
      return {
        ...document,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        created_by: auth.currentUser
          ? { uid: auth.currentUser.uid, email: auth.currentUser.email }
          : null,
        updated_by: auth.currentUser
          ? { uid: auth.currentUser.uid, email: auth.currentUser.email }
          : null,
        createdTime: Date.now(),
        updatedTime: Date.now(),
      };
    },
    fromFirestore: (snapshot, options) => {
      const document = snapshot.data(options);
      return {
        ...document,
        created_at: document.created_at
          ? new Date(document.created_at.toDate()).toISOString()
          : null,
        updated_at: document.updated_at
          ? new Date(document.created_at.toDate()).toLocaleString("pt-BR", {
              timeZone: "Europe/Madrid",
            })
          : null,
      };
    },
  };

  const updatedocumentConverter = {
    toFirestore: (document) => {
      const d = { ...document };
      delete d.created_at;
      delete d.created_by;
      delete d.createdTime;
      return {
        ...d,
        updated_at: serverTimestamp(),
        updated_by: auth.currentUser
          ? { uid: auth.currentUser.uid, email: auth.currentUser.email }
          : null,
        updatedTime: Date.now(),
      };
    },
    fromFirestore: (snapshot, options) => {
      const document = snapshot.data(options);
      return {
        ...document,
        created_at: document.created_at
          ? new Date(document.created_at.toDate()).toISOString()
          : null,
        updated_at: document.updated_at
          ? new Date(document.created_at.toDate()).toLocaleString("pt-BR", {
              timeZone: "Europe/Madrid",
            })
          : null,
      };
    },
  };

  async function registerUser(user) {
    const fireDocument = doc(firestore, "users", user.id).withConverter(
      createdocumentConverter
    );
    try {
      const docRef = await setDoc(fireDocument, user);
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

  async function getCurrentUser() {
    if (auth.currentUser) {
      return {
        id: auth.currentUser.uid,
        email: auth.currentUser.email,
      };
    }
    return null;
  }

  function getPostDocRef(col) {
    return doc(collection(firestore, col)).withConverter(
      createdocumentConverter
    );
  }

  function getPostDocRefWithId(col, id) {
    return doc(firestore, `${col}/${id}`).withConverter(
      createdocumentConverter
    );
  }

  async function postDocument(col, docu, config) {
    const document = { ...docu };
    
    let fireDocument = null;
    if (document.id) {
      fireDocument = getPostDocRefWithId(col, document.id);
    } else {
      fireDocument = getPostDocRef(col);
      document.id = fireDocument.id;
    }
    try {
      const docRef = await setDoc(fireDocument, document);
      
      const notify = (
        title = "Document added",
        text = `<p>Document added to <strong>${col}</strong> collection<p><p>ID: ${document.id}`
      ) => {
        Swal.fire({
          title: title,
          html: text,
          icon: "success",
        });
      };
      return {
        ok: true,
        data: { id: document.id },
        notify,
      };
    } catch (error) {
      notifyError(error);
      
      return {
        ok: false,
      };
    }
  }

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

  async function putDocument(col, id, document) {
    
    const fireDocument = doc(firestore, `${col}/${id}`).withConverter(
      updatedocumentConverter
    );
    try {
      const docRef = await setDoc(fireDocument, document, {
        merge: true,
      });
      Swal.fire({
        title: "Document Updated",
        html: `Document <strong>${id}</strong> sucessfully updated at <strong>${col}</strong> collection`,
        icon: "success",
      });
      return {
        ok: true,
      };
    } catch (error) {
      notifyError(Error);
      
      return {
        ok: false,
        error,
      };
    }
  }
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
  async function getCollection(data) {
    const items = [];
    const queries = Object.entries(data.query);
    
    const queryItens = queries.map((q) => {
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
        if (queryItens.length > 0) {
          q = query(collection(firestore, "products"), ...queryItens);
          
        } else {
          q = query(collection(firestore, "products"));
          
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
    
    const queryItens = queries.map((q) => {
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
        if (queryItens.length > 0) {
          q = query(collection(firestore, "products"), ...queryItens);
          
        } else {
          q = query(collection(firestore, "products"));
          
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

  function notifyError(error) {
    Swal.fire({
      title: error.code,
      text: error.message,
      icon: "error",
    });
  }

  async function getDocumentById(col, id) {
    try {
      const docRef = await getDoc(
        doc(firestore, col, id).withConverter(createdocumentConverter)
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
  };
});
