import { ActivityLog, Task } from '../types';

export function parseDurationToMinutes(input: string): number {
  const dur = input.trim().toLowerCase();
  if (!dur) return 0;

  let minutes = 0;
  const hourMatch = dur.match(/(\d+)\s*h/);
  const minMatch = dur.match(/(\d+)\s*m/);

  if (hourMatch) minutes += parseInt(hourMatch[1], 10) * 60;
  if (minMatch) minutes += parseInt(minMatch[1], 10);

  if (!hourMatch && !minMatch) {
    const parsed = parseInt(dur, 10);
    minutes = isNaN(parsed) || parsed <= 0 ? 30 : parsed;
  }

  return minutes;
}

export function formatDurationMinutes(totalMinutes: number): string {
  const safeMins = Math.max(0, Math.round(totalMinutes));
  const h = Math.floor(safeMins / 60);
  const m = safeMins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export function calculateCompletionRate(tasks: Pick<Task, 'completed'>[]): number {
  if (tasks.length === 0) return 0;
  const completedCount = tasks.filter((t) => t.completed).length;
  return Math.round((completedCount / tasks.length) * 100);
}

export function calculateFocusStreak(
  activities: Pick<ActivityLog, 'date' | 'createdAt'>[],
  referenceDate: Date = new Date()
): number {
  if (activities.length === 0) return 0;

  const activityDates = new Set<string>();
  activities.forEach((act) => {
    if (act.date) {
      activityDates.add(act.date);
    } else if (act.createdAt) {
      activityDates.add(act.createdAt.split('T')[0]);
    }
  });

  const sortedDates = Array.from(activityDates).sort((a, b) => b.localeCompare(a));
  if (sortedDates.length === 0) return 0;

  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const mostRecentDate = new Date(sortedDates[0] + 'T00:00:00');
  if (mostRecentDate < yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i - 1] + 'T00:00:00');
    const prev = new Date(sortedDates[i] + 'T00:00:00');
    const diffDays = Math.round((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function calculateStudyGoalProgress(
  activities: Pick<ActivityLog, 'date' | 'createdAt' | 'durationMinutes'>[],
  dailyGoalHours: number,
  todayStr: string = new Date().toISOString().split('T')[0]
): number {
  const todayMinutes = activities
    .filter((act) => {
      const actDate = act.date || (act.createdAt ? act.createdAt.split('T')[0] : '');
      return actDate === todayStr;
    })
    .reduce((acc, act) => acc + (act.durationMinutes || 0), 0);

  const goalHours = dailyGoalHours > 0 ? dailyGoalHours : 4;
  const goalMinutes = goalHours * 60;
  return Math.min(100, Math.round((todayMinutes / goalMinutes) * 100));
}
