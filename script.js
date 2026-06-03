/* ============================================================
   KELURAHAN JATINOM — SKRIP UTAMA
   ============================================================ */

'use strict';

// ── TEMA GELAP / TERANG ──────────────────────────────────────
const htmlEl    = document.documentElement;
const btnTema   = document.getElementById('btn-tema');

function setTema(tema) {
  htmlEl.setAttribute('data-theme', tema);
  localStorage.setItem('tema-jatinom', tema);
  if (btnTema) btnTema.textContent = tema === 'dark' ? '☀️' : '🌙';
}

// Init tema dari localStorage
const temaTersimpan = localStorage.getItem('tema-jatinom') || 'light';
setTema(temaTersimpan);

if (btnTema) {
  btnTema.addEventListener('click', () => {
    const temaSaat = htmlEl.getAttribute('data-theme');
    setTema(temaSaat === 'dark' ? 'light' : 'dark');
  });
}

// ── NAVBAR SCROLL ────────────────────────────────────────────
const navbar = document.getElementById('navbar');

function handleScroll() {
  if (!navbar) return;
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back to top
  const backTop = document.getElementById('back-top');
  if (backTop) {
    if (window.scrollY > 400) {
      backTop.classList.add('terlihat');
    } else {
      backTop.classList.remove('terlihat');
    }
  }

  // Progress bar
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const persen = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressBar.style.width = persen + '%';
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });

// ── BACK TO TOP ──────────────────────────────────────────────
const backTop = document.getElementById('back-top');
if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── HAMBURGER MENU ───────────────────────────────────────────
const btnHamburger = document.getElementById('btn-hamburger');
const navMenu      = document.getElementById('nav-menu');

if (btnHamburger && navMenu) {
  btnHamburger.addEventListener('click', () => {
    navMenu.classList.toggle('aktif');
    const isAktif = navMenu.classList.contains('aktif');
    btnHamburger.setAttribute('aria-expanded', isAktif);
    document.body.style.overflow = isAktif ? 'hidden' : '';
  });

  // Tutup saat klik link
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('aktif');
      document.body.style.overflow = '';
    });
  });
}

// ── SEARCH OVERLAY ───────────────────────────────────────────
const btnCari       = document.getElementById('btn-cari');
const searchOverlay = document.getElementById('search-overlay');
const btnTutupCari  = document.getElementById('btn-tutup-search');
const inputCari     = document.getElementById('input-cari');

function bukaSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.add('aktif');
  document.body.style.overflow = 'hidden';
  setTimeout(() => inputCari && inputCari.focus(), 300);
}

function tutupSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.remove('aktif');
  document.body.style.overflow = '';
}

if (btnCari) btnCari.addEventListener('click', bukaSearch);
if (btnTutupCari) btnTutupCari.addEventListener('click', tutupSearch);

if (searchOverlay) {
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) tutupSearch();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') tutupSearch();
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    bukaSearch();
  }
});

// Fungsi pencarian sederhana (highlight teks di halaman)
if (inputCari) {
  inputCari.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const kata = inputCari.value.trim().toLowerCase();
      if (!kata) return;

      tutupSearch();

      // Hapus highlight lama
      document.querySelectorAll('mark').forEach(m => {
        const parent = m.parentNode;
        parent.replaceChild(document.createTextNode(m.textContent), m);
        parent.normalize();
      });

      if (!kata) return;

      // Highlight baru
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);

      let pertama = null;
      nodes.forEach(node => {
        if (!node.nodeValue.toLowerCase().includes(kata)) return;
        if (node.parentElement.closest('#search-overlay, script, style')) return;

        const regex = new RegExp(`(${kata})`, 'gi');
        const frag = document.createDocumentFragment();
        node.nodeValue.split(regex).forEach(bagian => {
          if (bagian.toLowerCase() === kata) {
            const mark = document.createElement('mark');
            mark.textContent = bagian;
            if (!pertama) pertama = mark;
            frag.appendChild(mark);
          } else {
            frag.appendChild(document.createTextNode(bagian));
          }
        });
        node.parentNode.replaceChild(frag, node);
      });

      if (pertama) {
        setTimeout(() => pertama.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
      }
    }
  });
}

// ── MODAL ────────────────────────────────────────────────────
function bukaModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('aktif');
  document.body.style.overflow = 'hidden';
}

function tutupModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('aktif');
  document.body.style.overflow = '';
}

// Tombol buka modal
const btnAduan    = document.getElementById('btn-aduan');
const btnPenilaian = document.getElementById('btn-penilaian');

if (btnAduan)    btnAduan.addEventListener('click', () => bukaModal('modal-aduan'));
if (btnPenilaian) btnPenilaian.addEventListener('click', () => bukaModal('modal-penilaian'));

// Tombol tutup modal
document.querySelectorAll('[data-tutup]').forEach(btn => {
  btn.addEventListener('click', () => tutupModal(btn.dataset.tutup));
});

// Klik di luar modal
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) tutupModal(overlay.id);
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.aktif').forEach(m => {
      tutupModal(m.id);
    });
  }
});

// ── ANIMASI SAMBUTAN SISTEM (AUTOPLAY SEKALI, BISA REPLAY) ──
const videoAnimasi = document.getElementById('videoAnimasiSambutan');
const replayAnimasi = document.getElementById('replayAnimasiSambutan');

if (videoAnimasi) {
  // Cek apakah sudah diputar di sesi ini
  const sudahDiputarSesi = sessionStorage.getItem('animasiSambutanDiputar');
  
  if (!sudahDiputarSesi) {
    // Autoplay dengan suara (tidak muted)
    videoAnimasi.muted = false;
    videoAnimasi.play().catch(e => {
      console.log('Autoplay animasi sambutan diblokir browser:', e);
    });
    sessionStorage.setItem('animasiSambutanDiputar', 'true');
  }
  
  // Tombol replay
  if (replayAnimasi) {
    replayAnimasi.addEventListener('click', function() {
      videoAnimasi.currentTime = 0;
      videoAnimasi.muted = false;
      videoAnimasi.play().catch(e => console.log('Replay error:', e));
    });
  }
}

// ── RATING BINTANG ───────────────────────────────────────────
const ratingWrapper = document.getElementById('rating-bintang');
if (ratingWrapper) {
  const bintangEls = ratingWrapper.querySelectorAll('.bintang');
  let nilaiTerpilih = 0;

  bintangEls.forEach((bintang, idx) => {
    bintang.addEventListener('mouseenter', () => {
      bintangEls.forEach((b, i) => {
        b.style.color = i <= idx ? 'var(--emas)' : 'rgba(201,168,76,0.3)';
      });
    });

    bintang.addEventListener('mouseleave', () => {
      bintangEls.forEach((b, i) => {
        b.style.color = i < nilaiTerpilih ? 'var(--emas)' : 'rgba(201,168,76,0.3)';
      });
    });

    bintang.addEventListener('click', () => {
      nilaiTerpilih = idx + 1;
      bintangEls.forEach((b, i) => {
        b.style.color = i < nilaiTerpilih ? 'var(--emas)' : 'rgba(201,168,76,0.3)';
      });
    });
  });
}

// ── INTERSECTION OBSERVER (animasi masuk) ────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('terlihat');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-masuk').forEach(el => observer.observe(el));

// ── AKTIF NAV LINK ───────────────────────────────────────────
(function tandaiNavAktif() {
  const halamanSaat = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop();
    if (linkPath === halamanSaat) {
      link.classList.add('aktif');
    } else {
      link.classList.remove('aktif');
    }
  });
})();

// ── KIRIM FORM (UI only — statis) ────────────────────────────
document.querySelectorAll('.btn-primer').forEach(btn => {
  if (btn.closest('.modal-konten')) {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (!modal) return;

      // Reset & feedback
      btn.textContent = '✓ Terkirim!';
      btn.style.background = '#2ECC71';
      btn.style.color = '#fff';

      setTimeout(() => {
        btn.textContent = btn.dataset.teks || 'Kirim';
        btn.style.background = '';
        btn.style.color = '';
        tutupModal(modal.id);
      }, 2000);
    });
  }
});

// Simpan teks asli tombol
document.querySelectorAll('.modal-konten .btn-primer').forEach(btn => {
  btn.dataset.teks = btn.textContent;
});
// Memaksa video hero dan video sambutan untuk play otomatis di laptop yang bandel
window.addEventListener('DOMContentLoaded', () => {
  const heroVideo = document.querySelector('.hero-video');
  const sambutanVideo = document.getElementById('videoAnimasiSambutan');

  // Jika video hero ditemukan, paksa putar
  if (heroVideo) {
    heroVideo.muted = true; // Wajib disetel mute lewat sistem kode
    heroVideo.play().catch(error => console.log("Autoplay hero diblokir browser:", error));
  }

  // Jika video animasi sambutan ditemukan, paksa putar
  if (sambutanVideo) {
    sambutanVideo.muted = true;
    sambutanVideo.play().catch(error => console.log("Autoplay sambutan diblokir browser:", error));
  }
});
