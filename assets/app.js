/* Przychodnia Weterynaryjna Zwierzyniec — skrypt tylko tej strony. Bez zależności. */
(function () {
  'use strict';
  var T = {}; try { T = JSON.parse(document.getElementById('i18n').textContent) || {}; } catch (e) {}
  var t = function (k, d) { return T[k] || d; };
  var spokojnie = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* pasek reaguje na zjechanie z gory */
  var pasek = document.querySelector('.top-bar');
  if (pasek) {
    var s = function () { pasek.classList.toggle('przewiniety', window.scrollY > 30); };
    s(); window.addEventListener('scroll', s, { passive: true });
  }

  /* menu na telefonie */
  var btn = document.querySelector('.ham');
  var mob = document.getElementById('mm');
  if (btn && mob) {
    var etykieta = btn.getAttribute('aria-label');
    btn.addEventListener('click', function () {
      var open = mob.classList.toggle('otwarte');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? t('closeMenu', etykieta) : etykieta);
    });
    mob.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { mob.classList.remove('otwarte'); btn.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mob.classList.contains('otwarte')) btn.click();
    });
  }

  /* Sekcje wchodza po kolei. Stan widoczny jest domyslny w CSS — bez JS
     i przy zredukowanym ruchu nic sie nie chowa. */
  if ('IntersectionObserver' in window && !spokojnie) {
    var cele = document.querySelectorAll('.opieka-karta, .o-lecznicy p, .zapewnienia li, .zdjecia figure, .kontakt-box');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.style.transition = 'opacity .5s ease, transform .5s cubic-bezier(.2,.7,.3,1)';
        en.target.style.opacity = 1; en.target.style.transform = 'none';
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .05 });
    Array.prototype.forEach.call(cele, function (el, i) {
      el.style.opacity = 0; el.style.transform = 'translateY(16px)';
      el.style.transitionDelay = (i % 5) * 60 + 'ms';
      io.observe(el);
    });
  }

  /* Klikniecie w przelacznik zapamietuje wybor, zeby automat nie zabieral
     uzytkownika z powrotem przy nastepnym wejsciu. */
  document.querySelectorAll('a.lang').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem('jezyk', (a.getAttribute('hreflang') || a.textContent).trim().toLowerCase().slice(0, 2)); } catch (e) {}
    });
  });

  /* Dzisiejsze kolo wyroznione. Liczy przegladarka. */
  (function(){
    var i=(new Date().getDay()+6)%7;
    var el=document.querySelector('.kolo-dnia[data-dzien="'+i+'"]');
    if(el) el.classList.add('dzis');
  })();
})();
