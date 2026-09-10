document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------------- */
  /* Footer year                                                        */
  /* ---------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------- */
  /* Role typewriter (hero)                                             */
  /* ---------------------------------------------------------------- */
  var roles = ['Web Developer', 'Programmer', 'Content Writer'];
  var roleEl = document.getElementById('typedRole');

  if (roleEl) {
    var roleIndex = 0, charIndex = roles[0].length, deleting = false;

    function tickRole() {
      var current = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        if (charIndex > current.length) {
          deleting = true;
          setTimeout(tickRole, 1400);
          return;
        }
      } else {
        charIndex--;
        if (charIndex < 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          charIndex = 0;
        }
      }

      roleEl.textContent = roles[roleIndex].slice(0, charIndex);
      setTimeout(tickRole, deleting ? 45 : 85);
    }

    setTimeout(tickRole, 1600);
  }

  /* ---------------------------------------------------------------- */
  /* Hero code "typing" reveal (runs once on load)                      */
  /* ---------------------------------------------------------------- */
  var codeEl = document.getElementById('typedCode');
  if (codeEl) {
    var codeLines = [
      { text: 'const developer = {', cls: '' },
      { text: '  name: "Nehal Mohammad Ali",', cls: '' },
      { text: '  role: "Web Developer",', cls: '' },
      { text: '  stack: ["HTML", "CSS", "JS", "PHP", "MySQL", "Larvel" , "Bootstrap", "JQuery"],', cls: '' },
      { text: '  passion: "building great forntend-backend Websites.",', cls: '' },
      { text: '};', cls: '' }
    ];

    var colors = { key: '#4fd1c5', str: '#f2b84b', punct: '#8b96a8' };

    function colorize(line) {
      return line
        .replace(/(".*?")/g, '<span style="color:' + colors.str + '">$1</span>')
        .replace(/^(\s*)(\w+)(:)/, '$1<span style="color:' + colors.key + '">$2</span><span style="color:' + colors.punct + '">$3</span>');
    }

    var lineIdx = 0, charIdx = 0, buffer = '';

    function typeCode() {
      if (lineIdx >= codeLines.length) return;
      var line = codeLines[lineIdx].text;

      if (charIdx <= line.length) {
        var partial = buffer + line.slice(0, charIdx);
        codeEl.innerHTML = partial.split('\n').map(colorize).join('\n') + '<span class="cursor" style="height:14px;vertical-align:middle;"></span>';
        charIdx++;
        setTimeout(typeCode, 18);
      } else {
        buffer += line + '\n';
        lineIdx++;
        charIdx = 0;
        setTimeout(typeCode, 120);
      }
    }

    setTimeout(typeCode, 500);
  }

  /* ---------------------------------------------------------------- */
  /* Scroll progress + navbar state + back-to-top                       */
  /* ---------------------------------------------------------------- */
  var progressBar = document.querySelector('.scroll-progress');
  var navEl = document.querySelector('.nav');
  var backToTop = document.getElementById('backToTop');

  function onScroll() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) progressBar.style.width = pct + '%';
    if (navEl) navEl.classList.toggle('scrolled', scrollTop > 10);
    if (backToTop) backToTop.classList.toggle('show', scrollTop > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------------- */
  /* Mobile nav toggle                                                   */
  /* ---------------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var navLinksWrap = document.getElementById('navLinks');
  if (navToggle && navLinksWrap) {
    navToggle.addEventListener('click', function () {
      navLinksWrap.classList.toggle('open');
    });
    navLinksWrap.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { navLinksWrap.classList.remove('open'); });
    });
  }

  /* ---------------------------------------------------------------- */
  /* Smooth-scroll for internal links                                   */
  /* ---------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
      }
    });
  });

  /* ---------------------------------------------------------------- */
  /* Scroll reveal                                                       */
  /* ---------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------------------------------------------------------------- */
  /* Active nav link + side dots based on section in view              */
  /* ---------------------------------------------------------------- */
  var navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');
  var sideDotEls = document.querySelectorAll('.side-dots a[href^="#"]');
  var sectionMap = [];

  navLinkEls.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) sectionMap.push({ id: id, section: section });
  });

  function setActiveSection(id) {
    navLinkEls.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });

    sideDotEls.forEach(function (dot) {
      dot.classList.toggle('active', dot.getAttribute('href') === '#' + id);
    });
  }

  function updateActiveNav() {
    if (!sectionMap.length) return;

    var scrollPosition = window.scrollY + 140;
    var current = sectionMap[0].id;

    sectionMap.forEach(function (item) {
      if (item.section.offsetTop <= scrollPosition) {
        current = item.id;
      }
    });

    setActiveSection(current);
  }

  navLinkEls.forEach(function (link) {
    link.addEventListener('click', function () {
      setActiveSection(link.getAttribute('href').slice(1));
    });
  });

  if (sectionMap.length) {
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('resize', updateActiveNav);
    updateActiveNav();
  }

  /* ---------------------------------------------------------------- */
  /* Netlify contact form                                               */
  /* ---------------------------------------------------------------- */
  var contactForm = document.querySelector('.contact-form');
  var formStatus = document.getElementById('formStatus');
  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitButton = contactForm.querySelector('button[type="submit"]');
      var originalButtonText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>&nbsp; Sending...';
      formStatus.textContent = '';
      formStatus.className = 'form-status';

      var formData = new FormData(contactForm);
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      .then(function (response) {
        if (!response.ok) throw new Error('Submission failed');
        contactForm.reset();
        formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
        formStatus.classList.add('success');
      })
      .catch(function () {
        formStatus.textContent = 'Something went wrong. Please try again.';
        formStatus.classList.add('error');
      })
      .finally(function () {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      });
    });
  }

});
