#!/bin/bash
# Phone playthrough: emulated 390x844 touch screen, scripted thumb-zone steering and swipe-to-jump,
# then a rotate to landscape mid-run. Screenshots land in $TMPDIR (m_*.png).
set -e
T=${TMPDIR:-/tmp}; D=$(cd "$(dirname "$0")" && pwd)
[ -f "$T/phaser.min.js" ] || curl -sS -o "$T/phaser.min.js" https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js
sed "s#https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js#file://$T/phaser.min.js#" "$D/../index.html" > "$T/mob.html"
python3 -c "import sys;p=sys.argv[1];s=open(p).read().replace('</body>',open(sys.argv[2]).read()+'</body>');open(p,'w').write(s)" "$T/mob.html" "$D/harness_mobile.js"
MOBILE="390,844,3" python3 "$D/cdp.py" "file://$T/mob.html" 2.2:m_steer 3.5:m_jump 5.0:m_butt 8.6:m_wolves 9.0:@resize=844,390,3 10.3:m_landscape 13.4:m_over
