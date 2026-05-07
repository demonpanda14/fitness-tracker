const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = path.join(__dirname, 'data');
const SESSIONS_DIR = path.join(__dirname, 'sessions');

app.get('/api/today', (req, res) => {
  const weeklyPlan = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'weekly_plan.json')));
  const liftProgram = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'lift_program.json')));
  const intervalProgram = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'interval_program.json')));

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  const todayPlan = weeklyPlan.schedule.find(d => d.day === today);

  let sessionDetail = null;
  if (todayPlan?.session_type === 'lower_lift') sessionDetail = liftProgram.lower;
  if (todayPlan?.session_type === 'upper_lift') sessionDetail = liftProgram.upper;
  if (todayPlan?.session_type === 'intervals') {
    const start = new Date('2026-05-07');
    const now = new Date();
    const weekNum = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000)) + 1;
    sessionDetail = intervalProgram.weeks.find(w => w.week === weekNum) || intervalProgram.weeks[0];
  }

  res.json({ day: today, plan: todayPlan, detail: sessionDetail });
});

app.get('/api/progress', (req, res) => {
  const sessions = fs.readdirSync(SESSIONS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(SESSIONS_DIR, f))))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const upperSessions = sessions.filter(s => s.session_type === 'upper_lift');
  const intervalSessions = sessions.filter(s => s.session_type === 'intervals');

  const pullupProgress = upperSessions.map(s => ({
    date: s.date,
    kg: s.results?.lat_pulldown_top_set_kg || null
  })).filter(p => p.kg);

  const paceProgress = intervalSessions.map(s => ({
    date: s.date,
    pace: s.session?.target_pace_per_rep || null,
    grade: s.execution_grade || null
  })).filter(p => p.pace);

  res.json({ pullupProgress, paceProgress, sessions });
});

app.get('/api/sessions', (req, res) => {
  const sessions = fs.readdirSync(SESSIONS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => ({ file: f, ...JSON.parse(fs.readFileSync(path.join(SESSIONS_DIR, f))) }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(sessions);
});

app.post('/api/sessions', (req, res) => {
  const session = req.body;
  if (!session.date || !session.session_type) {
    return res.status(400).json({ error: 'date and session_type are required' });
  }
  const filename = `${session.date}_${session.session_type}.json`;
  fs.writeFileSync(path.join(SESSIONS_DIR, filename), JSON.stringify(session, null, 2));
  res.json({ ok: true, filename });
});

app.get('/api/program', (req, res) => {
  const intervalProgram = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'interval_program.json')));
  res.json(intervalProgram);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Fitness tracker running at http://localhost:${PORT}`));
