const createRoomBtn = document.getElementById('createRoomBtn');
const joinRoomBtn   = document.getElementById('joinRoomBtn');
const joinWrap      = document.getElementById('joinWrap');
const roomCodeInput = document.getElementById('roomCodeInput');
const joinSubmitBtn = document.getElementById('joinSubmitBtn');
const feedback      = document.getElementById('feedback');
const postCreate    = document.getElementById('postCreate');
const enterRoomBtn  = document.getElementById('enterRoomBtn');

let lastCreatedCode = null;

createRoomBtn?.addEventListener('click', () => {
  const code = wtCodeGen();
  lastCreatedCode = code;
  wtEnsureRoom(code); // create locally
  feedback.textContent = `Room created! Share this code: ${code}`;
  postCreate.style.display = 'flex';
});

enterRoomBtn?.addEventListener('click', () => {
  if (!lastCreatedCode) return;
  location.href = `room.html?code=${lastCreatedCode}`;
});

joinRoomBtn?.addEventListener('click', () => {
  joinWrap.style.display = joinWrap.style.display === 'flex' ? 'none' : 'flex';
  feedback.textContent = '';
});

joinSubmitBtn?.addEventListener('click', () => {
  const code = roomCodeInput.value.trim().toUpperCase();
  if (!/^[A-Z0-9]{6}$/.test(code)) {
    feedback.textContent = 'Please enter a valid 6-character code.'; return;
  }
  const room = wtGetRoom(code);
  if (!room) {
    feedback.textContent = "We couldn’t find that room on this device. (MVP is device-local.)";
    return;
  }
  location.href = `room.html?code=${code}`;
});
