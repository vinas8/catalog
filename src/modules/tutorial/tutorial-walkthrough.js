/**
 * Tutorial Walkthrough System
 * Progressive step-by-step guide with levels
 */

export class TutorialWalkthrough {
  constructor(userId) {
    this.userId = userId;
    this.currentLevel = 1;
    this.currentStep = 0;
    this.completedSteps = [];
    this.loadProgress();
  }

  /**
   * Load tutorial progress from localStorage
   */
  loadProgress() {
    try {
      const saved = localStorage.getItem(`tutorial_progress_${this.userId}`);
      if (saved) {
        const data = JSON.parse(saved);
        this.currentLevel = data.level || 1;
        this.currentStep = data.step || 0;
        this.completedSteps = data.completed || [];
      }
    } catch (error) {
      console.warn('Failed to load tutorial progress:', error);
    }
  }

  /**
   * Save tutorial progress
   */
  saveProgress() {
    try {
      const data = {
        level: this.currentLevel,
        step: this.currentStep,
        completed: this.completedSteps,
        updated: new Date().toISOString()
      };
      localStorage.setItem(`tutorial_progress_${this.userId}`, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save tutorial progress:', error);
    }
  }

  /**
   * Get all tutorial levels and steps
   */
  getTutorialLevels() {
    return [
      {
        level: 1,
        title: 'Welcome to Snake Care',
        description: 'Learn the basics of caring for your snakes',
        steps: [
          {
            id: 'welcome',
            title: '👋 Welcome to Serpent Town!',
            content: `
              <p><strong>Your snake care journey begins!</strong></p>
              <p>This tutorial will guide you through caring for your snakes step by step.</p>
              <div class="tutorial-goals">
                <h4>What you'll learn:</h4>
                <ul>
                  <li>✅ How to view your snake collection</li>
                  <li>✅ Feeding and watering basics</li>
                  <li>✅ Keeping enclosures clean</li>
                  <li>✅ Monitoring health stats</li>
                </ul>
              </div>
            `,
            action: 'Click "Next Step" to continue',
            highlight: null
          },
          {
            id: 'view_collection',
            title: '🐍 Your Snake Collection',
            content: `
              <p>Below you can see all your snakes. Each card shows:</p>
              <ul>
                <li><strong>Name</strong> - Your snake's nickname</li>
                <li><strong>Species & Morph</strong> - What type of snake</li>
                <li><strong>Stats</strong> - Hunger, water, health levels</li>
              </ul>
              <p class="tutorial-tip">💡 <em>Tip: Keep all stats above 50% for healthy snakes!</em></p>
            `,
            action: 'Look at your snake cards below',
            highlight: '#snake-collection'
          },
          {
            id: 'feed_snake',
            title: '🍖 Feeding Your Snakes',
            content: `
              <p>Click the <strong>Feed</strong> button on any snake card to feed them.</p>
              <p>Snakes need food to stay healthy. The hunger stat shows when they need feeding:</p>
              <ul>
                <li>🟢 <strong>80-100%</strong> - Well fed</li>
                <li>🟡 <strong>50-79%</strong> - Getting hungry</li>
                <li>🔴 <strong>Below 50%</strong> - Needs food!</li>
              </ul>
            `,
            action: 'Try feeding one of your snakes',
            highlight: '.snake-card'
          },
          {
            id: 'water_snake',
            title: '💧 Providing Fresh Water',
            content: `
              <p>Click the <strong>Water</strong> button to give your snakes fresh water.</p>
              <p>Hydration is crucial for snakes:</p>
              <ul>
                <li>Helps with shedding</li>
                <li>Supports digestion</li>
                <li>Prevents dehydration</li>
              </ul>
              <p class="tutorial-tip">💡 <em>Always keep water bowls clean and full!</em></p>
            `,
            action: 'Try watering one of your snakes',
            highlight: '.snake-card'
          },
          {
            id: 'clean_enclosure',
            title: '🧹 Keeping Enclosures Clean',
            content: `
              <p>Click the <strong>Clean</strong> button to clean the enclosure.</p>
              <p>A clean habitat prevents:</p>
              <ul>
                <li>🦠 Bacterial infections</li>
                <li>🤢 Respiratory issues</li>
                <li>😰 Stress and discomfort</li>
              </ul>
              <p><strong>Clean regularly for happy, healthy snakes!</strong></p>
            `,
            action: 'Try cleaning an enclosure',
            highlight: '.snake-card'
          }
        ]
      },
      {
        level: 2,
        title: 'Daily Care Routine',
        description: 'Establish healthy habits for your snakes',
        steps: [
          {
            id: 'daily_checkin',
            title: '📅 Daily Check-ins',
            content: `
              <p>Check your snakes <strong>once per day</strong> to:</p>
              <ul>
                <li>Monitor all stats (hunger, water, health)</li>
                <li>Feed if hunger is below 80%</li>
                <li>Refill water if below 80%</li>
                <li>Clean if cleanliness is low</li>
              </ul>
              <p class="tutorial-success">🎉 <strong>Great work!</strong> You've completed Level 1!</p>
            `,
            action: 'Complete to unlock more features',
            highlight: null
          }
        ]
      }
    ];
  }

  /**
   * Get current tutorial step
   */
  getCurrentStep() {
    const levels = this.getTutorialLevels();
    const currentLevel = levels.find(l => l.level === this.currentLevel);
    if (!currentLevel) return null;
    
    return {
      level: currentLevel,
      step: currentLevel.steps[this.currentStep],
      progress: {
        currentStep: this.currentStep + 1,
        totalSteps: currentLevel.steps.length,
        level: this.currentLevel
      }
    };
  }

  /**
   * Check if tutorial is complete
   */
  isComplete() {
    const levels = this.getTutorialLevels();
    return this.currentLevel > levels.length;
  }

  /**
   * Mark current step as complete and move to next
   */
  completeStep() {
    const current = this.getCurrentStep();
    if (!current) return false;

    const stepId = `${this.currentLevel}_${current.step.id}`;
    if (!this.completedSteps.includes(stepId)) {
      this.completedSteps.push(stepId);
    }

    // Move to next step
    const totalSteps = current.level.steps.length;
    this.currentStep++;

    // If reached end of level, move to next level
    if (this.currentStep >= totalSteps) {
      this.currentLevel++;
      this.currentStep = 0;
    }

    this.saveProgress();
    return true;
  }

  /**
   * Skip tutorial
   */
  skipTutorial() {
    const levels = this.getTutorialLevels();
    this.currentLevel = levels.length + 1;
    this.saveProgress();
  }

  /**
   * Render tutorial card
   */
  renderTutorialCard() {
    if (this.isComplete()) return '';

    const current = this.getCurrentStep();
    if (!current) return '';

    const { level, step, progress } = current;

    return `
      <div class="tutorial-card" data-step="${step.id}">
        <div class="tutorial-header">
          <div class="tutorial-badge">
            Level ${progress.level} • Step ${progress.currentStep}/${progress.totalSteps}
          </div>
          <button class="tutorial-skip" onclick="window.tutorial.skipTutorial(); location.reload();">
            Skip Tutorial
          </button>
        </div>
        
        <div class="tutorial-progress-bar">
          <div class="tutorial-progress-fill" style="width: ${(progress.currentStep / progress.totalSteps) * 100}%"></div>
        </div>

        <div class="tutorial-content">
          <h3>${step.title}</h3>
          ${step.content}
        </div>

        <div class="tutorial-footer">
          <div class="tutorial-action">
            <span class="tutorial-action-icon">👉</span>
            <span>${step.action}</span>
          </div>
          <button class="btn btn-tutorial" onclick="window.tutorial.nextStep()">
            ${progress.currentStep < progress.totalSteps ? 'Next Step →' : 'Complete Level! 🎉'}
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Move to next step
   */
  nextStep() {
    const wasLastStep = this.getCurrentStep().progress.currentStep === this.getCurrentStep().progress.totalSteps;
    
    this.completeStep();
    
    // Reload to show next step
    const container = document.getElementById('tutorial-container');
    if (container) {
      if (this.isComplete()) {
        container.innerHTML = `
          <div class="tutorial-complete">
            <div class="tutorial-complete-icon">🎉</div>
            <h2>Tutorial Complete!</h2>
            <p>You're now ready to care for your snakes like a pro!</p>
            <button class="btn btn-primary" onclick="document.getElementById('tutorial-container').style.display='none'">
              Start Playing
            </button>
          </div>
        `;
      } else {
        container.innerHTML = this.renderTutorialCard();
        
        // Highlight element if specified
        const current = this.getCurrentStep();
        if (current && current.step.highlight) {
          this.highlightElement(current.step.highlight);
        }
      }
    }
  }

  /**
   * Highlight an element on the page
   */
  highlightElement(selector) {
    // Remove previous highlights
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });

    // Add new highlight
    setTimeout(() => {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.add('tutorial-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  }
}

// Export for global access
if (typeof window !== 'undefined') {
  window.TutorialWalkthrough = TutorialWalkthrough;
}

export default TutorialWalkthrough;
