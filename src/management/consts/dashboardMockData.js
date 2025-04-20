/**
 * Mock data for Dashboard component
 * Contains all mock data for the event dashboard view
 */

// Mock component state
export const initialDashboardState = {
  eventHealthScore: 78,
  conversionRate: 65,
  averageTicket: 120,
  guestExpectation: 85,
  performanceScore: 72,
  lastUpdateTime: "há 2 minutos",
  totalCheckIns: 42,
  expectedCheckIns: 250,
  totalRevenue: 15500,
  maxGuests: 150,
};

// Sparkline options
export const sparklineOptions = {
  padding: 8,
  lineWidth: 2,
  smooth: true,
  gradient: ["red", "orange", "#FF0"],
};

// KPI trends data
export const kpiTrends = {
  conversion: { icon: "mdi-arrow-up", color: "success", value: 8 },
  ticket: { icon: "mdi-arrow-up", color: "success", value: 12 },
  expectation: { icon: "mdi-arrow-down", color: "error", value: 3 },
  performance: { icon: "mdi-arrow-up", color: "success", value: 5 },
};

// Check-in hourly data
export const checkInData = [
  { time: "18h", value: 1, isPast: true, isCurrent: false },
  { time: "19h", value: 10, isPast: true, isCurrent: false },
  { time: "20h", value: 20, isPast: true, isCurrent: false },
  { time: "21h", value: 20, isPast: true, isCurrent: true },
  { time: "21:30h", value: 25, isPast: true, isCurrent: true },
  { time: "22h", value: 30, isPast: false, isCurrent: false },
  { time: "23h", value: 80, isPast: false, isCurrent: false },
  { time: "00h", value: 90, isPast: false, isCurrent: false },
  { time: "01h", value: 100, isPast: false, isCurrent: false },
];

// Revenue by list data
export const revenueData = [
  {
    name: "Lista VIP",
    value: 8200,
    checkIns: 20,
    color: "#1E88E5",
    icon: "mdi-star",
  },
  {
    name: "Pré-venda",
    value: 4300,
    checkIns: 12,
    color: "#43A047",
    icon: "mdi-ticket",
  },
  {
    name: "Promotor João",
    value: 1800,
    checkIns: 6,
    color: "#FB8C00",
    icon: "mdi-account",
  },
  {
    name: "Promotor Maria",
    value: 1200,
    checkIns: 4,
    color: "#8E24AA",
    icon: "mdi-account",
  },
];

// Guest distribution data
export const guestTypes = [
  { name: "VIP", count: 80, percentage: 32, color: "#673AB7" },
  { name: "Pré-venda", count: 100, percentage: 40, color: "#2196F3" },
  { name: "Promotores", count: 50, percentage: 20, color: "#FF9800" },
  { name: "Outros", count: 20, percentage: 8, color: "#9E9E9E" },
];

// Promoter performance data
export const dashboardPromoters = [
  { id: 1, name: "Carlos", guests: 75, revenue: 4500 },
  { id: 2, name: "Aline", guests: 68, revenue: 4080 },
  { id: 3, name: "Rafael", guests: 50, revenue: 3000 },
  { id: 4, name: "Julia", guests: 32, revenue: 1920 },
  { id: 5, name: "Pedro", guests: 25, revenue: 1500 },
];

// AI-powered insights
export const aiInsights = [
  {
    title: "Horário de pico previsto às 22h",
    description:
      "Com base nos dados históricos, prevemos um pico de check-ins entre 22h e 23h. Recomendamos adicionar mais hostess para este período.",
    icon: "mdi-chart-bell-curve",
    color: "info",
    action: "Ajustar escalas",
  },
  {
    title: "Receita acima da expectativa (+15%)",
    description:
      "Seu evento está superando as expectativas de receita em 15%. Considere aumentar a oferta de produtos premium para maximizar o resultado.",
    icon: "mdi-cash-plus",
    color: "success",
    action: "Ver detalhes",
  },
  {
    title: "Lista VIP com poucos check-ins",
    description:
      "A taxa de conversão da lista VIP está em 35%, abaixo da média de 60%. Considere enviar um lembrete para os convidados.",
    icon: "mdi-alert",
    color: "warning",
    action: "Enviar lembrete",
  },
  {
    title: "Novo recorde de vendas antecipadas!",
    description:
      "Este evento bateu o recorde de vendas antecipadas dos últimos 6 meses. As vendas online cresceram 22% em comparação ao último evento.",
    icon: "mdi-trophy",
    color: "success",
    action: null,
  },
];

// Helper methods
export const getHealthScoreColor = (score) => {
  if (score >= 80) return "success";
  if (score >= 60) return "primary";
  if (score >= 40) return "warning";
  return "error";
};

export const formatCurrency = (value) => {
  if (!value && value !== 0) return "R$ 0";

  // Convert to number if it's not already
  const numValue = typeof value === "number" ? value : Number(value);

  // Handle invalid values
  if (isNaN(numValue)) return "R$ 0";

  // Format based on value range
  if (numValue >= 1000000) {
    return `R$ ${(numValue / 1000000).toFixed(1)}M`;
  } else if (numValue >= 1000) {
    return `R$ ${(numValue / 1000).toFixed(1)}k`;
  } else {
    return `R$ ${numValue}`;
  }
};

export const getPromoterColor = (index) => {
  const colors = ["#673AB7", "#2196F3", "#FF9800", "#4CAF50", "#9C27B0"];
  return colors[index % colors.length];
};

// Dashboard KPI cards
export const getDashboardKpiCards = (state) => [
  {
    title: "Taxa de Conversão",
    value: state.conversionRate + "%",
    icon: "mdi-ticket-confirmation",
    iconColor: "primary",
    accentColor: "#e53935",
    trend: { 
      icon: kpiTrends.conversion.icon, 
      color: kpiTrends.conversion.color, 
      value: kpiTrends.conversion.value 
    }
  },
  {
    title: "Ticket Médio",
    value: "R$ " + state.averageTicket,
    icon: "mdi-cash-multiple",
    iconColor: "success",
    accentColor: "#388e3c",
    trend: { 
      icon: kpiTrends.ticket.icon, 
      color: kpiTrends.ticket.color, 
      value: kpiTrends.ticket.value 
    }
  },
  {
    title: "Expectativa",
    value: state.guestExpectation + "%",
    icon: "mdi-account-group",
    iconColor: "info",
    accentColor: "#0288d1",
    trend: { 
      icon: kpiTrends.expectation.icon, 
      color: kpiTrends.expectation.color, 
      value: kpiTrends.expectation.value 
    }
  },
  {
    title: "Desempenho",
    value: state.performanceScore + "%",
    icon: "mdi-star",
    iconColor: "warning",
    accentColor: "#fbc02d",
    trend: { 
      icon: kpiTrends.performance.icon, 
      color: kpiTrends.performance.color, 
      value: kpiTrends.performance.value 
    }
  }
];