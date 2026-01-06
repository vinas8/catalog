# 🎬 Demo System Implementation Plan - v0.7.7

**Created:** 2026-01-06  
**SMRI Module:** S6 (Demo/Presentation)  
**Target Version:** 0.7.7  
**Total Scenarios:** 8

---

## 📋 SMRI Scenarios Registered

### S6.1,4,5.01 - Demo Pipeline: Website Owner Setup
**Description:** CSV import → Stripe products → KV sync → Live shop  
**Components:**
- CSV parser & validator
- Stripe batch product creation
- KV CRUD operations
- Catalog verification

**Steps:**
1. Clear all KV namespaces
2. Import CSV (24 snakes)
3. Create Stripe products (batch API)
4. Sync Stripe → KV (PRODUCTS_REAL)
5. Set prices & payment links
6. Verify catalog.html shows all products

**Tools:** KV Manager, CSV import, Stripe API

---

### S6.1,2,3,4,5.02 - Demo Pipeline: Customer Purchase
**Description:** Browse → Checkout → Webhook → Collection → Farm  
**Components:**
- Catalog browsing
- Stripe checkout flow
- Webhook processing
- User product assignment
- Game initialization

**Steps:**
1. Browse catalog.html
2. Select snake (filter by species)
3. Click "Buy Now" → Stripe checkout
4. Complete payment (test card)
5. Webhook processes purchase
6. success.html shows snake
7. Game loads with owned snake

**Tools:** Catalog, Stripe Checkout, Worker Webhook, Game

---

### S6.2,5.03 - Demo Pipeline: Farm Gameplay
**Description:** Snake care → Tutorial → Stats tracking  
**Components:**
- Snake state management
- Care actions (feed, water, clean)
- Tutorial system
- Time-based decay

**Steps:**
1. View snake initial state
2. Feed snake (hunger increases)
3. Tutorial popup appears
4. 24h simulation (stats decay)
5. Care again (health maintained)
6. 48h simulation (warning)
7. Collection view (multi-snake)

**Tools:** Game engine, Tutorial system, Stats display

---

### S6.5.04 - Demo Pipeline: Data Management
**Description:** Backend CRUD for Stripe, KV, localStorage  
**Components:**
- KV Manager UI
- Stripe operations
- User management
- Cache system

**Steps:**
1. KV Manager: List all namespaces
2. View/edit key-value pairs
3. Stripe: List products, update prices
4. User Manager: View purchases
5. Cache: Test performance (19s → 10ms)
6. Sync operations (Stripe ↔ KV ↔ localStorage)

**Tools:** KV Manager, Stripe API, Cache debugger

---

### S6.1,2,3,4,5.05 - Demo Orchestrator: Step Execution
**Description:** Core engine for running demo pipelines  
**Components:**
- Step execution engine
- API call wrapper
- Error handling
- State management

**Implementation:**
```javascript
class DemoOrchestrator {
  constructor(pipeline) {
    this.pipeline = pipeline;
    this.currentStep = 0;
    this.state = {};
  }
  
  async executeStep(step) {
    // Execute step based on type
    switch(step.type) {
      case 'api-call':
        return await this.apiCall(step);
      case 'file-upload':
        return await this.fileUpload(step);
      case 'ui-interaction':
        return await this.uiInteraction(step);
    }
  }
  
  async apiCall(step) {
    const response = await fetch(step.url, {
      method: step.method,
      body: JSON.stringify(step.body)
    });
    return response.json();
  }
}
```

**Tools:** Fetch API, State machine, Error boundary

---

### S6.6.06 - Demo UI: Progress Tracking
**Description:** Visual progress bar and step indicators  
**Components:**
- Progress bar
- Step counter
- Time estimates
- Completion status

**Implementation:**
```javascript
class ProgressTracker {
  constructor(totalSteps) {
    this.totalSteps = totalSteps;
    this.currentStep = 0;
  }
  
  update(step) {
    this.currentStep = step;
    const percent = (step / this.totalSteps) * 100;
    document.getElementById('progressBar').style.width = `${percent}%`;
    document.getElementById('stepCounter').textContent = 
      `Step ${step} of ${this.totalSteps}`;
  }
}
```

**UI Elements:**
- Progress bar (0-100%)
- Step indicator (2 of 5)
- Estimated time remaining
- Status icons (✅ ⏳ ❌)

---

### S6.6.07 - Demo UI: Auto-advance Control
**Description:** Automatic progression with speed control  
**Components:**
- Auto-advance toggle
- Speed selector (0.5x, 1x, 2x, 5x)
- Pause/resume
- Manual navigation

**Implementation:**
```javascript
class AutoAdvance {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.enabled = true;
    this.speed = 1.0;
    this.timer = null;
  }
  
  start() {
    if (!this.enabled) return;
    
    this.timer = setTimeout(() => {
      this.orchestrator.nextStep();
      this.start();
    }, 3000 / this.speed);
  }
  
  pause() {
    clearTimeout(this.timer);
  }
  
  setSpeed(speed) {
    this.speed = speed;
    if (this.timer) {
      this.pause();
      this.start();
    }
  }
}
```

**Controls:**
- Toggle: ON/OFF
- Speed: 0.5x, 1x, 2x, 5x
- Buttons: ◄ Prev | ⏸ Pause | Next ►

---

### S6.6.08 - Demo UI: Checkpoint Save/Restore
**Description:** Save demo state at any step, restore later  
**Components:**
- State serialization
- localStorage persistence
- Restore UI
- Checkpoint list

**Implementation:**
```javascript
class CheckpointSystem {
  save(name) {
    const checkpoint = {
      name,
      timestamp: Date.now(),
      pipeline: this.orchestrator.pipeline.id,
      step: this.orchestrator.currentStep,
      state: this.orchestrator.state
    };
    
    const checkpoints = JSON.parse(
      localStorage.getItem('demo_checkpoints') || '[]'
    );
    checkpoints.push(checkpoint);
    localStorage.setItem('demo_checkpoints', 
      JSON.stringify(checkpoints));
  }
  
  restore(checkpoint) {
    this.orchestrator.currentStep = checkpoint.step;
    this.orchestrator.state = checkpoint.state;
    this.orchestrator.resume();
  }
  
  list() {
    return JSON.parse(
      localStorage.getItem('demo_checkpoints') || '[]'
    );
  }
}
```

**Features:**
- Auto-checkpoint every 3 steps
- Manual checkpoint (button)
- List saved checkpoints
- Quick restore

---

## 🏗️ File Structure

```
debug/
├── demo-orchestrator.html          # Main UI (S6.1,2,3,4,5.05 + S6.6.06,07,08)
├── demo-engine.js                  # Step execution engine
├── demo-ui.js                      # Progress, controls, checkpoints
├── pipelines/
│   ├── owner-setup.js              # S6.1,4,5.01
│   ├── customer-purchase.js        # S6.1,2,3,4,5.02
│   ├── farm-gameplay.js            # S6.2,5.03
│   └── data-management.js          # S6.5.04
└── demo-styles.css                 # Presentation styling
```

---

## 🎯 Implementation Phases

### Phase 1: Core Engine (2-3 hours)
**SMRI:** S6.1,2,3,4,5.05
- [ ] Create `demo-engine.js`
- [ ] Implement step executor
- [ ] Add API call handler
- [ ] Add error handling
- [ ] Test with simple pipeline

### Phase 2: UI Components (2-3 hours)
**SMRI:** S6.6.06, S6.6.07, S6.6.08
- [ ] Create `demo-ui.js`
- [ ] Build progress tracker
- [ ] Implement auto-advance
- [ ] Add checkpoint system
- [ ] Test all controls

### Phase 3: Pipeline 1 - Owner Setup (3-4 hours)
**SMRI:** S6.1,4,5.01
- [ ] Define pipeline steps
- [ ] CSV import integration
- [ ] Stripe product creation
- [ ] KV sync operations
- [ ] End-to-end test

### Phase 4: Pipeline 2 - Customer Purchase (3-4 hours)
**SMRI:** S6.1,2,3,4,5.02
- [ ] Define pipeline steps
- [ ] Catalog browsing
- [ ] Stripe checkout simulation
- [ ] Webhook processing
- [ ] Game initialization

### Phase 5: Pipelines 3 & 4 (2-3 hours each)
**SMRI:** S6.2,5.03, S6.5.04
- [ ] Farm Gameplay pipeline
- [ ] Data Management pipeline
- [ ] Integration testing

### Phase 6: Polish & Documentation (2-3 hours)
- [ ] UI polish (animations, styling)
- [ ] Error messages
- [ ] Keyboard shortcuts
- [ ] User guide
- [ ] Video recording

**Total Time:** 14-22 hours (~2-3 days)

---

## 🧪 Testing Checklist

### Engine Tests
- [ ] Step execution (all types)
- [ ] Error handling
- [ ] State management
- [ ] API calls

### UI Tests
- [ ] Progress updates correctly
- [ ] Auto-advance timing
- [ ] Speed control works
- [ ] Checkpoints save/restore

### Pipeline Tests
- [ ] Owner Setup (end-to-end)
- [ ] Customer Purchase (end-to-end)
- [ ] Farm Gameplay (end-to-end)
- [ ] Data Management (end-to-end)

### Integration Tests
- [ ] All pipelines from demo UI
- [ ] Checkpoint restore mid-pipeline
- [ ] Error recovery
- [ ] Mobile responsive

---

## 📊 Success Metrics

- ✅ All 8 S6 scenarios = 100% done
- ✅ All 4 pipelines execute without errors
- ✅ Auto-advance works smoothly
- ✅ Checkpoints save/restore correctly
- ✅ Demo can be presented to owner
- ✅ Clear path to v0.8.0 requirements

---

## 🚀 Next Steps

1. **Review this plan** - Approve scope
2. **Start Phase 1** - Build demo-engine.js
3. **Iterate daily** - Update done % in version.js
4. **Present demo** - Show to website owner
5. **Plan v0.8.0** - Gather requirements

---

**Status:** 📋 Planning Complete  
**Ready to implement:** ✅  
**First task:** Create demo-orchestrator.html skeleton
