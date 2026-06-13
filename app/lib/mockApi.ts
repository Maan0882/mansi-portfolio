// ─────────────────────────────────────────────────────────────────────────────
// Mock API Layer — Simulates Laravel + Sanctum responses exactly
// Drop-in replaceable: swap this import for real fetch() calls later.
// ─────────────────────────────────────────────────────────────────────────────

import { PROJECTS, SKILLS, ABOUT, Project, Skill, AboutData } from "./portfolioData";

export interface ApiMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  path: string;
}

export interface ApiLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: ApiLinks;
  meta: ApiMeta;
}

export interface SingleResponse<T> {
  data: T;
}

export interface ApiResponseMeta {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  status: number;
  status_text: string;
  execution_time_ms: number;
  headers: Record<string, string>;
  timestamp: string;
}

function simulateDelay(min: number, max: number): Promise<number> {
  const ms = Math.floor(Math.random() * (max - min) + min);
  return new Promise((resolve) => setTimeout(() => resolve(ms), ms));
}

function buildResponseMeta(endpoint: string, method: "GET" | "POST", execMs: number): ApiResponseMeta {
  return {
    endpoint,
    method,
    status: 200,
    status_text: "OK",
    execution_time_ms: execMs,
    headers: {
      "Content-Type": "application/json",
      "X-RateLimit-Limit": "60",
      "X-RateLimit-Remaining": "58",
      "X-Request-Id": Math.random().toString(36).slice(2, 10).toUpperCase(),
      "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL3BvcnRmb2xpby5tYW5zaS5kZXYiLCJzdWIiOjEsImV4cCI6MTc0NzE3MDQ1MH0.portfolio_sanctum_token",
      "Cache-Control": "no-cache, private",
      "X-Powered-By": "Laravel/11.x",
      "Server": "nginx/1.25.3",
    },
    timestamp: new Date().toISOString(),
  };
}

// GET /api/projects
export async function getProjects(filters?: { type?: string; tech?: string }): Promise<{
  response: PaginatedResponse<Project>;
  meta: ApiResponseMeta;
}> {
  const ms = await simulateDelay(45, 110);
  let data = [...PROJECTS];
  if (filters?.type) data = data.filter((p) => p.type === filters.type);
  if (filters?.tech) data = data.filter((p) => p.tech_stack.some((t) => t.toLowerCase().includes(filters.tech!.toLowerCase())));
  return {
    response: {
      data,
      links: {
        first: "https://portfolio.mansi.dev/api/projects?page=1",
        last: "https://portfolio.mansi.dev/api/projects?page=1",
        prev: null,
        next: null,
      },
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        per_page: 15,
        to: data.length,
        total: data.length,
        path: "https://portfolio.mansi.dev/api/projects",
      },
    },
    meta: buildResponseMeta("/api/projects", "GET", ms),
  };
}

// GET /api/skills
export async function getSkills(category?: string): Promise<{
  response: PaginatedResponse<Skill>;
  meta: ApiResponseMeta;
}> {
  const ms = await simulateDelay(32, 80);
  let data = [...SKILLS];
  if (category) data = data.filter((s) => s.category === category);
  return {
    response: {
      data,
      links: {
        first: "https://portfolio.mansi.dev/api/skills?page=1",
        last: "https://portfolio.mansi.dev/api/skills?page=1",
        prev: null,
        next: null,
      },
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        per_page: 15,
        to: data.length,
        total: data.length,
        path: "https://portfolio.mansi.dev/api/skills",
      },
    },
    meta: buildResponseMeta("/api/skills", "GET", ms),
  };
}

// GET /api/about
export async function getAbout(): Promise<{
  response: SingleResponse<AboutData>;
  meta: ApiResponseMeta;
}> {
  const ms = await simulateDelay(20, 55);
  return {
    response: { data: ABOUT },
    meta: buildResponseMeta("/api/about", "GET", ms),
  };
}

// POST /api/contact
export async function postContact(payload: { name: string; email: string; message: string }): Promise<{
  response: { data: { message: string; queued_at: string } };
  meta: ApiResponseMeta;
}> {
  const ms = await simulateDelay(80, 200);
  return {
    response: {
      data: {
        message: "Your message has been queued and will be delivered shortly.",
        queued_at: new Date().toISOString(),
      },
    },
    meta: { ...buildResponseMeta("/api/contact", "POST", ms), status: 201, status_text: "Created" },
  };
}

// SQL Query Playground data
export interface SqlQuery {
  id: string;
  label: string;
  sql: string;
  description: string;
  optimization_hint: string;
  columns: string[];
  resultGenerator: () => Record<string, string | number | null>[];
}

export const SQL_QUERIES: SqlQuery[] = [
  {
    id: "projects_all",
    label: "SELECT * FROM projects",
    sql: `SELECT\n  p.id,\n  p.title,\n  p.type,\n  p.status,\n  p.completion_date,\n  p.featured\nFROM projects p\nORDER BY p.completion_date DESC;`,
    description: "Fetch all projects ordered by completion date.",
    optimization_hint: "Index on `completion_date` reduces full table scan. EXPLAIN shows Using index.",
    columns: ["id", "title", "type", "status", "completion_date", "featured"],
    resultGenerator: () => PROJECTS.map((p) => ({
      id: p.id,
      title: p.title,
      type: p.type,
      status: p.status,
      completion_date: p.completion_date,
      featured: p.featured ? 1 : 0,
    })),
  },
  {
    id: "skills_join",
    label: "JOIN projects + skills",
    sql: `SELECT\n  p.title AS project,\n  s.name AS skill,\n  s.category,\n  s.proficiency\nFROM projects p\nINNER JOIN project_skills ps ON ps.project_id = p.id\nINNER JOIN skills s ON s.id = ps.skill_id\nORDER BY s.proficiency DESC\nLIMIT 10;`,
    description: "Join projects with their skills via pivot table.",
    optimization_hint: "Composite index on project_skills(project_id, skill_id) eliminates filesort.",
    columns: ["project", "skill", "category", "proficiency"],
    resultGenerator: () => [
      { project: "SSM Future Innovation", skill: "Next.js", category: "frontend", proficiency: 85 },
      { project: "SSM Future Innovation", skill: "TypeScript", category: "frontend", proficiency: 80 },
      { project: "IAPES System", skill: "Laravel", category: "backend", proficiency: 85 },
      { project: "IAPES System", skill: "MySQL", category: "database", proficiency: 85 },
      { project: "Chat App", skill: "PHP", category: "backend", proficiency: 88 },
      { project: "Attendance System", skill: "PHP", category: "backend", proficiency: 88 },
      { project: "Quiz Up", skill: "ASP.NET", category: "backend", proficiency: 78 },
      { project: "Quiz Up", skill: "C#", category: "language", proficiency: 78 },
    ],
  },
  {
    id: "skills_group",
    label: "GROUP BY category",
    sql: `SELECT\n  category,\n  COUNT(*) AS skill_count,\n  ROUND(AVG(proficiency), 1) AS avg_proficiency,\n  MAX(proficiency) AS max_proficiency\nFROM skills\nGROUP BY category\nORDER BY avg_proficiency DESC;`,
    description: "Aggregate skills by category with statistics.",
    optimization_hint: "No join — single table aggregate. MySQL optimizes with temporary table. Adding covering index on (category, proficiency) avoids it.",
    columns: ["category", "skill_count", "avg_proficiency", "max_proficiency"],
    resultGenerator: () => [
      { category: "tools", skill_count: 3, avg_proficiency: 81.0, max_proficiency: 95 },
      { category: "frontend", skill_count: 5, avg_proficiency: 87.6, max_proficiency: 95 },
      { category: "backend", skill_count: 3, avg_proficiency: 83.7, max_proficiency: 88 },
      { category: "database", skill_count: 2, avg_proficiency: 81.5, max_proficiency: 85 },
      { category: "language", skill_count: 2, avg_proficiency: 73.5, max_proficiency: 75 },
    ],
  },
  {
    id: "featured_projects",
    label: "WHERE featured = 1",
    sql: `SELECT\n  p.*,\n  GROUP_CONCAT(t.name ORDER BY t.name SEPARATOR ', ') AS tech_stack\nFROM projects p\nLEFT JOIN project_tech t ON t.project_id = p.id\nWHERE p.featured = 1\nGROUP BY p.id\nORDER BY p.id;`,
    description: "Fetch featured projects with concatenated tech stack.",
    optimization_hint: "Index on `featured` column turns full scan (type=ALL) into ref scan. GROUP_CONCAT uses implicit sort — LIMIT caps memory.",
    columns: ["id", "title", "type", "status", "tech_stack"],
    resultGenerator: () => PROJECTS.filter((p) => p.featured).map((p) => ({
      id: p.id,
      title: p.title,
      type: p.type,
      status: p.status,
      tech_stack: p.tech_stack.join(", "),
    })),
  },
];
