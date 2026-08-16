# improveMe — Product Specification

**Product:** improveMe
**Category:** Proactive AI accountability / personal growth
**Core idea:** Users tell improveMe what they want to improve. improveMe turns it into a realistic goal, breaks it into behaviors, and **proactively checks in with the user throughout the day** to help them follow through.

> **“You tell me what you want to become. I help you actually do it.”**

---

# 1. PRODUCT OVERVIEW

## The Problem

People have goals they genuinely care about—fitness, productivity, content creation, studying, career, home, personal development—but struggle to consistently execute them.

Existing tools mostly require the user to initiate:

> Open app → remember goal → check task → track progress.

**improveMe reverses this.**

> Set goal → AI remembers → AI reaches out → user responds → AI adapts → user takes action.

### Core product promise

**improveMe is the AI accountability bestie that talks to you first.**

It doesn't just tell users *what* to do.

It helps them **actually do it**.

---

# 2. ICP

### Initial ICP

Women, roughly 20–30, who:

* Have multiple personal goals
* Frequently start things but struggle with consistency
* Want to “get their life together”
* Are comfortable using AI
* Want accountability but don't necessarily want a human coach
* Are interested in fitness, productivity, career, content, personal growth, or lifestyle improvement

### Initial niche

The **“glow-up / get-my-life-together” woman**.

The product can later expand beyond this demographic.

---

# 3. CORE USER OUTCOME

> **Turn an intention into consistent action.**

The user should finish a period of using improveMe thinking:

> **“I actually did the things I said I was going to do.”**

Not:

> “I spent a lot of time chatting with an AI.”

---

# 4. CORE PRODUCT LOOP

```text
USER HAS AN INTENTION
        ↓
"Improve my fitness"
        ↓
AI CLARIFIES THE GOAL
        ↓
SMART GOAL GENERATED
        ↓
USER APPROVES / EDITS
        ↓
AI BREAKS GOAL INTO ACTIONS
        ↓
AI SCHEDULES CHECK-INS
        ↓
AI INITIATES CONVERSATION
        ↓
USER TAKES ACTION
        ↓
AI CHECKS COMPLETION
        ↓
AI ADAPTS WHEN USER STRUGGLES
        ↓
PROGRESS + REINFORCEMENT
        ↓
REPEAT
```

---

# 5. CORE USER FLOW

## Step 1 — Psychological onboarding

Do **not** immediately ask the user to create an account.

Start with:

> **What do you want to improve?**

Categories:

* 🏋️ Health & Fitness
* 💼 Career
* 🎥 Content Creation
* 📚 Learning
* 🏠 Home & Life
* 🧠 Personal Growth
* ✨ Something else

---

## Step 2 — Discover the real goal

User enters:

> “I want to get better at content creation.”

AI asks:

> **“What would ‘better’ look like?”**

User:

> “I want to get comfortable talking on camera.”

AI:

> “What's stopping you right now?”

User:

> “I feel awkward and never practice.”

The AI now understands the actual problem.

---

# 6. AI-GENERATED SMART GOAL

The AI generates:

### Your 30-Day Goal

**Become more comfortable speaking on camera by practicing for 5 minutes every weekday for 30 days.**

**Action:** Record yourself speaking
**Frequency:** 5x/week
**Duration:** 5 minutes
**Time:** 10:00 AM
**Success:** Complete 20 practice sessions

Then:

> **Does this feel realistic?**

Buttons:

**Looks good**

**Change it**

The user must approve the goal.

### Important

AI-generated goals are **suggestions, not commands**.

The user owns the commitment.

---

# 7. GOAL BREAKDOWN

After approval:

### Your goal

**Become comfortable on camera.**

### This week's actions

**MON**
5-minute recording

**TUE**
5-minute recording

**WED**
5-minute recording

**THU**
5-minute recording

**FRI**
5-minute recording

The user does not need to manually create 20 tasks.

**The AI does the planning work.**

---

# 8. ACCOUNT CREATION

Only after the user has created a meaningful goal:

> **Let's save your plan.**

Create account:

* Apple
* Google
* Email

The account stores:

* Goals
* Commitments
* Schedule
* Progress
* Preferences

---

# 9. ACCOUNTABILITY PERSONALITY

### How should improveMe hold you accountable?

**💗 Encourage me**

> “You've got this.”

**🔥 Push me**

> “You said you'd do it. Let's go.”

**👀 Call me out**

> “You keep saying this matters. Let's actually do it.”

**🤍 Be gentle**

> “Today didn't go as planned. Let's figure out what we can realistically do.”

This changes the AI's communication style.

---

# 10. PROACTIVE AI

This is the **core product feature**.

The user should not have to open improveMe.

### Example

Goal:

> Record content at 10 AM.

At 9:50:

> **“Content practice in 10 minutes 🎥
> Remember: today's goal is just 5 minutes. You don't have to post it.”**

At 10:15:

> **“How did it go?”**

User:

> “I didn't do it.”

AI:

> **“Okay. What got in the way?”**

User:

> “I felt awkward.”

AI:

> “That makes sense. Let's make today's version easier. Record for just 2 minutes. No posting, no editing. Just practice.”

CTA:

**I'll do 2 minutes**

---

# 11. ADAPTIVE ACCOUNTABILITY

The AI should **not simply repeat reminders**.

It should respond to behavior.

### If user succeeds

> “Day 4 done. You're building evidence that you can actually follow through.”

### If user misses once

> “No big deal. Want to move today's goal to 5 PM?”

### If user repeatedly misses

> “You've missed the last three sessions. I don't think the current plan is realistic. Want to adjust it?”

The system should optimize for **consistency**, not punishment.

---

# 12. MULTIPLE GOALS

MVP should support **multiple goals**, but keep the experience controlled.

Example:

### My Goals

🏋️ **Gym 3x/week**

🎥 **Content practice 5x/week**

🏠 **Clean apartment 15 min/day**

Each goal has:

* Desired outcome
* SMART goal
* Actions
* Schedule
* Completion history

### Important constraint

Don't let users create unlimited goals during onboarding.

The MVP should encourage **1–3 active goals**.

Otherwise improveMe becomes another overwhelming productivity dashboard.

---

# 13. HOME SCREEN

The home screen should answer:

> **“What do I need to do today?”**

Example:

# Good morning, Coral 💗

### Today

**10:00 AM**

🎥 Content practice
**5 minutes**

**6:00 PM**

🏋️ Gym
**45 minutes**

---

### Progress

**7 / 10 commitments completed**

**70% consistency**

---

### AI message

> “You've been strongest when you keep your commitments small. Let's keep today's focus simple.”

---

# 14. GOAL SCREEN

Each goal gets a simple page.

### Content Creation

**30-day goal**

> Practice speaking on camera 5x/week.

### Progress

**12 / 20 sessions**

### Consistency

**60%**

### Upcoming

Today — 10 AM
Tomorrow — 10 AM

### AI insight

> “You tend to complete your practice when you do it before noon.”

The AI can surface useful patterns later, but keep analytics simple in MVP.

---

# 15. AI CHAT

There should be a chat interface, but it should **not be the primary experience**.

The user can open it and say:

> “I have no motivation today.”

or:

> “Can we move my workout?”

or:

> “I have a crazy day tomorrow.”

The AI uses the user's goals and commitments as context.

But the product philosophy remains:

> **The AI initiates more than the user does.**

---

# 16. NOTIFICATION EXPERIENCE

Notifications are a core part of the product.

### Before action

> “Hey bestie 👀 content practice in 15 minutes.”

### At action time

> “It's go time. 5 minutes. That's all you committed to.”

### After

> “Done?”

### Missed

> “You said you'd do it today. What happened?”

### Recovery

> “Let's not turn one missed day into a missed week.”

### Weekly

> “You completed 12/15 commitments this week. That's 80%. Want to keep going?”

---

# 17. PAGES / SCREENS

## Public

1. Landing page

## Onboarding

2. What do you want to improve?
3. Why does it matter?
4. What's stopping you?
5. Future-self reflection
6. AI-generated SMART goal
7. Goal approval
8. Commitment length
9. Accountability style
10. Account creation

## App

11. Home / Today
12. Goal detail
13. Check-in
14. Recovery
15. AI chat
16. Weekly recap
17. Settings

## Monetization

18. Trial/paywall

---

# 18. COMPONENTS

### Goal

* Goal card
* Goal category
* Progress indicator
* SMART goal card
* Action card
* Schedule selector

### Accountability

* AI message
* Check-in buttons
* Completion button
* Missed-state card
* Recovery card

### Progress

* Weekly completion
* Consistency percentage
* Commitment counter
* Weekly recap

### Onboarding

* Goal selector
* Text input
* Multiple-choice cards
* Commitment selector
* AI goal preview
* Confirmation

---

# 19. DESIGN SYSTEM

### Brand personality

**Aspirational + warm + direct + supportive.**

It should feel like:

> **your cool, ambitious friend who actually remembers what you told her you were going to do.**

Not:

* Corporate productivity software
* Medical wellness app
* Generic chatbot
* Children's habit tracker

### Colors

**Background:** warm cream

**Primary:** blush / rose

**Accent:** deep plum / mauve

**Text:** charcoal

**Success:** muted green

### Typography

Use **Inter, DM Sans, or similar modern sans-serif.**

Large headlines should feel editorial and confident.

### UI

* Rounded cards
* 16–24px radius
* Large touch targets
* Lots of whitespace
* Soft gradients
* Minimal navigation
* One primary CTA

---

# 20. DATA MODEL

### User

```text
id
name
email
created_at
timezone
accountability_style
subscription_status
```

### Goal

```text
id
user_id
title
category
why
obstacle
desired_outcome
start_date
end_date
status
```

### SMART Goal

```text
id
goal_id
specific
measurable
achievable
relevant
time_bound
user_approved
```

### Action

```text
id
goal_id
title
scheduled_date
scheduled_time
duration
status
```

### Check-in

```text
id
action_id
user_id
status
response
completed_at
```

### AI Interaction

```text
id
user_id
goal_id
message
response
context
created_at
```

### Notification

```text
id
user_id
action_id
scheduled_at
sent_at
status
```

---

# 21. AI SYSTEM

The AI needs to understand:

### User

* Goals
* Motivation
* Obstacles
* Accountability style

### Goal

* Desired outcome
* SMART goal
* Timeline
* Actions

### Behavior

* Completed actions
* Missed actions
* Rescheduled actions
* Recent check-ins

### AI responsibilities

1. Clarify vague goals
2. Generate SMART goals
3. Break goals into actions
4. Generate personalized check-ins
5. Respond to user context
6. Detect when a goal needs adjustment
7. Help recover after missed actions
8. Generate weekly recap

---

# 22. TECH STACK

### Frontend

**Next.js + React + Tailwind**

### Backend

**Next.js API routes / server actions**

### Database

**Supabase / PostgreSQL**

### Authentication

**Supabase Auth**

### AI

**OpenAI API**

### Notifications

Start with:

**Push notifications**

Potentially add SMS once the behavior is validated.

### Payments

**Stripe**

### Hosting

**Vercel**

### Storage

**Supabase Storage**, only if the MVP requires user-uploaded proof.

---

# 23. SIMPLE ARCHITECTURE

```text
                improveMe
                    │
          ┌─────────▼─────────┐
          │    Next.js App    │
          └─────────┬─────────┘
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
   Supabase       OpenAI       Stripe
   Auth/DB         AI          Billing
       │
       ▼
 Scheduled Jobs
       │
       ▼
 Proactive Notifications
       │
       ▼
      USER
```

The critical infrastructure is the **scheduled notification → AI context → user response → action update** loop.

---

# 24. MVP

Do **not** build the full vision initially.

The smallest version should support:

### ONE goal

User says:

> “I want to get better at content creation.”

### AI creates

> **Record yourself speaking for 5 minutes every weekday for 30 days.**

### User approves

↓

### User chooses schedule

↓

### AI proactively messages

> “Content practice in 10 minutes.”

↓

### User completes/misses

↓

### AI follows up

↓

### AI adapts

↓

### Weekly recap

↓

### User continues.

That's enough to test the thesis.

---

# 25. OUT OF SCOPE

Do **not** build:

* ❌ Full fitness platform
* ❌ Workout database
* ❌ Nutrition tracking
* ❌ Calorie tracking
* ❌ Social network
* ❌ Community
* ❌ Habit marketplace
* ❌ Human coaches
* ❌ Wearable integrations
* ❌ Apple Health
* ❌ Calendar integrations
* ❌ Complex analytics
* ❌ AI voice calls
* ❌ AI image analysis
* ❌ Multiple AI personalities
* ❌ Gamified points economy
* ❌ Leaderboards
* ❌ Unlimited goal creation
* ❌ Complex project management
* ❌ Generic “ask AI anything” experience

---

# 26. ACCEPTANCE CRITERIA

The MVP is done when a stranger can:

* [ ] Enter a vague goal
* [ ] Explain why they want it
* [ ] Identify what's stopping them
* [ ] Receive an AI-generated SMART goal
* [ ] Edit/approve the goal
* [ ] Choose a commitment period
* [ ] Create an account
* [ ] Set a schedule
* [ ] Choose accountability style
* [ ] Receive a proactive notification
* [ ] Respond to the AI
* [ ] Complete an action
* [ ] Miss an action
* [ ] Receive an adaptive follow-up
* [ ] Reschedule/recover
* [ ] See basic progress
* [ ] Receive a weekly recap
* [ ] Reach a payment screen
* [ ] Subscribe

---

# 27. THE NORTH STAR

Don't optimize for:

**DAU**

**Messages sent**

**Time in app**

**Number of goals**

The product exists to create one outcome:

# **Follow-through**

The north-star behavioral metric should eventually be:

> **% of committed actions completed.**

And the business validation question is:

> **Will people pay for an AI that proactively helps them follow through?**

If the answer is yes, **improveMe can expand from a niche “glow-up bestie” into a much larger personal execution platform.**
