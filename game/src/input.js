// Input: mouse clicks on either picture, plus a keyboard way to play the whole
// game — arrow keys move a crosshair, Enter marks the spot, Tab switches
// pictures, H asks for a hint. No pointer ever has to leave the keyboard.
export class Input {
  constructor(canvasA, canvasB, handlers) {
    this.handlers = handlers;
    this.canvases = { A: canvasA, B: canvasB };
    canvasA.addEventListener('click', (e) => this.pickFromEvent('A', e));
    canvasB.addEventListener('click', (e) => this.pickFromEvent('B', e));
    canvasA.addEventListener('mousemove', (e) => this.hoverFromEvent('A', e));
    canvasB.addEventListener('mousemove', (e) => this.hoverFromEvent('B', e));
    window.addEventListener('keydown', (e) => this.onKey(e));
  }

  canvasPoint(panel, event) {
    const rect = this.canvases[panel].getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 560,
      y: ((event.clientY - rect.top) / rect.height) * 560,
    };
  }

  pickFromEvent(panel, event) {
    const p = this.canvasPoint(panel, event);
    this.handlers.onPick(panel, p.x, p.y);
  }

  hoverFromEvent(panel, event) {
    const p = this.canvasPoint(panel, event);
    this.handlers.onHover(panel, p.x, p.y);
  }

  onKey(event) {
    const key = event.key;
    if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
      this.handlers.onMove(key.slice(5).toLowerCase());
      return;
    }
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      this.handlers.onConfirm();
      return;
    }
    if (key === 'Tab') {
      event.preventDefault();
      this.handlers.onSwitchPanel();
      return;
    }
    const lower = key.toLowerCase();
    if (lower === 'h') this.handlers.onHint();
    if (lower === 'm') this.handlers.onMute();
    if (lower === 'r') this.handlers.onRestart();
    if (lower === 'escape') this.handlers.onMenu();
  }
}
