const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const grid = $("#vehicleGrid");
const header = $("#header");
const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");

const modal = $("#vehicleModal");
const modalImage = $("#modalImage");
const modalBrand = $("#modalBrand");
const modalTitle = $("#modalTitle");
const modalMeta = $("#modalMeta");
const modalPrice = $("#modalPrice");
const modalWhatsapp = $("#modalWhatsapp");

const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn");

function vehicleCard(vehicle) {
  return `
    <article class="vehicle-card">
      <div class="vehicle-image">
        <img src="${vehicle.image}" alt="${vehicle.brand} ${vehicle.name}" loading="lazy">
        <span class="badge">${vehicle.status || "DISPONÍVEL"}</span>
      </div>

      <div class="vehicle-body">
        <div class="vehicle-brand">${vehicle.brand}</div>
        <h3 class="vehicle-name">${vehicle.name}</h3>

        <div class="vehicle-meta">
          <span>${vehicle.year}</span>
          <span>${vehicle.km}</span>
          <span>${vehicle.transmission}</span>
        </div>

        <button class="btn btn-outline vehicle-action" data-vehicle-id="${vehicle.id}">
          Falar sobre este carro <span></span>
        </button>
      </div>
    </article>
  `;
}

function renderVehicles() {
  if (!grid) return;
  
  grid.innerHTML = vehicles.map(vehicleCard).join("");

  $$(".vehicle-action").forEach(button => {
    button.addEventListener("click", () => {
      const vehicle = vehicles.find(v => String(v.id) === String(button.dataset.vehicleId));
      if (vehicle) openModal(vehicle);
    });
  });
}

function setupCarousel() {
  if (!grid || !prevBtn || !nextBtn) return;

  const scrollAmount = 340;

  nextBtn.addEventListener("click", () => {
    grid.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  prevBtn.addEventListener("click", () => {
    grid.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });
}

function openModal(vehicle) {
  modalBrand.textContent = vehicle.brand || "PCAR MULTIMARCAS";
  modalTitle.textContent = vehicle.name || "Veículo";

  modalMeta.textContent = [
    vehicle.year,
    vehicle.km,
    vehicle.transmission,
    vehicle.fuel
  ].filter(Boolean).join(" • ");

  modalPrice.textContent = "Consulte condições e valores";

  modalImage.innerHTML = `
    <img src="${vehicle.image}" alt="${vehicle.brand} ${vehicle.name}">
  `;

  const message = `Olá! Vi o ${vehicle.brand} ${vehicle.name} no site da PCAR e gostaria de consultar detalhes.`;
  modalWhatsapp.href = `https://wa.me/5587999382800?text=${encodeURIComponent(message)}`;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

$$("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

$$(".main-nav a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 30);
}, { passive: true });

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

$$(".reveal").forEach(element => revealObserver.observe(element));

const sections = $$("main section[id]");
const navLinks = $$(".main-nav a");

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    navLinks.forEach(link => link.classList.remove("active"));
    const active = $(`.main-nav a[href="#${entry.target.id}"]`);
    active?.classList.add("active");
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach(section => sectionObserver.observe(section));

renderVehicles();
setupCarousel();
