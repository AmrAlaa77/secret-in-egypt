const fs = require('fs');
const tokens = JSON.parse(fs.readFileSync('tokens.json','utf8'));
const BASE_URL = 'https://AmrAlaa77.github.io/secret-in-egypt/';
const TITLE = 'The Secret in Egypt';
const TOTAL = tokens.length; // 31

const TOKEN_MAP = {};
tokens.forEach((t, idx) => { TOKEN_MAP[t] = idx + 1; });
const POS_TO_TOKEN = tokens;

const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${TITLE}</title>
<style>
*{box-sizing:border-box} html,body{margin:0;min-height:100%;font-family:Arial,sans-serif;background:#f5f0e0;color:#2d2210}
button,select{font:inherit} .participant{position:fixed;inset:0;background:#000;display:flex;align-items:center;justify-content:center}
.participant img{width:100vw;height:100vh;object-fit:contain}
header{background:#8a5a1e;color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px}
h1{margin:0;font-size:28px} .wrap{max-width:1200px;margin:auto;padding:22px}
.panel{background:white;border:2px solid #8a5a1e;border-radius:20px;padding:18px;box-shadow:0 4px 14px #0001}
.controls{display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:center}
select,button{border:2px solid #8a5a1e;border-radius:10px;padding:11px 16px;background:white;color:#8a5a1e;font-weight:700}
button.primary{background:#8a5a1e;color:white} button:disabled{opacity:.35}
.status{text-align:center;margin:14px 0 4px;font-weight:700}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:20px}
.qcard{background:white;border:2px solid #8a5a1e;border-radius:18px;min-height:300px;display:flex;align-items:center;justify-content:center;gap:26px;padding:18px}
.qcard img{width:min(220px,40vw);height:auto;image-rendering:pixelated} .letter{font-size:72px;font-weight:900;color:#8a5a1e;min-width:90px;text-align:center}
.nav{display:flex;justify-content:center;gap:12px;margin:18px 0}
.reveal{display:none;margin-top:20px} .reveal.show{display:block}
.seq{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
.seq div{background:white;border:1px solid #ddd;border-radius:12px;padding:8px;text-align:center;font-weight:bold}
.seq img{width:100%;border-radius:8px;display:block;margin-bottom:6px}
.note{text-align:center;color:#6b5a3a;font-size:14px;margin-top:10px}
@media(max-width:700px){header{padding:12px 14px}h1{font-size:21px}.wrap{padding:10px}.grid{grid-template-columns:1fr}.qcard{min-height:240px}.letter{font-size:54px}}
@media(min-width:900px){.grid{height:calc(100vh - 265px)}.qcard{min-height:0}}
</style></head><body>
<div id="app"></div>
<script src="qrcode.js"></script>
<script>
const BASE_URL=${JSON.stringify(BASE_URL)};
const TOTAL=${TOTAL};
const TOKEN_MAP=${JSON.stringify(TOKEN_MAP)};
const POS_TO_TOKEN=${JSON.stringify(POS_TO_TOKEN)};
function imgSrc(token){return 'images/'+token+'.jpg';}
function qrDataUrl(text){
  const qr=qrcode(0,'M');
  qr.addData(text);
  qr.make();
  return qr.createDataURL(6,8);
}
const params=new URLSearchParams(location.search), vtoken=params.get('v');
const app=document.getElementById('app');
if(vtoken && TOKEN_MAP[vtoken]){
  document.body.innerHTML='<div class="participant"><img src="'+imgSrc(vtoken)+'" alt=""></div>';
} else {
let count=10, order=[], page=0;
app.innerHTML=\`<header><h1>${TITLE}</h1><button onclick="toggleFS()">Full Screen</button></header>
<div class="wrap"><div class="panel"><div class="controls">
<label><b>Pictures:</b> <select id="count">\${Array.from({length:TOTAL-1},(_,k)=>\`<option value="\${k+2}" \${k+2===10?'selected':''}>\${k+2}</option>\`).join('')}</select></label>
<button class="primary" onclick="start()">Start / Apply</button><button onclick="shuffle()">Shuffle</button>
<button onclick="toggleReveal()">Show Answer</button><button onclick="resetAll()">Reset</button>
</div><div class="status" id="status"></div><div class="note">Four QR codes per screen. Letters do not reveal picture order.</div></div>
<div class="grid" id="grid"></div><div class="nav"><button id="prev" onclick="move(-1)">Previous</button><button id="next" onclick="move(1)">Next</button></div>
<div class="reveal panel" id="reveal"><h2 style="text-align:center;color:#8a5a1e">Correct Zoom-Out Sequence</h2><div class="seq" id="seq"></div></div></div>\`;
start();
function start(){count=+document.getElementById('count').value;order=Array.from({length:count},(_,i)=>i+1);shuffleArray(order);page=0;render();renderReveal();}
function shuffleArray(a){for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}}
window.shuffle=function(){shuffleArray(order);page=0;render();}
window.move=function(d){page=Math.max(0,Math.min(Math.ceil(count/4)-1,page+d));render();}
function render(){let slice=order.slice(page*4,page*4+4);document.getElementById('grid').innerHTML=slice.map((posNum,j)=>{const tk=POS_TO_TOKEN[posNum-1];const url=BASE_URL+'?v='+tk;return \`<div class="qcard"><img src="\${qrDataUrl(url)}"><div class="letter">\${String.fromCharCode(65+page*4+j)}</div></div>\`}).join('');
let pages=Math.ceil(count/4);document.getElementById('status').textContent=\`QR Screen \${page+1} of \${pages} • \${count} pictures selected\`;
document.getElementById('prev').disabled=page===0;document.getElementById('next').disabled=page===pages-1;}
function renderReveal(){document.getElementById('seq').innerHTML=Array.from({length:count},(_,i)=>{const tk=POS_TO_TOKEN[i];return \`<div><img src="\${imgSrc(tk)}">Picture \${i+1}</div>\`}).join('')}
window.toggleReveal=function(){document.getElementById('reveal').classList.toggle('show');document.getElementById('reveal').scrollIntoView({behavior:'smooth'})}
window.resetAll=function(){document.getElementById('count').value=10;document.getElementById('reveal').classList.remove('show');start()}
window.toggleFS=function(){if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()}
}
</script></body></html>
`;

fs.writeFileSync('index.html', html);
console.log('index.html written, length', html.length, 'TOTAL', TOTAL);
