/**
 * Colégio Alfa e Omega - Módulo de Matrículas
 * Sistema de pré-matrícula online com geração de ID único
 * Arquivo: matriculas.js
 */

// ===== CONFIGURAÇÃO =====
const CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB total
  ALLOWED_EXTENSIONS: ['pdf', 'jpg', 'jpeg', 'png'],
  FORMSPREE_ID: 'xeekazak', // ID do Formspree para matrículas
  WHATSAPP_NUMBER: '957834748', // Número do WhatsApp
  GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/AKfycbxyteKvg1T3ZBI370ukb0vKQc6erw7C0CsewBrc40BofTs2o2mc6LHV3yWVJnLVtgzK/exec',
  SAVE_LOCAL_URL: 'http://localhost:8000/save-documento.php' // API local para salvar documentos
};

// ===== ARMAZENAMENTO LOCAL =====
const MatriculasStorage = {
  /**
   * Gera um ID único no formato AO-2026-XXXXXX
   */
  generateReferenceId() {
    // Usar timestamp + random para garantir unicidade mesmo com múltiplos registos simultâneos
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000000);
    // Combinar para criar um número único
    const uniqueNumber = ((timestamp % 1000000) + randomPart) % 1000000;
    const suffix = String(uniqueNumber).padStart(6, '0');
    
    // Verificar se o ID já existe (muito improvável, mas por segurança)
    let id = `AO-2026-${suffix}`;
    const enrollments = this.getAllEnrollments();
    let counter = 0;
    while (enrollments.some(e => e.referenceId === id) && counter < 10) {
      counter++;
      id = `AO-2026-${String((uniqueNumber + counter) % 1000000).padStart(6, '0')}`;
    }
    
    return id;
  },

  /**
   * Salva dados da matrícula no localStorage
   */
  saveEnrollment(formData, referenceId) {
    const enrollment = {
      referenceId,
      studentName: formData.nomeAluno,
      guardianName: formData.nomeEncarregado,
      guardianPhone: formData.telefone,
      guardianEmail: formData.email,
      class: formData.classePretendida,
      shift: formData.turno,
      submittedAt: new Date().toLocaleString('pt-PT'),
      status: 'Aguardando confirmação presencial',
    };

    const enrollments = this.getAllEnrollments();
    enrollments.push(enrollment);
    localStorage.setItem('enrollments', JSON.stringify(enrollments));

    // Debug: verificar se foi salvo
    console.log(`✓ Matrícula salva com ID: ${referenceId}`);
    console.log(`Total de matrículas no localStorage: ${enrollments.length}`);
    console.log(`Dados salvos:`, enrollment);

    return enrollment;
  },

  /**
   * Recupera todas as matrículas do localStorage
   */
  getAllEnrollments() {
    const data = localStorage.getItem('enrollments');
    return data ? JSON.parse(data) : [];
  },

  /**
   * Busca uma matrícula por ID
   */
  findEnrollment(referenceId) {
    const enrollments = this.getAllEnrollments();
    const searchId = referenceId.trim().toUpperCase();
    return enrollments.find(e => e.referenceId.toUpperCase() === searchId);
  },

  /**
   * Limpa todos os dados de matrículas (apenas para teste)
   */
  clearAll() {
    localStorage.removeItem('enrollments');
  },
};

// ===== GERENCIAMENTO DE FICHEIROS =====
const FileManager = {
  files: [],

  /**
   * Valida e adiciona um ficheiro
   */
  addFile(file) {
    // Validar extensão
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!CONFIG.ALLOWED_EXTENSIONS.includes(fileExtension)) {
      this.showError(`Tipo de ficheiro não permitido: ${fileExtension}`);
      return false;
    }

    // Validar tamanho individual (max 2MB por ficheiro)
    if (file.size > 2 * 1024 * 1024) {
      this.showError(`Ficheiro "${file.name}" é muito grande (máx: 2MB)`);
      return false;
    }

    // Validar tamanho total
    const totalSize = this.files.reduce((sum, f) => sum + f.size, 0) + file.size;
    if (totalSize > CONFIG.MAX_FILE_SIZE) {
      this.showError(`Tamanho total dos ficheiros excede 5MB`);
      return false;
    }

    // Evitar duplicatas
    if (this.files.some(f => f.name === file.name)) {
      this.showError(`Ficheiro "${file.name}" já foi adicionado`);
      return false;
    }

    this.files.push(file);
    return true;
  },

  /**
   * Remove um ficheiro da lista
   */
  removeFile(fileName) {
    this.files = this.files.filter(f => f.name !== fileName);
  },

  /**
   * Atualiza a visualização dos ficheiros
   */
  updatePreview() {
    const preview = document.getElementById('filePreview');
    const sizeInfo = document.getElementById('fileSizeInfo');

    preview.innerHTML = '';

    if (this.files.length === 0) {
      sizeInfo.style.display = 'none';
      return;
    }

    const totalSize = this.files.reduce((sum, f) => sum + f.size, 0);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

    this.files.forEach(file => {
      const fileSize = (file.size / 1024).toFixed(2);
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const iconMap = {
        pdf: 'fa-file-pdf',
        jpg: 'fa-file-image',
        jpeg: 'fa-file-image',
        png: 'fa-file-image',
      };

      const item = document.createElement('div');
      item.className = 'file-item';
      item.innerHTML = `
        <i class="fas ${iconMap[fileExtension] || 'fa-file'}"></i>
        <div class="file-item-name">${file.name}</div>
        <div class="file-size">${fileSize} KB</div>
        <button type="button" class="remove-file" onclick="FileManager.removeFile('${file.name}'); FileManager.updatePreview();">
          Remover
        </button>
      `;
      preview.appendChild(item);
    });

    sizeInfo.style.display = 'block';
    document.getElementById('totalFileSize').textContent = totalSizeMB;
  },

  /**
   * Exibe mensagem de erro
   */
  showError(message) {
    const alerts = document.getElementById('formAlerts');
    const alert = document.createElement('div');
    alert.className = 'alert alert-error';
    alert.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    alerts.appendChild(alert);

    setTimeout(() => alert.remove(), 5000);
  },

  /**
   * Retorna se existem ficheiros adicionados
   */
  hasFiles() {
    return this.files.length > 0;
  },

  /**
   * Limpa todos os ficheiros
   */
  clear() {
    this.files = [];
  },
};


// ===== VALIDAÇÃO DE FORMULÁRIO =====
const FormValidator = {
  /**
   * Valida o formulário completo
   */
  validate(formData) {
    const errors = [];

    // Validar campos obrigatórios
    const requiredFields = [
      'nomeAluno',
      'dataNascimento',
      'sexo',
      'classePretendida',
      'turno',
      'nomeEncarregado',
      'grauParentesco',
      'telefone',
      'email',
      'morada',
    ];

    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        errors.push(`${field} é obrigatório`);
      }
    });

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Email inválido');
    }

    // Validar telefone (aceita +244, 244 ou 9XX)
    const phoneRegex = /^(\+?244|0)?9\d{8}$/;
    if (formData.telefone && !phoneRegex.test(formData.telefone.replace(/\s/g, ''))) {
      errors.push('Telefone inválido');
    }

    // Validar data de nascimento
    const birthDate = new Date(formData.dataNascimento);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 4 || age > 25) {
      errors.push('Idade do aluno deve estar entre 4 e 25 anos');
    }

    // Validar documentos
    if (!FileManager.hasFiles()) {
      errors.push('Pelo menos um documento é obrigatório');
    }

    // Validar confirmação
    if (!formData.confirmacao) {
      errors.push('Você deve aceitar os termos de confirmação');
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  },
};

// ===== MANIPULAÇÃO DO FORMULÁRIO =====
const MatriculasForm = {
  /**
   * Inicializa os event listeners do formulário
   */
  init() {
    this.setupFileUpload();
    this.setupFormSubmit();
  },

  /**
   * Configura o upload de ficheiros
   */
  setupFileUpload() {
    const uploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');

    // Click no upload area
    uploadArea.addEventListener('click', () => fileInput.click());

    // Selecção de ficheiros
    fileInput.addEventListener('change', (e) => {
      this.handleFileSelection(e.target.files);
      fileInput.value = ''; // Limpar input para permitir seleccionar o mesmo ficheiro novamente
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      this.handleFileSelection(e.dataTransfer.files);
    });
  },

  /**
   * Processa os ficheiros seleccionados
   */
  handleFileSelection(files) {
    Array.from(files).forEach(file => {
      FileManager.addFile(file);
    });
    FileManager.updatePreview();
  },

  /**
   * Configura o envio do formulário
   */
  setupFormSubmit() {
    // O formulário agora usa handleMatriculaSubmit() via onsubmit no HTML
    // Não precisa de addEventListener aqui
    console.log('✓ Formulário configurado com handleMatriculaSubmit()');
  },

  /**
   * Recolhe os dados do formulário
   */
  getFormData() {
    return {
      nomeAluno: document.getElementById('nomeAluno').value.trim(),
      dataNascimento: document.getElementById('dataNascimento').value,
      sexo: document.getElementById('sexo').value,
      classePretendida: document.getElementById('classePretendida').value,
      turno: document.getElementById('turno').value,
      nomeEncarregado: document.getElementById('nomeEncarregado').value.trim(),
      grauParentesco: document.getElementById('grauParentesco').value,
      telefone: document.getElementById('telefone').value.trim(),
      email: document.getElementById('email').value.trim().toLowerCase(),
      morada: document.getElementById('morada').value.trim(),
      confirmacao: document.getElementById('confirmacao').checked,
      numDocumentos: FileManager.files.length,
      nomesFicheiros: FileManager.files.map(f => f.name).join(', '),
    };
  },

  /**
   * Mostra erros de validação
   */
  showValidationErrors(errors) {
    const alerts = document.getElementById('formAlerts');
    errors.forEach(error => {
      const alert = document.createElement('div');
      alert.className = 'alert alert-error';
      alert.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error}`;
      alerts.appendChild(alert);
    });

    // Scroll para alertas
    alerts.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },

  /**
   * Mostra mensagem de erro genérica
   */
  showError(message) {
    const alerts = document.getElementById('formAlerts');
    const alert = document.createElement('div');
    alert.className = 'alert alert-error';
    alert.style.cssText = 'margin-bottom: 1rem; padding: 1rem; background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; border-radius: 0.375rem; color: #dc2626;';
    alert.innerHTML = `<div style="display: flex; align-items: center; gap: 0.75rem;">
      <i class="fas fa-exclamation-triangle" style="font-size: 1.25rem; flex-shrink: 0;"></i>
      <div>
        <strong style="display: block;">Erro ao submeter</strong>
        <p style="margin: 0.5rem 0 0; font-size: 0.95rem;">${message}</p>
        <p style="margin: 0.5rem 0 0; font-size: 0.85rem; color: #991b1b;">
          💡 <strong>Dica:</strong> Abra a Consola (F12) para mais detalhes do erro
        </p>
      </div>
    </div>`;
    alerts.appendChild(alert);
    alerts.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },

  /**
   * Mostra tela de sucesso
   */
  showSuccessScreen(referenceId) {
    document.getElementById('matriculaForm').style.display = 'none';
    document.getElementById('referenceIdDisplay').textContent = referenceId;

    const successScreen = document.getElementById('successScreen');
    successScreen.classList.add('active');
    successScreen.scrollIntoView({ behavior: 'smooth' });
  },
};

// ===== FUNÇÕES GLOBAIS =====

/**
 * Copia o ID de referência para a área de transferência
 */
function copyReferenceId() {
  const referenceId = document.getElementById('referenceIdDisplay').textContent;
  navigator.clipboard.writeText(referenceId).then(() => {
    const feedback = document.getElementById('copyFeedback');
    feedback.classList.add('show');
    setTimeout(() => feedback.classList.remove('show'), 2000);
  });
}

/**
 * Abre o WhatsApp
 */
function openWhatsApp() {
  const message = encodeURIComponent('Olá! Gostaria de mais informações sobre a matrícula no Colégio Alfa e Omega.');
  window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${message}`, '_blank');
}

/**
 * Reseta o formulário
 */
function resetForm() {
  document.getElementById('matriculaForm').style.display = 'block';
  document.getElementById('successScreen').classList.remove('active');
  document.getElementById('formAlerts').innerHTML = '';
  FileManager.clear();
  FileManager.updatePreview();
  document.getElementById('matriculaForm').reset();
  document.getElementById('matriculaForm').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Consulta matrícula por ID
 */
function consultarMatricula() {
  const referenceId = document.getElementById('consultaId').value.trim().toUpperCase();

  if (!referenceId) {
    alert('Por favor, digite o ID de referência');
    return;
  }

  // Debug: log da busca
  console.log(`🔍 Buscando ID: ${referenceId}`);
  const allEnrollments = MatriculasStorage.getAllEnrollments();
  console.log(`Total de matrículas no localStorage: ${allEnrollments.length}`);
  console.log('IDs salvos:', allEnrollments.map(e => e.referenceId));

  const enrollment = MatriculasStorage.findEnrollment(referenceId);
  const result = document.getElementById('consultaResult');
  const content = document.getElementById('consultaContent');

  if (enrollment) {
    console.log(`✅ Matrícula encontrada:`, enrollment);
    content.innerHTML = `
      <div style="background: var(--gray-50); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid var(--success);">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
          <i class="fas fa-check-circle" style="color: var(--success); font-size: 1.5rem;"></i>
          <h3 style="margin: 0; color: var(--primary);">Pré-Matrícula Encontrada</h3>
        </div>
        
        <div style="color: var(--gray-700); line-height: 1.8;">
          <p><strong>ID de Referência:</strong> ${enrollment.referenceId}</p>
          <p><strong>Aluno:</strong> ${enrollment.studentName}</p>
          <p><strong>Encarregado:</strong> ${enrollment.guardianName}</p>
          <p><strong>Classe:</strong> ${enrollment.class}</p>
          <p><strong>Turno:</strong> ${enrollment.shift}</p>
          <p><strong>Status:</strong> <span style="color: var(--accent); font-weight: 700;">${enrollment.status}</span></p>
          <p><strong>Data de Inscrição:</strong> ${enrollment.submittedAt}</p>
        </div>
        
        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--gray-300);">
          <p style="color: var(--gray-600); font-size: 0.95rem; margin: 0;">
            <strong>Próximo passo:</strong> Compareça à escola com este ID e os documentos originais para confirmação presencial.
          </p>
        </div>
      </div>
    `;
  } else {
    console.log(`❌ Nenhuma matrícula encontrada para o ID: ${referenceId}`);
    content.innerHTML = `
      <div style="background: rgba(239, 68, 68, 0.1); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid var(--error); color: var(--error);">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
          <i class="fas fa-times-circle" style="font-size: 1.5rem;"></i>
          <h3 style="margin: 0;">ID não encontrado</h3>
        </div>
        <p style="margin: 0;">O ID "<strong>${referenceId}</strong>" não foi encontrado no sistema.</p>
        <p style="margin: 0.5rem 0 0; font-size: 0.95rem;">Por favor, verifique o ID e tente novamente. Se o problema persistir, contacte-nos.</p>
      </div>
    `;
  }

  result.classList.add('show');
}

// ===== NOVA FUNÇÃO DE SUBMIT =====
/**
 * Função principal que controla o fluxo de submissão da matrícula
 * 1. Valida ficheiro
 * 2. Envia para Google Drive
 * 3. Recebe link
 * 4. Envia para Formspree (com link incluído)
 * 5. Abre WhatsApp com dados e link
 */
async function handleMatriculaSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const fileInput = document.getElementById('fileInput');
  
  // Limpar alertas anteriores
  document.getElementById('formAlerts').innerHTML = '';
  
  // Validar ficheiro
  if (FileManager.files.length === 0) {
    MatriculasForm.showError('Por favor, anexe pelo menos um documento (PDF ou Imagem).');
    return;
  }

  // Feedback visual
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A carregar documento...';

  try {
    const file = FileManager.files[0]; // Usar primeiro ficheiro
    
    // 1. CONVERTER FICHEIRO PARA BASE64
    console.log(`📄 Convertendo ficheiro "${file.name}" para Base64...`);

    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        console.log(`✅ Ficheiro convertido (${base64.length} caracteres)`);
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Erro ao ler ficheiro'));
      reader.readAsDataURL(file);
    });

    // 2. PREPARAR DADOS PARA O FORMSPREE (COM BASE64 INCLUÍDO)
    const formDataObj = MatriculasForm.getFormData();
    
    const referenceId = MatriculasStorage.generateReferenceId();
    
    // Construir mensagem de email formatada
    const emailContent = `
NOVA PRÉ-MATRÍCULA SUBMETIDA
=====================================

ID de Referência: ${referenceId}
Data: ${new Date().toLocaleString('pt-PT')}

DADOS DO ALUNO
------
Nome: ${formDataObj.nomeAluno}
Data de Nascimento: ${formDataObj.dataNascimento}
Sexo: ${formDataObj.sexo}
Classe Pretendida: ${formDataObj.classePretendida}
Turno: ${formDataObj.turno}

DADOS DO ENCARREGADO
------
Nome: ${formDataObj.nomeEncarregado}
Grau de Parentesco: ${formDataObj.grauParentesco}
Telefone: ${formDataObj.telefone}
Email: ${formDataObj.email}
Morada: ${formDataObj.morada}

DOCUMENTO ANEXADO
------
Ficheiro: ${file.name}
Tipo: ${file.type}
Tamanho: ${(file.size / 1024).toFixed(2)} KB

=====================================
⚠️  O ARQUIVO EM BASE64 ESTÁ ARMAZENADO NO CAMPO 'arquivo_base64'
Para recuperar o ficheiro, descodifique o conteúdo de arquivo_base64.
    `.trim();

    const formspreeData = {
      message: emailContent,
      // Campos estruturados para facilitar processamento
      _subject: `Nova Pré-Matrícula: ${formDataObj.nomeAluno} (ID: ${referenceId})`,
      _replyto: formDataObj.email,
      _cc: formDataObj.email,  // Enviar cópia para o aluno
      _captcha: 'false',
      _priority: 'high',
      // Dados estruturados
      aluno: formDataObj.nomeAluno,
      id_referencia: referenceId,
      classe: formDataObj.classePretendida,
      turno: formDataObj.turno,
      arquivo_nome: file.name,
      arquivo_tipo: file.type,
      arquivo_tamanho: `${(file.size / 1024).toFixed(2)} KB`,
      arquivo_base64: base64Data
    };

    // Payload para Google Sheets
    const googleSheetsPayload = {
      timestamp: new Date().toLocaleString('pt-PT'),
      id_referencia: referenceId,
      nomeAluno: formDataObj.nomeAluno,
      dataNascimento: formDataObj.dataNascimento,
      sexo: formDataObj.sexo,
      classePretendida: formDataObj.classePretendida,
      turno: formDataObj.turno,
      nomeEncarregado: formDataObj.nomeEncarregado,
      grauParentesco: formDataObj.grauParentesco,
      telefone: formDataObj.telefone,
      email: formDataObj.email,
      morada: formDataObj.morada,
      documento: file.name
    };

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A finalizar...';

    // 3. ENVIAR PARA GOOGLE SHEETS (Painel do Administrador)
    console.log('📊 Enviando para Google Sheets...');
    try {
      await fetch(CONFIG.GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(googleSheetsPayload)
      });
      console.log('✅ Dados enviados para Google Sheets');
    } catch (error) {
      console.warn('⚠️  Aviso ao enviar para Google Sheets:', error.message);
    }

    // 4. SALVAR DOCUMENTO LOCALMENTE NO SERVIDOR
    console.log('💾 Guardando documento localmente...');
    try {
      const payloadData = {
        arquivo_base64: base64Data,
        arquivo_nome: file.name,
        id_referencia: referenceId,
        // Dados do aluno
        nomeAluno: formDataObj.nomeAluno,
        dataNascimento: formDataObj.dataNascimento,
        sexo: formDataObj.sexo,
        classePretendida: formDataObj.classePretendida,
        turno: formDataObj.turno,
        nomeEncarregado: formDataObj.nomeEncarregado,
        grauParentesco: formDataObj.grauParentesco,
        telefone: formDataObj.telefone,
        email: formDataObj.email,
        morada: formDataObj.morada
      };

      console.log('📤 Payload:', {
        ...payloadData,
        arquivo_base64: '...' + payloadData.arquivo_base64.substring(payloadData.arquivo_base64.length - 20)
      });

      const saveResponse = await fetch(CONFIG.SAVE_LOCAL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadData)
      });

      const saveResultText = await saveResponse.text();
      console.log('📨 Resposta do servidor:', saveResultText);

      if (!saveResponse.ok) {
        console.error('❌ Status:', saveResponse.status, saveResponse.statusText);
        console.warn('⚠️  Documento não foi guardado localmente (continuando mesmo assim)');
      } else {
        try {
          const saveResult = JSON.parse(saveResultText);
          console.log('✅ Documento guardado com sucesso!');
          console.log('   Pasta:', saveResult.pasta_uploads);
          console.log('   Arquivo:', saveResult.caminho_arquivo);
          console.log('   Dados:', saveResult.caminho_txt);
        } catch (e) {
          console.warn('⚠️  Resposta não é JSON válido');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao guardar documento:', error);
      console.warn('⚠️  Continuando mesmo assim...');
    }

    // 5. ENVIAR PARA O FORMSPREE (Email de Confirmação)
    console.log('📧 Enviando dados para o Formspree...');
    const response = await fetch(`https://formspree.io/f/${CONFIG.FORMSPREE_ID}`, {
      method: 'POST',
      body: JSON.stringify(formspreeData),
      headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro na submissão: ${response.status}`);
    }

    console.log('✅ Email enviado com sucesso ao Formspree');

    // 6. SALVAR LOCALMENTE
    console.log('💾 Salvando no localStorage...');
    MatriculasStorage.saveEnrollment(formDataObj, referenceId);
    console.log('✅ Dados salvos localmente');

    // 7. MONTAR MENSAGEM E ABRIR WHATSAPP
    const mensagemZap = `*NOVA PRÉ-MATRÍCULA*\n\n` +
                        `*ID:* ${referenceId}\n` +
                        `*Aluno:* ${formDataObj.nomeAluno}\n` +
                        `*Classe:* ${formDataObj.classePretendida}\n` +
                        `*Arquivo:* ${file.name} (${(file.size / 1024).toFixed(2)} KB)\n\n` +
                        `_O documento foi anexado ao email de confirmação e registado na planilha._`;

    const waUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagemZap)}`;
    
    console.log('✅ Abrindo WhatsApp...');
    window.open(waUrl, '_blank');
    
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Enviado com Sucesso!';
    MatriculasForm.showSuccessScreen(referenceId);
    
    form.reset();
    FileManager.clear();
    FileManager.updatePreview();
    
    console.log('✅ Pré-matrícula enviada com sucesso!');
    
    setTimeout(() => { 
      location.reload(); 
    }, 2000);

  } catch (error) {
    console.error('❌ Erro:', error);
    console.error('Stack:', error.stack);
    MatriculasForm.showError(`Erro ao enviar. ${error.message}`);
  } finally {
    submitBtn.disabled = false;
    if (!submitBtn.innerHTML.includes('fa-check')) {
      submitBtn.innerHTML = originalText;
    }
  }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  MatriculasForm.init();

  // Log para debug (remover em produção)
  console.log('✓ Módulo de Matrículas inicializado');
});
