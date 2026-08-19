/* =========================================================================
   ЛЕГКО ЗМІНЮВАНІ ТЕКСТИ / ДАНІ — редагуй тільки цей блок
   ========================================================================= */

// Текст привітання на листівці (Етап 2).
const GREETING_TEXT = `З Днюхою, Ліза! 🎉 Бажаю, щоб кожен твій день був сповнений щастя та хороших спогадів! Дякуємо, що ти у нас є 💗💗💗`;

// Повідомлення від "Сладусік" у чаті (Етап 3).
const CHAT_MESSAGES = [
  "리자야, 생일 축하해! 🎂🎉💗",
  "너를 위한 선물이 있어 🎁"
];

// Фото-бульбашка від Сладусіка після текстових повідомлень (Етап 3)
const GDRAGON_KISS_PHOTO = "assets/gdragon-photos/gdragon-kiss.jpg";

// Фото, яке вискакує з подарунка на Етапі 6.
const GIFT_PHOTO = "assets/decor/tinumiki.png";

/* =========================================================================
   ДОПОМІЖНІ ФУНКЦІЇ
   ========================================================================= */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* =========================================================================
   РОМАШКИ (декоративний фон)
   Використовує зображення assets/decor/daisy.png (твій asset).
   ========================================================================= */
const daisyField = document.getElementById("daisy-field");
const DAISY_COUNT = 34;
const DAISY_IMG = "assets/decor/daisy.png";
let daisyEls = [];

function makeDaisyImg(size) {
  return `<img src="${DAISY_IMG}" alt="" draggable="false" style="width:100%;height:100%;object-fit:contain;display:block;" />`;
}

// Розкладає ромашки по сітці з невеликим випадковим зсувом усередині
// кожної клітинки — так вони розподілені рівномірно по всьому екрану
// і майже не накладаються одна на одну.
function gridPositions(count) {
  const aspect = window.innerWidth / window.innerHeight;
  let cols = Math.round(Math.sqrt(count * aspect));
  let rows = Math.ceil(count / cols);
  const cellW = 100 / cols;
  const cellH = 100 / rows;

  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ c, r });
    }
  }
  // перемішуємо клітинки, щоб порядок появи не був "рядок за рядком"
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  const jitter = 0.28; // частка клітинки, на яку можна зміститись від центру
  return cells.slice(0, count).map(({ c, r }) => {
    const cx = (c + 0.5) * cellW + rand(-jitter, jitter) * cellW;
    const cy = (r + 0.5) * cellH + rand(-jitter, jitter) * cellH;
    return {
      left: Math.min(96, Math.max(0, cx)),
      top: Math.min(96, Math.max(0, cy))
    };
  });
}

function initDaisyField() {
  daisyField.innerHTML = "";
  daisyEls = [];
  const positions = gridPositions(DAISY_COUNT);
  for (let i = 0; i < DAISY_COUNT; i++) {
    const size = rand(42, 82);
    const pos = positions[i];
    const wrap = document.createElement("div");
    wrap.className = "daisy";
    wrap.style.left = pos.left + "vw";
    wrap.style.top = pos.top + "vh";
    wrap.style.width = size + "px";
    wrap.style.height = size + "px";
    const rotFrom = rand(-16, 16);
    const rotTo = rotFrom + rand(20, 40) * (Math.random() > 0.5 ? 1 : -1);
    wrap.style.setProperty("--rot-from", rotFrom + "deg");
    wrap.style.setProperty("--rot-to", rotTo + "deg");
    wrap.style.setProperty("--drift-x", rand(-10, 10) + "px");
    wrap.style.setProperty("--drift-y", rand(-20, -8) + "px");
    wrap.style.animationDuration = rand(4, 8) + "s";
    wrap.style.animationDelay = rand(0, 3) + "s";
    wrap.innerHTML = makeDaisyImg(size);
    daisyField.appendChild(wrap);
    daisyEls.push(wrap);
  }
}
initDaisyField();

async function convergeDaisies() {
  const targetX = window.innerWidth / 2;
  const targetY = window.innerHeight;

  daisyField.style.zIndex = 60;

  const extra = [];
  for (let i = 0; i < 40; i++) {
    const size = rand(30, 70);
    const wrap = document.createElement("div");
    wrap.className = "daisy";
    wrap.style.left = rand(-5, 100) + "vw";
    wrap.style.top = rand(-5, 100) + "vh";
    wrap.style.width = size + "px";
    wrap.style.height = size + "px";
    wrap.innerHTML = makeDaisyImg(size);
    daisyField.appendChild(wrap);
    extra.push(wrap);
  }

  const all = daisyEls.concat(extra);

  all.forEach((el, i) => {
    el.classList.add("daisy-converge");
    const rect = el.getBoundingClientRect();
    const dx = (targetX - (rect.left + rect.width / 2)) * rand(0.7, 1.05);
    const dy = (targetY - (rect.top + rect.height / 2)) * rand(0.55, 0.85);
    const delay = (i % 20) * 25;
    setTimeout(() => {
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${rand(1.3, 2.4)})`;
    }, delay);
  });

  await wait(1900);
}

function resetDaisyField() {
  daisyField.style.zIndex = 1;
  initDaisyField();
}

/* =========================================================================
   ЕТАП 1 — КОНВЕРТ
   ========================================================================= */
const envelope = document.getElementById("envelope");
const greetingTextEl = document.getElementById("greeting-text");
const btnContinue = document.getElementById("btn-continue");

greetingTextEl.textContent = GREETING_TEXT;

let envelopeOpened = false;

async function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;
  envelope.classList.add("opened");
  await wait(1300);
  await wait(900);
  btnContinue.classList.add("show");
}

envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); }
});

/* =========================================================================
   ПЕРЕХОДИ МІЖ ЕТАПАМИ
   ========================================================================= */
const stage1 = document.getElementById("stage-1");
const stage3 = document.getElementById("stage-3");
const stage6 = document.getElementById("stage-6");

async function fadeOutStage(stageEl) {
  stageEl.classList.remove("stage-fade-in");
  stageEl.classList.add("stage-fade-out");
  await wait(700);
  stageEl.classList.remove("active", "stage-fade-out");
}

async function fadeInStage(stageEl) {
  stageEl.classList.add("active");
  void stageEl.offsetWidth;
  stageEl.classList.add("stage-fade-in");
  await wait(900);
}

btnContinue.addEventListener("click", async () => {
  btnContinue.disabled = true;
  await fadeOutStage(stage1);
  await fadeInStage(stage3);
  startChatSequence();
});

/* =========================================================================
   ЕТАП 3 — ЧАТ
   ========================================================================= */
const chatMessagesEl = document.getElementById("chat-messages");
const chatTypingEl = document.getElementById("chat-typing");
const arrowNextBtn = document.getElementById("arrow-next");

function addChatBubble({ text, photoSrc }) {
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble" + (photoSrc ? " photo-bubble" : "");
  if (photoSrc) {
    const img = document.createElement("img");
    img.src = photoSrc;
    img.alt = "Сладусік";
    bubble.appendChild(img);
  } else {
    bubble.textContent = text;
  }
  chatMessagesEl.appendChild(bubble);
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

async function startChatSequence() {
  for (const msg of CHAT_MESSAGES) {
    chatTypingEl.hidden = false;
    await wait(rand(900, 1500));
    chatTypingEl.hidden = true;
    addChatBubble({ text: msg });
    await wait(500);
  }

  chatTypingEl.hidden = false;
  await wait(1200);
  chatTypingEl.hidden = true;
  addChatBubble({ photoSrc: GDRAGON_KISS_PHOTO });

  await wait(1000);
  arrowNextBtn.hidden = false;
}

arrowNextBtn.addEventListener("click", async () => {
  arrowNextBtn.disabled = true;
  await fadeOutStage(stage3);
  await goToDaisyTransition();
});

/* =========================================================================
   ЕТАП 5 — ПОТІК РОМАШОК, ЩО ЗАПОВНЮЄ ЕКРАН
   ========================================================================= */
async function goToDaisyTransition() {
  await convergeDaisies();
  resetDaisyField();
  // На етапі подарунка ромашок на тлі вже не має бути.
  // Зникнення тепер плавніше (узгоджено з тривалістю в style.css).
  daisyField.classList.add("daisy-field-hidden");
  await wait(900);
  await goToGiftStage();
}

/* =========================================================================
   ЕТАП 6 — ПОДАРУНОК
   ========================================================================= */
const giftBox = document.getElementById("gift-box");
const giftContent = document.getElementById("gift-content");
const giftPhotoEl = document.getElementById("gift-photo");
const happyBirthdayEl = document.getElementById("happy-birthday-text");
let giftOpened = false;

giftPhotoEl.src = GIFT_PHOTO;

async function goToGiftStage() {
  await fadeInStage(stage6);
}

async function openGift() {
  if (giftOpened) return;
  giftOpened = true;
  // 1. кришка відкидається
  giftBox.classList.add("opened");
  await wait(420);
  // 2. коробка (кришка + основа + стрічки) щезає
  giftBox.classList.add("vanished");
  await wait(280);
  // 3. фото вистрибує на місці, де була коробка
  giftContent.hidden = false;
  void giftContent.offsetWidth;
  giftContent.classList.add("show");

  // 4. зверху з'являється великий напис HAPPY BIRTHDAY
  await wait(300);
  happyBirthdayEl.classList.add("show");
}

giftBox.addEventListener("click", openGift);
giftBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGift(); }
});

/* =========================================================================
   СТАРТ
   ========================================================================= */
(function initFirstStage() {
  stage1.classList.add("active", "stage-fade-in");
})();