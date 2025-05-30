/**
 * Mock data for ProdEventDetail component
 * This file contains all the mock data used for testing and development
 * of the event detail page.
 */

/**
 * Generates mock event data based on a provided ID
 * @param {number} id - The event ID
 * @returns {Object} Mock event data object
 */
export const getMockEventData = (id) => {
  return {
    id: id,
    name: "Festa de Lançamento",
    date: new Date(new Date().getTime() + 86400000 * 7), // 7 days in future
    location: "Club XYZ, São Paulo",
    checkInCount: 42,
    totalGuests: 250,
    status: "upcoming", // options: upcoming, live, completed, cancelled
    thumbnail: "https://picsum.photos/id/103/1200/400",
    vipListsCount: 3,
    promotersCount: 5,
    hostessCount: 4,
    revenue: 15500,
    revenuePrediction: 50000,
    // Enhanced metrics fields
    checkInRate: 0.8, // 80% check-in rate historically
    checkInHistory: [28, 32, 36, 40, 42], // For trend calculation
    revenueHistory: [8000, 10000, 12500, 14200, 15500], // For trend visualization
  };
};

/**
 * Mock visualization data for list distribution
 */
export const mockListDistribution = [
  { percentage: 40, color: "var(--v-primary-base)" },
  { percentage: 25, color: "var(--v-primary-lighten1)" },
  { percentage: 20, color: "var(--v-secondary-base)" },
  { percentage: 15, color: "var(--v-grey-lighten1)" },
];

/**
 * Mock data for check-in trends
 */
export const mockCheckInTrend = 0.15;

/**
 * Simulate API delay - utility function
 * @param {number} delay - Delay in milliseconds
 * @returns {Promise} Promise that resolves after the delay
 */
export const simulateApiDelay = (delay = 700) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};
