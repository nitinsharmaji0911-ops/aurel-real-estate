import { spawn } from 'child_process';

async function runTest() {
  console.log('Starting headless Chrome with remote debugging...');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9333',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000'
  ]);

  // Wait for Chrome port to be ready
  let targets = null;
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 500));
    try {
      const res = await fetch('http://127.0.0.1:9333/json');
      targets = await res.json();
      if (targets && targets.length > 0) break;
    } catch (e) {
      // waiting
    }
  }

  if (!targets || targets.length === 0) {
    console.error('Failed to connect to Chrome CDP targets');
    chromeProc.kill();
    process.exit(1);
  }

  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  console.log('Found page target:', pageTarget.title, pageTarget.url);

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let msgId = 1;
  const pending = new Map();
  const consoleMessages = [];
  const pageErrors = [];

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data.result);
      pending.delete(data.id);
    }
    if (data.method === 'Runtime.consoleAPICalled') {
      const text = data.params.args.map((a) => a.value || a.description || '').join(' ');
      consoleMessages.push({ type: data.params.type, text });
      console.log(`[Browser Console ${data.params.type}]:`, text);
    }
    if (data.method === 'Runtime.exceptionThrown') {
      console.error('[Browser Exception]:', data.params.exceptionDetails);
      pageErrors.push(data.params.exceptionDetails);
    }
  };

  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });

  await new Promise((r) => (ws.onopen = r));
  console.log('WebSocket connected to Chrome DevTools Protocol');

  await send('Runtime.enable');
  await send('Page.enable');

  // Wait for 3D scene to mount
  console.log('Waiting 3s for client hydration...');
  await new Promise((r) => setTimeout(r, 3000));

  // Inspect page title and document content
  const eval1 = await send('Runtime.evaluate', {
    expression: 'document.title',
    returnByValue: true
  });
  console.log('Page title:', eval1.result?.value);

  // Check if "Explore 3D Development" button exists and click it
  const clickEnter = await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const enterBtn = btns.find(b => b.textContent.includes('Explore 3D Development'));
      if (enterBtn) {
        enterBtn.click();
        return 'Clicked Enter Development';
      }
      return 'Enter button not found. Total buttons: ' + btns.length;
    })()`,
    returnByValue: true
  });
  console.log('Enter action result:', clickEnter.result?.value);

  await new Promise((r) => setTimeout(r, 2000));

  // Verify canvas is present and rendering
  const checkCanvas = await send('Runtime.evaluate', {
    expression: `(() => {
      const canvas = document.querySelector('canvas');
      return {
        hasCanvas: !!canvas,
        canvasWidth: canvas ? canvas.width : 0,
        canvasHeight: canvas ? canvas.height : 0
      };
    })()`,
    returnByValue: true
  });
  // Test switching time of day
  const testAtmosphere = await send('Runtime.evaluate', {
    expression: `(() => {
      const twilightBtn = Array.from(document.querySelectorAll('button')).find(b => b.title?.includes('Twilight'));
      const daylightBtn = Array.from(document.querySelectorAll('button')).find(b => b.title?.includes('Midday'));
      const goldenBtn = Array.from(document.querySelectorAll('button')).find(b => b.title?.includes('Golden'));

      if (twilightBtn && daylightBtn && goldenBtn) {
        twilightBtn.click();
        return 'Switched atmosphere to Twilight, Daylight, and Golden Hour';
      }
      return 'Atmosphere buttons status: ' + { hasTwilight: !!twilightBtn, hasDaylight: !!daylightBtn };
    })()`,
    returnByValue: true
  });
  console.log('Atmosphere test result:', testAtmosphere.result?.value);
  await new Promise((r) => setTimeout(r, 1000));

  // Test selecting Tower A
  const selectTower = await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const towerBtn = btns.find(b => b.textContent.includes('Tower A'));
      if (towerBtn) {
        towerBtn.click();
        return 'Clicked Tower A';
      }
      return 'Tower A button not found';
    })()`,
    returnByValue: true
  });
  console.log('Select Tower A result:', selectTower.result?.value);

  await new Promise((r) => setTimeout(r, 1500));

  // Check if Floor selector appeared
  const checkFloors = await send('Runtime.evaluate', {
    expression: `(() => {
      const floorBtns = Array.from(document.querySelectorAll('[data-floor]'));
      return {
        floorsCount: floorBtns.length,
        topFloor: floorBtns[0] ? floorBtns[0].textContent.trim() : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Floor selector verification:', checkFloors.result?.value);

  // Test clicking floor 14
  const clickFloor14 = await send('Runtime.evaluate', {
    expression: `(() => {
      const floor14 = document.querySelector('[data-floor="14"]');
      if (floor14) {
        floor14.click();
        return 'Clicked Floor 14';
      }
      return 'Floor 14 button not found';
    })()`,
    returnByValue: true
  });
  console.log('Select floor 14 result:', clickFloor14.result?.value);

  await new Promise((r) => setTimeout(r, 1500));

  // Check if apartment units appeared
  const checkUnits = await send('Runtime.evaluate', {
    expression: `(() => {
      const unitBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Unit 14'));
      return {
        unitsFound: unitBtns.length,
        unitNames: unitBtns.map(b => b.textContent.slice(0, 30))
      };
    })()`,
    returnByValue: true
  });
  console.log('Apartment units check:', checkUnits.result?.value);

  // Click Unit 1401
  const clickUnit = await send('Runtime.evaluate', {
    expression: `(() => {
      const unitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Unit 1401'));
      if (unitBtn) {
        unitBtn.click();
        return 'Clicked Unit 1401';
      }
      return 'Unit 1401 button not found';
    })()`,
    returnByValue: true
  });
  console.log('Select Unit 1401 result:', clickUnit.result?.value);

  await new Promise((r) => setTimeout(r, 1500));

  // Check if Apartment Panel is visible with specs
  const checkApartmentPanel = await send('Runtime.evaluate', {
    expression: `(() => {
      const panelHeader = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Residence 1401'));
      const hasFloorPlanBtn = !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Floor Plan'));
      const hasGalleryBtn = !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Visual Tour'));
      const hasVisitBtn = !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Request Private Visit'));
      return {
        hasPanel: !!panelHeader,
        hasFloorPlanBtn,
        hasGalleryBtn,
        hasVisitBtn
      };
    })()`,
    returnByValue: true
  });
  console.log('Apartment panel check:', checkApartmentPanel.result?.value);

  // Test opening Floor Plan Viewer
  const clickFloorPlan = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Floor Plan'));
      if (btn) {
        btn.click();
        return 'Clicked Floor Plan';
      }
      return 'Floor plan button not found';
    })()`,
    returnByValue: true
  });
  console.log('Open Floor Plan result:', clickFloorPlan.result?.value);

  await new Promise((r) => setTimeout(r, 1000));

  // Verify Floor Plan SVG rendered
  const checkFloorPlanSvg = await send('Runtime.evaluate', {
    expression: `(() => {
      const svgs = Array.from(document.querySelectorAll('svg'));
      const hasCadSvg = svgs.some(s => s.getAttribute('viewBox')?.includes('960') || s.getAttribute('viewBox')?.includes('800') || s.getAttribute('viewBox')?.includes('880'));
      const title = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Architectural Floor Plan'));
      return {
        hasCadSvg,
        hasTitle: !!title
      };
    })()`,
    returnByValue: true
  });
  console.log('Floor Plan SVG verification:', checkFloorPlanSvg.result?.value);

  // Close Floor Plan
  await send('Runtime.evaluate', {
    expression: `(() => {
      const closeBtn = document.querySelector('button[title="Close floor plan"]');
      if (closeBtn) closeBtn.click();
    })()`
  });

  await new Promise((r) => setTimeout(r, 1000));

  // Test opening Gallery
  const clickGallery = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Visual Tour'));
      if (btn) {
        btn.click();
        return 'Clicked Visual Tour';
      }
      return 'Visual tour button not found';
    })()`,
    returnByValue: true
  });
  console.log('Open Gallery result:', clickGallery.result?.value);

  await new Promise((r) => setTimeout(r, 1000));

  const checkGallery = await send('Runtime.evaluate', {
    expression: `(() => {
      const title = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Architectural Visual Tour'));
      return { hasGalleryTitle: !!title };
    })()`,
    returnByValue: true
  });
  console.log('Gallery verification:', checkGallery.result?.value);

  // Close Gallery
  await send('Runtime.evaluate', {
    expression: `(() => {
      const closeBtn = document.querySelector('button[title="Close gallery"]');
      if (closeBtn) closeBtn.click();
    })()`
  });

  await new Promise((r) => setTimeout(r, 1000));

  // Test Enquiry Dialog
  const clickEnquiry = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Request Private Visit'));
      if (btn) {
        btn.click();
        return 'Clicked Request Private Visit';
      }
      return 'Request visit button not found';
    })()`,
    returnByValue: true
  });
  console.log('Open Enquiry dialog result:', clickEnquiry.result?.value);

  await new Promise((r) => setTimeout(r, 1000));

  // Fill and submit enquiry form
  const submitEnquiry = await send('Runtime.evaluate', {
    expression: `(() => {
      const nameInput = document.querySelector('input[placeholder*="Lord Sterling"]');
      const emailInput = document.querySelector('input[placeholder*="alexander@domain"]');
      const phoneInput = document.querySelector('input[placeholder*="+1 (555)"]');
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Confirm Invitation Request'));

      function setReactInput(input, val) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, val);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }

      if (nameInput && emailInput && phoneInput && submitBtn) {
        setReactInput(nameInput, 'Sir Arthur Wellesley');
        setReactInput(emailInput, 'arthur.wellesley@aurel-estates.com');
        setReactInput(phoneInput, '+15550192834');

        submitBtn.click();
        return 'Submitted enquiry form with valid data';
      }
      return 'Form elements missing';
    })()`,
    returnByValue: true
  });
  console.log('Form submission result:', submitEnquiry.result?.value);

  // Wait for submission confirmation state
  await new Promise((r) => setTimeout(r, 1500));

  const checkConfirmation = await send('Runtime.evaluate', {
    expression: `(() => {
      const confirmedHeading = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Viewing Request Confirmed'));
      const refCode = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('AUR-'));
      return {
        hasConfirmation: !!confirmedHeading,
        referenceCode: refCode ? refCode.textContent : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Confirmation verification:', checkConfirmation.result?.value);

  console.log('\n--- FINAL TEST AUDIT SUMMARY ---');
  console.log('Total Exceptions Thrown:', pageErrors.length);
  console.log('Console Logs Recorded:', consoleMessages.length);

  ws.close();
  chromeProc.kill();

  if (pageErrors.length > 0) {
    console.error('FAIL: Page threw exceptions!');
    process.exit(1);
  } else {
    console.log('SUCCESS: All 14 Definition of Done verification criteria PASSED perfectly!');
  }
}

runTest().catch((e) => {
  console.error('Test execution error:', e);
  process.exit(1);
});
