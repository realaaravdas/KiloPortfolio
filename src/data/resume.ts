export const profile = {
  name: 'Aarav Das',
  role: 'Robotics Engineer & Software Developer',
  location: 'Santa Cruz, CA',
  email: 'realaaravdas@gmail.com',
  github: 'https://github.com/realaaravdas',
  githubHandle: 'realaaravdas',
  linkedin: 'https://www.linkedin.com/in/aarav-das-412160308/',
  summary:
    "I build software and robots — from computer vision pipelines that let a robot see, to full-stack tools that ship to real users. Freshman at UC Santa Cruz studying Robotics Engineering, with four years leading the code and computer vision team on an FRC robotics team and a summer building enterprise observability tooling at an AI startup.",
}

export const stats = [
  { label: 'Years on FRC Code Team', value: '4+' },
  { label: 'Personal Projects Shipped', value: '5' },
  { label: 'Internship', value: 'CurieTech AI' },
  { label: 'Published Paper', value: '1' },
]

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
    period: 'June 2025 – August 2025',
    bullets: [
      'Developed enterprise software focused on observability and automated log redaction.',
      'Engineered a full-stack documentation website from scratch with React and MCP servers, deployed to AWS from Figma designs.',
      'Built REST APIs to connect services and an automated log-redaction pipeline using regex-based redaction.',
      'Designed a local deployment method for custom Helm charts (normally cloud-only) to speed up testing.',
      'Implemented distributed tracing on logs and events, visualized in Grafana Tempo.',
      'Coordinated with a multidisciplinary team across countries to troubleshoot production issues.',
    ],
    tags: ['React', 'AWS', 'Helm', 'Kubernetes', 'Grafana', 'REST APIs'],
  },
  {
    role: 'Code Team & Computer Vision Lead, Aux. Board Member',
    org: 'FIRST Robotics Competition — Team 2367, Lancer Robotics',
    location: 'Mountain View, CA',
    period: 'August 2022 – May 2026',
    bullets: [
      'Won 1st place with our alliance at the Central Valley District/Regional competition (2026).',
      "Led early-stage development of one of the team's first fully autonomous robot navigation systems — built and trained the core computer vision and localization models to roughly 50% completion before shelving the project due to hardware constraints.",
      'Programmed and trained models for competition tasks using ROS and enterprise robotics tooling.',
      'Mentored younger students at elementary schools on coding, robot design, and driving practice.',
      'Hybrid member across all four disciplines — CAD, Mechanical, Electrical, and Code.',
      'Comfortable with chop saw, band saw, 3D printing, and laser cutting for hands-on builds.',
    ],
    tags: ['ROS', 'Computer Vision', 'Python', 'Localization', 'Mentorship'],
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
    period: 'Personal Project',
    description:
      'A robot that autonomously locates and collects tennis balls off a court, combining SLAM mapping, radar, and vision for reliable detection in a cluttered outdoor environment.',
    bullets: [
      'Fused SLAM tracking with mmWave radar and computer vision for robust ball detection and localization.',
      'Ran the full perception and control stack on a Raspberry Pi 4B+.',
      'Designed the collection mechanism and navigation logic end to end, from hardware to software.',
    ],
    tags: ['SLAM', 'mmWave Radar', 'Computer Vision', 'Raspberry Pi', 'Python'],
    featured: true,
  },
  {
    title: 'Rust Racer',
    period: 'Personal Project',
    description:
      'A 3D arcade racing game built from scratch in Rust with the Bevy engine and Rapier physics — every circuit, its terrain, and its track layout are procedurally generated at race time.',
    bullets: [
      'Procedurally generates a fresh 3,200×3,200-unit heightfield terrain and a closed-loop track of 24–40 waypoints each race, with a single deterministic height function shared by the render mesh and physics collider so they never desync.',
      'Wrote custom force-based vehicle physics — engine force, drag, cornering grip, drifting, downforce, and terrain-normal self-righting torque to keep cars oriented to the ground.',
      'Built 12 AI opponents across three performance tiers with waypoint navigation, blocking behavior, and stuck-detection recovery.',
      'Implemented a chase camera with a live minimap overlay and a Tesla-style HUD showing speed, drift/brake state, and live race placement.',
    ],
    tags: ['Rust', 'Bevy', 'Rapier Physics', 'Game Dev', 'Procedural Generation'],
    featured: true,
  },
  {
    title: 'Code-to-CAD Generator',
    period: 'Personal Project',
    description:
      'A Python application, built from scratch, that converts code into CAD designs — complete with an integrated AI assistant and live rendering.',
    bullets: [
      'Parses design intent from code and generates corresponding CAD geometry.',
      'Integrated an AI assistant to help refine and iterate on designs conversationally.',
      'Built a rendering pipeline to preview generated models.',
    ],
    tags: ['Python', 'CAD', 'AI Agents', 'Rendering'],
    featured: true,
  },
  {
    title: 'College Acceptance Estimator',
    period: 'Personal Project',
    description:
      'A tool that scrapes college admissions data and uses the Gemini API to estimate a student\'s acceptance chances at a given school.',
    bullets: [
      'Built with Google AI Studio and the Gemini API on a Node.js backend.',
      'Designed data-scraping workflows to keep admissions data current.',
    ],
    tags: ['Node.js', 'Gemini API', 'Data Scraping'],
  },
  {
    title: 'Automated Repo Documentation Engine',
    period: 'Personal Project',
    description:
      'A web application that uses the Gemini API to generate and cross-link comprehensive documentation for entire code repositories, built for enterprise use.',
    bullets: [
      'Automatically generates and links documentation across a codebase.',
      'Built on Node.js with the Gemini API for content generation.',
    ],
    tags: ['Node.js', 'Gemini API', 'Documentation Tooling'],
  },
  {
    title: 'Helm Deployment Assistant',
    period: 'Personal Project',
    description:
      'A Java desktop app that automates deploying Kubernetes Helm charts and automatically detects and fixes common configuration errors.',
    bullets: [
      'Automates a normally manual, error-prone Helm deployment workflow.',
      'Detects and resolves common chart configuration errors to reduce deployment failures.',
    ],
    tags: ['Java', 'Kubernetes', 'Helm', 'DevOps'],
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
    period: 'September 2026 – May 2030 (Expected)',
    detail: 'B.S. Robotics Engineering',
  },
  {
    school: 'Worcester Polytechnic Institute',
    location: 'Boston, MA',
    period: 'July 2024 – August 2024',
    detail: 'Summer Pre-Collegiate Program — Biotechnology, Entrepreneurship, AI, Writing',
    bullets: [
      'Built an electrocardiogram (EKG) circuit from op-amps, wires, and resistors.',
      'Studied and fine-tuned AI models (Top-K, Top-P, prompting, hallucination levels) using Gemini and OpenAI APIs.',
      'Drafted an academic paper on the ethics and legal treatment of AI.',
    ],
  },
  {
    school: 'Saint Francis High School',
    location: 'Mountain View, CA',
    period: 'August 2022 – May 2026',
    detail: '3 APs + dual-enrollment coursework · Honor Roll · ACT: 34',
    bullets: [
      'AP Calculus AB, AP Physics C: Mechanics, Computer Science 1A, AP Computer Science Principles.',
    ],
  },
]

export const skills: { category: string; items: string[] }[] = [
  {
    category: 'Languages',
    items: ['Python', 'Java', 'C++', 'Rust', 'SQL', 'Bash / Shell'],
  },
  {
    category: 'AI & Machine Learning',
    items: [
      'OpenCV',
      'NVIDIA CUDA',
      'Computer Vision',
      'Visual SLAM',
      'PID Control',
      'AI Agent Development',
      'OpenAI API',
      'Gemini API',
      'Prompt Engineering',
    ],
  },
  {
    category: 'Robotics & Hardware',
    items: [
      'ROS 1 & 2',
      'NVIDIA Isaac',
      'PhotonVision',
      'Limelight',
      'PyTorch',
      'Jetson Nano / Orin',
      'Raspberry Pi',
      'Arduino',
      'FRC & FTC',
    ],
  },
  {
    category: 'Software & DevOps',
    items: [
      'React',
      'REST APIs',
      'gRPC',
      'Docker',
      'Kubernetes',
      'Helm',
      'Git',
      'Grafana / Loki / Tempo',
      'Microservices',
    ],
  },
  {
    category: 'Design & Fabrication',
    items: ['Autodesk Inventor', 'Blender', 'Figma', 'Laser Cutting', '3D Printing', 'Band/Chop Saw'],
  },
]

export const publication = {
  title: 'The Ethics and Legal Treatment Which Should Govern Artificial Intelligence',
  publisher: 'Curieux Academic Journal',
  date: 'October 2024',
  page: 'p. 55',
  url: 'https://www.curieuxacademicjournal.com/_files/ugd/99711c_95397c2ad29e43af88a4539dd7344073.pdf',
  abstract:
    'Proposes a universal method for distinguishing natural humans from artificial beings based on the capacity to perform evolution, and a corresponding framework governments could use to enforce laws and penalize AI systems.',
}

export const activities = [
  {
    name: 'FRC — Team 2367, Lancer Robotics',
    period: 'Aug 2022 – May 2026',
    detail: 'Hybrid member across CAD, Mechanical, Electrical, and Code; our alliance placed 1st at the 2026 Central Valley District/Regional competition.',
  },
  {
    name: 'Machine Learning & AI Club',
    period: 'Aug 2022 – May 2026',
    detail: 'Researched advances in ML and computer vision for object recognition; trained models for club projects.',
  },
  {
    name: 'Aerospace Club at Saint Francis',
    period: 'Aug 2022 – May 2026',
    detail: 'Co-President — co-led pilot talks and airport tours; presented projects on space and green aviation.',
  },
  {
    name: 'Second Harvest Food Bank of Silicon Valley',
    period: 'Aug 2022 – Jun 2026',
    detail: 'Volunteer sorting food for families in need — contributed to helping roughly 35,000 people over the years.',
  },
]
