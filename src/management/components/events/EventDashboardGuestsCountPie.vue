<template>
    <event-dashboard-card title="Distribuição de convidados" size="small">
        <div>
            <v-chip-group mandatory v-model="selectedModule" color="primary">
                <v-chip value="lists">Lists</v-chip>
                <v-chip value="promoters">Promoters</v-chip>
                <v-chip value="hostesses">Hostesses</v-chip>
            </v-chip-group>
        </div>
        <v-sheet height="250">
            <Doughnut :data="data" :options="options" />
        </v-sheet>
    </event-dashboard-card>
</template>

<script setup>
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,

} from 'chart.js';
import { Pie, Doughnut } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import EventDashboardCard from './EventDashboardCard.vue';
import { onMounted, ref, computed, inject, toRefs } from 'vue';
import { } from 'vue';

const { getRandomColor } = inject("$helpers");
const selectedModule = ref("lists");
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    BarElement,
    ChartDataLabels

)

const expanded = ref(true);

const options = {

    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "bottom"
        },
        datalabels: {
            backgroundColor: function (context) {
                return context.dataset.backgroundColor;
            },
            backgroundColor: "white",
            borderRadius: 4,
            color: 'black',
            font: {
                weight: 'bold'
            },
            formatter: Math.round,
            padding: 4
        }
    },
}

const props = defineProps(["guests", "promoters", "lists", "hostesses"]);
const { guests, promoters, lists, hostesses } = toRefs(props);

const guestsCheckedIn = computed(() => {
    return guests.value.filter(g => g.status === "checked-in");
})

const guestsMockData = ref([
    {
        "id": "1",
        "checkInTime": 1747865829000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p3",
            "name": "Promoter Tres",
            "email": "tres@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "2",
        "checkInTime": 1747870335000,
        "list": {
            "id": "456",
            "name": "lista 2"
        },
        "promoter": {
            "id": "p2",
            "name": "Promoter Dos",
            "email": "dos@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "3",
        "checkInTime": 1747866238000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p3",
            "name": "Promoter Tres",
            "email": "tres@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "4",
        "checkInTime": 1747862218000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p3",
            "name": "Promoter Tres",
            "email": "tres@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "5",
        "checkInTime": 1747855082000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p2",
            "name": "Promoter Dos",
            "email": "dos@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "6",
        "checkInTime": 1747867993000,
        "list": {
            "id": "456",
            "name": "lista 2"
        },
        "promoter": {
            "id": "p1",
            "name": "Promoter Uno",
            "email": "uno@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "7",
        "checkInTime": 1747855755000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p1",
            "name": "Promoter Uno",
            "email": "uno@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "8",
        "checkInTime": 1747859082000,
        "list": {
            "id": "456",
            "name": "lista 2"
        },
        "promoter": {
            "id": "p3",
            "name": "Promoter Tres",
            "email": "tres@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "9",
        "checkInTime": 1747852472000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p3",
            "name": "Promoter Tres",
            "email": "tres@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "10",
        "checkInTime": 1747870672000,
        "list": {
            "id": "456",
            "name": "lista 2"
        },
        "promoter": {
            "id": "p1",
            "name": "Promoter Uno",
            "email": "uno@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "11",
        "checkInTime": 1747871162000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p1",
            "name": "Promoter Uno",
            "email": "uno@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "12",
        "checkInTime": 1747861130000,
        "list": {
            "id": "456",
            "name": "lista 2"
        },
        "promoter": {
            "id": "p3",
            "name": "Promoter Tres",
            "email": "tres@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "13",
        "checkInTime": 1747862783000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p1",
            "name": "Promoter Uno",
            "email": "uno@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "14",
        "checkInTime": 1747864047000,
        "list": {
            "id": "456",
            "name": "lista 2"
        },
        "promoter": {
            "id": "p3",
            "name": "Promoter Tres",
            "email": "tres@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "15",
        "checkInTime": 1747852826000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p2",
            "name": "Promoter Dos",
            "email": "dos@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "16",
        "checkInTime": 1747863598000,
        "list": {
            "id": "456",
            "name": "lista 2"
        },
        "promoter": {
            "id": "p1",
            "name": "Promoter Uno",
            "email": "uno@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "17",
        "checkInTime": 1747858881000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p3",
            "name": "Promoter Tres",
            "email": "tres@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "18",
        "checkInTime": 1747863934000,
        "list": {
            "id": "456",
            "name": "lista 2"
        },
        "promoter": {
            "id": "p3",
            "name": "Promoter Tres",
            "email": "tres@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "19",
        "checkInTime": 1747853090000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p3",
            "name": "Promoter Tres",
            "email": "tres@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "20",
        "checkInTime": 1747851109000,
        "list": {
            "id": "456",
            "name": "lista 2"
        },
        "promoter": {
            "id": "p3",
            "name": "Promoter Tres",
            "email": "tres@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "21",
        "checkInTime": 1747850547000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p1",
            "name": "Promoter Uno",
            "email": "uno@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "22",
        "checkInTime": 1747857592000,
        "list": {
            "id": "456",
            "name": "lista 2"
        },
        "promoter": {
            "id": "p1",
            "name": "Promoter Uno",
            "email": "uno@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "23",
        "checkInTime": 1747871638000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p1",
            "name": "Promoter Uno",
            "email": "uno@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "24",
        "checkInTime": 1747862793000,
        "list": {
            "id": "456",
            "name": "lista 2"
        },
        "promoter": {
            "id": "p2",
            "name": "Promoter Dos",
            "email": "dos@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "25",
        "checkInTime": 1747864599000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p2",
            "name": "Promoter Dos",
            "email": "dos@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "26",
        "checkInTime": 1747869777000,
        "list": {
            "id": "456",
            "name": "lista 2"
        },
        "promoter": {
            "id": "p3",
            "name": "Promoter Tres",
            "email": "tres@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "27",
        "checkInTime": 1747852188000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p3",
            "name": "Promoter Tres",
            "email": "tres@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "28",
        "checkInTime": 1747859319000,
        "list": {
            "id": "456",
            "name": "lista 2"
        },
        "promoter": {
            "id": "p1",
            "name": "Promoter Uno",
            "email": "uno@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "29",
        "checkInTime": 1747851434000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p2",
            "name": "Promoter Dos",
            "email": "dos@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "30",
        "checkInTime": 1747866989000,
        "list": {
            "id": "456",
            "name": "lista 2"
        },
        "promoter": {
            "id": "p1",
            "name": "Promoter Uno",
            "email": "uno@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "31",
        "checkInTime": 1747866818000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p1",
            "name": "Promoter Uno",
            "email": "uno@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "32",
        "checkInTime": 1747868902000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p3",
            "name": "Promoter Tres",
            "email": "tres@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "33",
        "checkInTime": 1747871122000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p2",
            "name": "Promoter Dos",
            "email": "dos@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "34",
        "checkInTime": 1747861275000,
        "list": {
            "id": "456",
            "name": "lista 2"
        },
        "promoter": {
            "id": "p3",
            "name": "Promoter Tres",
            "email": "tres@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "35",
        "checkInTime": 1747865667000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p2",
            "name": "Promoter Dos",
            "email": "dos@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "36",
        "checkInTime": 1747867725000,
        "list": {
            "id": "456",
            "name": "lista 2"
        },
        "promoter": {
            "id": "p1",
            "name": "Promoter Uno",
            "email": "uno@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "37",
        "checkInTime": 1747863585000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p2",
            "name": "Promoter Dos",
            "email": "dos@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "38",
        "checkInTime": 1747854087000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p3",
            "name": "Promoter Tres",
            "email": "tres@event.com"
        },
        "checkInBy": {
            "id": "c1",
            "name": "Staff Alpha",
            "email": "alpha@event.com"
        }
    },
    {
        "id": "39",
        "checkInTime": 1747867958000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p2",
            "name": "Promoter Dos",
            "email": "dos@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    },
    {
        "id": "40",
        "checkInTime": 1747870235000,
        "list": {
            "id": "123",
            "name": "lista 1"
        },
        "promoter": {
            "id": "p1",
            "name": "Promoter Uno",
            "email": "uno@event.com"
        },
        "checkInBy": {
            "id": "c2",
            "name": "Staff Beta",
            "email": "beta@event.com"
        }
    }
]);

const mainColor = ref(getRandomColor());


const countGuestsByList = computed(() => {
    return guests.value.reduce((total, guest) => {
        if (total.hasOwnProperty(guest.list.name)) {
            total[guest.list.name] = total[guest.list.name] + 1;
            return total;
        }
        total[guest.list.name] = 1;
        return total;
    }, {})
});

const countGuestsByPromoter = computed(() => {
    return guests.value.reduce((total, guest) => {
        if (total.hasOwnProperty(guest.promoter.email)) {
            total[guest.promoter.email] = total[guest.promoter.email] + 1;
            return total;
        }
        total[guest.promoter.email] = 1;
        return total;
    }, {})
});

const countGuestsByHostess = computed(() => {
    return guests.value.reduce((total, guest) => {
        if (guest.checkInBy) {
            if (total.hasOwnProperty(guest.checkInBy.email)) {
                total[guest.checkInBy.email] = total[guest.checkInBy.email] + 1;
                return total;
            }
            total[guest.checkInBy.email] = 1;
            return total;
        }
        return total
    }, {})
});





const data = computed(() => {
    const activeModule = selectedModule.value === 'promoters' ? countGuestsByPromoter.value : selectedModule.value === "hostesses" ? countGuestsByHostess.value : countGuestsByList.value;
    const labels = Object.keys(activeModule);
    const datasets = Object.values(activeModule);

    const backgroundColor = labels.reduce((finalColors) => {
        const color = getRandomColor([...finalColors, mainColor.value]);
        finalColors.push(color);
        return finalColors;
    }, [])


    return {
        labels,
        datasets: [{
            data: datasets,
            backgroundColor,
            borderColor: backgroundColor
        }
        ]

    }
});


onMounted(() => {



})
</script>

<style lang="scss" scoped></style>