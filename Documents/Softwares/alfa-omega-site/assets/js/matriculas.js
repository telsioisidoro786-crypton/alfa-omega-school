/**
 * SISTEMA DE MATRÍCULAS - VERSÃO 2.0 COM jsPDF
 * Integração: jsPDF (PDF local) + Formspree (email) + WhatsApp (confirmação)
 * ✅ Removido: save-documento.php (sem salvamento no servidor)
 * ✅ Adicionado: jsPDF para gerar comprovantes automaticamente
 * ✅ Documentos: Apenas validação (não enviados para Formspree)
 */

// ===== CONFIG =====
const CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ALLOWED_EXTENSIONS: ['pdf', 'jpg', 'jpeg', 'png'],
  FORMSPREE_ID: 'xeekazak',
  WHATSAPP_NUMBER: '925952771',
  GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/AKfycbxyteKvg1T3ZBI370ukb0vKQc6erw7C0CsewBrc40BofTs2o2mc6LHV3yWVJnLVtgzK/exec',
  // Cloudinary (opcional - para upload futuro de documentos)
  CLOUDINARY_NAME: 'dw958rv3b',
  CLOUDINARY_UPLOAD_PRESET: 'matriculas_docs'
};

// ===== FILE MANAGER =====
const FileManager = {
  files: [],
  
  addFile(file) {
    if (file.size > CONFIG.MAX_FILE_SIZE) {
      alert(`Ficheiro > ${CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`);
      return;
    }
    const ext = file.name.split('.').pop().toLowerCase();
    if (!CONFIG.ALLOWED_EXTENSIONS.includes(ext)) {
      alert(`Tipo não permitido. Use: ${CONFIG.ALLOWED_EXTENSIONS.join(', ')}`);
      return;
    }
    this.files.push(file);
    this.updatePreview();
    console.log(`✅ Ficheiro adicionado: ${file.name}`);
  },
  
  updatePreview() {
    const preview = document.getElementById('filePreview');
    if (!preview) return;

    if (this.files.length > 0) {
      // Responsive grid: cards side-by-side on wide screens, stacked on small screens
      let previewHTML = `<div style="margin-top:14px; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 12px;">`;

      this.files.forEach((f, idx) => {
        const ext = f.name.split('.').pop().toLowerCase();
        const sizeKB = (f.size / 1024).toFixed(2);
        const sizeMB = (f.size / 1024 / 1024).toFixed(2);

        let icon = '📎';
        if (ext === 'pdf') icon = '📄';
        else if (['jpg', 'jpeg', 'png'].includes(ext)) icon = '🖼️';

        // thumbnail for images
        let thumbHTML = '';
        if (['jpg', 'jpeg', 'png'].includes(ext)) {
          thumbHTML = `<div style="width:64px;height:64px;border-radius:6px;overflow:hidden;flex-shrink:0;">
                        <img src="${URL.createObjectURL(f)}" style="width:100%;height:100%;object-fit:cover;display:block;" />
                       </div>`;
        } else {
          thumbHTML = `<div style="width:64px;height:64px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:rgba(1,55,125,0.04);flex-shrink:0;font-size:1.6em;">${icon}</div>`;
        }

        previewHTML += `
          <div style="display:flex;align-items:center;gap:12px;background:linear-gradient(135deg, rgba(206,244,49,0.08), rgba(206,244,49,0.02));padding:12px;border-radius:8px;border:1px solid rgba(206,244,49,0.25);box-shadow:0 6px 18px rgba(1,55,125,0.06);">
            ${thumbHTML}
            <div style="flex:1;min-width:0;">
              <p style="margin:0;font-size:0.98em;font-weight:700;color:#01377D;line-height:1.2;word-break:break-word;">${f.name}</p>
              <p style="margin:6px 0 0 0;font-size:0.85em;color:#666;">${sizeKB} KB ${f.size > 1024 * 1024 ? '(' + sizeMB + ' MB)' : ''}</p>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end;">
              <button type="button" onclick="FileManager.removeFile(${idx})" style="background:#CEF431;border:none;color:#01377D;padding:8px 12px;border-radius:6px;cursor:pointer;font-weight:700;font-size:0.9em;">✕ Remover</button>
            </div>
          </div>`;
      });

      previewHTML += `</div>`;
      preview.innerHTML = previewHTML;
    } else {
      preview.innerHTML = '';
    }
  },
  
  removeFile(index) {
    this.files.splice(index, 1);
    this.updatePreview();
    console.log(`🗑️ Ficheiro ${index + 1} removido`);
  },
  
  clear() {
    this.files = [];
    this.updatePreview();
    console.log('🗑️ Todos os ficheiros removidos');
  }
};

// ===== FORM VALIDATOR =====
const FormValidator = {
  getFormData() {
    const data = {
      nomeAluno: document.getElementById('nomeAluno')?.value || '',
      dataNascimento: document.getElementById('dataNascimento')?.value || '',
      sexo: document.getElementById('sexo')?.value || '',
      classePretendida: document.getElementById('classePretendida')?.value || '',
      turno: document.getElementById('turno')?.value || '',
      nomeEncarregado: document.getElementById('nomeEncarregado')?.value || '',
      grauParentesco: document.getElementById('grauParentesco')?.value || '',
      telefone: document.getElementById('telefone')?.value || '',
      email: document.getElementById('email')?.value || '',
      morada: document.getElementById('morada')?.value || ''
    };
    return data;
  },
  
  validate() {
    const data = this.getFormData();
    
    // Verificar cada campo
    for (const [key, value] of Object.entries(data)) {
      if (!value || value.trim() === '') {
        console.warn(`❌ Campo vazio: ${key}`);
        return { 
          valid: false, 
          msg: `❌ Campo obrigatório: ${key}` 
        };
      }
    }
    
    // Verificar email
    if (!data.email.includes('@')) {
      console.warn('❌ Email inválido:', data.email);
      return { 
        valid: false, 
        msg: '❌ Email inválido' 
      };
    }
    
    // Verificar ficheiro
    if (FileManager.files.length === 0) {
      console.warn('❌ Nenhum ficheiro selecionado');
      return { 
        valid: false, 
        msg: '❌ Selecione um ficheiro (PDF, JPG ou PNG)' 
      };
    }
    
    console.log('✅ Validação OK');
    return { valid: true };
  }
};

// ===== STORAGE =====
const StorageManager = {
  generateId() {
    const ts = Date.now().toString().slice(-6);
    const rand = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `AO-2026-${(ts + rand).slice(0, 6)}`;
  },
  
  save(data, id) {
    const list = JSON.parse(localStorage.getItem('matriculas') || '[]');
    list.push({ id, ...data, ts: new Date().toISOString() });
    localStorage.setItem('matriculas', JSON.stringify(list));
  }
};

// ===== PDF GENERATOR (jsPDF) =====
const PDFGenerator = {
  async generateProof(data, id) {
    console.log('\n📄 Gerando PDF com jsPDF...');
    
    // Verificar se jsPDF está carregado
    if (typeof jsPDF === 'undefined') {
      throw new Error('jsPDF não carregado. Verifique o CDN.');
    }
    
    const { jsPDF: PDF } = window;
    const doc = new PDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (2 * margin);
    let yPosition = margin;
    
    // Cores
    const primaryColor = [1, 55, 125]; // #01377D
    const accentColor = [206, 244, 49]; // #CEF431
    const textColor = [51, 65, 85]; // #334155
    
    // Função auxiliar para adicionar linha
    const addLine = () => {
      doc.setDrawColor(...primaryColor);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 3;
    };
    
    // CABEÇALHO
    doc.setFillColor(1, 55, 125);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('COMPROVANTE DE INSCRIÇÃO', pageWidth / 2, 18, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Colégio Alfa e Omega - Panguila, Angola', pageWidth / 2, 28, { align: 'center' });
    
    yPosition = 48;
    
    // ID E DATA
    doc.setTextColor(...primaryColor);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(`ID DE REFERÊNCIA: ${id}`, margin, yPosition);
    yPosition += 8;
    
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Data/Hora: ${new Date().toLocaleString('pt-PT')}`, margin, yPosition);
    yPosition += 12;
    
    addLine();
    
    // DADOS DO ALUNO
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('DADOS DO ALUNO', margin, yPosition);
    yPosition += 8;
    
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    const alunoData = [
      ['Nome Completo:', data.nomeAluno],
      ['Data de Nascimento:', data.dataNascimento],
      ['Sexo:', data.sexo],
      ['Classe Pretendida:', data.classePretendida],
      ['Turno:', data.turno]
    ];
    
    alunoData.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, margin, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(value, margin + 50, yPosition);
      yPosition += 6;
    });
    
    yPosition += 4;
    addLine();
    
    // ENCARREGADO DE EDUCAÇÃO
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('ENCARREGADO DE EDUCAÇÃO', margin, yPosition);
    yPosition += 8;
    
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    
    const encarregadoData = [
      ['Nome Completo:', data.nomeEncarregado],
      ['Grau de Parentesco:', data.grauParentesco],
      ['Telefone:', data.telefone],
      ['Email:', data.email],
      ['Morada:', data.morada]
    ];
    
    encarregadoData.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, margin, yPosition);
      doc.setFont(undefined, 'normal');
      const textWidth = pageWidth - margin - 50;
      const wrappedText = doc.splitTextToSize(value, textWidth);
      doc.text(wrappedText, margin + 50, yPosition);
      yPosition += (wrappedText.length * 5) + 1;
    });
    
    yPosition += 4;
    addLine();
    
    // RODAPÉ
    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('⚠️ IMPORTANTE', margin, yPosition);
    yPosition += 6;
    
    doc.setTextColor(...textColor);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    
    const footerText = [
      '1. Guarde este comprovante com o seu ID de referência.',
      '2. A inscrição ainda não foi finalizada.',
      '3. Compareça presencialmente na escola com este comprovante e documentos originais.',
      '4. Para consultas, contacte: WhatsApp +244 925 952 771'
    ];
    
    footerText.forEach(line => {
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });
    
    // Salvar PDF
    const filename = `Comprovante_${id}_${data.nomeAluno.replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
    console.log(`   ✅ PDF gerado e baixado: ${filename}`);
    
    return filename;
  }
};

// ===== BASE64 CONVERTER =====
function fileToBase64(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result.split(',')[1] || '');
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

// ===== MAIN SUBMIT =====
// ===== MAIN SUBMIT - NOVO FLUXO =====
async function handleMatriculaSubmit(e) {
  e.preventDefault();
  console.log('\n' + '='.repeat(70));
  console.log('🚀 INICIANDO SUBMISSÃO DE MATRÍCULA - VERSÃO 2.0 (jsPDF)');
  console.log('='.repeat(70));
  
  // Track conversion in Google Analytics
  if (typeof trackConversion === 'function') {
    trackConversion('enrollment_form_submission', {
      'form_type': 'pre_enrollment',
      'submission_source': document.title
    });
  }
  
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const btnText = btn.innerHTML;
  
  // Validar formulário
  const v = FormValidator.validate();
  if (!v.valid) {
    console.error('❌', v.msg);
    alert(v.msg);
    return;
  }
  
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A processar...';
  
  try {
    const fdata = FormValidator.getFormData();
    const file = FileManager.files[0];
    const id = StorageManager.generateId();
    
    console.log(`\n📋 DADOS GERAIS:`);
    console.log(`   ID: ${id}`);
    console.log(`   Aluno: ${fdata.nomeAluno}`);
    console.log(`   Email: ${fdata.email}`);
    console.log(`   Classe: ${fdata.classePretendida}`);
    console.log(`   Ficheiro: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    
    // ===== PASSO 1: GERAR PDF =====
    console.log('\n' + '-'.repeat(70));
    console.log('PASSO 1️⃣ : GERAR E BAIXAR PDF DE COMPROVANTE');
    console.log('-'.repeat(70));
    
    btn.innerHTML = '<i class="fas fa-file-pdf"></i> Gerando PDF...';
    const pdfFilename = await PDFGenerator.generateProof(fdata, id);
    console.log(`   ✅ PDF gerado: ${pdfFilename}`);
    
    // ===== PASSO 2: GUARDAR EM LOCALSTORAGE =====
    console.log('\n' + '-'.repeat(70));
    console.log('PASSO 2️⃣ : GUARDAR DADOS LOCALMENTE');
    console.log('-'.repeat(70));
    
    StorageManager.save(fdata, id);
    console.log('   ✅ Dados guardados em localStorage');
    
    // ===== PASSO 3: ENVIAR PARA FORMSPREE =====
    console.log('\n' + '-'.repeat(70));
    console.log('PASSO 3️⃣ : ENVIAR PARA FORMSPREE (EMAIL)');
    console.log('-'.repeat(70));
    
    btn.innerHTML = '<i class="fas fa-envelope"></i> Enviando email...';
    
    const emailMessage = `COMPROVANTE DE INSCRIÇÃO - COLÉGIO ALFA E OMEGA
${'═'.repeat(65)}

🆔 ID DE REFERÊNCIA: ${id}
📅 Data/Hora: ${new Date().toLocaleString('pt-PT')}

👶 DADOS DO ALUNO
${'═'.repeat(65)}
• Nome Completo: ${fdata.nomeAluno}
• Data de Nascimento: ${fdata.dataNascimento}
• Sexo: ${fdata.sexo}
• Classe Pretendida: ${fdata.classePretendida}
• Turno: ${fdata.turno}

👨‍👩‍👧 DADOS DO ENCARREGADO DE EDUCAÇÃO
${'═'.repeat(65)}
• Nome Completo: ${fdata.nomeEncarregado}
• Grau de Parentesco: ${fdata.grauParentesco}
• Telefone: ${fdata.telefone}
• Email: ${fdata.email}
• Morada: ${fdata.morada}

📎 DOCUMENTO VERIFICADO
${'═'.repeat(65)}
• Nome do Ficheiro: ${file.name}
• Tamanho: ${(file.size / 1024).toFixed(2)} KB
• Tipo: ${file.type || 'Desconhecido'}
• Status: ✅ Recebido e validado

${'═'.repeat(65)}
✅ Um PDF de comprovante foi gerado automaticamente!
📌 Guarde o seu ID para futuras consultas: ${id}
🏫 Compareça presencialmente para finalizar a inscrição.
Entre em contacto: WhatsApp +244 925 952 771
`;
    
    const formspreeResponse = await fetch(`https://formspree.io/f/${CONFIG.FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: `🎓 Matrícula: ${fdata.nomeAluno} [${id}]`,
        _replyto: fdata.email,
        _cc: fdata.email,
        message: emailMessage
      })
    });
    
    if (!formspreeResponse.ok) {
      throw new Error(`Formspree ${formspreeResponse.status}: ${formspreeResponse.statusText}`);
    }
    console.log('   ✅ Email enviado com sucesso via Formspree');
    
    // ===== PASSO 4: ENVIAR PARA GOOGLE SHEETS (opcional) =====
    console.log('\n' + '-'.repeat(70));
    console.log('PASSO 4️⃣ : REGISTRAR EM GOOGLE SHEETS (opcional)');
    console.log('-'.repeat(70));
    
    // Não esperar por resposta (pode falhar, não deve bloquear)
    fetch(CONFIG.GOOGLE_SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({
        ts: new Date().toLocaleString('pt-PT'),
        id,
        ...fdata,
        doc: file.name,
        pdfGenerated: true
      })
    }).then(() => console.log('   ✅ Registrado em Google Sheets'))
      .catch(e => console.warn('   ⚠️ Google Sheets indisponível:', e.message));
    
    // ===== PASSO 5: ABRIR WHATSAPP =====
    console.log('\n' + '-'.repeat(70));
    console.log('PASSO 5️⃣ : ABRIR WHATSAPP PARA CONFIRMAÇÃO');
    console.log('-'.repeat(70));
    
    btn.innerHTML = '<i class="fab fa-whatsapp"></i> Abrindo WhatsApp...';
    
    const whatsappMsg = `🎓 *MATRÍCULA ENVIADA COM SUCESSO* 🎓

*ID de Referência:* ${id}
*PDF de Comprovante:* Baixado automaticamente ✅

*DADOS DO ALUNO:*
📚 Nome: ${fdata.nomeAluno}
📅 Data Nasc: ${fdata.dataNascimento}
👤 Sexo: ${fdata.sexo}
🎓 Classe: ${fdata.classePretendida}
⏰ Turno: ${fdata.turno}

*ENCARREGADO DE EDUCAÇÃO:*
👨‍👩‍👧 Nome: ${fdata.nomeEncarregado}
🔗 Parentesco: ${fdata.grauParentesco}
📱 Telefone: ${fdata.telefone}
📧 Email: ${fdata.email}

*PRÓXIMAS ETAPAS:*
1️⃣ Localize o PDF de comprovante (em Downloads)
2️⃣ Compareça presencialmente com este PDF e documentos originais
3️⃣ Finalize a inscrição com a secretaria da escola

📍 Localização: Panguila, Bengo, Angola
📞 Contacte-nos para dúvidas`;
    
    window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
    console.log('   ✅ WhatsApp aberto');
    
    // ===== SUCESSO FINAL =====
    console.log('\n' + '='.repeat(70));
    console.log('✅ PROCESSO CONCLUÍDO COM SUCESSO!');
    console.log('='.repeat(70) + '\n');
    
    alert(`✅ INSCRIÇÃO PROCESSADA COM SUCESSO!

📌 ID DE REFERÊNCIA:
${id}

📄 COMPROVANTE PDF:
Ficheiro baixado automaticamente

💌 CONFIRMAÇÃO POR EMAIL:
Enviada para ${fdata.email}

📱 WHATSAPP:
Aberto para confirmação

🔑 PRÓXIMAS ETAPAS:
1. Localize o PDF em Downloads
2. Compareça presencialmente com o PDF
3. Leve documentos originais
4. Finalize a inscrição

⚠️ Guarde o ID para consultas futuras!`);
    
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Inscrição Enviada!';
    form.reset();
    FileManager.clear();
    
    setTimeout(() => location.reload(), 3000);
    
  } catch (err) {
    console.error('\n' + '='.repeat(70));
    console.error('❌ ERRO DURANTE O PROCESSO:', err.message);
    console.error('='.repeat(70) + '\n');
    
    alert(`❌ ERRO: ${err.message}\n\nDetalhes:\n• Verifique a conexão de internet\n• Tente novamente em alguns minutos\n• Se persistir, contacte: +244 925 952 771\n\nAbra a consola (F12) para detalhes técnicos.`);
    
    btn.innerHTML = btnText;
    btn.disabled = false;
  }
}

// ===== CONSULTA DE MATRÍCULA =====
function consultarMatricula() {
  const id = document.getElementById('consultaId')?.value.trim().toUpperCase();
  
  if (!id) {
    alert('❌ Por favor, introduza o ID de referência');
    return;
  }
  
  if (!id.match(/^AO-2026-\d{6}$/)) {
    alert('❌ ID inválido. Formato: AO-2026-XXXXXX');
    return;
  }
  
  console.log(`\n🔍 Consultando ID: ${id}`);
  
  const list = JSON.parse(localStorage.getItem('matriculas') || '[]');
  const found = list.find(item => item.id === id);
  
  const resultDiv = document.getElementById('consultaResult');
  const contentDiv = document.getElementById('consultaContent');
  
  if (!found) {
    console.warn(`❌ ID não encontrado: ${id}`);
    contentDiv.innerHTML = `
      <div style="text-align: center; padding: 2rem; background: rgba(239, 68, 68, 0.1); border-radius: 0.75rem; border: 2px solid #EF4444;">
        <i style="font-size: 3rem; color: #EF4444; display: block; margin-bottom: 1rem;">❌</i>
        <h3 style="color: #EF4444; margin: 0 0 0.5rem;">ID não encontrado</h3>
        <p style="color: #666; margin: 0;">Verifique se o ID está correto. Formato esperado: <strong>AO-2026-XXXXXX</strong></p>
      </div>
    `;
  } else {
    console.log('✅ ID encontrado!');
    console.log('📋 Dados:', found);
    
    const statusColors = {
      'Pendente': '#FFA500',
      'Processando': '#3B82F6',
      'Aprovado': '#10B981',
      'Rejeitado': '#EF4444'
    };
    
    const status = found.status || 'Pendente de Verificação';
    const statusColor = statusColors[status] || '#666';
    
    const dataSubmissao = new Date(found.ts).toLocaleString('pt-PT');
    
    contentDiv.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(206, 244, 49, 0.1), rgba(206, 244, 49, 0.05)); border-radius: 0.75rem; border: 2px solid #CEF431; padding: 2rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <i style="font-size: 3rem; color: #10B981; display: block; margin-bottom: 1rem;">✅</i>
          <h3 style="color: #01377D; margin: 0 0 0.5rem;">Inscrição Encontrada</h3>
          <p style="color: #666; margin: 0;">Status: <strong style="color: ${statusColor};">${status}</strong></p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
          <div style="background: white; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #01377D;">
            <p style="color: #666; font-size: 0.85rem; margin: 0 0 0.5rem;">📌 ID de Referência</p>
            <p style="color: #01377D; font-size: 1.25rem; font-weight: 800; font-family: 'Courier New', monospace; margin: 0; letter-spacing: 0.05em;">${found.id}</p>
          </div>
          
          <div style="background: white; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #CEF431;">
            <p style="color: #666; font-size: 0.85rem; margin: 0 0 0.5rem;">📅 Data de Submissão</p>
            <p style="color: #01377D; font-size: 1rem; font-weight: 600; margin: 0;">${dataSubmissao}</p>
          </div>
        </div>
        
        <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; margin-top: 1.5rem; border-left: 4px solid #01377D;">
          <h4 style="color: #01377D; margin: 0 0 1rem; font-size: 1rem;">👶 Dados do Aluno</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div>
              <p style="color: #666; font-size: 0.85rem; margin: 0;">Nome</p>
              <p style="color: #01377D; font-weight: 600; margin: 0.25rem 0 0;">${found.nomeAluno}</p>
            </div>
            <div>
              <p style="color: #666; font-size: 0.85rem; margin: 0;">Data de Nascimento</p>
              <p style="color: #01377D; font-weight: 600; margin: 0.25rem 0 0;">${found.dataNascimento}</p>
            </div>
            <div>
              <p style="color: #666; font-size: 0.85rem; margin: 0;">Sexo</p>
              <p style="color: #01377D; font-weight: 600; margin: 0.25rem 0 0;">${found.sexo}</p>
            </div>
            <div>
              <p style="color: #666; font-size: 0.85rem; margin: 0;">Classe Pretendida</p>
              <p style="color: #01377D; font-weight: 600; margin: 0.25rem 0 0;">${found.classePretendida}</p>
            </div>
            <div>
              <p style="color: #666; font-size: 0.85rem; margin: 0;">Turno</p>
              <p style="color: #01377D; font-weight: 600; margin: 0.25rem 0 0;">${found.turno}</p>
            </div>
          </div>
        </div>
        
        <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; margin-top: 1.5rem; border-left: 4px solid #01377D;">
          <h4 style="color: #01377D; margin: 0 0 1rem; font-size: 1rem;">👨‍👩‍👧 Encarregado de Educação</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div>
              <p style="color: #666; font-size: 0.85rem; margin: 0;">Nome</p>
              <p style="color: #01377D; font-weight: 600; margin: 0.25rem 0 0;">${found.nomeEncarregado}</p>
            </div>
            <div>
              <p style="color: #666; font-size: 0.85rem; margin: 0;">Parentesco</p>
              <p style="color: #01377D; font-weight: 600; margin: 0.25rem 0 0;">${found.grauParentesco}</p>
            </div>
            <div>
              <p style="color: #666; font-size: 0.85rem; margin: 0;">Telefone</p>
              <p style="color: #01377D; font-weight: 600; margin: 0.25rem 0 0;">${found.telefone}</p>
            </div>
            <div>
              <p style="color: #666; font-size: 0.85rem; margin: 0;">Email</p>
              <p style="color: #01377D; font-weight: 600; margin: 0.25rem 0 0;">${found.email}</p>
            </div>
            <div style="grid-column: 1 / -1;">
              <p style="color: #666; font-size: 0.85rem; margin: 0;">Morada</p>
              <p style="color: #01377D; font-weight: 600; margin: 0.25rem 0 0;">${found.morada}</p>
            </div>
          </div>
        </div>
        
        <div style="background: #e0f2fe; padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem; border-left: 4px solid #01377D;">
          <p style="color: #01377D; margin: 0; font-size: 0.95rem;">
            <strong>📌 Próximas Etapas:</strong><br>
            Compareça presencialmente na escola com o seu ID de referência e documentos originais para confirmar a inscrição.
          </p>
        </div>
      </div>
    `;
  }
  
  resultDiv.classList.add('show');
  console.log('✅ Resultado exibido\n');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('📱 Inicializando Sistema de Matrículas...');
  
  // Input de ficheiro
  const inp = document.getElementById('fileInput');
  if (inp) {
    console.log('✓ File input encontrado');
    inp.addEventListener('change', e => {
      console.log('📂 Ficheiro selecionado:', e.target.files[0]?.name);
      if (e.target.files[0]) FileManager.addFile(e.target.files[0]);
    });
  } else {
    console.warn('⚠️ File input NÃO encontrado');
  }
  
  // Upload area para drag & drop
  const area = document.getElementById('fileUploadArea');
  if (area) {
    console.log('✓ Upload area encontrado');
    
    // Clique para abrir ficheiro
    area.addEventListener('click', () => {
      inp.click();
    });
    
    // Drag and drop
    area.addEventListener('dragover', e => {
      e.preventDefault();
      e.stopPropagation();
      area.style.background = 'rgba(206, 244, 49, 0.1)';
      area.style.borderColor = 'var(--accent)';
    });
    
    area.addEventListener('dragleave', () => {
      area.style.background = '';
      area.style.borderColor = '';
    });
    
    area.addEventListener('drop', e => {
      e.preventDefault();
      e.stopPropagation();
      area.style.background = '';
      area.style.borderColor = '';
      
      if (e.dataTransfer.files[0]) {
        console.log('📂 Ficheiro via drag & drop:', e.dataTransfer.files[0].name);
        FileManager.addFile(e.dataTransfer.files[0]);
      }
    });
  } else {
    console.warn('⚠️ Upload area NÃO encontrado (ID: fileUploadArea)');
  }
  
  // Verificar form
  const form = document.getElementById('matriculaForm');
  if (form) {
    console.log('✓ Formulário encontrado');
  } else {
    console.error('❌ ERRO: Formulário NÃO encontrado (ID: matriculaForm)');
  }
  
  // Verificar file preview
  const preview = document.getElementById('filePreview');
  if (preview) {
    console.log('✓ File preview encontrado');
  } else {
    console.warn('⚠️ File preview NÃO encontrado (ID: filePreview)');
  }
  
  // Consulta de matrícula - permitir Enter
  const consultaInput = document.getElementById('consultaId');
  if (consultaInput) {
    console.log('✓ Consulta input encontrado');
    consultaInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        consultarMatricula();
      }
    });
  } else {
    console.warn('⚠️ Consulta input NÃO encontrado (ID: consultaId)');
  }
  
  FileManager.updatePreview();
  console.log('✅ Sistema carregado com sucesso!\n');
});
