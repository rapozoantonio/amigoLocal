import { ref } from "vue";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { firestore } from "@/plugins/firebase";

export const usePromotersStore = defineStore("promoters", () => {
  const promoter = ref(null);
  const promoters = ref(null);
  const loading = ref(false);

  async function getPromoters() {
    loading.value = true;
    promoters.value = null;

    try {
      const q = query(collection(firestore, "promoters"));
      const querySnapshot = await getDocs(q);
      promoters.value = querySnapshot.docs.map((d) => ({
        Id: d.id,
        PromoterName: d.data().name,
        PromoterCode: d.data().code,
        LastUpdate: d.data().lastUpdate,
        Followers: d.data().followers || 0,
        LocationArray: d.data().locations || [],
        EventCategoryArray: d.data().eventCategories || [],
        MusicTypeArray: d.data().musicTypes || [],
        Instagram: d.data().instagram || "",
        Twitter: d.data().twitter || "",
        Tiktok: d.data().tiktok || "",
        Whatsapp: d.data().whatsapp || "",
        WhatsappGroups: d.data().whatsapp_groups || [],
      }));
      return { ok: true, data: { promoters: promoters.value } };
    } catch (error) {
      notifyError(error);
      return { ok: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function getPromoterById(id) {
    try {
      const documentSnapshot = await getDoc(doc(firestore, "promoters", id));
      if (documentSnapshot.exists()) {
        const data = documentSnapshot.data();
        promoter.value = {
          Id: documentSnapshot.id,
          PromoterName: data.name,
          PromoterCode: data.code,
          country: data.country || "BR",
          region: data.region || "riodejaneiro",
          LastUpdate: data.updated_at ? data.updated_at.toDate() : new Date(),
          Followers: data.followers || 0,
          LocationArray: [data.region?.name].filter(Boolean),
          EventCategoryArray: data.eventCategories || [],
          MusicTypeArray: data.musicTypes || [],
          Instagram: data.instagram || "",
          Twitter: data.twitter || "",
          Tiktok: data.tiktok || "",
          Whatsapp: data.whatsapp || "",
          WhatsappGroups: data.whatsapp_groups || "",
        };
        return { ok: true, data: promoter.value };
      }
      return { ok: false, error: "Promoter not found" };
    } catch (error) {
      console.error("Error:", error);
      notifyError(error);
      return { ok: false, error };
    }
  }

  function notifyError(error) {
    Swal.fire({
      title: error.code || "Error",
      text: error.message,
      icon: "error",
    });
  }

  return {
    promoter,
    promoters,
    loading,
    getPromoters,
    getPromoterById,
  };
});
