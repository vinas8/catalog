/**
 * Import Manager
 * Orchestrates import pipeline: cleanup -> validate -> import -> assign
 */
export class ImportManager {
  constructor() {
    this.source = null;
    this.destination = null;
    this.validatedData = null;
    this.logs = [];
  }

  setSource(source) {
    this.source = source;
    this.log('info', `Source set: ${source.getMetadata().name}`);
  }

  setDestination(destination) {
    this.destination = destination;
    this.log('info', `Destination set: ${destination.getMetadata().name}`);
  }

  async cleanup() {
    if (!this.destination) {
      throw new Error('Destination not set');
    }

    this.log('info', '🧹 Cleaning up existing data...');
    const result = await this.destination.clear();
    
    if (result.success) {
      this.log('success', `✅ Cleanup complete: ${result.deleted} items deleted`);
    } else {
      this.log('warning', `⚠️ Cleanup skipped: ${result.error || 'Not supported'}`);
    }

    return result;
  }

  async validate(rawData) {
    if (!this.source) {
      throw new Error('Source not set');
    }

    this.log('info', '🔍 Validating data...');
    const result = await this.source.validate(rawData);

    if (result.valid) {
      this.validatedData = result.data;
      this.log('success', `✅ Validation passed: ${result.data.length} snakes`);
    } else {
      this.log('error', `❌ Validation failed:`);
      result.errors.forEach(err => this.log('error', `   • ${err}`));
    }

    return result;
  }

  async import() {
    if (!this.validatedData) {
      throw new Error('Data not validated. Run validate() first.');
    }

    if (!this.destination) {
      throw new Error('Destination not set');
    }

    this.log('info', `📥 Importing ${this.validatedData.length} snakes...`);
    const result = await this.destination.write(this.validatedData);

    if (result.success) {
      this.log('success', `✅ Import complete: ${result.written}/${result.total || result.written} written`);
      if (result.results) {
        result.results.forEach(r => {
          if (r.success) {
            this.log('success', `   ✅ ${r.name}`);
          } else {
            this.log('error', `   ❌ ${r.name}: ${r.error}`);
          }
        });
      }
    } else {
      this.log('error', `❌ Import failed`);
      if (result.errors) {
        result.errors.forEach(err => this.log('error', `   • ${err}`));
      }
    }

    return result;
  }

  async assignSnakes(snakeIds, userId) {
    this.log('info', `👤 Assigning ${snakeIds.length} snake(s) to user ${userId}...`);

    const assignments = [];
    const errors = [];

    for (const snakeId of snakeIds) {
      try {
        const snake = await this._getSnake(snakeId);
        
        if (snake.owner && snake.owner !== userId) {
          errors.push(`${snake.name} already assigned to user ${snake.owner}`);
          this.log('warning', `⚠️ ${snake.name} already owned by ${snake.owner}`);
          continue;
        }

        if (snake.owner === userId) {
          this.log('info', `ℹ️ ${snake.name} already assigned to ${userId}`);
          continue;
        }

        await this._assignSnake(snakeId, userId);
        assignments.push({ snakeId, name: snake.name, userId });
        this.log('success', `✅ Assigned ${snake.name} to ${userId}`);

      } catch (err) {
        errors.push(`Failed to assign ${snakeId}: ${err.message}`);
        this.log('error', `❌ Failed to assign ${snakeId}: ${err.message}`);
      }
    }

    return {
      success: errors.length === 0,
      assigned: assignments.length,
      total: snakeIds.length,
      assignments,
      errors
    };
  }

  async runPipeline(rawData, options = {}) {
    const { cleanup = true, assign = false, userId = null, snakeIds = [] } = options;

    try {
      if (cleanup) {
        await this.cleanup();
      }

      const validation = await this.validate(rawData);
      if (!validation.valid) {
        return { success: false, stage: 'validate', errors: validation.errors };
      }

      const importResult = await this.import();
      if (!importResult.success) {
        return { success: false, stage: 'import', errors: importResult.errors };
      }

      let assignResult = null;
      if (assign && userId && snakeIds.length > 0) {
        assignResult = await this.assignSnakes(snakeIds, userId);
      }

      this.log('success', '🎉 Pipeline complete!');

      return {
        success: true,
        validation,
        import: importResult,
        assignment: assignResult
      };

    } catch (err) {
      this.log('error', `💥 Pipeline failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  log(type, message) {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.push({ type, message, timestamp });
  }

  async _getSnake(snakeId) {
    return {
      id: snakeId,
      name: 'Snake ' + snakeId,
      owner: null,
      status: 'available'
    };
  }

  async _assignSnake(snakeId, userId) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
