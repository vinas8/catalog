/**
 * MorphMarket Sync Module
 * Handles syncing morph selections between MorphMarket calculator and Serpent Town DB
 */

/**
 * Match MorphMarket morph name to Serpent Town database
 * @param {string} morphName - Morph name from MorphMarket
 * @param {Array} morphDatabase - Serpent Town morph database
 * @returns {Object|null} - Matched morph object or null
 */
export function matchMorphToDatabase(morphName, morphDatabase) {
  if (!morphName || !morphDatabase) return null;

  const normalizedName = morphName.toLowerCase().trim();

  // Try exact match first
  let match = morphDatabase.find(m => 
    m.name.toLowerCase() === normalizedName
  );

  if (match) return match;

  // Try alias match
  match = morphDatabase.find(m => 
    m.aliases?.some(a => a.toLowerCase() === normalizedName)
  );

  if (match) return match;

  // Try partial match (for compound morphs like "Super Banana")
  match = morphDatabase.find(m => 
    normalizedName.includes(m.name.toLowerCase()) ||
    m.name.toLowerCase().includes(normalizedName)
  );

  if (match) return match;

  // Try word-by-word match for compound morphs
  const words = normalizedName.split(/\s+/);
  for (const word of words) {
    match = morphDatabase.find(m => 
      m.name.toLowerCase() === word ||
      m.aliases?.some(a => a.toLowerCase() === word)
    );
    if (match) return match;
  }

  return null;
}

/**
 * Extract morphs from MorphMarket calculator URL or state
 * @param {string} url - MorphMarket calculator URL with params
 * @returns {Object} - {male: [], female: []}
 */
export function extractMorphsFromURL(url) {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);

    const male = params.get('male')?.split(',').filter(Boolean) || [];
    const female = params.get('female')?.split(',').filter(Boolean) || [];

    return { male, female };
  } catch (err) {
    console.error('Failed to parse URL:', err);
    return { male: [], female: [] };
  }
}

/**
 * Sync morphs from MorphMarket to Serpent Town
 * @param {Array} morphNames - Array of morph names from MorphMarket
 * @param {Array} morphDatabase - Serpent Town morph database
 * @returns {Object} - {matched: [], unmatched: []}
 */
export function syncMorphs(morphNames, morphDatabase) {
  const matched = [];
  const unmatched = [];

  for (const name of morphNames) {
    const match = matchMorphToDatabase(name, morphDatabase);
    
    if (match) {
      matched.push({
        input: name,
        morph: match
      });
    } else {
      unmatched.push(name);
    }
  }

  return { matched, unmatched };
}

/**
 * Create snake object from matched morphs
 * @param {Array} matchedMorphs - Array of {input, morph} objects
 * @param {string} sex - 'male' or 'female'
 * @param {Object} defaults - Default values {age, weight}
 * @returns {Object} - Snake object compatible with genetics-core.js
 */
export function createSnakeFromMorphs(matchedMorphs, sex, defaults = {}) {
  return {
    name: sex === 'male' ? 'Male' : 'Female',
    morphs: matchedMorphs.map(m => m.morph.name),
    morphIds: matchedMorphs.map(m => m.morph.id),
    age: defaults.age || 3,
    weight: defaults.weight || (sex === 'male' ? 1800 : 1700),
    sex: sex
  };
}

/**
 * Monitor iframe for changes (requires postMessage support from MorphMarket)
 * @param {string} iframeId - ID of iframe element
 * @param {Function} callback - Called with {parent, morphName} when morph is selected
 */
export function setupIframeMonitor(iframeId, callback) {
  const iframe = document.getElementById(iframeId);
  
  if (!iframe) {
    console.warn(`Iframe ${iframeId} not found`);
    return;
  }

  // Listen for postMessage from iframe
  window.addEventListener('message', (event) => {
    // Verify origin (adjust if MorphMarket uses different domain)
    if (event.origin !== 'https://www.morphmarket.com') return;

    try {
      const data = typeof event.data === 'string' 
        ? JSON.parse(event.data) 
        : event.data;

      // Check for morph selection event
      if (data.type === 'morph_selected' || data.event === 'morph_selected') {
        callback({
          parent: data.parent || data.sex, // 'male' or 'female'
          morphName: data.morph || data.morphName,
          action: data.action || 'add' // 'add' or 'remove'
        });
      }
    } catch (err) {
      console.log('Iframe message parsing failed:', err);
    }
  });

  // Attempt to send ready message to iframe
  iframe.addEventListener('load', () => {
    try {
      iframe.contentWindow.postMessage(
        JSON.stringify({ type: 'sync_ready', source: 'serpent_town' }),
        'https://www.morphmarket.com'
      );
    } catch (err) {
      console.log('Cannot communicate with iframe (CORS):', err);
    }
  });
}

/**
 * Poll iframe URL for changes (fallback if postMessage not available)
 * Note: Only works if iframe src is same-origin or allows URL reading
 * @param {string} iframeId - ID of iframe element
 * @param {Function} callback - Called with {male: [], female: []} when URL changes
 * @param {number} interval - Poll interval in ms (default: 2000)
 */
export function pollIframeURL(iframeId, callback, interval = 2000) {
  const iframe = document.getElementById(iframeId);
  
  if (!iframe) {
    console.warn(`Iframe ${iframeId} not found`);
    return;
  }

  let lastURL = '';

  const checkURL = () => {
    try {
      // This will fail due to CORS, but worth trying
      const currentURL = iframe.contentWindow.location.href;
      
      if (currentURL !== lastURL) {
        lastURL = currentURL;
        const morphs = extractMorphsFromURL(currentURL);
        callback(morphs);
      }
    } catch (err) {
      // CORS prevents this - expected behavior
      // console.log('Cannot access iframe URL (CORS):', err);
    }
  };

  // Check immediately and then on interval
  checkURL();
  return setInterval(checkURL, interval);
}

/**
 * Validate morph combination for health risks and lethal combos
 * @param {Array} morphs - Array of morph names
 * @param {Array} morphDatabase - Serpent Town morph database
 * @returns {Object} - {valid: boolean, warnings: [], errors: []}
 */
export function validateMorphCombination(morphs, morphDatabase) {
  const warnings = [];
  const errors = [];

  // Check for high-risk morphs
  for (const morphName of morphs) {
    const morph = morphDatabase.find(m => 
      m.name.toLowerCase() === morphName.toLowerCase()
    );

    if (!morph) continue;

    if (morph.health_risk === 'high') {
      warnings.push(`${morph.name} has high health risk: ${morph.health_issues?.join(', ')}`);
    } else if (morph.health_risk === 'moderate') {
      warnings.push(`${morph.name} has moderate health risk: ${morph.health_issues?.join(', ')}`);
    }
  }

  // Check for duplicate morphs (potential super forms)
  const duplicates = morphs.filter((m, i) => morphs.indexOf(m) !== i);
  if (duplicates.length > 0) {
    warnings.push(`Duplicate morphs detected: ${duplicates.join(', ')} - may produce super forms`);
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors
  };
}

/**
 * Generate sync report for debugging
 * @param {Object} syncResult - Result from syncMorphs()
 * @returns {string} - HTML formatted report
 */
export function generateSyncReport(syncResult) {
  const { matched, unmatched } = syncResult;
  
  let html = '<div style="font-family: monospace; font-size: 0.9em;">';
  
  if (matched.length > 0) {
    html += '<div style="color: #10b981; margin-bottom: 10px;">';
    html += `<strong>✅ Matched (${matched.length}):</strong><br>`;
    matched.forEach(m => {
      html += `  "${m.input}" → ${m.morph.name} (${m.morph.gene_type})<br>`;
    });
    html += '</div>';
  }

  if (unmatched.length > 0) {
    html += '<div style="color: #ef4444;">';
    html += `<strong>❌ Not Found (${unmatched.length}):</strong><br>`;
    unmatched.forEach(name => {
      html += `  "${name}"<br>`;
    });
    html += '</div>';
  }

  if (matched.length === 0 && unmatched.length === 0) {
    html += '<div style="color: #718096;">No morphs to sync</div>';
  }

  html += '</div>';
  return html;
}
