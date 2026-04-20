// ---- Intersection Observer: fade-in ----
(function(){
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

// ---- Tweaks / Edit mode ----
(function(){
  const panel = document.getElementById('tweakPanel');
  if (!panel) return;
  const tpClose = document.getElementById('tpClose');
  const tpHeadline = document.getElementById('tpHeadline');
  const tpAccent = document.getElementById('tpAccent');
  const tpForm = document.getElementById('tpForm');

  const state = Object.assign({}, window.TWEAK_DEFAULTS || {});

  function apply() {
    if (state.accentOrange) document.documentElement.style.setProperty('--orange', state.accentOrange);
    if (state.primaryNavy) document.documentElement.style.setProperty('--navy', state.primaryNavy);
    const h1 = document.getElementById('heroHeadline');
    if (h1 && state.headline) {
      h1.innerHTML = state.headline
        .replace(/(スマホで撮るだけ)/, '<span class="mark">$1</span>')
        .replace(/、/g, '、<br>')
        .replace(/<br>(\s*)$/, '');
    }
    if (state.formUrl) {
      document.querySelectorAll('a[data-form-link]').forEach(a => {
        a.href = state.formUrl;
      });
    }
  }

  function pushEdit(edits) {
    try {
      window.parent.postMessage({type: '__edit_mode_set_keys', edits}, '*');
    } catch(e){}
  }

  function fill() {
    tpHeadline.value = state.headline || '';
    tpAccent.value = state.accentOrange || '#FF7A00';
    tpForm.value = state.formUrl || '';
  }

  window.addEventListener('message', (ev) => {
    const d = ev.data || {};
    if (d.type === '__activate_edit_mode'){
      panel.classList.add('on');
      fill();
    } else if (d.type === '__deactivate_edit_mode'){
      panel.classList.remove('on');
    }
  });
  try {
    window.parent.postMessage({type: '__edit_mode_available'}, '*');
  } catch(e){}

  tpClose.addEventListener('click', () => panel.classList.remove('on'));

  tpHeadline.addEventListener('input', (e) => {
    state.headline = e.target.value;
    apply();
    pushEdit({ headline: state.headline });
  });
  tpAccent.addEventListener('input', (e) => {
    state.accentOrange = e.target.value;
    apply();
    pushEdit({ accentOrange: state.accentOrange });
  });
  tpForm.addEventListener('change', (e) => {
    state.formUrl = e.target.value;
    apply();
    pushEdit({ formUrl: state.formUrl });
  });

  apply();
})();
