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


    // --- JavaScript untuk Menampilkan/Menyembunyikan Section ---
    const menuIconCards = document.querySelectorAll('.menu-icon-card');
    const contentSections = document.querySelectorAll('.section-block'); // Pilih semua section-block
    const sectionSeparators = document.querySelectorAll('.hidden-section-separator');

    // Sembunyikan semua section dan pemisah saat halaman dimuat (KECUALI SECTION MUSIC)
    contentSections.forEach(section => {
        if (section.id !== 'music') { // Tambahkan kondisi ini
            section.classList.add('hidden-section');
            section.classList.remove('active-section');
        }
    });
    sectionSeparators.forEach(separator => {
        separator.classList.add('hidden-section');
        separator.classList.remove('active-section'); 
    });

    menuIconCards.forEach(iconCard => {
        iconCard.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.dataset.target; // Ambil data-target dari a tag
            const targetSection = document.getElementById(targetId);

            // Sembunyikan semua section dan pemisah terlebih dahulu (KECUALI MUSIC)
            contentSections.forEach(section => {
                if (section.id !== 'music') {
                    section.classList.remove('active-section');
                    section.classList.add('hidden-section');
                }
            });

            sectionSeparators.forEach(separator => {
                separator.classList.remove('active-section');
                separator.classList.add('hidden-section');
            });

            // Tampilkan section yang sesuai
            if (targetSection) {
                // Beri sedikit delay untuk transisi opacity agar terlihat smooth
                setTimeout(() => {
                    targetSection.classList.remove('hidden-section');
                    targetSection.classList.add('active-section');

                    // Tampilkan pemisah di bawah section yang baru diaktifkan (jika ada)
                    const nextSibling = targetSection.nextElementSibling;
                    if (nextSibling && nextSibling.classList.contains('hidden-section-separator')) {
                        nextSibling.classList.remove('hidden-section');
                        nextSibling.classList.add('active-section');
                    }
                }, 10); // Sedikit delay
            }
        });
    });


    // --- JavaScript untuk Fungsionalitas Search Bar (Contoh) ---
    function filterContent(searchInputId, contentGridId, itemCardSelector) {
        const searchInput = document.getElementById(searchInputId);
        const contentGrid = document.getElementById(contentGridId);
        const itemCards = contentGrid ? contentGrid.querySelectorAll(itemCardSelector) : [];

        if (!searchInput || !contentGrid) return; // Pastikan elemen ada

        const applyFilter = () => {
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
        };

        searchInput.addEventListener('keyup', applyFilter);

        // Tambahkan event listener untuk tombol cari juga
        const searchButton = searchInput.nextElementSibling; // Asumsi tombol tepat setelah input
        if (searchButton && searchButton.tagName === 'BUTTON') {
             searchButton.addEventListener('click', applyFilter);
        }
    }

    // Panggil fungsi filter untuk setiap section yang memiliki search bar
    filterContent('portfolioSearchInput', 'portfolioGrid', '.item-card');
    filterContent('fashionSearchInput', 'fashionGrid', '.fashion-item-card');
    filterContent('photosSearchInput', 'photosGrid', '.photo-card');
});
