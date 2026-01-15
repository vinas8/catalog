import { IImportSource } from '../IImportSource.js';

/**
 * CSV Import Source
 * Handles CSV file/text parsing and validation
 */
export class CSVSource extends IImportSource {
  constructor() {
    super();
    this.data = null;
  }

  async validate(rawData) {
    const errors = [];
    
    try {
      const text = typeof rawData === 'string' ? rawData : await this._readFile(rawData);
      const lines = text.trim().split('\n').filter(l => l.trim());
      
      if (lines.length === 0) {
        return { valid: false, errors: ['CSV is empty'] };
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const requiredHeaders = ['Name', 'Morph', 'Gender', 'YOB'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        errors.push(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      const snakes = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((h, idx) => row[h] = values[idx] || '');
        
        const rowErrors = this._validateRow(row, i + 1);
        if (rowErrors.length > 0) {
          errors.push(...rowErrors);
        } else {
          snakes.push(this._normalizeSnake(row));
        }
      }

      if (errors.length > 0) {
        return { valid: false, errors };
      }

      this.data = snakes;
      return { valid: true, data: snakes };
      
    } catch (err) {
      return { valid: false, errors: [err.message] };
    }
  }

  async read() {
    if (!this.data) {
      throw new Error('Must validate() before read()');
    }
    return this.data;
  }

  getMetadata() {
    return {
      name: 'CSV Source',
      type: 'csv',
      description: 'Import from CSV file or text'
    };
  }

  _validateRow(row, lineNum) {
    const errors = [];
    
    if (!row.Name || row.Name.trim() === '') {
      errors.push(`Line ${lineNum}: Name is required`);
    }
    
    if (!row.Morph || row.Morph.trim() === '') {
      errors.push(`Line ${lineNum}: Morph is required`);
    }
    
    if (!['Male', 'Female', 'Unknown'].includes(row.Gender)) {
      errors.push(`Line ${lineNum}: Gender must be Male, Female, or Unknown`);
    }
    
    const yob = parseInt(row.YOB);
    const currentYear = new Date().getFullYear();
    if (isNaN(yob) || yob < 1990 || yob > currentYear) {
      errors.push(`Line ${lineNum}: YOB must be between 1990 and ${currentYear}`);
    }
    
    return errors;
  }

  _normalizeSnake(row) {
    const morph = row.Morph || '';
    const species = (morph.includes('Corn') || morph.includes('Salmon') || morph.includes('Opal')) 
      ? 'corn_snake' 
      : 'ball_python';

    return {
      id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID for demo
      name: row.Name.trim(),
      morph: row.Morph.trim(),
      gender: row.Gender,
      yob: parseInt(row.YOB),
      weight: row.Weight ? parseFloat(row.Weight) : null,
      price: row.Price ? parseFloat(row.Price) : null,
      species: row.Species?.trim() || species,
      owner: null,
      status: 'available',
      active: true // Match Stripe product format
    };
  }

  async _readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
}
