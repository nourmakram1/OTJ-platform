

## Landing Page Redesign Plan

### Problem
The current landing page is cluttered — the feature showcase cards (Brief Survey, Dashboard, Project Overview) are repetitive and don't clearly walk users through the platform's value. The structure lacks a narrative flow.

### New Structure

The page will be reorganized into a clear storytelling arc with 7 distinct sections, each serving a purpose:

**1. Nav** — Same OTJ nav, keep as-is.

**2. Hero** — Bold headline + subtitle + dual CTAs (Sign Up / Log In). Tighter copy: "Where Egypt's Creative Work Gets Done." Remove the separate subtitle section.

**3. Category Grid** — Moved up, right after hero. Same 11 categories but presented as pill-style buttons (rounded-full, border, icon + name only — no sub-text). Compact, scannable, acts as social proof of scope.

**4. How It Works — 4-Step Walkthrough** — The core redesign. Each step gets a full-width section with:
- Step number + title on the left
- Description paragraph
- A realistic mini UI mockup card on the right (like the reference style — floating cards with subtle shadows)

The 4 steps, based on actual platform features:

| Step | Title | Mock UI |
|------|-------|---------|
| 01 | Discover & Brief | Creative card + brief form fields (project name, type, budget, timeline) |
| 02 | Book & Confirm | Calendar selection + proposal summary (phases, price, milestones) |
| 03 | Manage & Track | Dashboard stats + active project card with progress bars |
| 04 | Deliver & Archive | Completed project card with green status + deliverables list + review stars |

Each step section alternates layout (left text / right card, then right text / left card) for visual rhythm.

**5. Manifesto** — Keep the bold statement block but refine the copy.

**6. CTA Section** — "Hello, Welcome to One Time Job" with Sign Up / Log In buttons.

**7. Footer** — Same as current.

### Visual Style
- Same OTJ tokens (otj-off, otj-blue, otj-green, border, foreground)
- Mock UI cards use `bg-card border border-border rounded-2xl` with inner nested cards — matching the reference's floating card aesthetic
- Category pills use `rounded-full border border-border` with icon + name, hover to foreground
- Step numbers in large bold text (e.g., "01") as an accent
- No images — all UI is built with Tailwind components

### File Changes
- **`src/pages/LandingPage.tsx`** — Full rewrite with the new structure

