// Curated looks data with 3 items per category and PNG images
const curatedLooks = {
  casual: [
    {
      id: 1,
      title: "Classic White Shirt + Jeans",
      description: "A timeless casual look with denim.",
      image: "assets/images/casual1.png",
    },
    {
      id: 2,
      title: "Relaxed Linen Shirt + Shorts",
      description: "Perfect summer casual vibe.",
      image: "assets/images/casual2.png",
    },
    {
      id: 7,
      title: "Graphic Tee & Sneakers",
      description: "Street-inspired casual style.",
      image: "assets/images/casual3.png",
    },
  ],
  office: [
    {
      id: 3,
      title: "White Shirt & Tailored Pants",
      description: "Sharp and sleek office outfit.",
      image: "assets/images/office1.png",
    },
    {
      id: 4,
      title: "Blazer with Crisp Shirt",
      description: "Professional and confident style.",
      image: "assets/images/office2.png",
    },
    {
      id: 9,
      title: "Pencil Skirt & Blouse",
      description: "Elegant women’s office look.",
      image: "assets/images/office3.png",
    },
  ],
  party: [
    {
      id: 5,
      title: "White Shirt with Leather Jacket",
      description: "Edgy party look.",
      image: "assets/images/party1.png",
    },
    {
      id: 6,
      title: "Sheer White Shirt + Statement Jewelry",
      description: "Glamorous and bold.",
      image: "assets/images/party2.png",
    },
    {
      id: 11,
      title: "Sequined Blouse & Skirt",
      description: "Shine bright at the party.",
      image: "assets/images/party3.png",
    },
  ],
};

// Elements
const gallery = document.getElementById("lookGallery");
const tabs = document.querySelectorAll(".category-tabs .tab");
const personalizeModal = document.getElementById("personalizeModal");
const personalizeBtn = document.getElementById("personalizeBtn");
const personalizeBtnHero = document.getElementById("personalizeBtnHero");
const closeModalBtn = document.getElementById("closeModal");
const personalizeForm = document.getElementById("personalizeForm");
const newsletterForm = document.getElementById("newsletterForm");
const newsletterMsg = document.querySelector(".newsletter-msg");

// Utility: Render outfit cards for a category with optional filtering
function renderGallery(category) {
  gallery.innerHTML = "";
  let looks = curatedLooks[category] || [];

  const prefs = JSON.parse(localStorage.getItem("userPrefs"));
  if (prefs && prefs.stylePref && prefs.stylePref !== category) {
    looks = [];
  }

  if (looks.length === 0) {
    gallery.innerHTML = `<p>No looks available for your preferences here.</p>`;
    return;
  }

  looks.forEach((look) => {
    const card = document.createElement("div");
    card.className = "outfit-card";
    card.innerHTML = `
      <img src="${look.image}" alt="${look.title}" />
      <div class="card-content">
        <h3>${look.title}</h3>
        <p>${look.description}</p>
      </div>
    `;
    gallery.appendChild(card);
  });
}

// Tab click event to switch category
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    renderGallery(tab.dataset.category);
  });
});

// Open personalize modal
function openPersonalize() {
  personalizeModal.classList.remove("hidden");
}

// Close personalize modal
function closePersonalize() {
  personalizeModal.classList.add("hidden");
}

// Load personalized category on page load (default to casual if none)
function initGallery() {
  const prefs = JSON.parse(localStorage.getItem("userPrefs"));
  if (prefs && prefs.stylePref) {
    tabs.forEach((tab) => {
      if (tab.dataset.category === prefs.stylePref) {
        tab.classList.add("active");
        renderGallery(prefs.stylePref);
      } else {
        tab.classList.remove("active");
      }
    });
  } else {
    renderGallery("casual");
  }
}

// Form submission for personalization
personalizeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const height = personalizeForm.height.value;
  const bodyType = personalizeForm.bodyType.value;
  const stylePref = personalizeForm.stylePref.value;

  const prefs = { height, bodyType, stylePref };
  localStorage.setItem("userPrefs", JSON.stringify(prefs));
  alert("Preferences saved! Your gallery has been updated.");

  closePersonalize();
  initGallery();
});

// Newsletter form
newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = newsletterForm.querySelector("input[type=email]").value;
  newsletterMsg.textContent = `Thanks for subscribing, ${email}!`;
  newsletterForm.reset();
});

// Event listeners
personalizeBtn.addEventListener("click", openPersonalize);
personalizeBtnHero.addEventListener("click", openPersonalize);
closeModalBtn.addEventListener("click", closePersonalize);

// Initialize gallery on page load
document.addEventListener("DOMContentLoaded", initGallery);

const API_KEY = 'AIzaSyC1iPQUbEx75mXv8Va_U2dzLDoXetQAvDI';
const CX = '902d28d8f0f6647e0';

const form = document.getElementById('searchForm');
const resultsGallery = document.getElementById('resultsGallery');

if (form) { // check if form exists on the page to prevent errors on other pages
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('queryInput').value.trim();
    if (!query) return;
    resultsGallery.innerHTML = '<p>Loading...</p>';

    try {
      const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}&searchType=image&num=10`);
      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        resultsGallery.innerHTML = '<p>No results found.</p>';
        return;
      }

      resultsGallery.innerHTML = '';
      data.items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'outfit-card';
        card.innerHTML = `
          <img src="${item.link}" alt="${item.title}" />
          <div class="card-content">
            <h3>${item.title}</h3>
            <a href="${item.image.contextLink}" target="_blank" rel="noopener noreferrer" class="btn-secondary">View Source</a>
          </div>
        `;
        resultsGallery.appendChild(card);
      });
    } catch (error) {
      console.error('Search error:', error);
      resultsGallery.innerHTML = '<p>Error fetching results. Try again later.</p>';
    }
  });
}