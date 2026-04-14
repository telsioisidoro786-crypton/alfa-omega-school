/* ================================
   FORMS.JS - FORM HANDLING
   ================================ */

// ================================
// 1. FORM SUBMISSION HANDLER
// ================================

document.addEventListener('DOMContentLoaded', () => {
  initFormHandlers();
});

function initFormHandlers() {
  const forms = document.querySelectorAll('form[data-form-type]');
  
  forms.forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formType = form.getAttribute('data-form-type');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  // Desabilitar botão e mostrar loading
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

  try {
    if (formType === 'emailjs') {
      await handleEmailJSForm(form);
    } else if (formType === 'formspree') {
      await handleFormspreeForm(form);
    } else {
      throw new Error('Tipo de formulário não suportado');
    }

    // Sucesso
    showToast('Mensagem enviada com sucesso! Obrigado pelo contacto.', 'success');
    form.reset();

  } catch (error) {
    console.error('Erro ao enviar formulário:', error);
    showToast('Erro ao enviar mensagem. Tente novamente.', 'error');

  } finally {
    // Reabilitar botão
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// ================================
// 2. EMAILJS INTEGRATION
// ================================

// Configurar EmailJS (colocar seu Public Key)
// emailjs.init("SUA_PUBLIC_KEY_AQUI");

async function handleEmailJSForm(form) {
  const formData = new FormData(form);
  
  const params = {
    from_name: formData.get('nome') || 'Visitante',
    from_email: formData.get('email'),
    to_email: 'telsioisidoro786@gmail.com', // Email do colégio
    subject: formData.get('assunto') || 'Novo Contacto do Site',
    message: formData.get('mensagem'),
    phone: formData.get('telefone') || 'Não fornecido',
  };

  // Verificar se EmailJS está disponível
  if (typeof emailjs === 'undefined') {
    console.warn('EmailJS não está carregado. Configure em components/meta.html');
    throw new Error('Serviço de email não disponível');
  }

  // Enviar email
  await emailjs.send('your_service_id', 'your_template_id', params);
}

// ================================
// 3. FORMSPREE INTEGRATION
// ================================

async function handleFormspreeForm(form) {
  const formData = new FormData(form);
  
  // Formspree usa o atributo action do form
  const actionUrl = form.getAttribute('action');
  
  if (!actionUrl) {
    throw new Error('URL do Formspree não configurada');
  }

  const response = await fetch(actionUrl, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Mostrar modal de sucesso se existir
  if (document.getElementById('successModal')) {
    setTimeout(() => {
      showSuccessModal();
    }, 500);
  }
  
  return data;
}

// ================================
// 4. FORM VALIDATION
// ================================

function validateForm(form) {
  const email = form.querySelector('input[type="email"]');
  const telefone = form.querySelector('input[name="telefone"]');
  const mensagem = form.querySelector('textarea[name="mensagem"]');

  let isValid = true;

  // Validar email
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      email.classList.add('border-red-500');
      isValid = false;
    } else {
      email.classList.remove('border-red-500');
    }
  }

  // Validar telefone (opcional, mas se preenchido)
  if (telefone && telefone.value) {
    const phoneRegex = /^\+?[0-9\s\-\(\)]{7,}$/;
    if (!phoneRegex.test(telefone.value)) {
      telefone.classList.add('border-red-500');
      isValid = false;
    } else {
      telefone.classList.remove('border-red-500');
    }
  }

  // Validar mensagem
  if (mensagem && mensagem.value.length < 10) {
    mensagem.classList.add('border-red-500');
    isValid = false;
  } else if (mensagem) {
    mensagem.classList.remove('border-red-500');
  }

  return isValid;
}

// ================================
// 5. INPUT VALIDATION REAL-TIME
// ================================

document.querySelectorAll('input[type="email"]').forEach(input => {
  input.addEventListener('blur', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
      this.classList.add('border-red-500');
      this.classList.add('bg-red-50');
    } else {
      this.classList.remove('border-red-500');
      this.classList.remove('bg-red-50');
    }
  });
});

document.querySelectorAll('textarea').forEach(textarea => {
  textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });
});

// ================================
// 6. FORM HELPERS
// ================================

// Máscara de telefone
function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 0) {
    if (value.length <= 2) {
      value = value;
    } else if (value.length <= 5) {
      value = value.slice(0, 2) + ' ' + value.slice(2);
    } else if (value.length <= 8) {
      value = value.slice(0, 2) + ' ' + value.slice(2, 5) + ' ' + value.slice(5);
    } else {
      value = value.slice(0, 2) + ' ' + value.slice(2, 5) + ' ' + value.slice(5, 8) + ' ' + value.slice(8, 12);
    }
  }
  
  input.value = value;
}

document.querySelectorAll('input[name="telefone"]').forEach(input => {
  input.addEventListener('input', function() {
    formatPhoneNumber(this);
  });
});

// ================================
// 7. SUCCESS FEEDBACK
// ================================

function createSuccessMessage(message) {
  const div = document.createElement('div');
  div.className = 'p-4 bg-green-50 border border-green-200 rounded-lg mb-4 animate-slide-up';
  div.innerHTML = `
    <div class="flex items-start">
      <i class="fas fa-check-circle text-green-600 mt-0.5 mr-3"></i>
      <p class="text-green-700 font-medium">${message}</p>
    </div>
  `;
  return div;
}

console.log('✅ Handlers de formulário carregados');
