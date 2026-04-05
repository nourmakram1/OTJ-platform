

## Enrich Mock UI Cards Across All 4 Steps

### What changes

The mock UI cards in the "How It Works" walkthrough will be upgraded to be more descriptive and showcase deeper platform features. The biggest change is Step 01, but all steps get improvements.

### Step 01 — Discover & Brief (biggest upgrade)

Add a **third card**: a "Custom Survey" mock showing that creatives can set up their own intake questions that clients fill out. This is a key differentiator.

Current cards: CreativeCard + BriefCard → New cards: **CreativeCard + BriefCard + SurveyCard**

The **MockSurveyCard** will show:
- Header: "Creative's Survey" with a "STEP 2/2" badge (matching the brief's "STEP 1/2")
- 3-4 pre-filled sample questions like "What's your brand personality?", "Do you have existing brand guidelines?", "Preferred visual style?" with radio/checkbox/text mock inputs
- A "Send Brief →" button at the bottom
- This tells the story: the creative customizes their intake, the client fills it out

Also refine the **MockBriefCard** to feel more filled-in — add faint placeholder text inside the input fields (e.g., "Re-brand campaign", "Branding", "8,000 – 12,000 EGP") so it reads more like a real form.

### Step 02 — Book & Confirm (minor upgrade)

Add a small **"Counter Offer" badge/row** to the ProposalCard showing the negotiation feature — e.g., a row that says "✎ Counter-offer sent — 10,500 EGP" to show both sides can negotiate.

### Step 03 — Manage & Track (minor upgrade)

Add a **mini messaging preview** row inside the DashboardCard — a small chat bubble snippet showing "Sarah: Updated concepts attached ✓" to hint at built-in messaging.

### Step 04 — Deliver & Archive (no change)

Already descriptive enough with deliverables list + review stars.

### File Changes
- **`src/pages/LandingPage.tsx`** — Add `MockSurveyCard` component, update `MockBriefCard` with placeholder text, add counter-offer row to `MockProposalCard`, add messaging snippet to `MockDashboardCard`, update Step 01's children to include all 3 cards.

