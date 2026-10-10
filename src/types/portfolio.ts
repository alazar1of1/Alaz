export interface PortfolioProfile {
  name: string;
  title: string;
  shortBio: string;
  fullBio: string;
  avatarUrl: string;
  email: string;
  phone: string;
  location: string;
  availableForWork: boolean;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl?: string;
  resumeUrl: string;
  yearsOfExperience: number;
  completedProjects: number;
  happyClients: number;
}

export interface ProjectItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  technologies: string[];
  demoUrl: string;
  githubUrl: string;
  featured: boolean;
  completionDate: string;
  metrics?: string;
  order: number;
}

export interface ExperienceItem {
  _id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  link: string;
  technologies: string[];
  order: number;
}

export interface SkillItem {
  _id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Cloud & DevOps' | 'Tools';
  proficiency: number;
  yearsOfExp: string;
  link: string;
  order: number;
}

export interface CertificationItem {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  link: string;
  badgeUrl: string;
  order: number;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface PortfolioData {
  profile: PortfolioProfile;
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  skills: SkillItem[];
  certifications: CertificationItem[];
}

export interface DatabaseStatus {
  mode: 'atlas' | 'local_json';
  connected: boolean;
  databaseName: string;
  message: string;
  atlasUriMasked?: string;
}
