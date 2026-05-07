# Tawan's Fitness Tracker

Personal fitness tracking system for a 105kg athlete training for:
1. **First unassisted pull-up** (2026 goal)
2. **Sub-70 min 10K** at Asics META Time Trials Thailand 2026 (Sun Aug 16, 2026, Bangkok)
3. **Improved golf performance** (driver clubhead speed ~95mph)

## Project Goals

Build a personal training tracker that:
- Logs weekly sessions (lifts, runs, golf)
- Tracks pull-up progression (lat pulldown weight as proxy metric)
- Tracks 10K race-prep interval pace progression
- Tracks running shoe rotation/mileage
- Generates weekly summaries and PNGs (transparent bg, white text)
- Surfaces autoregulation insights (RPE, fatigue, recovery)

## Project Structure

```
fitness-tracker/
├── README.md                    # This file
├── data/
│   ├── profile.json             # Personal stats, goals, constraints
│   ├── weekly_plan.json         # Repeating weekly schedule
│   ├── interval_program.json    # 15-week sub-70 10K plan
│   ├── lift_program.json        # Lower + Upper session templates
│   ├── shoes.json               # Running shoe rotation rules
│   ├── golf_equipment.json      # Iron specs, modifications
│   └── pace_zones.json          # Training pace targets
└── sessions/
    └── 2026-05-01_upper.json    # Example logged session
    └── 2026-05-04_lower.json
    └── 2026-05-07_intervals.json
```

## Suggested First Build (for Claude Code)

A simple CLI or local web app that:
1. Shows today's planned session (pulled from `weekly_plan.json` + program files)
2. Lets user log completed session (sets/reps/weight, or run pace/distance/HR)
3. Auto-saves to `sessions/YYYY-MM-DD_<type>.json`
4. Computes pull-up progress % (current top pulldown / 85kg target)
5. Computes interval pace trajectory toward 6:50/km race pace
6. Generates weekly summary PNG matching the format used in chat (transparent, white text)

## Key Constraints / Principles

- **Mobile-first**: tracker used during workouts, simple input
- **Autoregulation > rigid prescription**: planned weights are guides, log actual
- **Deload every 4th week** is non-negotiable
- **Pace before time** for runs (race pace 6:50/km is the anchor)
- **Posterior chain durability** is the bottleneck — track for warning signs

## Data Source

All data exported from a Claude.ai conversation on May 7, 2026.
