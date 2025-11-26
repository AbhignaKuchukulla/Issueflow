export const TICKET_TEMPLATES = [
  {
    id: 'bug',
    name: '🐛 Bug Report',
    title: '',
    description: `**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**


**Actual Behavior:**


**Environment:**
- Browser/Device:
- Version:

**Additional Context:**
`,
    status: 'open',
    priority: 'high',
    tags: ['bug']
  },
  {
    id: 'feature',
    name: '✨ Feature Request',
    title: '',
    description: `**Problem Statement:**


**Proposed Solution:**


**Alternatives Considered:**


**Additional Context:**
`,
    status: 'open',
    priority: 'medium',
    tags: ['feature', 'enhancement']
  },
  {
    id: 'task',
    name: '✅ Task',
    title: '',
    description: `**Objective:**


**Requirements:**
- [ ] 
- [ ] 
- [ ] 

**Acceptance Criteria:**
- [ ] 
- [ ] 

**Notes:**
`,
    status: 'open',
    priority: 'medium',
    tags: ['task']
  },
  {
    id: 'improvement',
    name: '🔧 Improvement',
    title: '',
    description: `**Current State:**


**Desired State:**


**Benefits:**


**Implementation Notes:**
`,
    status: 'open',
    priority: 'low',
    tags: ['improvement']
  },
  {
    id: 'documentation',
    name: '📚 Documentation',
    title: '',
    description: `**Section:**


**Content Needed:**


**Target Audience:**


**Related Links:**
`,
    status: 'open',
    priority: 'low',
    tags: ['documentation']
  }
];
