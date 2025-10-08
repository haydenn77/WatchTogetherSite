// ===== Room setup & state =====
const params = new URLSearchParams(location.search);
const ROOM_CODE = params.get('code')?.toUpperCase() || '';

const roomCodeEl   = document.getElementById('roomCode');
const copyCodeBtn  = document.getElementById('copyCodeBtn');
const whoamiEl     = document.getElementById('whoami');

const tabButtons   = Array.from(document.querySelectorAll('.tab'));
const browseSec    = document.getElementById('browse');
const matchesSec   = document.getElementById('matches');
const filterSec    = document.getElementById('filter');

const filterChips  = document.getElementById('filterChips');
const browseGrid   = document.getElementById('browseGrid');
const browseEmpty  = document.getElementById('browseEmpty');
const matchesGrid  = document.getElementById('matchesGrid');
const matchesEmpty = document.getElementById('matchesEmpty');

const leaveBtn     = document.getElementById('leaveBtn');

let ACTIVE_GENRES = new Set(); // selected filter chips
let CAT = wtCatalog();         // full catalog
let ROOM = null;
const UID = wtUserId();

// ----- init -----
init();

function init() {
  if (!ROOM_CODE) { location.href = 'index.html'; return; }

  roomCodeEl.textContent = `Room — ${ROOM_CODE}`;

  // ensure room & identity
  ROOM = wtEnsureRoom(ROOM_CODE);
  wtAddUserToRoom(ROOM_CODE, UID, wtUserName());
  whoamiEl.textContent = `You: ${wtUserName()}`;

  // edit display name
  whoamiEl?.addEventListener('click', () => {
    const newName = prompt('Your display name:', wtUserName());
    if (newName && newName.trim()) {
      const cleaned = newName.trim();
      wtSetUserName(cleaned);
      wtAddUserToRoom(ROOM_CODE, UID, cleaned);
      whoamiEl.textContent = `You: ${cleaned}`;
      refreshMatches();
    }
  });

  // copy code button
  copyCodeBtn?.addEventListener('click', async () => {
    try {
      await wtCopy(ROOM_CODE);
      copyCodeBtn.textContent = 'Copied!';
      setTimeout(()=> copyCodeBtn.textContent='Copy Code', 800);
    } catch {
      copyCodeBtn.textContent = 'Copy failed';
      setTimeout(()=> copyCodeBtn.textContent='Copy Code', 1000);
    }
  });

  // tab switching
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      browseSec.style.display  = (tab === 'browse')  ? '' : 'none';
      matchesSec.style.display = (tab === 'matches') ? '' : 'none';
      filterSec.style.display  = (tab === 'filter')  ? '' : 'none';
    });
  });

  // build filter chips from actual catalog genres
  renderFilterChips();

  // first renders
  renderBrowse();
  refreshMatches();

  // keyboard shortcuts: → like, ← skip
  document.addEventListener('keydown', onKey);

  // leave room
  leaveBtn?.addEventListener('click', () => location.href = 'index.html');
}

// ----- keyboard voting -----
function onKey(e) {
  if (e.key === 'ArrowRight') voteTopCard('like');
  if (e.key === 'ArrowLeft')  voteTopCard('skip');
}

// ===== Filters =====
function renderFilterChips() {
  filterChips.innerHTML = '';

  // "All" chip clears filters
  const allChip = document.createElement('button');
  allChip.className = 'filter-chip';
  allChip.textContent = 'All';
  allChip.addEventListener('click', () => {
    ACTIVE_GENRES.clear();
    // un-highlight any active chips (except this one)
    Array.from(filterChips.querySelectorAll('.filter-chip')).forEach(c => c.classList.remove('active'));
    renderBrowse();
    refreshMatches();
  });
  filterChips.appendChild(allChip);

  // Chips from real catalog genres
  const genres = wtAllGenres(); // e.g., ["Action","Animation","Comedy",...]
  genres.forEach(g => {
    const chip = document.createElement('button');
    chip.className = 'filter-chip';
    chip.textContent = g;
    chip.addEventListener('click', () => {
      if (ACTIVE_GENRES.has(g)) {
        ACTIVE_GENRES.delete(g);
        chip.classList.remove('active');
      } else {
        ACTIVE_GENRES.add(g);
        chip.classList.add('active');
      }
      renderBrowse();   // filters apply to browse
      refreshMatches(); // and to matches
    });
    filterChips.appendChild(chip);
  });
}

// Only titles whose genres include any selected chip pass.
// No chips selected ⇒ return full catalog.
function filteredCatalog() {
  if (!ACTIVE_GENRES.size) return CAT;
  return CAT.filter(m => m.genres.some(g => ACTIVE_GENRES.has(g)));
}

// ===== Browse (Like/Skip) =====
function renderBrowse() {
  const list = filteredCatalog();
  browseGrid.innerHTML = '';
  const myVotes = (wtGetRoom(ROOM_CODE)?.votes?.[UID]) || {};
  let anyRendered = false;

  list.forEach(m => {
    // hide movies I've already voted on
    if (myVotes[m.key]) return;
    anyRendered = true;

    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.key = m.key;
    card.innerHTML = `
      <img src="${m.poster}" alt="${m.title} poster"/>
      <div class="meta">
        <div class="badge">${m.platform} • ${m.runtime}</div>
        <div class="title">${m.title}</div>
        <div class="summary">${m.summary}</div>
      </div>
      <div class="actions">
        <button class="skip">🚫 Skip</button>
        <button class="like">❤️ Like</button>
      </div>
    `;
    card.querySelector('.like').addEventListener('click', () => handleVote(m.key, 'like', card));
    card.querySelector('.skip').addEventListener('click', () => handleVote(m.key, 'skip', card));
    browseGrid.appendChild(card);
  });

  // empty state when nothing left to browse (after filters + votes)
  browseEmpty.style.display = anyRendered ? 'none' : '';
}

function voteTopCard(type) {
  const firstCard = browseGrid.querySelector('.card');
  if (!firstCard) return;
  handleVote(firstCard.dataset.key, type, firstCard);
}

function handleVote(movieKey, value, cardEl) {
  wtVote(ROOM_CODE, UID, movieKey, value);

  // remove the card with a tiny animation
  if (cardEl) {
    cardEl.style.transition = 'transform .2s ease, opacity .2s ease';
    cardEl.style.transform = value === 'like' ? 'translateY(-6px) scale(1.01)' : 'translateY(6px) scale(.99)';
    cardEl.style.opacity = .0;
    setTimeout(() => {
      cardEl.remove();
      if (!browseGrid.querySelector('.card')) browseEmpty.style.display = '';
    }, 180);
  }

  refreshMatches();
}

// ===== Matches =====
function refreshMatches() {
  const room = wtGetRoom(ROOM_CODE);
  matchesGrid.innerHTML = '';

  if (!room) { matchesEmpty.style.display = ''; return; }

  const users = Object.keys(room.users || {});
  if (!users.length) { matchesEmpty.style.display = ''; return; }

  // Only consider movies that pass current filters
  const cats = filteredCatalog();

  // A movie is a match if EVERY user liked it
  const likedByAll = cats.filter(m =>
    users.every(uid => room.votes?.[uid]?.[m.key] === 'like')
  );

  matchesEmpty.style.display = likedByAll.length ? 'none' : '';

  likedByAll.forEach(m => {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <img src="${m.poster}" alt="${m.title}"/>
      <div class="meta">
        <div class="badge">${m.platform} • ${m.runtime}</div>
        <div class="title">${m.title}</div>
      </div>
    `;
    matchesGrid.appendChild(el);
  });
}
