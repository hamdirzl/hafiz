document.addEventListener('DOMContentLoaded', () => {
    // --- JavaScript untuk Banner Otomatis (Slider) ---
    const sliderContainer = document.querySelector('.slider-container');
    const sliderItems = document.querySelectorAll('.slider-item');
    const sliderDotsContainer = document.querySelector('.slider-dots');
    const totalSlides = sliderItems.length;
    let currentIndex = 0;
    let autoSlideInterval;

    // Buat dots navigasi
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.dataset.index = i; // Simpan index di dataset
        dot.addEventListener('click', (e) => {
            const indexClicked = parseInt(e.target.dataset.index);
            goToSlide(indexClicked);
            resetAutoSlide();
        });
        sliderDotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
        if (index < 0) {
            index = totalSlides - 1; // Kembali ke slide terakhir
        } else if (index >= totalSlides) {
            index = 0; // Kembali ke slide pertama
        }
        currentIndex = index;
        const offset = -currentIndex * 100;
        sliderContainer.style.transform = translateX(${offset}%);

        // Update active dot
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 3000); // Ganti slide setiap 3 detik
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide(); // Mulai auto-slide saat halaman dimuat

    // Fitur geser manual (swipe) untuk slider
    let startX;
    let isDragging = false;

    sliderContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        sliderContainer.style.transition = 'none'; // Hentikan transisi saat drag
    });

    sliderContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const walk = (e.clientX - startX) * 0.5; // Kecepatan geser
        sliderContainer.style.transform = translateX(${-currentIndex * 100 + (walk / sliderItems[0].offsetWidth * 100)}%);
    });

    sliderContainer.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        sliderContainer.style.transition = 'transform 0.5s ease-in-out'; // Kembalikan transisi

        const endX = e.clientX;
        const diffX = endX - startX;

        if (diffX > 50) { // Geser ke kanan (prev slide)
            goToSlide(currentIndex - 1);
        } else if (diffX < -50) { // Geser ke kiri (next slide)
            goToSlide(currentIndex + 1);
        } else {
            // Kembali ke slide saat ini jika geseran tidak cukup jauh
            goToSlide(currentIndex);
        }
        resetAutoSlide();
    });

    sliderContainer.addEventListener('mouseleave', () => { // Penting jika mouse keluar saat drag
        if (isDragging) {
            isDragging = false;
            sliderContainer.style.transition = 'transform 0.5s ease-in-out';
            goToSlide(currentIndex);
            resetAutoSlide();
        }
    });

    // Event listener untuk sentuhan (mobile)
    sliderContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        sliderContainer.style.transition = 'none';
    });

    sliderContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const walk = (e.touches[0].clientX - startX) * 0.5;
        sliderContainer.style.transform = translateX(${-currentIndex * 100 + (walk / sliderItems[0].offsetWidth * 100)}%);
    });

    sliderContainer.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        sliderContainer.style.transition = 'transform 0.5s ease-in-out';

        const endX = e.changedTouches[0].clientX;
        const diffX = endX - startX;

        if (diffX > 50) {
            goToSlide(currentIndex - 1);
        } else if (diffX < -50) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(currentIndex);
        }
        resetAutoSlide();
    });


    // --- JavaScript untuk Smooth Scroll dari Icon Menu ---
    document.querySelectorAll('.menu-icon-card').forEach(iconCard => {
        iconCard.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href'); // Ambil href dari a tag
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerOffset = document.querySelector('.full-width-header').offsetHeight + document.querySelector('.social-icons-below-banner').offsetHeight + 40; // Menyesuaikan offset jika ada elemen fixed di atas

                window.scrollTo({
                    top: targetSection.offsetTop - headerOffset,
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- JavaScript untuk Fungsionalitas Search Bar (Contoh) ---
    // Ini adalah implementasi dasar. Untuk data yang sangat banyak,
    // disarankan menggunakan data terstruktur (array of objects)
    // atau mengambil dari API.

    function filterContent(searchInputId, contentGridId, itemCardSelector) {
        const searchInput = document.getElementById(searchInputId);
        const contentGrid = document.getElementById(contentGridId);
        const itemCards = contentGrid ? contentGrid.querySelectorAll(itemCardSelector) : [];

        if (!searchInput || !contentGrid) return; // Pastikan elemen ada

        searchInput.addEventListener('keyup', (e) => {
            const searchTerm = searchInput.value.toLowerCase().trim();

            itemCards.forEach(card => {
                const title = card.querySelector('h3') ? card.querySelector('h3').innerText.toLowerCase() : '';
                const description = card.querySelector('p') ? card.querySelector('p').innerText.toLowerCase() : '';
                const tags = card.dataset.tags ? card.dataset.tags.toLowerCase() : ''; // Ambil dari data-tags

                if (title.includes(searchTerm) || description.includes(searchTerm) || tags.includes(searchTerm)) {
                    card.style.display = 'block'; // Tampilkan kartu
                } else {
                    card.style.display = 'none'; // Sembunyikan kartu
                }
            });
        });

        // Tambahkan event listener untuk tombol cari juga
        const searchButton = searchInput.nextElementSibling; // Asumsi tombol tepat setelah input
        if (searchButton && searchButton.tagName === 'BUTTON') {
             searchButton.addEventListener('click', () => {
                const searchTerm = searchInput.value.toLowerCase().trim();
                itemCards.forEach(card => {
                    const title = card.querySelector('h3') ? card.querySelector('h3').innerText.toLowerCase() : '';
                    const description = card.querySelector('p') ? card.querySelector('p').innerText.toLowerCase() : '';
                    const tags = card.dataset.tags ? card.dataset.tags.toLowerCase() : '';

                    if (title.includes(searchTerm) || description.includes(searchTerm) || tags.includes(searchTerm)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
             });
        }
    }

    // Panggil fungsi filter untuk setiap section yang memiliki search bar
    filterContent('portfolioSearchInput', 'portfolioGrid', '.item-card');
    filterContent('fashionSearchInput', 'fashionGrid', '.fashion-item-card');
    filterContent('photosSearchInput', 'photosGrid', '.photo-card');


    // --- JavaScript untuk Modals (Popup Detail) ---
    const detailButtons = document.querySelectorAll('.view-detail-btn');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-btn');

    detailButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modal;
            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                targetModal.style.display = 'flex'; // Gunakan flex untuk centering
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parentModal = button.closest('.modal');
            if (parentModal) {
                parentModal.style.display = 'none';
            }
        });
    });

    // Tutup modal jika klik di luar konten
    window.addEventListener('click', (event) => {
        modals.forEach(modal => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    });
});
