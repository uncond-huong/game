// Game Data Extracted from Document
const keywordsData = [
  {
    id: 1,
    keyword: "TỘI PHẠM",
    subHint: "Khái niệm trung tâm của Luật Hình sự, hành vi nguy hiểm cho xã hội bị BLHS quy định.",
    scenario: "Nguyễn Văn A có hành vi lừa đảo chiếm đoạt tài sản trị giá 500 triệu đồng. Hành vi của A gây nguy hiểm cho xã hội và bị Bộ luật Hình sự quy định là gì?",
    revealed: false
  },
  {
    id: 2,
    keyword: "HÌNH PHẠT CHÍNH",
    subHint: "Hình phạt cơ bản, bắt buộc phải tuyên ĐỘC LẬP cho mỗi tội phạm (Tù có thời hạn, Tử hình, Cảnh cáo...)",
    scenario: "Tòa án tuyên phạt Bị cáo Trịnh Xuân Thanh hình phạt 'Tù chung thân'. Loại hình phạt này đóng vai trò là gì trong bản án?",
    revealed: false
  },
  {
    id: 3,
    keyword: "HÌNH PHẠT BỔ SUNG",
    subHint: "KHÔNG THỂ áp dụng độc lập, chỉ được tuyên kèm hình phạt chính (Cấm đảm nhiệm chức vụ, Phạt tiền, Tịch thu tài sản...)",
    scenario: "Sau khi thụ án 30 năm tù về tội trốn thuế và lừa đảo, 'Bầu Kiên' còn bị cấm đảm nhiệm chức vụ ngân hàng trong 5 năm và phạt tiền 75 tỷ. Các án phạt thêm này thuộc nhóm nào?",
    revealed: false
  },
  {
    id: 4,
    keyword: "PHÁP NHÂN THƯƠNG MẠI",
    hint: "Chủ thể tổ chức (doanh nghiệp) chịu trách nhiệm hình sự từ BLHS 2015.",
    subHint: "Ví dụ: Công ty CP Tập đoàn Bia Sài Gòn Việt Nam bị phạt tiền 3 tỷ đồng vì xâm phạm nhãn hiệu.",
    scenario: "Công ty X xả thải độc hại gây sự cố môi trường đặc biệt nghiêm trọng. Đối tượng tổ chức này bị truy cứu trách nhiệm hình sự dưới danh nghĩa chủ thể nào?",
    revealed: false
  },
  {
    id: 5,
    keyword: "TRỤC XUẤT",
    subHint: "Hình phạt buộc người bị kết án rời khỏi lãnh thổ Việt Nam, CHỈ áp dụng cho người nước ngoài.",
    scenario: "John (quốc tịch nước ngoài) phạm tội buôn lậu tại Việt Nam. Tòa án tuyên buộc John phải rời khỏi Việt Nam trong thời hạn quy định. Đây là hình phạt gì?",
    revealed: false
  }
];

let currentActiveIndex = null;
let timerInterval = null;
let timeLeft = 30;
let isTimerRunning = false;

// Sound Effects Synthesizer
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'correct') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
      osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.1); 
      osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.2); 
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.setValueAtTime(180, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    }
  } catch (e) { console.log(e); }
}

// Render Scenario Cards
function renderScenarios() {
  const container = document.getElementById('scenarioContainer');
  container.innerHTML = '';

  keywordsData.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = `glass-card p-5 rounded-2xl flex flex-col justify-between border ${item.revealed ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-slate-700/60'} space-y-4`;

    card.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30">Tình Huống 0${index + 1}</span>
          ${item.revealed ? '<i class="fa-solid fa-circle-check text-emerald-400"></i>' : '<i class="fa-solid fa-shield-halved text-slate-500"></i>'}
        </div>
        <p class="text-xs text-slate-200 leading-relaxed font-medium">${item.scenario}</p>
      </div>

      <div class="pt-3 border-t border-slate-800 space-y-2">
        ${item.revealed ? 
          '<div class="text-center p-2.5 bg-emerald-500/20 text-emerald-300 font-extrabold text-sm rounded-xl border border-emerald-500/30">' + item.keyword + '</div>' : 
          `<button onclick="openQuestionModal(${index})" class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2">
            <i class="fa-solid fa-brain text-amber-400"></i>Đoán Khái Niệm
          </button>`
        }
      </div>
    `;
    container.appendChild(card);
  });
}

// Open Question Modal
function openQuestionModal(index) {
  playSound('click');
  currentActiveIndex = index;
  const data = keywordsData[index];

  document.getElementById('modalCategory').innerText = `TÌNH HUỐNG 0${index + 1} (${data.keyword.replace(/\s+/g, '').length} KÝ TỰ)`;
  document.getElementById('modalQuestion').innerText = data.scenario;
  document.getElementById('modalClueText').innerText = data.subHint;
  document.getElementById('modalClueBox').classList.add('hidden');

  document.getElementById('questionModal').classList.remove('hidden');
  resetTimer();
}

function closeModal() {
  playSound('click');
  document.getElementById('questionModal').classList.add('hidden');
}

function showClue() {
  playSound('click');
  document.getElementById('modalClueBox').classList.remove('hidden');
}

function revealModalAnswer(isCorrect) {
  if (currentActiveIndex === null) return;

  if (isCorrect) {
    playSound('correct');
    keywordsData[currentActiveIndex].revealed = true;
    
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  closeModal();
  renderScenarios();
}

// Timer Controls
function toggleTimer() {
  playSound('click');
  const btn = document.getElementById('timerBtn');
  if (isTimerRunning) {
    clearInterval(timerInterval);
    isTimerRunning = false;
    btn.innerHTML = '<i class="fa-solid fa-play"></i>';
  } else {
    isTimerRunning = true;
    btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    timerInterval = setInterval(() => {
      timeLeft--;
      document.getElementById('timer').innerText = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        playSound('wrong');
        btn.innerHTML = '<i class="fa-solid fa-play"></i>';
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  timeLeft = 30;
  document.getElementById('timer').innerText = timeLeft;
  document.getElementById('timerBtn').innerHTML = '<i class="fa-solid fa-play"></i>';
}

// Summary Modal Controls
function showSummaryModal() {
  playSound('click');
  document.getElementById('summaryModal').classList.remove('hidden');
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 }
    });
  }
}

function closeSummaryModal() {
  playSound('click');
  document.getElementById('summaryModal').classList.add('hidden');
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  renderScenarios();
});