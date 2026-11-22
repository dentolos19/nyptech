# Product Specifications

## Purpose

NYPTech is the public website of NYP Technopreneurship, a student-led community at Nanyang Polytechnic for students exploring entrepreneurship. It introduces the club, showcases startups from its community, and directs students to register their interest.

## Users

- **Students**: Nanyang Polytechnic students at any stage, from exploring with no idea yet to running an early venture.
- **Visitors**: Anyone looking up the club, its startups, or its contact and social channels.

## Core Features

The site is a single landing page in [`src/routes/index.tsx`](src/routes/index.tsx) with these sections:

- **Navigation**: Anchor links to the program, startups, and FAQ sections, plus a contact button.
- **Hero**: The headline and calls to action to register interest through an external form or to see the startups.
- **Stats**: Headline figures for startups, mentors, funding support, and events.
- **Program overview**: What the club offers, including workshops, founder conversations, community events, and funding guidance.
- **Who should apply**: The personas the club serves and what applicants do not need.
- **Success stories**: Short stories from community startups.
- **Startups showcase**: Community startups with descriptions and links, pinned and animated on wide screens and stacked on small screens or with reduced motion.
- **FAQ**: Common questions in an accordion.
- **Final call to action and footer**: Contact by email, links to Instagram, LinkedIn, Discord, and Telegram.

## Scope

- Site content is defined as constants at the top of [`src/routes/index.tsx`](src/routes/index.tsx).

### Out of Scope

- The site has no accounts, database, or Worker secret bindings.
- Applications and inquiries are handled outside the site, through the external interest form and email.
