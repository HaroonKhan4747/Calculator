// simple, secure password generator page logic
(function(){
  // Elements
  const quantityEl = document.getElementById('quantity');
  const difficultyEl = document.getElementById('difficulty');
  const includeNumbersEl = document.getElementById('includeNumbers');
  const includeSymbolsEl = document.getElementById('includeSymbols');
  const generateBtn = document.getElementById('generate');
  const listEl = document.getElementById('list');
  const resultCountEl = document.getElementById('resultCount');
  const copyAllBtn = document.getElementById('copyAll');
  const downloadTxtBtn = document.getElementById('downloadTxt');
  const downloadCsvBtn = document.getElementById('downloadCsv');
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('menu');

  // Toggle mobile menu
  hamburger?.addEventListener('click', ()=> menu.classList.toggle('open'));

  // Difficulty presets (length range)
  const difficultyPresets = {
    easy:  {min:6, max:8, entropyMultiplier:1},
    normal:{min:10, max:12, entropyMultiplier:1.2},
    strong:{min:14, max:20, entropyMultiplier:1.5}
  };

  // character sets
  const LOWER = 'abcdefghijklmnopqrstuvwxyz';
  const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const NUM = '0123456789';
  const SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?';

  function secureRandomInt(max){
    // returns integer 0..max-1 using crypto
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  }

  function pickFrom(str){
    return str.charAt(secureRandomInt(str.length));
  }

  function randomLength(min,max){
    if(min===max) return min;
    const range = max - min + 1;
    return min + secureRandomInt(range);
  }

  function buildCharset(includeNumbers, includeSymbols){
    let set = LOWER + UPPER;
    if(includeNumbers) set += NUM;
    if(includeSymbols) set += SYMBOLS;
    return set;
  }

  function generateSingle({difficulty, includeNumbers, includeSymbols}){
    const preset = difficultyPresets[difficulty] || difficultyPresets.normal;
    const len = randomLength(preset.min, preset.max);
    const charset = buildCharset(includeNumbers, includeSymbols);

    // ensure at least one from each selected category is present for quality (if available)
    let out = [];
    // required anchors
    out.push(pickFrom(LOWER));
    out.push(pickFrom(UPPER));
    if(includeNumbers) out.push(pickFrom(NUM));
    if(includeSymbols) out.push(pickFrom(SYMBOLS));

    // fill remaining
    while(out.join('').length < len){
      out.push(pickFrom(charset));
    }

    // shuffle securely (Fisher-Yates using crypto)
    for(let i = out.length - 1; i > 0; i--){
      const j = secureRandomInt(i + 1);
      [out[i], out[j]] = [out[j], out[i]];
    }

    return out.join('').slice(0, len);
  }

  function generateBatch(count, options){
    const results = [];
    for(let i=0;i<count;i++){
      results.push(generateSingle(options));
    }
    return results;
  }

  function renderResults(arr){
    listEl.innerHTML = '';
    resultCountEl.textContent = arr.length;
    if(arr.length === 0){
      listEl.innerHTML = '<div class="muted">No passwords yet. Click Generate.</div>';
      return;
    }

    arr.forEach((pw, idx) => {
      const card = document.createElement('div');
      card.className = 'pw-card';

      const left = document.createElement('div');
      left.className = 'pw-left';
      const txt = document.createElement('div');
      txt.className = 'pw-text';
      txt.textContent = pw;
      left.appendChild(txt);

      const meta = document.createElement('div');
      meta.className = 'pw-meta';
      meta.textContent = pw.length + ' chars';
      left.appendChild(meta);

      const actions = document.createElement('div');
      actions.className = 'pw-actions';

      const copyBtn = document.createElement('button');
      copyBtn.className = 'icon-btn copy';
      copyBtn.title = 'Copy';
      copyBtn.textContent = 'Copy';
      copyBtn.addEventListener('click', async ()=>{
        try {
          await navigator.clipboard.writeText(pw);
          copyBtn.textContent = 'Copied';
          setTimeout(()=> copyBtn.textContent = 'Copy', 900);
        } catch(e){
          alert('Copy failed. Please select and copy manually.');
        }
      });

      const delBtn = document.createElement('button');
      delBtn.className = 'icon-btn';
      delBtn.title = 'Delete';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', ()=>{
        // remove this password from current display array
        const current = Array.from(listEl.querySelectorAll('.pw-text')).map(n=>n.textContent);
        const filtered = current.filter(x=> x !== pw || (x===pw && current.indexOf(x) !== current.lastIndexOf(x)));
        renderResults(filtered);
      });

      actions.appendChild(copyBtn);
      actions.appendChild(delBtn);

      card.appendChild(left);
      card.appendChild(actions);
      listEl.appendChild(card);
    });
  }

  function getCurrentPasswords(){
    return Array.from(listEl.querySelectorAll('.pw-text')).map(n=>n.textContent);
  }

  // Generate click
  generateBtn.addEventListener('click', ()=>{
    const count = Math.max(1, Math.min(50, parseInt(quantityEl.value) || 1));
    const difficulty = difficultyEl.value;
    const includeNumbers = includeNumbersEl.checked;
    const includeSymbols = includeSymbolsEl.checked;

    const arr = generateBatch(count, {difficulty, includeNumbers, includeSymbols});
    renderResults(arr);
  });

  // Copy All
  copyAllBtn.addEventListener('click', async ()=>{
    const arr = getCurrentPasswords();
    if(arr.length === 0) { alert('No passwords to copy.'); return; }
    const text = arr.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied ' + arr.length + ' passwords to clipboard.');
    } catch(e){
      alert('Copy failed. Please copy manually.');
    }
  });

  // Download .txt
  downloadTxtBtn.addEventListener('click', ()=>{
    const arr = getCurrentPasswords();
    if(arr.length === 0){ alert('No passwords to download.'); return; }
    const blob = new Blob([arr.join('\n')], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passwords.txt';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  });

  // Download .csv
  downloadCsvBtn.addEventListener('click', ()=>{
    const arr = getCurrentPasswords();
    if(arr.length === 0){ alert('No passwords to download.'); return; }
    const rows = arr.map(pw => `"${pw}"`).join('\n');
    const blob = new Blob(['password\n' + rows], {type:'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passwords.csv';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  });

  // keyboard shortcut: Cmd/Ctrl+G to generate
  window.addEventListener('keydown', (e)=> {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
      e.preventDefault();
      generateBtn.click();
    }
  });

  // initial empty state
  renderResults([]);
})();
