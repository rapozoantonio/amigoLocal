<template>


    <event-dashboard-card title="Check-ins por Hora">
        <div class="d-flex">
            <v-chip-group v-model="selectedModule" color="primary">
                <v-chip value="lists">Lists</v-chip>
                <v-chip value="promoters">Promoters</v-chip>
                <v-chip value="hostesses">Hostesses</v-chip>
            </v-chip-group>
            <v-spacer></v-spacer>
            <v-chip-group density="comfortable" size="x-small" v-model="interval" mandatory variant="text">
                <v-chip :value="15" label>15min</v-chip>
                <v-chip :value="30" label>30min</v-chip>
                <v-chip :value="60" label>1h</v-chip>
            </v-chip-group>
            <v-chip-group density="comfortable" size="x-small" v-model="chartType" mandatory variant="text">
                <v-chip value="line" label> <v-icon>mdi-chart-line</v-icon></v-chip>
                <v-chip value="bar" label> <v-icon>mdi-chart-bar</v-icon></v-chip>
            </v-chip-group>
        </div>
        <v-sheet height="250" v-if="chartType === 'bar'">
            <Bar :data="data" :options="options" />
        </v-sheet>
        <v-sheet height="250" v-else>
            <Line :data="data" :options="options" />
        </v-sheet>
    </event-dashboard-card>

    <!-- <v-col cols="12" :md="expanded ? 12 : 6">
        <v-card min-height="360" flat border="thin" class="chart-card">
            <v-card-title class="chart-title">
                <div class="d-flex  align-center w-100">
                    <div class="text-subtitle-1 font-weight-bold">
                        Check-ins por Hora
                    </div>
                    <v-spacer></v-spacer>
                    <v-chip variant="text" color="primary" size="small" prepend-icon="mdi-clock-outline">
                        Atualizado {{ lastUpdateTime }}
                    </v-chip>
                    <v-btn variant="text" density="compact" :icon="`mdi-unfold-${expanded ? 'less' : 'more'}-vertical`"
                        @click="expanded = !expanded"></v-btn>
                </div>
            </v-card-title>
            <v-card-text class="chart-content h-100">
          
            </v-card-text>
        </v-card>
    </v-col> -->
</template>

<script setup>
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler

} from 'chart.js';

import EventDashboardCard from './EventDashboardCard.vue';
import { Line, Bar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { onMounted, ref, computed, inject, toRefs } from 'vue';

const { getRandomColor } = inject("$helpers");
const chartType = ref("line");
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    BarElement,

)

const expanded = ref(true);
const props = defineProps(["guests", "promoters", "lists", "hostesses"]);

const { guests, promoters, lists, hostesses } = toRefs(props);

const options = {
    scales: {
        y: {
            border: {
                display: true,
                color: "white",
                dashOffset: 1.0
            }
        },
        x: {
            border: {
                display: true,
                color: "white"
            }
        }

    },
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
            padding: 4,
            offset: true,
            align: "top",
            offset: 10,

            display: false
        }

    },
}

const guestsCheckedIn = computed(() => {
    return guests.value.filter(g => g.status === "checked-in");
})


const guestsCheckedInMockData = ref([
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
    }
]);

const selectedModule = ref(null);
const interval = ref(15);
const mainColor = ref(getRandomColor());
const checkInTimestamps = computed(() => guestsCheckedIn.value.map(g => g.checkInTime));
const minTimestamp = computed(() => Math.min(...checkInTimestamps.value));
const maxTimestamp = computed(() => Math.max(...checkInTimestamps.value));
const startHour = computed(() => new Date(minTimestamp.value).getHours());
const endHour = computed(() => new Date(maxTimestamp.value).getHours() + 1);

const intervalos = computed(() => {
    const intervalos = [];
    const base = new Date();
    const diffHours = startHour.value > endHour.value ? (24 + endHour.value) - startHour.value : endHour.value - startHour.value;
    const sections = diffHours / (interval.value / 60);
    console.log({ sections })
    base.setHours(startHour.value, 0, 0, 0); // começa às 20h
    for (let i = 0; i <= sections; i++) {
        const intervalo = new Date(base.getTime() + i * interval.value * 60 * 1000);
        const hora = intervalo.getHours().toString().padStart(2, '0');
        const min = intervalo.getMinutes().toString().padStart(2, '0');
        intervalos.push(`${hora}:${min}`);
    }
    return intervalos;
})

const report = computed(() => {
    return intervalos.value.reduce((total, i) => {
        total[i] = 0;
        return total;
    }, {})
})

const listsFromList = computed(() => {
    return [...new Set(guestsCheckedIn.value.map(c => c.list.name))].reduce((f, i) => {
        f[i] = {};
        intervalos.value.forEach(interval => {
            f[i][interval] = 0
        })
        return f;
    }, {});
});

const promotersFromList = computed(() => {
    return [...new Set(guestsCheckedIn.value.map(g => g.promoter.email))].reduce((f, i) => {
        f[i] = {};
        intervalos.value.forEach(interval => {
            f[i][interval] = 0
        })
        return f;
    }, {});
});

const hostessesFromList = computed(() => {
    return [...new Set(guestsCheckedIn.value.map(g => g.checkInBy.email))].reduce((f, i) => {
        f[i] = {};
        intervalos.value.forEach(interval => {
            f[i][interval] = 0
        })
        return f;
    }, {});
});


const globalData = computed(() => {

    const reportFinal = { ...report.value };
    const listFinal = { ...listsFromList.value };
    const promoterFinal = { ...promotersFromList.value };
    const hostessFinal = { ...hostessesFromList.value };

    guestsCheckedIn.value.forEach(guest => {
        const date = new Date(guest.checkInTime);
        const label = getTimeLabel(date, interval.value);

        // COUNT GUESTS IN ITS INTERVAL
        if (label && reportFinal[label] !== undefined) {
            reportFinal[label]++;
        }
        // COUNT GUESTS IN ITS INTERVAL BY LIST
        if (label && listFinal[guest.list.name][label] !== undefined) {
            listFinal[guest.list.name][label]++;
        }
        // COUNT GUESTS IN ITS INTERVAL BY PROMOTER
        if (label && promoterFinal[guest.promoter.email][label] !== undefined) {
            promoterFinal[guest.promoter.email][label]++;
        }
        // COUNT GUESTS IN ITS INTERVAL BY HOSTESSES
        if (label && hostessFinal[guest.checkInBy.email][label] !== undefined) {
            hostessFinal[guest.checkInBy.email][label]++;
        }
    });

    const maxColors = Math.max(Object.keys(listFinal).length, Object.keys(promoterFinal).length, Object.keys(hostessFinal).length);
    console.log({ maxColors });
    const colorsArray = [...new Array(maxColors)].reduce((finalColors, list) => {
        const color = getRandomColor([...finalColors, mainColor.value]);
        finalColors.push(color);
        return finalColors;
    }, [])
    console.log({ colorsArray })
    return {
        report: intervalos.value.map((interval) => {
            return reportFinal[interval];
        }),
        lists: Object.keys(listFinal).map((listName, index) => {
            return {
                label: listName,
                data: intervalos.value.map(interval => {
                    return listFinal[listName][interval];
                }),
                color: colorsArray[index]
            }
        }),
        promoters: Object.keys(promoterFinal).map((promoterName, index) => {
            return {
                label: promoterName,
                data: intervalos.value.map(interval => {
                    return promoterFinal[promoterName][interval];
                }),
                color: colorsArray[index]
            }
        }),
        hostesses: Object.keys(hostessFinal).map((hostessName, index) => {
            return {
                label: hostessName,
                data: intervalos.value.map(interval => {
                    return hostessFinal[hostessName][interval];
                }),
                color: colorsArray[index]
            }
        }),
    }


});


const data = computed(() => {
    const listDataSet = globalData.value.lists.map(list => {
        return {
            label: list.label,
            backgroundColor: list.color,
            data: list.data,
            // fill: "start",
            borderColor: list.color,
            tension: 0.3,
        }
    })

    const promoterDataSet = globalData.value.promoters.map(promoter => {
        return {
            label: promoter.label,
            backgroundColor: promoter.color,
            data: promoter.data,
            // fill: "start",
            borderColor: promoter.color,
            tension: 0.3,
        }
    })

    const hostessDataSet = globalData.value.hostesses.map(hostess => {
        return {
            label: hostess.label,
            backgroundColor: hostess.color,
            data: hostess.data,
            // fill: "start",
            borderColor: hostess.color,
            tension: 0.3,
        }
    })

    const datasets = [
        {
            label: 'Check-ins',
            backgroundColor: mainColor.value,
            data: globalData.value.report,
            // fill: "start",
            borderColor: mainColor.value,
            tension: 0.3,
        },
    ]

    if (selectedModule.value === "lists") {
        datasets.push(...listDataSet);
    }
    else if (selectedModule.value === "promoters") {
        datasets.push(...promoterDataSet);
    }
    else if (selectedModule.value === "hostesses") {
        datasets.push(...hostessDataSet);
    }

    return {
        labels: intervalos.value,

        datasets: datasets
    }
})


function gerarIntervalos(start, end, interval = 30) {
    const intervalos = [];
    const base = new Date();
    const diffHours = start > end ? (24 + end) - start : end - start;
    const sections = diffHours / (interval / 60);
    console.log({ sections })

    base.setHours(start, 0, 0, 0); // começa às 20h

    for (let i = 0; i <= sections; i++) {
        const intervalo = new Date(base.getTime() + i * interval * 60 * 1000);
        const hora = intervalo.getHours().toString().padStart(2, '0');
        const min = intervalo.getMinutes().toString().padStart(2, '0');
        intervalos.push(`${hora}:${min}`);
    }

    return intervalos;
};

function getTimeLabel(date) {
    let h = date.getHours();
    let m = date.getMinutes();
    const minSection = Math.floor(m / interval.value);
    m = minSection * interval.value;
    // console.log({ h, m })
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}


onMounted(() => {

    // report.value = intervalos.value.reduce((total, i) => {
    //     total[i] = 0;
    //     return total;
    // }, {})




    // guestsCheckedIn.value.forEach(item => {
    //     const date = new Date(item.checkInTime);
    //     const label = getTimeLabel(date, 30);
    //     // console.log({ label })

    //     if (label && report.value[label] !== undefined) {
    //         console.log("passed")
    //         report.value[label]++;
    //     }

    //     if (label && lists.value[item.list.name][label] !== undefined) {
    //         console.log("passed")
    //         lists.value[item.list.name][label]++;
    //     }

    // });
    // console.log(report.value);
    // globalData.value = intervalos.value.map((interval) => {
    //     return report.value[interval];
    // })

    // listsData.value = Object.keys(lists.value).map((listName, index) => {
    //     return {
    //         label: listName,
    //         data: intervalos.value.map(interval => {
    //             return lists.value[listName][interval];
    //         }),
    //         color: ["red", "blue"][index]
    //     }
    // })

    // console.log(lists.value);


})
</script>

<style lang="scss" scoped></style>