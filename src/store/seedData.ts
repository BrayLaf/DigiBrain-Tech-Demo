import type { BrainNode, BrainEdge } from '../types/graph';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  nodes: BrainNode[];
  edges: BrainEdge[];
}

const NOW = Date.now();

// ── Scenario 1: Job Seeker ─────────────────────────────────────
const jobSeekerNodes: BrainNode[] = [
  { id: 's1-alex',       type: 'person',   title: 'Alex Rivera',                              content: 'Frontend engineer preparing for senior product roles.', tags: [], createdAt: NOW, position: { x: 40,  y: 180 } },
  { id: 's1-mentor',     type: 'person',   title: 'Maya Chen',                                content: 'Former manager and strongest reference.', tags: [], createdAt: NOW, position: { x: 40,  y: 420 } },
  { id: 's1-career',     type: 'topic',    title: 'Senior Frontend Story',                    content: '', tags: [], createdAt: NOW, position: { x: 300, y: 140 } },
  { id: 's1-skills',     type: 'topic',    title: 'TypeScript, React, Design Systems',        content: '', tags: [], createdAt: NOW, position: { x: 300, y: 360 } },
  { id: 's1-resume',     type: 'document', title: 'Resume Draft — Product Engineer',          content: 'Frames Acme work around ownership, quality, and measurable outcomes.', tags: ['career'], createdAt: NOW, position: { x: 600, y: 40  } },
  { id: 's1-job',        type: 'document', title: 'Software Engineer @ Acme (2021-2024)',     content: 'Led dashboard migration, reduced bundle size, and mentored two junior engineers.', tags: ['experience'], createdAt: NOW, position: { x: 610, y: 210 } },
  { id: 's1-project',    type: 'document', title: 'Open-source CLI Tool',                     content: 'Shows API design, testing discipline, and developer experience instincts.', tags: ['portfolio'], createdAt: NOW, position: { x: 610, y: 390 } },
  { id: 's1-memory',     type: 'memory',   title: 'Interview Pattern',                        content: 'Best stories start with ambiguous requirements, then show tradeoffs and impact.', tags: [], createdAt: NOW, position: { x: 920, y: 170 } },
  { id: 's1-message',    type: 'message',  title: 'Recruiter Reply',                          content: 'Thanks for reaching out. I am targeting senior frontend roles with product ownership.', tags: [], createdAt: NOW, position: { x: 920, y: 360 } },
  { id: 's1-leadership', type: 'tag',      title: 'Leadership',                               content: '', tags: [], createdAt: NOW, position: { x: 320, y: 560 } },
  { id: 's1-portfolio',  type: 'tag',      title: 'Portfolio Proof',                          content: '', tags: [], createdAt: NOW, position: { x: 600, y: 560 } },
  { id: 's1-referral',   type: 'tag',      title: 'Referral Ready',                           content: '', tags: [], createdAt: NOW, position: { x: 900, y: 560 } },
];

const jobSeekerEdges: BrainEdge[] = [
  { id: 's1-e1',  source: 's1-alex',       target: 's1-career',     label: 'positioning' },
  { id: 's1-e2',  source: 's1-career',     target: 's1-resume',     label: 'summarized in' },
  { id: 's1-e3',  source: 's1-career',     target: 's1-job',        label: 'proven by' },
  { id: 's1-e4',  source: 's1-skills',     target: 's1-job',        label: 'used at' },
  { id: 's1-e5',  source: 's1-skills',     target: 's1-project',    label: 'demonstrated by' },
  { id: 's1-e6',  source: 's1-job',        target: 's1-memory',     label: 'interview story' },
  { id: 's1-e7',  source: 's1-project',    target: 's1-memory',     label: 'talking point' },
  { id: 's1-e8',  source: 's1-memory',     target: 's1-message',    label: 'informs' },
  { id: 's1-e9',  source: 's1-mentor',     target: 's1-job',        label: 'can validate' },
  { id: 's1-e10', source: 's1-mentor',     target: 's1-referral',   label: 'supports' },
  { id: 's1-e11', source: 's1-leadership', target: 's1-job',        label: 'tagged' },
  { id: 's1-e12', source: 's1-portfolio',  target: 's1-project',    label: 'tagged' },
  { id: 's1-e13', source: 's1-referral',   target: 's1-message',    label: 'context' },
  { id: 's1-e14', source: 's1-resume',     target: 's1-message',    label: 'source copy' },
];

// ── Scenario 2: Student ────────────────────────────────────────
const studentNodes: BrainNode[] = [
  { id: 's2-sam',       type: 'person',   title: 'Sam Patel',                              content: 'Third-year CS student balancing courses, capstone, and internship prep.', tags: [], createdAt: NOW, position: { x: 40,  y: 220 } },
  { id: 's2-prof',      type: 'person',   title: 'Dr. Nguyen',                             content: 'Capstone advisor with feedback on system design depth.', tags: [], createdAt: NOW, position: { x: 40,  y: 450 } },
  { id: 's2-semester',  type: 'topic',    title: 'Winter Term Focus',                      content: '', tags: [], createdAt: NOW, position: { x: 310, y: 100 } },
  { id: 's2-ml',        type: 'topic',    title: 'Python & Machine Learning',              content: '', tags: [], createdAt: NOW, position: { x: 310, y: 330 } },
  { id: 's2-cmput',     type: 'document', title: 'CMPUT 301 — Software Engineering',       content: 'Course notes on architecture, collaboration, and maintainable releases.', tags: ['coursework'], createdAt: NOW, position: { x: 610, y: 40  } },
  { id: 's2-capstone',  type: 'document', title: 'Capstone Project Proposal',              content: 'A campus route planner with accessibility-aware recommendations.', tags: ['capstone'], createdAt: NOW, position: { x: 620, y: 220 } },
  { id: 's2-intern',    type: 'document', title: 'Internship Tracker — Summer 2026',       content: 'Roles, contacts, resume versions, and follow-up dates.', tags: ['career'], createdAt: NOW, position: { x: 620, y: 410 } },
  { id: 's2-memory',    type: 'memory',   title: 'Office Hours Takeaway',                  content: 'Lead with constraints: dataset quality matters more than model choice.', tags: [], createdAt: NOW, position: { x: 930, y: 160 } },
  { id: 's2-message',   type: 'message',  title: 'Study Group Check-in',                   content: 'Can we review the project rubric before Sunday and split the API work?', tags: [], createdAt: NOW, position: { x: 930, y: 360 } },
  { id: 's2-uoa',       type: 'tag',      title: 'University of Alberta',                  content: '', tags: [], createdAt: NOW, position: { x: 300, y: 560 } },
  { id: 's2-study',     type: 'tag',      title: 'Study Group',                            content: '', tags: [], createdAt: NOW, position: { x: 600, y: 560 } },
  { id: 's2-deadline',  type: 'tag',      title: 'Due Soon',                               content: '', tags: [], createdAt: NOW, position: { x: 900, y: 560 } },
];

const studentEdges: BrainEdge[] = [
  { id: 's2-e1',  source: 's2-sam',      target: 's2-semester', label: 'planning' },
  { id: 's2-e2',  source: 's2-semester', target: 's2-cmput',    label: 'course' },
  { id: 's2-e3',  source: 's2-semester', target: 's2-capstone', label: 'major deliverable' },
  { id: 's2-e4',  source: 's2-ml',       target: 's2-capstone', label: 'tech direction' },
  { id: 's2-e5',  source: 's2-ml',       target: 's2-intern',   label: 'role focus' },
  { id: 's2-e6',  source: 's2-prof',     target: 's2-capstone', label: 'advisor feedback' },
  { id: 's2-e7',  source: 's2-prof',     target: 's2-memory',   label: 'reminded' },
  { id: 's2-e8',  source: 's2-memory',   target: 's2-capstone', label: 'changes scope' },
  { id: 's2-e9',  source: 's2-message',  target: 's2-study',    label: 'sent to' },
  { id: 's2-e10', source: 's2-message',  target: 's2-capstone', label: 'coordinates' },
  { id: 's2-e11', source: 's2-uoa',      target: 's2-cmput',    label: 'tagged' },
  { id: 's2-e12', source: 's2-study',    target: 's2-capstone', label: 'tagged' },
  { id: 's2-e13', source: 's2-deadline', target: 's2-message',  label: 'urgency' },
  { id: 's2-e14', source: 's2-intern',   target: 's2-sam',      label: 'next step' },
];

// ── Scenario 3: Kaika Team Brain ──────────────────────────────
const teamNodes: BrainNode[] = [
  { id: 's3-braydon',    type: 'person',   title: 'Braydon',                                      content: 'Owns backend direction, infrastructure, and demo narrative.', tags: [], createdAt: NOW, position: { x: 40,  y: 160 } },
  { id: 's3-shogo',      type: 'person',   title: 'Shogo',                                        content: 'Owns frontend polish, product feel, and user-facing flows.', tags: [], createdAt: NOW, position: { x: 40,  y: 400 } },
  { id: 's3-product',    type: 'topic',    title: 'Personal Knowledge Graphs',                    content: '', tags: [], createdAt: NOW, position: { x: 310, y: 110 } },
  { id: 's3-demo-topic', type: 'topic',    title: 'Tech Demo Experience',                         content: '', tags: [], createdAt: NOW, position: { x: 310, y: 350 } },
  { id: 's3-vision',     type: 'document', title: 'Kaika — Product Vision',                       content: 'Documents become linked concepts, decisions, people, memories, and follow-ups.', tags: ['strategy'], createdAt: NOW, position: { x: 620, y: 30  } },
  { id: 's3-demo',       type: 'document', title: 'Tech Demo Sprint 1',                           content: 'Scenario picker, editable nodes, edge labels, onboarding, and graph examples.', tags: ['demo'], createdAt: NOW, position: { x: 630, y: 220 } },
  { id: 's3-arch',       type: 'document', title: 'Full App Architecture (NestJS + Neo4j)',        content: 'Future backend plan for persistence, graph queries, and ingestion pipelines.', tags: ['architecture'], createdAt: NOW, position: { x: 630, y: 420 } },
  { id: 's3-memory',     type: 'memory',   title: 'Networking Event Insight',                     content: 'The strongest pitch is showing one document split into people, topics, memories, and next actions.', tags: [], createdAt: NOW, position: { x: 960, y: 130 } },
  { id: 's3-message',    type: 'message',  title: 'Follow-up to Shogo',                           content: 'Can you connect the demo story from Braydon to the scenario picker and visual polish?', tags: [], createdAt: NOW, position: { x: 960, y: 340 } },
  { id: 's3-reactflow',  type: 'tag',      title: 'React Flow',                                   content: '', tags: [], createdAt: NOW, position: { x: 310, y: 560 } },
  { id: 's3-event',      type: 'tag',      title: 'Networking Event — May 2026',                   content: '', tags: [], createdAt: NOW, position: { x: 620, y: 590 } },
  { id: 's3-neo4j',      type: 'tag',      title: 'Neo4j',                                        content: '', tags: [], createdAt: NOW, position: { x: 930, y: 560 } },
];

const teamEdges: BrainEdge[] = [
  { id: 's3-e1',  source: 's3-braydon',    target: 's3-product',    label: 'frames' },
  { id: 's3-e2',  source: 's3-product',    target: 's3-vision',     label: 'captured in' },
  { id: 's3-e3',  source: 's3-product',    target: 's3-demo',       label: 'shown through' },
  { id: 's3-e4',  source: 's3-demo',       target: 's3-memory',     label: 'created' },
  { id: 's3-e5',  source: 's3-memory',     target: 's3-message',    label: 'prompted' },
  { id: 's3-e6',  source: 's3-message',    target: 's3-shogo',      label: 'assigned to' },
  { id: 's3-e7',  source: 's3-shogo',      target: 's3-demo-topic', label: 'polishes' },
  { id: 's3-e8',  source: 's3-demo-topic', target: 's3-demo',       label: 'defined by' },
  { id: 's3-e9',  source: 's3-braydon',    target: 's3-arch',       label: 'owns' },
  { id: 's3-e10', source: 's3-shogo',      target: 's3-vision',     label: 'validates UX' },
  { id: 's3-e11', source: 's3-reactflow',  target: 's3-demo',       label: 'tagged' },
  { id: 's3-e12', source: 's3-event',      target: 's3-memory',     label: 'source' },
  { id: 's3-e13', source: 's3-neo4j',      target: 's3-arch',       label: 'tagged' },
  { id: 's3-e14', source: 's3-demo',       target: 's3-arch',       label: 'future path' },
];

export const scenarios: Scenario[] = [
  {
    id: 'job-seeker',
    name: 'Job Seeker',
    description: 'Link your experience, skills, and goals to tell your career story.',
    icon: '💼',
    nodes: jobSeekerNodes,
    edges: jobSeekerEdges,
  },
  {
    id: 'student',
    name: 'Student',
    description: 'Connect courses, projects, and opportunities into a learning map.',
    icon: '🎓',
    nodes: studentNodes,
    edges: studentEdges,
  },
  {
    id: 'team-brain',
    name: 'Team Brain',
    description: 'Capture a shared vision — who owns what and how everything fits.',
    icon: '🧠',
    nodes: teamNodes,
    edges: teamEdges,
  },
];

export const BLANK_SCENARIO: Scenario = {
  id: 'blank',
  name: 'Blank Graph',
  description: 'Start with an empty canvas and build your own brain from scratch.',
  icon: '✨',
  nodes: [],
  edges: [],
};

export const allScenarios: Scenario[] = [...scenarios, BLANK_SCENARIO];
