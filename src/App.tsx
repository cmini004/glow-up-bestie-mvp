import { useState, useEffect, useRef } from 'react'
import React from 'react'
import { useAuth } from './lib/auth'
import { generateGoal } from './lib/api'
import { getMe } from './lib/api'
import {
  HeartPulse, BriefcaseBusiness, Video, BookOpen, House, Sparkles, Target,
  Sun, MessageCircle, UserRound, ArrowRight, ChevronLeft,
  Check, Clock, Calendar, Plus, Bell,
} from 'lucide-react'

// ─── Brand tokens ─────────────────────────────────────────────────────────────
// bg-[#FCF8F6]   warm cream background
// bg-[#FFFFFF]   surface
// text-[#30262B] charcoal text
// text-[#81757B] secondary text
// text-[#A89BA1] muted text
// bg-[#D98C9D]   rose primary
// bg-[#F3DDE2]   rose subtle
// bg-[#D98C9D]   plum accent
// bg-[#F3DDE2]   plum subtle
// bg-[#9CAF9A]   success green
// border-[#EAE1E3] border

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen =
  | 'splash'
  | 'landing'
  | 'o1-category'
  | 'o2-discover'
  | 'o3-obstacle'
  | 'o4-smart-goal'
  | 'o5-breakdown'
  | 'o6-commitment'
  | 'o7-accountability'
  | 'o-name-bestie'
  | 'o8-account'
  | 'home'
  | 'goals'
  | 'checkin'
  | 'completion'
  | 'recovery'
  | 'weekly-recap'
  | 'chat'
  | 'paywall'

interface UserData {
  name: string
  email: string
  categories: string[]
  categoryOther: string
  goalText: string
  whyText: string
  obstacle: string
  obstacles: string[]
  smartGoalApproved: boolean
  commitmentDays: number
  customDays: string
  accountabilityStyle: string
  bestieName: string
}

const SCREEN_ORDER: Screen[] = [
  'splash', 'landing',
  'o1-category', 'o2-discover', 'o3-obstacle',
  'o6-commitment',
  'o4-smart-goal', 'o5-breakdown',
  'o7-accountability', 'o-name-bestie', 'o8-account',
  'home', 'checkin', 'completion', 'recovery', 'weekly-recap', 'paywall',
]

const PROGRESS_SCREENS: Screen[] = [
  'o1-category', 'o2-discover', 'o3-obstacle',
  'o6-commitment',
  'o4-smart-goal', 'o5-breakdown',
  'o7-accountability', 'o-name-bestie',
]

const APP_SCREENS: Screen[] = ['home', 'goals', 'weekly-recap', 'chat', 'paywall']

const BACK_SCREENS: Screen[] = [
  'o2-discover', 'o3-obstacle', 'o6-commitment',
  'o4-smart-goal', 'o5-breakdown',
  'o7-accountability', 'o-name-bestie', 'o8-account',
]

// ─── Primitives ───────────────────────────────────────────────────────────────

function ProgressBar({ screen }: { screen: Screen }) {
  const idx = PROGRESS_SCREENS.indexOf(screen)
  if (idx === -1) return null
  const pct = Math.round(((idx + 1) / PROGRESS_SCREENS.length) * 100)
  return (
    <div className="w-full h-[3px] bg-[#EAE1E3] rounded-full overflow-hidden">
      <div
        className="h-full bg-[#D98C9D] rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function Btn({
  children, onClick, disabled, variant = 'primary',
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark'
}) {
  const base = 'w-full font-semibold text-[16px] transition-all duration-200 active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed'
  const variants = {
    primary: `py-[17px] px-6 rounded-[14px] bg-[#D98C9D] text-white shadow-[0_4px_20px_rgba(217,140,157,0.3)] ${base}`,
    secondary: `py-[15px] px-6 rounded-[14px] border border-[#D98C9D] bg-white text-[#D98C9D] ${base}`,
    ghost: `py-3 text-[#81757B] hover:text-[#D98C9D] font-medium text-[15px] transition-colors duration-150`,
    dark: `py-[16px] px-6 rounded-[14px] bg-[#30262B] text-white ${base}`,
  }
  return (
    <button onClick={onClick} disabled={disabled} className={variants[variant]}>
      {children}
    </button>
  )
}

function AIBubble({ children, label = 'glowup bestie' }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="bg-white rounded-2xl rounded-tl-sm p-5 border border-[#EAE1E3] shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-6 h-6 rounded-lg bg-[#D98C9D] flex items-center justify-center flex-shrink-0">
          <Sparkles size={12} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="text-[11px] font-semibold text-[#D98C9D] tracking-wide uppercase">{label}</span>
      </div>
      <div className="text-[#30262B] text-[15px] leading-relaxed">{children}</div>
    </div>
  )
}

function Shell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`min-h-screen bg-[#FCF8F6] flex flex-col ${className}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {children}
    </div>
  )
}

function OShell({ screen, children }: { screen: Screen; children: React.ReactNode }) {
  return (
    <Shell className="px-4 pt-[53px] pb-10">
      <div className="mb-7"><ProgressBar screen={screen} /></div>
      {children}
    </Shell>
  )
}

// ─── Splash ───────────────────────────────────────────────────────────────────

function SplashScreen({ onNext }: { onNext: () => void }) {
  useEffect(() => { const t = setTimeout(onNext, 1600); return () => clearTimeout(t) }, [onNext])
  return (
    <Shell className="items-center justify-center gap-4">
      <div className="w-[68px] h-[68px] rounded-[20px] bg-[#D98C9D] flex items-center justify-center shadow-[0_8px_28px_rgba(217,140,157,0.38)]">
        <span className="text-white text-[28px] font-black">G</span>
      </div>
      <div className="text-center">
        <p className="text-[28px] font-bold tracking-[-0.02em] text-[#30262B]">Glow Up Bestie</p>
        <p className="text-[14px] text-[#A89BA1] mt-1 font-medium">your AI accountability partner</p>
      </div>
    </Shell>
  )
}

// ─── Landing ─────────────────────────────────────────────────────────────────

function LandingScreen({ onNext }: { onNext: () => void }) {
  return (
    <Shell className="px-4 pb-10">
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-6 pt-[97px]">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D98C9D] flex items-center justify-center shadow-[0_4px_16px_rgba(217,140,157,0.35)]">
              <span className="text-white text-[16px] font-black">G</span>
            </div>
            <p className="text-[18px] font-bold text-[#30262B]">Glow Up Bestie</p>
          </div>

          <div>
            <h1 className="text-[40px] font-bold text-[#30262B] leading-[1.1]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Meet the version<br />
              of you who<br />
              <em className="text-[#D98C9D] not-italic">actually follows<br />through.</em>
            </h1>
          </div>

          {/* Demo notification card */}
          <div className="bg-white rounded-2xl border border-[#EAE1E3] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#EAE1E3]">
              <div className="w-7 h-7 rounded-lg bg-[#D98C9D] flex items-center justify-center">
                <span className="text-white text-[10px] font-black">G</span>
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-semibold text-[#30262B]">Glow Up Bestie</p>
                <p className="text-[11px] text-[#A89BA1]">now</p>
              </div>
            </div>
            <div className="px-4 py-4 flex flex-col gap-3">
              <p className="text-[15px] text-[#30262B] font-medium leading-snug">
                Your gym session is in 15 minutes. You said 6PM — still happening?
              </p>
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 rounded-xl bg-[#D98C9D] text-white text-[13px] font-semibold">I'm on it</button>
                <button className="flex-1 py-2.5 rounded-xl bg-[#F3DDE2] text-[#81757B] text-[13px] font-medium">Not today</button>
              </div>
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-3 mt-8">
          <Btn variant="primary" onClick={onNext}>Get started →</Btn>
          <p className="text-center text-[13px] text-[#A89BA1]">Free to start · No credit card needed</p>
        </div>
      </div>
    </Shell>
  )
}

// ─── O1 — Category ────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'fitness', Icon: HeartPulse, label: 'Health & Fitness' },
  { id: 'career', Icon: BriefcaseBusiness, label: 'Career' },
  { id: 'content', Icon: Video, label: 'Content Creation' },
  { id: 'learning', Icon: BookOpen, label: 'Learning' },
  { id: 'home', Icon: House, label: 'Home & Life' },
  { id: 'mindset', Icon: Sparkles, label: 'Personal Growth' },
  { id: 'other', Icon: Target, label: 'Something else' },
]

function CategoryScreen({ onNext, data, setData }: { onNext: () => void; data: UserData; setData: (d: Partial<UserData>) => void }) {
  const select = (id: string) => setData({ categories: [id] })
  const cats = data.categories ?? []
  const selected = cats[0]
  const otherSelected = selected === 'other'
  const canContinue = !!selected && (!otherSelected || (data.categoryOther ?? '').trim().length > 2)

  return (
    <OShell screen="o1-category">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <p className="text-[12px] font-semibold tracking-[0.1em] text-[#D98C9D] uppercase mb-2">Let's start</p>
          <h1 className="text-[34px] font-bold text-[#30262B] leading-[1.1]" style={{ fontFamily: "'Playfair Display', serif" }}>
            What do you want<br />to improve?
          </h1>
          <p className="text-[14px] text-[#81757B] mt-2">Choose the area you'd like to focus on first.</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORIES.map((c) => {
            const isSelected = selected === c.id
            const { Icon } = c
            return (
              <button
                key={c.id}
                onClick={() => select(c.id)}
                className={`flex flex-col items-start gap-3 px-4 py-4 rounded-[14px] border text-left transition-all duration-200 active:scale-[0.97] ${
                  isSelected
                    ? 'border-[#D98C9D] bg-[#F3DDE2]'
                    : 'border-[#EAE1E3] bg-white'
                } ${c.id === 'other' ? 'col-span-2 flex-row items-center' : ''}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[#D98C9D]' : 'bg-[#F3DDE2]'}`}>
                  <Icon size={18} className={isSelected ? 'text-white' : 'text-[#D98C9D]'} strokeWidth={1.75} />
                </div>
                <span className={`text-[13px] font-semibold leading-tight ${isSelected ? 'text-[#D98C9D]' : 'text-[#30262B]'}`}>
                  {c.label}
                </span>
              </button>
            )
          })}
        </div>

        {otherSelected && (
          <input
            type="text"
            placeholder="What do you want to work on?"
            value={data.categoryOther}
            onChange={(e) => setData({ categoryOther: e.target.value })}
            className="w-full px-5 py-4 rounded-[14px] border border-[#D98C9D] bg-white text-[15px] text-[#30262B] placeholder:text-[#C2B4BA] outline-none shadow-[0_0_0_1.5px_#D98C9D] transition-all duration-150"
            autoFocus
          />
        )}
      </div>
      <div className="mt-8">
        <Btn variant="primary" onClick={onNext} disabled={!canContinue}>Continue</Btn>
      </div>
    </OShell>
  )
}

// ─── O2 — Why ─────────────────────────────────────────────────────────────────

const CAT_PLACEHOLDERS: Record<string, string> = {
  fitness: 'I want to feel stronger and more confident in my body…',
  mindset: 'I want to feel more in control of my thoughts and emotions…',
  career: 'I want to get promoted and finally feel proud of my work…',
  content: 'I want to get comfortable on camera and start posting consistently…',
  home: 'I want my space to feel calm and like mine…',
  learning: 'I want to actually finish what I start and grow my skills…',
  routines: 'I want mornings and evenings that set me up for success…',
  other: 'Tell me what you want…',
}

const CAT_AI_REPLIES: Record<string, string> = {
  fitness: "You want to glow up your fitness because you want to feel stronger and more confident. Got it.  Let's figure out what's been getting in the way.",
  mindset: "You want to glow up your mindset because you're ready to feel more like yourself. I hear you.  Let's look at what's been stopping you.",
  career: "You want to glow up your career because you're ready to feel proud of what you've built. Yes.  Let's figure out what's been in your way.",
  content: "You want to glow up your content because you want to actually show up and be seen. Let's do it.  Let's figure out what keeps getting in the way.",
  home: "You want to glow up your space because your environment matters to you. Totally valid.  Let's figure out what's been stopping you.",
  learning: "You want to glow up your skills because growth matters to you. I love that.  Let's figure out what's been getting in the way.",
  routines: "You want to glow up your routines because you know your habits shape your life. Smart. Let's look at what keeps throwing you off.",
  other: "You know what you want. That's the first step. Let's figure out what's been stopping you.",
}

function DiscoverScreen({ onNext, data, setData }: { onNext: () => void; data: UserData; setData: (d: Partial<UserData>) => void }) {
  const catId = data.categories[0] || 'other'
  const cat = CATEGORIES.find((c) => c.id === catId)
  const catLabel = catId === 'other' && data.categoryOther ? data.categoryOther.toLowerCase() : (cat?.label.toLowerCase() ?? 'your goals')
  const placeholder = CAT_PLACEHOLDERS[catId] ?? CAT_PLACEHOLDERS['other']

  return (
    <OShell screen="o2-discover">
      <div className="flex-1 flex flex-col gap-7">
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            {cat && <cat.Icon size={14} className="text-[#D98C9D]" strokeWidth={2} />}
            <span className="text-[12px] font-semibold text-[#D98C9D] bg-[#F3DDE2] px-3 py-1 rounded-full">
              {catId === 'other' && data.categoryOther ? data.categoryOther : cat?.label}
            </span>
          </div>
          <h1 className="text-[34px] font-bold text-[#30262B] leading-[1.1]" style={{ fontFamily: "'Playfair Display', serif" }}>
            I want to glow up<br />
            <span className="text-[#D98C9D] italic">my {catLabel}</span><br />
            because…
          </h1>
        </div>

        <textarea
          placeholder={placeholder}
          value={data.whyText}
          onChange={(e) => setData({ whyText: e.target.value })}
          className="w-full px-5 py-4 rounded-2xl border border-[#EAE1E3] bg-white text-[16px] text-[#30262B] placeholder:text-[#C2B4BA] resize-none outline-none focus:border-[#D98C9D] focus:shadow-[0_0_0_1.5px_#D98C9D] transition-all duration-150 leading-relaxed"
          rows={5}
          autoFocus
        />

        <p className="text-[13px] text-[#A89BA1] text-center -mt-3">Be honest. This is just for you.</p>
      </div>
      <div className="mt-8">
        <Btn variant="primary" onClick={onNext} disabled={data.whyText.trim().length < 5}>That&apos;s my why →</Btn>
      </div>
    </OShell>
  )
}

// ─── O3 — Obstacle ────────────────────────────────────────────────────────────

const OBSTACLE_OPTIONS = [
  'I start strong but fall off',
  'I struggle to stay motivated',
  "I don't know where to start",
  'I get too busy',
  'I procrastinate',
  'I need accountability',
  'Other',
]

const OBSTACLE_REFLECTION: Record<string, string> = {
  'I start strong but fall off': "You don't need to want it more. You need a way to keep showing up when you don't feel like it.",
  'I struggle to stay motivated': "Motivation comes and goes. The secret is a system that works even when motivation disappears.",
  "I don't know where to start": "Clarity comes from action, not planning. Let's make the first step tiny and obvious.",
  'I get too busy': "You don't find time. You make it — but only for the things you've committed to out loud.",
  'I procrastinate': "Procrastination isn't laziness. It's usually fear or overwhelm. Let's remove both.",
  'I need accountability': "That's why you're here. You don't have to rely on yourself alone anymore.",
  'Other': "Whatever it is — we're going to build a plan around it, not over it.",
}

function getReflectionCopy(obstacles: string[]): string {
  if (obstacles.length === 0) return "You don't need to want it more. You need a system."
  const primary = obstacles[0]
  return OBSTACLE_REFLECTION[primary] ?? "You don't need to want it more. You need a system that keeps working when motivation disappears."
}

function ObstacleScreen({ onNext, data, setData }: { onNext: () => void; data: UserData; setData: (d: Partial<UserData>) => void }) {
  const [phase, setPhase] = useState<'select' | 'reflect'>('select')
  const selected: string[] = data.obstacles && data.obstacles.length > 0 ? data.obstacles : (data.obstacle ? [data.obstacle] : [])

  const toggle = (opt: string) => {
    let next: string[]
    if (selected.includes(opt)) {
      next = selected.filter((o) => o !== opt)
    } else if (selected.length < 3) {
      next = [...selected, opt]
    } else {
      return
    }
    setData({ obstacles: next, obstacle: next[0] ?? '' })
  }

  const handleContinue = () => {
    if (phase === 'select') {
      setPhase('reflect')
    } else {
      onNext()
    }
  }

  if (phase === 'reflect') {
    return (
      <OShell screen="o3-obstacle">
        <div className="flex-1 flex flex-col justify-center gap-8 py-6">
          <div className="text-center">
            <p className="text-[12px] font-semibold tracking-[0.1em] text-[#D98C9D] uppercase mb-3">Okay. I see you.</p>
            <h1 className="text-[32px] font-bold text-[#30262B] leading-[1.1] px-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              It&apos;s not that you don&apos;t want it.
            </h1>
          </div>

          <div className="bg-white rounded-[14px] border border-[#EAE1E3] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <p className="text-[17px] font-medium text-[#30262B] leading-relaxed">
              {getReflectionCopy(selected)}
            </p>
          </div>

          <AIBubble>That&apos;s exactly what we&apos;re here to change.</AIBubble>
        </div>
        <div className="mt-6">
          <Btn variant="primary" onClick={handleContinue}>Let&apos;s build your plan →</Btn>
        </div>
      </OShell>
    )
  }

  return (
    <OShell screen="o3-obstacle">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-[32px] font-bold text-[#30262B] leading-[1.1]" style={{ fontFamily: "'Playfair Display', serif" }}>
            What&apos;s been keeping you from getting there?
          </h1>
          <p className="text-[14px] text-[#A89BA1] mt-2">
            Pick up to 3.
            {selected.length > 0 && <span className="text-[#D98C9D] font-semibold"> {selected.length} / 3 selected</span>}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {OBSTACLE_OPTIONS.map((opt) => {
            const isSelected = selected.includes(opt)
            const isDisabled = !isSelected && selected.length >= 3
            return (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                disabled={isDisabled}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl border text-[15px] font-medium text-left transition-all duration-150 active:scale-[0.98] ${
                  isSelected
                    ? 'border-[#D98C9D] bg-[#F3DDE2] text-[#D98C9D] shadow-[0_0_0_1.5px_#D98C9D]'
                    : isDisabled
                      ? 'border-[#EAE1E3] bg-white text-[#30262B] opacity-40'
                      : 'border-[#EAE1E3] bg-white text-[#30262B]'
                }`}
              >
                {opt}
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-[#D98C9D] flex items-center justify-center flex-shrink-0 ml-3">
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
      <div className="mt-6">
        <Btn variant="primary" onClick={handleContinue} disabled={selected.length === 0}>Be honest with me →</Btn>
      </div>
    </OShell>
  )
}

// ─── O4 — AI SMART goal ───────────────────────────────────────────────────────

export function getSmartGoal(data: UserData) {
  const cat = data.categories[0] || 'fitness'
  if (cat === 'content') return {
    title: 'Become comfortable speaking on camera',
    description: 'Practice speaking on camera for 5 minutes every weekday for 30 days.',
    action: 'Record yourself speaking',
    frequency: '5x / week',
    duration: '5 minutes',
    time: '10:00 AM',
    success: 'Complete 20 practice sessions',
  }
  if (cat === 'fitness') return {
    title: 'Build a consistent gym habit',
    description: 'Go to the gym 3 times per week for the next 30 days.',
    action: 'Go to the gym',
    frequency: '3x / week',
    duration: '45 minutes',
    time: '6:00 PM',
    success: 'Complete 12 gym sessions',
  }
  if (cat === 'mindset') return {
    title: 'Build a daily mindset practice',
    description: 'Spend 10 minutes on mindset work every weekday for 30 days.',
    action: 'Mindset practice',
    frequency: '5x / week',
    duration: '10 minutes',
    time: '8:00 AM',
    success: 'Complete 20 sessions',
  }
  if (cat === 'career') return {
    title: 'Make meaningful career progress',
    description: 'Dedicate 30 minutes every weekday to your career goal for 30 days.',
    action: 'Focused career work',
    frequency: '5x / week',
    duration: '30 minutes',
    time: '8:00 AM',
    success: 'Complete 20 focused sessions',
  }
  if (cat === 'learning') return {
    title: 'Build a consistent learning habit',
    description: 'Spend 20 minutes learning every day for 30 days.',
    action: 'Study session',
    frequency: '5x / week',
    duration: '20 minutes',
    time: '9:00 AM',
    success: 'Complete 20 study sessions',
  }
  if (cat === 'routines') return {
    title: 'Build a consistent daily routine',
    description: 'Follow your morning or evening routine every weekday for 30 days.',
    action: 'Complete your routine',
    frequency: '5x / week',
    duration: '20 minutes',
    time: '7:30 AM',
    success: 'Complete 20 routine days',
  }
  if (cat === 'home') return {
    title: 'Keep your space consistently tidy',
    description: 'Spend 15 minutes tidying or improving your space every day for 30 days.',
    action: 'Tidy session',
    frequency: '5x / week',
    duration: '15 minutes',
    time: '7:00 PM',
    success: 'Complete 20 tidy sessions',
  }
  return {
    title: 'Build a consistent daily habit',
    description: 'Dedicate 20 minutes every weekday to your goal for 30 days.',
    action: 'Focused practice',
    frequency: '5x / week',
    duration: '20 minutes',
    time: '9:00 AM',
    success: 'Complete 20 sessions',
  }
}

function SmartGoalScreen({ onNext, data, setData }: { onNext: () => void; data: UserData; setData: (d: Partial<UserData>) => void }) {
  const [generating, setGenerating] = useState(true)
  const goal = getSmartGoal(data)

  useEffect(() => {
    const t = setTimeout(() => setGenerating(false), 1800)
    return () => clearTimeout(t)
  }, [])

  if (generating) {
    return (
      <OShell screen="o4-smart-goal">
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-10">
          <div className="w-16 h-16 rounded-2xl bg-[#D98C9D] flex items-center justify-center shadow-[0_6px_24px_rgba(217,140,157,0.35)]">
            <span className="text-white text-[24px] font-black">G</span>
          </div>
          <div className="text-center">
            <p className="text-[19px] font-semibold text-[#30262B]">Building your goal…</p>
            <p className="text-[15px] text-[#81757B] mt-1">Making it realistic and actionable.</p>
          </div>
          {/* Loading dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#D98C9D]"
                style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
          <style>{`@keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }`}</style>
        </div>
      </OShell>
    )
  }

  return (
    <OShell screen="o4-smart-goal">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <p className="text-[12px] font-bold tracking-[0.12em] text-[#D98C9D] uppercase mb-2">AI-generated goal</p>
          <h1 className="text-[32px] font-bold tracking-[-0.03em] text-[#30262B] leading-[1.1]" style={{ fontFamily: "\'Playfair Display\', serif" }}>
            Your 30-day goal.
          </h1>
        </div>

        {/* SMART goal card */}
        <div className="bg-white rounded-3xl border border-[#EAE1E3] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
          <div className="bg-[#D98C9D] px-5 py-4">
            <p className="text-white font-bold text-[17px] leading-snug tracking-[-0.01em]">{goal.title}</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-[15px] text-[#30262B] leading-relaxed mb-4">{goal.description}</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Action', value: goal.action },
                { label: 'Frequency', value: goal.frequency },
                { label: 'Duration', value: goal.duration },
                { label: 'Time', value: goal.time },
                { label: 'Success', value: goal.success },
              ].map((row) => (
                <div key={row.label} className={`bg-[#FCF8F6] rounded-xl px-3 py-2.5 ${row.label === 'Success' ? 'col-span-2' : ''}`}>
                  <p className="text-[11px] font-bold tracking-[0.08em] text-[#A89BA1] uppercase">{row.label}</p>
                  <p className="text-[14px] font-semibold text-[#30262B] mt-0.5">{row.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AIBubble>Does this feel realistic? If not, we can adjust it — this is your commitment, not mine.</AIBubble>
      </div>
      <div className="mt-6 flex flex-col gap-2.5">
        <Btn variant="primary" onClick={async () => {
          // Persist approved goal via server if available
          try {
            const payload = { ...data, goalText: getSmartGoal(data).title, useAI: true }
            const res = await fetch('/api/generate-goal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
            const json = await res.json()
            if (json?.goal) {
              setData({ smartGoalApproved: true })
            } else {
              // demo fallback
              setData({ smartGoalApproved: true })
            }
          } catch (err) {
            setData({ smartGoalApproved: true })
          }
          onNext()
        }}>
          Looks good
        </Btn>
        <Btn variant="secondary" onClick={() => { setData({ smartGoalApproved: false }); onNext() }}>
          Change it
        </Btn>
      </div>
    </OShell>
  )
}

// ─── O5 — Goal breakdown ──────────────────────────────────────────────────────

function BreakdownScreen({ onNext, data }: { onNext: () => void; data: UserData }) {
  const goal = getSmartGoal(data)
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI']

  return (
    <OShell screen="o5-breakdown">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-[34px] font-bold tracking-[-0.035em] text-[#30262B] leading-[1.08]" style={{ fontFamily: "\'Playfair Display\', serif" }}>
            Here&apos;s your plan.
          </h1>
          <p className="text-[15px] text-[#81757B] mt-2">I&apos;ll remind you before each session. You just show up.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EAE1E3] p-4">
          <p className="text-[12px] font-bold tracking-[0.1em] text-[#81757B] uppercase mb-1">Your goal</p>
          <p className="text-[16px] font-bold text-[#30262B]">{goal.title}</p>
        </div>

        <div>
          <p className="text-[12px] font-bold tracking-[0.1em] text-[#81757B] uppercase mb-3">This week&apos;s actions</p>
          <div className="flex flex-col gap-2">
            {days.map((day) => (
              <div key={day} className="flex items-center gap-4 bg-white rounded-xl border border-[#EAE1E3] px-4 py-3.5">
                <span className="text-[12px] font-bold text-[#D98C9D] w-8">{day}</span>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-[#30262B]">{goal.action}</p>
                  <p className="text-[12px] text-[#81757B]">{goal.duration} · {goal.time}</p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-[#EAE1E3]" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#F3DDE2] rounded-2xl border border-[#E8C5CF] px-4 py-3.5">
          <p className="text-[14px] font-semibold text-[#D98C9D]">
            🤖 The AI does the planning. You just have to show up.
          </p>
        </div>
      </div>
      <div className="mt-6">
        <Btn variant="primary" onClick={onNext}>This works for me →</Btn>
      </div>
    </OShell>
  )
}

// ─── O6 — Commitment length ───────────────────────────────────────────────────

const COMMITMENT_OPTIONS = [
  { days: 15, label: '15 days', sub: 'Just prove you can start.' },
  { days: 30, label: '30 days', sub: 'Build your momentum.', popular: true },
  { days: 60, label: '60 days', sub: 'Build real consistency.' },
  { days: 90, label: '90 days', sub: 'Become someone who follows through.', popular: true },
  { days: 0, label: 'Custom', sub: "I'll choose my own." },
]

function CommitmentScreen({ onNext, data, setData }: { onNext: () => void; data: UserData; setData: (d: Partial<UserData>) => void }) {
  const customNum = parseInt(data.customDays, 10)
  const customValid = !isNaN(customNum) && customNum >= 7 && customNum <= 365
  const canContinue = data.commitmentDays > 0 || customValid

  return (
    <OShell screen="o6-commitment">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-[34px] font-bold tracking-[-0.035em] text-[#30262B] leading-[1.08]" style={{ fontFamily: "\'Playfair Display\', serif" }}>
            How long are you
            <br />
            committing?
          </h1>
          <p className="text-[15px] text-[#81757B] mt-2 leading-relaxed">
            Choose what you can actually keep — not what sounds impressive.
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          {COMMITMENT_OPTIONS.map((opt) => {
            const isSelected = data.commitmentDays === opt.days && !(opt.days === 0 && !data.customDays)
            return (
              <button
                key={opt.days}
                onClick={() => {
                  if (opt.days === 0) setData({ commitmentDays: 0, customDays: data.customDays || ' ' })
                  else setData({ commitmentDays: opt.days, customDays: '' })
                }}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl border text-left transition-all duration-150 active:scale-[0.98] ${
                  isSelected
                    ? 'border-[#D98C9D] bg-[#F3DDE2] shadow-[0_0_0_1.5px_#D98C9D]'
                    : 'border-[#EAE1E3] bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[20px] font-bold ${isSelected ? 'text-[#D98C9D]' : 'text-[#30262B]'}`}>
                      {opt.label}
                    </span>
                    {opt.popular && !isSelected && (
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#D98C9D] bg-[#F3DDE2] px-2 py-0.5 rounded-full">popular</span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#81757B] mt-0.5">{opt.sub}</p>
                </div>
                {isSelected && <span className="text-[#D98C9D] text-lg flex-shrink-0">✓</span>}
              </button>
            )
          })}
        </div>
        {data.commitmentDays === 0 && data.customDays !== '' && (
          <div className="flex items-center gap-3 bg-white rounded-2xl border border-[#D98C9D] px-5 py-4 shadow-[0_0_0_1.5px_#D98C9D]">
            <span className="text-[15px] text-[#81757B]">I commit to</span>
            <input
              type="number" min={7} max={365}
              value={data.customDays.trim()}
              onChange={(e) => setData({ customDays: e.target.value })}
              placeholder="30"
              className="w-20 text-[24px] font-extrabold text-[#D98C9D] text-center outline-none bg-transparent"
              autoFocus
            />
            <span className="text-[15px] text-[#81757B]">days.</span>
          </div>
        )}
      </div>
      <div className="mt-6">
        <Btn variant="primary" onClick={onNext} disabled={!canContinue}>Make my commitment →</Btn>
      </div>
    </OShell>
  )
}

// ─── O7 — Accountability style ────────────────────────────────────────────────

function AccountabilityScreen({ onNext, data, setData }: { onNext: () => void; data: UserData; setData: (d: Partial<UserData>) => void }) {
  const styles = [
    { id: 'encourage', emoji: '', label: 'Encourage me', sub: 'Keep me positive and remind me why I started.', preview: "You've got this. You said this matters to you. Let's go. " },
    { id: 'push', emoji: '', label: 'Push me', sub: "Don't let me make excuses.", preview: "You said you'd do it. Let's go. No more delays. " },
    { id: 'call-out', emoji: '', label: 'Call me out', sub: 'If I disappear, tell me.', preview: "You keep saying this matters. Let's actually do it. " },
    { id: 'gentle', emoji: '', label: 'Be gentle', sub: "Hold me accountable without making me feel bad.", preview: "Today didn't go as planned. Let's figure out what we can realistically do. " },
  ]

  const selected = styles.find((s) => s.id === data.accountabilityStyle)

  return (
    <OShell screen="o7-accountability">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-[34px] font-bold tracking-[-0.035em] text-[#30262B] leading-[1.08]" style={{ fontFamily: "\'Playfair Display\', serif" }}>
            How should I hold
            <br />
            you accountable?
          </h1>
          <p className="text-[15px] text-[#81757B] mt-2">Everyone needs a different kind of push.</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {styles.map((s) => (
            <button
              key={s.id}
              onClick={() => setData({ accountabilityStyle: s.id })}
              className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-150 active:scale-[0.97] gap-2 ${
                data.accountabilityStyle === s.id
                  ? 'border-[#D98C9D] bg-[#F3DDE2] shadow-[0_0_0_1.5px_#D98C9D]'
                  : 'border-[#EAE1E3] bg-white'
              }`}
            >
              <span className="text-2xl">{s.emoji}</span>
              <div>
                <p className={`text-[13px] font-bold ${data.accountabilityStyle === s.id ? 'text-[#D98C9D]' : 'text-[#30262B]'}`}>{s.label}</p>
                <p className="text-[12px] text-[#81757B] mt-0.5 leading-snug">{s.sub}</p>
              </div>
            </button>
          ))}
        </div>
        {selected && (
          <div className="bg-white rounded-2xl border border-[#EAE1E3] p-4 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#D98C9D] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-[9px] font-black">G</span>
            </div>
            <p className="text-[14px] text-[#30262B] italic leading-relaxed">&ldquo;{selected.preview}&rdquo;</p>
          </div>
        )}
      </div>
      <div className="mt-6">
        <Btn variant="primary" onClick={onNext} disabled={!data.accountabilityStyle}>That&apos;s my vibe →</Btn>
      </div>
    </OShell>
  )
}

// ─── Name your Bestie ─────────────────────────────────────────────────────────

const BESTIE_NAME_SUGGESTIONS = ['Bea', 'Nova', 'Stella', 'Ivy', 'Luna', 'Jade', 'Aria', 'Cleo']

function NameBestieScreen({ onNext, data, setData }: { onNext: () => void; data: UserData; setData: (d: Partial<UserData>) => void }) {
  const displayName = data.bestieName.trim() || 'Bea'
  const accountabilityEmoji = { encourage: '', push: '', 'call-out': '', gentle: '' }[data.accountabilityStyle] ?? ''

  return (
    <OShell screen="o-name-bestie">
      <div className="flex-1 flex flex-col gap-7">
        <div>
          <h1 className="text-[36px] font-bold tracking-[-0.035em] text-[#30262B] leading-[1.08]" style={{ fontFamily: "\'Playfair Display\', serif" }}>
            Give your Bestie
            <br />
            a <span className="text-[#D98C9D]">name.</span>
          </h1>
          <p className="text-[15px] text-[#81757B] mt-2">She&apos;s yours. Make her feel like it.</p>
        </div>

        {/* Preview card */}
        <div className="bg-white rounded-3xl border border-[#EAE1E3] p-5 flex items-start gap-4 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
          <div className="w-12 h-12 rounded-2xl bg-[#D98C9D] flex items-center justify-center flex-shrink-0 shadow-[0_4px_14px_rgba(217,140,157,0.35)]">
            <Sparkles size={20} className="text-white" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-[#D98C9D] uppercase tracking-wide mb-1">{displayName} · Glow Up Bestie</p>
            <p className="text-[15px] text-[#30262B] leading-snug">
              Hey {data.name || 'bestie'} — I&apos;m {displayName}. I&apos;m going to help you actually follow through this time. Let&apos;s do this.
            </p>
          </div>
        </div>

        {/* Name input */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name your Bestie…"
            value={data.bestieName}
            onChange={(e) => setData({ bestieName: e.target.value })}
            maxLength={20}
            className="w-full px-5 py-4 rounded-2xl border border-[#EAE1E3] bg-white text-[18px] font-semibold text-[#30262B] placeholder:text-[#C2B4BA] outline-none focus:border-[#D98C9D] focus:shadow-[0_0_0_1.5px_#D98C9D] transition-all duration-150"
            autoFocus
          />

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2">
            {BESTIE_NAME_SUGGESTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setData({ bestieName: n })}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-150 active:scale-95 ${
                  data.bestieName === n
                    ? 'border-[#D98C9D] bg-[#F3DDE2] text-[#D98C9D] shadow-[0_0_0_1px_#D98C9D]'
                    : 'border-[#EAE1E3] bg-white text-[#81757B]'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Btn variant="primary" onClick={onNext}>
          {data.bestieName.trim() ? `Meet ${data.bestieName.trim()} →` : 'Skip for now →'}
        </Btn>
      </div>
    </OShell>
  )
}

// ─── O8 — Account creation ────────────────────────────────────────────────────

function AccountScreen({ onNext, data, setData }: { onNext: () => void; data: UserData; setData: (d: Partial<UserData>) => void }) {
  const [showEmail, setShowEmail] = useState(false)
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const { signUp, signIn } = useAuth()
  
  const onSubmit = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = isSigningIn ? await signIn(data.email, password) : await signUp(data.email, password)
      if ((res as any).error) {
        setError((res as any).error.message || 'Auth failed')
      } else {
        // after auth, persist the generated goal for this user
        try {
          const payload = {
            goalText: data.goalText,
            why: data.whyText,
            obstacle: data.obstacle,
            category: data.categories?.[0] || null,
            commitmentDays: data.commitmentDays || parseInt(data.customDays, 10) || 30,
            preferred_frequency: 'daily',
            preferred_time: '9:00 AM',
            useAI: false,
          }
          const gres = await generateGoal(payload)
          if (gres?.error) {
            console.warn('generateGoal error', gres)
            // don't block the user; show warning
            setError('Account created but saving goal failed.')
          }
        } catch (err) {
          console.warn('generateGoal failed', err)
          setError('Account created but saving goal failed.')
        }
        onNext()
      }
    } catch (err: any) {
      setError(err?.message || 'Auth failed')
    } finally {
      setLoading(false)
    }
  }
  const days = data.commitmentDays > 0 ? data.commitmentDays : parseInt(data.customDays, 10) || 30
  const goal = getSmartGoal(data)

  return (
    <Shell className="px-4 pt-[53px] pb-10">
      <div className="flex-1 flex flex-col gap-7">
        <div>
          <h1 className="text-[34px] font-bold tracking-[-0.035em] text-[#30262B] leading-[1.08]" style={{ fontFamily: "\'Playfair Display\', serif" }}>Let&apos;s save your plan.</h1>
          <p className="text-[15px] text-[#81757B] mt-2 leading-relaxed">
            Your Bestie needs an account so she can remember your goals, schedule, and commitments across everything you're working on.
          </p>
        </div>

        {/* Plan summary */}
        <div className="bg-[#F3DDE2] rounded-2xl border border-[#E8C5CF] p-4 flex flex-col gap-1">
          <p className="text-[12px] font-bold tracking-[0.1em] text-[#D98C9D] uppercase">Your commitment</p>
          <p className="text-[15px] font-semibold text-[#30262B]">{goal.title}</p>
          <p className="text-[13px] text-[#81757B]">{goal.frequency} · {days}-day commitment</p>
        </div>

        <div className="flex flex-col gap-3">
          <Btn variant="dark" onClick={onNext}>
            <span className="flex items-center justify-center gap-3">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.29.07 2.17.74 2.94.8 1.12-.23 2.19-.91 3.38-.82 1.44.13 2.51.72 3.2 1.88-2.91 1.74-2.21 5.65.26 6.68-.52 1.52-1.24 3.04-1.78 4.32M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25" />
              </svg>
              Continue with Apple
            </span>
          </Btn>
          <Btn variant="secondary" onClick={onNext}>
            <span className="flex items-center justify-center gap-3">
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </span>
          </Btn>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#EAE1E3]" />
            <span className="text-[13px] text-[#A89BA1] font-medium">or</span>
            <div className="flex-1 h-px bg-[#EAE1E3]" />
          </div>

          {!showEmail ? (
            <Btn variant="secondary" onClick={() => setShowEmail(true)}>Continue with Email</Btn>
          ) : (
            <div className="flex flex-col gap-2.5 border border-[#D98C9D] rounded-2xl p-4 bg-white shadow-[0_0_0_1.5px_#D98C9D]">
              <input type="text" placeholder="First name" value={data.name} onChange={(e) => setData({ name: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-[#EAE1E3] text-[15px] placeholder:text-[#C2B4BA] outline-none focus:border-[#D98C9D] transition-all" autoFocus />
              <input type="email" placeholder="Email" value={data.email} onChange={(e) => setData({ email: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-[#EAE1E3] text-[15px] placeholder:text-[#C2B4BA] outline-none focus:border-[#D98C9D] transition-all" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-[#EAE1E3] text-[15px] placeholder:text-[#C2B4BA] outline-none focus:border-[#D98C9D] transition-all" />
              <div className="flex items-center justify-between">
                <div className="text-sm text-[#81757B]">
                  {isSigningIn ? 'Sign in with your account' : 'Create a password at least 6 characters'}
                </div>
                <button className="text-sm text-[#D98C9D] font-semibold" onClick={() => setIsSigningIn(!isSigningIn)}>
                  {isSigningIn ? 'Create account' : 'Have an account? Sign in'}
                </button>
              </div>
              {error && <p className="text-[13px] text-red-600">{error}</p>}
              <Btn variant="primary" onClick={onSubmit} disabled={loading || !data.email || password.length < 6}>{loading ? (isSigningIn ? 'Signing in…' : 'Creating…') : (isSigningIn ? 'Sign in' : 'Create my account')}</Btn>
            </div>
          )}
        </div>
        <p className="text-[12px] text-[#A89BA1] text-center">By continuing you agree to our Terms &amp; Privacy Policy</p>
      </div>
      {!showEmail && (
        <div className="mt-auto pt-4">
          <Btn variant="primary" onClick={onNext}>Create my account</Btn>
        </div>
      )}
    </Shell>
  )
}

// ─── Home / Today ─────────────────────────────────────────────────────────────

function HomeScreen({ onNext, onMissed, data }: { onNext: () => void; onMissed: () => void; data: UserData }) {
  const firstName = data.name || 'Coral'
  const { user } = useAuth()
  const [serverUser, setServerUser] = useState<any | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await getMe()
        if (mounted && res?.user) setServerUser(res.user)
        else if (mounted && res && res.error) setToast('Server verification failed')
      } catch (err) {
        if (mounted) setToast('Server verification failed')
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])
  const goal = getSmartGoal(data)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const CatIcon = CATEGORIES.find((c) => c.id === data.categories[0])?.Icon ?? Target
  const goals = [
    { Icon: CatIcon, title: goal.title, time: goal.time, duration: goal.duration, done: false },
    { Icon: HeartPulse, title: 'Gym session', time: '6:00 PM', duration: '45 min', done: true },
  ]

  return (
    <Shell className="px-4 pt-[53px] pb-[84px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-[24px] font-bold text-[#30262B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {greeting}, {firstName}
          </p>
          <p className="text-[15px] text-[#81757B] mt-0.5">Here&apos;s what matters today.</p>
          {user?.email && <p className="text-[13px] text-[#A89BA1] mt-1">Signed in as {user.email}</p>}
          {serverUser?.email && <p className="text-[12px] text-[#A89BA1] mt-1">Server: {serverUser.email}</p>}
        </div>
        {toast && (
          <div className="fixed top-6 right-6 bg-[#30262B] text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 ring-1 ring-[#D98C9D]/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9v4l-1.29 1.29A1 1 0 0 0 4 16v1h16v-1a1 1 0 0 0-.71-.95L19 13V9c0-3.87-3.13-7-7-7z" fill="#FDECEA"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" fill="#FDECEA"/>
            </svg>
            <div className="text-sm">{toast}</div>
          </div>
        )}
        <button className="w-10 h-10 rounded-full bg-white border border-[#EAE1E3] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <Bell size={18} className="text-[#81757B]" strokeWidth={1.75} />
        </button>
      </div>

      {/* Today section */}
      <p className="text-[12px] font-bold tracking-[0.12em] text-[#81757B] uppercase mb-3">Today</p>

      <div className="flex flex-col gap-3 mb-6">
        {goals.map((g, i) => (
          <div
            key={i}
            className={`rounded-2xl border overflow-hidden transition-all ${g.done ? 'border-[#C8DDC7] bg-[#EDF4EC]' : 'border-[#EAE1E3] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]'}`}
          >
            <div className="px-5 py-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${g.done ? 'bg-[#9CAF9A]/15' : 'bg-[#F3DDE2]'}`}>
                {g.done
                  ? <Check size={17} className="text-[#9CAF9A]" strokeWidth={2.5} />
                  : <g.Icon size={17} className="text-[#D98C9D]" strokeWidth={1.75} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-[15px] truncate ${g.done ? 'text-[#9CAF9A] line-through decoration-[#9CAF9A]/40' : 'text-[#30262B]'}`}>
                  {g.title}
                </p>
                <p className={`text-[13px] mt-0.5 ${g.done ? 'text-[#9CAF9A]/70' : 'text-[#81757B]'}`}>
                  {g.time} · {g.duration}
                </p>
              </div>
              {!g.done && (
                <span className="px-2.5 py-1 rounded-full bg-[#F3DDE2] text-[#D98C9D] text-[11px] font-semibold flex-shrink-0">
                  Coming up
                </span>
              )}
            </div>
            {!g.done && i === 0 && (
              <div className="px-4 pb-4 flex gap-2">
                <button onClick={onNext} className="flex-1 py-3 rounded-xl bg-[#D98C9D] text-white text-[14px] font-semibold active:scale-[0.97]">
                  I&apos;m on it 
                </button>
                <button onClick={onMissed} className="flex-1 py-3 rounded-xl bg-[#FCF8F6] border border-[#EAE1E3] text-[#81757B] text-[14px] font-medium active:scale-[0.97]">
                  Something came up
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-[#EAE1E3] p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-bold tracking-[0.12em] text-[#81757B] uppercase">Progress</p>
          <p className="text-[13px] font-semibold text-[#9CAF9A]">70% consistency</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-[#EAE1E3] rounded-full overflow-hidden">
            <div className="h-full bg-[#9CAF9A] rounded-full" style={{ width: '70%' }} />
          </div>
          <p className="text-[13px] font-bold text-[#30262B] flex-shrink-0">7 / 10</p>
        </div>
        <p className="text-[12px] text-[#A89BA1] mt-1.5">commitments completed</p>
      </div>

      {/* AI message */}
      <AIBubble label={data.bestieName.trim() || 'Bestie'}>You&apos;ve been strongest when you keep your commitments small. Let&apos;s keep today&apos;s focus simple.</AIBubble>
    </Shell>
  )
}

// ─── Check-in (proactive) ─────────────────────────────────────────────────────

function CheckinScreen({ onNext, onMissed, data }: { onNext: () => void; onMissed: () => void; data: UserData }) {
  const goal = getSmartGoal(data)
  return (
    <Shell className="px-4 pt-[53px] pb-[84px]">
      <div className="flex items-center justify-between mb-8">
        <p className="text-[#81757B] text-[14px] font-medium">{goal.time} · Time to go</p>
        <div className="w-2 h-2 rounded-full bg-[#D98C9D] animate-pulse" />
      </div>
      <div className="flex-1 flex flex-col gap-5">
        <div className="bg-white rounded-3xl rounded-tl-lg border border-[#EAE1E3] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#D98C9D] flex items-center justify-center">
              <span className="text-white text-[11px] font-black">G</span>
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#D98C9D]">Glow Up Bestie</p>
              <p className="text-[11px] text-[#A89BA1]">just now</p>
            </div>
          </div>
          <p className="text-[22px] font-semibold text-[#30262B] leading-snug">
            {goal.action} in 10 minutes. 
          </p>
          <p className="text-[16px] text-[#81757B] leading-relaxed mt-2">
            Remember: today&apos;s goal is just {goal.duration}. That&apos;s all you committed to.
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          <button onClick={onNext} className="w-full py-5 rounded-2xl bg-[#D98C9D] text-white font-bold text-[18px] tracking-[-0.02em] active:scale-[0.97] shadow-[0_4px_20px_rgba(217,140,157,0.30)]">I&apos;m on it </button>
          <button onClick={onNext} className="w-full py-5 rounded-2xl bg-white border border-[#EAE1E3] text-[#30262B] font-semibold text-[17px] active:scale-[0.97]">Running a bit late</button>
          <button onClick={onMissed} className="w-full py-5 rounded-2xl bg-white border border-[#EAE1E3] text-[#81757B] font-semibold text-[17px] active:scale-[0.97]">Can&apos;t today</button>
        </div>
      </div>
    </Shell>
  )
}

// ─── Completion ───────────────────────────────────────────────────────────────

function CompletionScreen({ onNext, data }: { onNext: () => void; data: UserData }) {
  const [proofAdded, setProofAdded] = useState(false)
  const goal = getSmartGoal(data)
  return (
    <Shell className="px-4 pt-[53px] pb-[84px]">
      <div className="flex-1 flex flex-col gap-6">
        <div className="text-center py-4">
          
          <h1 className="text-[38px] font-bold text-[#30262B] leading-[1.05]">YOU SHOWED UP.</h1>
          <p className="text-[18px] text-[#81757B] font-medium mt-2">You kept the promise you made to yourself.</p>
        </div>
        <div className="bg-[#EDF4EC] rounded-3xl p-6 border border-[#C8DDC7] text-center">
          <p className="text-[13px] font-bold tracking-[0.1em] text-[#9CAF9A] uppercase mb-1">Day 4 done</p>
          <p className="text-[52px] font-bold text-[#9CAF9A] tabular-nums leading-none">4 / 5</p>
          <p className="text-[15px] font-semibold text-[#9CAF9A] mt-1">this week</p>
          <p className="text-[13px] text-[#81757B] mt-2 leading-snug">You&apos;re building evidence that you can actually follow through.</p>
        </div>
        <AIBubble label={data.bestieName.trim() || 'Bestie'}>Day 4 done. You&apos;re building evidence that you can actually follow through. That&apos;s the whole point. </AIBubble>
        <button
          onClick={() => setProofAdded(true)}
          className={`w-full py-4 rounded-2xl border-2 border-dashed flex items-center justify-center gap-3 text-[15px] font-semibold transition-all ${proofAdded ? 'border-[#9CAF9A] bg-[#EDF4EC] text-[#9CAF9A]' : 'border-[#EAE1E3] bg-white text-[#A89BA1] hover:border-[#D98C9D]'}`}
        >
          {proofAdded ? 'Proof logged' : `📸 Add proof of "${goal.action}" (optional)`}
        </button>
      </div>
      <div className="mt-6"><Btn variant="primary" onClick={onNext}>See my week →</Btn></div>
    </Shell>
  )
}

// ─── Recovery (missed) ────────────────────────────────────────────────────────

function RecoveryScreen({ onNext, data }: { onNext: () => void; data: UserData }) {
  const [reason, setReason] = useState('')
  const [step, setStep] = useState<'reason' | 'response'>('reason')
  const goal = getSmartGoal(data)

  const reasons = [
    "I got too busy",
    "I wasn't feeling it",
    "Something came up",
    "I felt overwhelmed",
    "I made an excuse",
    "Other",
  ]

  const aiResponses: Record<string, string> = {
    "I got too busy": `No big deal. Want to move today's ${goal.action.toLowerCase()} to 5 PM instead?`,
    "I wasn't feeling it": "That makes sense. Let's make today's version easier — just half the time. No pressure, just practice.",
    "Something came up": "Life happens. You're still committed. Let's reschedule and keep your streak going.",
    "I felt overwhelmed": "You've missed the last few sessions. I don't think the current schedule is realistic. Want to adjust it?",
    "I made an excuse": "You already know the answer. Let's move it to tomorrow and actually do it. Deal?",
    "Other": "One missed day doesn't erase your progress. Let's figure out what we can do next.",
  }

  return (
    <Shell className="px-4 pt-[53px] pb-[84px]">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-[36px] font-bold tracking-[-0.035em] text-[#30262B] leading-[1.08]" style={{ fontFamily: "\'Playfair Display\', serif" }}>
            {step === 'reason' ? 'Okay. What got in the way?' : 'Got it.'}
          </h1>
          {step === 'reason' && (
            <p className="text-[16px] text-[#81757B] mt-2 leading-relaxed">
              One missed day doesn&apos;t erase your progress. Let&apos;s figure out next steps.
            </p>
          )}
        </div>

        {step === 'reason' ? (
          <div className="grid grid-cols-2 gap-2">
            {reasons.map((r) => (
              <button
                key={r}
                onClick={() => { setReason(r); setStep('response') }}
                className="text-left px-4 py-3.5 rounded-2xl border border-[#EAE1E3] bg-white text-[14px] font-medium text-[#30262B] transition-all active:scale-[0.97] hover:border-[#D98C9D]"
              >
                {r}
              </button>
            ))}
          </div>
        ) : (
          <>
            <AIBubble label={data.bestieName.trim() || 'Bestie'}>{aiResponses[reason] || aiResponses['Other']}</AIBubble>

            <div className="bg-white rounded-2xl border border-[#EAE1E3] p-5">
              <p className="text-[13px] font-semibold text-[#81757B] mb-3">Reschedule options</p>
              <div className="flex flex-col gap-2">
                {['Move to 5:00 PM today', 'Move to tomorrow', 'Adjust my goal'].map((opt) => (
                  <button key={opt} onClick={onNext} className="text-left px-4 py-3 rounded-xl border border-[#EAE1E3] bg-[#FCF8F6] text-[14px] font-medium text-[#30262B] hover:border-[#D98C9D] transition-all">
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {step === 'response' && (
        <div className="mt-6 flex flex-col gap-2.5">
          <Btn variant="primary" onClick={onNext}>Move it to tomorrow</Btn>
          <Btn variant="ghost" onClick={onNext}>Skip this session</Btn>
        </div>
      )}
    </Shell>
  )
}

// ─── Weekly recap ─────────────────────────────────────────────────────────────

function WeeklyRecapScreen({ onNext, data }: { onNext: () => void; data: UserData }) {
  const days = data.commitmentDays > 0 ? data.commitmentDays : parseInt(data.customDays, 10) || 30
  const goal = getSmartGoal(data)
  const completed = [true, true, false, true, true]
  const count = completed.filter(Boolean).length

  return (
    <Shell className="px-4 pt-[53px] pb-[84px]">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-[36px] font-bold tracking-[-0.035em] text-[#30262B] leading-[1.08]" style={{ fontFamily: "\'Playfair Display\', serif" }}>Look what you did.</h1>
          <p className="text-[15px] text-[#81757B] mt-1">Week 1 of {days} days.</p>
        </div>

        <div className="bg-[#EDF4EC] rounded-3xl p-6 border border-[#C8DDC7] text-center">
          <p className="text-[68px] font-bold text-[#9CAF9A] tabular-nums leading-none">{count} / 5</p>
          <p className="text-[16px] font-semibold text-[#9CAF9A] mt-2">
            {count === 5 ? 'Perfect week.' : count >= 4 ? 'Strong week.' : 'Keep building.'}
          </p>
          <div className="flex justify-center gap-2.5 mt-4">
            {completed.map((done, i) => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold ${done ? 'bg-[#9CAF9A] text-white' : 'bg-white border border-[#EAE1E3] text-[#A89BA1]'}`}>
                {done ? '' : ''}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#EAE1E3] p-5 flex flex-col gap-3">
          <p className="text-[12px] font-bold tracking-[0.1em] text-[#81757B] uppercase">Week over week</p>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-[13px] text-[#A89BA1] mb-1">Last week</p>
              <p className="text-[26px] font-bold text-[#81757B] tabular-nums">3 / 5</p>
            </div>
            <div className="text-xl text-[#A89BA1]">→</div>
            <div className="text-center">
              <p className="text-[13px] text-[#A89BA1] mb-1">This week</p>
              <p className="text-[26px] font-bold text-[#9CAF9A] tabular-nums">{count} / 5</p>
            </div>
          </div>
        </div>

        <AIBubble label={data.bestieName.trim() || 'Bestie'}>You&apos;re becoming more consistent. That&apos;s the whole point.</AIBubble>

        <div className="bg-[#F3DDE2] rounded-2xl border border-[#E8C5CF] p-4">
          <p className="text-[13px] font-semibold text-[#D98C9D]">
             Goal: {goal.title}
          </p>
          <p className="text-[12px] text-[#81757B] mt-1">12 / 20 sessions · 60% to target</p>
          <div className="mt-2 h-1.5 bg-[#E8C5CF] rounded-full overflow-hidden">
            <div className="h-full bg-[#D98C9D] rounded-full" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
      <div className="mt-6"><Btn variant="primary" onClick={onNext}>Commit to next week →</Btn></div>
    </Shell>
  )
}

// ─── Paywall ──────────────────────────────────────────────────────────────────

function PaywallScreen({ data }: { data: UserData }) {
  const name = data.name || 'bestie'
  const days = data.commitmentDays > 0 ? data.commitmentDays : parseInt(data.customDays, 10) || 30

  return (
    <Shell className="px-4 pt-[53px] pb-[84px]">
      <div className="flex-1 flex flex-col gap-6">
        <div className="text-center pt-2">
          <div className="w-16 h-16 rounded-[18px] bg-[#D98C9D] flex items-center justify-center mx-auto mb-4 shadow-[0_6px_24px_rgba(217,140,157,0.35)]">
            <span className="text-white text-[28px] font-black">G</span>
          </div>
          <h1 className="text-[34px] font-bold tracking-[-0.035em] text-[#30262B] leading-[1.08]" style={{ fontFamily: "\'Playfair Display\', serif" }}>
            Keep your Bestie,<br /><span className="text-[#D98C9D]">{name}.</span>
          </h1>
          <p className="text-[15px] text-[#81757B] mt-3 leading-relaxed">
            You&apos;ve started building the habit. Keep the accountability going for all {days} days.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EAE1E3] p-5 flex flex-col gap-3">
          {[
            'Proactive AI check-ins before every commitment',
            'Adaptive follow-ups when life gets in the way',
            'Weekly recaps and pattern insights',
            'Multiple goals, all tracked and remembered',
            'Recovery plans when you fall off',
          ].map((point) => (
            <div key={point} className="flex items-start gap-3">
              <Check size={15} className="text-[#D98C9D] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
              <p className="text-[14px] text-[#30262B] font-medium leading-snug">{point}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#F3DDE2] rounded-2xl border border-[#E8C5CF] p-6 text-center">
          <p className="text-[48px] font-bold text-[#30262B] tabular-nums leading-none">$9.99</p>
          <p className="text-[16px] text-[#81757B] mt-1">per month</p>
          <p className="text-[13px] text-[#A89BA1] mt-2">7-day free trial · Cancel anytime</p>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <Btn variant="primary" onClick={() => {}}>Keep my Bestie</Btn>
        <Btn variant="ghost" onClick={() => {}}>Maybe later</Btn>
      </div>
    </Shell>
  )
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: number
  role: 'ai' | 'user'
  text: string
  typing?: boolean
}

const QUICK_REPLIES = [
  "I have no motivation today",
  "Can we move my workout?",
  "I crushed it today ",
  "I'm struggling this week",
]

const AI_RESPONSES: Record<string, string> = {
  "I have no motivation today": "I hear you. Motivation comes and goes — that's completely normal. Here's the thing: you don't need motivation. You just need to start. Can you commit to just 5 minutes today? Just show up, and you can always stop after.",
  "Can we move my workout?": "Of course. Life happens. What time works better for you today? Even moving it by an hour makes it way more likely to happen.",
  "I crushed it today ": "YES. That's what I'm talking about.  You showed up even when you didn't have to. That's the version of you we're building. How did it feel?",
  "I'm struggling this week": "Thank you for being honest with me. Struggling doesn't mean failing — it means you're still here, still trying. What's been the hardest part? Let's figure out what we can make easier.",
}

function getAIReply(text: string, data: UserData): string {
  const lower = text.toLowerCase()
  if (AI_RESPONSES[text]) return AI_RESPONSES[text]

  if (lower.includes('motivat')) return "Motivation is unreliable — consistency is the real goal. What's one tiny thing you could do right now, even if you're not feeling it?"
  if (lower.includes('tired') || lower.includes('exhausted')) return "Rest is part of the process. If you're genuinely tired, listen to your body. But if it's mental resistance — sometimes the workout is the solution, not the problem. What feels right?"
  if (lower.includes('miss') || lower.includes('skip') || lower.includes("didn't")) return "One missed day doesn't undo your progress. The goal isn't perfection — it's not letting one bad day become two. What happened?"
  if (lower.includes('good') || lower.includes('great') || lower.includes('done') || lower.includes('did it')) return "I love that for you. Seriously. Every time you show up, you're building evidence that you're someone who follows through. Keep going."
  if (lower.includes('help') || lower.includes('stuck')) return "I've got you. Tell me what's going on and we'll figure it out together."
  if (lower.includes('why') || lower.includes('point')) return `Remember why you started. You wanted to glow up ${data.categories[0] === 'other' && data.categoryOther ? data.categoryOther.toLowerCase() : (CATEGORIES.find(c => c.id === data.categories[0])?.label.toLowerCase() ?? 'your life')} — that reason hasn't changed.`

  return "I'm here. Tell me more — what's going on?"
}

function ChatScreen({ data }: { data: UserData }) {
  const firstName = data.name || 'Coral'
  const bestie = data.bestieName.trim() || 'Bea'
  const catLabel = data.categories[0] === 'other' && data.categoryOther
    ? data.categoryOther
    : CATEGORIES.find((c) => c.id === data.categories[0])?.label ?? 'your goals'

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'ai',
      text: `Hey ${firstName}  I'm ${bestie}, your Glow Up Bestie. I'm here to help you stay on track with ${catLabel.toLowerCase()}. What's on your mind?`,
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => { scrollToBottom() }, [messages, isTyping])

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return
    const userMsg: ChatMessage = { id: Date.now(), role: 'user', text: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    const delay = 900 + Math.random() * 700
    setTimeout(() => {
      const reply = getAIReply(text.trim(), data)
      setIsTyping(false)
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'ai', text: reply }])
    }, delay)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#FCF8F6]">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-[#EAE1E3] px-4 pt-[53px] pb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#D98C9D] flex items-center justify-center shadow-[0_4px_12px_rgba(217,140,157,0.3)] flex-shrink-0">
          <span className="text-white text-[15px] font-black">G</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-bold text-[#30262B] tracking-[-0.01em]">{bestie}</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9CAF9A]" />
            <span className="text-[12px] text-[#81757B]">Your Glow Up Bestie</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3 pb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-[#D98C9D] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[0_2px_8px_rgba(217,140,157,0.25)]">
                <span className="text-white text-[11px] font-black">G</span>
              </div>
            )}
            <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${
              msg.role === 'ai'
                ? 'bg-white border border-[#EAE1E3] text-[#30262B] rounded-tl-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                : 'bg-[#D98C9D] text-white rounded-tr-sm shadow-[0_2px_8px_rgba(217,140,157,0.3)]'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2.5 items-end">
            <div className="w-8 h-8 rounded-xl bg-[#D98C9D] flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_rgba(217,140,157,0.25)]">
              <span className="text-white text-[11px] font-black">G</span>
            </div>
            <div className="bg-white border border-[#EAE1E3] rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#D98C9D]"
                    style={{ animation: `pulse 1.2s ease-in-out ${i * 0.18}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick replies — shown only when last message is AI and no input */}
      {messages[messages.length - 1]?.role === 'ai' && !input && !isTyping && (
        <div className="flex-shrink-0 px-4 pb-2 flex gap-2 overflow-x-auto">
          {QUICK_REPLIES.map((qr) => (
            <button
              key={qr}
              onClick={() => sendMessage(qr)}
              className="flex-shrink-0 px-4 py-2.5 rounded-full border border-[#EAE1E3] bg-white text-[13px] font-medium text-[#81757B] whitespace-nowrap hover:border-[#D98C9D] hover:text-[#D98C9D] transition-colors duration-150 active:scale-95"
            >
              {qr}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="flex-shrink-0 bg-white border-t border-[#EAE1E3] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-end gap-3">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
          }}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${bestie}…`}
          rows={1}
          className="flex-1 resize-none rounded-2xl border border-[#EAE1E3] bg-[#FCF8F6] px-4 py-3 text-[15px] text-[#30262B] placeholder:text-[#C2B4BA] outline-none focus:border-[#D98C9D] focus:bg-white transition-all duration-150 leading-snug overflow-hidden"
          style={{ minHeight: 46 }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          className="w-11 h-11 rounded-2xl bg-[#D98C9D] flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(217,140,157,0.3)] disabled:opacity-30 disabled:shadow-none transition-all duration-150 active:scale-90"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white -rotate-45 translate-x-0.5 -translate-y-0.5" aria-hidden="true">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Goals screen ─────────────────────────────────────────────────────────────

function GoalsScreen({ data, onNav }: { data: UserData; onNav: (s: Screen) => void }) {
  const goal = getSmartGoal(data)
  const cat = CATEGORIES.find((c) => c.id === (data.categories[0] || 'fitness'))

  const goals = [
    { Icon: cat?.Icon ?? Target, title: goal.title, sessions: 12, total: 20, pct: 60 },
    { Icon: BriefcaseBusiness, title: 'Apply to 3 jobs each week', sessions: 5, total: 9, pct: 55 },
    { Icon: House, title: '15 min daily home reset', sessions: 8, total: 14, pct: 57 },
  ]

  return (
    <Shell className="px-4 pt-[53px] pb-[84px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#30262B]" style={{ fontFamily: "'Playfair Display', serif" }}>Your goals</h1>
          <p className="text-[13px] text-[#81757B] mt-0.5">{goals.length} active goals</p>
        </div>
        <button className="w-9 h-9 rounded-full bg-[#D98C9D] flex items-center justify-center shadow-[0_4px_12px_rgba(217,140,157,0.3)]">
          <Plus size={18} className="text-white" strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {goals.map((g, i) => (
          <div key={i} className="bg-white rounded-[16px] border border-[#EAE1E3] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-[10px] bg-[#F3DDE2] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <g.Icon size={17} className="text-[#D98C9D]" strokeWidth={1.75} />
                </div>
                <p className="text-[15px] font-semibold text-[#30262B] leading-snug">{g.title}</p>
              </div>
              <ChevronLeft size={16} className="text-[#A89BA1] flex-shrink-0 rotate-180 mt-1" />
            </div>
            <div className="ml-12">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[12px] text-[#81757B]">{g.sessions} / {g.total} sessions</p>
                <p className="text-[12px] font-semibold text-[#30262B]">{g.pct}%</p>
              </div>
              <div className="w-full h-1.5 bg-[#F3DDE2] rounded-full overflow-hidden">
                <div className="h-full bg-[#D98C9D] rounded-full transition-all duration-500" style={{ width: `${g.pct}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  )
}

// ─── Bottom nav ───────────────────────────────────────────────────────────────

function BottomNav({ screen, onNav }: { screen: Screen; onNav: (s: Screen) => void }) {
  if (!APP_SCREENS.includes(screen)) return null
  const tabs: { Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>; label: string; target: Screen }[] = [
    { Icon: Sun, label: 'Today', target: 'home' },
    { Icon: Target, label: 'Goals', target: 'goals' },
    { Icon: MessageCircle, label: 'Bestie', target: 'chat' },
    { Icon: UserRound, label: 'Me', target: 'paywall' },
  ]
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-white border-t border-[#EAE1E3] px-4 flex justify-around z-50" style={{ height: 84, paddingBottom: 34, paddingTop: 10 }}>
      {tabs.map((tab) => {
        const active = screen === tab.target || (tab.target === 'goals' && screen === 'weekly-recap')
        return (
          <button key={tab.label} onClick={() => onNav(tab.target)}
            className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors duration-200 ${active ? 'text-[#D98C9D]' : 'text-[#A89BA1]'}`}>
            <tab.Icon size={22} strokeWidth={active ? 2 : 1.75} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [userData, setUserData] = useState<UserData>({
    name: '', email: '',
    categories: [], categoryOther: '', goalText: '', whyText: '', obstacle: '', obstacles: [],
    smartGoalApproved: false,
    commitmentDays: 0, customDays: '',
    accountabilityStyle: '', bestieName: '',
  })

  const update = (partial: Partial<UserData>) => setUserData((prev) => ({ ...prev, ...partial }))

  // Demo mode: seed app with deterministic demo data when ?demo=1 or VITE_DEMO=true
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const demoParam = params.get('demo') === '1'
      const envDemo = (import.meta.env as any).VITE_DEMO === 'true'
      const start = params.get('start')
      if (demoParam || envDemo) {
        // lazy import to avoid circular references
        import('./lib/demo').then((m) => {
          if (m?.demoUser) {
            setUserData((prev) => ({ ...prev, ...m.demoUser }))
            // Optional: allow demo to start directly on home for E2E
            if (start === 'home') setScreen('home')
          }
        }).catch(() => {})
      }
    } catch (err) {
      // ignore in environments without window
    }
  }, [])

  const goNext = () => {
    const idx = SCREEN_ORDER.indexOf(screen)
    if (idx < SCREEN_ORDER.length - 1) setScreen(SCREEN_ORDER[idx + 1])
  }
  const goBack = () => {
    const idx = SCREEN_ORDER.indexOf(screen)
    if (idx > 0) setScreen(SCREEN_ORDER[idx - 1])
  }

  return (
    <div className="max-w-[393px] mx-auto relative min-h-screen bg-[#FCF8F6]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {BACK_SCREENS.includes(screen) && (
        <button onClick={goBack}
          className="absolute top-5 left-5 z-50 w-9 h-9 rounded-full bg-white border border-[#EAE1E3] flex items-center justify-center text-[#81757B] text-[18px] shadow-sm transition-all active:scale-90"
          aria-label="Go back"><ChevronLeft size={18} strokeWidth={2} /></button>
      )}

      {screen === 'splash' && <SplashScreen onNext={goNext} />}
      {screen === 'landing' && <LandingScreen onNext={goNext} />}
      {screen === 'o1-category' && <CategoryScreen onNext={goNext} data={userData} setData={update} />}
      {screen === 'o2-discover' && <DiscoverScreen onNext={goNext} data={userData} setData={update} />}
      {screen === 'o3-obstacle' && <ObstacleScreen onNext={goNext} data={userData} setData={update} />}
      {screen === 'o4-smart-goal' && <SmartGoalScreen onNext={goNext} data={userData} setData={update} />}
      {screen === 'o5-breakdown' && <BreakdownScreen onNext={goNext} data={userData} />}
      {screen === 'o6-commitment' && <CommitmentScreen onNext={goNext} data={userData} setData={update} />}
      {screen === 'o7-accountability' && <AccountabilityScreen onNext={goNext} data={userData} setData={update} />}
      {screen === 'o-name-bestie' && <NameBestieScreen onNext={goNext} data={userData} setData={update} />}
      {screen === 'o8-account' && <AccountScreen onNext={goNext} data={userData} setData={update} />}
      {screen === 'home' && <HomeScreen onNext={goNext} onMissed={() => setScreen('recovery')} data={userData} />}
      {screen === 'goals' && <GoalsScreen data={userData} onNav={setScreen} />}
      {screen === 'checkin' && <CheckinScreen onNext={goNext} onMissed={() => setScreen('recovery')} data={userData} />}
      {screen === 'completion' && <CompletionScreen onNext={goNext} data={userData} />}
      {screen === 'recovery' && <RecoveryScreen onNext={() => setScreen('weekly-recap')} data={userData} />}
      {screen === 'weekly-recap' && <WeeklyRecapScreen onNext={goNext} data={userData} />}
      {screen === 'chat' && <ChatScreen data={userData} />}
      {screen === 'paywall' && <PaywallScreen data={userData} />}

      <BottomNav screen={screen} onNav={setScreen} />
    </div>
  )
}
