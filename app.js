/* Absensi Guru — frontend (HTML/CSS/JS murni, tanpa framework) */
(() => {
'use strict';

const CFG = window.APP_CONFIG || {};
const S = { token: '', role: '', profil: null, config: null, offset: 0, view: '', installEvt: null };
const cleanups = [];
const BK = { 'Hadir': 'hadir', 'Terlambat': 'terlambat', 'Izin': 'izin', 'Sakit': 'sakit', 'Dinas Luar': 'dl', 'Lembur': 'lembur', 'Alpa': 'alpa' };
const WARNA = ['hadir', 'terlambat', 'izin', 'sakit', 'dl'];
const NAMA_WARNA = { hadir: 'Hadir', terlambat: 'Terlambat', izin: 'Izin', sakit: 'Sakit', dl: 'Dinas Luar' };
const GIF = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

/* ---------- Util ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ICO = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  refresh: '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>'
};
const ico = (n) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICO[n] || ''}</svg>`;

const nowWIB = () => new Date(Date.now() + S.offset);
const fJam = (d) => d.toLocaleTimeString('en-GB', { timeZone: 'Asia/Jakarta', hour12: false });
const fTglPanjang = (d) => d.toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const isoHari = (d) => d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });
const fTgl = (iso) => new Date(iso + 'T00:00:00Z').toLocaleDateString('id-ID', { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short' });
const fJm = (h) => { const m = Math.round((h || 0) * 60); return Math.floor(m / 60) + 'j ' + (m % 60) + 'm'; };
const salam = () => {
  const h = Number(nowWIB().toLocaleString('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', hour12: false })) % 24;
  return h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 18 ? 'Selamat sore' : 'Selamat malam';
};
const depan = (n) => String(n || '').trim().split(/\s+/)[0] || '';
const jarakM = (a, b, c, d) => {
  const R = 6371000, r = Math.PI / 180, dLa = (c - a) * r, dLo = (d - b) * r;
  const x = Math.sin(dLa / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin(dLo / 2) ** 2;
  return Math.round(2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
};
const syncWaktu = (w) => { if (w && w.ms) S.offset = w.ms - Date.now(); };

function toast(msg, bad) {
  const t = $('#toast');
  t.textContent = msg; t.className = 'toast show' + (bad ? ' bad' : '');
  clearTimeout(toast.tm); toast.tm = setTimeout(() => { t.className = 'toast'; }, 3200);
}

/* ---------- API ---------- */
async function api(aksi, data = {}, ms = 60000) {
  if (!CFG.API_URL || CFG.API_URL.indexOf('PASTE_') === 0) throw new Error('URL server belum diisi. Isi API_URL di file config.js.');
  const ctl = new AbortController();
  const tm = setTimeout(() => ctl.abort(), ms);
  let res;
  try {
    const r = await fetch(CFG.API_URL, {
      method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(Object.assign({ aksi, token: S.token }, data)), signal: ctl.signal, redirect: 'follow'
    });
    res = await r.json();
  } catch (e) {
    throw new Error(e.name === 'AbortError' ? 'Server terlalu lama merespons. Coba lagi.' : 'Tidak ada koneksi internet atau server tidak dapat dihubungi.');
  } finally { clearTimeout(tm); }
  if (!res.ok) {
    if (res.kode === 'SESI') { keluar(true); return new Promise(() => {}); } // kembali ke halaman login, hentikan proses lama
    throw new Error(res.pesan || 'Terjadi kesalahan.');
  }
  return res.data;
}

/* ---------- Sesi ---------- */
const simpanSesi = () => { try { localStorage.setItem('absen_sesi', JSON.stringify({ token: S.token, role: S.role, profil: S.profil, config: S.config })); } catch (e) { /* abaikan */ } };
function muatSesi() {
  try {
    const s = JSON.parse(localStorage.getItem('absen_sesi') || 'null');
    if (s && s.token) { S.token = s.token; S.role = s.role; S.profil = s.profil; S.config = s.config; return true; }
  } catch (e) { /* abaikan */ }
  return false;
}
function keluar(otomatis) {
  S.token = ''; S.role = ''; S.profil = null;
  try { localStorage.removeItem('absen_sesi'); } catch (e) { /* abaikan */ }
  go('login');
  if (otomatis) toast('Sesi berakhir, silakan masuk lagi.', true);
}

/* ---------- Kerangka tampilan & navigasi ---------- */
function cleanup() {
  while (cleanups.length) { try { cleanups.pop()(); } catch (e) { /* abaikan */ } }
  $$('.overlay').forEach((o) => o.remove());
}
function navHtml() {
  const it = (v, l, ic, cls) => `<button class="${cls || ''} ${S.view === v ? 'on' : ''}" data-go="${v}" aria-label="${l}">${cls ? `<span class="circ">${ico(ic)}</span>` : ico(ic)}<span>${l}</span></button>`;
  if (S.role === 'admin') {
    return `<nav class="nav"><div class="nav-in g4">${it('a_dash', 'Dashboard', 'grid')}${it('a_guru', 'Guru', 'users')}${it('a_ekspor', 'Ekspor', 'download')}${it('a_set', 'Pengaturan', 'sliders')}</div></nav>`;
  }
  return `<nav class="nav"><div class="nav-in g5">${it('beranda', 'Beranda', 'home')}${it('masuk', 'Masuk', 'login', 'cta')}${it('pulang', 'Pulang', 'logout', 'cta out')}${it('riwayat', 'Riwayat', 'clock')}${it('profil', 'Profil', 'user')}</div></nav>`;
}
function shell(html) {
  cleanup();
  $('#app').innerHTML = `<main class="view ${S.token ? '' : 'no-nav'}">${html}</main>${S.token ? navHtml() : ''}`;
  $$('[data-go]').forEach((b) => b.addEventListener('click', () => go(b.dataset.go)));
  window.scrollTo(0, 0);
}
const setView = (html) => { const m = $('main'); if (m) m.innerHTML = html; };
const skel = (...hs) => hs.map((h) => `<div class="skel" style="height:${h}px;margin-bottom:12px"></div>`).join('');
const vacio = (ic, judul, teks) => `<div class="empty"><div class="em-ic">${ico(ic)}</div><b>${esc(judul)}</b>${esc(teks || '')}</div>`;
function errView(e, ulang) {
  setView(vacio('inbox', 'Tidak dapat memuat data', e.message) + '<button class="btn btn-ghost" id="ulang">Coba lagi</button>');
  $('#ulang').onclick = ulang;
}
function openSheet(html) {
  const o = document.createElement('div');
  o.className = 'overlay';
  o.innerHTML = `<div class="sheet"><div class="grab"></div>${html}</div>`;
  o.addEventListener('click', (e) => { if (e.target === o) o.remove(); });
  document.body.appendChild(o);
  return o;
}
function busy(btn, on, teks) {
  if (on) { btn.dataset.t = btn.innerHTML; btn.innerHTML = `<span class="spin"></span> ${teks || 'Memproses…'}`; btn.disabled = true; }
  else { btn.innerHTML = btn.dataset.t || btn.innerHTML; btn.disabled = false; }
}

function go(v, arg) {
  S.view = v;
  const V = { login: vLogin, beranda: vBeranda, masuk: () => vAbsen('masuk'), pulang: () => vAbsen('pulang'), status: vStatus,
    riwayat: vRiwayat, profil: vProfil, a_dash: vADash, a_guru: vAGuru, a_ekspor: vAEkspor, a_set: vASet };
  (V[v] || vLogin)(arg);
}

/* ---------- Kamera & GPS ---------- */
function gpsWatch(cb) {
  if (!navigator.geolocation) { cb({ err: 'Perangkat tidak mendukung GPS.' }); return; }
  const id = navigator.geolocation.watchPosition(
    (p) => cb({ lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy }),
    (e) => cb({ err: e.code === 1 ? 'Izin lokasi ditolak. Aktifkan izin lokasi untuk aplikasi ini di pengaturan browser.' : 'Lokasi belum terbaca. Pastikan GPS aktif.' }),
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 25000 });
  cleanups.push(() => navigator.geolocation.clearWatch(id));
}

function makeCam(host, onChange) {
  host.innerHTML = `<div class="cam"><video playsinline muted autoplay></video><img class="shot" alt="Hasil foto" hidden>
    <div class="cam-err" hidden></div><button type="button" class="cam-flip" aria-label="Balik kamera">${ico('refresh')}</button></div>
    <div class="row" style="margin-bottom:12px"><button type="button" class="btn btn-dark" data-a="snap">${ico('camera')} Ambil Foto</button>
    <button type="button" class="btn btn-ghost" data-a="retake" hidden>Ulangi Foto</button></div>`;
  const v = $('video', host), img = $('.shot', host), er = $('.cam-err', host), flip = $('.cam-flip', host);
  const snap = $('[data-a=snap]', host), retake = $('[data-a=retake]', host);
  let stream = null, facing = 'user', data = null;

  const stop = () => { if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; } };
  const fail = (m) => { er.textContent = m; er.hidden = false; snap.disabled = true; };
  async function start() {
    stop(); er.hidden = true; snap.disabled = false; v.hidden = false; img.hidden = true;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return fail('Kamera tidak didukung. Gunakan Chrome/Safari terbaru dan buka lewat alamat https.');
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing, width: { ideal: 960 }, height: { ideal: 960 } }, audio: false });
      v.srcObject = stream; v.classList.toggle('front', facing === 'user');
      await v.play().catch(() => {});
    } catch (e) {
      fail(e.name === 'NotAllowedError' ? 'Izin kamera ditolak. Aktifkan izin kamera di pengaturan browser, lalu muat ulang halaman.' : 'Kamera tidak dapat dibuka.');
    }
  }
  snap.onclick = () => {
    if (!stream || !v.videoWidth) return;
    const k = Math.min(1, 640 / Math.max(v.videoWidth, v.videoHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(v.videoWidth * k); c.height = Math.round(v.videoHeight * k);
    const x = c.getContext('2d');
    x.drawImage(v, 0, 0, c.width, c.height);
    const t = nowWIB();
    const teks = fTgl(isoHari(t)) + ' ' + fJam(t) + ' WIB' + (S.profil && S.role === 'guru' ? ' · ' + S.profil.nama : '');
    x.fillStyle = 'rgba(0,0,0,.5)'; x.fillRect(0, c.height - 30, c.width, 30);
    x.fillStyle = '#fff'; x.font = 'bold 14px sans-serif'; x.textBaseline = 'middle';
    x.fillText(teks, 10, c.height - 15, c.width - 20);
    data = c.toDataURL('image/jpeg', 0.7);
    img.src = data; img.hidden = false; v.hidden = true; snap.hidden = true; retake.hidden = false; flip.hidden = true;
    stop(); if (onChange) onChange(data);
  };
  retake.onclick = () => { data = null; snap.hidden = false; retake.hidden = true; flip.hidden = false; if (onChange) onChange(null); start(); };
  flip.onclick = () => { facing = facing === 'user' ? 'environment' : 'user'; start(); };
  cleanups.push(stop);
  start();
  return { get data() { return data; } };
}

/* ---------- Komponen tampilan ---------- */
const badge = (s) => `<span class="badge ${BK[s] || ''}">${esc(s)}</span>`;
const tile = (n, l, c) => `<div class="tile"><div class="n">${n}</div><div class="l">${c ? `<span class="dot" style="background:var(--${c})"></span>` : ''}${l}</div></div>`;
const tilesRingkas = (r) => `<div class="tiles t4">${tile(r.hadir, 'Hadir', 'hadir')}${tile(r.terlambat, 'Terlambat', 'terlambat')}${tile(r.izin, 'Izin', 'izin')}${tile(r.sakit, 'Sakit', 'sakit')}${tile(r.dl, 'Dinas Luar', 'dl')}${tile(r.alpa || 0, 'Alpa', 'alpa')}${tile(fJm((r.lemburMenit || 0) / 60), 'Lembur', 'lembur')}${tile(fJm(r.jam), 'Total jam')}</div>`;
const legend = () => `<div class="legend">${WARNA.map((w) => `<span><i style="background:var(--${w})"></i>${NAMA_WARNA[w]}</span>`).join('')}</div>`;

function chartBulan(pb) {
  const W = 340, H = 176, kiri = 24, bawah = 22, atas = 10;
  const tot = pb.map((m) => m.hadir + m.terlambat + m.izin + m.sakit + m.dl);
  const maks = Math.max(5, ...tot);
  const tinggi = H - bawah - atas, slot = (W - kiri - 4) / 12, lb = slot * 0.62;
  const bulan = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik kehadiran per bulan">`;
  for (let i = 0; i <= 4; i++) {
    const y = atas + tinggi - (tinggi * i) / 4;
    s += `<line x1="${kiri}" x2="${W}" y1="${y}" y2="${y}" stroke="#16302a" stroke-opacity=".08"/><text x="${kiri - 5}" y="${y + 3}" font-size="8.5" text-anchor="end" fill="#62786f">${Math.round((maks * i) / 4)}</text>`;
  }
  pb.forEach((m, i) => {
    const x = kiri + i * slot + (slot - lb) / 2;
    let y = atas + tinggi;
    WARNA.forEach((w) => {
      const h = (m[w] / maks) * tinggi;
      if (h > 0) { y -= h; s += `<rect class="bar" style="animation-delay:${i * 35}ms" x="${x}" y="${y}" width="${lb}" height="${h}" rx="2" fill="var(--${w})"><title>${NAMA_WARNA[w]}: ${m[w]}</title></rect>`; }
    });
    s += `<text x="${x + lb / 2}" y="${H - 7}" font-size="9" text-anchor="middle" fill="#62786f">${bulan[i]}</text>`;
  });
  return s + '</svg>';
}

const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
function installBox() {
  if (standalone()) return '';
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  let isi;
  if (S.installEvt) isi = `<p class="sub">Pasang aplikasi agar bisa dibuka dari layar utama seperti aplikasi biasa.</p><button class="btn" id="pasang">Pasang di Layar Utama</button>`;
  else if (ios) isi = `<p class="sub" style="margin:0">Di iPhone: ketuk tombol <b>Bagikan</b> di Safari, lalu pilih <b>Tambah ke Layar Utama</b>.</p>`;
  else isi = `<p class="sub" style="margin:0">Untuk memasang: buka menu browser (⋮), lalu pilih <b>Instal aplikasi</b> atau <b>Tambahkan ke layar utama</b>.</p>`;
  return `<h2>Pasang aplikasi</h2><div class="card">${isi}</div>`;
}
function bindInstall() {
  const b = $('#pasang');
  if (b) b.onclick = async () => { S.installEvt.prompt(); await S.installEvt.userChoice; S.installEvt = null; b.closest('.card').remove(); };
}

function fotoBlok(rec) {
  const it = [];
  if (rec.fotoM) it.push([rec.status === 'Izin' || rec.status === 'Sakit' ? 'Foto bukti' : rec.status === 'Dinas Luar' ? 'Foto dinas luar' : 'Foto masuk', rec.fotoM]);
  if (rec.fotoP) it.push(['Foto pulang', rec.fotoP]);
  return it.length ? it.map((f, i) => `<label>${f[0]}</label><img class="photo skel" id="ph${i}" src="${GIF}" alt="${f[0]}">`).join('') : '<p class="sub">Tidak ada foto.</p>';
}
function muatFoto(o, rec) {
  [rec.fotoM, rec.fotoP].filter(Boolean).forEach((id, i) => {
    const im = $('#ph' + i, o);
    if (!im) return;
    api('foto', { id }, 90000).then((r) => { im.src = r.data; im.classList.remove('skel'); }).catch((e) => { im.alt = e.message; });
  });
}
function detailRec(rec, nama) {
  const o = openSheet(`<h1>${esc(nama || rec.nama || '')}</h1><p class="sub">${fTgl(rec.tanggal)} · ${badge(rec.status)}</p>
    <div class="kv"><span>Masuk</span><b>${rec.masuk || '-'}</b></div><div class="kv"><span>Pulang</span><b>${rec.pulang || '-'}</b></div>
    ${rec.jam ? `<div class="kv"><span>Jam kerja</span><b>${fJm(rec.jam)}</b></div>` : ''}
    ${rec.ket ? `<div class="kv"><span>Keterangan</span><b>${esc(rec.ket)}</b></div>` : ''}
    ${rec.jarakM !== '' && rec.jarakM != null ? `<div class="kv"><span>Jarak dari sekolah (masuk)</span><b>${esc(rec.jarakM)} m</b></div>` : ''}
    ${fotoBlok(rec)}`);
  muatFoto(o, rec);
}

/* ---------- LOGIN ---------- */
function vLogin() {
  shell(`<div class="login"><img class="brand-logo" src="logo.png" alt="Logo Yayasan" onerror="this.remove()">
    <h1 class="brand-name">${esc(CFG.NAMA_SEKOLAH || '')}</h1><p class="brand-app">Absensi Guru</p>
    <div class="card">
      <div class="seg" id="seg"><button class="on" data-r="guru">Guru</button><button data-r="admin">Admin</button></div>
      <div id="fnip"><label for="nip">NIP</label><input class="input" id="nip" autocomplete="username" placeholder="Masukkan NIP"></div>
      <label for="pin">PIN</label><input class="input" id="pin" type="password" inputmode="numeric" autocomplete="current-password" placeholder="Masukkan PIN">
      <p class="err" id="err"></p><button class="btn" id="go">Masuk</button>
    </div><p class="sub small" style="text-align:center">Lupa PIN? Hubungi admin sekolah.</p></div>`);
  let role = 'guru';
  $$('#seg button').forEach((b) => b.onclick = () => {
    role = b.dataset.r; $$('#seg button').forEach((x) => x.classList.toggle('on', x === b));
    $('#fnip').hidden = role === 'admin'; $('#err').textContent = '';
  });
  const kirim = async () => {
    const btn = $('#go'), err = $('#err'); err.textContent = '';
    busy(btn, true, 'Memeriksa…');
    try {
      const r = await api('login', { role, nip: $('#nip').value.trim(), pin: $('#pin').value });
      S.token = r.token; S.role = r.role; S.profil = r.profil; S.config = r.config; simpanSesi();
      go(r.role === 'admin' ? 'a_dash' : 'beranda');
    } catch (e) { err.textContent = e.message; busy(btn, false); }
  };
  $('#go').onclick = kirim;
  $('#pin').addEventListener('keydown', (e) => { if (e.key === 'Enter') kirim(); });
}

/* ---------- BERANDA GURU ---------- */
function heroHtml(sub) {
  return `<div class="hero"><div class="hi">${salam()}, ${esc(depan(S.profil && S.profil.nama))}</div><div class="jam" id="clk">--:--:--</div><div class="tgl" id="dt"></div>${sub ? `<div class="tgl" style="margin-top:6px">${sub}</div>` : ''}</div>`;
}
function startClock() {
  const t = () => { const c = $('#clk'), d = $('#dt'); if (!c) return; const n = nowWIB(); c.textContent = fJam(n); d.textContent = fTglPanjang(n) + ' · WIB'; };
  t(); const id = setInterval(t, 1000); cleanups.push(() => clearInterval(id));
}

async function vBeranda() {
  shell(skel(150, 150, 90, 200));
  try {
    const [b, rg] = await Promise.all([api('beranda'), api('ringkasan')]);
    syncWaktu(b.waktu); S.profil = b.profil; S.config = b.config; simpanSesi();
    const rec = b.hariIni, c = b.config, libur = b.waktu.libur, kerja = b.waktu.hari <= 5 && !libur;
    let hari;
    if (!rec) {
      hari = `<p class="sub" style="margin:0 0 12px">${libur ? 'Hari libur: ' + esc(libur) + '. Jika kamu bekerja hari ini, absen akan tercatat sebagai <b>Lembur</b>.' : 'Belum ada catatan kehadiran hari ini.'}</p><button class="btn" data-go="masuk">${ico('login')} Absen Masuk${libur ? ' (Lembur)' : ''}</button>
        ${libur ? '' : '<button class="btn btn-ghost" data-go="status" style="margin-top:10px">Izin / Sakit / Dinas Luar</button>'}`;
    } else {
      const bisaPulang = ['Hadir', 'Terlambat', 'Dinas Luar', 'Lembur'].includes(rec.status) && !rec.pulang;
      hari = `<div class="kv"><span>Status</span>${badge(rec.status)}</div><div class="kv"><span>Masuk</span><b>${rec.masuk || '-'}</b></div>
        <div class="kv"><span>Pulang</span><b>${rec.pulang || '-'}</b></div>${rec.jam ? `<div class="kv"><span>Jam kerja</span><b>${fJm(rec.jam)}</b></div>` : ''}
        ${rec.ket ? `<div class="kv"><span>Keterangan</span><b>${esc(rec.ket)}</b></div>` : ''}
        ${bisaPulang ? `<button class="btn btn-dark" data-go="pulang" style="margin-top:12px">${ico('logout')} Absen Pulang</button>` : ''}`;
    }
    setView(`${heroHtml('Jam kerja ' + c.jamMasuk + ' – ' + c.jamPulang)}<h2 style="margin-top:6px">Hari ini</h2><div class="card">${hari}</div>
      <h2>Bulan ini</h2>${tilesRingkas(rg.bulanIni)}
      <h2>Kehadiran per bulan ${rg.tahun}</h2><div class="card chart">${chartBulan(rg.perBulan)}${legend()}</div>${installBox()}`);
    $$('[data-go]', $('main')).forEach((x) => x.addEventListener('click', () => go(x.dataset.go)));
    startClock(); bindInstall();
  } catch (e) { errView(e, () => go('beranda')); }
}

/* ---------- ABSEN MASUK / PULANG ---------- */
const infoKartu = (judul, teks, tombol) => `<h1>${esc(judul)}</h1><div class="card" style="margin-top:14px">${vacio('check', judul, teks)}${tombol || ''}</div>`;

async function vAbsen(jenis) {
  shell(skel(40, 60, 380, 54));
  let b;
  try { b = await api('beranda'); } catch (e) { return errView(e, () => go(jenis)); }
  syncWaktu(b.waktu);
  const rec = b.hariIni, cfg = b.config, judul = jenis === 'masuk' ? 'Absen Masuk' : 'Absen Pulang';
  const ke = (v, t) => `<button class="btn btn-ghost" data-go="${v}">${t}</button>`;
  let blok = '';
  if (jenis === 'masuk' && rec) blok = infoKartu('Sudah tercatat hari ini', `Status: ${rec.status}${rec.masuk ? ' · masuk ' + rec.masuk : ''}`, ke('beranda', 'Ke Beranda'));
  else if (jenis === 'pulang' && !rec) blok = infoKartu('Belum absen masuk', 'Absen masuk dulu sebelum absen pulang.', ke('masuk', 'Absen Masuk'));
  else if (jenis === 'pulang' && !['Hadir', 'Terlambat', 'Dinas Luar', 'Lembur'].includes(rec.status)) blok = infoKartu('Tidak perlu absen pulang', `Statusmu hari ini: ${rec.status}.`, ke('beranda', 'Ke Beranda'));
  else if (jenis === 'pulang' && rec.pulang) blok = infoKartu('Sudah absen pulang', `Tercatat pukul ${rec.pulang}.`, ke('beranda', 'Ke Beranda'));
  if (blok) {
    setView(blok); $$('[data-go]', $('main')).forEach((x) => x.addEventListener('click', () => go(x.dataset.go))); return;
  }

  const dl = rec && rec.status === 'Dinas Luar';
  // Sabtu/Minggu/libur nasional (absen masuk) dan pulang dari Lembur: tidak dibatasi radius sekolah
  const bebas = !!dl || (jenis === 'masuk' && !!b.waktu.libur) || (jenis === 'pulang' && !!rec && rec.status === 'Lembur');
  setView(`<h1>${judul}</h1><p class="sub">Foto diambil langsung dari kamera. Jam dicatat otomatis oleh server (WIB).</p>
    ${b.waktu.libur && jenis === 'masuk' ? `<div class="chip ok">${ico('clock')}<span>Hari libur: ${esc(b.waktu.libur)}. Absen hari ini tercatat sebagai Lembur.</span></div>` : ''}
    <div class="chip" id="gps">${ico('pin')}<span>Mencari lokasi…</span></div><div id="camhost"></div>
    <p class="err" id="err"></p><button class="btn" id="kirim" disabled>${jenis === 'masuk' ? ico('login') : ico('logout')} Kirim ${judul}</button>
    ${jenis === 'masuk' && !b.waktu.libur ? '<button class="btn btn-ghost" id="lain" style="margin-top:10px">Izin / Sakit / Dinas Luar</button>' : ''}`);
  let pos = null, foto = null;
  const kirim = $('#kirim');
  const cekSiap = () => { kirim.disabled = !(foto && (bebas || (pos && pos.ok))); };
  const cam = makeCam($('#camhost'), (d) => { foto = d; cekSiap(); });
  gpsWatch((p) => {
    const chip = $('#gps'); if (!chip) return;
    if (p.err) {
      pos = null;
      if (bebas && !dl) { chip.className = 'chip'; chip.lastChild.textContent = 'Lokasi belum terbaca, tetapi hari ini kamu tetap bisa absen tanpa batas radius.'; }
      else { chip.className = 'chip bad'; chip.lastChild.textContent = p.err; }
      cekSiap(); return;
    }
    pos = { lat: p.lat, lng: p.lng, acc: p.acc, ok: false };
    if (bebas) { pos.ok = true; chip.className = 'chip ok'; chip.lastChild.textContent = dl ? 'Lokasi tercatat (dinas luar tidak dibatasi radius).' : 'Lokasi tercatat (hari libur: tidak dibatasi radius sekolah).'; }
    else if (cfg.lat == null) { chip.className = 'chip bad'; chip.lastChild.textContent = 'Titik lokasi sekolah belum diatur oleh admin.'; }
    else {
      const j = jarakM(p.lat, p.lng, cfg.lat, cfg.lng);
      pos.ok = j <= cfg.radius;
      chip.className = 'chip ' + (pos.ok ? 'ok' : 'bad');
      chip.lastChild.textContent = pos.ok ? `Lokasi sesuai · ${j} m dari sekolah` : `Kamu ${j} m dari sekolah (batas ${cfg.radius} m). Dekati area sekolah.`;
    }
    cekSiap();
  });
  if ($('#lain')) $('#lain').onclick = () => go('status');
  kirim.onclick = async () => {
    $('#err').textContent = ''; busy(kirim, true, 'Mengirim…');
    try {
      const r = await api(jenis, { foto: cam.data, lat: pos ? pos.lat : '', lng: pos ? pos.lng : '', akurasi: pos ? pos.acc : '' }, 90000);
      sukses(jenis, r, cam.data);
    } catch (e) { $('#err').textContent = e.message; busy(kirim, false); cekSiap(); }
  };
}

function sukses(jenis, r, foto) {
  const waktu = jenis === 'pulang' ? r.pulang : r.masuk;
  shell(`<div class="sukses"><div class="ok">${ico('check')}</div><h1>${jenis === 'masuk' ? 'Absen masuk tercatat' : 'Absen pulang tercatat'}</h1>
    <p class="sub">${fTgl(r.tanggal)} · pukul <b>${esc(waktu)}</b> WIB</p><p>${badge(r.status)}</p>${r.ket ? `<p class="sub">${esc(r.ket)}</p>` : ''}
    ${foto ? `<img class="photo" src="${foto}" alt="Foto absen" style="max-width:240px;margin:14px auto">` : ''}</div>
    <button class="btn" id="home" style="margin-top:18px">Ke Beranda</button>`);
  $('#home').onclick = () => go('beranda');
}

/* ---------- IZIN / SAKIT / DINAS LUAR ---------- */
function vStatus() {
  shell(`<h1>Izin / Sakit / Dinas Luar</h1><p class="sub">Pilih status hari ini dan isi keterangan.</p>
    <div class="card"><div class="seg" id="seg"><button class="on" data-s="Izin">Izin</button><button data-s="Sakit">Sakit</button><button data-s="Dinas Luar">Dinas Luar</button></div>
      <label for="ket">Keterangan (wajib)</label><textarea class="input" id="ket" maxlength="300" placeholder="Contoh: keperluan keluarga / demam / mengikuti pelatihan di …"></textarea>
      <div id="gps" class="chip" hidden style="margin-top:12px">${ico('pin')}<span>Mencari lokasi…</span></div>
      <div id="bukti" style="margin-top:12px"><button class="btn btn-ghost" id="tambah">${ico('camera')} Lampirkan foto bukti (opsional)</button></div>
      <p class="err" id="err"></p><button class="btn" id="kirim">Kirim</button></div>
    <button class="btn btn-ghost" data-go="beranda">Batal</button>`);
  $('[data-go=beranda]').onclick = () => go('beranda');
  let st = 'Izin', cam = null, pos = null, gpsOn = false;
  const bukti = $('#bukti');
  const pasangKamera = () => { bukti.innerHTML = '<div id="camhost"></div>'; cam = makeCam($('#camhost')); };
  const aturMode = () => {
    $('#gps').hidden = st !== 'Dinas Luar';
    if (st === 'Dinas Luar') {
      if (!cam) pasangKamera();
      if (!gpsOn) {
        gpsOn = true;
        gpsWatch((p) => {
          const chip = $('#gps'); if (!chip) return;
          if (p.err) { pos = null; chip.className = 'chip bad'; chip.lastChild.textContent = p.err; }
          else { pos = p; chip.className = 'chip ok'; chip.lastChild.textContent = 'Lokasi tercatat.'; }
        });
      }
    }
  };
  $('#tambah').onclick = pasangKamera;
  $$('#seg button').forEach((b) => b.onclick = () => { st = b.dataset.s; $$('#seg button').forEach((x) => x.classList.toggle('on', x === b)); aturMode(); });
  $('#kirim').onclick = async () => {
    const err = $('#err'), btn = $('#kirim'); err.textContent = '';
    const ket = $('#ket').value.trim();
    if (!ket) { err.textContent = 'Keterangan wajib diisi.'; return; }
    if (st === 'Dinas Luar' && !(cam && cam.data)) { err.textContent = 'Untuk dinas luar, ambil foto dari kamera terlebih dahulu.'; return; }
    busy(btn, true, 'Mengirim…');
    try {
      const r = await api('status', { status: st, keterangan: ket, foto: cam ? cam.data : null, lat: pos ? pos.lat : '', lng: pos ? pos.lng : '' }, 90000);
      shell(`<div class="sukses"><div class="ok">${ico('check')}</div><h1>${esc(r.status)} tercatat</h1><p class="sub">${fTgl(r.tanggal)}</p>
        <p class="sub">${esc(r.ket)}</p></div><button class="btn" id="home" style="margin-top:18px">Ke Beranda</button>`);
      $('#home').onclick = () => go('beranda');
    } catch (e) { err.textContent = e.message; busy(btn, false); }
  };
}

/* ---------- RIWAYAT ---------- */
function vRiwayat() {
  const bln0 = isoHari(nowWIB()).slice(0, 7);
  shell(`<h1>Riwayat Kehadiran</h1><label for="bln" style="margin-top:4px">Bulan</label><input class="input" type="month" id="bln" value="${bln0}"><div id="isi" style="margin-top:14px"></div>`);
  const muat = async () => {
    const isi = $('#isi'); isi.innerHTML = skel(90, 80, 80, 80);
    try {
      const r = await api('riwayat', { bulan: $('#bln').value });
      isi.innerHTML = tilesRingkas(r.ringkasan) + (r.daftar.length ? `<div class="card">${r.daftar.map((a, i) => `<div class="list-item" data-i="${i}">
        <div class="avatar">${esc(a.tanggal.slice(8))}</div><div class="grow"><div class="t">${fTgl(a.tanggal)}</div><div class="s">${a.masuk || '-'} – ${a.pulang || '-'}${a.jam ? ' · ' + fJm(a.jam) : ''}</div></div>
        <div class="rh">${badge(a.status)}</div></div>`).join('')}</div>` : vacio('inbox', 'Belum ada data', 'Tidak ada catatan kehadiran pada bulan ini.'));
      $$('.list-item', isi).forEach((el) => el.onclick = () => detailRec(r.daftar[el.dataset.i], S.profil.nama));
    } catch (e) { isi.innerHTML = vacio('inbox', 'Gagal memuat', e.message); }
  };
  $('#bln').onchange = muat; muat();
}

/* ---------- PROFIL ---------- */
function sheetGantiPin() {
  const o = openSheet(`<h1>Ganti PIN</h1><label>PIN lama</label><input class="input" id="pl" type="password" inputmode="numeric">
    <label>PIN baru (6–12 angka)</label><input class="input" id="pb" type="password" inputmode="numeric"><p class="err" id="perr"></p>
    <button class="btn" id="psimpan">Simpan PIN</button>`);
  $('#psimpan', o).onclick = async () => {
    const btn = $('#psimpan', o); busy(btn, true, 'Menyimpan…');
    try {
      const r = await api('ganti_pin', { pinLama: $('#pl', o).value, pinBaru: $('#pb', o).value });
      S.token = r.token; simpanSesi(); o.remove(); toast('PIN berhasil diganti.');
    } catch (e) { $('#perr', o).textContent = e.message; busy(btn, false); }
  };
}

async function vProfil() {
  shell(skel(100, 200));
  try {
    const b = await api('beranda'); syncWaktu(b.waktu); S.profil = b.profil; simpanSesi();
    const p = b.profil, baris = (k, v) => v ? `<div class="kv"><span>${k}</span><b>${esc(v)}</b></div>` : '';
    setView(`<div style="display:flex;gap:14px;align-items:center;margin-bottom:16px"><div class="avatar" style="width:60px;height:60px;border-radius:20px;font-size:1.4rem">${esc(depan(p.nama).slice(0, 1).toUpperCase())}</div>
      <div><h1 style="margin:0">${esc(p.nama)}</h1><div class="sub" style="margin:0">${esc(p.jabatan || 'Guru')}</div></div></div>
      <div class="card">${baris('NIP', p.nip)}${baris('Mata pelajaran', p.mapel)}${baris('No HP', p.hp)}${baris('Email', p.email)}</div>
      <h2>Tugas &amp; tanggung jawab</h2><div class="card"><div class="pre">${p.tugas ? esc(p.tugas) : '<span class="muted">Belum diisi. Hubungi admin untuk melengkapi.</span>'}</div></div>
      <button class="btn btn-ghost" id="pin">Ganti PIN</button>${installBox()}
      <button class="btn btn-ghost" id="out" style="margin-top:14px">${ico('logout')} Keluar</button>`);
    $('#pin').onclick = sheetGantiPin; $('#out').onclick = () => keluar(false); bindInstall();
  } catch (e) { errView(e, () => go('profil')); }
}

/* ---------- ADMIN: DASHBOARD ---------- */
async function vADash() {
  shell(skel(120, 90, 300));
  try {
    const [d, rg] = await Promise.all([api('admin_beranda'), api('ringkasan')]);
    syncWaktu(d.waktu); S.config = d.config;
    const r = d.ringkas;
    setView(`<div style="display:flex;justify-content:space-between;align-items:center"><div><h1>Dashboard</h1><p class="sub" style="margin:0">${fTglPanjang(new Date(d.tanggal + 'T12:00:00Z'))}</p></div>
      <button class="btn btn-ghost btn-sm" id="seg" aria-label="Muat ulang">${ico('refresh')}</button></div>
      <h2>Hari ini</h2>${d.libur ? `<div class="chip ok">${ico('check')}<span>Hari libur: ${esc(d.libur)}. Guru yang tetap bekerja tercatat Lembur.</span></div>` : ''}<div class="tiles t4">${tile(r.hadir, 'Hadir', 'hadir')}${tile(r.terlambat, 'Terlambat', 'terlambat')}${tile(r.izin, 'Izin', 'izin')}${tile(r.sakit, 'Sakit', 'sakit')}${tile(r.dl, 'Dinas Luar', 'dl')}${tile(r.lembur, 'Lembur', 'lembur')}${tile(r.alpa, 'Alpa', 'alpa')}${tile(r.belum, 'Belum absen')}</div>
      <div class="card">${d.daftar.length ? d.daftar.map((g, i) => `<div class="list-item" data-i="${i}"><div class="avatar">${esc(depan(g.nama).slice(0, 1).toUpperCase())}</div>
        <div class="grow"><div class="t">${esc(g.nama)}</div><div class="s">${esc(g.mapel || '-')}</div></div>
        <div class="rh">${g.rec ? badge(g.rec.status) + `<div>${g.rec.masuk || '-'} – ${g.rec.pulang || '-'}</div>` : badge(g.status || (d.libur ? 'Libur' : 'Belum absen'))}</div></div>`).join('')
        : vacio('users', 'Belum ada guru', 'Tambahkan guru di menu Guru.')}</div>
      <h2>Bulan ini (semua guru)</h2>${tilesRingkas(rg.bulanIni)}
      <h2>Kehadiran per bulan ${rg.tahun}</h2><div class="card chart">${chartBulan(rg.perBulan)}${legend()}</div>`);
    $('#seg').onclick = () => go('a_dash');
    $$('.list-item', $('main')).forEach((el) => el.onclick = () => {
      const g = d.daftar[el.dataset.i];
      if (g.rec) detailRec(g.rec, g.nama); else toast(g.nama + ' belum ada catatan hari ini.');
    });
  } catch (e) { errView(e, () => go('a_dash')); }
}

/* ---------- ADMIN: GURU ---------- */
async function vAGuru() {
  shell(skel(50, 300));
  try {
    let daftar = await api('guru_daftar');
    const gambar = (q) => {
      const l = daftar.filter((g) => !q || (g.nama + g.nip + g.mapel).toLowerCase().includes(q.toLowerCase()));
      $('#lst').innerHTML = l.length ? l.map((g) => `<div class="list-item" data-nip="${esc(g.nip)}"><div class="avatar">${esc(depan(g.nama).slice(0, 1).toUpperCase())}</div>
        <div class="grow"><div class="t">${esc(g.nama)}</div><div class="s">${esc(g.nip)} · ${esc(g.mapel || '-')}</div></div>${g.aktif === 'TIDAK' ? '<span class="badge">Nonaktif</span>' : ''}</div>`).join('')
        : vacio('users', 'Tidak ditemukan', 'Belum ada data guru yang cocok.');
      $$('.list-item', $('#lst')).forEach((el) => el.onclick = () => form(daftar.find((g) => g.nip === el.dataset.nip)));
    };
    setView(`<h1>Data Guru</h1><p class="sub">${daftar.length} guru terdaftar</p><button class="btn" id="tambah">${ico('plus')} Tambah Guru</button>
      <input class="input" id="cari" placeholder="Cari nama / NIP / mapel" style="margin:14px 0"><div class="card" id="lst"></div>`);
    gambar('');
    $('#cari').oninput = (e) => gambar(e.target.value);
    $('#tambah').onclick = () => form(null);
  } catch (e) { return errView(e, () => go('a_guru')); }

  function form(g) {
    const edit = !!g; g = g || {};
    const o = openSheet(`<h1>${edit ? 'Ubah Data Guru' : 'Tambah Guru'}</h1>
      <label>NIP</label><input class="input" id="f-nip" value="${esc(g.nip || '')}" ${edit ? 'disabled' : ''} placeholder="NIP">
      <label>Nama lengkap</label><input class="input" id="f-nama" value="${esc(g.nama || '')}">
      <label>Mata pelajaran</label><input class="input" id="f-mapel" value="${esc(g.mapel || '')}">
      <label>Jabatan</label><input class="input" id="f-jab" value="${esc(g.jabatan || '')}" placeholder="Contoh: Guru Kelas / Wali Kelas 3">
      <label>No HP</label><input class="input" id="f-hp" inputmode="tel" value="${esc(g.hp || '')}">
      <label>Email</label><input class="input" id="f-em" inputmode="email" value="${esc(g.email || '')}">
      <label>Tugas &amp; tanggung jawab</label><textarea class="input" id="f-tugas" maxlength="1500">${esc(g.tugas || '')}</textarea>
      <label>${edit ? 'PIN baru (kosongkan jika tidak diubah)' : 'PIN awal (6–12 angka)'}</label><input class="input" id="f-pin" inputmode="numeric" placeholder="••••••">
      ${edit ? `<label>Status</label><select class="input" id="f-aktif"><option value="YA" ${g.aktif !== 'TIDAK' ? 'selected' : ''}>Aktif</option><option value="TIDAK" ${g.aktif === 'TIDAK' ? 'selected' : ''}>Nonaktif</option></select>` : ''}
      <p class="err" id="f-err"></p><button class="btn" id="f-simpan">Simpan</button>`);
    $('#f-simpan', o).onclick = async () => {
      const btn = $('#f-simpan', o), v = (id) => $('#' + id, o).value;
      busy(btn, true, 'Menyimpan…');
      try {
        await api('guru_simpan', { edit, nip: v('f-nip').trim() || g.nip, nama: v('f-nama'), mapel: v('f-mapel'), jabatan: v('f-jab'), hp: v('f-hp'), email: v('f-em'), tugas: v('f-tugas'), pin: v('f-pin'), aktif: edit ? v('f-aktif') : 'YA' });
        o.remove(); toast('Data guru disimpan.'); go('a_guru');
      } catch (e) { $('#f-err', o).textContent = e.message; busy(btn, false); }
    };
  }
}

/* ---------- ADMIN: EKSPOR ---------- */
async function vAEkspor() {
  shell(skel(60, 300));
  let guru = [];
  try { guru = await api('guru_daftar'); } catch (e) { return errView(e, () => go('a_ekspor')); }
  const h = isoHari(nowWIB());
  setView(`<h1>Ekspor Spreadsheet</h1><p class="sub">Membuat file Google Sheets baru sesuai periode yang dipilih.</p>
    <div class="card"><div class="seg" id="mode"><button class="on" data-m="harian">Harian</button><button data-m="bulanan">Bulanan</button><button data-m="rentang">Rentang</button></div>
      <div id="f-harian"><label>Tanggal</label><input class="input" type="date" id="d1" value="${h}"></div>
      <div id="f-bulanan" hidden><label>Bulan</label><input class="input" type="month" id="bln" value="${h.slice(0, 7)}"></div>
      <div id="f-rentang" hidden><div class="row"><div><label>Dari</label><input class="input" type="date" id="r1" value="${h.slice(0, 8)}01"></div><div><label>Sampai</label><input class="input" type="date" id="r2" value="${h}"></div></div></div>
      <label>Guru</label><select class="input" id="gsel"><option value="">Semua guru</option>${guru.map((g) => `<option value="${esc(g.nip)}">${esc(g.nama)}</option>`).join('')}</select>
      <label style="display:flex;gap:10px;align-items:center;margin-top:16px"><input type="checkbox" id="cfoto" checked style="width:20px;height:20px"> Sertakan foto di spreadsheet</label>
      <p class="err" id="err"></p><button class="btn" id="buat">${ico('download')} Buat Spreadsheet</button></div><div id="hasil"></div>`);
  let mode = 'harian';
  $$('#mode button').forEach((b) => b.onclick = () => {
    mode = b.dataset.m; $$('#mode button').forEach((x) => x.classList.toggle('on', x === b));
    ['harian', 'bulanan', 'rentang'].forEach((m) => { $('#f-' + m).hidden = m !== mode; });
  });
  $('#buat').onclick = async () => {
    const btn = $('#buat'), err = $('#err'); err.textContent = ''; $('#hasil').innerHTML = '';
    busy(btn, true, 'Menyiapkan… bisa sampai 1 menit');
    try {
      const r = await api('ekspor', { mode, dari: mode === 'harian' ? $('#d1').value : $('#r1').value, sampai: $('#r2').value, bulan: $('#bln').value, nip: $('#gsel').value, foto: $('#cfoto').checked }, 240000);
      $('#hasil').innerHTML = `<div class="card"><div class="sukses" style="padding-top:6px"><div class="ok" style="width:64px;height:64px">${ico('check')}</div><h1 style="font-size:1.1rem">Spreadsheet siap</h1></div>
        <p class="sub" style="text-align:center">${esc(r.nama)}<br>${r.jumlah} baris data${r.fotoTertanam ? ' · ' + r.fotoTertanam + ' foto tertanam' : ''}</p>
        <a class="btn" href="${esc(r.url)}" target="_blank" rel="noopener" style="text-decoration:none">Buka di Google Sheets</a>
        <a class="btn btn-ghost" href="${esc(r.xlsx)}" target="_blank" rel="noopener" style="text-decoration:none;margin-top:10px">Unduh sebagai .xlsx</a>
        <p class="sub small" style="margin:10px 0 0">Buka dengan akun Google yang sama dengan pemilik spreadsheet.</p></div>`;
    } catch (e) { err.textContent = e.message; }
    busy(btn, false);
  };
}

/* ---------- ADMIN: PENGATURAN ---------- */
async function vASet() {
  shell(skel(300));
  try {
    const d = await api('admin_beranda'); S.config = d.config;
    const c = d.config, v = (x) => (x == null ? '' : esc(x));
    setView(`<h1>Pengaturan</h1><p class="sub">Aturan jam kerja dan titik lokasi sekolah.</p>
      <div class="card"><label>Nama sekolah</label><input class="input" id="s-nama" value="${v(c.namaSekolah)}">
      <div class="row"><div><label>Jam masuk</label><input class="input" type="time" id="s-jm" value="${v(c.jamMasuk)}"></div><div><label>Jam pulang</label><input class="input" type="time" id="s-jp" value="${v(c.jamPulang)}"></div></div>
      <div class="row"><div><label>Toleransi (menit)</label><input class="input" type="number" min="0" max="120" id="s-tol" value="${v(c.toleransi)}"></div><div><label>Radius absen (m)</label><input class="input" type="number" min="20" max="2000" id="s-rad" value="${v(c.radius)}"></div></div>
      <div class="row"><div><label>Latitude sekolah</label><input class="input" id="s-lat" inputmode="decimal" value="${v(c.lat)}"></div><div><label>Longitude sekolah</label><input class="input" id="s-lng" inputmode="decimal" value="${v(c.lng)}"></div></div>
      <button class="btn btn-ghost" id="lok" style="margin-top:12px">${ico('pin')} Pakai lokasi saya sekarang</button>
      <p class="err" id="err"></p><button class="btn" id="simpan">Simpan Pengaturan</button></div>
      <h2>Hari libur nasional &amp; cuti bersama</h2><div class="card" id="libur-box">${skel(60)}</div>
      <button class="btn btn-ghost" id="pin">Ganti PIN Admin</button><button class="btn btn-ghost" id="out" style="margin-top:10px">${ico('logout')} Keluar</button>`);
    $('#lok').onclick = () => {
      const btn = $('#lok'); busy(btn, true, 'Membaca lokasi…');
      navigator.geolocation.getCurrentPosition((p) => {
        $('#s-lat').value = p.coords.latitude.toFixed(7); $('#s-lng').value = p.coords.longitude.toFixed(7);
        busy(btn, false); toast('Koordinat terisi (akurasi ±' + Math.round(p.coords.accuracy) + ' m). Jangan lupa Simpan.');
      }, () => { busy(btn, false); toast('Lokasi tidak terbaca. Aktifkan GPS & izin lokasi.', true); }, { enableHighAccuracy: true, timeout: 20000 });
    };
    $('#simpan').onclick = async () => {
      const btn = $('#simpan'); $('#err').textContent = ''; busy(btn, true, 'Menyimpan…');
      try {
        S.config = await api('pengaturan_simpan', { namaSekolah: $('#s-nama').value, jamMasuk: $('#s-jm').value, jamPulang: $('#s-jp').value, toleransi: $('#s-tol').value, radius: $('#s-rad').value, lat: $('#s-lat').value, lng: $('#s-lng').value });
        toast('Pengaturan disimpan.');
      } catch (e) { $('#err').textContent = e.message; }
      busy(btn, false);
    };
    $('#pin').onclick = sheetGantiPin; $('#out').onclick = () => keluar(false);
    const muatLibur = async () => {
      const box = $('#libur-box');
      if (!box) return;
      try {
        const h = isoHari(nowWIB());
        const l = (await api('libur_daftar')).filter((x) => x.tanggal >= h);
        box.innerHTML = `<p class="sub">Tanggal di bawah ini dianggap libur: guru tidak dihitung Alpa, dan yang tetap bekerja tercatat Lembur. Sabtu dan Minggu sudah otomatis libur.</p>
          ${l.length ? l.map((x) => `<div class="kv"><span>${fTgl(x.tanggal)} ${x.tanggal.slice(0, 4)} · ${esc(x.ket)}</span><button class="btn btn-ghost btn-sm" data-del="${esc(x.tanggal)}">Hapus</button></div>`).join('') : vacio('inbox', 'Belum ada hari libur', 'Tambahkan tanggal libur nasional atau cuti bersama.')}
          <label>Tanggal</label><input class="input" type="date" id="l-tgl">
          <label>Keterangan</label><input class="input" id="l-ket" maxlength="80" placeholder="Contoh: Hari Natal">
          <p class="err" id="l-err"></p><button class="btn" id="l-add">${ico('plus')} Tambah Hari Libur</button>`;
        $$('[data-del]', box).forEach((b) => b.onclick = async () => {
          busy(b, true, '');
          try { await api('libur_hapus', { tanggal: b.dataset.del }); toast('Hari libur dihapus.'); muatLibur(); }
          catch (e) { busy(b, false); toast(e.message, true); }
        });
        $('#l-add').onclick = async () => {
          const btn = $('#l-add'); $('#l-err').textContent = ''; busy(btn, true, 'Menyimpan…');
          try { await api('libur_simpan', { tanggal: $('#l-tgl').value, ket: $('#l-ket').value }); toast('Hari libur ditambahkan.'); muatLibur(); }
          catch (e) { $('#l-err').textContent = e.message; busy(btn, false); }
        };
      } catch (e) { box.innerHTML = vacio('inbox', 'Gagal memuat', e.message); }
    };
    muatLibur();
  } catch (e) { errView(e, () => go('a_set')); }
}

/* ---------- Mulai ---------- */
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); S.installEvt = e; });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
if (muatSesi()) go(S.role === 'admin' ? 'a_dash' : 'beranda'); else go('login');
})();
