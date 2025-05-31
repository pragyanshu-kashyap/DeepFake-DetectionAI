document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu elements
  const navbar = document.querySelector(".navbar");
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector(".nav-menu");
  const navOverlay = document.querySelector(".nav-overlay");
  const navLinks = document.querySelectorAll(".nav-links a");

  // Mobile menu toggle function
  function toggleMobileMenu(e) {
    if (e) e.preventDefault();

    mobileMenuBtn.classList.toggle("active");
    navMenu.classList.toggle("active");
    navOverlay.classList.toggle("active");

    // Toggle body scroll
    document.body.style.overflow = navMenu.classList.contains("active")
      ? "hidden"
      : "";
  }

  // Event listeners for mobile menu
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  }

  if (navOverlay) {
    navOverlay.addEventListener("click", toggleMobileMenu);
  }

  // Close menu when clicking links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("active")) {
        toggleMobileMenu();
      }
    });
  });

  // Close menu on window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && navMenu.classList.contains("active")) {
      toggleMobileMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("active")) {
      toggleMobileMenu();
    }
  });

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Upload area functionality
  const uploadArea = document.querySelector(".upload-area");
  const fileInput = document.getElementById("fileInput");

  if (uploadArea && fileInput) {
    uploadArea.addEventListener("click", () => fileInput.click());

    uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadArea.classList.add("drag-over");
    });

    uploadArea.addEventListener("dragleave", () => {
      uploadArea.classList.remove("drag-over");
    });

    uploadArea.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadArea.classList.remove("drag-over");
      fileInput.files = e.dataTransfer.files;
    });

    fileInput.addEventListener("change", () => {
      if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        uploadArea.querySelector(
          "p"
        ).textContent = `Selected file: ${fileName}`;
      }
    });
  }

  // Form handling
  const uploadForm = document.getElementById("uploadForm");
  if (uploadForm) {
    uploadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = uploadForm.querySelector(".submit-btn");
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
      submitBtn.disabled = true;

      const formData = new FormData(uploadForm);
      fetch(uploadForm.action, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((data) => {
          document.getElementById("message").classList.remove("hidden");
        })
        .catch((error) => {
          console.error("Error:", error);
          submitBtn.innerHTML = "Analyze Video";
          submitBtn.disabled = false;
        });
    });
  }

  // Contact form
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Message sent successfully!");
      contactForm.reset();
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Active section highlighting
  function updateActiveSection() {
    const scrollPosition = window.scrollY + 100;

    document.querySelectorAll("section").forEach((section) => {
      const top = section.offsetTop;
      const height = section.clientHeight;
      const id = section.getAttribute("id");

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveSection);
  updateActiveSection();
});
