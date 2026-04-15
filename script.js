/* ===========================
   TYPING ANIMATION
   =========================== */
const phrases = [
  'Senior AI Engineer',
  'LLM Systems Architect',
  'Agentic AI Builder',
  'U.S. Patent Inventor',
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 45 : 80);
}
type();

/* ===========================
   THEME TOGGLE
   =========================== */
const themeBtn = document.getElementById('themeToggle');
const html = document.documentElement;
const stored = localStorage.getItem('theme');
if (stored) {
  html.setAttribute('data-theme', stored);
  themeBtn.textContent = stored === 'dark' ? '☀️' : '🌙';
}
themeBtn.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeBtn.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

/* ===========================
   SCROLL ANIMATIONS
   =========================== */
const animItems = document.querySelectorAll(
  '.card, .paper-card, .stats-row, .patent-cert, .tl-card, .project-featured'
);
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 55);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
animItems.forEach(el => io.observe(el));

/* ===========================
   PILL TOGGLE
   =========================== */
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });
});

/* ===========================
   FUTURISTIC CHAT WIDGET
   =========================== */
const chatFab   = document.getElementById('chatFab');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatMsgs  = document.getElementById('chatMessages');
const navAskBtn = document.getElementById('navAskBtn');
const chatInput = document.getElementById('chatInput');
const chatSend  = document.getElementById('chatSend');
let chatOpen = false;

function openChat() {
  chatOpen = true;
  chatPanel.classList.add('open');
  chatFab.classList.add('active');
  setTimeout(() => chatInput?.focus(), 350);
}
function closeChat() {
  chatOpen = false;
  chatPanel.classList.remove('open');
  chatFab.classList.remove('active');
}
chatFab.addEventListener('click', () => chatOpen ? closeChat() : openChat());
navAskBtn?.addEventListener('click', openChat);
chatClose.addEventListener('click', closeChat);

/* Category tabs */
document.querySelectorAll('.chat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.chat-q-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('ctab-' + tab.dataset.ctab);
    if (panel) panel.classList.add('active');
  });
});

/* Pre-written Q&A answers */
const qaAnswers = [
  // Career
  "Yes — actively looking for a Senior or Staff AI Engineer role where I own the full AI stack. Based in New York, open to hybrid or remote. If you're building something ambitious in AI, let's talk. 🚀",
  "I'm targeting roles where I can lead agentic systems, LLM infrastructure, and production AI at scale — ideally IC5/Staff level at an AI-native company or a team doing serious applied AI work.",
  "New York, NY. Open to hybrid 2-3 days/week or fully remote. No relocation required. H1B transfer-ready.",
  // Tech
  "Python, LangChain, LangGraph, GPT-4, Claude, RAG pipelines, Langfuse, AWS, FastAPI, Node.js. I own the full stack — from prompt engineering to CI/CD for AI systems. 🛠️",
  "Both, depending on the problem. LangChain for speed and ecosystem. Custom orchestration when I need fine-grained control over memory, retries, and routing — which is most of the time in production.",
  "Langfuse for traces and evals, custom eval frameworks for domain-specific quality checks, cost/latency dashboards, and automated regression tests on model outputs. LLMOps is a first-class concern.",
  // Build
  "I filed a provisional patent with USPTO (App. No. 63/721,849) for a self-healing multi-agent architecture. When an agent fails, the pipeline detects it, diagnoses root cause, and reroutes — zero human intervention. Built and running at Bank of America. 🔬",
  "5 stages: paste JD or URL → archetype detection → 6-block evaluation (CV match, gaps, comp, STAR stories, hooks) → ATS-optimised PDF generation via Playwright → pipeline tracker. The whole thing runs as a Claude Code agent.",
  "Production LLM systems handling sensitive financial data at $30B+ scale. Multi-agent pipelines, real-time document processing, GenAI tooling used by internal teams. Everything built with reliability and auditability in mind.",
];

/* Add message to chat */
function addMsg(text, type) {
  const d = document.createElement('div');
  d.className = `chat-bubble ${type}`;
  if (type === 'bot') {
    d.innerHTML = `<span class="chat-prompt-sym">&gt;_</span>${escapeHtml(text)}`;
  } else {
    d.textContent = text;
  }
  chatMsgs.appendChild(d);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

/* Typewriter bot response */
function typeMsg(text) {
  const d = document.createElement('div');
  d.className = 'chat-bubble bot';
  const sym = document.createElement('span');
  sym.className = 'chat-prompt-sym';
  sym.textContent = '>_ ';
  const span = document.createElement('span');
  d.appendChild(sym);
  d.appendChild(span);
  chatMsgs.appendChild(d);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
  let i = 0;
  const t = setInterval(() => {
    span.textContent = text.slice(0, ++i);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
    if (i >= text.length) clearInterval(t);
  }, 14);
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* Q button clicks */
document.querySelectorAll('.chat-cq').forEach(btn => {
  btn.addEventListener('click', () => {
    const idx = parseInt(btn.dataset.q);
    addMsg(btn.textContent, 'user');
    btn.disabled = true;
    setTimeout(() => {
      typeMsg(qaAnswers[idx]);
      setTimeout(() => { btn.disabled = false; }, 1200);
    }, 300);
  });
});

/* Custom input */
function handleCustomInput() {
  const raw = chatInput.value.trim();
  if (!raw) return;
  chatInput.value = '';
  addMsg(raw, 'user');
  const reply = generateReply(raw.toLowerCase());
  setTimeout(() => typeMsg(reply), 350);
}
chatSend?.addEventListener('click', handleCustomInput);
chatInput?.addEventListener('keydown', e => { if (e.key === 'Enter') handleCustomInput(); });

/* Simple keyword-based fallback replies */
function generateReply(q) {
  if (/patent|invent|uspto|self.heal/i.test(q))
    return "Filed USPTO provisional patent App. No. 63/721,849 for a self-healing multi-agent architecture — autonomous failure detection, diagnosis, and rerouting. Built at Bank of America. 🔬";
  if (/open|looking|available|hire|job|work/i.test(q))
    return "Yes, actively looking! Senior/Staff AI Engineer in New York. Hybrid or remote. Open to H1B transfer. Ping madhav.venigalla@gmail.com 🚀";
  if (/stack|tech|language|python|langchain|tool/i.test(q))
    return "Python · LangChain · LangGraph · GPT-4 · Claude · RAG · Langfuse · AWS · FastAPI · Node.js · Go. Full-stack AI ownership.";
  if (/pipeline|project|career.ops|demo/i.test(q))
    return "AI job search pipeline — 5 stages: paste JD → archetype detection → 6-block eval → ATS PDF → tracker. Runs as a Claude Code agent. Live demo is on this page! 🤖";
  if (/bank|bofa|bank of america|finance/i.test(q))
    return "3+ years building production LLM systems at Bank of America — $30B+ institution scale. Multi-agent pipelines, real-time doc processing, GenAI tooling for internal teams.";
  if (/salary|comp|money|pay/i.test(q))
    return "Targeting $250–320k TC for Staff/Senior roles in NYC. Open to discussing equity + base structure.";
  if (/contact|email|reach|connect/i.test(q))
    return "madhav.venigalla@gmail.com · linkedin.com/in/cloudaiengineer · Or hit 'Let's talk' above 📬";
  if (/github|code|open.source/i.test(q))
    return "Check the AI Pipeline on GitHub: github.com/maddykws/jubilant-waddle — the career-ops engine powering this live demo.";
  if (/paper|research|publication|memory/i.test(q))
    return "2 papers under review: 'Persistent Memory Architecture for Long-Horizon LLM Agents' (+35% factual consistency) and 'Self-Healing Memory Agents' (−40% context drift). 📄";
  return "Good question. The short answer: I build AI systems that work at production scale — agentic, observable, and self-healing. Want specifics? Try the preset questions above or check the demo. 💡";
}

/* ===========================
   PROJECT TABS
   =========================== */
document.querySelectorAll('.ptab[data-tab]').forEach(tab => {
  tab.addEventListener('click', () => {
    const parent = tab.closest('.project-featured');
    parent.querySelectorAll('.ptab[data-tab]').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const which = tab.dataset.tab;
    parent.querySelectorAll('.ptab-panel').forEach(p => p.style.display = 'none');
    const panel = parent.querySelector(`#ptab-${which}`);
    if (panel) panel.style.display = '';
  });
});

/* Pipeline flow step details */
const pfSteps = [
  { title: '📥 Paste JD or URL', body: 'Drop any job listing — URL or raw text. Playwright auto-navigates and verifies the listing is still active. Supports Greenhouse, Ashby, Lever, and company career pages.' },
  { title: '🏷️ Archetype Detection', body: 'Classifies the role into one of 6 archetypes: LLMOps, Agentic, PM, Solutions Architect, FDE, or Transformation. This tailors the entire evaluation lens and scoring.' },
  { title: '📊 6-Block Evaluation', body: 'Role summary → CV match score → level strategy → comp research → personalization hooks → Interview STAR+R stories. Outputs a structured 1–5 score with reasoning.' },
  { title: '📄 Generate CV + Report', body: 'Produces a keyword-injected ATS-optimized PDF using Playwright/HTML (Space Grotesk + DM Sans). Each CV is tailored to the specific job description. Markdown eval report also saved.' },
  { title: '📋 Pipeline Tracker', body: 'Appends to a single Markdown tracker with dedup, status normalization, and integrity checks. A Go + Bubble Tea TUI lets you browse and filter your full application pipeline.' },
];

document.querySelectorAll('.pf-step').forEach(step => {
  step.addEventListener('click', () => {
    document.querySelectorAll('.pf-step').forEach(s => s.classList.remove('active'));
    step.classList.add('active');
    const idx = parseInt(step.dataset.step);
    const detail = document.getElementById('pfDetail');
    if (detail && pfSteps[idx]) {
      detail.innerHTML = `<div class="pfd-title">${pfSteps[idx].title}</div><div class="pfd-body">${pfSteps[idx].body}</div>`;
    }
  });
});

/* ===========================
   LIVE EVAL — resume-based, 1 per resume
   =========================== */
const IS_PROD = !['localhost', '127.0.0.1'].includes(window.location.hostname);
const API = IS_PROD ? null : 'http://localhost:3334/api';

let sessionId = sessionStorage.getItem('cop_sid');
if (!sessionId) {
  sessionId = Math.random().toString(36).slice(2);
  sessionStorage.setItem('cop_sid', sessionId);
}

const evalBtn          = document.getElementById('evalBtn');
const evalResultPanel  = document.getElementById('evalResultPanel');
const evalResumeTA     = document.getElementById('evalResume');
const evalResumeHint   = document.getElementById('evalResumeHint');

/* Simple hash for resume deduplication (matches server logic) */
function hashResume(str) {
  const s = str.trim().slice(0, 2000);
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + c;
    hash = hash & hash;
  }
  return hash.toString(36);
}

/* Check if this resume hash was already evaluated this session */
function getEvaluatedHashes() {
  try { return JSON.parse(sessionStorage.getItem('cop_hashes') || '[]'); }
  catch { return []; }
}
function markHashEvaluated(h) {
  const hashes = getEvaluatedHashes();
  hashes.push(h);
  sessionStorage.setItem('cop_hashes', JSON.stringify(hashes));
}

/* Resume textarea reactivity */
evalResumeTA?.addEventListener('input', () => {
  const val = evalResumeTA.value.trim();
  if (val.length > 50) {
    evalResumeTA.classList.add('has-content');
    evalResumeHint.textContent = `✓ Resume detected (${val.split(/\s+/).length} words) — fill in the job details and run!`;
    evalResumeHint.classList.add('ready');
    evalBtn.disabled = false;
    evalBtn.querySelector('#evalBtnText').textContent = 'Run Evaluation →';
  } else {
    evalResumeTA.classList.remove('has-content');
    evalResumeHint.textContent = 'Paste your resume to unlock the evaluation';
    evalResumeHint.classList.remove('ready');
    evalBtn.disabled = true;
    evalBtn.querySelector('#evalBtnText').textContent = 'Paste Resume First';
  }
});

evalBtn?.addEventListener('click', async () => {
  const resumeText = evalResumeTA?.value.trim() || '';
  const role       = document.getElementById('evalRole')?.value.trim()    || '';
  const company    = document.getElementById('evalCompany')?.value.trim() || '';
  const jd         = document.getElementById('evalJD')?.value.trim()      || '';

  if (resumeText.length < 50) {
    evalResumeTA?.focus();
    return;
  }
  if (!role && !company && !jd) {
    document.getElementById('evalRole')?.focus();
    return;
  }

  const resumeHash = hashResume(resumeText);
  const evaluated  = getEvaluatedHashes();
  if (evaluated.includes(resumeHash)) {
    showEvalError('This resume has already been evaluated. Each resume gets 1 free evaluation.');
    return;
  }

  evalBtn.disabled = true;
  document.getElementById('evalBtnText').textContent = 'Evaluating…';
  evalResultPanel.style.display = 'block';
  evalResultPanel.innerHTML = `<div class="erp-loading"><div class="erp-loading-dots"><span></span><span></span><span></span></div><div class="erp-loading-text">Running career-ops evaluation${company ? ' for ' + company : ''}…</div></div>`;

  try {
    if (API) {
      // Local dev — call the Express backend
      const res  = await fetch(`${API}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, company, description: jd, sessionId, resumeText, resumeHash }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Evaluation failed');
      markHashEvaluated(resumeHash);
      renderEvalResult(data, role, company);
    } else {
      // Production (GitHub Pages) — run client-side simulation
      await new Promise(r => setTimeout(r, 1200)); // simulate latency
      const data = clientSideEval(role, company, jd, resumeText);
      markHashEvaluated(resumeHash);
      renderEvalResult(data, role, company);
    }
  } catch (e) {
    showEvalError(e.message);
  } finally {
    evalBtn.disabled = false;
    document.getElementById('evalBtnText').textContent = 'Run Evaluation →';
  }
});

function clientSideEval(role = '', company = '', description = '', resumeText = '') {
  const jdText  = (role + ' ' + company + ' ' + description).toLowerCase();
  const cvText  = resumeText.toLowerCase();
  const aiWords   = ['llm','gpt','claude','rag','agent','genai','nlp','transformer','embedding','vector','fine-tun','agentic','langchain','langgraph','multimodal','ml','machine learning','deep learning','neural','bert','openai','anthropic','llama','pytorch','tensorflow'];
  const techWords = ['python','javascript','typescript','java','go','rust','node','react','aws','gcp','azure','docker','kubernetes','fastapi','flask','django','postgresql','mongodb','redis','spark','sql'];
  const senWords  = ['senior','staff','principal','lead','head','director','manager','architect','vp','svp'];
  const allKeywords   = [...aiWords, ...techWords];
  const jdKeywords    = allKeywords.filter(k => jdText.includes(k));
  const resumeMatches = jdKeywords.filter(k => cvText.includes(k));
  const overlapRatio  = jdKeywords.length > 0 ? resumeMatches.length / jdKeywords.length : 0.3;
  const senHit   = senWords.some(k => cvText.includes(k));
  const isAICV   = aiWords.filter(k => cvText.includes(k)).length >= 3;
  const isTopLab = ['openai','anthropic','deepmind','google','meta','amazon','microsoft','nvidia'].some(k => jdText.includes(k));
  let score = 1.5 + (overlapRatio * 2.5) + (senHit ? 0.3 : 0) + (isAICV ? 0.4 : 0) + (isTopLab ? -0.1 : 0);
  score = Math.min(5.0, Math.max(1.5, Math.round(score * 10) / 10));
  const archetype = score >= 4.5 ? 'Deep Fit' : score >= 4.0 ? 'Strong Match' : score >= 3.5 ? 'Good Fit' : score >= 3.0 ? 'Moderate Fit' : 'Weak Match';
  const verdict   = score >= 4.5 ? '🟢 Exceptional match — highly recommend applying' :
                    score >= 4.0 ? '🟢 Strong match — your profile aligns well with this role' :
                    score >= 3.5 ? '🟡 Good match — tailor your application to the JD keywords' :
                    score >= 3.0 ? '🟡 Moderate fit — some gaps to address before applying' :
                                   '🔴 Low fit — consider roles that better match your background';
  const strengthPool = resumeMatches.slice(0, 3).map(k => k.charAt(0).toUpperCase() + k.slice(1) + ' ✓');
  while (strengthPool.length < 3) { const extras = ['Strong background','Relevant experience','Technical depth']; strengthPool.push(extras[strengthPool.length]); }
  return {
    score, archetype, verdict,
    strengths: strengthPool.slice(0, 3),
    h1b: !jdText.includes('citizen only') && !jdText.includes('no sponsor') && !jdText.includes('no visa'),
    level: senHit ? 'Senior / Staff' : isAICV ? 'Mid / Senior' : 'Mid-level',
    reason: `Your resume shows ${resumeMatches.length} keyword match${resumeMatches.length !== 1 ? 'es' : ''} for this ${role || 'role'}${isTopLab ? ' at a top tech company' : ''} — ${score >= 4 ? 'a strong fit worth pursuing' : 'consider highlighting more relevant experience'}.`,
    live: false,
  };
}

function renderEvalResult(d, role, company) {
  const label  = [company, role].filter(Boolean).join(' — ') || 'Job Evaluation';
  const pct    = ((d.score / 5) * 100).toFixed(0);
  const tags   = (d.strengths || []).map(s => `<span class="erp-tag strength">${s}</span>`).join('');
  const h1bTag = d.h1b ? `<span class="erp-tag h1b">H1B Sponsored ✓</span>` : '';
  evalResultPanel.innerHTML = `
    <div class="erp-header">
      <div class="erp-job">${label}</div>
      <div class="erp-archetype">${d.archetype || 'Fit Analysis'}</div>
    </div>
    <div class="erp-body">
      <div class="erp-score-row">
        <div class="erp-bar-wrap"><div class="erp-bar-fill" data-pct="${pct}" style="width:0%"></div></div>
        <div class="erp-score-num">${d.score}<span style="font-size:0.85rem;opacity:0.5">/5</span></div>
      </div>
      <div class="erp-verdict">${d.verdict || ''}</div>
      <div class="erp-tags">${tags}${h1bTag}</div>
      ${d.reason ? `<div class="erp-reason">${d.reason}</div>` : ''}
    </div>
    <div class="erp-footer">
      <span class="erp-live-badge">${d.live ? '🟢 Live API' : '🟡 Smart Simulation'}</span>
      <span>career-ops engine · 1 free eval/resume</span>
    </div>`;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const fill = evalResultPanel.querySelector('.erp-bar-fill');
    if (fill) fill.style.width = fill.dataset.pct + '%';
  }));
}

function showEvalError(msg) {
  evalResultPanel.style.display = 'block';
  evalResultPanel.innerHTML = `<div class="erp-body" style="padding:16px"><div style="color:var(--rose);font-size:0.85rem;font-weight:600">⚠ ${msg}</div></div>`;
}

/* ===========================
   LEGACY DEMO CHIPS (static, no API)
   =========================== */
const demoChips  = document.querySelectorAll('.demo-chip');
const demoOutput = document.getElementById('demoOutput');

const evalData = [
  {
    company: 'OpenAI',
    role: 'Senior AI Engineer',
    score: 4.8,
    archetype: 'Deep AI Builder',
    tags: ['Multi-Agent ✓', 'LLM Research ✓', 'Python ✓', 'H1B Sponsored ✓'],
    verdict: '🟢 Exceptional match — strong apply',
  },
  {
    company: 'Anthropic',
    role: 'LLM Engineer',
    score: 4.6,
    archetype: 'LLM Architect',
    tags: ['Claude API ✓', 'Safety-focused ✓', 'AWS ✓', 'H1B Sponsored ✓'],
    verdict: '🟢 Strong match — lead with the patent',
  },
  {
    company: 'Goldman Sachs',
    role: 'AI Lead',
    score: 4.3,
    archetype: 'Enterprise AI Builder',
    tags: ['FinTech ✓', 'Production Scale ✓', 'GenAI ✓', 'H1B Sponsored ✓'],
    verdict: '🟡 Good match — finance domain is a plus',
  },
];

if (demoChips.length && demoOutput) {
  demoChips.forEach(chip => {
    chip.addEventListener('click', () => {
      demoChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      runStaticEval(parseInt(chip.dataset.idx));
    });
  });

  function runStaticEval(idx) {
    const d = evalData[idx];
    demoOutput.innerHTML = `
      <div class="demo-loading"><span></span><span></span><span></span></div>
      <div class="demo-loading-text">evaluating ${d.company} · ${d.role}...</div>
    `;
    setTimeout(() => {
      const pct = ((d.score / 5) * 100).toFixed(0);
      demoOutput.innerHTML = `
        <div class="eval-result">
          <div class="eval-row-top">
            <div>
              <div class="eval-company">${d.company}</div>
              <div class="eval-role">${d.role}</div>
            </div>
            <div class="eval-archetype-badge">${d.archetype}</div>
          </div>
          <div class="eval-score-row">
            <div class="eval-bar-wrap">
              <div class="eval-bar-fill" data-pct="${pct}" style="width:0%"></div>
            </div>
            <div class="eval-score-label">${d.score}<span>/5</span></div>
          </div>
          <div class="eval-tags">
            ${d.tags.map(t => `<span class="eval-tag">${t}</span>`).join('')}
          </div>
          <div class="eval-verdict">${d.verdict}</div>
        </div>
      `;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const fill = demoOutput.querySelector('.eval-bar-fill');
        if (fill) fill.style.width = fill.dataset.pct + '%';
      }));
    }, 1400);
  }

  setTimeout(() => {
    demoChips[0].classList.add('active');
    runStaticEval(0);
  }, 1800);
}

/* ===========================
   VOICE AGENT — Tab switching + backend polling
   =========================== */

const VOICE_API = IS_PROD ? '' : 'http://localhost:3335';
const VOICE_DEMO_SRC = IS_PROD ? '/voice-demo/' : 'http://localhost:3335/demo';
let voiceOnline = false;

// Tab switcher for voice agent card
document.querySelectorAll('.ptab[data-voice-tab]').forEach(tab => {
  tab.addEventListener('click', () => {
    const card = tab.closest('.project-featured');
    card.querySelectorAll('.ptab[data-voice-tab]').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const which = tab.dataset.voiceTab;
    card.querySelectorAll('.voice-tab-panel').forEach(p => p.style.display = 'none');
    const panel = document.getElementById(`vtab-${which}`);
    if (panel) {
      panel.style.display = '';
      if (which === 'demo') renderVoiceDemo();
    }
  });
});

function renderVoiceDemo() {
  const container = document.getElementById('voice-demo-container');
  if (!container) return;
  if (voiceOnline) {
    container.innerHTML = `
      <div class="voice-demo-frame-wrap">
        <iframe src="${VOICE_DEMO_SRC}" title="Voice AI Agent Demo" allow="microphone; autoplay"></iframe>
      </div>
      <p style="font-size:0.72rem;color:var(--text2);margin-top:8px;text-align:center;">
        Microphone access required · Powered by Vapi AI + GPT-4o mini
      </p>`;
  } else {
    container.innerHTML = `
      <div class="voice-demo-frame-wrap">
        <div class="voice-demo-offline">
          <div class="offline-icon">🎙️</div>
          <p>Voice agent server is offline.<br>
          Start it locally to try the live demo:</p>
          <code>cd ~/Documents/vapi-voice-agent && npm start</code><br>
          <a class="voice-open-btn" href="${VOICE_DEMO_SRC}" target="_blank" rel="noopener">
            Open Demo ↗
          </a>
        </div>
      </div>`;
  }
}

async function pollVoiceBackend() {
  const dot = document.getElementById('voiceStatusDot');
  const label = document.getElementById('voiceStatusLabel');
  if (!dot || !label) return;

  const healthUrl = IS_PROD ? '/api/health.json' : `${VOICE_API}/api/health`;

  try {
    const res = await fetch(healthUrl, { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      voiceOnline = true;
      dot.className = 'voice-status-dot online';
      label.textContent = `${data.agents?.length || 2} agents online`;
      const demoPanel = document.getElementById('vtab-demo');
      if (demoPanel && demoPanel.style.display !== 'none') renderVoiceDemo();
      return;
    }
  } catch {}
  voiceOnline = false;
  dot.className = 'voice-status-dot offline';
  label.textContent = 'server offline';
}

// Poll immediately and then every 8s
pollVoiceBackend();
setInterval(pollVoiceBackend, 8000);
