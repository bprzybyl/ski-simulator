<script>
window.__errors = [];
window.addEventListener('error', e => { window.__errors.push(String(e.message)); console.error('PAGEERROR ' + e.message + ' @' + e.lineno); });
const key = (type, code) => { const ev = new KeyboardEvent(type, { bubbles: true, cancelable: true });
  Object.defineProperty(ev, 'keyCode', { get: () => code }); Object.defineProperty(ev, 'which', { get: () => code }); window.dispatchEvent(ev); };
const tap = code => { key('keydown', code); setTimeout(() => key('keyup', code), 60); };
const gs = () => game.scene.getScene('Game');
const active = () => game.scene.getScenes(true).map(s => s.sys.settings.key).join(',');
const log = m => console.log('STEP ' + m);
const SCEN = new URLSearchParams(location.search).get('s') || 'full';
TUNING.wolfArriveMs = 7000;
const at = (ms, fn) => setTimeout(() => { try { fn(); } catch (e) { console.error('PAGEERROR harness ' + e.stack); } }, ms);
at(500, () => tap(49));
at(800, () => { log('title ' + active() + ' picked=' + game.scene.getScene('Title').diff); tap(32); });
at(1300, () => { log('started ' + active() + ' diff=' + gs().difficultyKey); key('keydown', 40); });
at(2500, () => { key('keyup', 40); key('keydown', 37); });
at(3000, () => { key('keyup', 37); key('keydown', 39); });
at(3400, () => { key('keyup', 39); tap(32); log('jump air=' + gs().isAir()); });
at(4200, () => { const g = gs(), s = g.sk; log('pos ' + Math.round(s.x) + ',' + Math.round(s.y) + ' speed ' + Math.round(s.speed) + ' objs ' + g.objs.length);
  s.heading = 0; g.addObj('apple', s.x + 45, s.y + 70); });
at(4700, () => log('apple (offset 45px) state=' + gs().sk.state + ' apples=' + gs().apples));
if (SCEN === 'butt') at(5700, () => log('mid-realize butt=' + gs().sk.butt));
at(6400, () => { const s = gs().sk; log('after apple state=' + s.state + ' butt=' + s.butt + ' energy=' + Math.round(s.energy) + ' boost=' + (gs().elapsed < s.boostUntil)); });
at(7000, () => { const g = gs(), s = g.sk; const o = g.addObj('tree', s.x, s.y); g.crash(o, 0); log('crash state=' + s.state); });
at(8300, () => { const g = gs(); log('recovered state=' + g.sk.state + ' wolves=' + g.wolvesActive + ' gap=' + Math.round(g.gap) + ' wolfSpeed=' + Math.round(g.wolfSpeed)); });
if (SCEN === 'wolves') at(9000, () => { gs().gap = 150; log('wolves close'); });
if (SCEN === 'full') {
  at(9000, () => { gs().gap = 150; log('wolves close'); });
  at(10500, () => { gs().gap = 0; });
  at(12600, () => { log('after catch ' + active()); });
  at(13400, () => { tap(32); }); at(13800, () => { tap(32); });
  at(14000, () => { log('restart diff=' + gs().difficultyKey + ' bestEasy=' + Store.get('best_easy', 0) + ' ' + active() + ' state=' + gs().sk.state + ' elapsed=' + Math.round(gs().elapsed)); tap(80); });
  at(14400, () => { log('paused ' + active()); tap(80); });
  at(14800, () => { log('resumed ' + active()); key('keydown', 40); });
}
at(SCEN === 'full' ? 17000 : SCEN === 'butt' ? 5750 : 9400, () => log('DONE errors=' + window.__errors.length + ' scenes=' + active()));
</script>
