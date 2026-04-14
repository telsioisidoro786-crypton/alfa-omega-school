# 🏫 Colégio Alfa e Omega — Website Oficial 2026

> **Plataforma educativa interativa** que une excelência académica, design moderno e engajamento comunitário para o Colégio Alfa e Omega em Panguila, Angola.

## 📋 Visão Geral

O website oficial do Colégio Alfa e Omega (v2.0 — Ano Letivo 2026) é uma aplicação web completa desenvolvida com HTML5, CSS3 e JavaScript vanilla, focada em:

- ✨ **Experiência do Utilizador:** Design responsivo, animações suaves, navegação intuitiva
- 📅 **Transparência Institucional:** Timeline actual de eventos (Caixa do Tempo Escolar)
- 🎓 **Comunicação Familiar:** Notícias, galeria, informações de matrículas
- 📱 **Acessibilidade:** Compatível com desktop, tablet e mobile

---

## 🎯 Funcionalidades Principais

### 1. **Caixa do Tempo Escolar** 🕐
Timeline interativa que apresenta cronologicamente os eventos escolares em blocos mensais:
- **Janeiro 2026:** 4 eventos (Reunião de Encarregados, Splash Day, Curso de Inglês, Aniversariantes)
- **Fevereiro 2026:** 4 eventos (Palestra Beija-Flor, Olimpíadas de Matemática, Excursão Laugorim, Site Launch)
- **Março 2026:** 3 eventos (Olimpíadas Encerramento com 16 medalhas, Dia das Mulheres & Piquenique com mães, Dia dos Pais)

**Feature card especial:** Medalhas das Olimpíadas com display visual (🥇2 Ouro | 🥈4 Prata | 🥉10 Bronze)

**Localização:**
- Página dedicada: `/tempo.html`
- Secção homepage: `.section-timeline-card` com scroll badge de navegação

### 2. **Homepage Otimizada** 🏠
Estrutura em seções:
- **Hero:** Carrousel de 4 imagens, badge scroll (CTA para Caixa do Tempo)
- **Why Us:** 5 pilares de diferenciação (Excelência Académica, Valores, Identidade Cultural, Atividades Extra, Comunidade)
- **Novidades:** Grid 3-coluna com eventos recentes
- **Caixa do Tempo:** Card promotivo interativo
- **Diferenciais:** 6 razões para escolher a escola
- **Ticker:** Feed de notícias em scroll contínuo

### 3. **Página de Finalistas** 👑
Galeria de pequenos finalistas 2026 (formandos) com design moderno (glassmorphism, cards interativas)

### 4. **Seções Informativas** 📚
- **Sobre:** História, missão e valores da instituição
- **Oferta Educativa:** Programas académicos, estrutura curricular
- **Avisos:** Comunicados oficiais
- **Contactos:** Informações de contacto, mapa de localização
- **Galeria:** Fotos dos eventos escolares
- **Olimpíadas:** Detalhes sobre competições académicas

---

## 🛠 Stack Técnico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | HTML5, CSS3 (Flexbox/Grid), JavaScript ES6+ |
| **Animações** | CSS Animations, AOS (Animate on Scroll) |
| **Ícones** | Font Awesome 6.4.0 |
| **Fonte de Dados** | Arquivos HTML estáticos |
| **Hospedagem** | Vercel (Deploy automático com Git) |
| **Domínio** | colegioalfaeomega.com |

---

## 📂 Estrutura de Ficheiros

```
alfa-omega-site/
├── index.html                 # 🏠 Homepage principal
├── tempo.html                 # 🕐 Caixa do Tempo (Timeline 2026)
├── sobre.html                 # ℹ️ Sobre a Escola
├── oferta.html                # 📚 Oferta Educativa
├── finalistas.html            # 👑 Pequenos Finalistas 2026
├── galeria.html               # 📸 Galeria de Fotos
├── olimpiadas.html            # 🏆 Olimpíadas de Matemática
├── novidades.html             # 📰 Notícias e Atualizações
├── avisos.html                # 📢 Avisos Oficiais
├── contactos.html             # 📞 Contactos
├── matriculas.html            # 🎓 Informações de Matrículas
├── quiz.html                  # 🎯 Quiz do Encarregado
├── admin.html                 # 🔐 Painel Administrativo
├── 404.html                   # ❌ Página de Erro
├── robots.txt                 # 🤖 SEO
├── sitemap.xml                # 🗺️ Sitemap
│
├── assets/
│   ├── css/
│   │   ├── main.css           # Estilos globais
│   │   └── animations.css     # Animações reutilizáveis
│   ├── js/
│   │   ├── main.js            # Lógica global
│   │   ├── forms.js           # Validação de formulários
│   │   ├── analytics.js       # Rastreio de eventos
│   │   ├── matriculas.js      # Lógica de matrículas
│   │   └── slider.js          # Carrousel hero
│   └── images/
│       ├── atualizacoes/      # Imagens de eventos
│       ├── banners/           # Banners promocionais
│       ├── cultura/           # Imagens culturais
│       ├── logo/              # Logo e branding
│       ├── matematica/        # Fotos olimpíadas
│       └── sala/              # Fotos das instalações
│
├── components/
│   ├── navbar.html            # Barra de navegação (incluída via fetch)
│   ├── footer.html            # Rodapé (incluída via fetch)
│   └── meta.html              # Tags meta globais
│
└── uploads/                   # Arquivos de uploads de utilizadores
```

---

## 🎨 Design System

### Paleta de Cores
```css
--primary: #01377D       /* Azul Colégio */
--accent: #CEF431        /* Amarelo Neon */
--gold: #E6B325          /* Ouro */
--white: #FFFFFF
--dark: #0F172A
--gray: #4a567a
```

### Tipografia
- **Headings:** DM Serif Display (serif elegante)
- **Body:** DM Sans (sans-serif limpa)
- **Highlights:** Poppins (sem-serif moderno)

### Componentes Principais
- **Cards:** Glassmorphism com border-radius 16-24px
- **Buttons:** Gradientes, transitions suaves (cubic-bezier)
- **Seções:** Padding 4-8rem, max-width 1280px
- **Animations:** AOS triggers, hover effects, scroll badges

---

## 📝 Guia de Manutenção & Atualização

### Atualizar Eventos da Caixa do Tempo

Editar `/tempo.html` nas seções de cada mês:

1. **Localizar a seção do mês** (Janeiro, Fevereiro, Março, Abril, etc.)
   ```html
   <div class="month-section" data-month="01">
     <!-- Cards dos eventos -->
   </div>
   ```

2. **Adicionar novo evento** (copiar template existente):
   ```html
   <div class="event-card ec-jan card-feature">
     <div class="ec-icon ic-jan">📅</div>
     <div class="cfg-title">Título do Evento</div>
     <div class="cfg-desc">Descrição curta do evento</div>
     <div class="cfg-date">Data e detalhes</div>
   </div>
   ```

3. **Atualizar status do mês** (Em Curso → Concluído):
   ```html
   <div class="month-status">Concluído</div>
   ```

### Adicionar Notícias (Novidades)

Editar `/novidades.html` e `-index.html` (`.section-novidades`):

```html
<div class="nov-card">
  <div class="nov-img">
    <img src="/assets/images/atualizacoes/foto.webp" alt="Descrição">
    <span class="nov-tag">🏆 Categoria</span>
  </div>
  <div class="nov-body">
    <div class="nov-date"><i class="fas fa-calendar-alt"></i> Mês Ano</div>
    <h3 class="nov-title">Título da Notícia</h3>
    <p class="nov-excerpt">Resumo do evento...</p>
    <a href="#" class="nov-read">Ler mais <i class="fas fa-arrow-right"></i></a>
  </div>
</div>
```

### Atualizar Galeria

Adicionar imagens em `/assets/images/atualizacoes/` e referir em:
- `/galeria.html` — Gallery grid
- `/novidades.html` — Previews
- `/tempo.html` — Event cards

### Otimização de Imagens

⚠️ **Importante:** Sempre otimizar imagens antes de fazer upload:

1. Converter para `.webp` ou `.jpg`
2. Redimensionar para máximo 1200px largura
3. Comprimir com Squoosh.app (target: ~100-300KB)
4. Manter nomenclatura descritiva: `evento-janeiro-2026.webp`

---

## 🚀 Deploy & CI/CD

### Fluxo de Atualização

1. **Editar ficheiros** localmente (HTML, CSS, JS)
2. **Testar** em navegador (localhost ou prévia)
3. **Commit + Push** para git:
   ```bash
   git add .
   git commit -m "feat: atualizar eventos março 2026"
   git push origin main
   ```
4. **Vercel deploya automaticamente** (~1-2 minutos)
5. **Site atualiza** em colegioalfaeomega.com

### Domínio & DNS
- **Domínio:** colegioalfaeomega.com
- **Hospedagem:** Vercel
- **DNS:** Configurado via Vercel DNS

---

## 📊 Secções & Responsabilidades

| Página | Responsável | Frequência de Atualização |
|--------|-------------|--------------------------|
| `tempo.html` | Coordenador Eventos | Mensal (eventos confirmados) |
| `novidades.html` | Comunicação / Marketing | Semanal |
| `galeria.html` | Fotografia / Admin | Após cada evento |
| `finalistas.html` | Secretaria | Anual (nov/dez) |
| `matriculas.html` | Admissões | Sempre que há alterações |
| `olimpiadas.html` | Departamento Académico | Após competições |

---

## 🔒 Segurança & SEO

### Segurança
- ✅ Ficheiros HTML estáticos (sem vulnerabilidades de injeção)
- ✅ Validação de formulários no cliente
- ✅ HTTPS automático (Vercel)
- ✅ Robots.txt configurado

### SEO
- ✅ Meta tags descritivas em cada página
- ✅ Sitemap.xml atualizado
- ✅ Open Graph tags para redes sociais
- ✅ Semantic HTML5
- ✅ Core Web Vitals otimizados (imagens WebP, CSS minificado)

---

## 📱 Responsividade

Breakpoints configurados:
- **Desktop:** 1024px+ (2-3 colunas)
- **Tablet:** 768px-1023px (1-2 colunas)
- **Mobile:** <768px (1 coluna, full-width)

Testar com:
- Chrome DevTools (F12 → Toggle Device Toolbar)
- Firefox Responsive Design Mode
- Safari on macOS/iOS

---

## 🆘 Troubleshooting

| Problema | Solução |
|----------|---------|
| Imagens não aparecem | Verificar caminho relativo (`/assets/images/...`) |
| Estilos não aplicam | Ctrl+Shift+Delete (clear cache completo) |
| Animações não funcionam | Verificar AOS library (`data-aos` attributes) |
| Links quebrados | Validar href (diferenciar `/pagina.html` vs `#secção`) |
| Deploy não atualiza | Verificar se ficheiros estão commitados no git |

---

## 📚 Recursos Úteis

- **Font Awesome Icons:** https://fontawesome.com/icons
- **Color Palette:** https://coolors.co/01377d-cef431-e6b325
- **Image Optimization:** https://squoosh.app
- **Web Accessibility:** https://www.a11y-101.com

---

## 👨‍💼 Contacto & Suporte

**Administrador do Site:** Telsio Isidoro
- 📧 Email: IT Professional
- 📞 Telefone: +244 925 952 771
- 🌐 Website: colegioalfaeomega.com

**Data de Última Atualização:** 14 de Abril de 2026
**Versão:** 2.0 (Ano Letivo 2026)

---

*Desenvolvido com ❤️ para a comunidade educativa do Colégio Alfa e Omega*
