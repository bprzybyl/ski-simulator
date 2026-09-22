import subprocess, os, json, base64, time, sys, threading
url, shots = sys.argv[1], [(float(a.split(':')[0]), a.split(':')[1]) for a in sys.argv[2:]]
r1, w1 = os.pipe(); r2, w2 = os.pipe()
def pre(): os.dup2(r1, 3); os.dup2(w2, 4)
p = subprocess.Popen(['chromium', '--headless', '--no-sandbox', '--remote-debugging-pipe', '--disable-gpu',
  '--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required', '--window-size=1000,750', 'about:blank'],
  preexec_fn=pre, close_fds=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
os.close(r1); os.close(w2)
out = os.fdopen(w1, 'wb'); inp = os.fdopen(r2, 'rb')
mid = [0]; pending = {}; lock = threading.Lock()
def reader():
    buf = b''
    while True:
        ch = inp.read1(65536) if hasattr(inp, 'read1') else inp.read(1)
        if not ch: return
        buf += ch
        while b'\0' in buf:
            msg, buf = buf.split(b'\0', 1); m = json.loads(msg)
            if 'id' in m and m['id'] in pending: pending[m['id']].append(m)
            meth = m.get('method')
            if meth == 'Runtime.consoleAPICalled':
                args = ' '.join(str(a.get('value', a.get('description', ''))) for a in m['params']['args'])
                if 'Phaser v' not in args: print(f"[{m['params']['type']}] {args}", flush=True)
            elif meth == 'Runtime.exceptionThrown':
                d = m['params']['exceptionDetails']; print('[EXCEPTION]', d.get('exception', {}).get('description', d.get('text')), flush=True)
threading.Thread(target=reader, daemon=True).start()
def send(method, params=None, sid=None):
    with lock:
        mid[0] += 1; i = mid[0]; pending[i] = []
        m = {'id': i, 'method': method, 'params': params or {}}
        if sid: m['sessionId'] = sid
        out.write(json.dumps(m).encode() + b'\0'); out.flush()
    t = time.time()
    while not pending[i]:
        if time.time() - t > 20: raise RuntimeError('timeout ' + method)
        time.sleep(0.01)
    r = pending.pop(i)[0]
    if 'error' in r: raise RuntimeError(str(r['error']))
    return r.get('result', {})
tid = send('Target.createTarget', {'url': 'about:blank'})['targetId']
sid = send('Target.attachToTarget', {'targetId': tid, 'flatten': True})['sessionId']
send('Runtime.enable', sid=sid); send('Page.enable', sid=sid)
send('Emulation.setFocusEmulationEnabled', {'enabled': True}, sid=sid)
def emulate(spec):  # "w,h,dpr" → phone-like touch screen
    w, h, d = [float(v) for v in spec.split(',')]
    send('Emulation.setDeviceMetricsOverride', {'width': int(w), 'height': int(h), 'deviceScaleFactor': d, 'mobile': True}, sid=sid)
    send('Emulation.setTouchEmulationEnabled', {'enabled': True, 'maxTouchPoints': 5}, sid=sid)
if os.environ.get('MOBILE'): emulate(os.environ['MOBILE'])
t0 = time.time(); send('Page.navigate', {'url': url}, sid=sid)
for at, name in shots:
    while time.time() - t0 < at: time.sleep(0.02)
    if name.startswith('@resize='):  # e.g. 6:@resize=844,390,3 rotates the emulated phone
        emulate(name.split('=', 1)[1]); print('[resize]', name, flush=True); continue
    data = send('Page.captureScreenshot', {'format': 'png'}, sid=sid)['data']
    open(os.path.join(os.environ['TMPDIR'], name + '.png'), 'wb').write(base64.b64decode(data))
    print('[shot]', name, round(time.time() - t0, 1), flush=True)
p.kill()
