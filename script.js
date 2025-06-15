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
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetAutoSlide();
        });
        sliderDotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
        if (index < 0) {
            index = totalSlides - 1;
        } else if (index >= totalSlides) {
            index = 0;
        }
        currentIndex = index;
        const offset = -currentIndex * 100;
        // Koreksi: Menggunakan template literal (backticks ``) untuk interpolasi variabel
        sliderContainer.style.transform = `translateX(${offset}%)`;

        // Update active dot
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000); // Ganti slide setiap 5 detik
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide(); // Mulai auto-slide saat halaman dimuat

    // --- JavaScript untuk Smooth Scroll Navigasi ---
    document.querySelectorAll('.main-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Mencegah perilaku default tautan

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Scroll ke target dengan efek smooth
                window.scrollTo({
                    top: targetSection.offsetTop - document.querySelector('.main-nav').offsetHeight, // Sesuaikan offset jika ada sticky nav
                    behavior: 'smooth'
                });

                // Opsional: tambahkan/hapus kelas 'active' untuk highlight menu
                document.querySelectorAll('.main-nav a').forEach(item => item.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // --- JavaScript untuk Search Bar (Contoh dasar, perlu pengembangan lebih lanjut) ---
    // Fungsi ini akan memerlukan logika backend atau data statis di frontend
    // untuk melakukan pencarian yang sesungguhnya.
    // Untuk saat ini, ini hanya placeholder untuk menunjukkan cara mengambil input.

    const searchButtons = document.querySelectorAll('.search-bar button');
    searchButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling; // Mengambil input sebelumnya
            const searchTerm = input.value.trim();
            const sectionId = button.closest('.section-block').id; // Dapatkan ID section

            if (searchTerm) {
                // Koreksi: Menggunakan template literal (backticks ``) untuk interpolasi variabel
                alert(`Mencari "${searchTerm}" di bagian ${sectionId}... (Fitur ini perlu pengembangan lebih lanjut!)`);
                // Di sini nanti akan ada logika untuk memfilter konten di section tersebut
            } else {
                alert('Silakan masukkan kata kunci pencarian!');
            }
        });
    });
});