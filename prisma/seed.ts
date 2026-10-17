import { PrismaClient, CandidateStage } from "@prisma/client";

const prisma = new PrismaClient();

const candidatesData: Array<{
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: number;
  rating?: number;
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
    rating: 5,
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
    rating: 5,
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
    rating: 4,
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
    rating: 4,
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
    rating: 3,
    resumeUrl: "https://example.com/resumes/devon-brooks.pdf",
    stage: CandidateStage.APPLIED,
    notes: "Experience with PostgreSQL, Prisma, Redis, and message queues.",
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+1 (555) 789-0123",
    position: "Engineering Manager",
    experience: 10,
    rating: 5,
    resumeUrl: "https://example.com/resumes/priya-sharma.pdf",
    stage: CandidateStage.INTERVIEW,
    notes: "Managed team of 14 engineers. High retention rate and agile leadership experience.",
  },
  {
    name: "Lucas Bennett",
    email: "lucas.bennett@example.com",
    phone: "+1 (555) 890-1234",
    position: "Security Engineer",
    experience: 4,
    rating: 4,
    resumeUrl: "https://example.com/resumes/lucas-bennett.pdf",
    stage: CandidateStage.OFFER,
    notes: "OSCP certified. Conducted penetration tests and SOC2 compliance audits.",
  },
  {
    name: "Aisha Morales",
    email: "aisha.morales@example.com",
    phone: "+1 (555) 901-2345",
    position: "Mobile Engineer (React Native)",
    experience: 3,
    rating: 2,
    resumeUrl: "https://example.com/resumes/aisha-morales.pdf",
    stage: CandidateStage.REJECTED,
    notes: "Did not meet senior iOS/Android native bridge requirements for current opening.",
  },
  {
    name: "Tariq Al-Mansoor",
    email: "tariq.almansoor@example.com",
    phone: "+1 (555) 012-3456",
    position: "Data Scientist / ML Engineer",
    experience: 5,
    rating: 4,
    resumeUrl: "https://example.com/resumes/tariq-almansoor.pdf",
    stage: CandidateStage.SCREENING,
    notes: "Strong PyTorch and transformer model fine-tuning background.",
  },
  {
    name: "Chloe Dubois",
    email: "chloe.dubois@example.com",
    phone: "+1 (555) 123-4560",
    position: "QA Automation Lead",
    experience: 6,
    rating: 3,
    resumeUrl: "https://example.com/resumes/chloe-dubois.pdf",
    stage: CandidateStage.APPLIED,
    notes: "Built Cypress and Playwright end-to-end CI/CD test automation pipelines.",
  },
  {
    name: "Kenji Takahashi",
    email: "kenji.takahashi@example.com",
    phone: "+1 (555) 234-5670",
    position: "Technical Product Manager",
    experience: 8,
    rating: 1,
    resumeUrl: "https://example.com/resumes/kenji-takahashi.pdf",
    stage: CandidateStage.REJECTED,
    notes: "Withdrew candidacy due to conflicting relocation timeline.",
  },
  {
    name: "Gabriel Santos",
    email: "gabriel.santos@example.com",
    phone: "+1 (555) 345-6780",
    position: "Site Reliability Engineer",
    experience: 4,
    rating: 5,
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

  console.log(`✅ Successfully seeded ${candidatesData.length} realistic candidates across all 6 stages with scorecards.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
