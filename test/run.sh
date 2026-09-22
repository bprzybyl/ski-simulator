#!/bin/bash
# Scripted headless playthrough (no pip/node needed). Screenshots land in $TMPDIR.
set -e
T=${TMPDIR:-/tmp}; D=$(cd "$(dirname "$0")" && pwd)
[ -f "$T/phaser.min.js" ] || curl -sS -o "$T/phaser.min.js" https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js
sed "s#https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js#file://$T/phaser.min.js#" "$D/../index.html" > "$T/test.html"
python3 -c "import sys;p=sys.argv[1];s=open(p).read().replace('</body>',open(sys.argv[2]).read()+'</body>');open(p,'w').write(s)" "$T/test.html" "$D/harness.js"
python3 "$D/cdp.py" "file://$T/test.html?s=full" ${SHOTS:-0.7:title 3.2:skiing 5.9:butt 9.6:wolves 13.2:gameover 17.4:restart}
