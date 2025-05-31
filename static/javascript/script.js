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

    const isOpen = navMenu.classList.contains("active");

    // Toggle classes
    mobileMenuBtn.classList.toggle("active");
    navMenu.classList.toggle("active");
    navOverlay.classList.toggle("active");

    // Toggle body scroll and aria-expanded
    document.body.style.overflow = isOpen ? "" : "hidden";
    mobileMenuBtn.setAttribute("aria-expanded", !isOpen);
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

  //Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("active")) {
      toggleMobileMenu();
    }
  });

  //Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
  //Upload area functionality
  const uploadArea = document.querySelector(".upload-area");
  const fileInput = document.getElementById("fileInput");
  const defaultText = "Supported formats: MP4, AVI, MOV";

  if (uploadArea && fileInput) {
    uploadArea.addEventListener("click", () => {
      fileInput.value = ""; // Clear the input before opening file dialog
      fileInput.click();
    });

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
      updateFileName();
    });

    const updateFileName = () => {
      const textElement = uploadArea.querySelector("p");
      if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        textElement.textContent = `Selected file: ${fileName}`;
      } else {
        textElement.textContent = defaultText;
      }
    };

    fileInput.addEventListener("change", updateFileName);
  }

  // Form handling
  const uploadForm = document.getElementById("uploadForm");
  if (uploadForm) {
    uploadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = uploadForm.querySelector(".submit-btn");
      const messageContainer = document.getElementById("message");

      // Show loading state
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
      submitBtn.disabled = true;

      // Add analyzing overlay
      const overlay = document.createElement("div");
      overlay.className = "analyzing-overlay";
      overlay.innerHTML = `
        <div class="analyzing-spinner"></div>
        <div class="analyzing-text">Analyzing video for manipulations...</div>
      `;
      messageContainer.appendChild(overlay);
      messageContainer.classList.remove("hidden");

      const formData = new FormData(uploadForm);

      fetch(window.location.pathname, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((html) => {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = html;

          const newMessage = tempDiv.querySelector("#message");
          if (newMessage) {
            // Add timestamp to the result
            const timestamp = new Date().toLocaleString();
            const timestampSpan = newMessage.querySelector(".timestamp");
            if (timestampSpan) {
              timestampSpan.textContent = timestamp;
            }
            messageContainer.innerHTML = newMessage.innerHTML;

            // Reset the file input and upload area text
            fileInput.value = "";
            uploadArea.querySelector("p").textContent = defaultText;

            // Scroll to results
            messageContainer.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          messageContainer.innerHTML = `
          <div class="result-container">
            <div class="result-text">
              <h3 class="fake">
                <i class="fas fa-exclamation-circle"></i>
                Error Processing Video
              </h3>
              <p class="error-message">An error occurred while analyzing the video. Please try again.</p>
            </div>
          </div>
        `;
        })
        .finally(() => {
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
