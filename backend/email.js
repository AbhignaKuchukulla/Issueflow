import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function sendEmail(to, subject, html) {
  if (!process.env.EMAIL_USER) {
    console.log('[EMAIL] Skipped (not configured):', { to, subject });
    return false;
  }
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    return true;
  } catch (err) {
    console.error('[EMAIL] Failed to send:', err.message);
    return false;
  }
}

export function mentionEmailTemplate(mentioner, ticket, message) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>You were mentioned in a comment</h2>
      <p><strong>${mentioner}</strong> mentioned you in ticket #${ticket.id}:</p>
      <p style="background: #f5f5f5; padding: 10px; border-left: 4px solid #007bff;">
        ${message}
      </p>
      <p><strong>Ticket:</strong> ${ticket.title}</p>
      <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/tickets/${ticket.id}" style="color: #007bff;">View Ticket</a></p>
    </div>
  `;
}

export function assignmentEmailTemplate(assigner, ticket, assignee) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>You were assigned a ticket</h2>
      <p><strong>${assigner}</strong> assigned you to ticket #${ticket.id}:</p>
      <p><strong>${ticket.title}</strong></p>
      <p>${ticket.description}</p>
      <p><strong>Priority:</strong> ${ticket.priority}</p>
      <p><strong>Due Date:</strong> ${ticket.dueDate || 'Not set'}</p>
      <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/tickets/${ticket.id}" style="color: #007bff;">View Ticket</a></p>
    </div>
  `;
}

export function overdueEmailTemplate(tickets) {
  const ticketsList = tickets.map(t => 
    `<li><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/tickets/${t.id}" style="color: #007bff;">#${t.id}: ${t.title}</a></li>`
  ).join('');
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Overdue Tickets</h2>
      <p>You have ${tickets.length} overdue ticket(s):</p>
      <ul>${ticketsList}</ul>
      <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/tickets?overdue=true" style="color: #007bff;">View All Overdue</a></p>
    </div>
  `;
}
