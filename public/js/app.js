"use strict";

// ── DOM refs ────────────────────────────────────────────────
const sectionLanding   = document.getElementById("section-landing");
const sectionBadge     = document.getElementById("section-badge");
const searchInput      = document.getElementById("search-input");
const searchBtn        = document.getElementById("search-btn");
const searchError      = document.getElementById("search-error");
const btnBack          = document.getElementById("btn-back");
const btnDownload      = document.getElementById("btn-download");
const btnCopyLink      = document.getElementById("btn-copy-link");
const btnLinkedin      = document.getElementById("btn-share-linkedin");
const btnWhatsapp      = document.getElementById("btn-share-whatsapp");
const copyConfirm      = document.getElementById("copy-confirm");
const footerYear       = document.getElementById("footer-year");

// Badge fields
const badgeInitials    = document.getElementById("badge-initials");
const badgeName        = document.getElementById("badge-name");
const badgeRole        = document.getElementById("badge-role");
const badgeNationality = document.getElementById("badge-nationality");
const badgeDays        = document.getElementById("badge-days");
const badgeMissions    = document.getElementById("badge-missions");
const badgeYear        = document.getElementById("badge-year");
const badgeNumber      = document.getElementById("badge-number");

// ── State ───────────────────────────────────────────────────
let currentGuard = null;

// ── Init ────────────────────────────────────────────────────
footerYear.textContent = new Date().getFullYear();

// Check URL for a pre-loaded badge (share link)
const urlParams = new URLSearchParams(window.location.search);
const preloadId = urlParams.get("id");
if (preloadId) {
  searchInput.value = preloadId;
  loadBadge(preloadId);
}

// ── Event listeners ─────────────────────────────────────────
searchBtn.addEventListener("click", handleSearch);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});

searchInput.addEventListener("input", () => {
  if (searchError.textContent) hideError();
});

btnBack.addEventListener("click", showLanding);
btnDownload.addEventListener("click", downloadBadge);
btnCopyLink.addEventListener("click", copyShareLink);
btnLinkedin.addEventListener("click", shareLinkedIn);
btnWhatsapp.addEventListener("click", shareWhatsApp);

// All demo buttons (search hint + demo panel)
document.querySelectorAll(".demo-btn, .demo-op-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    searchInput.value = btn.dataset.query;
    handleSearch();
  });
});

// ── Search ──────────────────────────────────────────────────
function handleSearch() {
  const query = searchInput.value.trim();
  if (!query) {
    showError("Please enter your employee ID or name.");
    searchInput.focus();
    return;
  }
  loadBadge(query);
}

async function loadBadge(query) {
  setSearchLoading(true);
  hideError();

  try {
    const res = await fetch(`/api/guard?query=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (!res.ok) {
      showError(data.error || "Guard not found. Please check your ID or name.");
      return;
    }

    currentGuard = data;
    renderBadge(data);
    showBadgeSection();
    updateURLParam(data.employeeId);
  } catch {
    showError("Could not connect to the server. Please try again.");
  } finally {
    setSearchLoading(false);
  }
}

// ── Badge rendering ─────────────────────────────────────────
const nationalityFlags = {
  "Greek":        "🇬🇷",
  "South African": "🇿🇦"
};

function renderBadge(guard) {
  // Initials from full name
  const parts = guard.fullName.trim().split(" ");
  const initials = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : parts[0][0];
  badgeInitials.textContent = initials.toUpperCase();

  badgeName.textContent        = guard.fullName.toUpperCase();
  badgeRole.textContent        = guard.role.toUpperCase();

  const flag = nationalityFlags[guard.nationality] || "";
  badgeNationality.textContent = flag
    ? `${flag}  ${guard.nationality}`
    : guard.nationality;

  badgeDays.textContent        = formatNumber(guard.daysAtSea);
  badgeMissions.textContent    = formatNumber(guard.missionsCompleted);
  badgeYear.textContent        = guard.joinYear;
  badgeNumber.textContent      = guard.badgeNumber;
}

function formatNumber(n) {
  return n.toLocaleString("en-US");
}

// ── Navigation ──────────────────────────────────────────────
function showBadgeSection() {
  sectionLanding.classList.remove("active");
  sectionLanding.hidden = true;
  sectionBadge.hidden = false;
  sectionBadge.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showLanding() {
  sectionBadge.classList.remove("active");
  sectionBadge.hidden = true;
  sectionLanding.hidden = false;
  sectionLanding.classList.add("active");
  clearURLParam();
  currentGuard = null;
}

// ── Download ─────────────────────────────────────────────────
async function downloadBadge() {
  const badge = document.getElementById("badge");
  btnDownload.disabled = true;

  try {
    const canvas = await html2canvas(badge, {
      scale: 3,
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
      logging: false,
      onclone: (cloned) => {
        const clonedBadge = cloned.getElementById("badge");
        clonedBadge.style.transform = "none";
        clonedBadge.style.animation = "none";
      }
    });

    const link = document.createElement("a");
    const safeName = currentGuard
      ? currentGuard.fullName.replace(/\s+/g, "_")
      : "badge";
    link.download = `MSS_Badge_${safeName}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    console.error("Download failed:", err);
    alert("Could not generate the badge image. Please try again.");
  } finally {
    btnDownload.disabled = false;
  }
}

// ── Copy share link ──────────────────────────────────────────
function copyShareLink() {
  if (!currentGuard) return;
  const url = buildShareUrl(currentGuard.employeeId);

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(url).then(() => showCopyConfirm());
  } else {
    const el = document.createElement("textarea");
    el.value = url;
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    showCopyConfirm();
  }
}

function showCopyConfirm() {
  copyConfirm.hidden = false;
  setTimeout(() => { copyConfirm.hidden = true; }, 3000);
}

// ── Social sharing ───────────────────────────────────────────
function shareLinkedIn() {
  if (!currentGuard) return;
  const url = encodeURIComponent(buildShareUrl(currentGuard.employeeId));
  const text = encodeURIComponent(
    `Proud to share my operational service badge from MS Security Group! ` +
    `${currentGuard.daysAtSea} days at sea · ${currentGuard.missionsCompleted} missions completed. #MaritimeSecurity #MSSecurity`
  );
  window.open(
    `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodeURIComponent("My Maritime Security Badge")}&summary=${text}`,
    "_blank",
    "noopener,width=600,height=500"
  );
}

function shareWhatsApp() {
  if (!currentGuard) return;
  const shareUrl = buildShareUrl(currentGuard.employeeId);
  const flag = nationalityFlags[currentGuard.nationality] || "";
  const text = encodeURIComponent(
    `Check out my Maritime Security Badge from MS Security Group!\n` +
    `${currentGuard.fullName} ${flag} · ${currentGuard.daysAtSea} days at sea · ${currentGuard.missionsCompleted} missions\n\n${shareUrl}`
  );
  window.open(`https://wa.me/?text=${text}`, "_blank", "noopener");
}

// ── Helpers ──────────────────────────────────────────────────
function buildShareUrl(employeeId) {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}?id=${encodeURIComponent(employeeId)}`;
}

function updateURLParam(employeeId) {
  const url = new URL(window.location);
  url.searchParams.set("id", employeeId);
  window.history.replaceState({}, "", url.toString());
}

function clearURLParam() {
  const url = new URL(window.location);
  url.searchParams.delete("id");
  window.history.replaceState({}, "", url.toString());
}

function showError(msg) {
  searchError.textContent = msg;
  searchError.hidden = false;
}

function hideError() {
  searchError.textContent = "";
  searchError.hidden = true;
}

function setSearchLoading(loading) {
  const btnText    = searchBtn.querySelector(".btn-text");
  const btnSpinner = searchBtn.querySelector(".btn-spinner");
  searchBtn.disabled = loading;
  if (btnText)    btnText.hidden    = loading;
  if (btnSpinner) btnSpinner.hidden = !loading;
}
