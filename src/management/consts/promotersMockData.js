/**
 * Mock data for Promoters component
 * Contains data for promoters list, options and utility functions
 */

// Mock promoters data
export const mockPromoters = [
  {
    id: 1,
    name: "Carlos Silva",
    email: "carlos@exemplo.com",
    phone: "(11) 99876-5432",
    active: true,
    guests: 75,
    checkIns: 42,
    revenue: 9450,
    quota: 100,
    commission: 12,
    notes: "Promotor experiente, trabalha principalmente com público VIP.",
  },
  {
    id: 2,
    name: "Mariana Costa",
    email: "mariana@exemplo.com",
    phone: "(11) 98765-4321",
    active: true,
    guests: 68,
    checkIns: 45,
    revenue: 8160,
    quota: 80,
    commission: 10,
    notes: "Foco em público universitário.",
  },
  {
    id: 3,
    name: "Rafael Mendes",
    email: "rafael@exemplo.com",
    phone: "(11) 97654-3210",
    active: true,
    guests: 50,
    checkIns: 22,
    revenue: 6000,
    quota: 70,
    commission: 10,
    notes: "",
  },
  {
    id: 4,
    name: "Júlia Santos",
    email: "julia@exemplo.com",
    phone: "(11) 96543-2109",
    active: true,
    guests: 32,
    checkIns: 18,
    revenue: 3840,
    quota: 50,
    commission: 8,
    notes: "Primeira festa com a equipe.",
  },
  {
    id: 5,
    name: "Pedro Oliveira",
    email: "pedro@exemplo.com",
    phone: "(11) 95432-1098",
    active: false,
    guests: 25,
    checkIns: 0,
    revenue: 3000,
    quota: 40,
    commission: 10,
    notes: "Inativo temporariamente.",
  },
];

// Table headers
export const promoterTableHeaders = [
  { title: "Nome", key: "name" },
  { title: "Status", key: "active", width: "100px" },
  { title: "Convidados", key: "guests", width: "100px", align: "center" },
  { title: "Check-ins", key: "checkIns", width: "100px", align: "center" },
  {
    title: "Conversão",
    key: "conversionRate",
    width: "100px",
    align: "center",
  },
  { title: "Receita", key: "revenue", width: "120px", align: "end" },
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
  { title: "Todos", value: "all" },
  { title: "Ativos", value: "active" },
  { title: "Inativos", value: "inactive" },
];

// Leaderboard avatar colors
export const leaderboardAvatarColors = [
  "warning",
  "grey-lighten-1",
  "amber-darken-3",
  "primary",
];

// Utility functions
export const calculateConversionRate = (promoter) => {
  if (!promoter.guests) return 0;
  return Math.round((promoter.checkIns / promoter.guests) * 100);
};

export const formatCurrency = (value) => {
  const num = Number(value) || 0;
  if (num >= 1000000) return `R$ ${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `R$ ${(num / 1000).toFixed(1)}k`;
  return `R$ ${num}`;
};

export const getLeaderboardAvatarColor = (index) =>
  index < 3 ? leaderboardAvatarColors[index] : leaderboardAvatarColors[3];

// Sort promoters by different metrics
export const getSortedPromotersByMetric = (promoters, metric) => {
  const sorted = [...promoters];
  switch (metric) {
    case "guests":
      return sorted.sort((a, b) => b.guests - a.guests);
    case "checkIns":
      return sorted.sort((a, b) => b.checkIns - a.checkIns);
    case "revenue":
      return sorted.sort((a, b) => b.revenue - a.revenue);
    case "conversion":
      return sorted.sort(
        (a, b) => calculateConversionRate(b) - calculateConversionRate(a)
      );
    default:
      return sorted;
  }
};