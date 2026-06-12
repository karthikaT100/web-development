document.addEventListener('DOMContentLoaded', function () {
  const menuButton = document.querySelector('.mobile-menu-button');
  const nav = document.getElementById('site-navigation');
  const themeButton = document.querySelector('.theme-toggle');

  const setMobileMenu = (expanded) => {
    if (menuButton) {
      menuButton.setAttribute('aria-expanded', String(expanded));
    }
    if (nav) {
      nav.classList.toggle('open', expanded);
    }
  };

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      setMobileMenu(!expanded);
    });
  }

  const applyTheme = (darkMode) => {
    document.body.classList.toggle('dark-mode', darkMode);
    if (themeButton) {
      themeButton.setAttribute('aria-pressed', String(darkMode));
      const icon = themeButton.querySelector('.theme-icon');
      const label = themeButton.querySelector('span:last-child');
      if (icon) {
        icon.textContent = darkMode ? '☾' : '☀';
      }
      if (label) {
        label.textContent = darkMode ? 'Light mode' : 'Dark mode';
      }
    }
  };

  const savedTheme = window.localStorage.getItem('portfolioTheme');
  applyTheme(savedTheme === 'dark');

  if (themeButton) {
    themeButton.addEventListener('click', function () {
      const nextTheme = !document.body.classList.contains('dark-mode');
      window.localStorage.setItem('portfolioTheme', nextTheme ? 'dark' : 'light');
      applyTheme(nextTheme);
    });
  }

  const form = document.getElementById('contactForm');
  const status = document.getElementById('form-status');

  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitButton = form.querySelector('button[type="submit"]');
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        status.textContent = 'Please complete all required fields.';
        if (submitButton) submitButton.disabled = false;
        return;
      }

      status.textContent = 'Sending message…';
      if (submitButton) {
        submitButton.disabled = true;
      }

      setTimeout(function () {
        status.textContent = 'Thanks — your message has been received.';
        form.reset();
        if (submitButton) {
          submitButton.disabled = false;
        }
      }, 900);
    });
  }
});
