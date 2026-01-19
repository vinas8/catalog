/**
 * SMRI Decoder - Human-readable SMRI code explanation
 * @module modules/smri/decoder
 * @version 0.7.10
 * 
 * Decodes SMRI codes (S{M}.{RRR}.{II}) into human-readable format
 * 
 * SMRI: S10.2,5.01
 */

/**
 * Module mapping
 */
const MODULE_MAP = {
  0: 'Core/Internal',
  1: 'Auth',
  2: 'Common',
  3: 'Game',
  4: 'Shop',
  5: 'Testing',
  6: 'Payment',
  7: 'Import',
  8: 'Debug',
  9: 'Demo',
  10: 'SMRI'
};

/**
 * Parse SMRI code
 * @param {string} smriCode - SMRI code (e.g., "S9.2,8,5.02")
 * @returns {Object|null} Parsed components or null if invalid
 */
export function parseSMRI(smriCode) {
  const match = smriCode.match(/S(\d+)\.([0-9,]+)\.(\d+)/);
  if (!match) return null;
  
  const [, module, relations, iteration] = match;
  
  return {
    raw: smriCode,
    module: parseInt(module),
    moduleName: MODULE_MAP[module] || `Module ${module}`,
    relations: relations.split(',').map(r => parseInt(r.trim())),
    relationNames: relations.split(',').map(r => MODULE_MAP[r.trim()] || `Module ${r}`),
    iteration: parseInt(iteration)
  };
}

/**
 * Decode SMRI code to human-readable HTML
 * @param {string} smriCode - SMRI code to decode
 * @returns {string} HTML explanation
 */
export function decodeSMRI(smriCode) {
  const parsed = parseSMRI(smriCode);
  
  if (!parsed) {
    return '<div style="color: #f85149;">Invalid SMRI format. Expected: S{M}.{RRR}.{II}</div>';
  }
  
  return `
    <div><strong>Code:</strong> <span class="smri-code">${parsed.raw}</span></div>
    <div style="margin-top: 15px;"><strong>Module:</strong> ${parsed.moduleName} (${parsed.module})</div>
    <div style="margin-top: 10px;"><strong>Dependencies:</strong> ${parsed.relationNames.join(', ')}</div>
    <div style="margin-top: 10px;"><strong>Iteration:</strong> ${parsed.iteration.toString().padStart(2, '0')}</div>
    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #30363d; color: #8b949e; font-size: 12px;">
      <strong>SMRI Format:</strong> S{M}.{RRR}.{II}<br>
      <strong>M</strong> = Module number (0-10)<br>
      <strong>RRR</strong> = Related modules (comma-separated)<br>
      <strong>II</strong> = Iteration number (01-99)
    </div>
  `;
}

/**
 * Get module name by number
 * @param {number} moduleNum - Module number
 * @returns {string} Module name
 */
export function getModuleName(moduleNum) {
  return MODULE_MAP[moduleNum] || `Module ${moduleNum}`;
}

/**
 * Create SMRI modal UI
 * @param {string} smriCode - SMRI code to display
 * @param {Function} onClose - Callback when modal closes
 */
export function showSMRIModal(smriCode, onClose) {
  // Check if modal already exists
  let modal = document.getElementById('smri-modal');
  
  if (!modal) {
    // Create modal
    modal = document.createElement('div');
    modal.id = 'smri-modal';
    modal.className = 'smri-modal';
    modal.innerHTML = `
      <div class="smri-modal-content">
        <div class="smri-modal-header">🔍 SMRI Code Decoder</div>
        <div class="smri-modal-body" id="smri-decoder-body"></div>
        <button class="smri-close" id="smri-close">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Attach close handlers
    const closeBtn = modal.querySelector('#smri-close');
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
      if (onClose) onClose();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        if (onClose) onClose();
      }
    });
    
    // ESC key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
        if (onClose) onClose();
      }
    });
  }
  
  // Update content and show
  const body = modal.querySelector('#smri-decoder-body');
  body.innerHTML = decodeSMRI(smriCode);
  modal.classList.add('show');
}

export default {
  parseSMRI,
  decodeSMRI,
  getModuleName,
  showSMRIModal,
  MODULE_MAP
};
