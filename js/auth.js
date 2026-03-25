/* ============================================
   IIT Delhi Academic Pulse — Auth Module
   ============================================ */

const Auth = {
  MAX_ATTEMPTS_SOFT: 3,
  MAX_ATTEMPTS_HARD: 5,
  LOCKOUT_SOFT: 30,      // seconds
  LOCKOUT_HARD: 300,     // 5 minutes
  STORAGE_KEY: 'pulse_auth_state',

  getState() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || { attempts: 0, lockUntil: 0 };
    } catch { return { attempts: 0, lockUntil: 0 }; }
  },

  setState(state) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  },

  isLocked() {
    const state = this.getState();
    if (state.lockUntil && Date.now() < state.lockUntil) {
      return Math.ceil((state.lockUntil - Date.now()) / 1000);
    }
    if (state.lockUntil && Date.now() >= state.lockUntil) {
      this.setState({ attempts: 0, lockUntil: 0 });
    }
    return false;
  },

  recordFailedAttempt() {
    const state = this.getState();
    state.attempts++;
    if (state.attempts >= this.MAX_ATTEMPTS_HARD) {
      state.lockUntil = Date.now() + this.LOCKOUT_HARD * 1000;
      this.setState(state);
      return { locked: true, duration: this.LOCKOUT_HARD, message: 'Too many failed attempts. Account locked for 5 minutes.' };
    }
    if (state.attempts >= this.MAX_ATTEMPTS_SOFT) {
      state.lockUntil = Date.now() + this.LOCKOUT_SOFT * 1000;
      this.setState(state);
      return { locked: true, duration: this.LOCKOUT_SOFT, message: 'Multiple failed attempts detected. Please wait 30 seconds.' };
    }
    this.setState(state);
    return { locked: false, attemptsLeft: this.MAX_ATTEMPTS_SOFT - state.attempts };
  },

  resetAttempts() {
    this.setState({ attempts: 0, lockUntil: 0 });
  },

  validateEmail(email, allowedDomains) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return { valid: false, message: 'Please enter a valid email address.' };
    const domain = email.split('@')[1].toLowerCase();
    if (allowedDomains && allowedDomains.length > 0) {
      const isAllowed = allowedDomains.some(d => domain === d || domain.endsWith('.' + d));
      if (!isAllowed) return { valid: false, message: 'Please use your official IIT Delhi email address.' };
    }
    return { valid: true };
  },

  // Demo credentials for testing
  DEMO_STUDENT: { email: 'student@iitd.ac.in', password: 'pulse2024', name: 'Arnav Kumar', rollNo: '2023CS10452', role: 'student' },
  DEMO_STAFF: {
    medical: { email: 'doctor@iitd.ac.in', password: 'pulse2024', name: 'Dr. Aryan Sharma', role: 'staff', department: 'medical' },
    sports: { email: 'sports@iitd.ac.in', password: 'pulse2024', name: 'Ravi Prakash', role: 'staff', department: 'sports' },
    campuscare: { email: 'care@iitd.ac.in', password: 'pulse2024', name: 'Priya Verma', role: 'staff', department: 'campuscare' }
  },

  attemptStudentLogin(email, password) {
    if (email === this.DEMO_STUDENT.email && password === this.DEMO_STUDENT.password) {
      this.resetAttempts();
      Session.login(this.DEMO_STUDENT);
      return { success: true, user: this.DEMO_STUDENT };
    }
    // For demo: any @iitd.ac.in email with password 'pulse2024' works
    const validation = this.validateEmail(email, ['iitd.ac.in']);
    if (validation.valid && password === 'pulse2024') {
      const user = { email, password: '', name: email.split('@')[0].replace('.', ' '), rollNo: '2023XX10000', role: 'student' };
      this.resetAttempts();
      Session.login(user);
      return { success: true, user };
    }
    return { success: false, ...this.recordFailedAttempt() };
  },

  attemptStaffLogin(email, password, department) {
    const demoStaff = this.DEMO_STAFF[department];
    if (demoStaff && email === demoStaff.email && password === demoStaff.password) {
      this.resetAttempts();
      Session.login(demoStaff);
      return { success: true, user: demoStaff };
    }
    if (password === 'pulse2024' && email.includes('@')) {
      const user = { email, name: email.split('@')[0], role: 'staff', department };
      this.resetAttempts();
      Session.login(user);
      return { success: true, user };
    }
    return { success: false, ...this.recordFailedAttempt() };
  }
};

// ---- Lockout Timer UI ----
function startLockoutCountdown(seconds, onTick, onEnd) {
  let remaining = seconds;
  const interval = setInterval(() => {
    remaining--;
    if (onTick) onTick(remaining);
    if (remaining <= 0) {
      clearInterval(interval);
      if (onEnd) onEnd();
    }
  }, 1000);
  return interval;
}

function formatCountdown(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `0:${s.toString().padStart(2, '0')}`;
}
