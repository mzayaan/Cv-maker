// Central schema-driven definition of every CV template.
// Adding a new template = adding one entry here. No new components required
// for the common case; the builder + preview render any schema generically.

export type FieldType = "text" | "textarea" | "date" | "list" | "tags";

export interface TemplateField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  guidance?: string;
  required?: boolean;
}

export interface TemplateSection {
  key: string;
  title: string;
  guidance: string;
  repeatable?: boolean; // e.g. multiple jobs, multiple degrees
  fields: TemplateField[];
}

export type TemplateCategory =
  | "Tech & Engineering"
  | "Academic & Research"
  | "Business & Finance"
  | "Creative & Design"
  | "Healthcare"
  | "Trades & Vocational"
  | "Student & Entry-Level"
  | "Executive & Leadership";

export interface CvTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  accentColor: string; // tailwind class fragment, e.g. "blue"
  sections: TemplateSection[];
}

const contactSection: TemplateSection = {
  key: "contact",
  title: "Contact Details",
  guidance: "Keep it short: name, one email, one phone number, city, and links (LinkedIn/portfolio/GitHub) relevant to this field.",
  fields: [
    { key: "fullName", label: "Full name", type: "text", required: true },
    { key: "email", label: "Email", type: "text", required: true },
    { key: "phone", label: "Phone", type: "text" },
    { key: "location", label: "City, Country", type: "text" },
    { key: "links", label: "Links (LinkedIn, portfolio, GitHub)", type: "tags" },
  ],
};

const summarySection = (guidance: string): TemplateSection => ({
  key: "summary",
  title: "Professional Summary",
  guidance,
  fields: [{ key: "summary", label: "Summary", type: "textarea", placeholder: "2-3 sentences on who you are and what you're aiming for." }],
});

const experienceSection = (guidance: string): TemplateSection => ({
  key: "experience",
  title: "Experience",
  guidance,
  repeatable: true,
  fields: [
    { key: "role", label: "Role / Title", type: "text", required: true },
    { key: "org", label: "Organization", type: "text", required: true },
    { key: "dates", label: "Dates", type: "text", placeholder: "Jun 2023 – Present" },
    { key: "bullets", label: "Achievements (one per line)", type: "list", guidance: "Lead with an action verb and a measurable outcome where possible." },
  ],
});

const educationSection: TemplateSection = {
  key: "education",
  title: "Education",
  guidance: "List most recent first. Include GPA only if it's strong or asked for.",
  repeatable: true,
  fields: [
    { key: "institution", label: "Institution", type: "text", required: true },
    { key: "qualification", label: "Qualification / Degree", type: "text", required: true },
    { key: "dates", label: "Dates", type: "text" },
    { key: "details", label: "Relevant details", type: "textarea" },
  ],
};

const skillsSection = (guidance: string): TemplateSection => ({
  key: "skills",
  title: "Skills",
  guidance,
  fields: [{ key: "skills", label: "Skills (comma separated)", type: "tags" }],
});

function buildTemplate(
  id: string,
  name: string,
  category: TemplateCategory,
  description: string,
  accentColor: string,
  extraSections: TemplateSection[]
): CvTemplate {
  return {
    id,
    name,
    category,
    description,
    accentColor,
    sections: [contactSection, ...extraSections],
  };
}

export const TEMPLATES: CvTemplate[] = [
  // ---- Tech & Engineering ----
  buildTemplate("swe-standard", "Software Engineer", "Tech & Engineering",
    "Clean, ATS-friendly layout emphasizing projects and stack.", "blue", [
      summarySection("Mention your specialty (e.g. backend, mobile) and years of experience."),
      experienceSection("Quantify impact: latency reduced, users served, requests handled."),
      { key: "projects", title: "Projects", guidance: "Include a link to code/demo for each project.", repeatable: true,
        fields: [
          { key: "name", label: "Project name", type: "text", required: true },
          { key: "link", label: "Link (GitHub/demo)", type: "text" },
          { key: "description", label: "What it does & your role", type: "textarea" },
        ] },
      educationSection,
      skillsSection("List languages, frameworks, and tools. Group by category if you have many."),
    ]),
  buildTemplate("swe-internship", "Software Engineering Internship", "Tech & Engineering",
    "For students applying to their first tech internship.", "blue", [
      summarySection("One line on what you're studying and what kind of internship you want."),
      { key: "projects", title: "Course & Personal Projects", guidance: "Internship CVs lean on projects since work history is thin.", repeatable: true,
        fields: [
          { key: "name", label: "Project name", type: "text", required: true },
          { key: "link", label: "Link", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
        ] },
      educationSection,
      skillsSection("Languages and tools you've used in coursework or projects."),
      experienceSection("Part-time jobs count too — highlight transferable skills like teamwork."),
    ]),
  buildTemplate("data-scientist", "Data Scientist / ML", "Tech & Engineering",
    "Highlights models shipped, datasets, and measurable impact.", "indigo", [
      summarySection("State your specialty: ML, analytics, data engineering."),
      experienceSection("Quantify model performance, business impact, or scale of data."),
      educationSection,
      skillsSection("Languages, ML frameworks, cloud platforms, tools."),
      { key: "publications", title: "Publications / Kaggle / Portfolio", guidance: "Optional but valuable.", repeatable: true,
        fields: [{ key: "title", label: "Title", type: "text" }, { key: "link", label: "Link", type: "text" }] },
    ]),
  buildTemplate("devops-sre", "DevOps / SRE", "Tech & Engineering",
    "Focused on infrastructure, reliability, and automation wins.", "sky", [
      summarySection("Mention core infra you specialize in (cloud, k8s, CI/CD)."),
      experienceSection("Cite uptime, deployment frequency, incidents reduced."),
      educationSection,
      skillsSection("Cloud platforms, IaC tools, CI/CD, monitoring stack."),
    ]),
  buildTemplate("product-manager", "Product Manager", "Tech & Engineering",
    "Emphasizes outcomes, not just features shipped.", "cyan", [
      summarySection("Domain focus and the kind of products you build."),
      experienceSection("Frame bullets as outcome (metric moved) not just launched-feature."),
      educationSection,
      skillsSection("Tools (Jira, Figma, analytics) and methodologies (Agile, etc.)."),
    ]),

  // ---- Academic & Research ----
  buildTemplate("phd-application", "PhD / Graduate Application", "Academic & Research",
    "Structured for admissions committees: research first.", "purple", [
      summarySection("Your research interests and the question you want to pursue."),
      { key: "research", title: "Research Experience", guidance: "Describe methods, your specific contribution, and outcomes.", repeatable: true,
        fields: [
          { key: "title", label: "Project / Lab", type: "text", required: true },
          { key: "supervisor", label: "Supervisor", type: "text" },
          { key: "dates", label: "Dates", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
        ] },
      { key: "publications", title: "Publications", guidance: "Use standard citation format, most recent first.", repeatable: true,
        fields: [{ key: "citation", label: "Citation", type: "textarea" }] },
      educationSection,
      { key: "grants", title: "Grants & Awards", guidance: "Include funding body and amount if notable.", repeatable: true,
        fields: [{ key: "name", label: "Award / Grant", type: "text" }, { key: "year", label: "Year", type: "text" }] },
    ]),
  buildTemplate("academic-cv", "Academic CV (Faculty)", "Academic & Research",
    "Comprehensive long-form CV for academic positions.", "violet", [
      summarySection("Research area and academic focus."),
      { key: "appointments", title: "Academic Appointments", guidance: "Most recent first.", repeatable: true,
        fields: [{ key: "role", label: "Title", type: "text" }, { key: "institution", label: "Institution", type: "text" }, { key: "dates", label: "Dates", type: "text" }] },
      { key: "publications", title: "Publications", guidance: "Group by peer-reviewed / conference / other if the list is long.", repeatable: true,
        fields: [{ key: "citation", label: "Citation", type: "textarea" }] },
      { key: "teaching", title: "Teaching Experience", guidance: "Courses taught, level, and role.", repeatable: true,
        fields: [{ key: "course", label: "Course", type: "text" }, { key: "role", label: "Role", type: "text" }, { key: "dates", label: "Dates", type: "text" }] },
      educationSection,
      { key: "grants", title: "Grants & Funding", guidance: "Funding body, amount, role (PI/co-PI).", repeatable: true,
        fields: [{ key: "name", label: "Grant", type: "text" }, { key: "amount", label: "Amount", type: "text" }] },
    ]),
  buildTemplate("masters-application", "Master's Application", "Academic & Research",
    "For students applying to a taught or research Master's program.", "fuchsia", [
      summarySection("Why this program and how it connects to your background."),
      educationSection,
      experienceSection("Relevant internships, research assistantships, or jobs."),
      { key: "research", title: "Relevant Projects / Coursework", guidance: "Highlight anything connected to your intended field.", repeatable: true,
        fields: [{ key: "title", label: "Title", type: "text" }, { key: "description", label: "Description", type: "textarea" }] },
      skillsSection("Technical or research skills relevant to the program."),
    ]),
  buildTemplate("conference-researcher", "Conference / Research Fellow", "Academic & Research",
    "For fellowship and conference-speaker applications.", "purple", [
      summarySection("Your research niche in one or two sentences."),
      { key: "publications", title: "Publications & Talks", guidance: "Include conference name and year.", repeatable: true,
        fields: [{ key: "citation", label: "Citation / Talk title", type: "textarea" }] },
      educationSection,
      { key: "grants", title: "Fellowships & Grants", repeatable: true, guidance: "List funding source and duration.",
        fields: [{ key: "name", label: "Name", type: "text" }, { key: "year", label: "Year", type: "text" }] },
    ]),

  // ---- Business & Finance ----
  buildTemplate("finance-analyst", "Finance / Investment Analyst", "Business & Finance",
    "Numbers-forward layout for finance roles.", "emerald", [
      summarySection("Sector focus (equities, credit, corporate finance) and years of experience."),
      experienceSection("Lead with dollar figures, percentages, and deal sizes."),
      educationSection,
      { key: "certifications", title: "Certifications", guidance: "CFA level, Series licenses, etc.", repeatable: true,
        fields: [{ key: "name", label: "Certification", type: "text" }, { key: "status", label: "Status/Year", type: "text" }] },
      skillsSection("Modeling, valuation, tools (Excel, Bloomberg, SQL)."),
    ]),
  buildTemplate("accounting", "Accounting / Audit", "Business & Finance",
    "Structured for accounting and audit positions.", "green", [
      summarySection("Specialization (tax, audit, AP/AR) and qualification status."),
      experienceSection("Mention audit scope, compliance frameworks, or accounts managed."),
      educationSection,
      { key: "certifications", title: "Certifications", guidance: "CPA, ACCA, CA, etc. and status.", repeatable: true,
        fields: [{ key: "name", label: "Certification", type: "text" }, { key: "status", label: "Status/Year", type: "text" }] },
    ]),
  buildTemplate("consulting", "Management Consulting", "Business & Finance",
    "Impact-driven bullets, case-style structure.", "teal", [
      summarySection("Industries and problem types you focus on."),
      experienceSection("Structure bullets as: situation → action → quantified result."),
      educationSection,
      skillsSection("Frameworks, tools, languages."),
    ]),
  buildTemplate("sales-marketing", "Sales / Marketing", "Business & Finance",
    "Results and pipeline/revenue-oriented format.", "amber", [
      summarySection("Your market and the kind of growth you drive."),
      experienceSection("Quote quota attainment, pipeline generated, campaign ROI."),
      educationSection,
      skillsSection("CRM tools, channels, methodologies."),
    ]),

  // ---- Creative & Design ----
  buildTemplate("ux-ui-designer", "UX / UI Designer", "Creative & Design",
    "Portfolio-first layout for design roles.", "pink", [
      summarySection("Design focus (product, brand, motion) and process philosophy in one line."),
      { key: "portfolio", title: "Portfolio Highlights", guidance: "Link each case study; briefly note the problem and outcome.", repeatable: true,
        fields: [{ key: "project", label: "Project", type: "text" }, { key: "link", label: "Link", type: "text" }, { key: "description", label: "Description", type: "textarea" }] },
      experienceSection("Mention the product area and team size you worked within."),
      educationSection,
      skillsSection("Tools (Figma, Adobe CC) and design methods."),
    ]),
  buildTemplate("graphic-designer", "Graphic Designer", "Creative & Design",
    "Visual-forward CV emphasizing published work.", "rose", [
      summarySection("Your design specialty and style in one line."),
      { key: "portfolio", title: "Selected Work", repeatable: true, guidance: "Link to each piece; note client and medium.",
        fields: [{ key: "project", label: "Project / Client", type: "text" }, { key: "link", label: "Link", type: "text" } ] },
      experienceSection("Note whether freelance, agency, or in-house."),
      educationSection,
      skillsSection("Software and techniques."),
    ]),
  buildTemplate("writer-content", "Writer / Content Creator", "Creative & Design",
    "Publication-led format for writers and content roles.", "orange", [
      summarySection("Your beat/niche and tone."),
      { key: "publications", title: "Published Work", repeatable: true, guidance: "Link to bylines, most recent first.",
        fields: [{ key: "title", label: "Title", type: "text" }, { key: "outlet", label: "Outlet", type: "text" }, { key: "link", label: "Link", type: "text" }] },
      experienceSection("Note publication cadence or audience size if relevant."),
      educationSection,
    ]),
  buildTemplate("photographer-videographer", "Photographer / Videographer", "Creative & Design",
    "Visual portfolio-led CV.", "red", [
      summarySection("Your genre (portrait, event, commercial, film)."),
      { key: "portfolio", title: "Portfolio", repeatable: true, guidance: "Link to reels/galleries.",
        fields: [{ key: "title", label: "Title", type: "text" }, { key: "link", label: "Link", type: "text" }] },
      experienceSection("Note notable clients or publications."),
      skillsSection("Equipment and editing software."),
    ]),

  // ---- Healthcare ----
  buildTemplate("nursing", "Nursing", "Healthcare",
    "Emphasizes licensure, clinical hours, and specializations.", "cyan", [
      summarySection("Specialty area and years of clinical experience."),
      { key: "licenses", title: "Licenses & Certifications", guidance: "Include license number status (active), and expiry if relevant.", repeatable: true,
        fields: [{ key: "name", label: "License/Cert", type: "text", required: true }, { key: "status", label: "Status/Expiry", type: "text" }] },
      experienceSection("Note patient ratios, unit type, and any specialized procedures."),
      educationSection,
      skillsSection("Clinical skills, equipment, EHR systems."),
    ]),
  buildTemplate("medical-doctor", "Medical Doctor / Physician", "Healthcare",
    "Structured for residency and clinical practice applications.", "blue", [
      summarySection("Specialty and stage (resident, attending, fellow)."),
      { key: "licenses", title: "Licenses & Board Certifications", repeatable: true, guidance: "Include board and status.",
        fields: [{ key: "name", label: "License/Board Cert", type: "text" }, { key: "status", label: "Status", type: "text" }] },
      experienceSection("Clinical rotations, procedures performed, patient volume."),
      educationSection,
      { key: "publications", title: "Publications & Research", guidance: "Optional, standard citation format.", repeatable: true,
        fields: [{ key: "citation", label: "Citation", type: "textarea" }] },
    ]),
  buildTemplate("allied-health", "Allied Health (PT/OT/Pharmacy etc.)", "Healthcare",
    "For physiotherapists, pharmacists, and other allied health roles.", "teal", [
      summarySection("Your discipline and area of focus."),
      { key: "licenses", title: "Licenses & Certifications", repeatable: true, guidance: "Registration body and status.",
        fields: [{ key: "name", label: "License/Cert", type: "text" }, { key: "status", label: "Status", type: "text" }] },
      experienceSection("Clinical settings and caseload."),
      educationSection,
      skillsSection("Clinical techniques, equipment, software."),
    ]),

  // ---- Trades & Vocational ----
  buildTemplate("electrician-trades", "Electrician / Trades", "Trades & Vocational",
    "Certification and safety-record focused.", "yellow", [
      summarySection("Trade specialty and years of experience."),
      { key: "certifications", title: "Certifications & Licenses", repeatable: true, guidance: "Include issuing body and expiry.",
        fields: [{ key: "name", label: "Certification", type: "text", required: true }, { key: "status", label: "Status/Expiry", type: "text" }] },
      experienceSection("Mention job types, scale of projects, safety record."),
      { key: "apprenticeship", title: "Apprenticeship", guidance: "Program, employer, and completion date.",
        fields: [{ key: "program", label: "Program", type: "text" }, { key: "employer", label: "Employer", type: "text" }, { key: "dates", label: "Dates", type: "text" }] },
      skillsSection("Tools, systems, safety certifications."),
    ]),
  buildTemplate("construction-trades", "Construction / Site Trades", "Trades & Vocational",
    "For construction, carpentry, and site-based trades.", "orange", [
      summarySection("Trade and typical project types."),
      { key: "certifications", title: "Certifications", repeatable: true, guidance: "Safety cards, equipment licenses.",
        fields: [{ key: "name", label: "Certification", type: "text" }, { key: "status", label: "Status", type: "text" }] },
      experienceSection("Note project scale and any supervisory responsibility."),
      skillsSection("Equipment operated, trade skills."),
    ]),
  buildTemplate("automotive-tech", "Automotive Technician", "Trades & Vocational",
    "For mechanics and automotive technicians.", "slate", [
      summarySection("Specialization (diagnostics, EV, heavy vehicle, etc.)."),
      { key: "certifications", title: "Certifications", repeatable: true, guidance: "Manufacturer or ASE-style certifications.",
        fields: [{ key: "name", label: "Certification", type: "text" }, { key: "status", label: "Status", type: "text" }] },
      experienceSection("Note vehicle types and diagnostic tools used."),
      skillsSection("Diagnostic equipment, systems."),
    ]),
  buildTemplate("culinary-hospitality", "Culinary / Hospitality", "Trades & Vocational",
    "For chefs, hospitality, and food service roles.", "amber", [
      summarySection("Cuisine focus or hospitality specialty."),
      { key: "certifications", title: "Certifications", repeatable: true, guidance: "Food safety, bartending, etc.",
        fields: [{ key: "name", label: "Certification", type: "text" }, { key: "status", label: "Status", type: "text" }] },
      experienceSection("Kitchen/venue type, covers served, menu contributions."),
      skillsSection("Cuisines, equipment, service style."),
    ]),

  // ---- Student & Entry-Level ----
  buildTemplate("no-experience-student", "First CV — No Work Experience", "Student & Entry-Level",
    "Built for students with no formal work history yet.", "lime", [
      summarySection("What you're studying and what kind of opportunity you're seeking."),
      educationSection,
      { key: "extracurricular", title: "Extracurriculars & Volunteering", guidance: "This is your main proof of skills — treat it like work experience.", repeatable: true,
        fields: [{ key: "activity", label: "Activity / Organization", type: "text", required: true }, { key: "dates", label: "Dates", type: "text" }, { key: "description", label: "What you did", type: "textarea" }] },
      { key: "coursework", title: "Relevant Coursework", guidance: "List courses relevant to the role you're applying for.",
        fields: [{ key: "coursework", label: "Courses", type: "tags" }] },
      skillsSection("Include soft skills backed by an example if possible."),
    ]),
  buildTemplate("highschool-college-app", "High School / College Application", "Student & Entry-Level",
    "For college/university admissions rather than jobs.", "green", [
      summarySection("What you're passionate about and hoping to study."),
      educationSection,
      { key: "activities", title: "Activities & Achievements", guidance: "Clubs, sports, competitions, leadership roles.", repeatable: true,
        fields: [{ key: "activity", label: "Activity", type: "text" }, { key: "description", label: "Description", type: "textarea" }] },
      { key: "awards", title: "Awards & Honors", repeatable: true, guidance: "Academic and extracurricular.",
        fields: [{ key: "name", label: "Award", type: "text" }, { key: "year", label: "Year", type: "text" }] },
    ]),
  buildTemplate("part-time-retail", "Part-Time / Retail / Hospitality", "Student & Entry-Level",
    "Simple one-page format for casual and part-time roles.", "sky", [
      summarySection("Availability and the kind of role you want."),
      experienceSection("Even short stints count — mention responsibilities and reliability."),
      educationSection,
      skillsSection("Customer service, POS systems, teamwork."),
    ]),
  buildTemplate("career-change", "Career Change / Returning to Work", "Student & Entry-Level",
    "Skills-based format for career switchers and returners.", "violet", [
      summarySection("Explain the pivot in one line — what you're moving toward and why."),
      skillsSection("Lead with transferable skills before listing past roles."),
      experienceSection("Frame past roles around transferable achievements, not just duties."),
      educationSection,
      { key: "training", title: "Recent Training / Courses", guidance: "Show you've actively prepared for the new direction.", repeatable: true,
        fields: [{ key: "name", label: "Course", type: "text" }, { key: "provider", label: "Provider", type: "text" }, { key: "year", label: "Year", type: "text" }] },
    ]),

  // ---- Executive & Leadership ----
  buildTemplate("executive-leadership", "Executive / C-Suite", "Executive & Leadership",
    "Strategic, board-level achievements over daily duties.", "stone", [
      summarySection("Your leadership mandate and the scale you operate at (team size, budget, revenue)."),
      experienceSection("Frame around strategic outcomes: growth, transformation, P&L results."),
      { key: "boards", title: "Board & Advisory Roles", repeatable: true, guidance: "Organization and role.",
        fields: [{ key: "org", label: "Organization", type: "text" }, { key: "role", label: "Role", type: "text" }] },
      educationSection,
    ]),
  buildTemplate("project-program-manager", "Project / Program Manager", "Executive & Leadership",
    "Delivery-focused: scope, budget, timeline, stakeholders.", "zinc", [
      summarySection("Domain and typical program size you manage."),
      experienceSection("Cite budget size, team size, on-time/on-budget delivery rate."),
      { key: "certifications", title: "Certifications", repeatable: true, guidance: "PMP, PRINCE2, Agile/Scrum, etc.",
        fields: [{ key: "name", label: "Certification", type: "text" }, { key: "status", label: "Status/Year", type: "text" }] },
      educationSection,
    ]),
  buildTemplate("hr-people-leader", "HR / People Leadership", "Executive & Leadership",
    "For HR managers, People/Talent leadership roles.", "neutral", [
      summarySection("HR focus area (talent, culture, ops) and org size you've supported."),
      experienceSection("Cite headcount supported, retention improvements, programs launched."),
      educationSection,
      { key: "certifications", title: "Certifications", repeatable: true, guidance: "SHRM, CIPD, etc.",
        fields: [{ key: "name", label: "Certification", type: "text" }, { key: "status", label: "Status/Year", type: "text" }] },
    ]),
  buildTemplate("operations-leader", "Operations Leadership", "Executive & Leadership",
    "Efficiency and scale-oriented operations CV.", "gray", [
      summarySection("Function (supply chain, ops, logistics) and scale you've run."),
      experienceSection("Cite cost savings, throughput, efficiency gains."),
      educationSection,
      skillsSection("Systems, methodologies (Lean, Six Sigma)."),
    ]),
];

export const CATEGORIES: TemplateCategory[] = [
  "Tech & Engineering",
  "Academic & Research",
  "Business & Finance",
  "Creative & Design",
  "Healthcare",
  "Trades & Vocational",
  "Student & Entry-Level",
  "Executive & Leadership",
];

export function getTemplate(id: string): CvTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
