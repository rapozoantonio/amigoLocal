/**
 * Mock data for event listings
 * Use for development and testing purposes
 */

// Event list mock data with revenue information
export const eventsData = [
  {
    id: 1,
    name: "Festa de Lançamento",
    date: new Date(new Date().getTime() + 86400000 * 7), // 7 days in future
    location: "Club XYZ, São Paulo",
  },
  {
    id: 2,
    name: "Noite Eletrônica",
    date: new Date(new Date().getTime() + 86400000 * 14), // 14 days in future
    location: "Espaço Cultural, Rio de Janeiro",
    checkInCount: 0,
    totalGuests: 180,
    status: "upcoming",
    thumbnail: "https://picsum.photos/id/106/300/200",
    vipListsCount: 2,
    promotersCount: 4,
    revenue: 8000,
    revenuePrediction: 12000,
  },
  {
    id: 3,
    name: "Aniversário Club",
    date: new Date(new Date().getTime() - 86400000 * 7), // 7 days in past
    location: "Club ABC, Belo Horizonte",
    checkInCount: 143,
    totalGuests: 150,
    status: "completed",
    thumbnail: "https://picsum.photos/id/109/300/200",
    vipListsCount: 2,
    promotersCount: 3,
    revenue: 35000,
    revenuePrediction: 20000,
  },
  {
    id: 4,
    name: "Festival de Verão",
    date: new Date(new Date().getTime() + 86400000 * 30), // 30 days in future
    location: "Praia Grande, Santos",
    checkInCount: 0,
    totalGuests: 500,
    status: "upcoming",
    thumbnail: "https://picsum.photos/id/110/300/200",
    vipListsCount: 5,
    promotersCount: 8,
    revenue: 0, // No revenue yet for future event
    revenuePrediction: 75000,
  },
];

// Additional mock methods if needed
export const getMockEventById = (id) => {
  return eventsData.find((event) => event.id === id);
};
