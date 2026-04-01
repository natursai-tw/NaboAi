// ─── Creative Editor Bridge ───────────────────────────────────────────────────
// Lightweight singleton bridge so HistoryPanel (sibling column) can push items
// into CreativeEditorPage's canvas without prop drilling through App.tsx.

export interface CanvasAddPayload {
  type: 'chat-bot' | 'chat-user' | 'image-block';
  content: string;
  label?: string;
  imageUrl?: string;
}

type AddHandler = (payload: CanvasAddPayload) => void;
type ActiveListener = (active: boolean) => void;
type TouchDropHandler = (clientX: number, clientY: number, payload: CanvasAddPayload) => void;

let _handler: AddHandler | null = null;
const _listeners = new Set<ActiveListener>();

/** Called by CreativeEditorPage on mount to register its add handler. */
export function registerCanvasHandler(fn: AddHandler): void {
  _handler = fn;
  _listeners.forEach(l => l(true));
}

/** Called by CreativeEditorPage on unmount. */
export function unregisterCanvasHandler(): void {
  _handler = null;
  _listeners.forEach(l => l(false));
}

/** Called from HistoryPanel (素材庫) to add an item to the canvas. */
export function addToCanvas(payload: CanvasAddPayload): void {
  _handler?.(payload);
}

/**
 * Subscribe to canvas active/inactive changes.
 * Immediately calls listener with current state.
 * Returns an unsubscribe function.
 */
export function subscribeCanvasActive(listener: ActiveListener): () => void {
  _listeners.add(listener);
  listener(_handler !== null); // notify current state right away
  return () => { _listeners.delete(listener); };
}

// ── Touch drag coordination ──────────────────────────────────────────────────
// Used to bridge touch-drag from ChatArea → CreativeEditorPage
// without relying on HTML5 drag API (which tablets don't support).

let _touchDropHandler: TouchDropHandler | null = null;
let _pendingTouchPayload: CanvasAddPayload | null = null;

/** Called by CreativeEditorPage on mount to receive touch-drop events. */
export function registerTouchDropHandler(fn: TouchDropHandler): void {
  _touchDropHandler = fn;
}

/** Called by CreativeEditorPage on unmount. */
export function unregisterTouchDropHandler(): void {
  _touchDropHandler = null;
}

/** Called when a chat message touch-drag begins. */
export function startTouchDrag(payload: CanvasAddPayload): void {
  _pendingTouchPayload = payload;
}

/**
 * Called on touchend with the final finger position.
 * Returns true if the drop was handled by the canvas.
 */
export function commitTouchDrop(clientX: number, clientY: number): boolean {
  if (!_pendingTouchPayload || !_touchDropHandler) {
    _pendingTouchPayload = null;
    return false;
  }
  const payload = _pendingTouchPayload;
  _pendingTouchPayload = null;
  _touchDropHandler(clientX, clientY, payload);
  return true;
}

/** Called to cancel an in-progress touch drag without dropping. */
export function cancelTouchDrag(): void {
  _pendingTouchPayload = null;
}

/** Returns true if the canvas is currently mounted and active. */
export function isCanvasActive(): boolean {
  return _handler !== null;
}
