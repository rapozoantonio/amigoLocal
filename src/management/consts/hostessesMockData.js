/**
 * Mock data for Hostesses component
 * Contains data for hostesses list, options and utility functions
 */

// Mock hostesses data
export const mockHostesses = [
  {
    id: 1,
    name: "Ana Silva",
    phone: "(11) 99876-5432",
    area: "Entrada",
    startTime: "20:00",
    endTime: "04:00",
    payment: 150,
    confirmed: true,
    checkIns: 42,
    notes: "Experiência em eventos de grande porte.",
  },
  {
    id: 2,
    name: "Beatriz Santos",
    phone: "(11) 98765-4321",
    area: "VIP",
    startTime: "21:00",
    endTime: "05:00",
    payment: 180,
    confirmed: true,
    checkIns: 35,
    notes: "Fala inglês e espanhol.",
  },
  {
    id: 3,
    name: "Carolina Lima",
    phone: "(11) 97654-3210",
    area: "Camarote",
    startTime: "22:00",
    endTime: "04:00",
    payment: 160,
    confirmed: true,
    checkIns: 28,
    notes: "",
  },
  {
    id: 4,
    name: "Daniela Costa",
    phone: "(11) 96543-2109",
    area: "Pista",
    startTime: "21:00",
    endTime: "03:00",
    payment: 140,
    confirmed: false,
    checkIns: 0,
    notes: "Primeira vez trabalhando neste evento.",
  },
  {
    id: 5,
    name: "Elena Ferreira",
    phone: "(11) 95432-1098",
    area: "Bar",
    startTime: "20:00",
    endTime: "03:00",
    payment: 140,
    confirmed: true,
    checkIns: 15,
    notes: "Experiência em servir bebidas.",
  },
];

// Table headers
export const hostessTableHeaders = [
  { title: "Nome", key: "name" },
  { title: "Status", key: "confirmed", width: "120px" },
  { title: "Área", key: "area", width: "120px" },
  { title: "Entrada", key: "startTime", width: "100px", align: "center" },
  { title: "Saída", key: "endTime", width: "100px", align: "center" },
  { title: "Horas", key: "hours", width: "80px", align: "center" },
  { title: "Check-ins", key: "checkIns", width: "100px", align: "center" },
  {
    title: "Ações",
    key: "actions",
    width: "120px",
    align: "center",
    sortable: false,
  },
];

// Status filter options
export const statusOptions = [
  { title: "Todas", value: "all" },
  { title: "Confirmadas", value: "confirmed" },
  { title: "Pendentes", value: "pending" },
];

// Area options
export const areaOptions = [
  { title: "Todas as áreas", value: "all" },
  { title: "Entrada", value: "Entrada" },
  { title: "VIP", value: "VIP" },
  { title: "Camarote", value: "Camarote" },
  { title: "Pista", value: "Pista" },
  { title: "Bar", value: "Bar" },
];

// Area color map
export const areaColorMap = {
  Entrada: "blue",
  VIP: "purple",
  Camarote: "pink",
  Pista: "green",
  Bar: "amber",
};

// Timeline hours (for schedule view)
export const timelineHours = [18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4];

// Hour labels
export const hourLabels = [
  "18h",
  "19h",
  "20h",
  "21h",
  "22h",
  "23h",
  "00h",
  "01h",
  "02h",
  "03h",
  "04h",
];

// Utility function to get area color
export const getAreaColor = (area) => {
  return areaColorMap[area] || "grey";
};