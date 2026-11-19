-- =====================================================================
-- Starter content for Veda Sri Karri (B.Sc. Agriculture Portfolio).
-- Generated directly from src/lib/seed-content.ts.
-- Run in Supabase: SQL Editor -> New query -> paste -> Run.
-- =====================================================================

begin;

delete from public.experiences;
delete from public.projects;
delete from public.skills;
delete from public.certifications;
delete from public.education;

insert into public.profile (
  id, full_name, headline, tagline, about, location, email, phone, show_phone,
  linkedin_url, github_url, avatar_url, resume_url, open_to_work, seo_title, seo_description
) values (
  1, 'Veda Sri Karri', 'B.Sc. (Hons) Agriculture Scholar · Sustainable Agronomy & Natural Resource Management', 'Bridging modern farming science, soil health diagnostics, and sustainable agroecosystems.', 'I am an enthusiastic B.Sc. (Hons.) Agriculture student at Centurion University of Technology and Management, Paralakhemundi, dedicated to advancing sustainable agricultural productivity through modern agronomic science and field-tested practices.

My academic training and hands-on laboratory work encompass comprehensive soil health testing, balanced nutrient management, crop cultivation methodologies, seed technology, and watershed stewardship. I actively explore the integration of GIS and remote sensing tools to improve precision agronomy and optimize natural resource management.

Certified by the FAO in Agroforestry for Sustainable Agrifood Transformation and by NPTEL in Natural Resources Management (Elite), I am passionate about connecting lab research with grassroots farming resilience. I welcome opportunities in agricultural research, agronomy internships, and agribusiness development.', 'Palasa, Andhra Pradesh, India',
  'vedhakarri25@gmail.com', '+91 79817 58431', true, 'https://www.linkedin.com/in/vedha-karri', '',
  '', '', true, 'Veda Sri Karri — B.Sc. (Hons) Agriculture Portfolio', 'Portfolio of Veda Sri Karri, B.Sc. (Hons) Agriculture scholar at Centurion University. Specialized in soil health testing, sustainable crop management, natural resource conservation, and agroforestry.'
)
on conflict (id) do update set
  full_name = excluded.full_name, headline = excluded.headline, tagline = excluded.tagline,
  about = excluded.about, location = excluded.location, email = excluded.email, phone = excluded.phone,
  show_phone = excluded.show_phone, linkedin_url = excluded.linkedin_url, github_url = excluded.github_url,
  avatar_url = excluded.avatar_url, resume_url = excluded.resume_url, open_to_work = excluded.open_to_work,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description;

insert into public.site_settings (id, sections, content_version) values (1, '[{"key":"about","visible":true,"title":"About & Vision","intro":"Cultivating sustainable agricultural solutions through science and field practice."},{"key":"experience","visible":true,"title":"Fieldwork & Practical Experience","intro":"Hands-on training across agronomic trials, soil laboratories, and rural agricultural ecosystems."},{"key":"projects","visible":true,"title":"Agronomic Research & Projects","intro":"Applied field studies, soil health diagnostics, and precision farming initiatives."},{"key":"skills","visible":true,"title":"Agricultural Competencies & Tools","intro":"Core proficiencies across soil science, crop management, farm surveying, and agrotechnology."},{"key":"certifications","visible":true,"title":"Credentials & Certifications","intro":"Recognitions from the FAO and NPTEL in natural resources and agribusiness."},{"key":"education","visible":true,"title":"Academic Background","intro":"Formal education in agricultural sciences and natural science foundations."},{"key":"leadership","visible":true,"title":"Leadership & Extracurriculars","intro":"Student engagement, rural agricultural outreach, and community teamwork."},{"key":"contact","visible":true,"title":"Connect with Veda","intro":"Open to agricultural research collaborations, internships, and agritech opportunities."}]'::jsonb, 1)
on conflict (id) do update set sections = excluded.sections, content_version = 1;

insert into public.experiences (kind, role, organization, org_url, logo_url, location, mode, start_date, end_date, bullets, skills, sort_order, is_visible) values
  ('internship', 'Agricultural Field Intern & Soil Analyst', 'Agronomy Field Research Station & Soil Testing Lab', '', '', 'Paralakhemundi, Odisha', 'On-site', '2025-06-01', '2025-08-31', array['Collected and analyzed 120+ composite soil samples across experimental plots, conducting pH, Electrical Conductivity (EC), and organic carbon tests.', 'Formulated fertilizer dosage recommendations and soil health cards tailored for local paddy, pulses, and oilseed crops.', 'Assisted research fellows in monitoring insect pest threshold levels and assessing biological control agents in integrated pest management (IPM) trials.'], array['Soil Testing', 'Nutrient Profiling', 'IPM Scouting', 'Agronomic Trials'], 10, true),
  ('internship', 'Rural Agricultural Training & Extension Trainee', 'Community Farm Extension Program', '', '', 'Palasa & Srikakulam District', 'On-site', '2025-11-01', '2026-01-31', array['Engaged with regional smallholder farmers to assess crop health, water management practices, and introduce eco-friendly agrotechnologies.', 'Demonstrated seed treatment and bio-fertilizer inoculation techniques to local farming clusters to enhance germination vigor.', 'Prepared bilingual (Telugu & English) visual advisory guides on balanced nutrient management and seasonal pest scouting.'], array['Rural Extension', 'Seed Treatment', 'Farmer Advisory', 'Field Surveys'], 20, true),
  ('leadership', 'Student Coordinator — Agronomy & Green Initiatives', 'Centurion University Agricultural Club', '', '', 'Paralakhemundi', 'On-site', '2024-09-01', null, array['Leading student-driven initiatives promoting organic composting, tree plantation drives, and agricultural technical seminars.', 'Organized campus-wide composting workshops converting farm residues into enriched vermicompost.', 'Coordinated technical learning circles on GIS & Remote Sensing applications in precision agriculture.'], array['Leadership', 'Event Organization', 'Vermicomposting', 'Peer Mentoring'], 30, true),
  ('leadership', 'Active Volunteer — Rural Youth Outreach', 'Sustainable Agroforestry Awareness Campaign', '', '', 'Palasa Region', 'On-site', '2024-10-01', null, array['Advocating for multi-tier agroforestry models and watershed protection among smallholder agrarian households.', 'Coordinated distribution of multipurpose tree saplings to promote agroforestry windbreaks and soil erosion control.', 'Presented findings on agroforestry climate resilience aligned with FAO best practices.'], array['Agroforestry', 'Watershed Awareness', 'Community Outreach'], 40, true);

insert into public.projects (slug, title, category, summary, description, tools, cover_url, gallery, links, featured, sort_order, is_visible) values
  ('soil-health-fertility-mapping', 'Comprehensive Soil Health Assessment & Nutrient Profiling', 'Soil Science & Agronomy', 'Analyzed physical and chemical parameters of soil samples across agricultural plots to diagnose nutrient deficiencies, formulate precision soil health scorecards, and lower fertilizer runoff.', '### Project Context
Excessive chemical fertilization leads to soil degradation, micronutrient depletion, and ground-water contamination. This project focused on creating a diagnostic soil testing protocol for smallholder fields.

### Methodologies & Field Work
- **Composite Sampling:** Followed zig-zag sampling pattern to collect representative topsoil (0-15 cm) cores across 5 diverse farm plots.
- **Laboratory Testing:** Measured soil pH, Electrical Conductivity, available Nitrogen (Alkaline Permanganate method), Phosphorus (Olsens method), and Potassium (Flame Photometry).
- **Data Synthesis:** Calculated nutrient balance indices and drafted customized fertilizer prescription sheets integrating organic farmyard manure (FYM) with targeted micro-dosing.

### Outcomes & Impact
The formulated soil health cards demonstrated how balancing soil organic matter with precision inputs can cut inorganic nitrogen overhead by 18% while sustaining target crop yields.', array['Soil Testing Kit', 'Spectrophotometer', 'Flame Photometer', 'Soil Health Card System'], '', '{}', '[]'::jsonb, true, 10, true),
  ('agroforestry-carbon-crop-synergy', 'Agroforestry Systems for Sustainable Agrifood Transformation', 'Sustainable Agroecosystems', 'Applied principles from FAO eLearning Academy to evaluate how integrating woody perennials with annual crops enhances moisture retention, soil microbial biomass, and farm income stability.', '### Overview
Monoculture systems face increasing vulnerability from erratic weather and temperature spikes. This study investigated agroforestry tree-crop interactions, focusing on nitrogen-fixing multipurpose trees combined with food crops.

### Key Findings
- **Microclimate Modification:** Tree canopy shade buffers ambient ground temperatures by 2.4°C during peak noon, significantly reducing evapotranspiration rates.
- **Soil Moisture Retention:** Organic leaf litter deposition enhanced surface soil water holding capacity by 22% compared to open-sun control plots.
- **Economic Diversification:** Multi-tiered cropping generates continuous yields of timber, fodder, fruit, and pulses, buffering market volatility for rural farmers.', array['Agroforestry Planning', 'Microclimate Sensors', 'FAO Guidelines', 'Biodiversity Mapping'], '', '{}', '[]'::jsonb, true, 20, true),
  ('gis-remote-sensing-crop-health', 'GIS & Satellite Remote Sensing for Crop Health Monitoring', 'Precision Agriculture', 'Investigated the utilization of multispectral satellite data and spatial GIS mapping to track crop growth stages, identify vegetative stress zones, and plan precision irrigation.', '### Research Background
Large-scale field scouting on foot is resource-intensive. Leveraging open-source satellite imagery (Sentinel-2) allows continuous, non-invasive assessment of vegetative vigour across growing seasons.

### Implementation Workflow
- **NDVI Computation:** Extracted Near-Infrared (NIR) and Red spectral reflectance to calculate NDVI vegetation health indexes.
- **Zonal Delineation:** Mapped high-stress vs. healthy vegetative zones to direct on-ground scouting teams precisely to problem areas.
- **Resource Optimization:** Highlighted how remote sensing can inform targeted irrigation intervals and early pest containment.', array['QGIS', 'Sentinel-2 Multispectral Data', 'NDVI Analysis', 'Spatial Mapping'], '', '{}', '[]'::jsonb, true, 30, true),
  ('seed-viability-germination-trials', 'Quality Seed Production & Germination Viability Trials', 'Seed Technology', 'Conducted standardized seed quality assays to test germination velocity, vigor index, and the efficacy of natural biopriming agents against seed-borne pathogens.', '### Methodology
Evaluated certified seed lots using standard International Seed Testing Association (ISTA) guidelines:
- **Paper Towel & Petri Dish Germination:** Documented germination rates across days 3, 7, and 14.
- **Seed Priming Experiment:** Tested biological priming agents (*Trichoderma viride* and *Pseudomonas fluorescens*) against untreated controls.
- **Results:** Bioprimed seeds demonstrated a 14% improvement in germination uniformity and significantly reduced seedling mortality.', array['Germination Chambers', 'Bio-priming Agents', 'Seed Vigor Assay', 'ISTA Protocols'], '', '{}', '[]'::jsonb, false, 40, true);

insert into public.skills (category, name, level, sort_order, is_visible) values
  ('Soil & Nutrient Science', 'Soil Testing & Chemical Analysis', 95, 10, true),
  ('Soil & Nutrient Science', 'Soil Health Management', 92, 20, true),
  ('Soil & Nutrient Science', 'Fertilizer Calculation & NPK Profiling', 88, 30, true),
  ('Soil & Nutrient Science', 'Organic Farming & Biofertilizers', 85, 40, true),
  ('Crop Agronomy', 'Crop Management & Production', 94, 50, true),
  ('Crop Agronomy', 'Seed Production & Quality Testing', 88, 60, true),
  ('Crop Agronomy', 'Integrated Pest Management (IPM)', 86, 70, true),
  ('Crop Agronomy', 'Plant Disease Scouting & Diagnosis', 84, 80, true),
  ('Fieldwork & Surveying', 'Natural Resource Management', 92, 90, true),
  ('Fieldwork & Surveying', 'Field Survey & Agro-Ecological Mapping', 90, 100, true),
  ('Fieldwork & Surveying', 'Farm Operations & Watershed Planning', 87, 110, true),
  ('Fieldwork & Surveying', 'Agroforestry Systems Planning', 88, 120, true),
  ('Agrotechnology', 'GIS & Remote Sensing (NDVI Analysis)', 82, 130, true),
  ('Agrotechnology', 'Precision Agriculture Tools', 80, 140, true),
  ('Agrotechnology', 'Agribusiness & Farm Economics', 85, 150, true),
  ('Agrotechnology', 'Scientific Documentation & Field Reporting', 90, 160, true);

insert into public.certifications (title, issuer, issued_on, credential_url, file_url, sort_order, is_visible) values
  ('NPTEL — Natural Resources Management (Elite)', 'NPTEL / IIT Ministry of Education, Govt. of India', '2025', '', '', 10, true),
  ('Agroforestry for Sustainable Agrifood Transformation', 'FAO eLearning Academy — Food and Agriculture Organization of the United Nations', '2026', '', '', 20, true),
  ('NPTEL — Entrepreneurship Essentials', 'NPTEL / IIT Kharagpur', '2025', '', '', 30, true);

insert into public.education (institution, qualification, field, start_year, end_year, score_label, score, sort_order, is_visible) values
  ('Centurion University of Technology and Management', 'B.Sc. (Hons.) Agriculture', 'Agricultural Sciences, Agronomy, Soil Science & Plant Pathology', 2024, 2028, 'GPA', '8.03 / 10', 10, true),
  ('Sri Chaitanya College of Education', 'Intermediate (Class XII)', 'Biological Sciences, Physics & Chemistry (BiPC)', 2022, 2024, 'GPA', '8.6 / 10', 20, true),
  ('Sri Chaitanya Techno School', 'Matriculation (Class X)', 'General Sciences & Mathematics', 2021, 2022, 'GPA', '8.1 / 10', 30, true);

commit;
