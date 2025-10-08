// Handle buttons and input
const createRoomBtn = document.getElementById("createRoomBtn");
const joinRoomBtn = document.getElementById("joinRoomBtn");
const joinForm = document.getElementById("joinForm");
const roomCodeInput = document.getElementById("roomCodeInput");
const submitCodeBtn = document.getElementById("submitCodeBtn");
const roomMessage = document.getElementById("roomMessage");

// Random 6-digit code generator
function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Handle Create Room
createRoomBtn.addEventListener("click", () => {
  const code = generateRoomCode();
  roomMessage.textContent = `✅ Room created! Share this code with friends: ${code}`;
  joinForm.classList.add("hidden");
});

// Handle Join Room toggle
joinRoomBtn.addEventListener("click", () => {
  joinForm.classList.toggle("hidden");
  roomMessage.textContent = "";
  roomCodeInput.value = "";
});

// Handle Join Room submission
submitCodeBtn.addEventListener("click", () => {
  const enteredCode = roomCodeInput.value.trim().toUpperCase();
  if (enteredCode.length === 6) {
    roomMessage.textContent = `🎥 Joining Room: ${enteredCode} ...`;
  } else {
    roomMessage.textContent = "❌ Please enter a valid 6-character code.";
  }
});
