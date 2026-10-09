import { spawn } from 'child_process';

async function testBrowserLoader() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9666',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000'
  ]);

  let targets = null;
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 500));
    try {
      const res = await fetch('http://127.0.0.1:9666/json');
      targets = await res.json();
      if (targets && targets.length > 0) break;
    } catch (e) {}
  }
  if (!targets) {
    chromeProc.kill();
    return;
  }
  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  const consoleLogs = [];
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.consoleAPICalled') {
      const msg = data.params.args.map((a) => a.value || a.description || '').join(' ');
      consoleLogs.push(msg);
      console.log('[Browser Console]:', msg);
    }
    if (data.method === 'Runtime.exceptionThrown') {
      console.error('[Browser Exception]:', data.params.exceptionDetails);
    }
  };

  let msgId = 1;
  const send = (method, params = {}) =>
    new Promise((res) => {
      const id = msgId++;
      const handler = (event) => {
        const d = JSON.parse(event.data);
        if (d.id === id) {
          ws.removeEventListener('message', handler);
          res(d.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

  await send('Runtime.enable');
  await send('Page.enable');
  await new Promise((r) => setTimeout(r, 2000));

  // Check what happened on page
  const evalResult = await send('Runtime.evaluate', {
    expression: `(async () => {
      try {
        const res = await fetch('/models/japanese_building__cc0.glb');
        const buf = await res.arrayBuffer();
        return { success: true, byteLength: buf.byteLength };
      } catch (err) {
        return { success: false, error: err.message };
      }
    })()`,
    awaitPromise: true,
    returnByValue: true
  });

  console.log('Fetch from browser:', evalResult.result?.value);
  ws.close();
  chromeProc.kill();
}

testBrowserLoader().catch(console.error);
