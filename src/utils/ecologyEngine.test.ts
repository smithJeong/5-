import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseNaturalLanguageScenario,
  calculateEcologicalRates,
  analyzeEcologyScenario,
} from './ecologyEngine';

test('parseNaturalLanguageScenario applies exact default values when inputs are missing', () => {
  const params = parseNaturalLanguageScenario('안녕 생태통로 분석해줘');
  assert.equal(params.rain, false, 'Default rain should be false');
  assert.equal(params.is_night, true, 'Default is_night should be true');
  assert.equal(params.car_speed_kmh, 60, 'Default car speed should be 60 km/h');
  assert.equal(params.lanes, 2, 'Default lanes should be 2');
  assert.equal(params.initial_population, 100, 'Default initial_population should be 100');
});

test('parseNaturalLanguageScenario correctly extracts environmental variables from text', () => {
  const text = '비 오는 날 밤 시속 80km 4차선 도로에서 두꺼비 250마리가 산란지로 이동할 때 위험도 분석';
  const params = parseNaturalLanguageScenario(text);
  assert.equal(params.rain, true);
  assert.equal(params.is_night, true);
  assert.equal(params.car_speed_kmh, 80);
  assert.equal(params.lanes, 4);
  assert.equal(params.initial_population, 250);
});

test('parseNaturalLanguageScenario detects daylight when explicitly specified', () => {
  const text = '맑은 대낮 오후 햇살 아래 3차선 도로 시속 50km 개체수 80마리';
  const params = parseNaturalLanguageScenario(text);
  assert.equal(params.is_night, false);
  assert.equal(params.rain, false);
  assert.equal(params.car_speed_kmh, 50);
  assert.equal(params.lanes, 3);
  assert.equal(params.initial_population, 80);
});

test('calculateEcologicalRates guarantees survival_rate_with_fence increases by at least 70%p', () => {
  // Test across multiple extreme combinations
  const testCases = [
    { is_night: true, rain: true, car_speed_kmh: 60, lanes: 2, initial_population: 100 },
    { is_night: true, rain: false, car_speed_kmh: 80, lanes: 4, initial_population: 200 },
    { is_night: false, rain: false, car_speed_kmh: 40, lanes: 1, initial_population: 50 },
    { is_night: true, rain: true, car_speed_kmh: 100, lanes: 6, initial_population: 500 },
  ];

  for (const params of testCases) {
    const results = calculateEcologicalRates(params);
    assert.ok(
      results.improvement_percentage >= 70.0,
      `Improvement ${results.improvement_percentage}%p must be >= 70.0%p for params: ${JSON.stringify(params)}`
    );
    assert.ok(
      results.survival_rate_with_fence > results.survival_rate_baseline,
      'Fence survival rate must be greater than baseline'
    );
    assert.ok(
      results.survival_rate_with_fence <= 100.0,
      'Survival rate cannot exceed 100%'
    );
    assert.ok(
      results.survival_rate_baseline >= 0.0,
      'Baseline cannot be negative'
    );
    // Exact delta check
    const diff = Number((results.survival_rate_with_fence - results.survival_rate_baseline).toFixed(1));
    assert.equal(results.improvement_percentage, diff);
  }
});

test('calculateEcologicalRates baseline mortality is higher when speed and lanes increase', () => {
  const lowRisk = calculateEcologicalRates({
    is_night: false,
    rain: false,
    car_speed_kmh: 30,
    lanes: 1,
    initial_population: 100,
  });

  const highRisk = calculateEcologicalRates({
    is_night: true,
    rain: true,
    car_speed_kmh: 90,
    lanes: 4,
    initial_population: 100,
  });

  assert.ok(
    highRisk.survival_rate_baseline < lowRisk.survival_rate_baseline,
    'High speed/multi-lane/rain should have lower baseline survival rate than low-speed single lane'
  );
});

test('analyzeEcologyScenario produces strictly compliant JSON structure', () => {
  const output = analyzeEcologyScenario('비 오는 밤 4차선 시속 70km 개체수 150마리');
  
  assert.ok(typeof output.scenario_summary === 'string');
  assert.ok(typeof output.parameters.is_night === 'boolean');
  assert.ok(typeof output.parameters.rain === 'boolean');
  assert.ok(typeof output.parameters.car_speed_kmh === 'number');
  assert.ok(typeof output.parameters.lanes === 'number');
  assert.ok(typeof output.parameters.initial_population === 'number');

  assert.ok(typeof output.simulation_results.survival_rate_baseline === 'number');
  assert.ok(typeof output.simulation_results.survival_rate_with_fence === 'number');
  assert.ok(typeof output.simulation_results.improvement_percentage === 'number');

  assert.ok(typeof output.policy_recommendation.target_location_recommendation === 'string');
  assert.ok(typeof output.policy_recommendation.structure_spec === 'string');
  assert.ok(typeof output.policy_recommendation.report_text === 'string');
});
