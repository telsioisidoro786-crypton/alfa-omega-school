/* ================================
   MAIN.JS - SCRIPT PRINCIPAL
   ================================ */

// ================================
// 1. INICIALIZAÇÃO
// ================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('✨ Nexora Schools - Sistema de Site Escolar');
  
  initAOS();
  initScrollAnimations();
  handleNavbarScroll();
  setupMobileMenu();
});

// ================================
// 2. AOS (Animate on Scroll)
// ================================

function initAOS() {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out-cubic',
    once: true,
    offset: 100,
    disable: 'mobile'
  });
}

// ================================
// 3. SCROLL REVEAL ANIMATIONS
// ================================

function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  function reveal() {
    reveals.forEach(element => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', reveal);
  reveal(); // Executar ao carregar
}

// ================================
// 4. NAVBAR SCROLL EFFECT
// ================================

function handleNavbarScroll() {
  const navbar = document.getElementById('navbar');
  
  // Verificar se navbar existe antes de adicionar listener
  if (!navbar) {
    console.warn('⚠️ Navbar não encontrado - se está a ser carregado dinamicamente, não há problema');
    return;
  }
  
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Adicionar sombra ao scroll
    if (scrollTop > 10) {
      navbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    } else {
      navbar.style.boxShadow = '0 1px 3px rgba(0,0,0,0.07)';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
}

// ================================
// 5. MOBILE MENU
// ================================

function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!mobileMenuBtn || !mobileMenu) return;

  mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle('hidden');
    updateMenuIcon();
  });

  // Fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      mobileMenu.classList.add('hidden');
      updateMenuIcon();
    }
  });

  // Fechar ao clicar num link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      updateMenuIcon();
    });
  });
}

function updateMenuIcon() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const icon = mobileMenuBtn.querySelector('i');
  
  if (document.getElementById('mobile-menu').classList.contains('hidden')) {
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  } else {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-times');
  }
}

// ================================
// 6. SMOOTH SCROLL
// ================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ================================
// 7. FUNÇÕES UTILITÁRIAS
// ================================

// Throttle - Para melhor performance em eventos frequentes
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Debounce - Para delay em eventos
function debounce(func, delay) {
  let timeoutId;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  }
}

// ================================
// 8. CONTADOR ANIMADO
// ================================

function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    updateCounter();
  });
}

// Iniciar contadores quando entram em view
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      animateCounters();
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(counter => {
  counterObserver.observe(counter);
});

// ================================
// 9. KEYBOARD NAVIGATION
// ================================

document.addEventListener('keydown', (e) => {
  // ESC - Fechar menu mobile
  if (e.key === 'Escape') {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      updateMenuIcon();
    }
  }
});

// ================================
// 10. TOAST NOTIFICATIONS
// ================================

function showToast(message, type = 'success', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 animate-slide-up`;
  
  if (type === 'success') {
    toast.classList.add('bg-green-500');
  } else if (type === 'error') {
    toast.classList.add('bg-red-500');
  } else if (type === 'info') {
    toast.classList.add('bg-blue-500');
  }

  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('animate-slide-down');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ================================
// 11. OBSERVER PARA LAZY LOAD
// ================================

function initLazyLoad() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
}

initLazyLoad();

console.log('✅ Scripts carregados com sucesso');
