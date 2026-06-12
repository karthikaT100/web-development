// Minimal accessibility-focused JS
document.addEventListener('DOMContentLoaded', function () {
  const menuButton = document.querySelector('.mobile-menu-button');
  const nav = document.getElementById('site-navigation');

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  // Simple accessible form behaviour (no backend)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('form-status');
  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;

      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        status.textContent = 'Please complete all required fields.';
        if (submitButton) submitButton.disabled = false;
        return;
      }

      status.textContent = 'Sending message…';
      setTimeout(function () {
        status.textContent = 'Thanks — your message has been received.';
        form.reset();
        if (submitButton) submitButton.disabled = false;
      }, 800);
    });
  }
});
