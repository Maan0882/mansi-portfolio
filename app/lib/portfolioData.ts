// ─────────────────────────────────────────────────────────────────────────────
// Portfolio Data — Single Source of Truth
// Structured exactly as Laravel API Resources would return them.
// ─────────────────────────────────────────────────────────────────────────────

export interface Project {
  id: number;
  title: string;
  description: string;
  type: "experience" | "project";
  status: "live" | "completed" | "in-progress";
  tech_stack: string[];
  live_url?: string;
  github_url?: string;
  completion_date: string;
  featured: boolean;
}

export interface Skill {
  id: number;
  name: string;
  category: "frontend" | "backend" | "database" | "tools" | "language";
  proficiency: number; // 0-100
  icon?: string;
  years_experience: number;
}

export interface AboutData {
  id: number;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  linkedin: string;
  github: string;
  portfolio_url: string;
  education: { degree: string; institution: string; year: string }[];
  availability: "open" | "closed";
  location: string;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "SSM Future Innovation FZE",
    description:
      "Modern Next.js web application with TypeScript for SSM Future Innovation FZE. Implemented robust, scalable architecture with full-stack patterns ensuring production-ready performance.",
    type: "experience",
    status: "live",
    tech_stack: ["Next.js", "TypeScript", "TailwindCSS", "React"],
    live_url: "https://ssmfutureinnovationfze.com/",
    completion_date: "2025-03-01",
    featured: true,
  },
  {
    id: 2,
    title: "IAPES System (TechStrota)",
    description:
      "Robust web application built with Laravel. Leverages expressive routing, secure Sanctum authentication, and Eloquent ORM for scalable database management with clean MVC architecture.",
    type: "experience",
    status: "live",
    tech_stack: ["Laravel", "PHP", "Blade", "MySQL", "Eloquent"],
    live_url: "https://techstrota.tech/",
    completion_date: "2024-11-01",
    featured: true,
  },
  {
    id: 3,
    title: "Real-time Chat Application",
    description:
      "Web-based real-time chat platform featuring user authentication, persistent messaging, and seamless logout. Built for smooth, low-latency communication with WebSocket pattern.",
    type: "project",
    status: "live",
    tech_stack: ["PHP", "MySQL", "JavaScript", "WebSockets"],
    live_url: "https://mg2808.free.nf/Chat App/",
    completion_date: "2024-08-01",
    featured: true,
  },
  {
    id: 4,
    title: "Quiz Up Platform",
    description:
      "Interactive quiz platform with user registration, dynamic quiz creation, auto-scoring, and comprehensive result tracking. Full CRUD with role-based access control.",
    type: "project",
    status: "completed",
    tech_stack: ["ASP.NET", "C#", "SQL Server", "Bootstrap"],
    completion_date: "2024-06-01",
    featured: false,
  },
  {
    id: 5,
    title: "Attendance Management System",
    description:
      "Comprehensive attendance system with role-based dashboards for Admin, Teacher, and Student roles. Real-time reporting, secure authentication, and audit trails.",
    type: "project",
    status: "live",
    tech_stack: ["PHP", "MySQL", "Dashboard UI", "Chart.js"],
    live_url: "https://mg2808.free.nf/Attendance%20System/",
    completion_date: "2024-04-01",
    featured: false,
  },
];

export const SKILLS: Skill[] = [
  { id: 1,  name: "HTML5 / CSS3",      category: "frontend",  proficiency: 95, years_experience: 4 },
  { id: 2,  name: "JavaScript (ES2023)", category: "frontend", proficiency: 88, years_experience: 3 },
  { id: 3,  name: "TypeScript",         category: "frontend",  proficiency: 80, years_experience: 2 },
  { id: 4,  name: "React / Next.js",    category: "frontend",  proficiency: 85, years_experience: 2 },
  { id: 5,  name: "TailwindCSS",        category: "frontend",  proficiency: 90, years_experience: 2 },
  { id: 6,  name: "PHP",                category: "backend",   proficiency: 88, years_experience: 3 },
  { id: 7,  name: "Laravel",            category: "backend",   proficiency: 85, years_experience: 2 },
  { id: 8,  name: "C# / ASP.NET",       category: "backend",   proficiency: 78, years_experience: 2 },
  { id: 9,  name: "Java",               category: "language",  proficiency: 75, years_experience: 3 },
  { id: 10, name: "Python",             category: "language",  proficiency: 72, years_experience: 2 },
  { id: 11, name: "MySQL",              category: "database",  proficiency: 85, years_experience: 3 },
  { id: 12, name: "SQL Server",         category: "database",  proficiency: 78, years_experience: 2 },
  { id: 13, name: "Git / GitHub",       category: "tools",     proficiency: 88, years_experience: 3 },
  { id: 14, name: "Docker (basics)",    category: "tools",     proficiency: 60, years_experience: 1 },
  { id: 15, name: "VS Code",            category: "tools",     proficiency: 95, years_experience: 4 },
];

export const ABOUT: AboutData = {
  id: 1,
  name: "Mansi Gajjar",
  title: "Full Stack Developer",
  tagline: "I build production-ready web apps with clean architecture, from Laravel APIs to React frontends — shipped and deployed.",
  bio: "Highly motivated Full Stack Developer from Dharmaj, Anand. Completed Master's degree in Information Technology at Shree P. M. Patel Institute, Anand in April 2026, and BCA in 2024. Passionate about building real-world software with clean architecture, responsive design, and reliable backends.",
  email: "gajjarmansi2808@gmail.com",
  linkedin: "https://www.linkedin.com/in/2808-mansi-gajjar",
  github: "https://github.com/Maan0882",
  portfolio_url: "https://mansi-portfolio-3d.vercel.app",
  education: [
    { degree: "MSc Information Technology", institution: "Shree P. M. Patel Institute, Anand", year: "2026" },
    { degree: "BCA", institution: "Gujarat University", year: "2024" },
  ],
  availability: "open",
  location: "Anand, Gujarat, India",
};

export const GITHUB_COMMITS = Array.from({ length: 52 * 7 }, (_, i) => ({
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  count: Math.random() > 0.55 ? Math.floor(Math.random() * 8) + 1 : 0,
})).reverse();
