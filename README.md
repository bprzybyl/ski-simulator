# Ski Simulator

A SkiFree-style downhill skiing game for the browser. Outski a pack of dire wolves, eat apples for energy, and deal with the consequences (his butt gets bigger with every apple).

## Play

### ▶ [Play in your browser](https://bprzybyl.github.io/ski-simulator/)

Works on phones, tablets, and computers: the game fills any screen, upright or sideways. Every screen shows the same distance down the slope, so scores are fair across devices.

On a phone, use **Add to Home Screen** to get an app icon that opens fullscreen.

Or run it locally: open `index.html` in a browser. There's no build step; it loads Phaser 3 from a CDN, so the first load needs an internet connection.

| Key | Action |
| --- | --- |
| ← → | Steer |
| ↓ | Tuck (straighten and speed up) |
| ↑ | Brake |
| Space | Jump |
| P / Esc | Pause |
| M | Mute |

**On touch screens:** hold the left or right half of the screen to steer, let go to straighten out, and swipe up to jump. The icons in the top-right corner toggle sound, pause, and fullscreen (fullscreen isn't available on iPhone; use Add to Home Screen instead).

Pick **Easy**, **Normal**, or **Hard** on the title screen (keys 1/2/3). Difficulty changes the wolves' speed, and each mode keeps its own best score.

## Tweaking

All gameplay numbers (speeds, wolf distance, apple size, butt growth) live in the `TUNING` and `DIFFICULTIES` objects at the top of `index.html`.

## Testing

`test/run.sh` runs a scripted headless-Chromium playthrough on a desktop-sized screen, and `test/run_mobile.sh` does the same on an emulated phone with touch gestures and a mid-run rotation. Both save screenshots to `$TMPDIR` and need only `chromium`, `python3`, and `curl`.
