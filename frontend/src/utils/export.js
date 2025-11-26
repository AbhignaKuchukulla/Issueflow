export function exportToCSV(tickets, filename = 'tickets.csv') {
  if (!tickets || tickets.length === 0) {
    alert('No tickets to export');
    return;
  }

  // Define CSV headers
  const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Assignee', 'Created At', 'Updated At'];
  
  // Convert tickets to CSV rows
  const rows = tickets.map(ticket => [
    ticket.id,
    `"${ticket.title.replace(/"/g, '""')}"`, // Escape quotes in title
    `"${ticket.description.replace(/"/g, '""')}"`, // Escape quotes in description
    ticket.status,
    ticket.priority,
    ticket.assignee || '',
    new Date(ticket.createdAt).toISOString(),
    new Date(ticket.updatedAt).toISOString()
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function exportToJSON(tickets, filename = 'tickets.json') {
  if (!tickets || tickets.length === 0) {
    alert('No tickets to export');
    return;
  }

  const jsonContent = JSON.stringify(tickets, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
