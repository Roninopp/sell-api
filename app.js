@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

*, *::before, *::after {
    box-sizing: border-box;
    margin: 0; padding: 0;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    font-family: 'Outfit', sans-serif;
}

:root {
    --bg: #0d0b1e;
    --glass: rgba(255,255,255,0.06);
    --glass-b: rgba(255,255,255,0.12);
    --text: #f0eeff;
    --muted: rgba(200,190,255,0.5);
    --purple: #7b5cfa;
    --purple2: #9b7dff;
    --cyan: #00d4ff;
    --green: #00e5a0;
    --red: #ff5c7a;
    --r: 18px;
    --rs: 12px;
}

html, body { background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }
::-webkit-scrollbar { display: none; }

/* ── BLOBS ── */
.blob { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; opacity: 0.45; }
.b1 { width:320px; height:320px; background:radial-gradient(circle,#6c3de8,transparent 70%); top:-80px; left:-80px; }
.b2 { width:280px; height:280px; background:radial-gradient(circle,#0099cc,transparent 70%); top:120px; right:-60px; }
.b3 { width:260px; height:260px; background:radial-gradient(circle,#a020d8,transparent 70%); bottom:100px; left:30px; }

/* ── APP ── */
#app { position:relative; z-index:1; padding:16px; max-width:480px; margin:0 auto; }

/* ── HEADER ── */
.hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:22px; }
.hdr-left { display:flex; align-items:center; gap:12px; }
.ava {
    width:46px; height:46px; border-radius:50%;
    background:linear-gradient(135deg,var(--purple),var(--cyan));
    display:flex; align-items:center; justify-content:center;
    font-size:15px; font-weight:800; color:#fff;
    box-shadow:0 0 18px rgba(123,92,250,0.5); flex-shrink:0;
}
.uname { font-size:15px; font-weight:700; color:var(--text); line-height:1.2; }
.ubrand { font-size:11px; font-weight:600; color:var(--purple2); letter-spacing:0.3px; }
.hdr-btn {
    width:40px; height:40px; border-radius:50%;
    background:var(--glass); border:1px solid var(--glass-b);
    color:var(--muted); font-size:16px;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all 0.15s; backdrop-filter:blur(10px);
}
.hdr-btn:active { transform:scale(0.9); color:var(--purple2); }

/* ── WALLET CARD ── */
.wcard {
    position:relative;
    background:linear-gradient(135deg,#3d2b8e 0%,#1a3a6e 50%,#0f6f8a 100%);
    border-radius:24px; padding:22px 22px 20px;
    margin-bottom:22px; overflow:hidden;
    box-shadow:0 8px 32px rgba(100,60,200,0.35),inset 0 1px 0 rgba(255,255,255,0.15);
}
.wcard-glow {
    position:absolute; top:-60px; right:-60px;
    width:220px; height:220px;
    background:radial-gradient(circle,rgba(0,212,255,0.25) 0%,transparent 65%);
    pointer-events:none;
}
.wcard-orb {
    position:absolute; bottom:-40px; left:40%;
    width:150px; height:150px;
    background:radial-gradient(circle,rgba(160,60,240,0.2) 0%,transparent 70%);
    pointer-events:none;
}
.wcard-wallet-icon {
    position:absolute; right:22px; top:50%;
    transform:translateY(-60%);
    font-size:72px; opacity:0.18; color:#fff;
    pointer-events:none;
    filter:drop-shadow(0 0 12px rgba(0,212,255,0.4));
}
.wlbl { font-size:13px; font-weight:600; color:rgba(255,255,255,0.7); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:6px; }
.wamt { font-size:42px; font-weight:900; color:#fff; letter-spacing:-1.5px; line-height:1; margin-bottom:20px; text-shadow:0 2px 16px rgba(0,212,255,0.3); }
.wbtn {
    display:inline-flex; align-items:center; gap:8px;
    padding:12px 24px; border-radius:40px; border:none;
    background:rgba(255,255,255,0.18); backdrop-filter:blur(10px);
    color:#fff; font-size:14px; font-weight:700; cursor:pointer;
    transition:all 0.2s;
    box-shadow:0 4px 14px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.2);
}
.wbtn:active { transform:scale(0.96); background:rgba(255,255,255,0.25); }

/* ── TABS ── */
.tabs-wrap { display:flex; gap:8px; overflow-x:auto; margin-bottom:14px; padding-bottom:2px; }
.tab {
    display:flex; align-items:center; gap:6px;
    padding:9px 18px; border-radius:24px;
    border:1px solid var(--glass-b); background:var(--glass);
    backdrop-filter:blur(10px); color:var(--muted);
    font-size:13px; font-weight:600; white-space:nowrap;
    cursor:pointer; transition:all 0.2s; flex-shrink:0;
}
.tab i { font-size:14px; }
.tab.active {
    background:linear-gradient(135deg,var(--purple),var(--purple2));
    border-color:var(--purple); color:#fff;
    box-shadow:0 4px 16px rgba(123,92,250,0.4);
}

/* ── SUB FILTERS ── */
.subs { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px; }
.sub-btn {
    padding:5px 14px; border-radius:20px;
    border:1px solid var(--glass-b); background:transparent;
    color:var(--muted); font-size:12px; font-weight:600; cursor:pointer; transition:all 0.15s;
}
.sub-btn.active { background:rgba(123,92,250,0.15); border-color:var(--purple); color:var(--purple2); }

/* ── GRID HEADER ── */
.grid-hdr { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
#gtitle { font-size:17px; font-weight:800; }
.gcount { font-size:11px; color:var(--muted); background:var(--glass); padding:3px 10px; border-radius:10px; border:1px solid var(--glass-b); }

/* ── PRODUCT GRID ── */
.grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.pcard {
    background:var(--glass); border:1px solid var(--glass-b);
    border-radius:var(--r); padding:16px;
    display:flex; flex-direction:column; gap:8px;
    cursor:pointer; transition:all 0.2s;
    backdrop-filter:blur(10px); position:relative; overflow:hidden;
}
.pcard:active { transform:scale(0.96); border-color:var(--purple); box-shadow:0 0 20px rgba(123,92,250,0.25); }
.pcard-orb { position:absolute; width:80px; height:80px; border-radius:50%; top:-20px; right:-20px; pointer-events:none; opacity:0.6; }
.pcard-icon { font-size:26px; position:relative; z-index:1; }
.pcard-name { font-size:13px; font-weight:600; color:var(--text); line-height:1.3; position:relative; z-index:1; }
.pcard-price { font-size:20px; font-weight:900; position:relative; z-index:1; }
.pcard-btn { margin-top:4px; padding:9px; border-radius:var(--rs); border:none; font-size:12px; font-weight:700; cursor:pointer; transition:all 0.15s; position:relative; z-index:1; }
.empty { grid-column:1/-1; text-align:center; padding:48px 16px; color:var(--muted); font-size:14px; }
.empty i { font-size:36px; margin-bottom:12px; display:block; }

/* ── OVERLAY ── */
.overlay { display:none; position:fixed; inset:0; background:rgba(5,3,20,0.75); backdrop-filter:blur(6px); z-index:100; }
.overlay.on { display:block; }

/* ── SHEETS ── */
.sheet {
    position:fixed; bottom:0; left:0; right:0;
    background:linear-gradient(180deg,#1a1535 0%,#100d25 100%);
    border:1px solid var(--glass-b); border-bottom:none;
    border-radius:28px 28px 0 0;
    z-index:200; transform:translateY(100%);
    transition:transform 0.35s cubic-bezier(0.32,0.72,0,1);
    max-width:480px; margin:0 auto;
    max-height:92vh; overflow-y:auto;
}
.sheet.open { transform:translateY(0); }
.sheet-pill { width:40px; height:4px; background:rgba(255,255,255,0.15); border-radius:2px; margin:14px auto 0; }
.sheet-inner { padding:20px 20px 40px; }

.sh-title { font-size:22px; font-weight:800; margin-bottom:4px; }
.sh-sub { font-size:13px; color:var(--muted); margin-bottom:18px; }

/* Pills */
.pills { display:flex; gap:8px; margin-bottom:14px; }
.pill { flex:1; padding:10px 0; border-radius:var(--rs); border:1px solid var(--glass-b); background:var(--glass); color:var(--text); font-size:13px; font-weight:700; cursor:pointer; transition:all 0.15s; }
.pill.on { background:linear-gradient(135deg,var(--purple),var(--purple2)); border-color:var(--purple); color:#fff; box-shadow:0 4px 12px rgba(123,92,250,0.35); }

/* Field */
.field { position:relative; margin-bottom:14px; }
.f-prefix { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--muted); font-size:18px; font-weight:700; pointer-events:none; }
.field input {
    width:100%; background:rgba(255,255,255,0.06);
    border:1px solid var(--glass-b); color:var(--text);
    padding:14px 14px 14px 36px; border-radius:var(--rs);
    font-size:15px; font-weight:500; outline:none;
    transition:border-color 0.15s;
    -webkit-user-select:text; user-select:text;
}
.field input::placeholder { color:var(--muted); }
.field input:focus { border-color:var(--purple); }

/* UPI */
.upi-card { background:rgba(123,92,250,0.1); border:1px solid rgba(123,92,250,0.25); border-radius:var(--rs); padding:14px; margin-bottom:14px; }
.upi-lbl { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.7px; color:var(--muted); display:block; margin-bottom:6px; }
.upi-row { display:flex; align-items:center; justify-content:space-between; }
.upi-id { font-size:15px; font-weight:800; color:var(--purple2); }
.copy-btn { width:34px; height:34px; background:rgba(123,92,250,0.2); border:1px solid rgba(123,92,250,0.3); color:var(--purple2); border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:14px; cursor:pointer; transition:all 0.15s; }
.copy-btn:active { background:var(--purple); color:#fff; transform:scale(0.9); }

/* ── IMAGE UPLOAD ── */
.upload-wrap { margin-bottom:14px; }
.upload-btn {
    width:100%; padding:14px;
    border-radius:var(--rs);
    border:2px dashed rgba(123,92,250,0.35);
    background:rgba(123,92,250,0.07);
    color:var(--purple2);
    font-size:14px; font-weight:600;
    cursor:pointer; transition:all 0.2s;
    display:flex; align-items:center; justify-content:center; gap:8px;
}
.upload-btn:active { background:rgba(123,92,250,0.15); border-color:var(--purple); }
.img-preview {
    width:100%; border-radius:var(--rs);
    margin-top:10px; object-fit:cover;
    max-height:180px;
    border:1px solid rgba(123,92,250,0.3);
}

/* Note */
.info-note { font-size:12px; color:var(--muted); display:flex; align-items:flex-start; gap:6px; margin-bottom:18px; line-height:1.5; }
.info-note i { color:var(--cyan); margin-top:2px; flex-shrink:0; }

/* Buy header */
.bh-row { display:flex; align-items:center; gap:14px; margin-bottom:18px; }
.bh-icon { font-size:30px; width:54px; height:54px; border-radius:16px; background:rgba(123,92,250,0.1); border:1px solid rgba(123,92,250,0.2); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.bh-name { font-size:18px; font-weight:800; line-height:1.2; margin-bottom:4px; }
.bh-price { font-size:20px; font-weight:900; color:var(--cyan); }

/* Balance warning */
.bal-warn { background:rgba(255,92,122,0.1); border:1px solid rgba(255,92,122,0.25); border-radius:var(--rs); padding:10px 14px; font-size:13px; color:var(--red); display:flex; align-items:flex-start; gap:8px; margin-bottom:14px; line-height:1.5; }
.tgt-err { font-size:12px; color:var(--red); margin-bottom:10px; min-height:0; }

/* Balance strip */
.bal-strip { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-top:1px solid var(--glass-b); border-bottom:1px solid var(--glass-b); margin-bottom:16px; font-size:13px; color:var(--muted); }
.bh-bal-num { font-size:17px; font-weight:800; color:var(--green); }

/* Buttons */
.btn-glow {
    width:100%; padding:15px; border-radius:var(--rs); border:none;
    background:linear-gradient(135deg,var(--purple),#5b8df5);
    color:#fff; font-size:15px; font-weight:800; cursor:pointer;
    display:flex; align-items:center; justify-content:center; gap:8px;
    box-shadow:0 8px 24px rgba(123,92,250,0.4);
    transition:all 0.15s; margin-bottom:10px; letter-spacing:0.2px;
}
.btn-glow:active { transform:scale(0.97); box-shadow:0 4px 12px rgba(123,92,250,0.3); }
.btn-glow:disabled { background:rgba(255,255,255,0.1); color:var(--muted); box-shadow:none; cursor:not-allowed; }
.btn-flat { width:100%; padding:13px; border-radius:var(--rs); border:1px solid var(--glass-b); background:transparent; color:var(--muted); font-size:14px; font-weight:600; cursor:pointer; transition:all 0.15s; }
.btn-flat:active { background:var(--glass); }

/* ── TOAST ── */
.toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%) translateY(90px); background:rgba(26,21,53,0.95); border:1px solid var(--glass-b); color:var(--text); padding:11px 22px; border-radius:40px; font-size:13px; font-weight:600; backdrop-filter:blur(12px); z-index:999; transition:transform 0.3s cubic-bezier(0.32,0.72,0,1); white-space:nowrap; pointer-events:none; box-shadow:0 8px 28px rgba(0,0,0,0.5); }
.toast.show { transform:translateX(-50%) translateY(0); }
.toast.ok   { border-color:var(--green); color:var(--green); }
.toast.err  { border-color:var(--red);   color:var(--red); }
.toast.info { border-color:var(--purple2); color:var(--purple2); }
