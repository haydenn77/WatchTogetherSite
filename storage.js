const WT_ROOM_PREFIX = 'wt_room_';

function wtSaveRoom(room) {
  localStorage.setItem(WT_ROOM_PREFIX + room.roomCode, JSON.stringify(room));
}
function wtGetRoom(code) {
  if (!code) return null;
  const raw = localStorage.getItem(WT_ROOM_PREFIX + code);
  return raw ? JSON.parse(raw) : null;
}
function wtEnsureRoom(code) {
  let room = wtGetRoom(code);
  if (!room) {
    room = {
      roomCode: code,
      createdAt: Date.now(),
      movies: wtCatalog().map(m => m.key),
      votes: {},
      users: {}
    };
    wtSaveRoom(room);
  }
  return room;
}
function wtAddUserToRoom(code, userId, name) {
  const room = wtEnsureRoom(code);
  room.users[userId] = { name };
  wtSaveRoom(room);
  return room;
}
function wtVote(code, userId, movieKey, value /* 'like' | 'skip' */) {
  const room = wtGetRoom(code); if (!room) return;
  room.votes[userId] = room.votes[userId] || {};
  room.votes[userId][movieKey] = value;
  wtSaveRoom(room);
}
