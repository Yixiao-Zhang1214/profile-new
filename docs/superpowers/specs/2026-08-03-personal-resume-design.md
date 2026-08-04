# Sidekick-Inspired Personal Resume Website Design

Date: 2026-08-03
Status: Revised and approved through visual references

## 1. Product Goal

Create a single-page personal resume and portfolio website that closely follows the information rhythm and immersive scrolling structure of Shopify Sidekick while remaining an original personal brand experience.

The site must work for two audiences:

- Recruiters evaluating the candidate for product-management roles.
- Collaborators or visitors exploring the candidate's broader personal identity and creative work.

The initial version uses polished sample copy and explicit media/content slots so real text, photographs, project screenshots, and links can be replaced later without changing the layout.

## 2. Core Narrative

The narrative moves from a concise professional promise to a broader portrait of a multidisciplinary person:

1. Observe and communicate as a journalism and communication student.
2. Frame problems and make product decisions as an AI product manager.
3. Explore unfamiliar contexts as a traveler.
4. Notice and document details as a photographer.
5. Turn ideas into working prototypes as an AI builder.

These are presented as five connected facets of one person, not five unrelated biographies.

## 3. Design Direction

### Chosen approach

Use a character-led, high-fidelity structural adaptation of the reference page:

- The person is the visual stage, not a supporting photo inside a card.
- The opening viewport is a full-screen editorial poster with one oversized 3D character.
- Five full-screen identity scenes use the same repeated composition: character on the left; identity statement and related projects on the right.
- Large type, minimal corner metadata, warm paper colors, and subtle texture create the cinematic atmosphere.
- Projects live inside the identity they prove instead of in a separate generic project wall.
- A restrained closing profile and contact area completes the page without breaking the character-led narrative.

### Alternatives considered

- A conventional recruiter-first portfolio would scan faster but would lose the distinctive Sidekick experience requested by the user.
- A reduced-motion editorial resume would be simpler to implement but would weaken the role-switching concept.

The chosen approach keeps the reference site's pacing while ensuring essential resume information remains reachable through navigation and clear section labels.

### Visual language

- Primary background: warm white, approximately `#F4F0E8`.
- Primary text: near-black, approximately `#171714`.
- Accent: muted moss and deep brown-green, approximately `#6F765C` and `#31372B`.
- Secondary surfaces: warm sage, sand, and faded clay.
- Typography: modern sans-serif with light display weights, large headlines, and compact supporting copy.
- Corners: large radii on project modules; character artwork itself remains unframed and visually dominant.
- Decoration: subtle paper grain, fine rules, quiet shadows, and CSS shapes; no copied Shopify assets or branding.

## 4. Page Architecture

### 4.1 Minimal overlay navigation

Purpose: keep the page usable as a resume while preserving the landing-page atmosphere.

Contents:

- Placeholder personal name and discipline in the upper-left corner.
- About.
- Roles.
- Selected work.
- Journey.
- Contact.
- Download resume button with a placeholder file target.

Behavior:

- Transparent overlay on the hero; warm-white overlay after the hero.
- Uses small editorial typography so it never competes with the character.
- Collapses into a compact mobile menu on narrow screens.

### 4.2 Full-screen hero

Purpose: state the candidate's professional promise within seconds.

Composition:

- One supplied 3D character is centered and fills most of the viewport height.
- The background is pale warm yellow with subtle grain.
- The hero uses the supplied laughing head-and-shoulders 3D character, extracted onto a transparent background so the page color remains uninterrupted.
- Small name/discipline metadata sits in the upper-left; portfolio/year metadata sits in the upper-right.
- A large `ABOUT ME` placeholder title crosses the character's lower torso without covering the face.
- A short centered positioning statement sits below the title.
- A small scroll cue anchors the bottom edge.
- No split hero, floating UI card, prominent button cluster, or boxed image frame.

### 4.3 Identity transition

Purpose: introduce the five-role structure.

Suggested heading: “Meet the five sides of me. One curious builder.”

The transition is compact. It introduces the idea that one person contains five connected ways of seeing and making, then immediately hands off to the first identity scene.

### 4.4 Five-role scroll sequence

Purpose: serve as the central storytelling device.

Each identity scene contains:

- A large full-height 3D character on the left, occupying roughly 42 percent of the desktop viewport. Supplied character art is extracted to transparent PNG before placement so no source-image rectangle interrupts the scene background.
- A small identity label, oversized statement, and short self-introduction on the right.
- Two project modules nested under the introduction. Each module has a cover slot, project name, type, short result, and disabled placeholder link.
- A small skill line and scene index for orientation.

Role order:

1. Journalism and communication student.
2. AI product manager.
3. Traveler.
4. Photographer.
5. AI builder.

Desktop behavior:

- Each identity scene is at least one viewport tall and stacks with a restrained sticky-card transition.
- The left character remains the dominant anchor while the right side carries the readable evidence.
- Transitions use opacity and small vertical movement; there is no scroll trapping.

Mobile behavior:

- Character appears first and occupies roughly 55 to 65 percent of the viewport height.
- Text and project modules follow below in one column.
- All information stays readable without animation or hover.

### 4.5 Projects inside identities

Purpose: make every identity credible at the exact point it is introduced.

- The separate selected-work card stack is removed.
- Each identity owns two replaceable project modules on its right side.
- Replacing a project requires only its cover, title, type, one-line result, and link.
- Projects remain keyboard reachable and linear on mobile.

### 4.6 Compact capability statement

Purpose: summarize cross-identity strengths without introducing another competing card system.

Example cards:

- `/product-strategy`
- `/user-research`
- `/ai-prototyping`
- `/storytelling`
- `/photography`
- `/rapid-building`

Capabilities render as a simple typographic rail rather than large cards.

### 4.7 Personal story and journey

Purpose: add depth without turning the opening sections into a conventional resume.

Contents:

- Large editorial image or short-video slot.
- Short personal statement.
- Education and experience timeline with replaceable entries.
- Optional location or travel map summary rendered as text and simple shapes rather than an authored SVG illustration.

### 4.8 Contact call to action

Purpose: provide an unmistakable next step.

Contents:

- High-contrast rounded panel.
- Suggested heading: “Let's build something worth remembering.”
- Short availability statement.
- Email and collaboration buttons.
- Portrait or personal symbol placeholder.

### 4.9 Practical FAQ

Purpose: answer recruiter and collaborator questions without crowding the main narrative.

Accordion items:

- What roles are you looking for?
- Where are you based?
- Are you open to internships, full-time roles, or freelance work?
- What tools do you use?
- How can I see the full resume or contact you?

### 4.10 Footer

Contents:

- Name and short positioning line.
- Email.
- LinkedIn or equivalent professional profile placeholder.
- Photography or social profile placeholder.
- Resume download.
- Copyright line.

## 5. Content Model

All replaceable content should be defined in a small structured data module rather than scattered through layout code.

Suggested groups:

- `profile`: name, headline, bio, availability, email, resume URL.
- `roles`: five role objects with label, headline, body, media, and artifact.
- `projects`: title, category, role, outcome, cover, link.
- `capabilities`: command-style label and description.
- `journey`: year, title, organization or location, description.
- `faq`: question and answer.
- `socialLinks`: label and URL.

Missing media should render a designed placeholder showing the recommended asset type and aspect ratio. Missing links should render as visually disabled controls rather than broken anchors.

## 6. Component Boundaries

- `SiteHeader`: navigation, mobile menu, and resume action.
- `Hero`: opening statement and hero media composition.
- `IdentityIntro`: transition into the five-role story.
- `RoleShowcase`: role data orchestration and responsive layout.
- `IdentityScene`: one reusable left-character/right-content presentation.
- `IdentityProject`: compact project evidence module inside an identity.
- `CapabilityRail`: compact typographic skill strip.
- `JourneySection`: personal statement and timeline.
- `ContactPanel`: final contact action.
- `FaqAccordion`: accessible disclosure controls.
- `SiteFooter`: final navigation and social links.
- `MediaPlaceholder`: reusable slot for images, videos, and project screens.

Each component receives data through props and does not own the resume content itself.

## 7. Interaction and Accessibility

- Smooth anchor navigation with visible keyboard focus.
- Reduced-motion preference disables nonessential transforms and animated rails.
- Role transitions never hide information from screen readers.
- Accordion controls expose expanded state and remain keyboard operable.
- Text contrast meets WCAG AA against the warm-white and accent surfaces.
- Touch targets are at least 44 pixels.
- Decorative elements are hidden from assistive technologies.

## 8. Responsive Behavior

- Desktop: immersive scroll composition, overlapping cards, wide whitespace.
- Tablet: simplified sticky composition with reduced overlap.
- Mobile: linear reading order, horizontal card scrolling, compact navigation, and no dependency on hover.

The mobile version preserves the story order and visual character rather than attempting to reproduce every desktop animation.

## 9. Failure and Edge Handling

- Broken or absent images fall back to the matching `MediaPlaceholder`.
- Empty content groups hide their section cleanly.
- External links open safely and visibly identify their destination where useful.
- Resume download remains disabled until a real file URL is supplied.
- JavaScript animation failure leaves a complete, readable static page.

## 10. Validation Criteria

The first version is complete when:

- All ten page regions render in the approved order.
- The five roles are visually distinct but narratively connected.
- Every text and media area has realistic sample content or a deliberate replacement slot.
- Navigation reaches the correct sections.
- The page works at representative desktop and mobile widths.
- Keyboard navigation, focus states, accordion behavior, and reduced-motion behavior work.
- The production build succeeds without runtime errors.
- The site contains no copied Shopify logo, mascot, imagery, or text.

## 11. Scope Boundary

The first version is a polished, single-page static portfolio. It does not include a CMS, authentication, analytics dashboard, multilingual switching, or a contact-form backend. Those can be added later without changing the core page architecture.
