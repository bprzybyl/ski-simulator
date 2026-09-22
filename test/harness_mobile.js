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
at(1600, () => { this.hold = tid++; touch('touchstart', this.hold, 0.75, 0.75);
  setTimeout(() => touch('touchmove', this.hold, 0.82, 0.77), 40); setTimeout(() => touch('touchmove', this.hold, 0.97, 0.8), 80); });
at(2300, () => { const g = gs(); log('stick pulled right: heading=' + g.sk.heading.toFixed(2) + ' stick=' + JSON.stringify(g.touchInput)); });
at(2350, () => { touch('touchmove', this.hold, 0.97, 0.62); });
at(2800, () => { const g = gs(); log('stick pulled up (brake): speed=' + Math.round(g.sk.speed) + ' heading=' + g.sk.heading.toFixed(2)); touch('touchend', this.hold, 0.97, 0.62); });
at(3400, () => log('released (auto-straighten): heading=' + gs().sk.heading.toFixed(2) + ' stick=' + gs().touchInput));
at(3450, () => { const id = tid++; touch('touchstart', id, 0.2, 0.6); setTimeout(() => { log('tap left: air=' + gs().isAir()); touch('touchend', id, 0.2, 0.6); }, 60); });
at(3800, () => { const g = gs(), s = g.sk; s.heading = 0; g.addObj('apple', s.x + 30, s.y + 90); });
at(4600, () => { const g = gs(), s = g.sk; log('apple state=' + s.state); });
at(8200, () => { const g = gs(); g.gap = 120; log('wolves close, onScreen=' + g.wolvesOnScreen()); });
at(10500, () => log('after rotate: ' + active() + ' canvas=' + cv().width + 'x' + cv().height + ' viewW=' + Math.round(gs().view.w)));
at(11000, () => { gs().gap = 0; });
at(13200, () => log('DONE errors=' + window.__errors.length + ' scenes=' + active()));
</script>
