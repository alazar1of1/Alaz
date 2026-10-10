import fs from 'fs';
import path from 'path';
import { MongoClient, Db } from 'mongodb';
import {
  PortfolioProfile,
  ProjectItem,
  ExperienceItem,
  SkillItem,
  CertificationItem,
  ContactMessage,
  PortfolioData,
  DatabaseStatus,
} from '../src/types/portfolio.ts';

// Default initial data matching Hashan De Zoysa's portfolio standards
const DEFAULT_PROFILE: PortfolioProfile = {
  name: 'Alazar.A',
  title: 'Full-Stack Developer & MERN Engineer',
  shortBio:
    'Dedicated Full-Stack Software Engineer specializing in modern MERN architecture, distributed cloud backends, and responsive React web experiences. Passionate about writing scalable TypeScript, high-throughput APIs, and intuitive user interfaces.',
  fullBio:
    'With over 4 years of engineering experience across high-growth startups and modern web solutions, I build end-to-end applications from MongoDB data modeling to interactive React client applications. I focus on clean code architecture, performance optimization, and robust developer tooling.',
  avatarUrl: '/src/assets/images/developer_hero_portrait_1791549963661.jpg',
  email: 'alazar1of1@gmail.com',
  phone: '0992837336',
  location: 'Addis Ababa & Remote Worldwide',
  availableForWork: true,
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://linkedin.com',
  twitterUrl: 'https://twitter.com',
  resumeUrl: '#resume',
  yearsOfExperience: 4,
  completedProjects: 28,
  happyClients: 19,
};

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    _id: 'proj_1',
    title: 'Mernify - Cloud E-Commerce & Analytics Platform',
    slug: 'mernify-ecommerce-analytics',
    category: 'MERN Stack',
    description:
      'Enterprise multi-tenant retail analytics and e-commerce portal built with MongoDB Atlas, Express, React, and Node.js. Features real-time order tracking, payment processing, and dashboard telemetry.',
    longDescription:
      'Mernify is a comprehensive full-stack commerce engine built to support high-concurrency order processing and deep catalog analytics. Engineered with MongoDB aggregation pipelines for instant sales reporting, dynamic stock monitoring, and secure role-based access control.',
    imageUrl: '/src/assets/images/project_ecommerce_platform_1791549974827.jpg',
    technologies: ['MongoDB Atlas', 'Express.js', 'React 19', 'Node.js', 'Tailwind CSS', 'JWT'],
    demoUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    featured: true,
    completionDate: '2026',
    metrics: '$185k+ processed volume · sub-120ms API latency',
    order: 1,
  },
  {
    _id: 'proj_2',
    title: 'DevFlow - Collaborative Sprint Workspace',
    slug: 'devflow-collaborative-workspace',
    category: 'Full Stack',
    description:
      'Kanban sprint tracking and asynchronous team communication platform for software squads with real-time websocket task synchronization and burndown charts.',
    longDescription:
      'Designed to reduce project bottlenecks, DevFlow integrates sprint planning, pull request linking, and team workload balancing into a single streamlined workspace. Backed by MongoDB for flexible schema updates and lightning-fast nested task queries.',
    imageUrl: '/src/assets/images/project_saas_workspace_1791549984845.jpg',
    technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'TypeScript', 'Tailwind CSS'],
    demoUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    featured: true,
    completionDate: '2025',
    metrics: '99.98% uptime · 4,200 active weekly users',
    order: 2,
  },
  {
    _id: 'proj_3',
    title: 'PulseAPI - Microservices Gateway & Rate Limiter',
    slug: 'pulseapi-microservices-gateway',
    category: 'Node & APIs',
    description:
      'High-throughput reverse proxy and API token metering gateway built on Node.js and MongoDB cache indexes with token bucket traffic throttling.',
    longDescription:
      'PulseAPI handles distributed authentication, route routing, and usage quotas across 14 decoupled microservices. Built with extensive error telemetry, automated health probes, and structured JSON logging.',
    imageUrl: '/src/assets/images/project_ecommerce_platform_1791549974827.jpg',
    technologies: ['Node.js', 'Express', 'MongoDB Atlas', 'Redis', 'Docker'],
    demoUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    featured: false,
    completionDate: '2025',
    metrics: '15,000 requests/sec peak capacity',
    order: 3,
  },
];

const DEFAULT_EXPERIENCE: ExperienceItem[] = [
  {
    _id: 'exp_1',
    role: 'Senior Full-Stack Engineer',
    company: 'Apex Cloud Solutions',
    period: '2024 - Present',
    location: 'Remote / Global',
    description:
      'Leading architecture and implementation of scalable MERN stack web applications and microservice backends serving enterprise clients.',
    achievements: [
      'Architected distributed MongoDB Atlas cluster with automatic replica set sharding, reducing query times by 42%.',
      'Engineered responsive React web interfaces with modular design systems and zero-latency state synchronization.',
      'Mentored 6 junior engineers on TypeScript best practices, CI/CD pipeline deployment, and database indexing.',
    ],
    link: 'https://apexcloud.dev',
    technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'TypeScript', 'Docker'],
    order: 1,
  },
  {
    _id: 'exp_2',
    role: 'Full-Stack Developer',
    company: 'Nexus Digital Studio',
    period: '2022 - 2024',
    location: 'Colombo, Sri Lanka',
    description:
      'Developed custom SaaS web products, client portals, and e-commerce platforms using the React and Node.js ecosystem.',
    achievements: [
      'Delivered 14 production web applications with 100% on-time milestone completions.',
      'Refactored legacy REST APIs into optimized Express middleware with comprehensive schema validation.',
      'Constructed dynamic contact ingestion pipelines and automated email notification systems.',
    ],
    link: 'https://nexusdigital.io',
    technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Redux'],
    order: 2,
  },
  {
    _id: 'exp_3',
    role: 'Junior Software Engineer',
    company: 'Synergy Labs',
    period: '2021 - 2022',
    location: 'Colombo, Sri Lanka',
    description:
      'Collaborated on frontend interface components, responsive layout debugging, and backend CRUD API development.',
    achievements: [
      'Built responsive UI component libraries adhering to WCAG accessibility guidelines.',
      'Created unit and integration tests achieving 88% test coverage across primary endpoints.',
    ],
    link: 'https://synergylabs.tech',
    technologies: ['JavaScript', 'React', 'Express', 'MongoDB', 'Git'],
    order: 3,
  },
];

const DEFAULT_SKILLS: SkillItem[] = [
  {
    _id: 'sk_1',
    name: 'MongoDB & MongoDB Atlas',
    category: 'Database',
    proficiency: 95,
    yearsOfExp: '4+ yrs',
    link: 'https://www.mongodb.com/docs/atlas/',
    order: 1,
  },
  {
    _id: 'sk_2',
    name: 'React.js & React 19',
    category: 'Frontend',
    proficiency: 96,
    yearsOfExp: '4+ yrs',
    link: 'https://react.dev',
    order: 2,
  },
  {
    _id: 'sk_3',
    name: 'Node.js & Express.js',
    category: 'Backend',
    proficiency: 94,
    yearsOfExp: '4+ yrs',
    link: 'https://nodejs.org',
    order: 3,
  },
  {
    _id: 'sk_4',
    name: 'TypeScript',
    category: 'Frontend',
    proficiency: 92,
    yearsOfExp: '3+ yrs',
    link: 'https://www.typescriptlang.org',
    order: 4,
  },
  {
    _id: 'sk_5',
    name: 'Tailwind CSS & Modern UI',
    category: 'Frontend',
    proficiency: 95,
    yearsOfExp: '4+ yrs',
    link: 'https://tailwindcss.com',
    order: 5,
  },
  {
    _id: 'sk_6',
    name: 'RESTful APIs & GraphQL',
    category: 'Backend',
    proficiency: 90,
    yearsOfExp: '4+ yrs',
    link: 'https://restfulapi.net',
    order: 6,
  },
  {
    _id: 'sk_7',
    name: 'Docker & Containerization',
    category: 'Cloud & DevOps',
    proficiency: 84,
    yearsOfExp: '2+ yrs',
    link: 'https://www.docker.com',
    order: 7,
  },
  {
    _id: 'sk_8',
    name: 'Git & GitHub CI/CD',
    category: 'Tools',
    proficiency: 92,
    yearsOfExp: '4+ yrs',
    link: 'https://github.com',
    order: 8,
  },
];

const DEFAULT_CERTIFICATIONS: CertificationItem[] = [
  {
    _id: 'cert_1',
    title: 'MongoDB Certified Associate Developer',
    issuer: 'MongoDB University',
    issueDate: '2024',
    credentialId: 'MDB-DEV-892401',
    link: 'https://learn.mongodb.com',
    badgeUrl: '/src/assets/images/certificate_badge_cloud_1791549994768.jpg',
    order: 1,
  },
  {
    _id: 'cert_2',
    title: 'Meta Certified Full-Stack Developer',
    issuer: 'Meta & Coursera',
    issueDate: '2023',
    credentialId: 'META-FS-551092',
    link: 'https://www.coursera.org',
    badgeUrl: '/src/assets/images/certificate_badge_cloud_1791549994768.jpg',
    order: 2,
  },
  {
    _id: 'cert_3',
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    issueDate: '2023',
    credentialId: 'AWS-CCP-773190',
    link: 'https://aws.amazon.com/certification/',
    badgeUrl: '/src/assets/images/certificate_badge_cloud_1791549994768.jpg',
    order: 3,
  },
];

const DEFAULT_MESSAGES: ContactMessage[] = [
  {
    _id: 'msg_1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@techventures.co',
    subject: 'Senior Full-Stack Consultant Inquiry',
    message:
      'Hi Hashan, we loved your MERN portfolio and recent projects. We are currently scouting for a senior engineer to spearhead our upcoming SaaS platform launch. Would love to schedule a 20-min introductory sync!',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    read: false,
  },
];

// Storage Engine
interface DatabaseSchema {
  profile: PortfolioProfile;
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  skills: SkillItem[];
  certifications: CertificationItem[];
  messages: ContactMessage[];
  atlasUri?: string;
}

class PortfolioDatabase {
  private localFilePath: string;
  private mongoClient: MongoClient | null = null;
  private mongoDb: Db | null = null;
  private isMongoConnected = false;
  private currentAtlasUri: string = '';

  constructor() {
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.localFilePath = path.join(dataDir, 'portfolio-db.json');
    this.initLocalStore();

    // Check for MongoDB URI in environment
    const envUri = process.env.MONGODB_URI || '';
    if (envUri && envUri.trim().length > 0) {
      this.connectAtlas(envUri).catch((err) => {
        console.warn('Initial Atlas connection attempt failed:', err.message);
      });
    }
  }

  private initLocalStore(): void {
    if (!fs.existsSync(this.localFilePath)) {
      const initialData: DatabaseSchema = {
        profile: DEFAULT_PROFILE,
        projects: DEFAULT_PROJECTS,
        experiences: DEFAULT_EXPERIENCE,
        skills: DEFAULT_SKILLS,
        certifications: DEFAULT_CERTIFICATIONS,
        messages: DEFAULT_MESSAGES,
        atlasUri: '',
      };
      fs.writeFileSync(this.localFilePath, JSON.stringify(initialData, null, 2), 'utf-8');
    }
  }

  private readLocal(): DatabaseSchema {
    this.initLocalStore();
    try {
      const content = fs.readFileSync(this.localFilePath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return {
        profile: DEFAULT_PROFILE,
        projects: DEFAULT_PROJECTS,
        experiences: DEFAULT_EXPERIENCE,
        skills: DEFAULT_SKILLS,
        certifications: DEFAULT_CERTIFICATIONS,
        messages: DEFAULT_MESSAGES,
        atlasUri: '',
      };
    }
  }

  private writeLocal(data: DatabaseSchema): void {
    fs.writeFileSync(this.localFilePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  public async connectAtlas(uri: string): Promise<{ success: boolean; message: string }> {
    if (!uri || !uri.startsWith('mongodb')) {
      return { success: false, message: 'Invalid MongoDB connection URI format.' };
    }

    try {
      if (this.mongoClient) {
        await this.mongoClient.close().catch(() => {});
      }

      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });

      await client.connect();
      // Test ping
      const db = client.db('portfolio');
      await db.command({ ping: 1 });

      this.mongoClient = client;
      this.mongoDb = db;
      this.isMongoConnected = true;
      this.currentAtlasUri = uri;

      // Save URI in local state so admin persists it
      const local = this.readLocal();
      local.atlasUri = uri;
      this.writeLocal(local);

      // Seed collections in Atlas if empty
      await this.syncToAtlasIfEmpty();

      return {
        success: true,
        message: 'Successfully connected to MongoDB Atlas database cluster.',
      };
    } catch (err: any) {
      this.isMongoConnected = false;
      this.mongoClient = null;
      this.mongoDb = null;
      return {
        success: false,
        message: err.message || 'Failed to connect to MongoDB Atlas.',
      };
    }
  }

  private async syncToAtlasIfEmpty(): Promise<void> {
    if (!this.mongoDb) return;
    try {
      const local = this.readLocal();
      const profileColl = this.mongoDb.collection('profiles');
      const count = await profileColl.countDocuments();
      if (count === 0) {
        await profileColl.insertOne({ ...local.profile, _id: 'main_profile' } as any);
        if (local.projects.length) await this.mongoDb.collection('projects').insertMany(local.projects as any[]);
        if (local.experiences.length) await this.mongoDb.collection('experiences').insertMany(local.experiences as any[]);
        if (local.skills.length) await this.mongoDb.collection('skills').insertMany(local.skills as any[]);
        if (local.certifications.length) await this.mongoDb.collection('certifications').insertMany(local.certifications as any[]);
        if (local.messages.length) await this.mongoDb.collection('messages').insertMany(local.messages as any[]);
      }
    } catch (err) {
      console.warn('Atlas auto-seed notice:', err);
    }
  }

  public getStatus(): DatabaseStatus {
    const local = this.readLocal();
    const uri = this.currentAtlasUri || local.atlasUri || '';
    const masked = uri ? uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:••••••••@') : undefined;

    return {
      mode: this.isMongoConnected ? 'atlas' : 'local_json',
      connected: this.isMongoConnected,
      databaseName: this.isMongoConnected ? 'portfolio' : 'local_json_db',
      message: this.isMongoConnected
        ? 'Connected to live MongoDB Atlas cluster'
        : 'Running on file-backed persistent store (Ready for Atlas URI)',
      atlasUriMasked: masked,
    };
  }

  // --- Profile ---
  public async getProfile(): Promise<PortfolioProfile> {
    if (this.isMongoConnected && this.mongoDb) {
      const p = await this.mongoDb.collection('profiles').findOne({ _id: 'main_profile' as any });
      if (p) {
        const { _id, ...rest } = p as any;
        return rest as PortfolioProfile;
      }
    }
    return this.readLocal().profile;
  }

  public async updateProfile(data: Partial<PortfolioProfile>): Promise<PortfolioProfile> {
    const local = this.readLocal();
    const updated = { ...local.profile, ...data };
    local.profile = updated;
    this.writeLocal(local);

    if (this.isMongoConnected && this.mongoDb) {
      await this.mongoDb.collection('profiles').updateOne(
        { _id: 'main_profile' as any },
        { $set: updated },
        { upsert: true }
      );
    }
    return updated;
  }

  // --- Projects ---
  public async getProjects(): Promise<ProjectItem[]> {
    if (this.isMongoConnected && this.mongoDb) {
      const items = await this.mongoDb.collection('projects').find().sort({ order: 1 }).toArray();
      if (items.length > 0) {
        return items.map((i: any) => ({ ...i, _id: i._id.toString() })) as ProjectItem[];
      }
    }
    return this.readLocal().projects.sort((a, b) => a.order - b.order);
  }

  public async createProject(data: Omit<ProjectItem, '_id'>): Promise<ProjectItem> {
    const newItem: ProjectItem = {
      ...data,
      _id: 'proj_' + Date.now(),
    };
    const local = this.readLocal();
    local.projects.push(newItem);
    this.writeLocal(local);

    if (this.isMongoConnected && this.mongoDb) {
      await this.mongoDb.collection('projects').insertOne(newItem as any);
    }
    return newItem;
  }

  public async updateProject(id: string, data: Partial<ProjectItem>): Promise<ProjectItem | null> {
    const local = this.readLocal();
    const index = local.projects.findIndex((p) => p._id === id);
    if (index === -1) return null;

    const updated = { ...local.projects[index], ...data };
    local.projects[index] = updated;
    this.writeLocal(local);

    if (this.isMongoConnected && this.mongoDb) {
      await this.mongoDb.collection('projects').updateOne({ _id: id as any }, { $set: data });
    }
    return updated;
  }

  public async deleteProject(id: string): Promise<boolean> {
    const local = this.readLocal();
    const initialLen = local.projects.length;
    local.projects = local.projects.filter((p) => p._id !== id);
    this.writeLocal(local);

    if (this.isMongoConnected && this.mongoDb) {
      await this.mongoDb.collection('projects').deleteOne({ _id: id as any });
    }
    return local.projects.length < initialLen;
  }

  // --- Experiences ---
  public async getExperiences(): Promise<ExperienceItem[]> {
    if (this.isMongoConnected && this.mongoDb) {
      const items = await this.mongoDb.collection('experiences').find().sort({ order: 1 }).toArray();
      if (items.length > 0) {
        return items.map((i: any) => ({ ...i, _id: i._id.toString() })) as ExperienceItem[];
      }
    }
    return this.readLocal().experiences.sort((a, b) => a.order - b.order);
  }

  public async createExperience(data: Omit<ExperienceItem, '_id'>): Promise<ExperienceItem> {
    const newItem: ExperienceItem = {
      ...data,
      _id: 'exp_' + Date.now(),
    };
    const local = this.readLocal();
    local.experiences.push(newItem);
    this.writeLocal(local);

    if (this.isMongoConnected && this.mongoDb) {
      await this.mongoDb.collection('experiences').insertOne(newItem as any);
    }
    return newItem;
  }

  public async updateExperience(id: string, data: Partial<ExperienceItem>): Promise<ExperienceItem | null> {
    const local = this.readLocal();
    const index = local.experiences.findIndex((e) => e._id === id);
    if (index === -1) return null;

    const updated = { ...local.experiences[index], ...data };
    local.experiences[index] = updated;
    this.writeLocal(local);

    if (this.isMongoConnected && this.mongoDb) {
      await this.mongoDb.collection('experiences').updateOne({ _id: id as any }, { $set: data });
    }
    return updated;
  }

  public async deleteExperience(id: string): Promise<boolean> {
    const local = this.readLocal();
    const initialLen = local.experiences.length;
    local.experiences = local.experiences.filter((e) => e._id !== id);
    this.writeLocal(local);

    if (this.isMongoConnected && this.mongoDb) {
      await this.mongoDb.collection('experiences').deleteOne({ _id: id as any });
    }
    return local.experiences.length < initialLen;
  }

  // --- Skills ---
  public async getSkills(): Promise<SkillItem[]> {
    if (this.isMongoConnected && this.mongoDb) {
      const items = await this.mongoDb.collection('skills').find().sort({ order: 1 }).toArray();
      if (items.length > 0) {
        return items.map((i: any) => ({ ...i, _id: i._id.toString() })) as SkillItem[];
      }
    }
    return this.readLocal().skills.sort((a, b) => a.order - b.order);
  }

  public async createSkill(data: Omit<SkillItem, '_id'>): Promise<SkillItem> {
    const newItem: SkillItem = {
      ...data,
      _id: 'sk_' + Date.now(),
    };
    const local = this.readLocal();
    local.skills.push(newItem);
    this.writeLocal(local);

    if (this.isMongoConnected && this.mongoDb) {
      await this.mongoDb.collection('skills').insertOne(newItem as any);
    }
    return newItem;
  }

  public async updateSkill(id: string, data: Partial<SkillItem>): Promise<SkillItem | null> {
    const local = this.readLocal();
    const index = local.skills.findIndex((s) => s._id === id);
    if (index === -1) return null;

    const updated = { ...local.skills[index], ...data };
    local.skills[index] = updated;
    this.writeLocal(local);

    if (this.isMongoConnected && this.mongoDb) {
      await this.mongoDb.collection('skills').updateOne({ _id: id as any }, { $set: data });
    }
    return updated;
  }

  public async deleteSkill(id: string): Promise<boolean> {
    const local = this.readLocal();
    const initialLen = local.skills.length;
    local.skills = local.skills.filter((s) => s._id !== id);
    this.writeLocal(local);

    if (this.isMongoConnected && this.mongoDb) {
      await this.mongoDb.collection('skills').deleteOne({ _id: id as any });
    }
    return local.skills.length < initialLen;
  }

  // --- Certifications ---
  public async getCertifications(): Promise<CertificationItem[]> {
    if (this.isMongoConnected && this.mongoDb) {
      const items = await this.mongoDb.collection('certifications').find().sort({ order: 1 }).toArray();
      if (items.length > 0) {
        return items.map((i: any) => ({ ...i, _id: i._id.toString() })) as CertificationItem[];
      }
    }
    return this.readLocal().certifications.sort((a, b) => a.order - b.order);
  }

  public async createCertification(data: Omit<CertificationItem, '_id'>): Promise<CertificationItem> {
    const newItem: CertificationItem = {
      ...data,
      _id: 'cert_' + Date.now(),
    };
    const local = this.readLocal();
    local.certifications.push(newItem);
    this.writeLocal(local);

    if (this.isMongoConnected && this.mongoDb) {
      await this.mongoDb.collection('certifications').insertOne(newItem as any);
    }
    return newItem;
  }

  public async updateCertification(id: string, data: Partial<CertificationItem>): Promise<CertificationItem | null> {
    const local = this.readLocal();
    const index = local.certifications.findIndex((c) => c._id === id);
    if (index === -1) return null;

    const updated = { ...local.certifications[index], ...data };
    local.certifications[index] = updated;
    this.writeLocal(local);

    if (this.isMongoConnected && this.mongoDb) {
      await this.mongoDb.collection('certifications').updateOne({ _id: id as any }, { $set: data });
    }
    return updated;
  }

  public async deleteCertification(id: string): Promise<boolean> {
    const local = this.readLocal();
    const initialLen = local.certifications.length;
    local.certifications = local.certifications.filter((c) => c._id !== id);
    this.writeLocal(local);

    if (this.isMongoConnected && this.mongoDb) {
      await this.mongoDb.collection('certifications').deleteOne({ _id: id as any });
    }
    return local.certifications.length < initialLen;
  }

  // --- Messages ---
  public async getMessages(): Promise<ContactMessage[]> {
    if (this.isMongoConnected && this.mongoDb) {
      const items = await this.mongoDb.collection('messages').find().sort({ createdAt: -1 }).toArray();
      return items.map((i: any) => ({ ...i, _id: i._id.toString() })) as ContactMessage[];
    }
    return this.readLocal().messages.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public async createMessage(data: Omit<ContactMessage, '_id' | 'createdAt' | 'read'>): Promise<ContactMessage> {
    const newItem: ContactMessage = {
      ...data,
      _id: 'msg_' + Date.now(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    const local = this.readLocal();
    local.messages.unshift(newItem);
    this.writeLocal(local);

    if (this.isMongoConnected && this.mongoDb) {
      await this.mongoDb.collection('messages').insertOne(newItem as any);
    }
    return newItem;
  }

  public async markMessageRead(id: string, read: boolean): Promise<ContactMessage | null> {
    const local = this.readLocal();
    const index = local.messages.findIndex((m) => m._id === id);
    if (index === -1) return null;

    local.messages[index].read = read;
    this.writeLocal(local);

    if (this.isMongoConnected && this.mongoDb) {
      await this.mongoDb.collection('messages').updateOne({ _id: id as any }, { $set: { read } });
    }
    return local.messages[index];
  }

  public async deleteMessage(id: string): Promise<boolean> {
    const local = this.readLocal();
    const initialLen = local.messages.length;
    local.messages = local.messages.filter((m) => m._id !== id);
    this.writeLocal(local);

    if (this.isMongoConnected && this.mongoDb) {
      await this.mongoDb.collection('messages').deleteOne({ _id: id as any });
    }
    return local.messages.length < initialLen;
  }

  // --- Aggregate All Portfolio Data ---
  public async getFullPortfolio(): Promise<PortfolioData> {
    const [profile, projects, experiences, skills, certifications] = await Promise.all([
      this.getProfile(),
      this.getProjects(),
      this.getExperiences(),
      this.getSkills(),
      this.getCertifications(),
    ]);

    return {
      profile,
      projects,
      experiences,
      skills,
      certifications,
    };
  }
}

export const db = new PortfolioDatabase();
