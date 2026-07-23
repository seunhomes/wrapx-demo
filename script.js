/* =========================================================
   WRAPX — site config
   Fill these in to go fully live with GoHighLevel.
   GHL Location ID: yvbhY9lzSbHoq48QIOi5
   ========================================================= */
const SITE = {
  // 1) OPTIONAL: GHL Calendar embed URL. If set, the real GHL calendar replaces the
  //    built-in booking calendar. In GHL: Calendars > your calendar > "..." > Embed.
  //    e.g. "https://api.leadconnectorhq.com/widget/booking/XXXXXXXX"
  ghlCalendarUrl: "",

  // 2) GHL Inbound Webhook URL. Booking requests + quote-form leads POST here.
  //    GHL: Automation > Workflows > new > "Inbound Webhook" trigger > copy URL.
  //    Leave blank to fall back to the visitor's email app.
  ghlLeadWebhook: "",
};
const LOCATION_ID = "yvbhY9lzSbHoq48QIOi5";

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
}, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 60 + 'ms';
  io.observe(el);
});

/* ===== Send a lead/booking to GHL (or email fallback) ===== */
async function postLead(data) {
  data.source = 'wrapx-website';
  data.location_id = LOCATION_ID;
  if (SITE.ghlLeadWebhook) {
    try {
      await fetch(SITE.ghlLeadWebhook, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
      return 'webhook';
    } catch (e) { /* fall through */ }
  }
  return 'mailto';
}

/* ===== Booking: GHL iframe OR built-in calendar ===== */
(function mountBooking() {
  const mount = document.getElementById('ghlCalendar');
  if (!mount) return;

  if (SITE.ghlCalendarUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = SITE.ghlCalendarUrl;
    iframe.title = 'Book a WRAPX appointment';
    iframe.loading = 'lazy';
    iframe.setAttribute('scrolling', 'no');
    mount.appendChild(iframe);
    const s = document.createElement('script');
    s.src = 'https://link.msgsndr.com/js/form_embed.js';
    s.async = true;
    document.body.appendChild(s);
    return;
  }
  renderBooker(mount);
})();

function renderBooker(mount) {
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DOW = ['S','M','T','W','T','F','S'];
  const TIMES = ['10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'];
  const today = new Date(); today.setHours(0,0,0,0);
  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  let picked = null, pickedTime = null;

  mount.classList.add('is-booker');
  mount.innerHTML = `
    <div class="booker">
      <div class="booker__bar">
        <button type="button" class="booker__arrow" data-prev aria-label="Previous month">&#8249;</button>
        <strong data-month></strong>
        <button type="button" class="booker__arrow" data-next aria-label="Next month">&#8250;</button>
      </div>
      <div class="booker__dow">${DOW.map(d => `<span>${d}</span>`).join('')}</div>
      <div class="booker__grid" data-grid></div>
      <div class="booker__panel">
        <p class="booker__hint" data-hint>Select a date to see available times.</p>
        <div class="booker__times" data-times hidden></div>
        <form class="booker__form" data-form hidden>
          <p class="booker__chosen" data-chosen></p>
          <input type="text" name="name" required placeholder="Your name" autocomplete="name" />
          <input type="tel" name="phone" required placeholder="Phone number" autocomplete="tel" />
          <select name="service" aria-label="Service">
            <option>Full Colour Change</option>
            <option>Paint Protection Film</option>
            <option>Ceramic Window Tint</option>
            <option>Chrome Delete</option>
            <option>Commercial Wrap</option>
            <option>Consultation</option>
          </select>
          <button type="submit" class="btn btn--full">Request This Slot</button>
          <p class="booker__done" data-done hidden></p>
        </form>
      </div>
    </div>`;

  const $ = s => mount.querySelector(s);
  const grid = $('[data-grid]'), monthEl = $('[data-month]'), hint = $('[data-hint]');
  const timesWrap = $('[data-times]'), form = $('[data-form]'), chosen = $('[data-chosen]'), done = $('[data-done]');
  const fmt = d => d.toLocaleDateString('en-CA', { weekday:'long', month:'long', day:'numeric' });

  function renderGrid() {
    monthEl.textContent = `${MONTHS[view.getMonth()]} ${view.getFullYear()}`;
    const start = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
    const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    let html = '';
    for (let i = 0; i < start; i++) html += '<span class="booker__day booker__day--empty"></span>';
    for (let d = 1; d <= days; d++) {
      const date = new Date(view.getFullYear(), view.getMonth(), d);
      const off = date < today || date.getDay() === 0; // past or Sunday (closed)
      const sel = picked && date.getTime() === picked.getTime();
      html += `<button type="button" class="booker__day${off ? ' is-off' : ''}${sel ? ' is-sel' : ''}" ${off ? 'disabled' : ''} data-day="${date.toISOString()}">${d}</button>`;
    }
    grid.innerHTML = html;
  }
  function renderTimes() {
    timesWrap.hidden = false;
    timesWrap.innerHTML = TIMES.map(t => `<button type="button" class="booker__time${pickedTime === t ? ' is-sel' : ''}" data-time="${t}">${t}</button>`).join('');
  }

  mount.addEventListener('click', (e) => {
    if (e.target.closest('[data-prev]')) { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderGrid(); return; }
    if (e.target.closest('[data-next]')) { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderGrid(); return; }
    const day = e.target.closest('[data-day]');
    if (day && !day.disabled) {
      picked = new Date(day.dataset.day); picked.setHours(0,0,0,0); pickedTime = null;
      renderGrid(); hint.textContent = 'Now pick a time:'; renderTimes(); form.hidden = true; return;
    }
    const time = e.target.closest('[data-time]');
    if (time) {
      pickedTime = time.dataset.time; renderTimes();
      form.hidden = false; chosen.textContent = `${fmt(picked)} · ${pickedTime}`; return;
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Sending…';
    const data = {
      name: form.name.value, phone: form.phone.value, service: form.service.value,
      appointment: `${fmt(picked)} at ${pickedTime}`, type: 'booking',
    };
    const via = await postLead(data);
    if (via === 'mailto') {
      const body = `Booking request%0D%0AName: ${data.name}%0D%0APhone: ${data.phone}%0D%0AService: ${data.service}%0D%0AWhen: ${data.appointment}`;
      window.location.href = `mailto:gtawrapx@gmail.com?subject=${encodeURIComponent('Booking — ' + data.appointment)}&body=${body}`;
    }
    form.querySelectorAll('input,select,button').forEach(el => el.style.display = 'none');
    chosen.style.display = 'none';
    done.hidden = false;
    done.textContent = `Thanks ${(data.name.split(' ')[0] || '')}! We'll text you to confirm ${data.appointment}.`;
  });

  renderGrid();
}

/* ===== Quote lead form -> GHL (fallback: mailto) ===== */
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
  const data = Object.fromEntries(new FormData(form).entries());
  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true; btn.textContent = 'Sending…';
  const via = await postLead(data);
  if (via === 'webhook') {
    form.reset();
    showHint("Thanks! We got your request and we'll reply fast — usually same day.");
  } else {
    const body = [
      `Name: ${data.name || ''}`, `Phone: ${data.phone || ''}`, `Email: ${data.email || ''}`,
      `Vehicle: ${data.vehicle || ''}`, `Service: ${data.service || ''}`, '', `${data.msg || ''}`,
    ].join('\n');
    window.location.href = `mailto:gtawrapx@gmail.com?subject=${encodeURIComponent('Quote request — ' + (data.service || 'WRAPX'))}&body=${encodeURIComponent(body)}`;
    showHint("Your request opened in your email app — hit send and we'll reply fast.");
  }
  btn.disabled = false; btn.textContent = 'Request My Quote';
});

/* ===== Instagram embeds (portfolio feed) ===== */
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
