/* Etec Open Doors — interações globais */
(function () {
  'use strict';

  const root = document.documentElement;
  const page = location.pathname.split('/').pop() || 'index.html';
  const themeButton = document.querySelector('[data-theme-toggle]');
  const savedTheme = localStorage.getItem('site-theme');

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('site-theme', theme);
    if (themeButton) {
      themeButton.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  setTheme(savedTheme || 'light');

  if (themeButton) {
    themeButton.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* Marca automaticamente a página atual no menu. */
  document.querySelectorAll('.navbar .nav-link, .navbar .dropdown-item').forEach(function (link) {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http')) return;
    const target = href.split('/').pop();
    if (target === page) {
      link.classList.add('nav-active');
      const dropdown = link.closest('.dropdown');
      if (dropdown) {
        const trigger = dropdown.querySelector('.dropdown-toggle');
        if (trigger) trigger.classList.add('nav-active');
      }
    }
  });

  /* Botão voltar ao topo. */
  const backTop = document.querySelector('[data-back-top]');
  function updateBackTop() {
    if (backTop) backTop.classList.toggle('show', window.scrollY > 420);
  }
  window.addEventListener('scroll', updateBackTop, { passive: true });
  updateBackTop();
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Scroll reveal: conteúdo aparece quando entra na área visível. */
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealItems.length) {
    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  /* Validação do formulário de contato. O comentário NÃO é obrigatório. */
  const form = document.getElementById('contactForm');
  if (form) {
    const alertBox = document.getElementById('formAlert');
    const pt = document.documentElement.lang.toLowerCase().startsWith('pt');

    function validateField(field) {
      if (!field || !field.required) return true;
      let ok = field.checkValidity() && field.value.trim() !== '';
      if (field.id === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      if (field.id === 'phone') {
        const digits = field.value.replace(/\D/g, '');
        ok = digits.length >= 10 && digits.length <= 13;
      }
      field.classList.toggle('is-invalid', !ok);
      field.classList.toggle('is-valid', ok);
      return ok;
    }

    form.querySelectorAll('input[required], select[required]').forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        if (field.classList.contains('is-invalid') || field.classList.contains('is-valid')) validateField(field);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        if (!validateField(field)) valid = false;
      });

      if (!alertBox) return;
      alertBox.classList.remove('d-none');
      alertBox.className = 'alert mb-3 ' + (valid ? 'alert-success' : 'alert-warning');
      alertBox.textContent = valid
        ? (pt ? 'Mensagem enviada!!!' : 'Message sent!!!')
        : (pt ? 'Confira os campos destacados.' : 'Please review the highlighted fields.');

      if (!valid) {
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }
})();
