// ── Config ────────────────────────────────────────────────────────────────────
// Key and assistant configs are embedded so the demo works as a fully static page
// (GitHub Pages, no backend required)
const VAPI_PUBLIC_KEY = '281cd9f6-ac4b-4266-b018-719d793acc1c';

const ASSISTANT_CONFIGS = {
  'customer-service': {
    id: 'customer-service',
    name: 'Aria — Customer Support',
    icon: '🎧',
    firstMessage: "Hi! I'm Aria, your customer support assistant. I can help with orders, returns, billing, or any questions. How can I help you today?",
    systemPrompt: `You are Aria, a friendly and efficient customer service agent for TechShop, an online electronics retailer.

Your capabilities:
- Look up order status (use fake order numbers like #TS-4821, #TS-9034)
- Process return requests (policy: 30 days, original packaging)
- Answer product questions (laptops, phones, accessories)
- Escalate to human agent if needed (say "Let me connect you to a specialist")
- Handle billing disputes

Tone: Professional but warm. Concise answers — 1-3 sentences max per response. Always confirm the customer's issue before solving.

If asked about order status, provide a realistic response: "Your order #TS-XXXX shipped on [date] and is expected by [date+2 days]."
If unsure, say: "Let me check on that for you" then give a reasonable answer.`,
    voice: { provider: '11labs', voiceId: 'paula' },
    model: { provider: 'openai', model: 'gpt-4o-mini' },
  },
  'appointment-booking': {
    id: 'appointment-booking',
    name: 'Max — Appointment Scheduler',
    icon: '📅',
    firstMessage: "Hello! I'm Max from Hillside Medical Clinic. I can help you book, reschedule, or cancel an appointment. What would you like to do today?",
    systemPrompt: `You are Max, an appointment scheduling assistant for Hillside Medical Clinic.

Available appointment types:
- General Checkup (30 min) — Dr. Chen, Dr. Patel
- Specialist Consultation (45 min) — Dr. Williams (Cardiology), Dr. Lee (Dermatology)
- Urgent Care (15 min) — Dr. Patel, available same-day
- Follow-up Visit (20 min) — Any doctor

Available slots (use these realistically):
- Monday–Friday: 9am, 10:30am, 1pm, 2:30pm, 4pm
- Saturday: 9am, 10:30am only

Workflow:
1. Ask what type of appointment
2. Ask for preferred date and time
3. Confirm doctor availability
4. Ask for patient name and date of birth for verification
5. Confirm booking with a reference number like "APT-" + 4 random digits
6. Offer to send a confirmation (say "I'll send a confirmation to your email on file")

If rescheduling: ask for existing appointment reference, then offer new slots.
If canceling: confirm reference, process cancellation, ask about rebooking.

Tone: Calm, professional, efficient. Never ask for sensitive info like SSN or full insurance details.`,
    voice: { provider: '11labs', voiceId: 'adam' },
    model: { provider: 'openai', model: 'gpt-4o-mini' },
  },
};

let vapi = null;
let activeAgent = 'customer-service';
let callActive = false;
let muted = false;
let callStartTime = null;
let timerInterval = null;

const AGENTS = {
  'customer-service': { name: 'Aria — Customer Support', icon: '🎧', colorClass: '' },
  'appointment-booking': { name: 'Max — Appointment Scheduler', icon: '📅', colorClass: 'green' },
};

// ── Vapi Init ─────────────────────────────────────────────────────────────────

async function initVapi() {
  try {
    const VapiClass = VapiSDK?.default?.default ?? VapiSDK?.default ?? VapiSDK?.Vapi ?? VapiSDK;
    if (typeof VapiClass !== 'function') {
      console.error('Vapi class not found in bundle. VapiSDK =', VapiSDK);
      return;
    }

    vapi = new VapiClass(VAPI_PUBLIC_KEY);
    console.log('✅ Vapi initialized');

    vapi.on('call-start', () => {
      setCallState('active');
      addMessage('system', '✅ Call connected — speak now');
    });
    vapi.on('call-end', () => {
      setCallState('idle');
      addMessage('system', '📵 Call ended');
      setVisualizerActive(false);
    });
    vapi.on('speech-start', () => setVisualizerActive(true));
    vapi.on('speech-end',   () => setVisualizerActive(false));
    vapi.on('message', (msg) => {
      if (msg.type !== 'transcript' || msg.transcriptType !== 'final') return;
      if (msg.role === 'assistant') { removeTyping(); addMessage('agent', msg.transcript); }
      else if (msg.role === 'user') { addMessage('user', msg.transcript); showTyping(); }
    });
    vapi.on('error', (err) => {
      console.error('Vapi error:', err);
      addMessage('system', `❌ ${err?.message || JSON.stringify(err)}`);
      setCallState('idle');
    });

  } catch (err) {
    console.error('Vapi init failed:', err);
  }
}

// ── Call Control ──────────────────────────────────────────────────────────────

async function toggleCall() {
  if (!callActive) await startCall();
  else endCall();
}

async function startCall() {
  if (!vapi) {
    addMessage('system', '⚠️ Vapi not ready. Check console for errors.');
    return;
  }

  setCallState('connecting');

  try {
    const assistant = ASSISTANT_CONFIGS[activeAgent];

    vapi.start({
      model: {
        provider: assistant.model.provider,
        model: assistant.model.model,
        messages: [{ role: 'system', content: assistant.systemPrompt }],
      },
      voice: {
        provider: assistant.voice.provider,
        voiceId: assistant.voice.voiceId,
      },
      firstMessage: assistant.firstMessage,
      silenceTimeoutSeconds: 30,
      maxDurationSeconds: 300,
    });

  } catch (err) {
    console.error('Start call failed:', err);
    addMessage('system', `❌ ${err.message}`);
    setCallState('idle');
  }
}

function endCall() {
  if (vapi) vapi.stop();
  setCallState('idle');
}

window.toggleCall = toggleCall;

function toggleMute() {
  if (!vapi || !callActive) return;
  muted = !muted;
  vapi.setMuted(muted);
  const btn = document.getElementById('btn-mute');
  btn.textContent = muted ? '🔇' : '🎤';
  btn.classList.toggle('muted', muted);
}
window.toggleMute = toggleMute;

// ── Agent Selection ───────────────────────────────────────────────────────────

function selectAgent(id) {
  if (callActive) return;
  activeAgent = id;
  const agent = AGENTS[id];

  document.querySelectorAll('.agent-card').forEach(c => c.classList.remove('active', 'green'));
  const card = document.getElementById(`card-${id}`);
  card.classList.add('active');
  if (agent.colorClass) card.classList.add(agent.colorClass);

  document.getElementById('widget-avatar').textContent = agent.icon;
  document.getElementById('widget-avatar').className = `agent-avatar ${agent.colorClass}`;
  document.getElementById('widget-name').textContent = agent.name;
  document.getElementById('btn-call').className = `btn-call start ${agent.colorClass}`;

  clearTranscript();
}
window.selectAgent = selectAgent;

// ── UI State ──────────────────────────────────────────────────────────────────

function setCallState(state) {
  const dot      = document.getElementById('status-dot');
  const statusTx = document.getElementById('status-text');
  const btnCall  = document.getElementById('btn-call');
  const btnIcon  = document.getElementById('btn-icon');
  const btnText  = document.getElementById('btn-text');
  const btnMute  = document.getElementById('btn-mute');
  const timer    = document.getElementById('call-timer');
  const agent    = AGENTS[activeAgent];

  if (state === 'idle') {
    callActive = false;
    dot.className = 'status-dot idle';
    statusTx.textContent = 'Ready';
    btnCall.className = `btn-call start ${agent.colorClass}`;
    btnCall.disabled = false;
    btnIcon.textContent = '📞';
    btnText.textContent = 'Start Call';
    btnMute.disabled = true;
    setVisualizerActive(false);
    stopTimer(); timer.style.display = 'none';
    muted = false; btnMute.textContent = '🎤'; btnMute.classList.remove('muted');
  } else if (state === 'connecting') {
    dot.className = 'status-dot calling';
    statusTx.textContent = 'Connecting...';
    btnCall.disabled = true;
    btnIcon.textContent = '⏳'; btnText.textContent = 'Connecting...';
  } else if (state === 'active') {
    callActive = true;
    dot.className = 'status-dot';
    statusTx.textContent = 'In call';
    btnCall.className = 'btn-call end';
    btnCall.disabled = false;
    btnIcon.textContent = '📵'; btnText.textContent = 'End Call';
    btnMute.disabled = false;
    setVisualizerActive(true);
    startTimer(); timer.style.display = 'block';
  }
}

// ── Visualizer ────────────────────────────────────────────────────────────────

function buildVisualizer() {
  const viz = document.getElementById('visualizer');
  viz.innerHTML = '';
  [8,14,20,28,20,32,20,28,20,14,8,20,28,14,8].forEach((h, i) => {
    const bar = document.createElement('div');
    bar.className = 'viz-bar';
    bar.style.setProperty('--h', `${h}px`);
    bar.style.setProperty('--dur', `${[0.5,0.7,0.4,0.6,0.8,0.5,0.7,0.4,0.6,0.8,0.5,0.6,0.4,0.7,0.5][i]}s`);
    viz.appendChild(bar);
  });
}

function setVisualizerActive(on) {
  document.querySelectorAll('.viz-bar').forEach(b => b.classList.toggle('active', on));
}

// ── Timer ─────────────────────────────────────────────────────────────────────

function startTimer() {
  callStartTime = Date.now();
  timerInterval = setInterval(() => {
    const s = Math.floor((Date.now() - callStartTime) / 1000);
    document.getElementById('call-timer').textContent =
      `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  }, 1000);
}
function stopTimer() { clearInterval(timerInterval); timerInterval = null; }

// ── Transcript ────────────────────────────────────────────────────────────────

let typingEl = null;

function clearTranscript() {
  document.getElementById('transcript').innerHTML = `
    <div class="transcript-empty" id="transcript-empty">
      <div class="empty-icon">🎙️</div>
      <p>Press <strong>Start Call</strong> to begin a voice conversation<br>with the AI agent.</p>
    </div>`;
}

function hideEmpty() {
  document.getElementById('transcript-empty')?.remove();
}

function removeTyping() {
  if (typingEl) { typingEl.remove(); typingEl = null; }
}

function addMessage(role, text) {
  hideEmpty(); removeTyping();
  const t = document.getElementById('transcript');
  const label = role === 'agent' ? AGENTS[activeAgent].name.split('—')[0].trim() : role === 'user' ? 'You' : 'System';
  const el = document.createElement('div');
  el.className = `msg ${role}`;
  el.innerHTML = `<div><div class="msg-bubble">${text.replace(/</g,'&lt;')}</div><div class="msg-label">${label}</div></div>`;
  t.appendChild(el);
  t.scrollTop = t.scrollHeight;
}

function showTyping() {
  hideEmpty(); removeTyping();
  const t = document.getElementById('transcript');
  typingEl = document.createElement('div');
  typingEl.className = 'msg agent';
  typingEl.innerHTML = `<div><div class="typing"><span></span><span></span><span></span></div></div>`;
  t.appendChild(typingEl);
  t.scrollTop = t.scrollHeight;
}

// ── Boot ──────────────────────────────────────────────────────────────────────

buildVisualizer();
initVapi();
