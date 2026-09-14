# 0006 — Site structure and navigation

Date: 2026-09-14
Status: Accepted

## Context

The home page was the only screen. The top bar stretched edge to edge while
content sat in a narrower column, and there was no place for the core skills
to live. The platform is meant to be the one place a Mongolian learner
improves English, so the four skills need to be visible from day one, even
before their modules exist.

## Decision

- **Four skill routes at the top level:** `/listening`, `/reading`,
  `/writing`, `/speaking`. Defined once in `src/lib/skills.ts`; nav, footer
  and module list read from it.
- **Shared shell:** `src/app/(site)/layout.tsx` renders the navbar, footer
  and mobile tab bar for every public page. `/login` and `/brand` stay
  outside the group (full-screen / internal).
- **One page width:** `Container` (`max-w-6xl`, 16px/24px gutters) is used
  by header, content and footer so edges line up.
- **Navigation:** desktop shows Нүүр + 4 skills inline in the top bar;
  mobile (< lg) shows the same five items as a bottom tab bar. Account
  actions (login / profile menu) stay top-right on both.
- Each skill page is an explicit folder rendering a shared `SkillPage`
  placeholder ("coming soon" + planned features + link to the tracker).
  When a module ships, its folder replaces the placeholder with real content.

## Consequences

- Vocabulary and grammar are *not* in the main nav; they are cross-cutting
  and will attach to skills or the hub later. Revisit if they become
  standalone destinations.
- Adding a fifth nav item on mobile would crowd the tab bar — anything
  beyond these five goes in the hub or profile menu.
