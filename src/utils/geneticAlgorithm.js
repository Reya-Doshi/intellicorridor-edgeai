// JavaScript implementation of Genetic Algorithm from backend/algo.py
// Preserves the Webster-based delay fitness function & crossover/mutation logic

export function fitnessFunction(cycleTime, greenTime, congestionRatio, capacity = 20) {
  const g = greenTime;
  const C = cycleTime;
  const x = Math.max(0.01, Math.min(0.99, congestionRatio));
  const c = capacity;

  // d1 delay component
  const a = Math.pow(1 - (g / C), 2);
  const p = Math.max(0.01, 1 - ((g / C) * x));
  const d1i = (0.38 * C * a) / p;

  // d2 delay component (queue shockwave)
  const a2 = 173 * Math.pow(x, 2);
  const insideSqrt = (x - 1) + Math.pow(x - 1, 2) + ((16 * x) / c);
  const ri1 = Math.sqrt(Math.max(0.001, insideSqrt));
  const d2i = a2 * ri1;

  return d1i + d2i;
}

export function runGeneticOptimizer(cars = [14, 28, 12, 10], cycleTime = 148, popSize = 60, generations = 20) {
  const numLights = 4;
  const greenMin = 10;
  const greenMax = 60;
  const roadCapacity = [20, 20, 20, 20];

  const roadCongestion = roadCapacity.map((cap, i) => {
    const remaining = Math.max(1, cap - (cars[i] || 10));
    return remaining / cap;
  });

  // Initialize Population
  let population = [];
  for (let i = 0; i < popSize; i++) {
    const greenTimes = [
      Math.floor(Math.random() * (greenMax - greenMin + 1)) + greenMin,
      Math.floor(Math.random() * (greenMax - greenMin + 1)) + greenMin,
      Math.floor(Math.random() * (greenMax - greenMin + 1)) + greenMin,
      Math.floor(Math.random() * (greenMax - greenMin + 1)) + greenMin
    ];

    const totalGreen = greenTimes.reduce((a, b) => a + b, 0);
    if (totalGreen <= cycleTime) {
      let totalDelay = 0;
      for (let j = 0; j < numLights; j++) {
        totalDelay += fitnessFunction(cycleTime, greenTimes[j], roadCongestion[j], roadCapacity[j]);
      }
      population.push({ greenTimes, delay: totalDelay });
    }
  }

  // If population is sparse, fill with default proportional times
  if (population.length === 0) {
    const totalCars = cars.reduce((a, b) => a + b, 0) || 1;
    const baseGreen = cars.map(c => Math.max(greenMin, Math.min(greenMax, Math.round((c / totalCars) * (cycleTime - 20)))));
    population.push({ greenTimes: baseGreen, delay: 120 });
  }

  // Sort by delay
  population.sort((a, b) => a.delay - b.delay);

  // Run generations
  for (let gen = 0; gen < generations; gen++) {
    const newPop = [...population.slice(0, Math.floor(popSize / 2))];

    while (newPop.length < popSize) {
      // Selection
      const p1 = population[Math.floor(Math.random() * (population.length / 2))];
      const p2 = population[Math.floor(Math.random() * (population.length / 2))];

      // Crossover
      const point = Math.floor(Math.random() * 3) + 1;
      const childGreen = [
        ...p1.greenTimes.slice(0, point),
        ...p2.greenTimes.slice(point)
      ];

      // Mutation
      if (Math.random() < 0.15) {
        const mIdx = Math.floor(Math.random() * numLights);
        childGreen[mIdx] = Math.max(greenMin, Math.min(greenMax, childGreen[mIdx] + (Math.random() > 0.5 ? 4 : -4)));
      }

      const totalG = childGreen.reduce((a, b) => a + b, 0);
      if (totalG <= cycleTime) {
        let childDelay = 0;
        for (let j = 0; j < numLights; j++) {
          childDelay += fitnessFunction(cycleTime, childGreen[j], roadCongestion[j], roadCapacity[j]);
        }
        newPop.push({ greenTimes: childGreen, delay: childDelay });
      }
    }

    population = newPop.sort((a, b) => a.delay - b.delay);
  }

  const best = population[0];
  return {
    north: best.greenTimes[0],
    south: best.greenTimes[1],
    west: best.greenTimes[2],
    east: best.greenTimes[3],
    totalDelay: Math.round(best.delay * 10) / 10
  };
}
