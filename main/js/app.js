// js/app.js
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const grid = document.getElementById('catalog-grid');
  const searchInput = document.getElementById('search-input');
  const filterBtns = document.querySelectorAll('#filter-buttons button');
  const sortSelect = document.getElementById('sort-select');
  const noResultsMsg = document.getElementById('no-results');
  const modal = document.getElementById('detail-modal');
  const closeModalBtn = document.querySelector('.close-modal');

  // State
  let currentData = [...franchises];

  // Render Cards
  function renderCards(data) {
    grid.innerHTML = '';
    if (data.length === 0) {
      noResultsMsg.classList.remove('hidden');
      return;
    }
    noResultsMsg.classList.add('hidden');

    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-img" style="background-image: url('${item.image}')"></div>
        <div class="card-body">
          <h3>${item.name}</h3>
          <p class="card-category">${item.category}</p>
          <p class="card-short">${item.shortDesc}</p>
          <button class="btn-details" data-id="${item.id}">Подробнее</button>
        </div>
      `;
      grid.appendChild(card);
    });

    // Attach event listeners to "Подробнее" buttons
    document.querySelectorAll('.btn-details').forEach(btn => {
      btn.addEventListener('click', (e) => openModal(e.target.dataset.id));
    });
  }

  // Filter Logic
  function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    const activeCategory = document.querySelector('#filter-buttons .active').dataset.category;
    const sortValue = sortSelect.value;

    let filtered = franchises.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(query);
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      return matchSearch && matchCategory;
    });

    if (sortValue === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    }

    currentData = filtered;
    renderCards(currentData);
  }

  // Event Listeners
  searchInput.addEventListener('input', applyFilters);
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });
  sortSelect.addEventListener('change', applyFilters);

  // Modal Logic
  function openModal(id) {
    const item = franchises.find(f => f.id == id);
    if (!item) return;
    document.getElementById('modal-img').src = item.image;
    document.getElementById('modal-title').textContent = item.name;
    document.getElementById('modal-category').textContent = item.category;
    document.getElementById('modal-genre').textContent = item.genre;
    document.getElementById('modal-desc').textContent = item.fullDesc;
    modal.classList.remove('hidden');
  }

  closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  // Initial Render
  applyFilters();
});