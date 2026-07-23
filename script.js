/* =========================================================
   WRAPX — site config
   Fill these in to go fully live with GoHighLevel.
   GHL Location ID: yvbhY9lzSbHoq48QIOi5
   ========================================================= */
const SITE = {
  // 1) GHL Calendar embed URL. In GHL: Calendars > your calendar > "..." > Embed code.
  //    Paste ONLY the src URL, e.g. "https://api.leadconnectorhq.com/widget/booking/XXXXXXXX"
  ghlCalendarUrl: "",

  // 2) GHL Inbound Webhook URL for lead-form submissions.
  //    In GHL: Automation > Workflows > new workflow > "Inbound Webhook" trigger > copy the URL.
  //    Leave blank to fall back to opening the visitor's email app.
  ghlLeadWebhook: "",
};

/* ===== Nav: solid on scroll ===== */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ===== Mobile menu ===== */
const burger = document.getElementById('burger');
const links = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.classList.toggle('burger-open');
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
});
links.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    links.classList.remove('open');
    burger.classList.remove('burger-open');
    burger.setAttribute('aria-expanded', 'false');
  })
);

/* ===== Scroll reveal ===== */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 60 + 'ms';
  io.observe(el);
});

/* ===== GHL booking calendar ===== */
(function mountCalendar() {
  const mount = document.getElementById('ghlCalendar');
  if (!mount || !SITE.ghlCalendarUrl) return;
  mount.innerHTML = '';
  const iframe = document.createElement('iframe');
  iframe.src = SITE.ghlCalendarUrl;
  iframe.title = 'Book a WRAPX appointment';
  iframe.loading = 'lazy';
  iframe.setAttribute('scrolling', 'no');
  mount.appendChild(iframe);
  // GHL resize helper
  const s = document.createElement('script');
  s.src = 'https://link.msgsndr.com/js/form_embed.js';
  s.async = true;
  document.body.appendChild(s);
})();

/* ===== Lead form -> GHL webhook (fallback: mailto) ===== */
const form = document.getElementById('leadForm');
const hint = document.getElementById('formHint');

function showHint(msg, ok = true) {
  hint.textContent = msg;
  hint.style.color = ok ? 'var(--a1)' : '#ff6b6b';
  hint.hidden = false;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const f = new FormData(form);
  const data = Object.fromEntries(f.entries());
  data.source = 'wrapx-website';
  data.location_id = 'yvbhY9lzSbHoq48QIOi5';

  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  if (SITE.ghlLeadWebhook) {
    try {
      // urlencoded + no-cors = no preflight; lands in the GHL workflow
      await fetch(SITE.ghlLeadWebhook, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
      form.reset();
      showHint("Thanks! We got your request and we'll reply fast — usually same day.");
    } catch (err) {
      mailtoFallback(data);
    }
  } else {
    mailtoFallback(data);
  }
  btn.disabled = false;
  btn.textContent = 'Request My Quote';
});

function mailtoFallback(data) {
  const body = [
    `Name: ${data.name || ''}`,
    `Phone: ${data.phone || ''}`,
    `Email: ${data.email || ''}`,
    `Vehicle: ${data.vehicle || ''}`,
    `Service: ${data.service || ''}`,
    '',
    `${data.msg || ''}`,
  ].join('\n');
  const subject = `Quote request — ${data.service || 'WRAPX'}`;
  window.location.href =
    `mailto:gtawrapx@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  showHint('Your request opened in your email app — hit send and we\'ll reply fast.');
}

/* ===== Instagram embed (owner video) ===== */
(function loadInstagram() {
  if (!document.querySelector('.instagram-media')) return;
  const s = document.createElement('script');
  s.src = 'https://www.instagram.com/embed.js';
  s.async = true;
  s.onload = () => window.instgrm && window.instgrm.Embeds.process();
  document.body.appendChild(s);
})();

/* ===== Year ===== */
document.getElementById('year').textContent = new Date().getFullYear();
