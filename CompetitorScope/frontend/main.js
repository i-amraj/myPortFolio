const BACKEND_URL = window.location.port === "5500" ? "http://localhost:8000" : window.location.origin;

// Mentor Node: Keep state of panels so accordions operate smoothly.
const openPanels = {};

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const searchBtn = document.getElementById("search-btn");
  const resultsList = document.getElementById("results-list");
  const resultsCount = document.getElementById("results-count");

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Disable Search Button and Show Loading State
    searchBtn.disabled = true;
    searchBtn.innerText = "Analyzing...";
    resultsCount.classList.add("hidden");
    
    // 2. Render skeleton loader screens
    renderSkeletons(resultsList, 3);

    // Pause Three.js background rotation to prioritize CPU rendering of search results
    if (window.ThreeBg) window.ThreeBg.pause();

    const businessType = document.getElementById("business-type").value.trim();
    const state = document.getElementById("state").value.trim();
    const city = document.getElementById("city").value.trim();

    try {
      const response = await fetch(`${BACKEND_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          business_type: businessType,
          state: state,
          city: city
        })
      });

      const result = await response.json();

      if (result.success) {
        renderCompanies(result.data, resultsList, resultsCount);
      } else {
        renderError(resultsList, "Failed to analyze competitors. Google Places search failed.");
      }
    } catch (error) {
      console.error("Search Error:", error);
      renderError(resultsList, "Connection error. Make sure the backend server is running.");
    } finally {
      searchBtn.disabled = false;
      searchBtn.innerText = "Analyze Competitors";
    }
  });
});

// Mentor Node: Creating skeletons gives immediate visual feedback, keeping perceived performance high.
function renderSkeletons(container, count) {
  container.innerHTML = Array.from({ length: count }).map(() => `
    <div class="bg-brandSurface border border-brandBorder p-6 rounded-xl skeleton h-48 w-full"></div>
  `).join("");
}

function renderError(container, message) {
  container.innerHTML = `
    <div class="text-center py-12 border border-brandError/30 bg-brandError/5 rounded-2xl">
      <svg class="mx-auto h-12 w-12 text-brandError mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
      <h3 class="text-lg font-bold text-brandTextPrimary mb-1">Analysis Error</h3>
      <p class="text-brandTextSecondary text-sm max-w-md mx-auto">${message}</p>
    </div>
  `;
}

function renderCompanies(companies, container, countContainer) {
  if (companies.length === 0) {
    countContainer.classList.add("hidden");
    container.innerHTML = `
      <div class="text-center py-16 border border-brandBorder rounded-2xl bg-brandSurface/20">
        <svg class="mx-auto h-12 w-12 text-brandTextSecondary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 class="text-lg font-bold text-brandTextPrimary mb-1">No Competitors Found</h3>
        <p class="text-brandTextSecondary text-sm max-w-sm mx-auto">
          We couldn't find any software/IT companies matching those criteria. Try a different city or sector.
        </p>
      </div>
    `;
    return;
  }

  countContainer.classList.remove("hidden");
  countContainer.innerText = `${companies.length} Competitors Discovered`;

  container.innerHTML = companies.map(company => {
    const formattedWebsite = company.website ? 
      `<a href="${company.website}" target="_blank" rel="noopener" class="text-brandCyan hover:underline text-sm font-semibold flex items-center gap-1">
        Visit Website
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
       </a>` : `<span class="text-brandTextSecondary text-sm italic">No website listed</span>`;

    const formattedLinkedin = company.linkedin_url ?
      `<a href="${company.linkedin_url}" target="_blank" rel="noopener" class="text-brandViolet hover:underline text-sm font-semibold flex items-center gap-1 mt-1">
        LinkedIn Profile
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
       </a>` : '';

    return `
      <div class="bg-brandSurface border border-brandBorder rounded-xl p-6 glow-primary fade-in" id="card-${company.id}">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h3 class="text-xl font-bold text-brandTextPrimary">${company.name}</h3>
            <p class="text-brandTextSecondary text-sm">Location: ${company.city}, ${company.state}</p>
          </div>
          <div>
            ${formattedWebsite}
            ${formattedLinkedin}
          </div>
        </div>

        <!-- On-Demand Action Row -->
        <div class="flex flex-wrap gap-3 mt-4 border-t border-brandBorder pt-4">
          <button onclick="toggleDetails('${company.id}')" id="btn-details-${company.id}"
            class="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-transparent border border-brandCyan text-brandCyan hover:bg-brandCyan hover:text-brandBg transition-all duration-200">
            Company Details
          </button>
          <button onclick="toggleTeam('${company.id}')" id="btn-team-${company.id}"
            class="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-transparent border border-brandViolet text-brandViolet hover:bg-brandViolet hover:text-brandTextPrimary transition-all duration-200">
            Team Insights
          </button>
        </div>

        <!-- Accordion Panels -->
        <div id="panel-details-${company.id}" class="accordion-panel mt-4 border-t border-brandBorder/50 pt-4"></div>
        <div id="panel-team-${company.id}" class="accordion-panel mt-4 border-t border-brandBorder/50 pt-4"></div>
      </div>
    `;
  }).join("");
}

// Mentor Node: Handles on-demand details fetching and handles cache/fresh status transparently.
async function toggleDetails(companyId) {
  const panel = document.getElementById(`panel-details-${companyId}`);
  const btn = document.getElementById(`btn-details-${companyId}`);
  
  // Close team panel if open
  closePanel(`panel-team-${companyId}`);

  if (panel.classList.contains("open")) {
    closePanel(`panel-details-${companyId}`);
    return;
  }

  // Set active/loading states
  panel.classList.add("open");
  panel.innerHTML = `
    <div class="space-y-3 skeleton p-4 rounded-lg">
      <div class="h-4 bg-brandBorder rounded w-1/3"></div>
      <div class="h-4 bg-brandBorder rounded w-2/3"></div>
      <div class="h-4 bg-brandBorder rounded w-1/2"></div>
    </div>
  `;
  btn.disabled = true;

  try {
    const response = await fetch(`${BACKEND_URL}/company/${companyId}/details`);
    const result = await response.json();

    if (result.success) {
      const data = result.data;
      const cachedBadge = result.cached ? 
        `<span class="bg-brandSuccess/20 text-brandSuccess text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider">Cached</span>` : 
        `<span class="bg-brandViolet/20 text-brandViolet text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider">Fresh</span>`;
        
      panel.innerHTML = `
        <div class="bg-brandBg/60 border border-brandBorder/40 p-4 rounded-lg text-sm space-y-3">
          <div class="flex justify-between items-center border-b border-brandBorder/30 pb-2 mb-2">
            <span class="font-bold text-brandCyan text-xs uppercase tracking-wider">Registration & Entity Details</span>
            ${cachedBadge}
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-brandTextSecondary text-xs">CIN Number</p>
              <p class="font-mono text-brandTextPrimary font-medium">${data.cin || "N/A"}</p>
            </div>
            <div>
              <p class="text-brandTextSecondary text-xs">GST Number</p>
              <p class="font-mono text-brandTextPrimary font-medium">${data.gst || "N/A"}</p>
            </div>
            <div>
              <p class="text-brandTextSecondary text-xs">Incorporation Date</p>
              <p class="font-medium text-brandTextPrimary">${data.incorporation_date || "N/A"}</p>
            </div>
            <div>
              <p class="text-brandTextSecondary text-xs">Company Status</p>
              <span class="inline-block mt-0.5 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                data.status?.toLowerCase() === 'active' ? 'bg-brandSuccess/10 text-brandSuccess' : 'bg-brandWarning/10 text-brandWarning'
              }">${data.status || "N/A"}</span>
            </div>
          </div>
          <div class="pt-2 border-t border-brandBorder/30">
            <p class="text-brandTextSecondary text-xs">Registered Address</p>
            <p class="text-brandTextPrimary font-medium text-xs leading-relaxed">${data.address || "N/A"}</p>
          </div>
        </div>
      `;
    } else {
      panel.innerHTML = `<p class="text-brandError text-xs">Failed to fetch registration details from public sources.</p>`;
    }
  } catch (error) {
    panel.innerHTML = `<p class="text-brandError text-xs">Connection error. Details unavailable.</p>`;
  } finally {
    btn.disabled = false;
  }
}

// Mentor Node: Implements the exact Team Insights design using Stat blocks requested in Design.md.
async function toggleTeam(companyId) {
  const panel = document.getElementById(`panel-team-${companyId}`);
  const btn = document.getElementById(`btn-team-${companyId}`);
  
  // Close details panel if open
  closePanel(`panel-details-${companyId}`);

  if (panel.classList.contains("open")) {
    closePanel(`panel-team-${companyId}`);
    return;
  }

  // Set active/loading states
  panel.classList.add("open");
  panel.innerHTML = `
    <div class="space-y-3 skeleton p-4 rounded-lg">
      <div class="h-4 bg-brandBorder rounded w-1/3"></div>
      <div class="h-4 bg-brandBorder rounded w-2/3"></div>
    </div>
  `;
  btn.disabled = true;

  try {
    const response = await fetch(`${BACKEND_URL}/company/${companyId}/team`);
    const result = await response.json();

    if (result.success) {
      const data = result.data;
      const cachedBadge = result.cached ? 
        `<span class="bg-brandSuccess/20 text-brandSuccess text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider">Cached</span>` : 
        `<span class="bg-brandViolet/20 text-brandViolet text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider">Fresh</span>`;

      const linkedinLink = data.linkedin_url ? 
        `<a href="${data.linkedin_url}" target="_blank" rel="noopener" class="text-brandCyan hover:underline text-xs font-semibold flex items-center gap-1">
          LinkedIn Page
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
         </a>` : '';

      // Dynamically inject LinkedIn URL link into the card header if found and not already present
      if (data.linkedin_url) {
        const cardHeader = document.querySelector(`#card-${companyId} div div:last-child`);
        if (cardHeader && !cardHeader.innerHTML.includes("linkedin.com")) {
          cardHeader.insertAdjacentHTML('beforeend', `
            <a href="${data.linkedin_url}" target="_blank" rel="noopener" class="text-brandViolet hover:underline text-sm font-semibold flex items-center gap-1 mt-1">
              LinkedIn Profile
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          `);
        }
      }

      panel.innerHTML = `
        <div class="bg-brandBg/60 border border-brandBorder/40 p-4 rounded-lg text-sm space-y-4">
          <div class="flex justify-between items-center border-b border-brandBorder/30 pb-2">
            <span class="font-bold text-brandViolet text-xs uppercase tracking-wider">Aggregate Team Statistics</span>
            <div class="flex items-center gap-3">
              ${linkedinLink}
              ${cachedBadge}
            </div>
          </div>
          
          <!-- Stat Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div class="bg-brandSurface/65 border border-brandBorder p-3 rounded-lg text-center">
              <span class="text-brandTextSecondary text-xs block mb-1">LinkedIn Range</span>
              <span class="font-bold text-brandTextPrimary text-sm">${data.linkedin_range || "N/A"}</span>
            </div>
            <div class="bg-brandSurface/65 border border-brandBorder p-3 rounded-lg text-center">
              <span class="text-brandTextSecondary text-xs block mb-1">EPFO Count</span>
              <span class="font-bold text-brandCyan text-lg font-mono">${data.epfo_count || "N/A"}</span>
            </div>
            <div class="bg-brandSurface/65 border border-brandBorder p-3 rounded-lg text-center col-span-2 sm:col-span-1">
              <span class="text-brandTextSecondary text-xs block mb-1">Total Est. Size</span>
              <span class="font-bold text-brandViolet text-lg font-mono">${data.total_estimate || "N/A"}</span>
            </div>
          </div>

          <!-- Department Estimates -->
          <div class="pt-2">
            <span class="text-brandTextSecondary text-xs font-semibold uppercase tracking-wider block mb-2">Estimated Department Breakdown</span>
            <div class="grid grid-cols-3 gap-2">
              <div class="bg-brandSurface/40 p-2 rounded text-center">
                <span class="text-[10px] text-brandTextSecondary block">Engineering</span>
                <span class="font-bold font-mono text-brandTextPrimary">${data.dev_count || 0}</span>
              </div>
              <div class="bg-brandSurface/40 p-2 rounded text-center">
                <span class="text-[10px] text-brandTextSecondary block">Sales</span>
                <span class="font-bold font-mono text-brandTextPrimary">${data.sales_count || 0}</span>
              </div>
              <div class="bg-brandSurface/40 p-2 rounded text-center">
                <span class="text-[10px] text-brandTextSecondary block">Marketing</span>
                <span class="font-bold font-mono text-brandTextPrimary">${data.marketing_count || 0}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      panel.innerHTML = `<p class="text-brandError text-xs">Failed to fetch team data from public sources.</p>`;
    }
  } catch (error) {
    panel.innerHTML = `<p class="text-brandError text-xs">Connection error. Team data unavailable.</p>`;
  } finally {
    btn.disabled = false;
  }
}

function closePanel(panelId) {
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.classList.remove("open");
    panel.innerHTML = "";
  }
}
