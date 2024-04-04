import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useFirebaseStore } from './firebase';
import { useAppStore } from './app';

import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export const useEventStore = defineStore('event', () => {

    const event = ref(
        {
            name: null,
            startDate: null,
            startTime: null,
            endDate: null,
            endTime: null,
            localName: null,
            country: "BR",
            region: null,
            genres: null,
            lineup: null,
            price: null,
            description: null,
            age: "+18",
            website: [{
                name: "",
                url: ""
            }],
            medias: [""],
            flyerFront: null,
            flyerBack: null,
            image: null
        }
    );
    const files = ref({
        flyerFront: null,
        flyerBack: null,
        image: null
    })
    const genres = ref([
        { name: "Rock", value: "rock" },
        { name: "Pop", value: "pop" },
        { name: "Electronic", value: "electronic" },
    ]);
    const ages = ref([
        { name: "+18", value: "+18" },
        { name: "+19", value: "+19" },
        { name: "+20", value: "+20" },
        { name: "+21", value: "+21" },
    ]);

    const sections = ref({
        1: null,
        2: null,
        3: null,
        4: null
    })

    const sectionBasicComplete = computed(() => {
        return !!(event.value["name"] && event.value["name"] !== ""
        )
    })

    const rules = {
        // BASIC
        name: { required },
        startDate: { required },
        startTime: { required },
        // LINEUP
        lineup: { required },
        genres: { required },
        // DETAILS
        description: { required }
        // PROMOTIONAL

    }



    const $v = useVuelidate(rules, event);

    const completed = computed(() => {
        return {
            1: !$v.value.name.$invalid && !$v.value.startDate.$invalid && !$v.value.startTime.$invalid,
            2: !$v.value.lineup.$invalid,
            3: !$v.value.description.$invalid && !$v.value.age.$invalid,
            4: !$v.value.$invalid && !$v.value.startDate.$invalid && !$v.value.startTime.$invalid,
        }
    })

    async function createEvent() {
        const appStore = useAppStore();
        appStore.loading = true;
        appStore.loadingText = "Creating event..."
        try {
            const firebaseStore = useFirebaseStore();
            const id = firebaseStore.getPostDocRef("events").id;

            const entries = Object.entries(files.value);

            const filesToUpload = entries.reduce((total, [name, value]) => {
                if (value && value[0]) {
                    total.push({
                        name: name,
                        path: `events/${id}/${name}.${value[0].type.split("/").pop()}`,
                        file: value[0]
                    })
                }
                return total
            }, [])

            const pictures = await firebaseStore.uploadPictures(filesToUpload);

            pictures.forEach(p => {
                event.value[p.name] = {
                    path: p.path,
                    url: p.url
                }
            })
            event.value.id = id;

            event.value.promoter = await firebaseStore.getCurrentUser();
            console.log("event", event.value);

            const response = await firebaseStore.postDocument("events", event.value);
            response.notify("Event created", `Event ${event.value.name ? event.value.name : ''} created successfully`);
            return { ok: true }
        } catch (error) {
            console.log({ error })
            return { ok: false, error }
        } finally {
            appStore.loading = false;
            appStore.loadingText = null
        }

    }
    function $reset() {
        event.value = {
            name: null,
            startDate: new Date().toISOString().split("T")[0],
            startTime: "19:00",
            endDate: new Date().toISOString().split("T")[0],
            endTime: "23:59",
            localName: null,
            country: "BR",
            region: null,
            genres: null,
            lineup: null,
            price: null,
            description: null,
            age: "+18",
            website: [""],
            medias: [""],
            flyerFront: null,
            flyerBack: null,
            image: null
        }
        files.value = {
            flyerFront: null,
            flyerBack: null,
            image: null
        }
        sections.value = {
            1: null,
            2: null,
            3: null,
            4: null
        }
    }

    watch(() => event.value.startDate, (newValue) => {
        if (event.value.endDate < newValue) {
            event.value.endDate = newValue;
        }
    });

    return { event, genres, ages, files, sectionBasicComplete, createEvent, $reset, sections, $v, completed }
})
