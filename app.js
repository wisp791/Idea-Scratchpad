const STORAGE_KEY = "looseleaf-data-v6";
const NOTE_COLORS = ["#f5df78", "#f0b7cb", "#a9d9e7", "#b9d8a8", "#dcc8ef", "#f3b493", "#f6a4a4", "#94d7c5"];
const NOTE_VARIANTS = ["sticky", "paper", "card", "bubble", "label", "square", "circle"];
const PRIORITY_ORDER = ["important", "normal", "maybe"];
const PRIORITY_META = {
  important: { label: "Important", short: "!" },
  normal: { label: "Normal", short: "•" },
  maybe: { label: "Maybe", short: "?" }
};
const NOTE_SIZES = {
  sticky: { width: 205, height: 140 },
  paper: { width: 205, height: 146 },
  card: { width: 205, height: 146 },
  bubble: { width: 208, height: 148 },
  label: { width: 248, height: 104 },
  square: { width: 172, height: 172 },
  circle: { width: 180, height: 180 }
};
const NOTE_SCALE_OPTIONS = {
  small: .76,
  normal: 1,
  large: 1.24
};
const TEXT_DEFAULTS = {
  width: 230,
  fontSize: 24,
  color: "#2f2b25"
};
const CANVAS_GRADIENTS = {
  soft: "linear-gradient(135deg, rgba(255,255,255,.45), rgba(238,235,255,.44)), radial-gradient(circle at 12% 18%, rgba(245,223,120,.22), transparent 19%), radial-gradient(circle at 88% 26%, rgba(148,215,197,.2), transparent 22%)",
  warm: "linear-gradient(135deg, rgba(255,246,214,.55), rgba(255,254,250,.2)), radial-gradient(circle at 15% 18%, rgba(239,116,95,.18), transparent 24%), radial-gradient(circle at 82% 26%, rgba(245,223,120,.28), transparent 24%)",
  cool: "linear-gradient(135deg, rgba(238,235,255,.58), rgba(255,254,250,.2)), radial-gradient(circle at 18% 18%, rgba(169,217,231,.26), transparent 24%), radial-gradient(circle at 84% 28%, rgba(148,215,197,.24), transparent 23%)",
  none: "linear-gradient(transparent, transparent), linear-gradient(transparent, transparent), linear-gradient(transparent, transparent)"
};
const INK_GRADIENTS = {
  none: null,
  warm: ["#ef745f", "#f5df78"],
  cool: ["#6d5bd0", "#2e92a6"]
};
const DEFAULT_INK_COLOR = "#6d5bd0";
const DEFAULT_INK_OPACITY = .8;
const DEFAULT_PEN_SIZE = 5;
const DEFAULT_ERASER_SIZE = 28;
const CANVAS_WIDTH = 1040;
const CANVAS_HEIGHT = 680;
const CONNECTION_STYLES = [
  { className: "connection-solid", color: "#6d5bd0", shape: "curve" },
  { className: "connection-marker", color: "#ef745f", shape: "swoop" },
  { className: "connection-dashed", color: "#2e92a6", shape: "line" },
  { className: "connection-crayon", color: "#9a6a13", shape: "loop" }
];
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
let selectedNoteIds = new Set();
let selectedTextId = null;
let selectedTextIds = new Set();
let selectedDrawingIds = new Set();
let currentTool = "select";
let activeDrawing = null;
let eraserState = null;
let selectionBoxState = null;
let editorSearchQuery = "";
let insightPanelOpen = true;
let inkColor = DEFAULT_INK_COLOR;
let inkOpacity = DEFAULT_INK_OPACITY;
let inkGradient = "none";
let penSize = DEFAULT_PEN_SIZE;
let eraserSize = DEFAULT_ERASER_SIZE;
const undoStacks = {};
const redoStacks = {};
let toastTimer = null;
let saveTimer = null;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function hashString(value = "") {
  return [...value].reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);
}

function noteVariantFor(note, index = 0) {
  if (note.variant && NOTE_VARIANTS.includes(note.variant)) return note.variant;
  const text = note.text || "";
  if (/deadline|minutes?|schedule|remember|must|need|only|under/i.test(text)) return "label";
  if (/question|what if|maybe|could|why|how/i.test(text)) return "bubble";
  return NOTE_VARIANTS[Math.abs(hashString(`${note.id || text}-${index}`)) % NOTE_VARIANTS.length];
}

function noteSize(note) {
  const base = NOTE_SIZES[noteVariantFor(note)] || NOTE_SIZES.sticky;
  const scale = NOTE_SCALE_OPTIONS[note.size || "normal"] || NOTE_SCALE_OPTIONS.normal;
  return { width: Math.round(base.width * scale), height: Math.round(base.height * scale) };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function syncPrimarySelection() {
  selectedNoteId = selectedNoteIds.values().next().value || null;
  selectedTextId = selectedTextIds.values().next().value || null;
}

function refreshSelectionClasses() {
  $$(".canvas-note").forEach(element => element.classList.toggle("selected", selectedNoteIds.has(element.dataset.noteId)));
  $$(".canvas-text").forEach(element => element.classList.toggle("selected", selectedTextIds.has(element.dataset.textId)));
  $$(".doodle-path").forEach(element => element.classList.toggle("selected", selectedDrawingIds.has(element.dataset.drawingId)));
  updateContextOptions();
}

function clearSelection() {
  selectedNoteIds.clear();
  selectedTextIds.clear();
  selectedDrawingIds.clear();
  selectedNoteId = null;
  selectedTextId = null;
  updateContextOptions();
}

function selectOnlyNote(noteId) {
  selectedTextIds.clear();
  selectedDrawingIds.clear();
  selectedNoteIds = new Set([noteId]);
  syncPrimarySelection();
  updateContextOptions();
}

function toggleNoteSelection(noteId) {
  selectedTextIds.clear();
  selectedDrawingIds.clear();
  selectedNoteIds.has(noteId) ? selectedNoteIds.delete(noteId) : selectedNoteIds.add(noteId);
  syncPrimarySelection();
  updateContextOptions();
}

function selectOnlyText(textId) {
  selectedNoteIds.clear();
  selectedDrawingIds.clear();
  selectedTextIds = new Set([textId]);
  syncPrimarySelection();
  updateContextOptions();
}

function toggleTextSelection(textId) {
  selectedNoteIds.clear();
  selectedDrawingIds.clear();
  selectedTextIds.has(textId) ? selectedTextIds.delete(textId) : selectedTextIds.add(textId);
  syncPrimarySelection();
  updateContextOptions();
}

function selectOnlyDrawing(drawingId) {
  selectedNoteIds.clear();
  selectedTextIds.clear();
  selectedDrawingIds = new Set([drawingId]);
  syncPrimarySelection();
  updateContextOptions();
}

function toggleDrawingSelection(drawingId) {
  selectedNoteIds.clear();
  selectedTextIds.clear();
  selectedDrawingIds.has(drawingId) ? selectedDrawingIds.delete(drawingId) : selectedDrawingIds.add(drawingId);
  syncPrimarySelection();
  updateContextOptions();
}

function priorityMeta(priority = "normal") {
  return PRIORITY_META[priority] || PRIORITY_META.normal;
}

function matchesEditorSearch(note) {
  if (!editorSearchQuery) return true;
  const haystack = `${note.text || ""} ${note.tag || ""} ${priorityMeta(note.priority).label}`.toLowerCase();
  return haystack.includes(editorSearchQuery);
}

function normalizeData(source) {
  source.boards ||= [];
  source.boards.forEach(board => {
    board.pages ||= [{ id: uid("page"), notes: [], connections: [], drawings: [] }];
    board.pages.forEach(page => {
      page.notes ||= [];
      page.texts ||= [];
      page.connections ||= [];
      page.drawings ||= [];
      page.groups ||= [];
      page.backgroundColor ||= "#faf9f4";
      page.backgroundGradient ||= "soft";
      page.notes.forEach((note, index) => {
        note.color ||= NOTE_COLORS[index % NOTE_COLORS.length];
        note.tag ||= inferTag(note.text || "");
        note.variant = noteVariantFor(note, index);
        note.priority ||= "normal";
        note.size ||= "normal";
        note.x ??= 90 + (index * 215) % 760;
        note.y ??= 90 + (Math.floor(index / 3) * 180) % 430;
      });
      page.texts.forEach((text, index) => {
        text.text ||= "Plain text";
        text.x ??= 120 + (index * 120) % 640;
        text.y ??= 120 + (index * 90) % 430;
        text.width ||= TEXT_DEFAULTS.width;
        text.fontSize ||= TEXT_DEFAULTS.fontSize;
        text.color ||= TEXT_DEFAULTS.color;
      });
      page.drawings.forEach(drawing => {
        drawing.kind ||= "ink";
        drawing.color ||= DEFAULT_INK_COLOR;
        drawing.opacity ??= DEFAULT_INK_OPACITY;
        drawing.size ||= drawing.kind === "line" ? 4 : DEFAULT_PEN_SIZE;
        drawing.gradient ||= "none";
        drawing.points ||= [];
      });
    });
  });
  source.looseIdeas ||= [];
  return source;
}

function loadData() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored?.boards && stored?.looseIdeas) {
      return normalizeData(stored);
    }
  } catch (error) {
    console.warn("Could not load saved ideas", error);
  }
  return normalizeData({ boards: [], looseIdeas: [] });
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

function boardRouteHash(boardId = currentBoardId, pageId = currentPageId) {
  if (!boardId) return "";
  const params = new URLSearchParams({ scratchpad: boardId });
  if (pageId) params.set("page", pageId);
  return `#${params.toString()}`;
}

function routeUrl(boardId = currentBoardId, pageId = currentPageId) {
  const hash = boardRouteHash(boardId, pageId);
  return `${location.href.split("#")[0]}${hash}`;
}

function setRoute(boardId, pageId, replace = false) {
  const hash = boardRouteHash(boardId, pageId);
  const nextUrl = `${location.href.split("#")[0]}${hash}`;
  if (location.href === nextUrl) return;
  history[replace ? "replaceState" : "pushState"]({}, "", nextUrl);
}

function parseRoute() {
  const hash = location.hash.replace(/^#/, "");
  if (!hash) return {};
  const params = new URLSearchParams(hash);
  if (params.has("scratchpad")) return { boardId: params.get("scratchpad"), pageId: params.get("page") };
  const legacyMatch = hash.match(/^\/?board\/([^/]+)(?:\/page\/([^/]+))?/);
  if (legacyMatch) return { boardId: decodeURIComponent(legacyMatch[1]), pageId: legacyMatch[2] ? decodeURIComponent(legacyMatch[2]) : null };
  return {};
}

function applyRouteFromUrl() {
  const { boardId, pageId } = parseRoute();
  if (!boardId) {
    if (!$("#editorView").hidden) closeEditor({ updateRoute: false });
    return;
  }
  const board = data.boards.find(item => item.id === boardId);
  if (!board) {
    closeEditor({ updateRoute: false });
    setRoute(null, null, true);
    showToast("That share link could not find a scratchpad on this device");
    return;
  }
  openEditor(board.id, board.pages.some(page => page.id === pageId) ? pageId : board.pages[0].id, { updateRoute: false });
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
  clearSelection();
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

  $("#ideaStream").innerHTML = ideas.map((idea, index) => {
    const variant = noteVariantFor(idea, index);
    const size = idea.size || "normal";
    const priority = idea.priority || "normal";
    return `
    <article class="idea-card idea-variant-${variant} idea-size-${size} priority-${priority}" role="button" tabindex="0" style="--idea-color:${idea.color}" data-idea-board="${idea.boardId || ""}">
      <p>${escapeHtml(idea.text)}</p>
      <span class="idea-meta">
        <span class="idea-tag">${escapeHtml(idea.boardTitle || idea.tag || "Loose idea")}</span>
        ${idea.source === "loose" ? `<button class="idea-delete" data-delete-idea="${idea.id}" type="button" aria-label="Delete idea">×</button>` : `<span>${relativeTime(idea.createdAt)}</span>`}
      </span>
    </article>`;
  }).join("");
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
  notes.forEach((note, index) => {
    note.priority = "normal";
    note.variant = noteVariantFor(note, index);
  });
  data.boards.unshift({ id: boardId, title, category: "New", favorite: false, updatedAt: Date.now(), pages: [{ id: pageId, notes, texts: [], connections: [], drawings: [], groups: [], backgroundColor: "#faf9f4", backgroundGradient: "soft" }] });
  saveData();
  openEditor(boardId);
}

function openEditor(boardId, pageId, options = {}) {
  const board = data.boards.find(item => item.id === boardId);
  if (!board) return;
  currentBoardId = board.id;
  currentPageId = board.pages.some(page => page.id === pageId) ? pageId : board.pages[0].id;
  clearSelection();
  currentTool = "select";
  $$(".tool-button[data-tool]").forEach(item => item.classList.toggle("active", item.dataset.tool === "select"));
  $("#boardTitleInput").value = board.title;
  $("#editorSearchInput").value = editorSearchQuery;
  $("#dashboardView").hidden = true;
  $("#editorView").hidden = false;
  document.body.style.overflow = "hidden";
  setInsightPanelOpen(insightPanelOpen);
  renderEditor();
  if (options.updateRoute !== false) setRoute(board.id, currentPageId);
}

function closeEditor(options = {}) {
  $("#editorView").hidden = true;
  $("#dashboardView").hidden = false;
  document.body.style.overflow = "";
  currentBoardId = null;
  currentPageId = null;
  renderDashboard();
  if (options.updateRoute !== false) setRoute(null, null);
}

function renderEditor() {
  renderPages();
  renderCanvas();
}

function setInsightPanelOpen(open) {
  insightPanelOpen = open;
  $("#insightPanel").hidden = !open;
  $("#openInsightPanel").hidden = open;
  $(".editor-layout").classList.toggle("helper-closed", !open);
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

function applyCanvasAppearance(page = getPage()) {
  const canvas = $("#ideaCanvas");
  if (!canvas || !page) return;
  canvas.style.setProperty("--canvas-bg", page.backgroundColor || "#faf9f4");
  canvas.style.setProperty("--canvas-gradient", CANVAS_GRADIENTS[page.backgroundGradient || "soft"] || CANVAS_GRADIENTS.soft);
}

function renderCanvas() {
  const page = getPage();
  if (!page) return;
  page.drawings ||= [];
  page.groups ||= [];
  page.texts ||= [];
  applyCanvasAppearance(page);
  $("#ideaCanvas").classList.toggle("drawing", currentTool === "pen");
  $("#ideaCanvas").classList.toggle("erasing", currentTool === "eraser");
  $("#ideaCanvas").classList.toggle("lining", currentTool === "connector");
  $("#ideaCanvas").classList.toggle("placing-note", currentTool === "note");
  $("#ideaCanvas").classList.toggle("placing-text", currentTool === "text");
  $("#connectionsLayer").classList.toggle("selecting", currentTool === "select");
  $("#connectionsLayer").classList.toggle("erasing", currentTool === "eraser");
  $("#connectionsLayer").classList.toggle("line-tool", currentTool === "connector");
  const groupMarkup = page.groups.map(group => `
    <div class="circle-group-ring" style="left:${group.x - group.radius}px;top:${group.y - group.radius}px;width:${group.radius * 2}px;height:${group.radius * 2}px"></div>
    <div class="circle-group-title" style="left:${group.x - 72}px;top:${group.y - 24}px">
      <strong>${escapeHtml(group.label)}</strong><small>${group.count} ${group.count === 1 ? "idea" : "ideas"}</small>
    </div>`).join("");
  const noteMarkup = page.notes.map((note, index) => {
    const variant = noteVariantFor(note, index);
    note.variant = variant;
    note.priority ||= "normal";
    note.size ||= "normal";
    const size = noteSize(note);
    const rotation = index % 3 === 0 ? "-1.4deg" : index % 3 === 1 ? ".9deg" : ".25deg";
    const searchClass = editorSearchQuery ? (matchesEditorSearch(note) ? "search-match" : "search-dim") : "";
    const priority = priorityMeta(note.priority);
    return `
    <article class="canvas-note note-variant-${variant} priority-${note.priority} ${searchClass} ${selectedNoteIds.has(note.id) ? "selected" : ""}" data-note-id="${note.id}" style="left:${note.x}px;top:${note.y}px;width:${size.width}px;height:${size.height}px;min-height:${size.height}px;--note-color:${note.color};--rotation:${rotation}">
      ${doodleMarkup(note.text)}
      <textarea class="note-text" spellcheck="true" maxlength="220" aria-label="Idea text">${escapeHtml(note.text)}</textarea>
      <div class="note-bottom">
        <span class="note-tag">${escapeHtml(note.tag || "idea")}</span>
        <span class="note-actions">
          <button class="note-priority" type="button" aria-label="Change idea priority" title="Priority: ${priority.label}">${priority.short}</button>
          <button class="note-shape" type="button" aria-label="Change note shape" title="Change note shape">shape</button>
          <button class="note-menu" type="button" aria-label="Change note color">...</button>
        </span>
      </div>
    </article>`;
  }).join("");
  const textMarkup = page.texts.map(text => `
    <div class="canvas-text ${selectedTextIds.has(text.id) ? "selected" : ""}" data-text-id="${text.id}" style="left:${text.x}px;top:${text.y}px;--text-width:${text.width || TEXT_DEFAULTS.width}px;--text-size:${text.fontSize || TEXT_DEFAULTS.fontSize}px;--text-color:${text.color || TEXT_DEFAULTS.color}">
      <button class="text-drag-handle" type="button" aria-label="Move text">+</button>
      <textarea class="plain-text" spellcheck="true" maxlength="220" aria-label="Plain text">${escapeHtml(text.text || "")}</textarea>
    </div>`).join("");
  $("#canvasContent").innerHTML = groupMarkup + textMarkup + noteMarkup;
  $("#canvasHint").hidden = page.notes.length > 0 || page.texts.length > 0 || page.drawings.length > 0;
  drawConnections();
  resizeNoteTextareas();
  resizePlainTextareas();
  updateContextOptions();
}

function resizeNoteTextareas(root = document) {
  $$(".note-text", root).forEach(textarea => {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`;
  });
}

function resizePlainTextareas(root = document) {
  $$(".plain-text", root).forEach(textarea => {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  });
}

function noteCenter(note) {
  const size = noteSize(note);
  return { x: note.x + size.width / 2, y: note.y + size.height / 2 };
}

function connectionGeometry(start, end, index, shape) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  const normal = { x: -dy / length, y: dx / length };
  const bendDirection = index % 2 ? -1 : 1;
  const bend = bendDirection * Math.min(150, Math.max(70, length * .24));
  if (shape === "line") {
    return { path: `M ${start.x} ${start.y} L ${end.x} ${end.y}`, angle: Math.atan2(dy, dx) };
  }
  if (shape === "swoop") {
    const c1 = { x: start.x + dx * .18 + normal.x * bend * 1.2, y: start.y + dy * .18 + normal.y * bend * 1.2 };
    const c2 = { x: end.x - dx * .28 + normal.x * bend * .45, y: end.y - dy * .28 + normal.y * bend * .45 };
    return { path: `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`, angle: Math.atan2(end.y - c2.y, end.x - c2.x) };
  }
  if (shape === "loop") {
    const c1 = { x: start.x + dx * .2 + normal.x * bend * 1.35, y: start.y + dy * .2 + normal.y * bend * 1.35 };
    const c2 = { x: end.x - dx * .15 - normal.x * bend * .75, y: end.y - dy * .15 - normal.y * bend * .75 };
    return { path: `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`, angle: Math.atan2(end.y - c2.y, end.x - c2.x) };
  }
  const c1 = { x: start.x + dx * .33 + normal.x * bend, y: start.y + dy * .33 + normal.y * bend };
  const c2 = { x: end.x - dx * .33 + normal.x * bend, y: end.y - dy * .33 + normal.y * bend };
  return { path: `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`, angle: Math.atan2(end.y - c2.y, end.x - c2.x) };
}

function arrowFor(end, angle, color, className) {
  const size = 11;
  const ax1 = end.x - size * Math.cos(angle - .48);
  const ay1 = end.y - size * Math.sin(angle - .48);
  const ax2 = end.x - size * Math.cos(angle + .48);
  const ay2 = end.y - size * Math.sin(angle + .48);
  return `<path class="connection-arrow ${className}" style="fill:${color}" d="M ${end.x} ${end.y} L ${ax1} ${ay1} L ${ax2} ${ay2} Z"/>`;
}

function freehandPath(points) {
  return points.map((point, index) => `${index ? "L" : "M"} ${point[0].toFixed(1)} ${point[1].toFixed(1)}`).join(" ");
}

function curvedLinePath(points) {
  if (points.length < 3) return freehandPath(points);
  const commands = [`M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`];
  for (let index = 1; index < points.length - 1; index++) {
    const current = points[index];
    const next = points[index + 1];
    const end = index === points.length - 2
      ? next
      : [(current[0] + next[0]) / 2, (current[1] + next[1]) / 2];
    commands.push(`Q ${current[0].toFixed(1)} ${current[1].toFixed(1)} ${end[0].toFixed(1)} ${end[1].toFixed(1)}`);
  }
  return commands.join(" ");
}

function drawingPath(drawing) {
  return drawing.kind === "line" ? curvedLinePath(drawing.points) : freehandPath(drawing.points);
}

function lineControlMarkup(drawing) {
  if (!selectedDrawingIds.has(drawing.id) || drawing.kind !== "line") return "";
  return drawing.points.map((point, index) => `<circle class="line-control-point" cx="${point[0].toFixed(1)}" cy="${point[1].toFixed(1)}" r="${index === 0 || index === drawing.points.length - 1 ? 4 : 5}"/>`).join("");
}

function drawConnections() {
  const page = getPage();
  const layer = $("#connectionsLayer");
  if (!page || !layer) return;
  const defs = [];
  const doodles = (page.drawings || []).map(drawing => {
    if (drawing.points.length < 2) return "";
    const gradient = INK_GRADIENTS[drawing.gradient || "none"];
    let stroke = drawing.color || DEFAULT_INK_COLOR;
    if (gradient) {
      const gradientId = `ink-${drawing.id}`;
      defs.push(`<linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${gradient[0]}"/><stop offset="100%" stop-color="${gradient[1]}"/></linearGradient>`);
      stroke = `url(#${gradientId})`;
    }
    const className = `doodle-path ${drawing.kind === "line" ? "manual-line-path" : ""} ${selectedDrawingIds.has(drawing.id) ? "selected" : ""}`;
    const path = drawingPath(drawing);
    const width = drawing.size || (drawing.kind === "line" ? 4 : DEFAULT_PEN_SIZE);
    const opacity = drawing.opacity ?? DEFAULT_INK_OPACITY;
    return `<path class="${className}" data-drawing-id="${drawing.id}" data-kind="${drawing.kind || "ink"}" d="${path}" style="stroke:${stroke};stroke-width:${width};opacity:${opacity}"/>${lineControlMarkup(drawing)}`;
  }).join("");
  const connections = page.connections.map(([fromId, toId], index) => {
    const from = page.notes.find(note => note.id === fromId);
    const to = page.notes.find(note => note.id === toId);
    if (!from || !to) return "";
    const style = CONNECTION_STYLES[index % CONNECTION_STYLES.length];
    const start = noteCenter(from);
    const end = noteCenter(to);
    const geometry = connectionGeometry(start, end, index, style.shape);
    const echo = style.className === "connection-crayon" ? `<path class="connection-path connection-echo" style="stroke:${style.color}" d="${geometry.path}"/>` : "";
    return `${echo}<path class="connection-path ${style.className}" data-from="${fromId}" data-to="${toId}" style="stroke:${style.color}" d="${geometry.path}"/>${arrowFor(end, geometry.angle, style.color, style.className)}`;
  }).join("");
  layer.innerHTML = `${defs.length ? `<defs>${defs.join("")}</defs>` : ""}${doodles}${connections}`;
}

function addPage() {
  const board = getBoard();
  const page = { id: uid("page"), notes: [], texts: [], connections: [], drawings: [], groups: [], backgroundColor: "#faf9f4", backgroundGradient: "soft" };
  board.pages.push(page);
  board.updatedAt = Date.now();
  currentPageId = page.id;
  saveData(true);
  renderEditor();
  setRoute(currentBoardId, currentPageId);
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
    tag: inferTag(text),
    variant: NOTE_VARIANTS[count % NOTE_VARIANTS.length],
    priority: "normal",
    size: "normal"
  };
  page.notes.push(note);
  getBoard().updatedAt = Date.now();
  selectOnlyNote(note.id);
  saveData(true);
  renderEditor();
  setTimeout(() => {
    const textarea = $(`[data-note-id="${note.id}"] .note-text`);
    if (text === "New thought…") textarea?.select();
  }, 10);
}

function addText(text = "Plain text", x, y) {
  const page = getPage();
  pushHistory();
  page.texts ||= [];
  const count = page.texts.length;
  const item = {
    id: uid("text"),
    text,
    x: x ?? 150 + (count * 90) % 620,
    y: y ?? 130 + (count * 72) % 390,
    width: TEXT_DEFAULTS.width,
    fontSize: TEXT_DEFAULTS.fontSize,
    color: TEXT_DEFAULTS.color
  };
  page.texts.push(item);
  getBoard().updatedAt = Date.now();
  selectOnlyText(item.id);
  saveData(true);
  renderEditor();
  setTimeout(() => {
    const textarea = $(`[data-text-id="${item.id}"] .plain-text`);
    if (text === "Plain text") textarea?.select();
  }, 10);
}

function placeToolItem(event) {
  if (!["note", "text"].includes(currentTool) || event.button !== 0) return;
  if (event.target.closest(".canvas-note, .canvas-text, [data-drawing-id], .circle-group-title, .circle-group-ring")) return;
  event.preventDefault();
  const point = canvasPoint(event);
  if (currentTool === "note") {
    addNote(undefined, point.x - NOTE_SIZES.sticky.width / 2, point.y - NOTE_SIZES.sticky.height / 2);
  } else {
    addText(undefined, point.x - TEXT_DEFAULTS.width / 2, point.y - TEXT_DEFAULTS.fontSize);
  }
  setTool("select");
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

function titleCase(value = "") {
  return value.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
}

function groupNotesByCategory(notes) {
  const groups = new Map();
  notes.forEach(note => {
    note.tag = inferTag(note.text);
    const label = titleCase(note.tag || "idea");
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(note);
  });
  return [...groups.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
}

function circleSortIdeas() {
  const page = getPage();
  if (!page || page.notes.length < 2) {
    showToast("Add a few ideas before circle sorting");
    return;
  }
  pushHistory();
  const groups = groupNotesByCategory(page.notes);
  const columns = Math.min(3, Math.max(1, groups.length));
  const gapX = CANVAS_WIDTH / columns;
  const gapY = groups.length > 3 ? 270 : 330;
  page.groups = [];
  groups.forEach(([label, notes], index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const center = {
      x: gapX * column + gapX / 2,
      y: 205 + row * gapY
    };
    const radius = clamp(88 + notes.length * 18, 112, 170);
    page.groups.push({ id: uid("group"), label, count: notes.length, x: center.x, y: center.y, radius });
    notes.forEach((note, noteIndex) => {
      const size = noteSize(note);
      const angle = -Math.PI / 2 + (Math.PI * 2 * noteIndex) / Math.max(1, notes.length);
      const ringRadius = notes.length === 1 ? 0 : radius;
      note.x = clamp(center.x + Math.cos(angle) * ringRadius - size.width / 2, 14, CANVAS_WIDTH - size.width - 14);
      note.y = clamp(center.y + Math.sin(angle) * ringRadius - size.height / 2, 20, CANVAS_HEIGHT - size.height - 20);
    });
  });
  page.connections = findSimilarConnections(page.notes).connections;
  getBoard().updatedAt = Date.now();
  saveData(true);
  renderCanvas();
  showToast(`Circle sorted into ${groups.length} ${groups.length === 1 ? "category" : "categories"}`);
}

function organizeIdeas() {
  const page = getPage();
  if (!page || page.notes.length < 2) {
    showToast("Add at least two thoughts before connecting ideas");
    return;
  }
  pushHistory();
  page.notes.forEach(note => {
    note.tag = inferTag(note.text);
  });
  const matches = findSimilarConnections(page.notes);
  page.connections = matches.connections;
  page.groups = [];
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

function selectedNotes() {
  const page = getPage();
  return page ? page.notes.filter(note => selectedNoteIds.has(note.id)) : [];
}

function selectedTexts() {
  const page = getPage();
  return page ? (page.texts || []).filter(text => selectedTextIds.has(text.id)) : [];
}

function updateContextOptions() {
  const options = $("#contextOptions");
  if (!options) return;
  const page = getPage();
  const notes = selectedNotes();
  const texts = selectedTexts();
  let activeGroup = "";
  if (currentTool === "pen") activeGroup = "ink";
  else if (currentTool === "eraser") activeGroup = "eraser";
  else if (currentTool === "select" && texts.length && !selectedNoteIds.size && !selectedDrawingIds.size) activeGroup = "text";
  else if (currentTool === "select" && notes.length && !selectedTextIds.size && !selectedDrawingIds.size) activeGroup = "note";
  else if (page && currentTool === "select" && !selectedNoteIds.size && !selectedTextIds.size && !selectedDrawingIds.size) activeGroup = "background";

  $$("[data-context-group]", options).forEach(group => {
    group.classList.toggle("active", group.dataset.contextGroup === activeGroup);
  });

  if (page) {
    const canvasColor = $("#canvasColorInput");
    const canvasGradient = $("#canvasGradientInput");
    if (canvasColor) canvasColor.value = page.backgroundColor || "#faf9f4";
    if (canvasGradient) canvasGradient.value = page.backgroundGradient || "soft";
  }
  if (notes[0] && $("#noteSizeInput")) $("#noteSizeInput").value = notes[0].size || "normal";
  if (texts[0] && $("#textSizeInput")) $("#textSizeInput").value = texts[0].fontSize || TEXT_DEFAULTS.fontSize;
  if ($("#inkColorInput")) $("#inkColorInput").value = inkColor;
  if ($("#inkOpacityInput")) $("#inkOpacityInput").value = Math.round(inkOpacity * 100);
  if ($("#inkGradientInput")) $("#inkGradientInput").value = inkGradient;
  if ($("#penSizeInput")) $("#penSizeInput").value = penSize;
  if ($("#eraserSizeInput")) $("#eraserSizeInput").value = eraserSize;
  updateToolCursorSize();
}

function updatePageBackground(updates) {
  const page = getPage();
  if (!page) return;
  pushHistory();
  Object.assign(page, updates);
  getBoard().updatedAt = Date.now();
  saveData(true);
  applyCanvasAppearance(page);
  updateContextOptions();
}

function applySelectedNoteSize(size) {
  const notes = selectedNotes();
  if (!notes.length) return;
  pushHistory();
  notes.forEach(note => { note.size = size; });
  getBoard().updatedAt = Date.now();
  saveData(true);
  renderCanvas();
}

function applySelectedTextSize(size) {
  const texts = selectedTexts();
  if (!texts.length) return;
  pushHistory();
  texts.forEach(text => { text.fontSize = Number(size); });
  getBoard().updatedAt = Date.now();
  saveData(true);
  renderCanvas();
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-999px";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  }
}

async function shareBoard() {
  const shareUrl = currentBoardId ? routeUrl(currentBoardId, currentPageId) : location.href;
  try {
    const copied = await copyText(shareUrl);
    if (!copied) throw new Error("copy failed");
    showToast(currentBoardId ? "Scratchpad page link copied" : "Share link copied");
  } catch {
    showToast("Copy the URL from the address bar");
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

function cycleNoteVariant(noteId) {
  const note = getPage().notes.find(item => item.id === noteId);
  if (!note) return;
  pushHistory();
  const index = NOTE_VARIANTS.indexOf(note.variant);
  note.variant = NOTE_VARIANTS[(Math.max(0, index) + 1) % NOTE_VARIANTS.length];
  saveData(true);
  renderCanvas();
  showToast(`Shape changed to ${note.variant}`);
}

function cycleNotePriority(noteId) {
  const note = getPage().notes.find(item => item.id === noteId);
  if (!note) return;
  pushHistory();
  const index = PRIORITY_ORDER.indexOf(note.priority || "normal");
  note.priority = PRIORITY_ORDER[(Math.max(0, index) + 1) % PRIORITY_ORDER.length];
  saveData(true);
  renderCanvas();
  showToast(`Marked as ${priorityMeta(note.priority).label.toLowerCase()}`);
}

function deleteSelectedItems() {
  const page = getPage();
  if (!page || (!selectedNoteIds.size && !selectedTextIds.size && !selectedDrawingIds.size)) return false;
  pushHistory();
  const deletedNoteIds = new Set(selectedNoteIds);
  page.notes = page.notes.filter(note => !deletedNoteIds.has(note.id));
  page.texts = (page.texts || []).filter(text => !selectedTextIds.has(text.id));
  page.connections = page.connections.filter(pair => !pair.some(id => deletedNoteIds.has(id)));
  page.drawings = (page.drawings || []).filter(drawing => !selectedDrawingIds.has(drawing.id));
  page.groups = [];
  clearSelection();
  getBoard().updatedAt = Date.now();
  saveData(true);
  renderCanvas();
  showToast("Selection erased");
  return true;
}

function eraseNote(noteId) {
  selectedNoteIds = new Set([noteId]);
  selectedTextIds.clear();
  selectedDrawingIds.clear();
  deleteSelectedItems();
}

function eraseText(textId) {
  selectedNoteIds.clear();
  selectedTextIds = new Set([textId]);
  selectedDrawingIds.clear();
  deleteSelectedItems();
}

function eraseDrawing(drawingId) {
  selectedNoteIds.clear();
  selectedTextIds.clear();
  selectedDrawingIds = new Set([drawingId]);
  deleteSelectedItems();
}

function canvasPoint(event) {
  const rect = $("#ideaCanvas").getBoundingClientRect();
  return {
    x: clamp((event.clientX - rect.left) / zoom, 0, CANVAS_WIDTH),
    y: clamp((event.clientY - rect.top) / zoom, 0, CANVAS_HEIGHT)
  };
}

function rectFromPoints(first, second) {
  return {
    x: Math.min(first.x, second.x),
    y: Math.min(first.y, second.y),
    width: Math.abs(second.x - first.x),
    height: Math.abs(second.y - first.y)
  };
}

function noteRect(note) {
  const size = noteSize(note);
  return { x: note.x, y: note.y, width: size.width, height: size.height };
}

function textRect(text) {
  const fontSize = text.fontSize || TEXT_DEFAULTS.fontSize;
  const lineCount = Math.max(1, String(text.text || "").split(/\n/).length);
  return {
    x: text.x,
    y: text.y,
    width: text.width || TEXT_DEFAULTS.width,
    height: Math.max(44, lineCount * fontSize * 1.35 + 18)
  };
}

function rectsIntersect(first, second) {
  return first.x < second.x + second.width &&
    first.x + first.width > second.x &&
    first.y < second.y + second.height &&
    first.y + first.height > second.y;
}

function drawingBounds(drawing) {
  const xs = drawing.points.map(point => point[0]);
  const ys = drawing.points.map(point => point[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
}

function updateSelectionBox(rect) {
  const box = $("#selectionBox");
  box.hidden = false;
  box.style.left = `${rect.x}px`;
  box.style.top = `${rect.y}px`;
  box.style.width = `${rect.width}px`;
  box.style.height = `${rect.height}px`;
}

function finishSelectionBox() {
  if (!selectionBoxState) return;
  const rect = selectionBoxState.rect;
  $("#selectionBox").hidden = true;
  if (rect.width < 6 && rect.height < 6) {
    if (!selectionBoxState.additive) clearSelection();
  } else {
    if (!selectionBoxState.additive) clearSelection();
    const page = getPage();
    page.notes.forEach(note => {
      if (rectsIntersect(rect, noteRect(note))) selectedNoteIds.add(note.id);
    });
    (page.texts || []).forEach(text => {
      if (rectsIntersect(rect, textRect(text))) selectedTextIds.add(text.id);
    });
    (page.drawings || []).forEach(drawing => {
      if (drawing.points?.length && rectsIntersect(rect, drawingBounds(drawing))) selectedDrawingIds.add(drawing.id);
    });
    syncPrimarySelection();
  }
  selectionBoxState = null;
  renderCanvas();
}

function handlePointerDown(event) {
  const textElement = event.target.closest(".canvas-text");
  if (textElement) {
    handleTextPointerDown(event, textElement);
    return;
  }
  const noteElement = event.target.closest(".canvas-note");
  if (!noteElement) return;
  const note = getPage().notes.find(item => item.id === noteElement.dataset.noteId);
  if (!note) return;

  if (currentTool === "eraser") {
    event.preventDefault();
    event.stopPropagation();
    eraseNote(note.id);
    return;
  }
  if (currentTool !== "select" || event.target.matches("button")) return;
  if (event.target.matches("textarea")) {
    event.shiftKey ? toggleNoteSelection(note.id) : selectOnlyNote(note.id);
    refreshSelectionClasses();
    return;
  }

  event.preventDefault();
  if (event.shiftKey) toggleNoteSelection(note.id);
  else if (!selectedNoteIds.has(note.id)) selectOnlyNote(note.id);

  const movingNotes = getPage().notes.filter(item => selectedNoteIds.has(item.id));
  dragState = {
    notes: movingNotes,
    texts: [],
    origins: new Map(movingNotes.map(item => [item.id, { x: item.x, y: item.y }])),
    startX: event.clientX,
    startY: event.clientY,
    historyPushed: false
  };
  noteElement.setPointerCapture(event.pointerId);
  renderCanvas();
}

function handleTextPointerDown(event, textElement) {
  const text = (getPage().texts || []).find(item => item.id === textElement.dataset.textId);
  if (!text) return;

  if (currentTool === "eraser") {
    event.preventDefault();
    event.stopPropagation();
    eraseText(text.id);
    return;
  }
  if (currentTool !== "select") return;
  if (event.target.matches(".plain-text")) {
    event.shiftKey ? toggleTextSelection(text.id) : selectOnlyText(text.id);
    refreshSelectionClasses();
    return;
  }

  event.preventDefault();
  if (event.shiftKey) toggleTextSelection(text.id);
  else if (!selectedTextIds.has(text.id)) selectOnlyText(text.id);

  const movingTexts = (getPage().texts || []).filter(item => selectedTextIds.has(item.id));
  dragState = {
    notes: [],
    texts: movingTexts,
    origins: new Map(movingTexts.map(item => [item.id, { x: item.x, y: item.y }])),
    startX: event.clientX,
    startY: event.clientY,
    historyPushed: false
  };
  textElement.setPointerCapture(event.pointerId);
  renderCanvas();
}

function handlePointerMove(event) {
  if (selectionBoxState) {
    const point = canvasPoint(event);
    selectionBoxState.rect = rectFromPoints(selectionBoxState.start, point);
    updateSelectionBox(selectionBoxState.rect);
    return;
  }
  if (!dragState) return;
  const dx = (event.clientX - dragState.startX) / zoom;
  const dy = (event.clientY - dragState.startY) / zoom;
  if (!dragState.historyPushed && Math.hypot(dx, dy) > 2) {
    pushHistory();
    dragState.historyPushed = true;
  }
  (dragState.notes || []).forEach(note => {
    const origin = dragState.origins.get(note.id);
    const size = noteSize(note);
    note.x = clamp(origin.x + dx, 0, CANVAS_WIDTH - size.width);
    note.y = clamp(origin.y + dy, 0, CANVAS_HEIGHT - size.height);
    const element = $(`[data-note-id="${note.id}"]`);
    if (element) {
      element.style.left = `${note.x}px`;
      element.style.top = `${note.y}px`;
    }
  });
  (dragState.texts || []).forEach(text => {
    const origin = dragState.origins.get(text.id);
    const rect = textRect(text);
    text.x = clamp(origin.x + dx, 0, CANVAS_WIDTH - rect.width);
    text.y = clamp(origin.y + dy, 0, CANVAS_HEIGHT - rect.height);
    const element = $(`[data-text-id="${text.id}"]`);
    if (element) {
      element.style.left = `${text.x}px`;
      element.style.top = `${text.y}px`;
    }
  });
  drawConnections();
}

function handlePointerUp() {
  if (selectionBoxState) {
    finishSelectionBox();
    return;
  }
  if (!dragState) return;
  if (dragState.historyPushed) {
    getBoard().updatedAt = Date.now();
    saveData(true);
  }
  dragState = null;
}

function startSelectionBox(event) {
  if (currentTool !== "select" || event.button !== 0) return;
  if (event.target.closest(".canvas-note, .canvas-text, .doodle-path, .circle-group-title, .circle-group-ring")) return;
  event.preventDefault();
  const start = canvasPoint(event);
  selectionBoxState = {
    start,
    rect: { x: start.x, y: start.y, width: 0, height: 0 },
    additive: event.shiftKey
  };
  updateSelectionBox(selectionBoxState.rect);
  $("#ideaCanvas").setPointerCapture(event.pointerId);
}

function handleDrawingPointerDown(event) {
  const path = event.target.closest("[data-drawing-id]");
  if (!path) return;
  const drawingId = path.dataset.drawingId;
  if (currentTool === "eraser") {
    event.preventDefault();
    event.stopPropagation();
    eraseDrawing(drawingId);
    return;
  }
  if (currentTool !== "select") return;
  event.preventDefault();
  event.shiftKey ? toggleDrawingSelection(drawingId) : selectOnlyDrawing(drawingId);
  renderCanvas();
}

function distanceToSegment(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  const t = clamp(((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / lengthSquared, 0, 1);
  const projection = [start[0] + t * dx, start[1] + t * dy];
  return Math.hypot(point[0] - projection[0], point[1] - projection[1]);
}

function nearestSegmentIndex(points, point) {
  let nearest = 0;
  let nearestDistance = Infinity;
  for (let index = 0; index < points.length - 1; index++) {
    const distance = distanceToSegment(point, points[index], points[index + 1]);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = index;
    }
  }
  return nearest;
}

function visibleCurvePoint(points, insertAfter, point) {
  const start = points[insertAfter];
  const end = points[insertAfter + 1];
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const length = Math.hypot(dx, dy);
  if (length < 1) return point;
  const distance = distanceToSegment(point, start, end);
  if (distance > 12) return point;
  const normal = [-dy / length, dx / length];
  const direction = insertAfter % 2 ? -1 : 1;
  const bend = clamp(length * .24, 34, 72);
  return [
    clamp(point[0] + normal[0] * bend * direction, 0, CANVAS_WIDTH),
    clamp(point[1] + normal[1] * bend * direction, 0, CANVAS_HEIGHT)
  ];
}

function addLinePoint(event) {
  const path = event.target.closest("[data-drawing-id]");
  if (!path) return;
  const page = getPage();
  const drawing = (page.drawings || []).find(item => item.id === path.dataset.drawingId);
  if (!drawing || drawing.kind !== "line") return;
  event.preventDefault();
  event.stopPropagation();
  pushHistory();
  const point = drawingPoint(event);
  const insertAfter = nearestSegmentIndex(drawing.points, point);
  drawing.points.splice(insertAfter + 1, 0, visibleCurvePoint(drawing.points, insertAfter, point));
  selectOnlyDrawing(drawing.id);
  getBoard().updatedAt = Date.now();
  saveData(true);
  renderCanvas();
  showToast("Curve point added");
}

function circleIntersectsRect(point, radius, rect) {
  const closestX = clamp(point.x, rect.x, rect.x + rect.width);
  const closestY = clamp(point.y, rect.y, rect.y + rect.height);
  return Math.hypot(point.x - closestX, point.y - closestY) <= radius;
}

function drawingIntersectsCircle(drawing, point, radius) {
  if (!drawing.points?.length) return false;
  const asArrayPoint = [point.x, point.y];
  for (let index = 0; index < drawing.points.length - 1; index++) {
    if (distanceToSegment(asArrayPoint, drawing.points[index], drawing.points[index + 1]) <= radius + (drawing.size || 3) / 2) return true;
  }
  return false;
}

function eraseAtPoint(point) {
  const page = getPage();
  if (!page) return;
  const radius = eraserSize / 2;
  const noteIds = new Set(page.notes.filter(note => circleIntersectsRect(point, radius, noteRect(note))).map(note => note.id));
  const textIds = new Set((page.texts || []).filter(text => circleIntersectsRect(point, radius, textRect(text))).map(text => text.id));
  const drawingIds = new Set((page.drawings || []).filter(drawing => drawingIntersectsCircle(drawing, point, radius)).map(drawing => drawing.id));
  if (!noteIds.size && !textIds.size && !drawingIds.size) return;
  if (!eraserState?.historyPushed) {
    pushHistory();
    if (eraserState) eraserState.historyPushed = true;
  }
  page.notes = page.notes.filter(note => !noteIds.has(note.id));
  page.texts = (page.texts || []).filter(text => !textIds.has(text.id));
  page.drawings = (page.drawings || []).filter(drawing => !drawingIds.has(drawing.id));
  page.connections = page.connections.filter(pair => !pair.some(id => noteIds.has(id)));
  page.groups = [];
  noteIds.forEach(id => selectedNoteIds.delete(id));
  textIds.forEach(id => selectedTextIds.delete(id));
  drawingIds.forEach(id => selectedDrawingIds.delete(id));
  syncPrimarySelection();
  getBoard().updatedAt = Date.now();
  saveData(true);
  renderCanvas();
}

function startEraser(event) {
  if (currentTool !== "eraser" || event.button !== 0) return;
  event.preventDefault();
  eraserState = { historyPushed: false };
  $("#ideaCanvas").setPointerCapture(event.pointerId);
  eraseAtPoint(canvasPoint(event));
  moveToolCursor(event);
}

function continueEraser(event) {
  if (!eraserState) return;
  eraseAtPoint(canvasPoint(event));
  moveToolCursor(event);
}

function finishEraser() {
  eraserState = null;
}

function updateToolCursorSize() {
  const cursor = $("#toolCursor");
  if (!cursor) return;
  const active = currentTool === "pen" || currentTool === "eraser";
  const size = currentTool === "eraser" ? eraserSize : penSize;
  cursor.style.width = `${size}px`;
  cursor.style.height = `${size}px`;
  cursor.style.borderColor = currentTool === "pen" ? inkColor : "rgba(36,35,31,.78)";
  if (!active) cursor.hidden = true;
}

function moveToolCursor(event) {
  const cursor = $("#toolCursor");
  if (!cursor || !["pen", "eraser"].includes(currentTool)) return;
  const point = canvasPoint(event);
  cursor.hidden = false;
  cursor.style.left = `${point.x}px`;
  cursor.style.top = `${point.y}px`;
  updateToolCursorSize();
}

function hideToolCursor() {
  const cursor = $("#toolCursor");
  if (cursor) cursor.hidden = true;
}

function drawingPoint(event) {
  const rect = $("#ideaCanvas").getBoundingClientRect();
  return [
    clamp((event.clientX - rect.left) / zoom, 0, CANVAS_WIDTH),
    clamp((event.clientY - rect.top) / zoom, 0, CANVAS_HEIGHT)
  ];
}

function snapOrthogonalPoint(start, point) {
  const dx = point[0] - start[0];
  const dy = point[1] - start[1];
  return Math.abs(dx) >= Math.abs(dy) ? [point[0], start[1]] : [start[0], point[1]];
}

function startDrawing(event) {
  if (!["pen", "connector"].includes(currentTool) || event.button !== 0) return;
  if (event.target.closest(".canvas-note, .canvas-text, [data-drawing-id]")) return;
  event.preventDefault();
  pushHistory();
  const point = drawingPoint(event);
  const drawing = currentTool === "connector"
    ? { id: uid("line"), kind: "line", color: "#2e92a6", opacity: 1, size: 4, gradient: "none", points: [point, point] }
    : { id: uid("doodle"), kind: "ink", color: inkColor, opacity: inkOpacity, size: penSize, gradient: inkGradient, points: [point] };
  getPage().drawings ||= [];
  getPage().drawings.push(drawing);
  activeDrawing = drawing;
  $("#ideaCanvas").setPointerCapture(event.pointerId);
  drawConnections();
}

function continueDrawing(event) {
  if (!activeDrawing) return;
  const point = drawingPoint(event);
  if (activeDrawing.kind === "line") {
    const start = activeDrawing.points[0];
    activeDrawing.points[activeDrawing.points.length - 1] = event.shiftKey ? snapOrthogonalPoint(start, point) : point;
    drawConnections();
    return;
  }
  const previous = activeDrawing.points[activeDrawing.points.length - 1];
  if (Math.hypot(point[0] - previous[0], point[1] - previous[1]) < 2) return;
  activeDrawing.points.push(point);
  drawConnections();
}

function finishDrawing() {
  if (!activeDrawing) return;
  const [first, last] = [activeDrawing.points[0], activeDrawing.points[activeDrawing.points.length - 1]];
  if (activeDrawing.points.length < 2 || Math.hypot(first[0] - last[0], first[1] - last[1]) < 3) {
    getPage().drawings = getPage().drawings.filter(drawing => drawing !== activeDrawing);
  } else if (activeDrawing.kind === "line") {
    selectOnlyDrawing(activeDrawing.id);
  }
  activeDrawing = null;
  getBoard().updatedAt = Date.now();
  saveData(true);
  renderCanvas();
}

function applyZoom(nextZoom) {
  zoom = Math.max(.6, Math.min(1.3, nextZoom));
  $("#ideaCanvas").style.transform = `scale(${zoom})`;
  $("#zoomLabel").textContent = `${Math.round(zoom * 100)}%`;
}

function helperReplyFor(message) {
  const text = message.toLowerCase();
  if (/shortcut|ctrl|undo|redo|keyboard|hotkey/.test(text)) {
    return "Shortcuts: Ctrl+Z undo, Ctrl+Y or Ctrl+Shift+Z redo, Ctrl+K jumps to search, Ctrl+Enter adds a captured note, Ctrl+S saves, Ctrl++ / Ctrl+- zoom, Delete removes selected items, Esc deselects.";
  }
  if (/priority|important|random|maybe/.test(text)) {
    return "Use the little priority dot on a note to cycle it between Important, Normal, and Maybe. Maybe is for random ideas that might be useful later.";
  }
  if (/select|multi|box|shift/.test(text)) {
    return "Use the select tool to click notes, text, lines, or drawings. Shift-click adds more items, and dragging on empty paper draws a selection box.";
  }
  if (/erase|eraser|delete|remove/.test(text)) {
    return "Pick the eraser tool, choose its size, then drag the eraser circle over notes, text, lines, or drawings. You can also select items and press Delete.";
  }
  if (/search|find/.test(text)) {
    return "Use the Find idea box in the scratchpad toolbar to highlight matching notes and dim the rest.";
  }
  if (/circle|sort|category|categories/.test(text)) {
    return "Circle sort groups notes by category, places related ideas around a labeled circle, and keeps similar-idea connectors between the strongest matches.";
  }
  if (/share|link|url|send/.test(text)) {
    return "Open a scratchpad and press Share. The address changes to include the scratchpad and page, so the copied link can reopen that exact page on the same saved data.";
  }
  if (/organize|connect|similar|line|arrow|thread/.test(text)) {
    return "Connect ideas finds notes with shared words or themes. The line tool is separate: drag to draw a straight line, hold Shift to snap it, and double-click a line to add a curve point.";
  }
  if (/doodle|draw|sketch|icon/.test(text)) {
    return "Doodles are generated from note text. Try words like pizza, snake, song, poster, deadline, vote, or costume and the note sketch will change automatically.";
  }
  if (/note|text box|textbox|sticky|post|card|paper|bubble/.test(text)) {
    return "Use the note button for sticky notes, or the text button for plain text without paper behind it. Double-clicking empty canvas still drops a quick note.";
  }
  if (/page|slide|new/.test(text)) {
    return "Use the page rail on the left to add or switch pages. Each page has its own notes, doodles, connections, undo stack, and share URL.";
  }
  if (/close|open|assistant|helper|chat/.test(text)) {
    return "Close me with the X whenever you want more canvas. The Open idea helper button brings me back.";
  }
  return "Try asking about share links, shortcuts, organizing similar notes, doodles, pages, or adding notes. I am here as the built-in feature guide while you brainstorm.";
}

function addHelperMessage(role, text) {
  const messages = $("#helperMessages");
  messages.insertAdjacentHTML("beforeend", `<p class="chat-message ${role}">${escapeHtml(text)}</p>`);
  messages.scrollTop = messages.scrollHeight;
}

function askHelper(message) {
  const text = message.trim();
  if (!text) return;
  addHelperMessage("user", text);
  addHelperMessage("bot", helperReplyFor(text));
}

function syncToolButtons() {
  $$(".tool-button[data-tool]").forEach(button => {
    button.classList.toggle("active", button.dataset.tool === currentTool);
  });
  updateContextOptions();
}

function setTool(tool) {
  currentTool = tool;
  hideToolCursor();
  syncToolButtons();
  renderCanvas();
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
    const editorOpen = !$("#editorView").hidden;
    const key = event.key.toLowerCase();
    const command = event.metaKey || event.ctrlKey;
    const activeTag = document.activeElement?.tagName;

    if (command && key === "k") {
      event.preventDefault();
      if (editorOpen) $("#editorSearchInput").focus();
      else $("#globalSearch").focus();
      return;
    }
    if (editorOpen && command && key === "z") {
      event.preventDefault();
      event.shiftKey ? redo() : undo();
      return;
    }
    if (editorOpen && command && key === "y") {
      event.preventDefault();
      redo();
      return;
    }
    if (editorOpen && command && key === "s") {
      event.preventDefault();
      saveData(true);
      showToast("Saved on this device");
      return;
    }
    if (editorOpen && command && (event.key === "+" || event.key === "=")) {
      event.preventDefault();
      applyZoom(zoom + .1);
      return;
    }
    if (editorOpen && command && event.key === "-") {
      event.preventDefault();
      applyZoom(zoom - .1);
      return;
    }
    if (editorOpen && command && event.key === "Enter") {
      event.preventDefault();
      $("#editorCaptureForm").requestSubmit();
      return;
    }
    if (event.key === "Escape" && editorOpen && !["INPUT", "TEXTAREA"].includes(activeTag)) {
      clearSelection();
      renderCanvas();
      return;
    }
    if (editorOpen && (selectedNoteIds.size || selectedTextIds.size || selectedDrawingIds.size) && ["Delete", "Backspace"].includes(event.key) && !["INPUT", "TEXTAREA"].includes(activeTag)) {
      event.preventDefault();
      deleteSelectedItems();
    }
  }, true);

  document.addEventListener("beforeinput", event => {
    if ($("#editorView").hidden) return;
    if (event.inputType === "historyUndo") {
      event.preventDefault();
      undo();
    }
    if (event.inputType === "historyRedo") {
      event.preventDefault();
      redo();
    }
  }, true);

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
    clearSelection();
    renderEditor();
    setRoute(currentBoardId, currentPageId);
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
    if (currentTool !== "select" || event.target.closest(".canvas-note, .canvas-text, [data-drawing-id]")) return;
    const rect = $("#ideaCanvas").getBoundingClientRect();
    addNote("New thought…", (event.clientX - rect.left) / zoom - 95, (event.clientY - rect.top) / zoom - 55);
  });
  $("#canvasContent").addEventListener("input", event => {
    const textElement = event.target.closest(".canvas-text");
    if (textElement && event.target.matches(".plain-text")) {
      const text = (getPage().texts || []).find(item => item.id === textElement.dataset.textId);
      if (!text) return;
      text.text = event.target.value;
      resizePlainTextareas(textElement);
      getBoard().updatedAt = Date.now();
      saveData(true);
      return;
    }
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
    resizeNoteTextareas(noteElement);
    getBoard().updatedAt = Date.now();
    saveData(true);
  });
  document.addEventListener("focusin", event => {
    if (event.target.matches(".plain-text")) {
      pushHistory();
      const textElement = event.target.closest(".canvas-text");
      if (currentTool === "select" && textElement) {
        selectOnlyText(textElement.dataset.textId);
        refreshSelectionClasses();
      }
      return;
    }
    if (event.target.matches(".note-text")) {
      pushHistory();
      const noteElement = event.target.closest(".canvas-note");
      if (currentTool === "select" && noteElement) {
        selectOnlyNote(noteElement.dataset.noteId);
        refreshSelectionClasses();
      }
    }
  }, true);
  $("#canvasContent").addEventListener("click", event => {
    const priority = event.target.closest(".note-priority");
    if (priority) {
      cycleNotePriority(priority.closest(".canvas-note").dataset.noteId);
      return;
    }
    const shape = event.target.closest(".note-shape");
    if (shape) {
      cycleNoteVariant(shape.closest(".canvas-note").dataset.noteId);
      return;
    }
    const menu = event.target.closest(".note-menu");
    if (menu) cycleNoteColor(menu.closest(".canvas-note").dataset.noteId);
  });
  $("#canvasContent").addEventListener("pointerdown", handlePointerDown);
  $("#connectionsLayer").addEventListener("pointerdown", handleDrawingPointerDown);
  $("#connectionsLayer").addEventListener("dblclick", addLinePoint);
  $("#ideaCanvas").addEventListener("pointerdown", placeToolItem);
  $("#ideaCanvas").addEventListener("pointerdown", startSelectionBox);
  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp);
  $("#ideaCanvas").addEventListener("pointermove", moveToolCursor);
  $("#ideaCanvas").addEventListener("pointerleave", hideToolCursor);
  $("#ideaCanvas").addEventListener("pointerdown", startEraser);
  $("#ideaCanvas").addEventListener("pointermove", continueEraser);
  window.addEventListener("pointerup", finishEraser);
  $("#ideaCanvas").addEventListener("pointerdown", startDrawing);
  $("#ideaCanvas").addEventListener("pointermove", continueDrawing);
  window.addEventListener("pointerup", finishDrawing);

  $("#organizeButton").addEventListener("click", organizeIdeas);
  $("#circleSortButton").addEventListener("click", circleSortIdeas);
  $("#canvasColorInput").addEventListener("change", event => updatePageBackground({ backgroundColor: event.target.value }));
  $("#canvasGradientInput").addEventListener("change", event => updatePageBackground({ backgroundGradient: event.target.value }));
  $("#noteSizeInput").addEventListener("change", event => applySelectedNoteSize(event.target.value));
  $("#textSizeInput").addEventListener("change", event => applySelectedTextSize(event.target.value));
  $("#inkColorInput").addEventListener("input", event => {
    inkColor = event.target.value;
    updateContextOptions();
  });
  $("#inkOpacityInput").addEventListener("input", event => {
    inkOpacity = Number(event.target.value) / 100;
    updateContextOptions();
  });
  $("#inkGradientInput").addEventListener("change", event => {
    inkGradient = event.target.value;
    updateContextOptions();
  });
  $("#penSizeInput").addEventListener("input", event => {
    penSize = Number(event.target.value);
    updateContextOptions();
  });
  $("#eraserSizeInput").addEventListener("input", event => {
    eraserSize = Number(event.target.value);
    updateContextOptions();
  });
  $("#editorSearchInput").addEventListener("input", event => {
    editorSearchQuery = event.target.value.trim().toLowerCase();
    renderCanvas();
  });
  $("#openInsightPanel").addEventListener("click", () => setInsightPanelOpen(true));
  $("#closeInsightPanel").addEventListener("click", () => setInsightPanelOpen(false));
  $("#helperChatForm").addEventListener("submit", event => {
    event.preventDefault();
    const input = $("#helperChatInput");
    askHelper(input.value);
    input.value = "";
  });
  $(".chat-suggestions").addEventListener("click", event => {
    const prompt = event.target.closest("[data-chat-prompt]");
    if (!prompt) return;
    askHelper(prompt.dataset.chatPrompt);
  });
  $$(".nudge-card").forEach(card => card.addEventListener("click", () => {
    addNote(card.dataset.prompt);
    showToast("Prompt added — bend it however you like");
  }));

  $$(".tool-button[data-tool]").forEach(button => button.addEventListener("click", () => {
    const tool = button.dataset.tool;
    if (tool === "note") {
      setTool("note");
      showToast("Note tool on — click the paper to place one");
      return;
    }
    if (tool === "text") {
      setTool("text");
      showToast("Text tool on — click the paper for plain text");
      return;
    }
    setTool(tool);
    if (tool === "connector") showToast("Drag to draw a line; hold Shift for a 90 degree snap");
    if (tool === "pen") showToast("Drag anywhere on the paper to doodle");
    if (tool === "eraser") showToast("Eraser on — click a note or drawing to remove it");
    if (tool === "select") showToast("Select on — shift-click or drag a box to multi-select");
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
applyRouteFromUrl();
window.addEventListener("popstate", applyRouteFromUrl);
window.addEventListener("hashchange", applyRouteFromUrl);
