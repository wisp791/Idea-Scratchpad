const STORAGE_KEY = "looseleaf-data-v5";
const NOTE_COLORS = ["#f5df78", "#f0b7cb", "#a9d9e7", "#b9d8a8", "#dcc8ef", "#f3b493"];
const STOP_WORDS = new Set(["about", "after", "again", "ahead", "also", "and", "are", "but", "can", "come", "could", "every", "for", "from", "get", "give", "have", "how", "into", "just", "like", "make", "maybe", "more", "not", "only", "our", "out", "over", "really", "should", "some", "that", "the", "their", "them", "then", "there", "they", "thing", "this", "through", "use", "want", "what", "when", "where", "which", "with", "would"]);
const CONCEPT_KEYWORDS = {
  animals: ["animal", "bird", "cat", "chicken", "dog", "pet", "snake"],
  costumes: ["costume", "outfit", "prop", "thrift", "wear"],
  food: ["cake", "cook", "drink", "food", "lunch", "pizza", "snack"],
  memory: ["anonymous", "memory", "remember", "story"],
  participation: ["audience", "challenge", "choose", "game", "interactive", "poll", "question", "quiz", "submit", "trivia", "vote"],
  performance: ["assembly", "concert", "dance", "drum", "drumline", "music", "musical", "opening", "perform", "playlist", "show", "song", "stage"],
  people: ["audience", "club", "everyone", "family", "friend", "grade", "group", "people", "student", "teacher", "team"],
  possibility: ["bold", "could", "idea", "maybe", "possible", "wild"],
  technology: ["app", "code", "digital", "link", "phone", "qr", "screen", "website"],
  time: ["before", "day", "deadline", "hour", "later", "minute", "monday", "schedule", "time", "under", "week", "weekend"],
  constraints: ["budget", "deadline", "finish", "limit", "must", "need", "only", "remember", "under"],
  visuals: ["art", "backdrop", "cardboard", "color", "comic", "design", "draw", "letter", "mural", "paint", "photo", "poster", "sign", "visual"]
};
const CONCEPT_WEIGHTS = { people: 1.3, time: 1.4, possibility: 1.5, constraints: 2, technology: 2.3, participation: 2.4, performance: 2.4, visuals: 2.4, costumes: 2.4, food: 2.4, memory: 2.4, animals: 3 };

const seedData = {
  boards: [
    {
      id: "assembly",
      title: "Spring assembly ideas",
      category: "School",
      favorite: true,
      updatedAt: Date.now() - 1000 * 60 * 24,
      pages: [
        {
          id: "assembly-p1",
          notes: [
            { id: "a1", text: "Open with the drumline coming through the audience", color: "#f5df78", x: 92, y: 96, tag: "opening" },
            { id: "a2", text: "Student vs. teacher trivia — get answers ahead of time?", color: "#a9d9e7", x: 410, y: 80, tag: "game" },
            { id: "a3", text: "Ask the art club to make a giant hand-painted backdrop", color: "#f0b7cb", x: 710, y: 190, tag: "visuals" },
            { id: "a4", text: "Keep the whole thing under 45 minutes", color: "#b9d8a8", x: 350, y: 360, tag: "must-have" },
            { id: "a5", text: "QR code so people can vote on the final challenge", color: "#dcc8ef", x: 82, y: 400, tag: "interactive" }
          ],
          connections: [["a1", "a2"], ["a1", "a5"], ["a2", "a5"]],
          drawings: []
        },
        { id: "assembly-p2", notes: [], connections: [], drawings: [] }
      ]
    },
    {
      id: "poster",
      title: "Poster concepts",
      category: "Design",
      favorite: false,
      updatedAt: Date.now() - 1000 * 60 * 60 * 30,
      pages: [{ id: "poster-p1", notes: [
        { id: "p1", text: "Big hand-drawn letters that look taped together", color: "#f0b7cb", x: 120, y: 120, tag: "style" },
        { id: "p2", text: "Use only two colors so it reads from far away", color: "#a9d9e7", x: 450, y: 280, tag: "color" }
      ], connections: [["p1", "p2"]], drawings: [] }]
    },
    {
      id: "weekend",
      title: "Things for this weekend",
      category: "Personal",
      favorite: false,
      updatedAt: Date.now() - 1000 * 60 * 60 * 55,
      pages: [{ id: "weekend-p1", notes: [
        { id: "w1", text: "Thrift store for costume pieces", color: "#b9d8a8", x: 130, y: 100, tag: "errand" },
        { id: "w2", text: "Finish the playlist for Monday", color: "#f5df78", x: 500, y: 180, tag: "music" }
      ], connections: [], drawings: [] }]
    }
  ],
  looseIdeas: [
    { id: "i1", text: "What if the welcome sign is actually a giant comic strip?", color: "#f5df78", boardId: "poster", tag: "Design", createdAt: Date.now() - 1000 * 60 * 37 },
    { id: "i2", text: "Find a song everyone knows but nobody expects", color: "#a9d9e7", boardId: "assembly", tag: "Assembly", createdAt: Date.now() - 1000 * 60 * 60 * 4 },
    { id: "i3", text: "Photo booth, but the props are all made from recycled cardboard", color: "#f0b7cb", boardId: null, tag: "Ungrouped", createdAt: Date.now() - 1000 * 60 * 60 * 20 },
    { id: "i4", text: "Ask people to submit their weirdest school memory anonymously", color: "#b9d8a8", boardId: "assembly", tag: "Assembly", createdAt: Date.now() - 1000 * 60 * 60 * 27 }
  ]
};

let data = loadData();
let currentBoardId = null;
let currentPageId = null;
let captureColorIndex = 0;
let currentFilter = "all";
let zoom = 1;
let dragState = null;
let selectedNoteId = null;
let currentTool = "select";
let activeDrawing = null;
const undoStacks = {};
const redoStacks = {};
let toastTimer = null;
let saveTimer = null;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function loadData() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored?.boards && stored?.looseIdeas) {
      stored.boards.forEach(board => board.pages.forEach(page => { page.drawings ||= []; }));
      return stored;
    }
  } catch (error) {
    console.warn("Could not load saved ideas", error);
  }
  return structuredClone(seedData);
}

function saveData(showStatus = false) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  if (showStatus) setSavedStatus();
}

function escapeHtml(value = "") {
  return value.replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function getBoard() {
  return data.boards.find(board => board.id === currentBoardId);
}

function getPage() {
  return getBoard()?.pages.find(page => page.id === currentPageId);
}

function pushHistory() {
  const page = getPage();
  if (!page) return;
  (undoStacks[page.id] ||= []).push(JSON.stringify(page));
  if (undoStacks[page.id].length > 30) undoStacks[page.id].shift();
  redoStacks[page.id] = [];
}

function restorePage(serialized) {
  const board = getBoard();
  const index = board.pages.findIndex(page => page.id === currentPageId);
  if (index < 0) return;
  board.pages[index] = JSON.parse(serialized);
  selectedNoteId = null;
  board.updatedAt = Date.now();
  saveData(true);
  renderEditor();
}

function undo() {
  const page = getPage();
  const stack = undoStacks[page?.id] || [];
  if (!page || !stack.length) return showToast("Nothing to undo just yet");
  (redoStacks[page.id] ||= []).push(JSON.stringify(page));
  restorePage(stack.pop());
}

function redo() {
  const page = getPage();
  const stack = redoStacks[page?.id] || [];
  if (!page || !stack.length) return showToast("Nothing to redo just yet");
  (undoStacks[page.id] ||= []).push(JSON.stringify(page));
  restorePage(stack.pop());
}

function totalIdeas() {
  return data.looseIdeas.length + data.boards.reduce((sum, board) => sum + board.pages.reduce((pageSum, page) => pageSum + page.notes.length, 0), 0);
}

function relativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days}d ago`;
}

function setGreeting() {
  const hour = new Date().getHours();
  $("#timeGreeting").textContent = hour < 12 ? "GOOD MORNING" : hour < 18 ? "GOOD AFTERNOON" : "GOOD EVENING";
}

function renderDashboard() {
  $("#sidebarIdeaCount").textContent = totalIdeas();
  renderBoards();
  renderIdeaStream();
}

function renderBoards() {
  const query = $("#globalSearch").value.trim().toLowerCase();
  const activeNav = $(".nav-item.active")?.dataset.nav || "home";
  let boards = data.boards.filter(board => !query || board.title.toLowerCase().includes(query) || board.category.toLowerCase().includes(query));
  if (activeNav === "favorites") boards = boards.filter(board => board.favorite);

  const cards = boards.map(board => {
    const noteCount = board.pages.reduce((sum, page) => sum + page.notes.length, 0);
    const sampleColors = board.pages.flatMap(page => page.notes).slice(0, 2).map(note => note.color);
    return `
      <article class="board-card" role="button" tabindex="0" data-board-id="${board.id}">
        <div class="board-card-top">
          <span class="board-category">${escapeHtml(board.category)}</span>
          <button class="favorite-button ${board.favorite ? "active" : ""}" data-favorite-board="${board.id}" type="button" aria-label="${board.favorite ? "Remove from" : "Add to"} favorites">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/></svg>
          </button>
        </div>
        <h3>${escapeHtml(board.title)}</h3>
        <p>${noteCount} ${noteCount === 1 ? "idea" : "ideas"} · ${board.pages.length} ${board.pages.length === 1 ? "page" : "pages"}</p>
        ${sampleColors.map(color => `<span class="note-preview" style="background:${color}"><span></span><span></span><span></span></span>`).join("")}
        <span class="board-footer"><i></i> Edited ${relativeTime(board.updatedAt)}</span>
      </article>`;
  }).join("");

  $("#boardGrid").innerHTML = `
    <button class="board-card new-board" id="newBoardButton" type="button">
      <span class="new-board-inner"><span class="plus">＋</span><strong>New scratchpad</strong><small>Blank page, zero rules</small></span>
    </button>${cards}`;
}

function getDashboardIdeas() {
  const loose = data.looseIdeas.map(idea => ({ ...idea, source: "loose" }));
  const notes = data.boards.flatMap(board => board.pages.flatMap(page => page.notes.map(note => ({
    ...note,
    source: "board",
    boardId: board.id,
    boardTitle: board.title,
    createdAt: board.updatedAt
  }))));
  return [...loose, ...notes];
}

function renderIdeaStream() {
  const query = $("#globalSearch").value.trim().toLowerCase();
  const activeNav = $(".nav-item.active")?.dataset.nav || "home";
  let ideas = getDashboardIdeas().filter(idea => !query || idea.text.toLowerCase().includes(query) || (idea.tag || "").toLowerCase().includes(query) || (idea.boardTitle || "").toLowerCase().includes(query));
  if (currentFilter === "ungrouped") ideas = ideas.filter(idea => !idea.boardId);
  ideas.sort((a, b) => b.createdAt - a.createdAt);
  if (activeNav === "favorites") {
    const favoriteIds = data.boards.filter(board => board.favorite).map(board => board.id);
    ideas = ideas.filter(idea => favoriteIds.includes(idea.boardId));
  }
  if (activeNav === "home" && !query) ideas = ideas.slice(0, 8);

  $("#ideaStream").innerHTML = ideas.map(idea => `
    <article class="idea-card" role="button" tabindex="0" style="background:${idea.color}" data-idea-board="${idea.boardId || ""}">
      <p>${escapeHtml(idea.text)}</p>
      <span class="idea-meta">
        <span class="idea-tag">${escapeHtml(idea.boardTitle || idea.tag || "Loose idea")}</span>
        ${idea.source === "loose" ? `<button class="idea-delete" data-delete-idea="${idea.id}" type="button" aria-label="Delete idea">×</button>` : `<span>${relativeTime(idea.createdAt)}</span>`}
      </span>
    </article>`).join("");
  $("#ideaEmptyState").hidden = ideas.length > 0;
}

function addQuickIdea() {
  const input = $("#quickIdeaInput");
  const text = input.value.trim();
  if (!text) return;
  data.looseIdeas.unshift({
    id: uid("idea"),
    text,
    color: NOTE_COLORS[captureColorIndex],
    boardId: null,
    tag: "Ungrouped",
    createdAt: Date.now()
  });
  input.value = "";
  input.style.height = "auto";
  $("#quickAddButton").disabled = true;
  $("#savedWhisper").textContent = "tossed into your pile ✓";
  setTimeout(() => $("#savedWhisper").textContent = "", 2400);
  saveData();
  renderDashboard();
  showToast("Idea caught — no cleanup required");
}

function openNewBoardDialog() {
  $("#newBoardName").value = "";
  $("#newBoardDialog").showModal();
  setTimeout(() => $("#newBoardName").focus(), 50);
}

function createBoard(starter = "blank") {
  const title = $("#newBoardName").value.trim() || "Untitled scratchpad";
  const boardId = uid("board");
  const pageId = uid("page");
  const notes = starter === "prompts" ? [
    { id: uid("note"), text: "What are we trying to make happen?", color: "#f5df78", x: 105, y: 110, tag: "start here" },
    { id: uid("note"), text: "What would the boldest version look like?", color: "#a9d9e7", x: 415, y: 245, tag: "go bigger" },
    { id: uid("note"), text: "What do we absolutely need to remember?", color: "#f0b7cb", x: 725, y: 110, tag: "must-have" }
  ] : [];
  data.boards.unshift({ id: boardId, title, category: "New", favorite: false, updatedAt: Date.now(), pages: [{ id: pageId, notes, connections: [], drawings: [] }] });
  saveData();
  openEditor(boardId);
}

function openEditor(boardId, pageId) {
  const board = data.boards.find(item => item.id === boardId);
  if (!board) return;
  currentBoardId = board.id;
  currentPageId = pageId || board.pages[0].id;
  selectedNoteId = null;
  currentTool = "select";
  $$(".tool-button[data-tool]").forEach(item => item.classList.toggle("active", item.dataset.tool === "select"));
  $("#boardTitleInput").value = board.title;
  $("#dashboardView").hidden = true;
  $("#editorView").hidden = false;
  document.body.style.overflow = "hidden";
  renderEditor();
}

function closeEditor() {
  $("#editorView").hidden = true;
  $("#dashboardView").hidden = false;
  document.body.style.overflow = "";
  currentBoardId = null;
  currentPageId = null;
  renderDashboard();
}

function renderEditor() {
  renderPages();
  renderCanvas();
}

function renderPages() {
  const board = getBoard();
  $("#pageList").innerHTML = board.pages.map((page, index) => `
    <button class="page-item ${page.id === currentPageId ? "active" : ""}" type="button" data-page-id="${page.id}">
      <span class="page-number">${index + 1}</span>
      <span class="page-thumb">
        ${page.notes.slice(0, 2).map(note => `<span class="page-thumb-note" style="background:${note.color}"><i></i><i></i></span>`).join("")}
      </span>
    </button>`).join("");
}

function stemWord(word) {
  if (word.length > 5 && word.endsWith("ing")) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith("ed")) return word.slice(0, -2);
  if (word.length > 4 && word.endsWith("s")) return word.slice(0, -1);
  return word;
}

function semanticProfile(text) {
  const words = (text.toLowerCase().match(/[a-z0-9']+/g) || []).map(stemWord);
  const tokens = [...new Set(words.filter(word => word.length > 2 && !STOP_WORDS.has(word)))];
  const concepts = Object.entries(CONCEPT_KEYWORDS)
    .filter(([, keywords]) => keywords.some(keyword => words.includes(stemWord(keyword))))
    .map(([concept]) => concept);
  return { tokens, concepts };
}

function chooseDoodleType(text) {
  const lower = text.toLowerCase();
  const { concepts } = semanticProfile(text);
  if (lower.includes("snake")) return "snake";
  if (lower.includes("chicken") || lower.includes("bird")) return "chicken";
  if (concepts.includes("animals")) return "animal";
  if (concepts.includes("performance")) return "music";
  if (concepts.includes("visuals")) return "art";
  if (concepts.includes("participation")) return "vote";
  if (concepts.includes("technology")) return "tech";
  if (concepts.includes("time") || concepts.includes("constraints")) return "clock";
  if (concepts.includes("costumes")) return "costume";
  if (concepts.includes("food")) return "food";
  if (concepts.includes("memory")) return "story";
  if (concepts.includes("people")) return "people";
  if (/what if|maybe|could|idea|bold|wild/.test(lower)) return "lightbulb";
  return "spark";
}

function doodleSvgFor(text) {
  const type = chooseDoodleType(text);
  const doodles = {
    music: `<svg viewBox="0 0 52 52" aria-hidden="true"><path d="M22 37V14l19-4v22"/><path d="M22 19l19-4"/><ellipse cx="16" cy="38" rx="7" ry="5"/><ellipse cx="35" cy="33" rx="7" ry="5"/><path d="M8 14c3-4 6-5 10-5"/></svg>`,
    art: `<svg viewBox="0 0 52 52" aria-hidden="true"><path d="M27 8C14 8 7 16 7 27c0 10 8 17 16 17 5 0 7-3 5-7-1-3 1-6 5-6h5c5 0 8-4 7-9C43 13 36 8 27 8Z"/><circle class="doodle-fill" cx="17" cy="20" r="2"/><circle class="doodle-fill" cx="26" cy="15" r="2"/><circle class="doodle-fill" cx="35" cy="19" r="2"/><path d="m38 43 7-21m-10 16 7 2"/></svg>`,
    vote: `<svg viewBox="0 0 52 52" aria-hidden="true"><path d="M9 23h34l3 22H6Z"/><path d="M17 30h18"/><path d="M18 8h21v18H18Z"/><path d="m23 16 4 4 8-9"/></svg>`,
    tech: `<svg viewBox="0 0 52 52" aria-hidden="true"><rect x="12" y="5" width="28" height="42" rx="5"/><path d="M22 11h8M23 41h6"/><rect x="18" y="17" width="5" height="5"/><rect x="29" y="17" width="5" height="5"/><rect x="18" y="28" width="5" height="5"/><path d="M29 28h5v5h-5m-6-11h6v6"/></svg>`,
    clock: `<svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="27" r="18"/><path d="M26 15v13l9 5M17 5l-6 6m24-6 6 6"/><path d="M18 46h16"/></svg>`,
    people: `<svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="19" cy="18" r="6"/><circle cx="35" cy="20" r="5"/><path d="M7 42c1-10 6-15 12-15s11 5 12 15M28 30c2-3 4-5 8-5 6 0 9 6 9 15"/><path d="M12 8c2-3 6-4 9-3"/></svg>`,
    chicken: `<svg viewBox="0 0 52 52" aria-hidden="true"><path d="M17 39c-7-2-10-8-8-15 2-8 11-12 20-8 5 2 8 7 8 13 0 8-8 13-20 10Z"/><circle cx="35" cy="15" r="7"/><circle class="doodle-fill" cx="37" cy="13" r="1.5"/><path d="m42 16 7 3-7 3M30 9l2-5 4 5 4-4 1 6M19 40l-1 7m11-9 2 8m-17 1h8m6-1h7"/></svg>`,
    snake: `<svg viewBox="0 0 52 52" aria-hidden="true"><path d="M7 39c10 7 26 5 28-5 2-9-17-7-17-17 0-8 10-11 20-7"/><path d="m37 10 8-4-2 9Z"/><circle class="doodle-fill" cx="41" cy="10" r="1"/><path d="m44 11 5 1-4 2"/></svg>`,
    animal: `<svg viewBox="0 0 52 52" aria-hidden="true"><path d="M13 20 9 9l12 7c3-2 8-2 11 0l11-7-3 13c3 10-3 21-15 21-11 0-17-10-12-23Z"/><circle class="doodle-fill" cx="20" cy="27" r="1.5"/><circle class="doodle-fill" cx="32" cy="27" r="1.5"/><path d="m23 33 3 2 3-2M26 35v3"/></svg>`,
    costume: `<svg viewBox="0 0 52 52" aria-hidden="true"><path d="m17 9 9 5 9-5 12 9-7 9-5-4v23H17V23l-5 4-7-9Z"/><path d="M20 11c1 6 11 6 13 0M21 31h10"/></svg>`,
    food: `<svg viewBox="0 0 52 52" aria-hidden="true"><path d="M8 21h36c0 14-7 22-18 22S8 35 8 21Z"/><path d="M5 21h42M17 14c-2-4 2-6 0-10m10 10c-2-4 2-6 0-10m9 10c-2-4 2-6 0-10"/></svg>`,
    story: `<svg viewBox="0 0 52 52" aria-hidden="true"><path d="M7 9h38v27H25L14 45l3-9H7Z"/><path d="M15 18h22M15 25h16"/><path d="m38 2 1 4 4 1-4 1-1 4-1-4-4-1 4-1Z"/></svg>`,
    lightbulb: `<svg viewBox="0 0 52 52" aria-hidden="true"><path d="M15 25c0-8 5-14 12-14s12 6 12 14c0 6-5 8-7 13H22c-2-5-7-7-7-13Z"/><path d="M22 42h10m-8 4h6M27 3v4M8 24H3m46 0h-5M12 9l4 4m26-4-4 4"/></svg>`,
    spark: `<svg viewBox="0 0 52 52" aria-hidden="true"><path d="m25 4 3 15 13-7-8 12 15 3-15 3 8 13-13-8-3 15-3-15-13 8 8-13-15-3 15-3-8-12 13 7Z"/><circle cx="25" cy="27" r="4"/></svg>`
  };
  return { type, svg: doodles[type] || doodles.spark };
}

function doodleMarkup(text) {
  const doodle = doodleSvgFor(text);
  return `<span class="note-doodle" data-doodle="${doodle.type}" title="Auto doodle: ${doodle.type}">${doodle.svg}</span>`;
}

function renderCanvas() {
  const page = getPage();
  if (!page) return;
  page.drawings ||= [];
  $("#ideaCanvas").classList.toggle("drawing", currentTool === "pen");
  $("#canvasContent").innerHTML = page.notes.map((note, index) => `
    <article class="canvas-note ${note.id === selectedNoteId ? "selected" : ""}" data-note-id="${note.id}" style="left:${note.x}px;top:${note.y}px;background:${note.color};--rotation:${index % 2 ? ".8deg" : "-1.1deg"}">
      ${doodleMarkup(note.text)}
      <textarea class="note-text" spellcheck="true" maxlength="220" aria-label="Idea text">${escapeHtml(note.text)}</textarea>
      <div class="note-bottom"><span class="note-tag">${escapeHtml(note.tag || "idea")}</span><button class="note-menu" type="button" aria-label="Change note color">•••</button></div>
    </article>`).join("");
  $("#canvasHint").hidden = page.notes.length > 0;
  drawConnections();
}

function drawConnections() {
  const page = getPage();
  const layer = $("#connectionsLayer");
  if (!page || !layer) return;
  const doodles = (page.drawings || []).map(drawing => {
    if (drawing.points.length < 2) return "";
    const path = drawing.points.map((point, index) => `${index ? "L" : "M"} ${point[0].toFixed(1)} ${point[1].toFixed(1)}`).join(" ");
    return `<path class="doodle-path" d="${path}" style="stroke:${drawing.color || "#6d5bd0"}"/>`;
  }).join("");
  const connections = page.connections.map(([fromId, toId]) => {
    const from = page.notes.find(note => note.id === fromId);
    const to = page.notes.find(note => note.id === toId);
    if (!from || !to) return "";
    const x1 = from.x + 95;
    const y1 = from.y + 62;
    const x2 = to.x + 95;
    const y2 = to.y + 62;
    const bend = Math.max(35, Math.abs(x2 - x1) * .18);
    const direction = x2 >= x1 ? 1 : -1;
    const c1x = x1 + bend * direction;
    const c2x = x2 - bend * direction;
    const angle = Math.atan2(y2 - (y1 + (y2-y1)*.82), x2 - c2x);
    const ax1 = x2 - 10 * Math.cos(angle - .45);
    const ay1 = y2 - 10 * Math.sin(angle - .45);
    const ax2 = x2 - 10 * Math.cos(angle + .45);
    const ay2 = y2 - 10 * Math.sin(angle + .45);
    return `<path class="connection-path" data-from="${fromId}" data-to="${toId}" d="M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}"/><path class="connection-arrow" d="M ${x2} ${y2} L ${ax1} ${ay1} L ${ax2} ${ay2} Z"/>`;
  }).join("");
  layer.innerHTML = doodles + connections;
}

function addPage() {
  const board = getBoard();
  const page = { id: uid("page"), notes: [], connections: [], drawings: [] };
  board.pages.push(page);
  board.updatedAt = Date.now();
  currentPageId = page.id;
  saveData(true);
  renderEditor();
  showToast("Fresh page added");
}

function addNote(text = "New thought…", x, y, color) {
  const page = getPage();
  pushHistory();
  const count = page.notes.length;
  const note = {
    id: uid("note"),
    text,
    color: color || NOTE_COLORS[count % NOTE_COLORS.length],
    x: x ?? 90 + (count * 215) % 760,
    y: y ?? 90 + (Math.floor(count / 3) * 180) % 430,
    tag: inferTag(text)
  };
  page.notes.push(note);
  getBoard().updatedAt = Date.now();
  selectedNoteId = note.id;
  saveData(true);
  renderEditor();
  setTimeout(() => {
    const textarea = $(`[data-note-id="${note.id}"] .note-text`);
    if (text === "New thought…") textarea?.select();
  }, 10);
}

function inferTag(text) {
  const { concepts } = semanticProfile(text);
  const priority = ["animals", "visuals", "performance", "participation", "technology", "costumes", "food", "memory", "constraints", "time", "people", "possibility"];
  const concept = priority.find(item => concepts.includes(item));
  const labels = { animals: "animals", visuals: "visuals", performance: "performance", participation: "interactive", technology: "tech", costumes: "costume", food: "food", memory: "story", constraints: "must-have", time: "timing", people: "people", possibility: "possibility" };
  if (concept) return labels[concept];
  return "idea";
}

function similarityDetails(first, second) {
  const a = semanticProfile(first.text);
  const b = semanticProfile(second.text);
  const sharedTokens = a.tokens.filter(token => b.tokens.includes(token));
  const sharedConcepts = a.concepts.filter(concept => b.concepts.includes(concept));
  let score = sharedTokens.length * 3;
  sharedConcepts.forEach(concept => { score += CONCEPT_WEIGHTS[concept] || 1.5; });
  const firstTag = inferTag(first.text);
  const secondTag = inferTag(second.text);
  if (firstTag === secondTag && firstTag !== "idea") score += .8;
  return { score, sharedTokens, sharedConcepts };
}

function findSimilarConnections(notes) {
  const candidates = [];
  for (let first = 0; first < notes.length; first++) {
    for (let second = first + 1; second < notes.length; second++) {
      const match = similarityDetails(notes[first], notes[second]);
      if (match.score >= 3) candidates.push({ from: notes[first].id, to: notes[second].id, ...match });
    }
  }
  candidates.sort((a, b) => b.score - a.score || a.from.localeCompare(b.from) || a.to.localeCompare(b.to));
  const degree = new Map(notes.map(note => [note.id, 0]));
  const connections = [];
  candidates.forEach(candidate => {
    if (degree.get(candidate.from) >= 2 || degree.get(candidate.to) >= 2) return;
    connections.push([candidate.from, candidate.to]);
    degree.set(candidate.from, degree.get(candidate.from) + 1);
    degree.set(candidate.to, degree.get(candidate.to) + 1);
  });
  return { connections, candidates };
}

function connectedComponents(notes, connections) {
  const parent = new Map(notes.map(note => [note.id, note.id]));
  const find = id => {
    let root = id;
    while (parent.get(root) !== root) root = parent.get(root);
    while (parent.get(id) !== id) {
      const next = parent.get(id);
      parent.set(id, root);
      id = next;
    }
    return root;
  };
  connections.forEach(([from, to]) => {
    const fromRoot = find(from);
    const toRoot = find(to);
    if (fromRoot !== toRoot) parent.set(toRoot, fromRoot);
  });
  const components = new Map();
  notes.forEach(note => {
    const root = find(note.id);
    if (!components.has(root)) components.set(root, []);
    components.get(root).push(note);
  });
  return [...components.values()].sort((a, b) => b.length - a.length);
}

function layoutBySimilarity(notes, connections) {
  const components = connectedComponents(notes, connections);
  const columnHeights = [65, 65, 65];
  components.forEach(component => {
    const column = columnHeights.indexOf(Math.min(...columnHeights));
    const baseX = 65 + column * 315;
    const baseY = columnHeights[column];
    component.forEach((note, index) => {
      note.x = Math.min(825, baseX + (index % 2 ? 28 : 0));
      note.y = Math.min(515, baseY + index * 145);
    });
    columnHeights[column] += Math.max(170, component.length * 145 + 45);
  });
  return components;
}

function organizeIdeas() {
  const page = getPage();
  if (!page || page.notes.length < 2) {
    showToast("Add at least two thoughts so I have threads to find");
    return;
  }
  pushHistory();
  page.notes.forEach(note => {
    note.tag = inferTag(note.text);
  });
  const matches = findSimilarConnections(page.notes);
  page.connections = matches.connections;
  const components = layoutBySimilarity(page.notes, page.connections);
  getBoard().updatedAt = Date.now();
  saveData(true);
  renderCanvas();
  if (!page.connections.length) {
    showToast("No strong matches yet — unrelated ideas stayed separate");
    return;
  }
  const clusters = components.filter(component => component.length > 1).length;
  showToast(`Connected ${page.connections.length} similar ${page.connections.length === 1 ? "pair" : "pairs"} across ${clusters} ${clusters === 1 ? "theme" : "themes"}`);
}

function setSavedStatus() {
  const status = $("#saveStatus");
  status.classList.add("saving");
  status.lastChild.textContent = " Saving…";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    status.classList.remove("saving");
    status.lastChild.textContent = " Saved";
  }, 450);
}

function showToast(message) {
  $("#toastMessage").textContent = message;
  $("#toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 2600);
}

async function shareBoard() {
  try {
    await navigator.clipboard.writeText(location.href);
    showToast("Share link copied");
  } catch {
    showToast("Publish this scratchpad to make a shareable link");
  }
}

function cycleNoteColor(noteId) {
  const note = getPage().notes.find(item => item.id === noteId);
  if (!note) return;
  pushHistory();
  const index = NOTE_COLORS.indexOf(note.color);
  note.color = NOTE_COLORS[(index + 1) % NOTE_COLORS.length];
  saveData(true);
  renderCanvas();
}

function handlePointerDown(event) {
  if (currentTool !== "select") return;
  const noteElement = event.target.closest(".canvas-note");
  if (!noteElement || event.target.matches("textarea, button")) return;
  const note = getPage().notes.find(item => item.id === noteElement.dataset.noteId);
  if (!note) return;
  pushHistory();
  selectedNoteId = note.id;
  dragState = {
    note,
    element: noteElement,
    startX: event.clientX,
    startY: event.clientY,
    originX: note.x,
    originY: note.y
  };
  noteElement.setPointerCapture(event.pointerId);
  $$(".canvas-note").forEach(element => element.classList.toggle("selected", element === noteElement));
}

function handlePointerMove(event) {
  if (!dragState) return;
  const x = dragState.originX + (event.clientX - dragState.startX) / zoom;
  const y = dragState.originY + (event.clientY - dragState.startY) / zoom;
  dragState.note.x = Math.max(0, Math.min(850, x));
  dragState.note.y = Math.max(0, Math.min(540, y));
  dragState.element.style.left = `${dragState.note.x}px`;
  dragState.element.style.top = `${dragState.note.y}px`;
  drawConnections();
}

function handlePointerUp() {
  if (!dragState) return;
  getBoard().updatedAt = Date.now();
  saveData(true);
  dragState = null;
}

function drawingPoint(event) {
  const rect = $("#ideaCanvas").getBoundingClientRect();
  return [(event.clientX - rect.left) / zoom, (event.clientY - rect.top) / zoom];
}

function startDrawing(event) {
  if (currentTool !== "pen" || event.button !== 0) return;
  event.preventDefault();
  pushHistory();
  const drawing = { id: uid("doodle"), color: "#6d5bd0", points: [drawingPoint(event)] };
  getPage().drawings ||= [];
  getPage().drawings.push(drawing);
  activeDrawing = drawing;
  $("#ideaCanvas").setPointerCapture(event.pointerId);
  drawConnections();
}

function continueDrawing(event) {
  if (!activeDrawing) return;
  const point = drawingPoint(event);
  const previous = activeDrawing.points[activeDrawing.points.length - 1];
  if (Math.hypot(point[0] - previous[0], point[1] - previous[1]) < 2) return;
  activeDrawing.points.push(point);
  drawConnections();
}

function finishDrawing() {
  if (!activeDrawing) return;
  if (activeDrawing.points.length < 2) getPage().drawings = getPage().drawings.filter(drawing => drawing !== activeDrawing);
  activeDrawing = null;
  getBoard().updatedAt = Date.now();
  saveData(true);
}

function applyZoom(nextZoom) {
  zoom = Math.max(.6, Math.min(1.3, nextZoom));
  $("#ideaCanvas").style.transform = `scale(${zoom})`;
  $("#zoomLabel").textContent = `${Math.round(zoom * 100)}%`;
}

function bindEvents() {
  $("#quickIdeaInput").addEventListener("input", event => {
    $("#quickAddButton").disabled = !event.target.value.trim();
    event.target.style.height = "auto";
    event.target.style.height = `${Math.min(event.target.scrollHeight, 96)}px`;
  });
  $("#quickIdeaInput").addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      addQuickIdea();
    }
  });
  $("#quickAddButton").addEventListener("click", addQuickIdea);
  $("#captureColorButton").addEventListener("click", () => {
    captureColorIndex = (captureColorIndex + 1) % NOTE_COLORS.length;
    $("#captureColorDot").style.background = NOTE_COLORS[captureColorIndex];
  });

  $("#globalSearch").addEventListener("input", () => {
    renderBoards();
    renderIdeaStream();
  });
  document.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (!$("#dashboardView").hidden) $("#globalSearch").focus();
    }
    if (event.key === "Escape" && !$("#editorView").hidden && document.activeElement?.tagName !== "TEXTAREA") selectedNoteId = null;
    if (!$("#editorView").hidden && selectedNoteId && ["Delete", "Backspace"].includes(event.key) && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      pushHistory();
      const page = getPage();
      page.notes = page.notes.filter(note => note.id !== selectedNoteId);
      page.connections = page.connections.filter(pair => !pair.includes(selectedNoteId));
      selectedNoteId = null;
      saveData(true);
      renderCanvas();
      showToast("Note moved out of the way");
    }
  });

  $("#boardGrid").addEventListener("click", event => {
    const favorite = event.target.closest("[data-favorite-board]");
    if (favorite) {
      event.stopPropagation();
      const board = data.boards.find(item => item.id === favorite.dataset.favoriteBoard);
      board.favorite = !board.favorite;
      saveData();
      renderBoards();
      showToast(board.favorite ? "Pinned to favorites" : "Removed from favorites");
      return;
    }
    if (event.target.closest("#newBoardButton")) return openNewBoardDialog();
    const card = event.target.closest("[data-board-id]");
    if (card) openEditor(card.dataset.boardId);
  });
  $("#boardGrid").addEventListener("keydown", event => {
    if (!["Enter", " "].includes(event.key) || !event.target.matches(".board-card[data-board-id]")) return;
    event.preventDefault();
    event.target.click();
  });

  $("#ideaStream").addEventListener("click", event => {
    const deleteButton = event.target.closest("[data-delete-idea]");
    if (deleteButton) {
      event.stopPropagation();
      data.looseIdeas = data.looseIdeas.filter(idea => idea.id !== deleteButton.dataset.deleteIdea);
      saveData();
      renderDashboard();
      showToast("Idea recycled");
      return;
    }
    const card = event.target.closest("[data-idea-board]");
    if (card?.dataset.ideaBoard) openEditor(card.dataset.ideaBoard);
  });
  $("#ideaStream").addEventListener("keydown", event => {
    if (!["Enter", " "].includes(event.key) || !event.target.matches(".idea-card")) return;
    event.preventDefault();
    event.target.click();
  });

  $("#filterPills").addEventListener("click", event => {
    const pill = event.target.closest("[data-filter]");
    if (!pill) return;
    currentFilter = pill.dataset.filter;
    $$(".pill").forEach(item => item.classList.toggle("active", item === pill));
    renderIdeaStream();
  });

  $$(".nav-item").forEach(item => item.addEventListener("click", () => {
    $$(".nav-item").forEach(nav => nav.classList.toggle("active", nav === item));
    currentFilter = "all";
    $$(".pill").forEach(pill => pill.classList.toggle("active", pill.dataset.filter === "all"));
    renderDashboard();
    $(".sidebar").classList.remove("mobile-open");
    $("#boardsTitle").textContent = item.dataset.nav === "favorites" ? "Your favorite scratchpads" : item.dataset.nav === "all" ? "Every scratchpad" : "Pick up where you left off";
  }));
  $("[data-go-home]").addEventListener("click", () => $$(".nav-item")[0].click());
  $("#viewAllBoards").addEventListener("click", () => $$(".nav-item").find(item => item.dataset.nav === "all").click());
  $("#mobileMenu").addEventListener("click", () => $(".sidebar").classList.toggle("mobile-open"));

  $("#newBoardForm").addEventListener("submit", event => {
    const submitter = event.submitter?.value;
    if (submitter !== "create") return;
    event.preventDefault();
    const starter = $("input[name='starter']:checked").value;
    $("#newBoardDialog").close();
    createBoard(starter);
  });

  $("#editorHomeButton").addEventListener("click", closeEditor);
  $("#boardTitleInput").addEventListener("input", event => {
    getBoard().title = event.target.value || "Untitled scratchpad";
    getBoard().updatedAt = Date.now();
    saveData(true);
  });
  $("#pageList").addEventListener("click", event => {
    const page = event.target.closest("[data-page-id]");
    if (!page) return;
    currentPageId = page.dataset.pageId;
    selectedNoteId = null;
    renderEditor();
  });
  $("#addPageButton").addEventListener("click", addPage);
  $("#addPageCard").addEventListener("click", addPage);

  $("#editorCaptureForm").addEventListener("submit", event => {
    event.preventDefault();
    const input = $("#editorCaptureInput");
    const text = input.value.trim();
    if (!text) return;
    addNote(text);
    input.value = "";
  });
  $("#editorCaptureInput").addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    $("#editorCaptureForm").requestSubmit();
  });
  $("#ideaCanvas").addEventListener("dblclick", event => {
    if (currentTool !== "select" || event.target.closest(".canvas-note")) return;
    const rect = $("#ideaCanvas").getBoundingClientRect();
    addNote("New thought…", (event.clientX - rect.left) / zoom - 95, (event.clientY - rect.top) / zoom - 55);
  });
  $("#canvasContent").addEventListener("input", event => {
    const noteElement = event.target.closest(".canvas-note");
    if (!noteElement || !event.target.matches(".note-text")) return;
    const note = getPage().notes.find(item => item.id === noteElement.dataset.noteId);
    note.text = event.target.value;
    note.tag = inferTag(note.text);
    noteElement.querySelector(".note-tag").textContent = note.tag;
    const doodle = doodleSvgFor(note.text);
    const doodleElement = noteElement.querySelector(".note-doodle");
    doodleElement.dataset.doodle = doodle.type;
    doodleElement.title = `Auto doodle: ${doodle.type}`;
    doodleElement.innerHTML = doodle.svg;
    getBoard().updatedAt = Date.now();
    saveData(true);
  });
  $("#canvasContent").addEventListener("focusin", event => {
    if (event.target.matches(".note-text")) pushHistory();
  });
  $("#canvasContent").addEventListener("click", event => {
    const menu = event.target.closest(".note-menu");
    if (menu) cycleNoteColor(menu.closest(".canvas-note").dataset.noteId);
  });
  $("#canvasContent").addEventListener("pointerdown", handlePointerDown);
  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp);
  $("#ideaCanvas").addEventListener("pointerdown", startDrawing);
  $("#ideaCanvas").addEventListener("pointermove", continueDrawing);
  window.addEventListener("pointerup", finishDrawing);

  $("#organizeButton").addEventListener("click", organizeIdeas);
  $("#helperOrganizeButton").addEventListener("click", organizeIdeas);
  $("#closeInsightPanel").addEventListener("click", () => $("#insightPanel").hidden = true);
  $$(".nudge-card").forEach(card => card.addEventListener("click", () => {
    addNote(card.dataset.prompt);
    showToast("Prompt added — bend it however you like");
  }));

  $$(".tool-button[data-tool]").forEach(button => button.addEventListener("click", () => {
    const tool = button.dataset.tool;
    const oneShotTool = ["note", "text", "connector"].includes(tool);
    currentTool = oneShotTool ? "select" : tool;
    $$(".tool-button[data-tool]").forEach(item => item.classList.toggle("active", oneShotTool ? item.dataset.tool === "select" : item === button));
    if (tool === "note" || tool === "text") addNote();
    if (tool === "connector") organizeIdeas();
    if (tool === "pen") showToast("Drag anywhere on the paper to doodle");
    renderCanvas();
  }));
  $("#undoButton").addEventListener("click", undo);
  $("#redoButton").addEventListener("click", redo);
  $("#zoomIn").addEventListener("click", () => applyZoom(zoom + .1));
  $("#zoomOut").addEventListener("click", () => applyZoom(zoom - .1));
  $("#shareButton").addEventListener("click", shareBoard);
  $("#editorMenuButton").addEventListener("click", () => showToast("More scratchpad options are coming soon"));
}

setGreeting();
bindEvents();
renderDashboard();
