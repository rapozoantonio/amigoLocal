/**
 * Common options and constants used across multiple components
 * Centralizes configuration values for consistency
 */

// Event status options
export const eventStatusOptions = [
  { title: "Em breve", value: "upcoming" },
  { title: "Ao vivo", value: "live" },
  { title: "Realizado", value: "completed" },
  { title: "Cancelado", value: "cancelled" },
];

// GenericCRUDModal area options
export const genericAreaOptions = [
  { title: "Todas as áreas", value: "all" },
  { title: "Entrada", value: "Entrada" },
  { title: "VIP", value: "VIP" },
  { title: "Camarote", value: "Camarote" },
  { title: "Pista", value: "Pista" },
  { title: "Bar", value: "Bar" },
];

// Common pagination options
export const paginationOptions = [10, 25, 50, 100];

// Generic status options (active/inactive)
export const genericStatusOptions = [
  { title: "Todos", value: "all" },
  { title: "Ativos", value: "active" },
  { title: "Inativos", value: "inactive" },
];

// Common color maps
export const areaColorMap = {
  Entrada: "blue",
  VIP: "purple",
  Camarote: "pink",
  Pista: "green",
  Bar: "amber",
};

export const statusColorMap = {
  active: "success",
  inactive: "grey",
  upcoming: "info",
  live: "success",
  completed: "grey",
  cancelled: "error",
};

// Generic form validation rules
export const validationRules = {
  required: (v) => !!v || "Campo obrigatório",
  email: (v) => !v || /.+@.+\..+/.test(v) || "Email inválido",
  minLength: (length) => (v) => !v || v.length >= length || `Mínimo de ${length} caracteres`,
};

// Common time slots for event scheduling
export const timeSlots = [
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", 
  "00:00", "01:00", "02:00", "03:00", "04:00", "05:00"
];

// Items per page options for tables and lists
export const itemsPerPageOptions = [5, 10, 25, 50, 100];