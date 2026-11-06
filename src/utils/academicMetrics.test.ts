import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseDurationToMinutes,
  formatDurationMinutes,
  calculateCompletionRate,
  calculateFocusStreak,
  calculateStudyGoalProgress,
} from './academicMetrics';

test('parseDurationToMinutes parses hours and minutes accurately', () => {
  assert.equal(parseDurationToMinutes('1h 30m'), 90);
  assert.equal(parseDurationToMinutes('2h'), 120);
  assert.equal(parseDurationToMinutes('45m'), 45);
  assert.equal(parseDurationToMinutes('60'), 60);
  assert.equal(parseDurationToMinutes('invalid'), 30);
});

test('formatDurationMinutes formats minutes into readable strings', () => {
  assert.equal(formatDurationMinutes(90), '1h 30m');
  assert.equal(formatDurationMinutes(120), '2h');
  assert.equal(formatDurationMinutes(45), '45m');
  assert.equal(formatDurationMinutes(0), '0m');
});

test('calculateCompletionRate computes percentage of completed tasks', () => {
  assert.equal(calculateCompletionRate([]), 0);
  assert.equal(
    calculateCompletionRate([{ completed: true }, { completed: false }, { completed: true }, { completed: true }]),
    75
  );
});

test('calculateFocusStreak counts consecutive days of study logs', () => {
  const refDate = new Date('2026-11-05T12:00:00');
  const logs = [
    { date: '2026-11-05' },
    { date: '2026-11-04' },
    { date: '2026-11-03' },
    { date: '2026-11-01' },
  ];
  assert.equal(calculateFocusStreak(logs, refDate), 3);
});

test('calculateStudyGoalProgress caps at 100% and computes daily progress', () => {
  const logs = [
    { date: '2026-11-05', durationMinutes: 90 },
    { date: '2026-11-05', durationMinutes: 30 },
    { date: '2026-11-04', durationMinutes: 120 },
  ];
  assert.equal(calculateStudyGoalProgress(logs, 4, '2026-11-05'), 50);
  assert.equal(calculateStudyGoalProgress(logs, 1.5, '2026-11-05'), 100);
});
