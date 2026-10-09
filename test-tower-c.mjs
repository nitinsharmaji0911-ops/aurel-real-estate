import { spawn } from 'child_process';

async function testTowerC() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9777',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000'
  ]);

  let targets = null;
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 500));
    try {
      const res = await fetch('http://127.0.0.1:9777/json');
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
  await new Promise((r) => setTimeout(r, 2000));

  // Click Enter
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Explore 3D Development'));
      if (btn) btn.click();
    })()`
  });

  await new Promise((r) => setTimeout(r, 1500));

  // Click Tower C
  const clickTowerC = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Tower C'));
      if (btn) {
        btn.click();
        return 'Clicked Tower C successfully';
      }
      return 'Tower C button not found';
    })()`,
    returnByValue: true
  });
  console.log('Result:', clickTowerC.result?.value);

  await new Promise((r) => setTimeout(r, 1000));

  // Click Floor 11
  const clickFloor11 = await send('Runtime.evaluate', {
    expression: `(() => {
      const f11 = document.querySelector('[data-floor="11"]');
      if (f11) {
        f11.click();
        return 'Clicked Floor 11 on Tower C';
      }
      return 'Floor 11 button not found';
    })()`,
    returnByValue: true
  });
  console.log('Result:', clickFloor11.result?.value);

  await new Promise((r) => setTimeout(r, 1000));

  // Check units on Floor 11 of Tower C
  const unitsCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const units = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Unit 11'));
      return {
        count: units.length,
        names: units.map(u => u.textContent.slice(0, 25))
      };
    })()`,
    returnByValue: true
  });
  console.log('Tower C Floor 11 Units:', unitsCheck.result?.value);

  ws.close();
  chromeProc.kill();
  console.log('Test Tower C & Floor 11 complete!');
}

testTowerC().catch(console.error);
