/**
 * Directorio Interactivo de Aprendices SENA
 * Lógica principal: carga de datos, filtros, estadísticas, modales y generador interactivo
 */

document.addEventListener('DOMContentLoaded', () => {
  // Estado de la aplicación
  let aprendices = [...(typeof APRENDICES_DATA !== 'undefined' ? APRENDICES_DATA : [])];
  let currentFilter = 'all';
  let searchTerm = '';

  // Elementos del DOM
  const profilesGrid = document.getElementById('profilesGrid');
  const searchInput = document.getElementById('searchInput');
  const filterChips = document.querySelectorAll('.chip');
  const totalAprendicesEl = document.getElementById('totalAprendices');
  const totalSkillsEl = document.getElementById('totalSkills');
  const totalFichasEl = document.getElementById('totalFichas');
  const themeToggleBtn = document.getElementById('themeToggle');

  // Modales
  const profileDetailModal = document.getElementById('profileDetailModal');
  const profileGeneratorModal = document.getElementById('profileGeneratorModal');
  const closeDetailModalBtn = document.getElementById('closeDetailModal');
  const closeGeneratorModalBtn = document.getElementById('closeGeneratorModal');
  const openGeneratorBtn = document.getElementById('openGeneratorBtn');
  const openGeneratorHeroBtn = document.getElementById('openGeneratorHeroBtn');
  const generatorForm = document.getElementById('generatorForm');
  const jsonPreviewEl = document.getElementById('jsonPreview');
  const gitCommandsEl = document.getElementById('gitCommands');
  const copyJsonBtn = document.getElementById('copyJsonBtn');
  const downloadJsonBtn = document.getElementById('downloadJsonBtn');
  const toastEl = document.getElementById('toastNotification');

  // ==========================================
  // INICIALIZACIÓN
  // ==========================================
  initTheme();
  renderStats();
  renderProfiles();

  // ==========================================
  // TEMA CLARO / OSCURO
  // ==========================================
  function initTheme() {
    const savedTheme = localStorage.getItem('sena_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('sena_theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Modo ${newTheme === 'light' ? 'Claro' : 'Oscuro'} activado`);
  });

  function updateThemeIcon(theme) {
    themeToggleBtn.innerHTML = theme === 'light' 
      ? '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>'
      : '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>';
  }

  // ==========================================
  // ESTADÍSTICAS
  // ==========================================
  function renderStats() {
    const allSkills = new Set();
    const allFichas = new Set();

    aprendices.forEach(a => {
      if (Array.isArray(a.habilidades)) {
        a.habilidades.forEach(skill => allSkills.add(skill.trim()));
      }
      if (a.ficha) allFichas.add(a.ficha);
    });

    if (totalAprendicesEl) totalAprendicesEl.textContent = aprendices.length;
    if (totalSkillsEl) totalSkillsEl.textContent = allSkills.size;
    if (totalFichasEl) totalFichasEl.textContent = allFichas.size;
  }

  // ==========================================
  // RENDERIZADO DE PERFILES
  // ==========================================
  function renderProfiles() {
    profilesGrid.innerHTML = '';

    const filtered = aprendices.filter(item => {
      const matchesSearch = 
        item.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ficha.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(item.habilidades) && item.habilidades.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));

      if (!matchesSearch) return false;

      if (currentFilter === 'all') return true;
      if (currentFilter === 'instructores') return item.ficha.toLowerCase().includes('instructor');
      if (currentFilter === 'adso') return item.programa.toLowerCase().includes('desarrollo') || item.ficha.includes('3294152');
      if (currentFilter === 'frontend') return (item.habilidades || []).some(s => ['html5', 'css3', 'javascript', 'react', 'vue', 'figma'].includes(s.toLowerCase()));
      if (currentFilter === 'backend') return (item.habilidades || []).some(s => ['python', 'node.js', 'sql', 'postgresql', 'api rest', 'java', 'php'].includes(s.toLowerCase()));

      return true;
    });

    if (filtered.length === 0) {
      profilesGrid.innerHTML = `
        <div class="empty-state">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 style="margin-bottom: 0.5rem; font-size: 1.2rem;">No se encontraron perfiles</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Intenta con otro término de búsqueda o limpia los filtros.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(profile => {
      const card = document.createElement('div');
      card.className = 'profile-card';
      card.innerHTML = `
        <div>
          <div class="profile-header">
            <img src="${profile.avatar || 'assets/avatares/avatar_default.svg'}" alt="${profile.nombreCompleto}" class="profile-avatar" onerror="this.src='assets/avatares/avatar_default.svg'">
            <div class="profile-info">
              <h3>${profile.nombreCompleto}</h3>
              <div class="profile-role">${profile.rol}</div>
              <span class="profile-ficha">Ficha: ${profile.ficha}</span>
            </div>
          </div>
          <p class="profile-bio">${profile.biografia || 'Sin descripción disponible.'}</p>
          <div class="profile-skills">
            ${(profile.habilidades || []).slice(0, 4).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            ${(profile.habilidades || []).length > 4 ? `<span class="skill-tag">+${profile.habilidades.length - 4} más</span>` : ''}
          </div>
        </div>
        <div class="profile-footer">
          <div class="social-links">
            ${profile.redes?.github ? `<a href="${profile.redes.github}" target="_blank" rel="noopener noreferrer" class="social-btn" title="GitHub" onclick="event.stopPropagation();"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg></a>` : ''}
            ${profile.redes?.linkedin ? `<a href="${profile.redes.linkedin}" target="_blank" rel="noopener noreferrer" class="social-btn" title="LinkedIn" onclick="event.stopPropagation();"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>` : ''}
            ${profile.redes?.portafolio ? `<a href="${profile.redes.portafolio}" target="_blank" rel="noopener noreferrer" class="social-btn" title="Portafolio Web" onclick="event.stopPropagation();"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg></a>` : ''}
          </div>
          <span class="view-profile-btn">
            Ver detalle
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      `;

      card.addEventListener('click', () => openProfileDetail(profile));
      profilesGrid.appendChild(card);
    });
  }

  // ==========================================
  // EVENTOS DE BÚSQUEDA Y FILTRADO
  // ==========================================
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.trim();
    renderProfiles();
  });

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.getAttribute('data-filter');
      renderProfiles();
    });
  });

  // ==========================================
  // MODAL DE DETALLE DE PERFIL
  // ==========================================
  function openProfileDetail(profile) {
    const detailContent = document.getElementById('profileDetailContent');
    detailContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <img src="${profile.avatar || 'assets/avatares/avatar_default.svg'}" alt="${profile.nombreCompleto}" style="width: 90px; height: 90px; border-radius: 50%; border: 3px solid var(--sena-green); margin-bottom: 0.75rem; background: var(--bg-primary);" onerror="this.src='assets/avatares/avatar_default.svg'">
        <h2 style="font-size: 1.4rem; margin-bottom: 0.25rem;">${profile.nombreCompleto}</h2>
        <p style="color: var(--sena-green); font-weight: 600;">${profile.rol}</p>
        <p style="font-size: 0.85rem; color: var(--text-muted);">${profile.programa} • Ficha ${profile.ficha}</p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 0.5rem;">Biografía</h4>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-light);">${profile.biografia || 'Sin biografía.'}</p>
      </div>

      ${profile.fraseFavorita ? `
        <div style="background: rgba(57, 169, 0, 0.08); border-left: 3px solid var(--sena-green); padding: 0.85rem 1rem; border-radius: 4px; margin-bottom: 1.5rem; font-style: italic; font-size: 0.9rem; color: var(--text-main);">
          "${profile.fraseFavorita}"
        </div>
      ` : ''}

      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 0.5rem;">Habilidades Técnicas</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
          ${(profile.habilidades || []).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
      </div>

      ${(profile.intereses || []).length > 0 ? `
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 0.5rem;">Áreas de Interés</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${profile.intereses.map(inte => `<span class="chip" style="cursor: default;">${inte}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <div style="border-top: 1px solid var(--border-color); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div style="font-size: 0.85rem; color: var(--text-muted);">
          Estado: <strong style="color: var(--sena-green);">${profile.estado || 'Activo'}</strong>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          ${profile.redes?.github ? `<a href="${profile.redes.github}" target="_blank" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 0.85rem;">GitHub</a>` : ''}
          ${profile.redes?.linkedin ? `<a href="${profile.redes.linkedin}" target="_blank" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 0.85rem;">LinkedIn</a>` : ''}
          ${profile.redes?.portafolio ? `<a href="${profile.redes.portafolio}" target="_blank" class="btn btn-primary" style="font-size: 0.85rem; padding: 0.4rem 0.85rem;">Portafolio</a>` : ''}
        </div>
      </div>
    `;

    profileDetailModal.classList.add('active');
  }

  closeDetailModalBtn.addEventListener('click', () => {
    profileDetailModal.classList.remove('active');
  });

  // ==========================================
  // GENERADOR INTERACTIVO DE PERFIL
  // ==========================================
  function openGenerator() {
    profileGeneratorModal.classList.add('active');
    updateGeneratedOutput();
  }

  if (openGeneratorBtn) openGeneratorBtn.addEventListener('click', openGenerator);
  if (openGeneratorHeroBtn) openGeneratorHeroBtn.addEventListener('click', openGenerator);

  closeGeneratorModalBtn.addEventListener('click', () => {
    profileGeneratorModal.classList.remove('active');
  });

  // Cerrar al hacer clic fuera del modal
  [profileDetailModal, profileGeneratorModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // Actualizar la previsualización del JSON y comandos de Git dinámicamente
  generatorForm.addEventListener('input', updateGeneratedOutput);

  function getFormData() {
    const nombre = document.getElementById('genNombre').value.trim() || 'Mi Nombre';
    const cleanId = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    const ficha = document.getElementById('genFicha').value.trim() || '3294152';
    const programa = document.getElementById('genPrograma').value.trim() || 'Análisis y Desarrollo de Software';
    const rol = document.getElementById('genRol').value.trim() || 'Aprendiz / Desarrollador';
    const biografia = document.getElementById('genBio').value.trim() || 'Aprendiz entusiasta de la tecnología.';
    const habilidades = document.getElementById('genSkills').value.split(',').map(s => s.trim()).filter(Boolean);
    const avatar = document.getElementById('genAvatar').value || 'assets/avatares/avatar_default.svg';
    const githubUser = document.getElementById('genGithub').value.trim() || 'mi-usuario-github';
    const frase = document.getElementById('genFrase').value.trim() || 'Construyendo el futuro línea a línea.';

    return {
      id: cleanId,
      nombreCompleto: nombre,
      ficha: ficha,
      programa: programa,
      rol: rol,
      biografia: biografia,
      habilidades: habilidades.length ? habilidades : ['Git', 'HTML5', 'CSS3', 'JavaScript'],
      intereses: ['Desarrollo Web', 'Programación'],
      avatar: avatar,
      redes: {
        github: `https://github.com/${githubUser}`,
        linkedin: `https://linkedin.com/in/${githubUser}`,
        portafolio: `https://${githubUser}.github.io/mi-perfil-sena`
      },
      fraseFavorita: frase,
      estado: 'Listo para colaborar'
    };
  }

  function updateGeneratedOutput() {
    const data = getFormData();
    const jsonString = JSON.stringify(data, null, 2);
    jsonPreviewEl.textContent = jsonString;

    const fileName = `perfiles/${data.id}.json`;
    const gitScript = `# 1. Crear tu rama de trabajo
git checkout -b perfil/${data.id}

# 2. Guardar tu archivo en: ${fileName}

# 3. Registrar los cambios
git add .
git commit -m "feat(perfil): agregar perfil de ${data.nombreCompleto}"

# 4. Enlazar a tu repositorio personal y subir
git remote add personal https://github.com/${data.redes.github.replace('https://github.com/', '')}/mi-perfil-sena.git
git push -u personal perfil/${data.id}`;

    gitCommandsEl.textContent = gitScript;
  }

  // Copiar JSON
  copyJsonBtn.addEventListener('click', () => {
    const data = getFormData();
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
      showToast('¡JSON copiado al portapapeles!');
    });
  });

  // Descargar archivo JSON
  downloadJsonBtn.addEventListener('click', () => {
    const data = getFormData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Archivo ${data.id}.json descargado`);
  });

  // Toast helper
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3000);
  }
});
