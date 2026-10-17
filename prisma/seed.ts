import { PrismaClient, CandidateStage } from "@prisma/client";

const prisma = new PrismaClient();

const candidatesData: Array<{
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: number;
  resumeUrl: string;
  stage: CandidateStage;
  notes: string;
}> = [
  {
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 234-5678",
    position: "Senior Full Stack Engineer",
    experience: 6,
    resumeUrl: "https://example.com/resumes/alex-rivera.pdf",
    stage: CandidateStage.INTERVIEW,
    notes: "Strong system design background. Built high-throughput distributed APIs.",
  },
  {
    name: "Samantha Chen",
    email: "samantha.chen@example.com",
    phone: "+1 (555) 345-6789",
    position: "Product Designer (UI/UX)",
    experience: 4,
    resumeUrl: "https://example.com/portfolios/samantha-chen",
    stage: CandidateStage.OFFER,
    notes: "Exceptional portfolio in design systems and accessibility (WCAG 2.1 AA).",
  },
  {
    name: "Marcus Vance",
    email: "marcus.vance@example.com",
    phone: "+1 (555) 456-7890",
    position: "DevOps / Platform Engineer",
    experience: 7,
    resumeUrl: "https://example.com/resumes/marcus-vance.pdf",
    stage: CandidateStage.HIRED,
    notes: "Accepted offer. Extensive Kubernetes, Terraform, and AWS experience.",
  },
  {
    name: "Elena Rostova",
    email: "elena.rostova@example.com",
    phone: "+1 (555) 567-8901",
    position: "Frontend React Engineer",
    experience: 3,
    resumeUrl: "https://example.com/resumes/elena-rostova.pdf",
    stage: CandidateStage.SCREENING,
    notes: "Proficient in Next.js, TypeScript, Tailwind, and React Server Components.",
  },
  {
    name: "Devon Brooks",
    email: "devon.brooks@example.com",
    phone: "+1 (555) 678-9012",
    position: "Backend Node.js Engineer",
    experience: 5,
    resumeUrl: "https://example.com/resumes/devon-brooks.pdf",
    stage: CandidateStage.APPLIED,
    notes: "Applied via career page. Strong PostgreSQL and Redis caching experience.",
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+1 (555) 789-0123",
    position: "Engineering Manager",
    experience: 10,
    resumeUrl: "https://example.com/resumes/priya-sharma.pdf",
    stage: CandidateStage.INTERVIEW,
    notes: "Scaled team from 4 to 28 engineers. Culture fit interview scheduled.",
  },
  {
    name: "Lucas Moreira",
    email: "lucas.moreira@example.com",
    phone: "+1 (555) 890-1234",
    position: "QA Automation Engineer",
    experience: 4,
    resumeUrl: "https://example.com/resumes/lucas-moreira.pdf",
    stage: CandidateStage.REJECTED,
    notes: "Lacked required Cypress and Playwright automated end-to-end testing stack.",
  },
  {
    name: "Chloe Dupont",
    email: "chloe.dupont@example.com",
    phone: "+1 (555) 901-2345",
    position: "Senior Full Stack Engineer",
    experience: 8,
    resumeUrl: "https://example.com/resumes/chloe-dupont.pdf",
    stage: CandidateStage.OFFER,
    notes: "Offer extended. Compensation package under review by candidate.",
  },
  {
    name: "Tariq Al-Mansoor",
    email: "tariq.mansoor@example.com",
    phone: "+1 (555) 012-3456",
    position: "Data Engineer",
    experience: 5,
    resumeUrl: "https://example.com/resumes/tariq-mansoor.pdf",
    stage: CandidateStage.SCREENING,
    notes: "Experience with DBT, Snowflake, and Apache Kafka pipelines.",
  },
  {
    name: "Hannah Kim",
    email: "hannah.kim@example.com",
    phone: "+1 (555) 123-7890",
    position: "Product Manager",
    experience: 6,
    resumeUrl: "https://example.com/resumes/hannah-kim.pdf",
    stage: CandidateStage.APPLIED,
    notes: "Led B2B SaaS analytics products. Excellent analytical background.",
  },
  {
    name: "Jordan Taylor",
    email: "jordan.taylor@example.com",
    phone: "+1 (555) 234-8901",
    position: "Frontend React Engineer",
    experience: 2,
    resumeUrl: "https://example.com/resumes/jordan-taylor.pdf",
    stage: CandidateStage.APPLIED,
    notes: "Junior developer portfolio with solid responsive projects and clean code.",
  },
  {
    name: "Gabriel Santos",
    email: "gabriel.santos@example.com",
    phone: "+1 (555) 345-9012",
    position: "Backend Node.js Engineer",
    experience: 4,
    resumeUrl: "https://example.com/resumes/gabriel-santos.pdf",
    stage: CandidateStage.HIRED,
    notes: "Onboarded this week. Assigned to Core Services pod.",
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  await prisma.candidate.deleteMany();
  console.log("🧹 Cleaned existing candidate records.");

  for (const candidate of candidatesData) {
    await prisma.candidate.create({
      data: candidate,
    });
  }

  console.log(`✅ Successfully seeded ${candidatesData.length} realistic candidates across all 6 stages.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
