// import { ref, } from 'vue'
import { defineStore } from 'pinia'
import { collection, query, getDocs, where } from "firebase/firestore";
import { firestore } from '@/plugins/firebase';
import Swal from 'sweetalert2';
import { ref, computed } from 'vue';

export const useEventsStore = defineStore('events', () => {

    const events = ref(null);

    const featuredEvents = computed(() => {
        return !events.value ? null : events.value.filter((event) => event.featured);
    })

    const nextEvents = computed(() => {
        return !events.value ? null : events.value.reduce((nextEvents, event) => {
            // Transform startDate to short date format
            const options = { weekday: 'short', day: 'numeric', month: 'short' };
            const date = new Intl.DateTimeFormat('en-US', options).format(new Date(event.startDate)).toUpperCase();

            if (nextEvents[date]) {
                nextEvents[date].push(event);
                return nextEvents;
            }
            nextEvents[date] = [event];
            return nextEvents;

        }, {})
    })

    async function getEventsByRegion(country, region) {
        events.value = [];
        const queries = [];
        queries.push(where("country", "==", country));
        if (region) {
            queries.push(where("region", "==", region))
        }
        queries.push(where("startDate", ">", "2024-03-29"))
        // queries.push(where("createdAt", "<", new Date()))

        try {
            const q = query(collection(firestore, "events"), ...queries);
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((document) => {
                console.log(document.data())
                events.value.push(document.data())
            })

            return {
                ok: true, data: { events }
            }


        } catch (error) {
            console.log({ error })
            notifyError();
            return {
                ok: false,
                error
            }
        }
    }

    function notifyError(error) {
        Swal.fire({
            title: error.code,
            text: error.message,
            icon: "error"
        });
    }

    // watch(() => event.value.startDate, (newValue) => {
    //     if (event.value.endDate < newValue) {
    //         event.value.endDate = newValue;
    //     }
    // });


    return { getEventsByRegion, featuredEvents, events, nextEvents }
})
