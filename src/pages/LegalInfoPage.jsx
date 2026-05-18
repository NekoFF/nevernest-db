import { Mail, ShieldCheck, Sparkles, Scale } from 'lucide-react'
import Seo from '../components/Seo.jsx'

const pages = {
  about: {
    title: 'About',
    eyebrow: 'Community project',
    icon: Sparkles,
    description: 'Nevernest DB is an unofficial fan and community database for Neverness to Everness reference material.',
    sections: [
      {
        heading: 'What this is',
        body: 'This project organizes character, weapon, module, vehicle, code, news, and build-planning information for community reference. It is built as a fan resource and may contain draft, estimated, or verification-pending data.',
      },
      {
        heading: 'What this is not',
        body: 'Nevernest DB is not an official Neverness to Everness website, is not operated by the game developers or publishers, and does not claim partnership, endorsement, ownership, or official status.',
      },
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    eyebrow: 'Unofficial fan site',
    icon: Scale,
    description: 'Important notes about ownership, accuracy, and source status for this unofficial NTE database.',
    sections: [
      {
        heading: 'Unofficial status',
        body: 'Neverness to Everness names, images, marks, and related game materials belong to their respective rights holders. This database is an unofficial community reference and does not imply affiliation or endorsement.',
      },
      {
        heading: 'Data accuracy',
        body: 'The database tracks source status where possible. Some values are placeholders, estimates, or need verification, and should not be treated as official unless clearly marked by reliable source review.',
      },
      {
        heading: 'Assets and takedown',
        body: 'Game assets, names, and marks belong to their respective owners. A stable public contact or takedown channel should be confirmed before launch so rights holders and community members can report concerns.',
      },
    ],
  },
  privacy: {
    title: 'Privacy',
    eyebrow: 'Privacy baseline',
    icon: ShieldCheck,
    description: 'Current privacy posture for the static and experimental API modes of Nevernest DB.',
    sections: [
      {
        heading: 'Current app behavior',
        body: 'The app does not implement user accounts, real authentication, passwords, cookies for tracking, ads, analytics, or payment flows in this phase.',
      },
      {
        heading: 'Local storage',
        body: 'Static mode may use browser localStorage for local-only admin drafts and planner-style state. Those records stay in the browser unless a future feature explicitly exports or sends them.',
      },
      {
        heading: 'Experimental API mode',
        body: 'API mode is opt-in for local development and read-only testing. Production API hosting and production database access are not enabled yet.',
      },
      {
        heading: 'No public accounts',
        body: 'Public registration, production login, comments, submissions, and production admin writes are not enabled. Local browser drafts remain local unless a user explicitly exports them.',
      },
    ],
  },
  contact: {
    title: 'Contact',
    eyebrow: 'Project contact',
    icon: Mail,
    description: 'Contact guidance for data corrections, source review, and project issues.',
    sections: [
      {
        heading: 'Corrections and source review',
        body: 'For now, track corrections, source concerns, licensing questions, and bug reports in the project issue tracker or the community workflow used by the maintainers.',
      },
      {
        heading: 'Before public launch',
        body: 'A stable public contact and takedown channel should be selected before beta launch. Do not publish personal addresses or production support promises until project ownership and moderation are ready.',
      },
    ],
  },
}

export default function LegalInfoPage({ page = 'about' }) {
  const content = pages[page] || pages.about
  const Icon = content.icon

  return (
    <div className="space-y-6 pb-6">
      <Seo title={content.title} description={content.description} canonicalPath={`/${page}`} />
      <section className="overflow-hidden rounded-[32px] border border-black/[0.06] bg-white/92 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.065)] sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#ff2f6d]/10 text-[#ff2f6d]">
            <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden />
          </div>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff2f6d]">{content.eyebrow}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#111111] sm:text-4xl">{content.title}</h1>
            <p className="mt-3 text-base leading-8 text-[#6b7280]">{content.description}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {content.sections.map((section) => (
          <section key={section.heading} className="rounded-[24px] border border-black/[0.06] bg-white/90 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.045)]">
            <h2 className="text-lg font-bold tracking-tight text-[#111111]">{section.heading}</h2>
            <p className="mt-3 text-sm leading-7 text-[#6b7280]">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
