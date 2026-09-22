<script>
window.__errors = [];
window.addEventListener('error', e => { window.__errors.push(String(e.message)); console.error('PAGEERROR ' + e.message + ' @' + e.lineno); });
const cv = () => document.querySelector('canvas');
let tid = 1;
// Synthetic touch gesture: points are fractions of the screen [fx, fy]
const touch = (type, id, fx, fy) => {
  const t = new Touch({ identifier: id, target: cv(), clientX: fx * innerWidth, clientY: fy * innerHeight, pageX: fx * innerWidth, pageY: fy * innerHeight, screenX: fx * innerWidth, screenY: fy * innerHeight });
  const list = type === 'touchend' ? [] : [t];
  cv().dispatchEvent(new TouchEvent(type, { bubbles: true, cancelable: true, touches: list, targetTouches: list, changedTouches: [t] }));
};
const gs = () => game.scene.getScene('Game');
const active = () => game.scene.getScenes(true).map(s => s.sys.settings.key).join(',');
const log = m => console.log('STEP ' + m);
const at = (ms, fn) => setTimeout(() => { try { fn(); } catch (e) { console.error('PAGEERROR harness ' + e.stack); } }, ms);
TUNING.wolfArriveMs = 6000;
at(700, () => { log('title ' + active() + ' touch=' + game.device.input.touch + ' canvas=' + cv().width + 'x' + cv().height + ' css=' + innerWidth + 'x' + innerHeight);
  const id = tid++; touch('touchstart', id, 0.5, 0.85); setTimeout(() => touch('touchend', id, 0.5, 0.85), 50); });
at(1400, () => { log('started ' + active() + ' viewW=' + Math.round(gs().view.w) + ' zoom=' + View.worldZoom.toFixed(2)); });
at(1600, () => { this.hold = tid++; touch('touchstart', this.hold, 0.85, 0.7); });
at(2300, () => { log('holding right: heading=' + gs().sk.heading.toFixed(2) + ' touchUsed=' + gs().touchUsed); touch('touchend', this.hold, 0.85, 0.7); });
at(3100, () => log('released (auto-straighten): heading=' + gs().sk.heading.toFixed(2)));
at(3300, () => { const id = tid++; touch('touchstart', id, 0.5, 0.8);
  setTimeout(() => touch('touchmove', id, 0.5, 0.74), 30); setTimeout(() => touch('touchmove', id, 0.5, 0.66), 60);
  setTimeout(() => { log('swipe up: air=' + gs().isAir() + ' heading=' + gs().sk.heading.toFixed(2)); touch('touchend', id, 0.5, 0.66); }, 90); });
at(3800, () => { const g = gs(), s = g.sk; s.heading = 0; g.addObj('apple', s.x + 30, s.y + 90); });
at(4600, () => { const g = gs(), s = g.sk; log('apple state=' + s.state); });
at(8200, () => { const g = gs(); g.gap = 120; log('wolves close, onScreen=' + g.wolvesOnScreen()); });
at(10500, () => log('after rotate: ' + active() + ' canvas=' + cv().width + 'x' + cv().height + ' viewW=' + Math.round(gs().view.w)));
at(11000, () => { gs().gap = 0; });
at(13200, () => log('DONE errors=' + window.__errors.length + ' scenes=' + active()));
</script>
