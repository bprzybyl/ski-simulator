# Ski Simulator

A SkiFree-style downhill skiing game for the browser. Outski a pack of dire wolves, eat apples for energy, and deal with the consequences (his butt gets bigger with every apple).

## Play

### ▶ [Play in your browser](https://bprzybyl.github.io/ski-simulator/)

Or run it locally: open `index.html` in a browser. It's a single file with no build step; it loads Phaser 3 from a CDN, so the first load needs an internet connection.

| Key | Action |
| --- | --- |
| ← → | Steer |
| ↓ | Tuck (straighten and speed up) |
| ↑ | Brake |
| Space | Jump |
| P / Esc | Pause |
| M | Mute |

On touch screens, on-screen ◀ ▶ and JUMP buttons appear.

Pick **Easy**, **Normal**, or **Hard** on the title screen (keys 1/2/3). Difficulty changes the wolves' speed, and each mode keeps its own best score.

## Tweaking

All gameplay numbers (speeds, wolf distance, apple size, butt growth) live in the `TUNING` and `DIFFICULTIES` objects at the top of `index.html`.

## Testing

`test/run.sh` runs a scripted headless-Chromium playthrough and saves screenshots to `$TMPDIR`. It needs only `chromium`, `python3`, and `curl`.
