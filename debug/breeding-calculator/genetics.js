// ====================================
// GENETICS CALCULATIONS MODULE
// ====================================
// Phase 2 advanced genetics: CoI, heterozygosity, genetic diversity

import { getHealthRisk } from './data-loader.js';

// Calculate inbreeding coefficient (Wright's formula)
export function calculateInbreedingCoefficient(male, female, allSnakes) {
  let CoI = 0;
  
  // Get ancestors (5 generations)
  const maleAncestors = getAncestors(male, allSnakes, 5);
  const femaleAncestors = getAncestors(female, allSnakes, 5);
  
  // Find common ancestors
  const commonAncestors = maleAncestors.filter(mAnc => 
    femaleAncestors.some(fAnc => fAnc.id === mAnc.id)
  );
  
  // Calculate CoI contribution from each common ancestor
  commonAncestors.forEach(ancestor => {
    const n1 = getGenerationsTo(male, ancestor, allSnakes);
    const n2 = getGenerationsTo(female, ancestor, allSnakes);
    
    if (n1 > 0 && n2 > 0) {
      // Wright's formula: (1/2)^(n1+n2+1)
      CoI += Math.pow(0.5, n1 + n2 + 1);
    }
  });
  
  return CoI;
}

// Get all ancestors up to N generations
function getAncestors(snake, allSnakes, maxGen, currentGen = 0, visited = new Set()) {
  if (currentGen >= maxGen || !snake || visited.has(snake.id)) {
    return [];
  }
  
  visited.add(snake.id);
  let ancestors = [];
  
  if (snake.lineage) {
    const father = allSnakes.find(s => s.id === snake.lineage.parent_male_id);
    const mother = allSnakes.find(s => s.id === snake.lineage.parent_female_id);
    
    if (father) {
      ancestors.push(father);
      ancestors = ancestors.concat(getAncestors(father, allSnakes, maxGen, currentGen + 1, visited));
    }
    if (mother) {
      ancestors.push(mother);
      ancestors = ancestors.concat(getAncestors(mother, allSnakes, maxGen, currentGen + 1, visited));
    }
  }
  
  return ancestors;
}

// Calculate generations between snake and ancestor
function getGenerationsTo(snake, ancestor, allSnakes, depth = 0, visited = new Set()) {
  if (depth > 10 || visited.has(snake.id)) return -1;
  if (snake.id === ancestor.id) return 0;
  
  visited.add(snake.id);
  
  if (!snake.lineage) return -1;
  
  const father = allSnakes.find(s => s.id === snake.lineage.parent_male_id);
  const mother = allSnakes.find(s => s.id === snake.lineage.parent_female_id);
  
  let minGen = Infinity;
  
  if (father) {
    const fGen = getGenerationsTo(father, ancestor, allSnakes, depth + 1, visited);
    if (fGen >= 0) minGen = Math.min(minGen, fGen + 1);
  }
  
  if (mother) {
    const mGen = getGenerationsTo(mother, ancestor, allSnakes, depth + 1, visited);
    if (mGen >= 0) minGen = Math.min(minGen, mGen + 1);
  }
  
  return minGen === Infinity ? -1 : minGen;
}

// Calculate genetic diversity score
export function calculateGeneticDiversity(male, female) {
  if (!male.genetics || !female.genetics) return 0;
  
  const maleAlleles = new Set(Object.values(male.genetics.alleles || {}));
  const femaleAlleles = new Set(Object.values(female.genetics.alleles || {}));
  
  // Count unique alleles
  const uniqueAlleles = new Set([...maleAlleles, ...femaleAlleles]);
  const totalPossibleAlleles = Math.max(maleAlleles.size, femaleAlleles.size);
  
  if (totalPossibleAlleles === 0) return 0;
  
  return uniqueAlleles.size / (totalPossibleAlleles * 2);
}

// Calculate expected heterozygosity
export function calculateHeterozygosity(male, female) {
  if (!male.genetics?.alleles || !female.genetics?.alleles) return 0;
  
  const mAlleles = male.genetics.alleles;
  const fAlleles = female.genetics.alleles;
  const allGenes = new Set([...Object.keys(mAlleles), ...Object.keys(fAlleles)]);
  
  let hetCount = 0;
  let totalGenes = 0;
  
  allGenes.forEach(gene => {
    const mAllele = mAlleles[gene] || 'wt';
    const fAllele = fAlleles[gene] || 'wt';
    
    totalGenes++;
    
    // Offspring will be heterozygous if parents have different alleles
    if (mAllele !== fAllele) {
      hetCount++;
    }
  });
  
  return totalGenes > 0 ? hetCount / totalGenes : 0;
}

// Assess combined morph health risks
export function assessMorphHealthRisk(maleMorphs, femaleMorphs) {
  let severity = 'NONE';
  let reasons = [];
  
  maleMorphs.forEach(mMorph => {
    femaleMorphs.forEach(fMorph => {
      const healthData = getHealthRisk(mMorph);
      
      if (healthData) {
        if (healthData.avoidWith && healthData.avoidWith.includes(fMorph)) {
          severity = healthData.risk;
          reasons.push(`${mMorph} + ${fMorph}: ${healthData.issues.join(', ')}`);
        }
      }
    });
  });
  
  return { severity, reason: reasons.join('; ') };
}

// Calculate average offspring value
export function calculateAverageOffspringValue(outcomes) {
  if (!outcomes || outcomes.length === 0) return 0;
  
  let totalValue = 0;
  let totalCount = 0;
  
  outcomes.forEach(outcome => {
    totalValue += (outcome.value || 0) * (outcome.count || 1);
    totalCount += outcome.count || 1;
  });
  
  return totalCount > 0 ? totalValue / totalCount : 0;
}

// Check for rare morph production chance
export function calculateRareMorphChance(outcomes) {
  if (!outcomes || outcomes.length === 0) return 0;
  
  // Consider morphs with value >$400 as rare
  const rareMorphs = outcomes.filter(o => o.value > 400);
  
  return rareMorphs.reduce((sum, m) => sum + (m.percentage || 0), 0);
}
