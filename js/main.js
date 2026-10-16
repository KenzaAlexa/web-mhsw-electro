/**
 * ⚡ MAIN PORTFOLIO CONTROLLER
 * Coordinates voltage modes, scroll effects, telemetry, and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particle & Lightning Engines
  const lightningEngine = new LightningEngine('lightning-canvas');
  const sparkSystem = new SparkParticleSystem('sparks-canvas');
  const circuitSimulator = new CircuitSimulator();

  // 2. Voltage Mode Switcher
  const voltageBtns = document.querySelectorAll('.voltage-btn');
  voltageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      document.body.setAttribute('data-voltage', mode);
      
      voltageBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (lightningEngine) {
        lightningEngine.setVoltageMode(mode);
        lightningEngine.strikeToPoint(window.innerWidth / 2, window.innerHeight * 0.4);
      }
    });
  });

  // 3. Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    // Close when clicking nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // 4. Scroll Reveal & Skill Progress Bar Trigger
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // If it's a skill panel, animate skill bars
        const skillFills = entry.target.querySelectorAll('.skill-bar-fill');
        skillFills.forEach(fill => {
          const targetWidth = fill.getAttribute('data-width');
          if (targetWidth) {
            fill.style.width = targetWidth;
          }
        });
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => observer.observe(el));

  // 5. Dynamic Telemetry Status Ticker
  const freqValEl = document.getElementById('telemetry-freq');
  const pfValEl = document.getElementById('telemetry-pf');
  const voltValEl = document.getElementById('telemetry-volt');

  setInterval(() => {
    if (freqValEl) {
      // Natural PLN 50Hz subtle grid fluctuation between 49.97 and 50.04 Hz
      const freq = (50 + (Math.random() * 0.08 - 0.04)).toFixed(2);
      freqValEl.textContent = `${freq} Hz`;
    }
    if (pfValEl) {
      // High-efficiency power factor between 0.97 and 0.99
      const pf = (0.98 + (Math.random() * 0.015 - 0.007)).toFixed(2);
      pfValEl.textContent = pf;
    }
  }, 2200);

  // 6. Contact Form Terminal Handler (if active in DOM)
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.btn-transmit');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `<span>TRANSMITTING SIGNAL...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = `<span>TRANSMISSION SUCCESSFUL!</span>`;
        submitBtn.style.background = '#00FF88';
        submitBtn.style.color = '#000000';

        if (formStatus) {
          formStatus.innerHTML = `<span style="color: #00FF88; font-family: var(--font-mono); font-size: 0.9rem;">Pesan berhasil ditransmisikan ke terminal kelistrikan. Saya akan segera merespons Anda!</span>`;
        }

        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.disabled = false;
        }, 4000);
      }, 1200);
    });
  }
});
