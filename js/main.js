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
  toast.className = `fixed bottom-4 right-4 rounded-lg text-white font-medium z-50 animate-slide-up overflow-hidden shadow-lg`;
  
  // Define cor de fundo baseada no tipo
  let bgColor = 'bg-green-500';
  if (type === 'error') {
    bgColor = 'bg-red-500';
  } else if (type === 'warning') {
    bgColor = 'bg-yellow-500';
  } else if (type === 'info') {
    bgColor = 'bg-blue-500';
  }
  
  toast.classList.add(bgColor);
  
  // Conteúdo HTML com botão de fechar e progress bar
  toast.innerHTML = `
    <div class="flex items-center justify-between px-6 py-3">
      <span>${message}</span>
      <button class="ml-4 text-white hover:opacity-75 transition-opacity focus:outline-none" aria-label="Fechar notificação">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    <div class="h-1 bg-black bg-opacity-20 overflow-hidden">
      <div class="h-full bg-white opacity-40 toast-progress-bar" style="width: 100%;"></div>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Função para remover toast
  const removeToast = () => {
    toast.classList.add('animate-slide-down');
    setTimeout(() => toast.remove(), 300);
  };
  
  // Botão de fechar
  const closeBtn = toast.querySelector('button');
  closeBtn.addEventListener('click', removeToast);
  
  // Progress bar que anima durante a duração
  const progressBar = toast.querySelector('.toast-progress-bar');
  progressBar.style.transition = `width ${duration}ms linear`;
  
  // Iniciar a animação da progress bar
  setTimeout(() => {
    progressBar.style.width = '0%';
  }, 10);
  
  // Remover toast automaticamente após a duração
  setTimeout(() => {
    if (document.body.contains(toast)) {
      removeToast();
    }
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
