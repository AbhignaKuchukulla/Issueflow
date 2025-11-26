import { nanoid } from 'nanoid';
import fs from 'fs';

const sampleTickets = [
  {
    id: nanoid(),
    title: 'Fix login page responsiveness',
    description: 'The login page is not displaying correctly on mobile devices. Need to add proper media queries and test on various screen sizes.',
    status: 'open',
    priority: 'high',
    assignee: 'Alex',
    dueDate: new Date('2025-11-30T23:59:59Z').toISOString(),
    tags: ['bug', 'ui', 'mobile'],
    createdAt: new Date('2025-11-20T10:00:00Z').toISOString(),
    updatedAt: new Date('2025-11-20T10:00:00Z').toISOString()
  },
  {
    id: nanoid(),
    title: 'Add password reset functionality',
    description: 'Users cannot reset their passwords. Implement email-based password reset with secure tokens.',
    status: 'in_progress',
    priority: 'urgent',
    assignee: 'Sam',
    dueDate: new Date('2025-11-28T23:59:59Z').toISOString(),
    tags: ['feature', 'auth', 'urgent'],
    createdAt: new Date('2025-11-19T09:30:00Z').toISOString(),
    updatedAt: new Date('2025-11-25T14:20:00Z').toISOString()
  },
  {
    id: nanoid(),
    title: 'Update dependencies to latest versions',
    description: 'Several npm packages have security updates available. Review and update all dependencies.',
    status: 'review',
    priority: 'medium',
    assignee: 'Jordan',
    dueDate: null,
    tags: ['maintenance', 'security'],
    createdAt: new Date('2025-11-18T15:45:00Z').toISOString(),
    updatedAt: new Date('2025-11-24T11:10:00Z').toISOString()
  },
  {
    id: nanoid(),
    title: 'Optimize database queries',
    description: 'Some queries are taking too long. Add indexes and optimize the most frequently used queries.',
    status: 'open',
    priority: 'medium',
    assignee: 'Taylor',
    dueDate: new Date('2025-12-05T23:59:59Z').toISOString(),
    tags: ['performance', 'backend'],
    createdAt: new Date('2025-11-17T08:20:00Z').toISOString(),
    updatedAt: new Date('2025-11-17T08:20:00Z').toISOString()
  },
  {
    id: nanoid(),
    title: 'Implement dark mode toggle',
    description: 'Add a dark mode theme option for users who prefer it. Should persist user preference.',
    status: 'closed',
    priority: 'low',
    assignee: 'Casey',
    dueDate: new Date('2025-11-22T23:59:59Z').toISOString(),
    tags: ['feature', 'ui'],
    createdAt: new Date('2025-11-15T13:00:00Z').toISOString(),
    updatedAt: new Date('2025-11-23T16:30:00Z').toISOString()
  },
  {
    id: nanoid(),
    title: 'Add file upload feature',
    description: 'Users should be able to attach files to tickets. Implement file upload with size limits and validation.',
    status: 'open',
    priority: 'high',
    assignee: '',
    dueDate: new Date('2025-12-10T23:59:59Z').toISOString(),
    tags: ['feature', 'enhancement'],
    createdAt: new Date('2025-11-21T11:15:00Z').toISOString(),
    updatedAt: new Date('2025-11-21T11:15:00Z').toISOString()
  },
  {
    id: nanoid(),
    title: 'Write API documentation',
    description: 'Create comprehensive API documentation using Swagger/OpenAPI specification.',
    status: 'in_progress',
    priority: 'medium',
    assignee: 'Morgan',
    dueDate: new Date('2025-12-01T23:59:59Z').toISOString(),
    tags: ['documentation'],
    createdAt: new Date('2025-11-16T14:30:00Z').toISOString(),
    updatedAt: new Date('2025-11-22T09:45:00Z').toISOString()
  },
  {
    id: nanoid(),
    title: 'Fix memory leak in dashboard',
    description: 'Dashboard component is causing memory leaks. Investigate and fix the issue with proper cleanup.',
    status: 'review',
    priority: 'urgent',
    assignee: 'Alex',
    dueDate: new Date('2025-11-27T23:59:59Z').toISOString(),
    tags: ['bug', 'performance', 'urgent'],
    createdAt: new Date('2025-11-22T10:00:00Z').toISOString(),
    updatedAt: new Date('2025-11-25T12:00:00Z').toISOString()
  }
];

const sampleComments = [
  {
    id: nanoid(),
    ticketId: sampleTickets[0].id,
    text: 'I tested this on iPhone 13 and the layout is completely broken. Priority should be urgent.',
    author: 'Sam',
    createdAt: new Date('2025-11-21T14:30:00Z').toISOString()
  },
  {
    id: nanoid(),
    ticketId: sampleTickets[0].id,
    text: 'Working on fixing the media queries now. Should have a PR ready by EOD.',
    author: 'Alex',
    createdAt: new Date('2025-11-22T09:15:00Z').toISOString()
  },
  {
    id: nanoid(),
    ticketId: sampleTickets[1].id,
    text: 'What token expiration time should we use? 1 hour or 24 hours?',
    author: 'Morgan',
    createdAt: new Date('2025-11-25T10:00:00Z').toISOString()
  },
  {
    id: nanoid(),
    ticketId: sampleTickets[1].id,
    text: 'Let\'s go with 1 hour for security. Users can always request a new token.',
    author: 'Sam',
    createdAt: new Date('2025-11-25T10:30:00Z').toISOString()
  }
];

const dbData = { tickets: sampleTickets, comments: sampleComments };

fs.writeFileSync('./db.json', JSON.stringify(dbData, null, 2));

console.log('✅ Database seeded successfully!');
console.log('📊 Tickets:', sampleTickets.length);
console.log('💬 Comments:', sampleComments.length);
console.log('📁 File: db.json');
