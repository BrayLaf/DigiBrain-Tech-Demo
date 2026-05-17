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
  { id: 's1-job',     type: 'document', title: 'Software Engineer @ Acme (2021–2024)', content: '', tags: [], createdAt: NOW, position: { x: 260, y: 100 } },
  { id: 's1-degree',  type: 'document', title: 'BSc Computer Science',                 content: '', tags: [], createdAt: NOW, position: { x: 560, y: 60  } },
  { id: 's1-project', type: 'document', title: 'Open-source CLI tool',                 content: '', tags: [], createdAt: NOW, position: { x: 620, y: 260 } },
  { id: 's1-skills',  type: 'topic',    title: 'TypeScript & React',                   content: '', tags: [], createdAt: NOW, position: { x: 380, y: 360 } },
  { id: 's1-goals',   type: 'topic',    title: 'Targeting senior roles',               content: '', tags: [], createdAt: NOW, position: { x: 60,  y: 240 } },
];

const jobSeekerEdges: BrainEdge[] = [
  { id: 's1-e1', source: 's1-job',     target: 's1-skills', label: 'skills' },
  { id: 's1-e2', source: 's1-degree',  target: 's1-skills', label: 'skills' },
  { id: 's1-e3', source: 's1-project', target: 's1-skills', label: 'skills' },
  { id: 's1-e4', source: 's1-goals',   target: 's1-job',    label: 'targets' },
];

// ── Scenario 2: Student ────────────────────────────────────────
const studentNodes: BrainNode[] = [
  { id: 's2-cmput',    type: 'document', title: 'CMPUT 301 — Software Engineering',      content: '', tags: [], createdAt: NOW, position: { x: 60,  y: 140 } },
  { id: 's2-capstone', type: 'document', title: 'Capstone Project',                       content: '', tags: [], createdAt: NOW, position: { x: 380, y: 100 } },
  { id: 's2-ml',       type: 'topic',    title: 'Python & Machine Learning',              content: '', tags: [], createdAt: NOW, position: { x: 660, y: 320 } },
  { id: 's2-intern',   type: 'topic',    title: 'Internship Search — Summer 2026',        content: '', tags: [], createdAt: NOW, position: { x: 320, y: 340 } },
  { id: 's2-uoa',      type: 'tag',      title: 'University of Alberta',                  content: '', tags: [], createdAt: NOW, position: { x: 60,  y: 380 } },
  { id: 's2-study',    type: 'tag',      title: 'Study Group',                            content: '', tags: [], createdAt: NOW, position: { x: 680, y: 80  } },
];

const studentEdges: BrainEdge[] = [
  { id: 's2-e1', source: 's2-capstone', target: 's2-cmput' },
  { id: 's2-e2', source: 's2-capstone', target: 's2-study' },
  { id: 's2-e3', source: 's2-intern',   target: 's2-ml'    },
  { id: 's2-e4', source: 's2-cmput',    target: 's2-uoa'   },
];

// ── Scenario 3: Digibrain Team Brain ──────────────────────────
const teamNodes: BrainNode[] = [
  { id: 's3-vision',   type: 'document', title: 'Digibrain — Product Vision',                  content: '', tags: [], createdAt: NOW, position: { x: 340, y: 180 } },
  { id: 's3-demo',     type: 'document', title: 'Tech Demo Sprint 1',                          content: '', tags: [], createdAt: NOW, position: { x: 80,  y: 360 } },
  { id: 's3-arch',     type: 'document', title: 'Full App Architecture (NestJS + Neo4j)',       content: '', tags: [], createdAt: NOW, position: { x: 580, y: 360 } },
  { id: 's3-braydon',  type: 'topic',    title: 'Braydon — Backend & Infra',                   content: '', tags: [], createdAt: NOW, position: { x: 40,  y: 60  } },
  { id: 's3-shogo',    type: 'topic',    title: 'Shogo — Frontend & Product',                  content: '', tags: [], createdAt: NOW, position: { x: 700, y: 60  } },
  { id: 's3-reactflow',type: 'tag',      title: 'React Flow',                                  content: '', tags: [], createdAt: NOW, position: { x: 40,  y: 520 } },
  { id: 's3-event',    type: 'tag',      title: 'Networking Event — May 2026',                  content: '', tags: [], createdAt: NOW, position: { x: 380, y: 530 } },
];

const teamEdges: BrainEdge[] = [
  { id: 's3-e1', source: 's3-vision',    target: 's3-demo'  },
  { id: 's3-e2', source: 's3-demo',      target: 's3-arch'  },
  { id: 's3-e3', source: 's3-braydon',   target: 's3-demo'  },
  { id: 's3-e4', source: 's3-shogo',     target: 's3-arch'  },
  { id: 's3-e5', source: 's3-reactflow', target: 's3-demo'  },
  { id: 's3-e6', source: 's3-event',     target: 's3-demo'  },
  { id: 's3-e7', source: 's3-braydon',   target: 's3-vision'},
  { id: 's3-e8', source: 's3-shogo',     target: 's3-vision'},
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
