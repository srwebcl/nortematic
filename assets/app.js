/* ============================================================
   Lavandería Norte Matic
   Script principal (versión PRO depurada)
   ============================================================ */
   (function () {
    const $ = (selector, ctx = document) => ctx.querySelector(selector);
  
    // Configuración global
    const CONFIG = {
      whatsappLink: "https://wa.me/message/X74JBLPU4INDC1",
      whatsappMsg: "Hola 👋, quisiera consultar por el servicio de lavandería.",
      phone: "+56971725968",
      maps: "https://www.google.com/maps/place/Lavandería+Nortematic+Autoservicio/@-29.9601241,-71.288884,14z/",
    };
  
    document.addEventListener("DOMContentLoaded", () => {
      initYear();
      initWhatsApp();
      initSmoothScroll();
      initButtons();
      initHeroStagger();
      initFadeSections();
      initEcoBanner();
      initNavbar();
      initForm();
      initReviewsCarousel(); // ← asegura que el carrusel se inicie
  
      console.log("%cNorte Matic Web OK ✅", "color:#00b6d6;font-weight:bold;");
    });
  
    /* =============================
       Año automático en footer
    ============================= */
    function initYear() {
      const el = $("#year");
      if (el) el.textContent = new Date().getFullYear();
    }
  
    /* =============================
       WhatsApp - Botones globales
    ============================= */
    function initWhatsApp() {
      const waURL = `${CONFIG.whatsappLink}?text=${encodeURIComponent(CONFIG.whatsappMsg)}`;
      ["#btnTopWA", "#btnHeroWA", "#btnContactWA", "#waFab"].forEach((id) => {
        const btn = $(id);
        if (btn) btn.href = waURL;
      });
    }
  
    /* =============================
       Teléfono y enlace Maps
    ============================= */
    function initButtons() {
      document.querySelectorAll("a[href^='tel']").forEach((btn) => {
        btn.href = `tel:${CONFIG.phone}`;
      });
      const mapsBtn = $("#btnMaps");
      if (mapsBtn) mapsBtn.href = CONFIG.maps;
    }
  
    /* =============================
       Scroll suave entre secciones
    ============================= */
    function initSmoothScroll() {
      document.querySelectorAll("a[href^='#']").forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
          const targetID = anchor.getAttribute("href");
          if (targetID && targetID.length > 1) {
            const section = $(targetID);
            if (section) {
              e.preventDefault();
              section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }
        });
      });
    }
  
    /* =============================
       Fade-in de secciones
    ============================= */
    function initFadeSections() {
      const fadeEls = document.querySelectorAll(".section, .service-card, .contact-card");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
          });
        },
        { threshold: 0.15 }
      );
      fadeEls.forEach((el) => observer.observe(el));
    }
  
    /* =============================
       Animación Stagger del HERO
    ============================= */
    function initHeroStagger() {
      const hero = $(".hero-content");
      if (!hero) return;
  
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              hero.classList.add("is-in");
              io.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      io.observe(hero);
    }
  
    /* =============================
       Navbar responsive (Hamburguesa)
    ============================= */
    function initNavbar() {
      const navToggle = $("#navToggle");
      const navLinks = $("#navLinks");
      if (!navToggle || !navLinks) return;
  
      navToggle.addEventListener("click", () => {
        navToggle.classList.toggle("active");
        navLinks.classList.toggle("show");
      });
  
      // Cerrar menú al hacer clic en un enlace
      document.querySelectorAll(".nav-links a").forEach((link) => {
        link.addEventListener("click", () => {
          navToggle.classList.remove("active");
          navLinks.classList.remove("show");
        });
      });
    }
  
    /* =============================
       Cinta ecológica rotativa
    ============================= */
    function initEcoBanner() {
      const ecoText = $("#ecoText");
      if (!ecoText) return;
  
      const ecoPhrases = [
        "♻️ Cuidamos tus prendas y el medio ambiente con productos biodegradables certificados ♻️",
        "🌱 Lavado ecológico, sin residuos y con aroma a frescura natural 🌿",
        "💧 Cada lavado cuenta: ropa limpia, planeta limpio 💚",
      ];
  
      let currentEco = 0;
  
      function rotateEcoText() {
        ecoText.style.opacity = 0;
        setTimeout(() => {
          currentEco = (currentEco + 1) % ecoPhrases.length;
          ecoText.textContent = ecoPhrases[currentEco];
          ecoText.style.opacity = 1;
        }, 500);
      }
  
      setInterval(rotateEcoText, 7000);
    }
  
    /* =============================
       Formulario de contacto
    ============================= */
    function initForm() {
      const form = $("#contactForm");
      if (!form) return;
  
      form.addEventListener("submit", (e) => {
        e.preventDefault();
  
        const nombre = form.nombre.value.trim();
        const telefono = form.telefono.value.trim();
        const email = form.email.value.trim();
        const mensaje = form.mensaje.value.trim();
  
        // Validación simple
        if (!nombre || !telefono || !email || !mensaje) {
          alert("❗ Por favor, completa todos los campos.");
          return;
        }
  
        // Validar email básico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert("❗ Ingresa un correo electrónico válido.");
          return;
        }
  
        // Aquí podrías integrar EmailJS, FormSubmit o backend propio
        console.log("📨 Formulario enviado:", { nombre, telefono, email, mensaje });
        alert("✅ Gracias por tu mensaje. Te contactaremos pronto.");
        form.reset();
      });
    }
  
/* =============================
   Carrusel de Opiniones SLIDE
============================= */
function initReviewsCarousel() {
  const track = document.querySelector(".review-track");
  const cards = document.querySelectorAll(".review-card");
  const prev = document.getElementById("prevReview");
  const next = document.getElementById("nextReview");
  if (!track || !cards.length) return;

  let index = 0;
  let autoTimer;

  function showSlide(i) {
    track.style.transform = `translateX(-${i * 100}%)`;
  }

  function nextSlide() {
    index = (index + 1) % cards.length;
    showSlide(index);
  }

  function prevSlide() {
    index = (index - 1 + cards.length) % cards.length;
    showSlide(index);
  }

  next.addEventListener("click", () => {
    nextSlide();
    resetAuto();
  });

  prev.addEventListener("click", () => {
    prevSlide();
    resetAuto();
  });

  function auto() {
    autoTimer = setInterval(nextSlide, 7000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    auto();
  }

  auto();
}
  })();
// Generador de burbujas dinámicas (opcional)
(function bubbleGenerator() {
  const container = document.querySelector('.bubble-bg');
  if (!container) return;

  setInterval(() => {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.style.left = Math.random() * 100 + '%';
    bubble.style.width = bubble.style.height = Math.random() * 40 + 20 + 'px';
    bubble.style.animationDuration = 8 + Math.random() * 8 + 's';
    container.appendChild(bubble);

    setTimeout(() => bubble.remove(), 15000);
  }, 1200);
})();
