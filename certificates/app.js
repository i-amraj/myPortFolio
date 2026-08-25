// app.js

// List of all certificates in the repository with cleaned titles and tags
const certificates = [
  {
    filename: "Certificate - E&ICT Academy, IIT Kanpur.pdf",
    title: "E&ICT Academy, IIT Kanpur Certificate",
    tags: ["IIT Kanpur", "Academic", "Engineering"],
    type: "pdf"
  },
  {
    filename: "CertificateOfCompletion_Agile Software Development Clean Coding Practices.pdf",
    title: "Agile Software Development & Clean Coding Practices",
    tags: ["Agile", "Clean Code", "Development"],
    type: "pdf"
  },
  {
    filename: "CertificateOfCompletion_Gemini in Google Sheets.pdf",
    title: "Gemini in Google Sheets",
    tags: ["Gemini", "AI", "Google Sheets"],
    type: "pdf"
  },
  {
    filename: "CertificateOfCompletion_Generative AI Skills for Creative Content Opportunities Issues and Ethics.pdf",
    title: "Generative AI Skills, Issues & Ethics",
    tags: ["Generative AI", "AI", "Ethics"],
    type: "pdf"
  },
  {
    filename: "CertificateOfCompletion_Introduction to Artificial Intelligence.pdf",
    title: "Introduction to Artificial Intelligence",
    tags: ["AI", "Introduction"],
    type: "pdf"
  },
  {
    filename: "CertificateOfCompletion_Introduction to Artificial Intelligence (1).pdf",
    title: "Introduction to Artificial Intelligence (Copy)",
    tags: ["AI", "Introduction"],
    type: "pdf"
  },
  {
    filename: "CertificateOfCompletion_Microsoft Azure Essentials by Microsoft Press.pdf",
    title: "Microsoft Azure Essentials by Microsoft Press",
    tags: ["Azure", "Cloud", "Microsoft"],
    type: "pdf"
  },
  {
    filename: "CertificateOfCompletion_Programming Concepts for Python.pdf",
    title: "Programming Concepts for Python",
    tags: ["Python", "Programming", "Concepts"],
    type: "pdf"
  },
  {
    filename: "CertificateOfCompletion_Programming Foundations Version Control with Git.pdf",
    title: "Programming Foundations: Version Control with Git",
    tags: ["Git", "Version Control", "GitHub"],
    type: "pdf"
  },
  {
    filename: "CertificateOfCompletion_Programming Foundations Version Control with Git (1).pdf",
    title: "Programming Foundations: Version Control with Git (Copy)",
    tags: ["Git", "Version Control"],
    type: "pdf"
  },
  {
    filename: "Foundation in Python Programming Certificate.pdf - 2024-08-30T104657.725.pdf",
    title: "Foundation in Python Programming",
    tags: ["Python", "Programming"],
    type: "pdf"
  },
  {
    filename: "Gemini certificate.pdf",
    title: "Gemini AI Certificate",
    tags: ["Gemini", "AI", "Google"],
    type: "pdf"
  },
  {
    filename: "Raj Soni.pdf",
    title: "Raj Soni Main Certificate/Profile",
    tags: ["Profile", "Personal"],
    type: "pdf"
  },
  {
    filename: "Raj Soni (1).pdf",
    title: "Raj Soni Profile/Certificate (1)",
    tags: ["Profile", "Personal"],
    type: "pdf"
  },
  {
    filename: "Raj_Soni_5243302.pdf",
    title: "Raj Soni Verification Certificate (5243302)",
    tags: ["Verification", "Personal"],
    type: "pdf"
  },
  {
    filename: "Raj_Soni_5252873.pdf",
    title: "Raj Soni Verification Certificate (5252873)",
    tags: ["Verification", "Personal"],
    type: "pdf"
  },
  {
    filename: "WhatsApp Image 2026-06-09 at 7.13.27 PM.jpeg",
    title: "Certificate Image - Front/Overview",
    tags: ["Image", "General"],
    type: "image"
  },
  {
    filename: "WhatsApp Image 2026-06-09 at 7.13.28 PM.jpeg",
    title: "Certificate Image - Back/Details",
    tags: ["Image", "General"],
    type: "image"
  },
  {
    filename: "agreement.pdf",
    title: "Agreement Document",
    tags: ["Agreement", "Official"],
    type: "pdf"
  },
  {
    filename: "angil.scrum certificate.pdf",
    title: "Agile & Scrum Certification",
    tags: ["Agile", "Scrum", "Management"],
    type: "pdf"
  },
  {
    filename: "angular certificate.pdf",
    title: "Angular Web Framework Certificate",
    tags: ["Angular", "Frontend", "Web Development"],
    type: "pdf"
  },
  {
    filename: "basic of python certificate.pdf",
    title: "Basics of Python Programming",
    tags: ["Python", "Programming", "Basics"],
    type: "pdf"
  },
  {
    filename: "certificate  (1).pdf",
    title: "General Training Certificate (1)",
    tags: ["Training", "General"],
    type: "pdf"
  },
  {
    filename: "data base management 1 certificate.pdf",
    title: "Database Management Systems - Module 1",
    tags: ["Database", "DBMS", "SQL"],
    type: "pdf"
  },
  {
    filename: "database management 2 certificate.pdf",
    title: "Database Management Systems - Module 2",
    tags: ["Database", "DBMS", "SQL"],
    type: "pdf"
  },
  {
    filename: "email writing skill certificate.pdf",
    title: "Email Writing Professional Skills",
    tags: ["Communication", "Writing", "Soft Skills"],
    type: "pdf"
  },
  {
    filename: "high impact skill certificate.pdf",
    title: "High Impact Communication Skills",
    tags: ["Communication", "Soft Skills", "Professional"],
    type: "pdf"
  },
  {
    filename: "high impact skill certificate (1).pdf",
    title: "High Impact Communication Skills (Copy)",
    tags: ["Communication", "Soft Skills"],
    type: "pdf"
  },
  {
    filename: "introduction to nosql certificate.pdf",
    title: "Introduction to NoSQL Databases",
    tags: ["Database", "NoSQL", "MongoDB"],
    type: "pdf"
  },
  {
    filename: "object oriented certificate.pdf",
    title: "Object-Oriented Programming (OOP)",
    tags: ["OOP", "Java", "Python", "Programming"],
    type: "pdf"
  },
  {
    filename: "programing fundamental certificate.pdf",
    title: "Programming Fundamentals - Module 1",
    tags: ["Programming", "Fundamentals"],
    type: "pdf"
  },
  {
    filename: "programing fundamental 2 certificate.pdf",
    title: "Programming Fundamentals - Module 2",
    tags: ["Programming", "Fundamentals"],
    type: "pdf"
  },
  {
    filename: "software engineering certificate.pdf",
    title: "Software Engineering Core Concepts",
    tags: ["Software Engineering", "SDLC", "Systems"],
    type: "pdf"
  },
  {
    filename: "time managment certificate.pdf",
    title: "Time Management Professional Certificate",
    tags: ["Time Management", "Soft Skills", "Productivity"],
    type: "pdf"
  },
  {
    filename: "unnati certificate.pdf",
    title: "Unnati Program Certificate",
    tags: ["Unnati", "General", "Academic"],
    type: "pdf"
  }
];

// Select DOM Elements
const grid = document.getElementById("certificates-grid");
const searchInput = document.getElementById("search-input");
const tagsContainer = document.getElementById("tags-container");
const countDisplay = document.getElementById("certificates-count");

// Modal Elements
const modalOverlay = document.getElementById("modal-overlay");
const modalContainer = document.getElementById("modal-container");
const modalTitle = document.getElementById("modal-title");
const modalClose = document.getElementById("modal-close");
const modalBody = document.getElementById("modal-body");

let activeTag = "All";
let searchQuery = "";

// Generate all unique tags for filter
function getUniqueTags() {
  const allTags = new Set();
  certificates.forEach(c => c.tags.forEach(tag => allTags.add(tag)));
  return ["All", ...Array.from(allTags).sort()];
}

// Render dynamic tag buttons
function renderTags() {
  const tags = getUniqueTags();
  tagsContainer.innerHTML = "";
  tags.forEach(tag => {
    const btn = document.createElement("button");
    btn.className = `tag-btn ${tag === activeTag ? 'active' : ''}`;
    btn.textContent = tag;
    btn.addEventListener("click", () => {
      activeTag = tag;
      renderTags();
      filterAndRender();
    });
    tagsContainer.appendChild(btn);
  });
}

// Check if a certificate matches the tag and search filters
function matchesFilter(cert) {
  const matchesTag = activeTag === "All" || cert.tags.includes(activeTag);
  const cleanTitle = cert.title.toLowerCase();
  const cleanFilename = cert.filename.toLowerCase();
  const cleanSearch = searchQuery.toLowerCase();
  const matchesSearch = cleanTitle.includes(cleanSearch) || 
                        cleanFilename.includes(cleanSearch) || 
                        cert.tags.some(tag => tag.toLowerCase().includes(cleanSearch));
  return matchesTag && matchesSearch;
}

// Open modal preview
function openPreview(cert) {
  modalTitle.textContent = cert.title;
  modalBody.innerHTML = "";

  if (cert.type === "pdf") {
    const iframe = document.createElement("iframe");
    iframe.src = encodeURIComponent(cert.filename);
    iframe.className = "modal-iframe";
    modalBody.appendChild(iframe);
  } else {
    const img = document.createElement("img");
    img.src = encodeURIComponent(cert.filename);
    img.className = "modal-image";
    img.alt = cert.title;
    modalBody.appendChild(img);
  }

  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden"; // Disable background scrolling
}

// Close modal
function closeModal() {
  modalOverlay.classList.remove("active");
  modalBody.innerHTML = "";
  document.body.style.overflow = "auto";
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Render the grid items
function filterAndRender() {
  const filtered = certificates.filter(matchesFilter);
  countDisplay.textContent = filtered.length;

  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">📂</div>
        <h3>No Certificates Found</h3>
        <p>Try searching for a different keyword or removing filters.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(cert => {
    const card = document.createElement("div");
    card.className = "certificate-card";
    
    // Icon based on type or category
    let icon = "📜";
    if (cert.type === "image") icon = "🖼️";
    else if (cert.tags.includes("Python")) icon = "🐍";
    else if (cert.tags.includes("AI") || cert.tags.includes("Gemini")) icon = "🤖";
    else if (cert.tags.includes("Database")) icon = "💾";
    else if (cert.tags.includes("Git")) icon = "🐙";
    else if (cert.tags.includes("Cloud") || cert.tags.includes("Azure")) icon = "☁️";

    const tagsHtml = cert.tags.map(t => `<span class="card-tag">${t}</span>`).join("");

    card.innerHTML = `
      <div class="card-top">
        <span class="file-type-badge ${cert.type === 'image' ? 'image' : ''}">${cert.type}</span>
        <span class="card-icon">${icon}</span>
      </div>
      <h3 class="card-title">${cert.title}</h3>
      <div class="card-tags">
        ${tagsHtml}
      </div>
      <div class="card-actions">
        <button class="btn btn-primary btn-preview">Preview</button>
        <a href="${encodeURIComponent(cert.filename)}" download="${cert.filename}" class="btn btn-secondary">Download</a>
      </div>
    `;

    // Hook up preview button
    card.querySelector(".btn-preview").addEventListener("click", () => {
      openPreview(cert);
    });

    grid.appendChild(card);
  });
}

// Search input handler
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  filterAndRender();
});

// Initial Render
renderTags();
filterAndRender();
