/* =========================================================
   Modewatch Sekolah — script.js
   Navigasi single-page tanpa reload + dropdown menu
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  var sections = document.querySelectorAll("[data-section]");
  var navLinks = document.querySelectorAll("[data-target]");
  var navbar = document.getElementById("navbar");
  var navToggle = document.getElementById("navToggle");
  var dropdownParents = document.querySelectorAll(".has-dropdown");

  /**
   * Menampilkan satu section berdasarkan id, menyembunyikan sisanya.
   */
  function showSection(targetId) {
    var found = false;

    sections.forEach(function (section) {
      if (section.id === targetId) {
        section.classList.add("is-active");
        found = true;
      } else {
        section.classList.remove("is-active");
      }
    });

    // Jika id tidak ditemukan, jatuhkan ke beranda sebagai fallback.
    if (!found) {
      var fallback = document.getElementById("beranda");
      if (fallback) fallback.classList.add("is-active");
      targetId = "beranda";
    }

    updateActiveNavLink(targetId);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    closeMobileMenu();
  }

  /**
   * Menandai link navbar utama (bukan dropdown) yang sedang aktif,
   * berdasarkan kelompok kategori (seragam/tas/sepatu/aksesoris).
   */
  function updateActiveNavLink(targetId) {
    var topLevelLinks = document.querySelectorAll(".navbar__menu > li > .navlink");
    topLevelLinks.forEach(function (link) {
      link.classList.remove("is-current");
      var linkTarget = link.getAttribute("data-target");
      if (!linkTarget) return;

      var linkPrefix = linkTarget.split("-")[0];
      var targetPrefix = targetId.split("-")[0];

      if (linkTarget === targetId || linkPrefix === targetPrefix) {
        link.classList.add("is-current");
      }
    });
  }

  // Klik pada semua link yang memiliki data-target (navbar utama + dropdown + logo)
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      var targetId = link.getAttribute("data-target");
      if (targetId) {
        showSection(targetId);
      }
    });
  });

  // ---------- Dropdown untuk perangkat sentuh / mobile ----------
  // Di desktop, dropdown tetap muncul lewat CSS :hover.
  // Di mobile, dropdown dibuka lewat klik pada menu utama (Seragam, Tas, dst).
  dropdownParents.forEach(function (parent) {
    var topLink = parent.querySelector(":scope > .navlink");

    topLink.addEventListener("click", function (event) {
      var isMobile = window.matchMedia("(max-width: 860px)").matches;
      if (!isMobile) return; // biarkan klik langsung membuka artikel pertama di desktop

      event.preventDefault();

      var alreadyOpen = parent.classList.contains("is-open");

      // Tutup dropdown lain yang mungkin sedang terbuka
      dropdownParents.forEach(function (p) {
        p.classList.remove("is-open");
      });

      if (!alreadyOpen) {
        parent.classList.add("is-open");
      }
    });
  });

  // ---------- Toggle menu hamburger (mobile) ----------
  navToggle.addEventListener("click", function () {
    var isOpen = navbar.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  function closeMobileMenu() {
    navbar.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    dropdownParents.forEach(function (p) {
      p.classList.remove("is-open");
    });
  }

  // ---------- Formulir kontak (tampilan saja, tanpa backend) ----------
  var contactForm = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      formNote.textContent =
        "Pesan Anda telah disiapkan. Formulir ini masih berupa tampilan demo dan belum terhubung ke sistem pengiriman.";
      contactForm.reset();
    });
  }

  // Tampilkan section awal sesuai hash URL, atau beranda jika tidak ada.
  var initialTarget = window.location.hash
    ? window.location.hash.replace("#", "")
    : "beranda";
  showSection(initialTarget);
});
