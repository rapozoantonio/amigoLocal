/**
 * Mock data for Guests component
 * Contains data and utility functions for guest management
 */

// Status mapping functions
export const statusColorMap = { 
  'checked-in': 'success', 
  'pending': 'warning', 
  'cancelled': 'error' 
};

export const statusTextMap = { 
  'checked-in': 'Check-in', 
  'pending': 'Pendente', 
  'cancelled': 'Cancelado' 
};

// Filter options
export const statusOptions = [
  { title: 'Todos', value: 'all' },
  { title: 'Pendentes', value: 'pending' },
  { title: 'Check-in Realizado', value: 'checked-in' },
  { title: 'Cancelados', value: 'cancelled' },
];

export const listOptions = [
  { title: 'Todas', value: 'all' },
  { title: 'VIP', value: 'VIP' },
  { title: 'Promotor Carlos', value: 'Promotor Carlos' },
  { title: 'Promotor Maria', value: 'Promotor Maria' },
  { title: 'Pré-venda', value: 'Pré-venda' },
];

// Utility functions
export const getStatusColor = (status) => statusColorMap[status] || 'grey';
export const getStatusText = (status) => statusTextMap[status] || 'Desconhecido';

// Function to generate mock guests data
export const generateMockGuests = (page, itemsPerPage, statusFilter = 'all', listFilter = 'all') => {
  const mockGuests = [];
  const statusValues = ['pending', 'checked-in', 'cancelled'];
  const lists = ['VIP', 'Promotor Carlos', 'Promotor Maria', 'Pré-venda'];
  
  for (let i = 1; i <= itemsPerPage; i++) {
    const id = (page - 1) * itemsPerPage + i;
    if (id > 120) break;
    
    const status = statusValues[Math.floor(Math.random() * (statusFilter === 'all' ? 3 : 1))];
    if (statusFilter !== 'all' && status !== statusFilter) continue;
    
    const list = lists[Math.floor(Math.random() * lists.length)];
    if (listFilter !== 'all' && list !== listFilter) continue;
    
    const hasCheckedIn = status === 'checked-in';
    
    mockGuests.push({
      id,
      name: `Convidado ${id}`,
      email: `convidado${id}@exemplo.com`,
      phone: `(11) 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
      document: `${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 100)}`,
      list,
      vip: Math.random() > 0.7,
      status,
      checkInTime: hasCheckedIn ? new Date(Date.now() - Math.floor(Math.random() * 3600000)) : null,
      checkInBy: hasCheckedIn ? 'Hostess Ana' : null,
    });
  }
  
  return mockGuests;
};