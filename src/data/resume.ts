export const profile = {
  name: 'Aarav Das',
  role: 'Robotics Engineer & Software Developer',
  location: 'Santa Cruz, CA',
  email: 'realaaravdas@gmail.com',
  github: 'https://github.com/realaaravdas',
  githubHandle: 'realaaravdas',
  linkedin: 'https://www.linkedin.com/in/aarav-das-412160308/',
  title: 'Robotics Engineer',
  focus: 'AI · Autonomy · Computer Vision',
  resumeUrl: '/Aarav_Das_Resume.docx',
  summary:
    "Robotics Engineering student at UC Santa Cruz building autonomous systems end to end — from computer vision, SLAM, and control on embedded hardware to cloud-deployed services. Shipped production software as an engineering intern and led computer vision for a regional-winning FRC team. Seeking internships in software, robotics autonomy, computer vision, controls, and AI automation.",
}

export const stats = [
  { label: 'Years on FRC Code Team', value: '4' },
  { label: 'Regional Result', value: '1st' },
  { label: 'Internship', value: 'CurieTech AI' },
  { label: 'Published Paper', value: '1' },
]

/** Four stat cards per scroll section (label + value). */
export type Stat = { label: string; value: string }
export const sectionStats: Record<'about' | 'skills' | 'experience' | 'projects' | 'contact', Stat[]> = {
  about: [
    { label: 'Seasons · FRC 2367', value: '4' },
    { label: '2026 Central Valley', value: '1st Place' },
    { label: 'ACT Composite', value: '34' },
    { label: 'Published Papers', value: '1' },
  ],
  skills: [
    { label: 'Languages', value: '7' },
    { label: 'Compute Targets', value: 'Jetson · Coral · Pi' },
    { label: 'Robotics Middleware', value: 'ROS 1 / 2' },
    { label: 'Perception Stack', value: 'OpenCV · PyTorch' },
  ],
  experience: [
    { label: 'Robotics Seasons', value: '4' },
    { label: 'Build Disciplines', value: 'CAD · Mech · Elec · Code' },
    { label: 'Industry Internship', value: 'Summer 2025' },
    { label: 'Deployment Target', value: 'AWS · K8s' },
  ],
  projects: [
    { label: 'Featured Builds', value: '4' },
    { label: 'AI Opponents · Rust Racer', value: '12' },
    { label: 'Procedural Terrain', value: '3,200²' },
    { label: 'Fused Sensors · Ball Collector', value: '3' },
  ],
  contact: [
    { label: 'Status', value: 'Open to Internships' },
    { label: 'Typical Response', value: '< 24 h' },
    { label: 'Base', value: 'Santa Cruz, CA' },
    { label: 'Focus', value: 'Robotics · CV · AI' },
  ],
}

export type Experience = {
  role: string
  org: string
  location: string
  period: string
  bullets: string[]
  tags: string[]
}

export const experience: Experience[] = [
  {
    role: 'Software Engineering Intern',
    org: 'CurieTech AI',
    location: 'Sunnyvale, CA',
    period: 'Jun 2025 – Aug 2025',
    bullets: [
      'Built and deployed a full-stack product documentation site from Figma designs using React and MCP servers, hosted on AWS.',
      "Developed REST APIs to handle communication between microservices on the company's enterprise platform.",
      'Created an automated log-redaction service and pipeline using regex-based pattern matching to remove sensitive data from logs.',
      'Implemented distributed tracing across logs and events, visualized in Grafana Tempo, to improve observability across services.',
      'Designed a local deployment method for custom Helm charts, enabling Kubernetes testing without cloud infrastructure.',
      'Used LLM frameworks to automatically generate, edit, and update product documentation; collaborated with an internationally distributed, multidisciplinary team to troubleshoot and resolve technical issues.',
    ],
    tags: ['React', 'MCP', 'AWS', 'Helm', 'Kubernetes', 'Grafana Tempo', 'REST APIs'],
  },
  {
    role: 'Computer Vision Lead, Code Team & Auxiliary Board Member',
    org: 'FRC Team 2367, Lancer Robotics',
    location: 'Mountain View, CA',
    period: 'Aug 2022 – May 2026',
    bullets: [
      'Won 1st place at the 2026 Central Valley Regional as part of the winning alliance.',
      "Designed and coded a prototype autonomous navigation system for the team: a multi-node ROS 2 navigation and pilot stack distributed across onboard co-processors (NVIDIA Jetson, Google Coral) and computers.",
      "Built AprilTag-based pose estimation and trained the prototype's computer vision models; when build time ran short, moved to developing the competition robot's Limelight vision system.",
      'Mentored younger students in coding, robot design, and driving; worked across CAD, mechanical, electrical, and code.',
    ],
    tags: ['ROS 2', 'AprilTag', 'Jetson', 'Coral', 'Limelight', 'Computer Vision', 'Mentorship'],
  },
]

export type Project = {
  title: string
  period: string
  description: string
  bullets: string[]
  tags: string[]
  featured?: boolean
}

export const projects: Project[] = [
  {
    title: 'Autonomous Tennis Ball Collector',
    period: '2025 – 2026',
    description:
      'A mobile robot that autonomously finds and collects tennis balls on a court, fusing SLAM tracking, mmWave radar, and computer vision for robust detection and localization in a cluttered outdoor environment.',
    bullets: [
      'Fused visual SLAM tracking, mmWave radar, and computer vision for robust ball detection and localization.',
      'Ran the full perception, navigation, and control stack on a Raspberry Pi 4B+.',
      'Designed the collection mechanism and navigation logic end to end, from hardware to software.',
    ],
    tags: ['Python', 'Raspberry Pi', 'Visual SLAM', 'mmWave Radar', 'Computer Vision'],
    featured: true,
  },
  {
    title: 'Rust Racer',
    period: '2025 – Present',
    description:
      'A 3D arcade racing game built from scratch in Rust with the Bevy engine and Rapier physics — every circuit, its terrain, and its track layout are procedurally generated at race time.',
    bullets: [
      'Wrote custom force-based vehicle dynamics: engine force, drag, cornering grip, drifting, downforce, and terrain-normal self-righting torque.',
      'Built 12 autonomous AI opponents across three tiers with waypoint navigation, blocking, and stuck-detection recovery.',
      'Procedurally generates 3,200×3,200-unit terrain and 24–40-waypoint closed-loop tracks, with one deterministic height function shared by render mesh and physics collider so they never desync.',
      'Implemented a chase camera with a live minimap overlay and a HUD showing speed, drift/brake state, and live race placement.',
    ],
    tags: ['Rust', 'Bevy', 'Rapier Physics', 'Procedural Generation'],
    featured: true,
  },
  {
    title: 'Code-to-CAD Generator',
    period: '2025 – Present',
    description:
      'A Python application, built from scratch, that converts code into CAD geometry — with an AI assistant for conversational design iteration and live rendering.',
    bullets: [
      'Parses design intent from code and generates corresponding CAD geometry.',
      'Integrated an AI assistant to refine and iterate on designs conversationally.',
      'Built a live rendering pipeline to preview generated models.',
    ],
    tags: ['Python', 'CAD', 'AI Agents', '3D Rendering'],
    featured: true,
  },
  {
    title: 'DevOps & AI Tools',
    period: '2025',
    description:
      'A set of developer and automation tools built on Java, Kubernetes, and the Gemini API: Helm deployment automation, enterprise repo documentation, and an admissions-data estimator.',
    bullets: [
      'Java desktop app that automates Kubernetes Helm chart deployment and detects and fixes common configuration errors.',
      'Node.js + Gemini API enterprise repo-documentation generator that generates and cross-links docs across a codebase.',
      'Node.js + Gemini API admissions-data scraper that estimates acceptance odds for a given school.',
    ],
    tags: ['Java', 'Kubernetes', 'Helm', 'Node.js', 'Gemini API'],
    featured: true,
  },
]

export type EducationItem = {
  school: string
  location: string
  period: string
  detail: string
  bullets?: string[]
}

export const education: EducationItem[] = [
  {
    school: 'University of California, Santa Cruz',
    location: 'Santa Cruz, CA',
    period: 'Sep 2026 – Expected 2030',
    detail: 'B.S. Robotics Engineering',
    bullets: [
      'Prior coursework: AP Calculus AB, AP Physics C: Mechanics, AP CS Principles, CS 1A: Java Programming (Foothill College).',
    ],
  },
  {
    school: 'Saint Francis High School',
    location: 'Mountain View, CA',
    period: 'May 2026',
    detail: 'High School Diploma · Honor Roll · ACT 34',
  },
  {
    school: 'Worcester Polytechnic Institute',
    location: 'Worcester, MA',
    period: 'Aug 2024',
    detail: 'Summer Pre-Collegiate Program — AI, Biotechnology',
    bullets: [
      'Tuned LLM sampling (Top-K, Top-P) and prompting with Gemini and OpenAI APIs; built an EKG circuit from op-amps.',
    ],
  },
]

export const skills: { category: string; items: string[] }[] = [
  { category: 'Languages', items: ['Python', 'C++', 'Java', 'Rust', 'JavaScript (Node.js, React)', 'SQL', 'Bash'] },
  {
    category: 'Robotics & Controls',
    items: ['ROS 1/2 (multi-node)', 'AprilTag Pose Estimation', 'Visual SLAM', 'PID', 'Sensor Fusion', 'Kalman Filtering'],
  },
  {
    category: 'Hardware',
    items: ['NVIDIA Jetson Nano/Orin', 'Google Coral', 'Raspberry Pi', 'Arduino', 'NVIDIA Isaac', 'PhotonVision', 'Limelight'],
  },
  {
    category: 'AI & Vision',
    items: ['PyTorch', 'OpenCV', 'CUDA', 'Object Detection', 'AI Agents', 'Prompt Engineering', 'OpenAI / Gemini / Claude APIs'],
  },
  {
    category: 'Cloud & DevOps',
    items: [
      'AWS (S3, Lambda)', 'Git / GitHub', 'Docker', 'Kubernetes', 'Helm', 'REST APIs', 'gRPC', 'Microservices',
      'Grafana (Loki, Tempo)', 'LocalStack', 'Minikube', 'Linux', 'Regex',
    ],
  },
  {
    category: 'Design & Fabrication',
    items: ['Autodesk Inventor', 'Onshape', 'SketchUp', 'Blender', 'Cinema 4D', 'Figma', '3D Printing', 'Laser Cutting', 'Shop Tools'],
  },
]

export const publication = {
  title: 'The Ethics and Legal Treatment Which Should Govern Artificial Intelligence',
  publisher: 'Curieux Academic Journal',
  date: 'Oct 2024',
  page: 'p. 55',
  url: 'https://www.curieuxacademicjournal.com/_files/ugd/99711c_95397c2ad29e43af88a4539dd7344073.pdf',
  abstract:
    'Proposes a universal method for distinguishing natural humans from artificial beings based on the capacity to perform evolution, and a corresponding framework governments could use to enforce laws and penalize AI systems.',
}

export const activities = [
  {
    name: 'Aerospace Club, Saint Francis',
    period: 'Co-President',
    detail: 'Co-led pilot talks and airport tours; presented projects on space and green aviation.',
  },
  {
    name: 'Machine Learning & AI Club',
    period: 'Member',
    detail: 'Researched advances in ML and computer vision for object recognition; trained models for club projects.',
  },
  {
    name: 'Second Harvest Food Bank of Silicon Valley',
    period: 'Volunteer',
    detail: 'Sorted food for families in need — helped provide food for roughly 35,000 people.',
  },
  {
    name: 'Red Cross–certified Lifeguard, YMCA',
    period: '2023',
    detail: 'Certified lifeguard.',
  },
]

export const languages = 'English (fluent) · French (intermediate) · Hindi & Tamil (conversational)'
