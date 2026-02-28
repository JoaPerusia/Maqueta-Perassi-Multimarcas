const vehicleCatalog = [
  {
    key: 'toyota corolla xei',
    name: 'Toyota Corolla XEI',
    media: [
      { type: 'image', src: 'assets/vehiculo-auto.png', alt: 'Toyota Corolla XEI frente' },
      { type: 'image', src: 'assets/vehiculo-auto2.png', alt: 'Toyota Corolla XEI lateral' },
      { type: 'image', src: 'assets/vehiculo-producto.jpg', alt: 'Toyota Corolla XEI interior' }
    ]
  },
  {
    key: 'volkswagen amarok highline',
    name: 'Volkswagen Amarok Highline',
    media: [
      { type: 'image', src: 'assets/vehiculo-pickup.png', alt: 'Volkswagen Amarok Highline frente' },
      { type: 'image', src: 'assets/vehiculo-pickup2.png', alt: 'Volkswagen Amarok Highline lateral' },
      { type: 'image', src: 'assets/vehiculo-producto.jpg', alt: 'Volkswagen Amarok Highline interior' }
    ]
  },
  {
    key: 'chevrolet onix ltz',
    name: 'Chevrolet Onix LTZ',
    media: [
      { type: 'image', src: 'assets/vehiculo-auto2.png', alt: 'Chevrolet Onix LTZ frente' },
      { type: 'image', src: 'assets/vehiculo-auto.png', alt: 'Chevrolet Onix LTZ lateral' },
      { type: 'image', src: 'assets/vehiculo-producto.jpg', alt: 'Chevrolet Onix LTZ interior' }
    ]
  },
  {
    key: 'peugeot 2008 feline',
    name: 'Peugeot 2008 Feline',
    media: [
      { type: 'image', src: 'assets/vehiculo-producto.jpg', alt: 'Peugeot 2008 Feline frente' },
      { type: 'image', src: 'assets/vehiculo-auto2.png', alt: 'Peugeot 2008 Feline lateral' },
      { type: 'image', src: 'assets/vehiculo-auto.png', alt: 'Peugeot 2008 Feline interior' }
    ]
  },
  {
    key: 'ford ranger xls',
    name: 'Ford Ranger XLS',
    media: [
      { type: 'image', src: 'assets/vehiculo-pickup2.png', alt: 'Ford Ranger XLS frente' },
      { type: 'image', src: 'assets/vehiculo-pickup.png', alt: 'Ford Ranger XLS lateral' },
      { type: 'image', src: 'assets/vehiculo-producto.jpg', alt: 'Ford Ranger XLS interior' }
    ]
  },
  {
    key: 'nissan frontier xe',
    name: 'Nissan Frontier XE',
    media: [
      { type: 'image', src: 'assets/vehiculo-pickup.png', alt: 'Nissan Frontier XE frente' },
      { type: 'image', src: 'assets/vehiculo-pickup2.png', alt: 'Nissan Frontier XE lateral' },
      { type: 'image', src: 'assets/vehiculo-producto.jpg', alt: 'Nissan Frontier XE interior' }
    ]
  }
];

const findVehicleByName = (name) => vehicleCatalog.find((item) => item.name.toLowerCase() === (name || '').toLowerCase().trim());
const findVehicleByKey = (key) => vehicleCatalog.find((item) => item.key === key);

const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

const heroSection = document.querySelector('.hero, .brand-bg-lock');
const toggleBrandBackground = () => {
  if (!heroSection) {
    document.body.classList.add('show-brand-bg');
    return;
  }

  const triggerPoint = Math.max(80, heroSection.offsetHeight * 0.55);
  document.body.classList.toggle('show-brand-bg', window.scrollY > triggerPoint);
};

toggleBrandBackground();
window.addEventListener('scroll', toggleBrandBackground, { passive: true });
window.addEventListener('resize', toggleBrandBackground);

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealItems.length) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const productGrid = document.getElementById('productGrid');
if (productGrid) {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('searchInput');
  const products = Array.from(productGrid.querySelectorAll('.vehicle-card'));
  const emptyState = document.getElementById('emptyState');
  let activeFilter = 'all';

  const applyFilters = () => {
    const query = (searchInput?.value || '').toLowerCase().trim();
    let visibleCount = 0;

    products.forEach((card) => {
      const type = card.dataset.type || '';
      const name = card.dataset.name || '';
      const matchesType = activeFilter === 'all' || type === activeFilter;
      const matchesText = !query || name.includes(query);
      const show = matchesType && matchesText;
      card.hidden = !show;
      if (show) visibleCount += 1;
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  applyFilters();

  const modal = document.getElementById('galleryModal');
  const closeModalBtn = modal?.querySelector('.gallery-close');
  const prevBtn = modal?.querySelector('.gallery-nav.prev');
  const nextBtn = modal?.querySelector('.gallery-nav.next');
  const mediaWrap = document.getElementById('galleryMediaWrap');
  const dotsWrap = document.getElementById('galleryDots');
  const caption = document.getElementById('galleryCaption');
  const modalConsultLink = document.getElementById('modalConsultLink');

  let currentItems = [];
  let currentIndex = 0;
  let startX = null;

  const buildContactUrl = (vehicleName, interest = 'compra') => {
    const params = new URLSearchParams();
    params.set('interest', interest);
    params.set('vehicle', vehicleName);
    return `contacto.html?${params.toString()}`;
  };

  const renderGallery = () => {
    if (!mediaWrap || !dotsWrap || !caption || currentItems.length === 0) return;
    const current = currentItems[currentIndex];

    mediaWrap.innerHTML = '';
    if (current.type === 'video') {
      const video = document.createElement('video');
      video.src = current.src;
      video.controls = true;
      video.playsInline = true;
      mediaWrap.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = current.src;
      img.alt = current.alt || 'Imagen del vehículo';
      mediaWrap.appendChild(img);
    }

    const dots = currentItems.map((_, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `gallery-dot${index === currentIndex ? ' active' : ''}`;
      btn.setAttribute('aria-label', `Ir a imagen ${index + 1}`);
      btn.addEventListener('click', () => {
        currentIndex = index;
        renderGallery();
      });
      return btn;
    });
    dotsWrap.replaceChildren(...dots);
  };

  const openGallery = (card) => {
    if (!modal || !card) return;
    const key = card.dataset.name || '';
    const selectedVehicle = findVehicleByKey(key) || vehicleCatalog[0];
    currentItems = selectedVehicle.media;
    currentIndex = 0;
    if (caption) {
      caption.textContent = selectedVehicle.name;
    }
    if (modalConsultLink) {
      modalConsultLink.href = buildContactUrl(selectedVehicle.name, 'compra');
    }
    renderGallery();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  };

  const moveGallery = (delta) => {
    if (!currentItems.length) return;
    currentIndex = (currentIndex + delta + currentItems.length) % currentItems.length;
    renderGallery();
  };

  products.forEach((card) => {
    const cardName = card.dataset.vehicleTitle || card.querySelector('h3')?.textContent?.trim() || '';
    const consultLink = card.querySelector('.consult-link');
    if (consultLink && cardName) {
      consultLink.href = buildContactUrl(cardName, 'compra');
      consultLink.addEventListener('click', (event) => {
        event.stopPropagation();
      });
    }

    card.addEventListener('click', (event) => {
      if (event.target.closest('a,button,input,select,textarea,label')) return;
      openGallery(card);
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openGallery(card);
      }
    });
  });

  prevBtn?.addEventListener('click', () => moveGallery(-1));
  nextBtn?.addEventListener('click', () => moveGallery(1));
  closeModalBtn?.addEventListener('click', closeGallery);

  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeGallery();
  });

  mediaWrap?.addEventListener('touchstart', (event) => {
    startX = event.changedTouches[0].clientX;
  }, { passive: true });

  mediaWrap?.addEventListener('touchend', (event) => {
    if (startX === null) return;
    const endX = event.changedTouches[0].clientX;
    const diff = endX - startX;
    if (Math.abs(diff) > 35) {
      moveGallery(diff < 0 ? 1 : -1);
    }
    startX = null;
  }, { passive: true });

  document.addEventListener('keydown', (event) => {
    if (!modal || modal.hidden) return;
    if (event.key === 'Escape') closeGallery();
    if (event.key === 'ArrowRight') moveGallery(1);
    if (event.key === 'ArrowLeft') moveGallery(-1);
  });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const formMessage = document.getElementById('formMessage');
  const interestField = document.getElementById('interest');
  const vehicleField = document.getElementById('vehicleAvailable');
  const vehicleOptions = document.getElementById('vehicleOptions');
  const addVehicleBtn = document.getElementById('addVehicleBtn');
  const selectedVehiclesList = document.getElementById('selectedVehiclesList');
  const selectedVehiclesInput = document.getElementById('selectedVehicles');
  const selectedVehicles = [];

  if (vehicleOptions) {
    vehicleOptions.innerHTML = vehicleCatalog.map((vehicle) => `<option value="${vehicle.name}"></option>`).join('');
  }

  const syncSelectedVehiclesInput = () => {
    if (!selectedVehiclesInput) return;
    selectedVehiclesInput.value = selectedVehicles.join(' | ');
  };

  const renderSelectedVehicles = () => {
    if (!selectedVehiclesList) return;
    selectedVehiclesList.innerHTML = '';
    selectedVehicles.forEach((vehicleName, index) => {
      const chip = document.createElement('span');
      chip.className = 'vehicle-chip';
      chip.textContent = vehicleName;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.setAttribute('aria-label', `Quitar ${vehicleName}`);
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', () => {
        selectedVehicles.splice(index, 1);
        renderSelectedVehicles();
      });

      chip.appendChild(removeBtn);
      selectedVehiclesList.appendChild(chip);
    });
    syncSelectedVehiclesInput();
  };

  const addVehicleSelection = (rawValue) => {
    const value = (rawValue || '').trim();
    if (!value) return;
    const normalized = value.toLowerCase();
    const matchedVehicle = vehicleCatalog.find((vehicle) => vehicle.name.toLowerCase() === normalized);
    const finalName = matchedVehicle ? matchedVehicle.name : value;

    if (selectedVehicles.some((item) => item.toLowerCase() === finalName.toLowerCase())) {
      vehicleField.value = '';
      return;
    }

    selectedVehicles.push(finalName);
    renderSelectedVehicles();
    vehicleField.value = '';
  };

  const params = new URLSearchParams(window.location.search);
  const paramVehicle = params.get('vehicle');
  const paramInterest = params.get('interest');

  if (interestField && ['compra', 'venta', 'permuta'].includes(paramInterest || '')) {
    interestField.value = paramInterest;
  }

  if (vehicleField && paramVehicle) {
    addVehicleSelection(paramVehicle);
    if (interestField && !interestField.value) {
      interestField.value = 'compra';
    }
  }

  const updateVehicleFieldState = () => {
    if (!interestField || !vehicleField || !addVehicleBtn) return;
    const isSelling = interestField.value === 'venta';
    vehicleField.disabled = isSelling;
    addVehicleBtn.disabled = isSelling;
    if (isSelling) {
      vehicleField.value = '';
      selectedVehicles.length = 0;
      renderSelectedVehicles();
    }
  };

  updateVehicleFieldState();
  interestField?.addEventListener('change', updateVehicleFieldState);

  addVehicleBtn?.addEventListener('click', () => {
    addVehicleSelection(vehicleField?.value);
  });

  vehicleField?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addVehicleSelection(vehicleField.value);
    }
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    if (formMessage) {
      formMessage.textContent = 'Gracias. Tu consulta fue registrada para seguimiento comercial.';
    }

    contactForm.reset();
    selectedVehicles.length = 0;
    renderSelectedVehicles();
    updateVehicleFieldState();
  });
}
