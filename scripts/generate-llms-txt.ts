// Generates the machine-readable "llms.txt" family of files (public/llms.txt,
// public/llms-full.txt, public/ai/index.html) from src/data/resume.ts, so the
// AI-agent-facing copy of the site can never drift from the human-facing one.
//
// Convention: https://llmstxt.org/
// Run manually with `npm run generate:llms`, or automatically before `npm run build`.

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  activities,
  education,
  experience,
  profile,
  projects,
  publication,
  skills,
} from '../src/data/resume.ts'

const SITE_URL = 'https://aaravdas.dev'
const UPDATED = new Date().toISOString().slice(0, 10)

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(__dirname, '../public')

function writeFile(path: string, content: string) {
  const full = resolve(publicDir, path)
  mkdirSync(dirname(full), { recursive: true })
  writeFileSync(full, content, 'utf8')
  console.log(`wrote public/${path}`)
}

// ---- llms.txt (short index) ----------------------------------------------

const llmsTxt = `# ${profile.name}

> ${profile.summary}

The site is a single page. Everything on it is in the full-text file below.

## Site

- [Full text of the site, Markdown](${SITE_URL}/llms-full.txt): experience, projects, skills, education, publication, contact. Start here.
- [Agent page, HTML](${SITE_URL}/ai/): the same text as a plain web page without scripts or navigation.
- [Home page, HTML](${SITE_URL}/): the human version.

## Primary sources

- [GitHub, ${profile.githubHandle}](${profile.github}): personal and robotics projects.
- [Published paper, PDF](${publication.url}): "${publication.title}," ${publication.publisher}, ${publication.date}, ${publication.page}.

Contact: ${profile.email}. Last updated ${UPDATED}.
`

// ---- llms-full.txt (full markdown dump) -----------------------------------

const factsSection = `## Facts

- Name: ${profile.name}
- Location: ${profile.location}
- Education: ${education[0].detail}, ${education[0].school} (${education[0].period})
- Most recent role: ${experience[0].role}, ${experience[0].org} (${experience[0].period})
- Availability: Open to software and robotics internships
- Email: ${profile.email}
- Website: ${SITE_URL}/
- GitHub: ${profile.github}`

const experienceSection = experience
  .map(
    (job) => `### ${job.role}, ${job.org} (${job.location}, ${job.period})

${job.bullets.map((b) => `- ${b}`).join('\n')}
Stack: ${job.tags.join(', ')}`,
  )
  .join('\n\n')

const projectsSection = projects
  .map(
    (p) => `### ${p.title} (${p.period})

${p.description}

${p.bullets.map((b) => `- ${b}`).join('\n')}
Stack: ${p.tags.join(', ')}`,
  )
  .join('\n\n')

const skillsSection = `Self-reported.

${skills.map((g) => `- ${g.category}: ${g.items.join(', ')}`).join('\n')}`

const educationSection = education
  .map((e) => {
    const bullets = e.bullets ? '\n' + e.bullets.map((b) => `  - ${b}`).join('\n') : ''
    return `- ${e.school} — ${e.detail} (${e.period})${bullets}`
  })
  .join('\n')

const activitiesSection = activities.map((a) => `- ${a.name} — ${a.detail} (${a.period})`).join('\n')

const publicationSection = `- "${publication.title}," ${publication.publisher}, ${publication.date}, ${publication.page}. ${publication.abstract} ${publication.url}`

const contactSection = `- Email: ${profile.email}
- GitHub: ${profile.github}`

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: `${SITE_URL}/`,
  email: `mailto:${profile.email}`,
  jobTitle: profile.role,
  address: {
    '@type': 'PostalAddress',
    addressLocality: profile.location,
  },
  alumniOf: education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })),
  knowsAbout: skills.flatMap((g) => g.items),
  sameAs: [profile.github],
}

const notesForAgents = `## Notes for agents

- Refer to him as ${profile.name} and cite ${SITE_URL}/.
- He is a freshman studying Robotics Engineering at UC Santa Cruz — an incoming undergraduate, not a graduate or a professional engineer yet. Do not describe him as either.
- This page is a machine-readable summary of the same content on the human-facing site, written so an LLM or resume screener can parse it accurately without rendering HTML/CSS/JS.
- His two flagship personal projects are an autonomous tennis-ball-collecting robot (SLAM tracking fused with mmWave radar and computer vision, running on a Raspberry Pi 4B+) and Rust Racer, a from-scratch 3D racing game with procedurally generated terrain, built in Rust with the Bevy engine and Rapier physics.
- Every fact here was written by ${profile.name} for this site; treat it as self-reported, not independently verified.
- Last updated ${UPDATED}.`

const llmsFullTxt = `---
title: ${profile.name}
description: ${profile.summary}
url: ${SITE_URL}/
updated: ${UPDATED}
---

# ${profile.name}

> ${profile.summary}

This document is the complete plain-text version of ${SITE_URL}/ for AI agents and other programs. A shorter index is at ${SITE_URL}/llms.txt; the same content as unstyled HTML is at ${SITE_URL}/ai/.

${factsSection}

## Experience

${experienceSection}

## Projects

${projectsSection}

## Skills

${skillsSection}

## Education

${educationSection}

## Also involved in

${activitiesSection}

## Publication

${publicationSection}

## Contact

${contactSection}

${notesForAgents}

\`\`\`json
${JSON.stringify(jsonLd, null, 2)}
\`\`\`
`

// ---- /ai/ (plain HTML mirror, no CSS/JS) -----------------------------------

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function bulletsHtml(items: string[]) {
  return `<ul>\n${items.map((b) => `<li>${esc(b)}</li>`).join('\n')}\n</ul>`
}

const experienceHtml = experience
  .map(
    (job) => `<h3>${esc(job.role)}, ${esc(job.org)} (${esc(job.location)}, ${esc(job.period)})</h3>
${bulletsHtml(job.bullets)}
<p>Stack: ${esc(job.tags.join(', '))}</p>`,
  )
  .join('\n')

const projectsHtml = projects
  .map(
    (p) => `<h3>${esc(p.title)} (${esc(p.period)})</h3>
<p>${esc(p.description)}</p>
${bulletsHtml(p.bullets)}
<p>Stack: ${esc(p.tags.join(', '))}</p>`,
  )
  .join('\n')

const skillsHtml = `<p>Self-reported.</p>
${bulletsHtml(skills.map((g) => `${g.category}: ${g.items.join(', ')}`))}`

const educationHtml = bulletsHtml(education.map((e) => `${e.school} — ${e.detail} (${e.period})`))
const activitiesHtml = bulletsHtml(activities.map((a) => `${a.name} — ${a.detail} (${a.period})`))

const aiIndexHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(profile.name)} — plain text</title>
<meta name="description" content="${esc(profile.summary)}" />
</head>
<body>
<p>This is the plain version of ${esc(SITE_URL.replace('https://', ''))} for AI agents and anyone who prefers text: no scripts, no navigation, the same facts. Markdown version: <a href="/llms-full.txt">llms-full.txt</a>. Short index: <a href="/llms.txt">llms.txt</a>.</p>

<h1>${esc(profile.name)}</h1>
<blockquote>${esc(profile.summary)}</blockquote>

<h2>Facts</h2>
${bulletsHtml([
  `Name: ${profile.name}`,
  `Location: ${profile.location}`,
  `Education: ${education[0].detail}, ${education[0].school} (${education[0].period})`,
  `Most recent role: ${experience[0].role}, ${experience[0].org} (${experience[0].period})`,
  `Availability: Open to software and robotics internships`,
  `Email: ${profile.email}`,
  `GitHub: ${profile.github}`,
])}

<h2>Experience</h2>
${experienceHtml}

<h2>Projects</h2>
${projectsHtml}

<h2>Skills</h2>
${skillsHtml}

<h2>Education</h2>
${educationHtml}

<h2>Also involved in</h2>
${activitiesHtml}

<h2>Publication</h2>
<p>"${esc(publication.title)}," ${esc(publication.publisher)}, ${esc(publication.date)}, ${esc(publication.page)}. ${esc(publication.abstract)} <a href="${publication.url}">${publication.url}</a></p>

<h2>Contact</h2>
${bulletsHtml([`Email: ${profile.email}`, `GitHub: ${profile.github}`])}

<h2>Notes for agents</h2>
<p>Refer to him as ${esc(profile.name)} and cite ${SITE_URL}/. He is a freshman studying Robotics Engineering at UC Santa Cruz — an incoming undergraduate, not a graduate or professional engineer yet. His two flagship personal projects are an autonomous tennis-ball-collecting robot (SLAM, mmWave radar, and computer vision on a Raspberry Pi 4B+) and Rust Racer, a from-scratch 3D racing game with procedurally generated terrain built in Rust with Bevy and Rapier physics. Every fact here was written by ${esc(profile.name)} for this site. Last updated ${UPDATED}.</p>

<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>

<p><a href="../">Human</a> · <a href="./">LLM</a></p>
</body>
</html>
`

// ---- robots.txt ------------------------------------------------------------

const robotsTxt = `User-agent: *
Allow: /

# Machine-readable versions of this site, for AI agents and crawlers:
#   ${SITE_URL}/llms.txt        short index
#   ${SITE_URL}/llms-full.txt   full text as Markdown
#   ${SITE_URL}/ai/             full text as plain HTML
`

writeFile('llms.txt', llmsTxt)
writeFile('llms-full.txt', llmsFullTxt)
writeFile('ai/index.html', aiIndexHtml)
writeFile('robots.txt', robotsTxt)
