# 🏫 Website Oficial - Colégio Alfa e Omega
<p align="center">
  <img src="screenshot.png" alt="Captura de ecrã da página inicial do Colégio Alfa e Omega" width="800px">
</p>
Este é o repositório do website institucional do **Colégio Alfa e Omega**, desenvolvido para fornecer informações sobre matrículas, atividades pedagógicas e novidades escolares.

## 🚀 Tecnologias Utilizadas
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
* **Backend:** PHP (Integração com sistemas escolares)
* **Base de Dados:** MySQL (Gestão de boletins e matrículas)
* **Hospedagem:** [Vercel](https://vercel.com)
* **Domínio:** [colegioalfaeomega.com](https://www.colegioalfaeomega.com)

## 📂 Estrutura de Pastas
Para manter o site organizado e funcional, seguimos esta estrutura:
* `/assets/js/`: Scripts globais (incluindo a geração automática do Footer).
* `/assets/css/`: Folhas de estilo e animações.
* `/assets/img/`: Banco de imagens organizado por meses/atividades.
* `/php/`: Scripts de processamento de formulários e conexão DB.

## 🛠 Guia de Manutenção (Importante)

### 1. Upload de Imagens
Para evitar erros de deploy na Vercel e garantir um carregamento rápido para os pais (mobile), todas as fotos de atividades (Matemática, Cultura, etc.) devem seguir estes critérios:
* **Tamanho Máximo:** 1MB por foto (idealmente entre 200KB e 500KB).
* **Dimensões:** Largura máxima de 1600px.
* **Ferramentas Recomendadas:** [Squoosh.app](https://squoosh.app/) ou `mogrify` no Zorin OS.

### 2. Atualização de Conteúdo
As novidades são atualizadas mensalmente. Recomenda-se manter apenas os últimos 2 a 3 meses de fotos no servidor para otimizar o espaço e a performance (Estratégia de Janela Deslizante).

## 🌐 Configuração de Domínio
O domínio oficial está configurado via **Vercel DNS**.
* **Tipo A:** `76.76.21.21` (@)
* **CNAME:** `cname.vercel-dns.com` (www)

---
**Desenvolvido por:** Telsio Isidoro (IT Professional & Full-Stack Developer)
