/* ================================
   SLIDER.JS - SWIPER CONFIGURATION
   ================================ */

// ================================
// 1. HERO SLIDER
// ================================

const heroSwiper = new Swiper('#hero-swiper', {
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },
  speed: 1000,
  spaceBetween: 0,
});

// ================================
// 2. TESTIMONIALS SLIDER
// ================================

const testimonialsSwiper = new Swiper('#testimonials-swiper', {
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
  },
  speed: 500,
});

// ================================
// 3. GALLERY SLIDER
// ================================

const gallerySwiper = new Swiper('#gallery-swiper', {
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
  },
  speed: 500,
});

// ================================
// 4. NOTÍCIAS/AVISOS SLIDER
// ================================

const newsSwiper = new Swiper('#news-swiper', {
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
  speed: 600,
});

// ================================
// 5. THUMBS GALLERY (Galeria com preview)
// ================================

let thumbsSwiper = new Swiper('.gallery-thumbs', {
  loop: true,
  spaceBetween: 10,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
  breakpoints: {
    320: {
      slidesPerView: 3,
      spaceBetween: 5,
    },
    640: {
      slidesPerView: 4,
      spaceBetween: 10,
    },
  },
});

let galleryMainSwiper = new Swiper('.gallery-main', {
  loop: true,
  spaceBetween: 10,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  thumbs: {
    swiper: thumbsSwiper,
  },
  speed: 500,
});

// ================================
// 6. PAUSE ON HOVER
// ================================

document.querySelectorAll('.swiper').forEach(swiperEl => {
  swiperEl.addEventListener('mouseenter', function() {
    const swiperInstance = this.swiper;
    if (swiperInstance.autoplay) {
      swiperInstance.autoplay.stop();
    }
  });

  swiperEl.addEventListener('mouseleave', function() {
    const swiperInstance = this.swiper;
    if (swiperInstance.autoplay) {
      swiperInstance.autoplay.start();
    }
  });
});

// ================================
// 7. KEYBOARD NAVIGATION SLIDERS
// ================================

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    heroSwiper.slidePrev();
  } else if (e.key === 'ArrowRight') {
    heroSwiper.slideNext();
  }
});

console.log('✅ Sliders inicializados com sucesso');
