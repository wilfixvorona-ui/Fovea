document.addEventListener('DOMContentLoaded', () => {

  /* --- Mobile nav: burger opens/closes the dropdown menu --- */
  const burger = document.querySelector('.navbar__burger');
  const navbar = document.querySelector('.navbar');

  if (burger && navbar) {
    const closeMenu = () => {
      navbar.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    };

    burger.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    navbar.querySelectorAll('.navbar__links a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    /* gives the transparent mobile navbar a solid fill once scrolled past the hero */
    const SCROLL_SOLID_THRESHOLD = 40;
    const updateNavbarFill = () => {
      navbar.classList.toggle('navbar--scrolled', window.scrollY > SCROLL_SOLID_THRESHOLD);
    };
    updateNavbarFill();
    window.addEventListener('scroll', updateNavbarFill, { passive: true });
  }

  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* --- Achieves: count-up --- */
  const counters = document.querySelectorAll('.achieves__num');

  if (counters.length) {
    const DURATION = 2000;
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const finalValue = (el) =>
      el.dataset.count + (el.dataset.suffix || '');

    const runCount = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const start = performance.now();

      const tick = (now) => {
        const p = Math.min((now - start) / DURATION, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    if (noMotion || !('IntersectionObserver' in window)) {
      counters.forEach((el) => { el.textContent = finalValue(el); });
    } else {
      const countObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCount(entry.target);
          } else {
            entry.target.textContent = '0' + (entry.target.dataset.suffix || '');
          }
        });
      }, { threshold: 0.4 });

      counters.forEach((el) => countObserver.observe(el));
    }
  }

  /* --- Doctors: click a grid photo to update the featured card ---
     Placeholder data for doctors 1-7 — only Emily Carter (id 0) is real. */
  const DOCTORS = {
    0: {
      img: 'assets/girldoctor.png',
      name: 'Dr. Emily Carter',
      role: 'Chief Ophthalmic Surgeon',
      badges: ['8 years of expierence', 'Cataract'],
    },
    1: {
      img: 'assets/mandoctor-60%25opacity.png',
      name: 'Dr. Michael Bennett',
      role: 'Cataract & Lens Surgeon',
      badges: ['10 years of expierence', 'Astigmatism', 'Cataract'],
    },
    2: {
      img: 'assets/mandoctor-60%25opacity.png',
      name: 'Dr. Sarah Whitfield',
      role: 'Glaucoma Specialist',
      badges: ['12 years of experience', 'Glaucoma'],
    },
    3: {
      img: 'assets/mandoctor-60%25opacity.png',
      name: 'Dr. James Alvarez',
      role: 'Refractive Surgeon',
      badges: ['9 years of experience', 'Laser Vision Correction'],
    },
    4: {
      img: 'assets/mandoctor-60%25opacity.png',
      name: 'Dr. Olivia Chen',
      role: 'Pediatric Ophthalmologist',
      badges: ['7 years of experience', 'Pediatric Care'],
    },
    5: {
      img: 'assets/mandoctor-60%25opacity.png',
      name: 'Dr. Daniel Kim',
      role: 'Cornea Specialist',
      badges: ['11 years of experience', 'Cornea', 'Dry Eye'],
    },
    6: {
      img: 'assets/mandoctor-60%25opacity.png',
      name: 'Dr. Anna Novak',
      role: 'Retina Specialist',
      badges: ['14 years of experience', 'Retina'],
    },
    7: {
      img: 'assets/mandoctor-60%25opacity.png',
      name: 'Dr. Robert Hayes',
      role: 'General Ophthalmologist',
      badges: ['6 years of experience', 'Vision Diagnostics'],
    },
  };

  const doctorCards = document.querySelectorAll('.doctors__photo[data-doctor-id]');
  const featured = document.querySelector('.doctors__featured');

  if (doctorCards.length && featured) {
    const featuredImg = featured.querySelector('.doctors__featured-img');
    const featuredName = featured.querySelector('.doctors__name');
    const featuredRole = featured.querySelector('.doctors__role');
    const featuredBadges = featured.querySelector('.doctors__badges');
    const featuredLink = featured.querySelector('.doctors__link');

    const showDoctor = (doctor) => {
      featured.style.opacity = '0';
      window.setTimeout(() => {
        featuredImg.src = doctor.img;
        featuredImg.alt = `${doctor.name}, ${doctor.role}`;
        featuredName.textContent = doctor.name;
        featuredRole.textContent = doctor.role;
        featuredBadges.innerHTML = doctor.badges
          .map((label) => `<span class="doctors__badge"><span class="doctors__badge-dot"></span>${label}</span>`)
          .join('');
        if (featuredLink) featuredLink.setAttribute('aria-label', `View ${doctor.name}’s profile`);
        featured.style.opacity = '1';
      }, 150);
    };

    doctorCards.forEach((card) => {
      const doctor = DOCTORS[card.dataset.doctorId];
      if (!doctor) return;

      const select = () => {
        doctorCards.forEach((c) => c.classList.remove('is-active'));
        card.classList.add('is-active');
        showDoctor(doctor);
      };

      card.addEventListener('click', select);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select();
        }
      });
    });
  }

  /* --- Doctors "See more" (mobile-only reveal, toggles back) --- */
  const doctorsGrid = document.querySelector('.doctors__grid');
  const doctorsMoreBtn = document.querySelector('.doctors__more');
  const doctorsMoreLabel = doctorsMoreBtn && doctorsMoreBtn.querySelector('.doctors__more-label');

  if (doctorsGrid && doctorsMoreBtn && doctorsMoreLabel) {
    doctorsMoreBtn.addEventListener('click', (e) => {
      if (window.matchMedia('(max-width: 900px)').matches) {
        e.preventDefault();
        const expanded = doctorsGrid.classList.toggle('is-expanded');
        doctorsMoreLabel.textContent = expanded ? 'See less' : 'See more';
      }
    });
  }

  /* --- Hero video progress bar --- */
  const heroVideo = document.querySelector('.hero__video');
  const progressFill = document.getElementById('heroProgressFill');

  if (heroVideo && progressFill) {
    function updateProgress() {
      if (heroVideo.duration) {
        const percent = (heroVideo.currentTime / heroVideo.duration) * 100;
        progressFill.style.width = percent + '%';
      }
      requestAnimationFrame(updateProgress);
    }
    requestAnimationFrame(updateProgress);
  }

});



