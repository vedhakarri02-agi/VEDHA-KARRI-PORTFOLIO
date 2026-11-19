import type {
  Certification,
  Education,
  Experience,
  Portfolio,
  Profile,
  Project,
  SectionSetting,
  Skill,
} from './types';

// Veda Sri Karri's starter content — B.Sc. (Hons) Agriculture.
// Used for:
//   1. The admin's "Load starter content" button copies it into the empty database.
//   2. The public site falls back to it when the database isn't configured or can't be reached.
// After loading, everything is edited from /admin — this file is never the live source.

export const DEFAULT_SECTIONS: SectionSetting[] = [
  { key: 'about', visible: true, title: 'About & Vision', intro: 'Cultivating sustainable agricultural solutions through science and field practice.' },
  { key: 'experience', visible: true, title: 'Fieldwork & Practical Experience', intro: 'Hands-on training across agronomic trials, soil laboratories, and rural agricultural ecosystems.' },
  { key: 'projects', visible: true, title: 'Agronomic Research & Projects', intro: 'Applied field studies, soil health diagnostics, and precision farming initiatives.' },
  { key: 'skills', visible: true, title: 'Agricultural Competencies & Tools', intro: 'Core proficiencies across soil science, crop management, farm surveying, and agrotechnology.' },
  { key: 'certifications', visible: true, title: 'Credentials & Certifications', intro: 'Recognitions from the FAO and NPTEL in natural resources and agribusiness.' },
  { key: 'education', visible: true, title: 'Academic Background', intro: 'Formal education in agricultural sciences and natural science foundations.' },
  { key: 'leadership', visible: true, title: 'Leadership & Extracurriculars', intro: 'Student engagement, rural agricultural outreach, and community teamwork.' },
  { key: 'contact', visible: true, title: 'Connect with Veda', intro: 'Open to agricultural research collaborations, internships, and agritech opportunities.' },
];

const profile: Profile = {
  id: 1,
  full_name: 'Veda Sri Karri',
  headline: 'B.Sc. (Hons) Agriculture Scholar · Sustainable Agronomy & Natural Resource Management',
  tagline: 'Bridging modern farming science, soil health diagnostics, and sustainable agroecosystems.',
  about: [
    'I am an enthusiastic B.Sc. (Hons.) Agriculture student at Centurion University of Technology and Management, Paralakhemundi, dedicated to advancing sustainable agricultural productivity through modern agronomic science and field-tested practices.',
    'My academic training and hands-on laboratory work encompass comprehensive soil health testing, balanced nutrient management, crop cultivation methodologies, seed technology, and watershed stewardship. I actively explore the integration of GIS and remote sensing tools to improve precision agronomy and optimize natural resource management.',
    'Certified by the FAO in Agroforestry for Sustainable Agrifood Transformation and by NPTEL in Natural Resources Management (Elite), I am passionate about connecting lab research with grassroots farming resilience. I welcome opportunities in agricultural research, agronomy internships, and agribusiness development.',
  ].join('\n\n'),
  location: 'Palasa, Andhra Pradesh, India',
  email: 'vedhakarri25@gmail.com',
  phone: '+91 79817 58431',
  show_phone: true,
  linkedin_url: 'https://www.linkedin.com/in/vedha-karri',
  github_url: '',
  avatar_url: '',
  resume_url: '',
  open_to_work: true,
  seo_title: 'Veda Sri Karri — B.Sc. (Hons) Agriculture Portfolio',
  seo_description:
    'Portfolio of Veda Sri Karri, B.Sc. (Hons) Agriculture scholar at Centurion University. Specialized in soil health testing, sustainable crop management, natural resource conservation, and agroforestry.',
};

function experience(
  index: number,
  item: Omit<Experience, 'id' | 'sort_order' | 'is_visible' | 'org_url' | 'logo_url'> &
    Partial<Pick<Experience, 'org_url' | 'logo_url'>>,
): Experience {
  return { id: `starter-exp-${index}`, sort_order: index * 10, is_visible: true, org_url: '', logo_url: '', ...item };
}

const experiences: Experience[] = [
  experience(1, {
    kind: 'internship',
    role: 'Agricultural Field Intern & Soil Analyst',
    organization: 'Agronomy Field Research Station & Soil Testing Lab',
    location: 'Paralakhemundi, Odisha',
    mode: 'On-site',
    start_date: '2025-06-01',
    end_date: '2025-08-31',
    bullets: [
      'Collected and analyzed 120+ composite soil samples across experimental plots, conducting pH, Electrical Conductivity (EC), and organic carbon tests.',
      'Formulated fertilizer dosage recommendations and soil health cards tailored for local paddy, pulses, and oilseed crops.',
      'Assisted research fellows in monitoring insect pest threshold levels and assessing biological control agents in integrated pest management (IPM) trials.',
    ],
    skills: ['Soil Testing', 'Nutrient Profiling', 'IPM Scouting', 'Agronomic Trials'],
  }),
  experience(2, {
    kind: 'internship',
    role: 'Rural Agricultural Training & Extension Trainee',
    organization: 'Community Farm Extension Program',
    location: 'Palasa & Srikakulam District',
    mode: 'On-site',
    start_date: '2025-11-01',
    end_date: '2026-01-31',
    bullets: [
      'Engaged with regional smallholder farmers to assess crop health, water management practices, and introduce eco-friendly agrotechnologies.',
      'Demonstrated seed treatment and bio-fertilizer inoculation techniques to local farming clusters to enhance germination vigor.',
      'Prepared bilingual (Telugu & English) visual advisory guides on balanced nutrient management and seasonal pest scouting.',
    ],
    skills: ['Rural Extension', 'Seed Treatment', 'Farmer Advisory', 'Field Surveys'],
  }),
  experience(3, {
    kind: 'leadership',
    role: 'Student Coordinator — Agronomy & Green Initiatives',
    organization: 'Centurion University Agricultural Club',
    location: 'Paralakhemundi',
    mode: 'On-site',
    start_date: '2024-09-01',
    end_date: null,
    bullets: [
      'Leading student-driven initiatives promoting organic composting, tree plantation drives, and agricultural technical seminars.',
      'Organized campus-wide composting workshops converting farm residues into enriched vermicompost.',
      'Coordinated technical learning circles on GIS & Remote Sensing applications in precision agriculture.',
    ],
    skills: ['Leadership', 'Event Organization', 'Vermicomposting', 'Peer Mentoring'],
  }),
  experience(4, {
    kind: 'leadership',
    role: 'Active Volunteer — Rural Youth Outreach',
    organization: 'Sustainable Agroforestry Awareness Campaign',
    location: 'Palasa Region',
    mode: 'On-site',
    start_date: '2024-10-01',
    end_date: null,
    bullets: [
      'Advocating for multi-tier agroforestry models and watershed protection among smallholder agrarian households.',
      'Coordinated distribution of multipurpose tree saplings to promote agroforestry windbreaks and soil erosion control.',
      'Presented findings on agroforestry climate resilience aligned with FAO best practices.',
    ],
    skills: ['Agroforestry', 'Watershed Awareness', 'Community Outreach'],
  }),
];

function project(
  index: number,
  item: Omit<Project, 'id' | 'sort_order' | 'is_visible' | 'cover_url' | 'gallery' | 'links'> &
    Partial<Pick<Project, 'cover_url' | 'gallery' | 'links'>>,
): Project {
  return {
    id: `starter-proj-${index}`,
    sort_order: index * 10,
    is_visible: true,
    cover_url: '',
    gallery: [],
    links: [],
    ...item,
  };
}

const projects: Project[] = [
  project(1, {
    slug: 'soil-health-fertility-mapping',
    title: 'Comprehensive Soil Health Assessment & Nutrient Profiling',
    category: 'Soil Science & Agronomy',
    summary:
      'Analyzed physical and chemical parameters of soil samples across agricultural plots to diagnose nutrient deficiencies, formulate precision soil health scorecards, and lower fertilizer runoff.',
    description: [
      '### Project Context',
      'Excessive chemical fertilization leads to soil degradation, micronutrient depletion, and ground-water contamination. This project focused on creating a diagnostic soil testing protocol for smallholder fields.',
      '',
      '### Methodologies & Field Work',
      '- **Composite Sampling:** Followed zig-zag sampling pattern to collect representative topsoil (0-15 cm) cores across 5 diverse farm plots.',
      '- **Laboratory Testing:** Measured soil pH, Electrical Conductivity, available Nitrogen (Alkaline Permanganate method), Phosphorus (Olsens method), and Potassium (Flame Photometry).',
      '- **Data Synthesis:** Calculated nutrient balance indices and drafted customized fertilizer prescription sheets integrating organic farmyard manure (FYM) with targeted micro-dosing.',
      '',
      '### Outcomes & Impact',
      'The formulated soil health cards demonstrated how balancing soil organic matter with precision inputs can cut inorganic nitrogen overhead by 18% while sustaining target crop yields.',
    ].join('\n'),
    featured: true,
    tools: ['Soil Testing Kit', 'Spectrophotometer', 'Flame Photometer', 'Soil Health Card System'],
  }),
  project(2, {
    slug: 'agroforestry-carbon-crop-synergy',
    title: 'Agroforestry Systems for Sustainable Agrifood Transformation',
    category: 'Sustainable Agroecosystems',
    summary:
      'Applied principles from FAO eLearning Academy to evaluate how integrating woody perennials with annual crops enhances moisture retention, soil microbial biomass, and farm income stability.',
    description: [
      '### Overview',
      'Monoculture systems face increasing vulnerability from erratic weather and temperature spikes. This study investigated agroforestry tree-crop interactions, focusing on nitrogen-fixing multipurpose trees combined with food crops.',
      '',
      '### Key Findings',
      '- **Microclimate Modification:** Tree canopy shade buffers ambient ground temperatures by 2.4°C during peak noon, significantly reducing evapotranspiration rates.',
      '- **Soil Moisture Retention:** Organic leaf litter deposition enhanced surface soil water holding capacity by 22% compared to open-sun control plots.',
      '- **Economic Diversification:** Multi-tiered cropping generates continuous yields of timber, fodder, fruit, and pulses, buffering market volatility for rural farmers.',
    ].join('\n'),
    featured: true,
    tools: ['Agroforestry Planning', 'Microclimate Sensors', 'FAO Guidelines', 'Biodiversity Mapping'],
  }),
  project(3, {
    slug: 'gis-remote-sensing-crop-health',
    title: 'GIS & Satellite Remote Sensing for Crop Health Monitoring',
    category: 'Precision Agriculture',
    summary:
      'Investigated the utilization of multispectral satellite data and spatial GIS mapping to track crop growth stages, identify vegetative stress zones, and plan precision irrigation.',
    description: [
      '### Research Background',
      'Large-scale field scouting on foot is resource-intensive. Leveraging open-source satellite imagery (Sentinel-2) allows continuous, non-invasive assessment of vegetative vigour across growing seasons.',
      '',
      '### Implementation Workflow',
      '- **NDVI Computation:** Extracted Near-Infrared (NIR) and Red spectral reflectance to calculate NDVI vegetation health indexes.',
      '- **Zonal Delineation:** Mapped high-stress vs. healthy vegetative zones to direct on-ground scouting teams precisely to problem areas.',
      '- **Resource Optimization:** Highlighted how remote sensing can inform targeted irrigation intervals and early pest containment.',
    ].join('\n'),
    featured: true,
    tools: ['QGIS', 'Sentinel-2 Multispectral Data', 'NDVI Analysis', 'Spatial Mapping'],
  }),
  project(4, {
    slug: 'seed-viability-germination-trials',
    title: 'Quality Seed Production & Germination Viability Trials',
    category: 'Seed Technology',
    summary:
      'Conducted standardized seed quality assays to test germination velocity, vigor index, and the efficacy of natural biopriming agents against seed-borne pathogens.',
    description: [
      '### Methodology',
      'Evaluated certified seed lots using standard International Seed Testing Association (ISTA) guidelines:',
      '- **Paper Towel & Petri Dish Germination:** Documented germination rates across days 3, 7, and 14.',
      '- **Seed Priming Experiment:** Tested biological priming agents (*Trichoderma viride* and *Pseudomonas fluorescens*) against untreated controls.',
      '- **Results:** Bioprimed seeds demonstrated a 14% improvement in germination uniformity and significantly reduced seedling mortality.',
    ].join('\n'),
    featured: false,
    tools: ['Germination Chambers', 'Bio-priming Agents', 'Seed Vigor Assay', 'ISTA Protocols'],
  }),
];

function skill(index: number, name: string, category: string, level: number | null): Skill {
  return { id: `starter-skill-${index}`, sort_order: index * 10, is_visible: true, name, category, level };
}

const skills: Skill[] = [
  // Soil Science & Plant Nutrition
  skill(1, 'Soil Testing & Chemical Analysis', 'Soil & Nutrient Science', 95),
  skill(2, 'Soil Health Management', 'Soil & Nutrient Science', 92),
  skill(3, 'Fertilizer Calculation & NPK Profiling', 'Soil & Nutrient Science', 88),
  skill(4, 'Organic Farming & Biofertilizers', 'Soil & Nutrient Science', 85),

  // Crop Agronomy & Plant Protection
  skill(5, 'Crop Management & Production', 'Crop Agronomy', 94),
  skill(6, 'Seed Production & Quality Testing', 'Crop Agronomy', 88),
  skill(7, 'Integrated Pest Management (IPM)', 'Crop Agronomy', 86),
  skill(8, 'Plant Disease Scouting & Diagnosis', 'Crop Agronomy', 84),

  // Fieldwork, Surveying & Natural Resources
  skill(9, 'Natural Resource Management', 'Fieldwork & Surveying', 92),
  skill(10, 'Field Survey & Agro-Ecological Mapping', 'Fieldwork & Surveying', 90),
  skill(11, 'Farm Operations & Watershed Planning', 'Fieldwork & Surveying', 87),
  skill(12, 'Agroforestry Systems Planning', 'Fieldwork & Surveying', 88),

  // Agrotechnology & Precision Agriculture
  skill(13, 'GIS & Remote Sensing (NDVI Analysis)', 'Agrotechnology', 82),
  skill(14, 'Precision Agriculture Tools', 'Agrotechnology', 80),
  skill(15, 'Agribusiness & Farm Economics', 'Agrotechnology', 85),
  skill(16, 'Scientific Documentation & Field Reporting', 'Agrotechnology', 90),
];

function cert(
  index: number,
  item: Omit<Certification, 'id' | 'sort_order' | 'is_visible' | 'credential_url' | 'file_url'> &
    Partial<Pick<Certification, 'credential_url' | 'file_url'>>,
): Certification {
  return {
    id: `starter-cert-${index}`,
    sort_order: index * 10,
    is_visible: true,
    credential_url: '',
    file_url: '',
    ...item,
  };
}

const certifications: Certification[] = [
  cert(1, {
    title: 'NPTEL — Natural Resources Management (Elite)',
    issuer: 'NPTEL / IIT Ministry of Education, Govt. of India',
    issued_on: '2025',
    credential_url: '',
  }),
  cert(2, {
    title: 'Agroforestry for Sustainable Agrifood Transformation',
    issuer: 'FAO eLearning Academy — Food and Agriculture Organization of the United Nations',
    issued_on: '2026',
    credential_url: '',
  }),
  cert(3, {
    title: 'NPTEL — Entrepreneurship Essentials',
    issuer: 'NPTEL / IIT Kharagpur',
    issued_on: '2025',
    credential_url: '',
  }),
];

function edu(
  index: number,
  item: Omit<Education, 'id' | 'sort_order' | 'is_visible'>,
): Education {
  return { id: `starter-edu-${index}`, sort_order: index * 10, is_visible: true, ...item };
}

const education: Education[] = [
  edu(1, {
    institution: 'Centurion University of Technology and Management',
    qualification: 'B.Sc. (Hons.) Agriculture',
    field: 'Agricultural Sciences, Agronomy, Soil Science & Plant Pathology',
    start_year: 2024,
    end_year: 2028,
    score_label: 'GPA',
    score: '8.03 / 10',
  }),
  edu(2, {
    institution: 'Sri Chaitanya College of Education',
    qualification: 'Intermediate (Class XII)',
    field: 'Biological Sciences, Physics & Chemistry (BiPC)',
    start_year: 2022,
    end_year: 2024,
    score_label: 'GPA',
    score: '8.6 / 10',
  }),
  edu(3, {
    institution: 'Sri Chaitanya Techno School',
    qualification: 'Matriculation (Class X)',
    field: 'General Sciences & Mathematics',
    start_year: 2021,
    end_year: 2022,
    score_label: 'GPA',
    score: '8.1 / 10',
  }),
];

export const STARTER_CONTENT: Portfolio = {
  profile,
  settings: {
    id: 1,
    sections: DEFAULT_SECTIONS,
    theme_color: 'emerald',
    content_version: 1,
  },
  experiences,
  projects,
  skills,
  certifications,
  education,
};

export const PUBLIC_STARTER: Portfolio = STARTER_CONTENT;
