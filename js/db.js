/* ============================================
   IIT Delhi Academic Pulse — Database Module
   ============================================ */

const DB = {
  // Global backend for cross-device sync
  CLOUD_URL: "https://script.google.com/macros/s/AKfycbzdxvXWDbXhKqG3i_82hcvCDecXY2sFZ73b2RlG_GdZ7yaQAwaz1CCaDZ-wDxvQmgoEbQ/exec", 
  
  init() {
    if (!localStorage.getItem('pulse_engagements')) {
      // Seed with initial demo data
      localStorage.setItem('pulse_engagements', JSON.stringify([
        { id: 'eng_1', type: 'medical', title: 'Dr. Sameer Khurana — Internal Med', subtitle: 'Tomorrow at 10:30 AM · IITD Hospital', icon: 'event', color: 'error', status: 'Upcoming' },
        { id: 'eng_2', type: 'sports', title: 'Tennis Court 2 — Evening Slot', subtitle: 'Today at 06:00 PM · Sports Complex', icon: 'sports_tennis', color: 'secondary', status: 'Confirmed' }
      ]));
    }
    if (!localStorage.getItem('pulse_issues')) {
      localStorage.setItem('pulse_issues', JSON.stringify([
        { id: 'iss_1', status: 'In Progress', title: 'Hostel Wi-Fi Connectivity', subtitle: 'Reported 2 hours ago. Tech assigned.' }
      ]));
    }
  },

  getEngagements() {
    return JSON.parse(localStorage.getItem('pulse_engagements')) || [];
  },

  getIssues() {
    return JSON.parse(localStorage.getItem('pulse_issues')) || [];
  },

  async syncToCloud() {
    if (!this.CLOUD_URL) return;
    const payload = JSON.stringify({
      engagements: this.getEngagements(),
      issues: this.getIssues(),
      lastUpdated: Date.now()
    });
    try {
      await fetch(this.CLOUD_URL, {
        method: 'POST', body: JSON.stringify({ payload })
      });
    } catch(e) { console.warn('Cloud sync failed'); }
  },

  async syncFromCloud() {
    if (!this.CLOUD_URL) return;
    try {
      const response = await fetch(this.CLOUD_URL);
      const data = await response.json();
      
      if (data.engagements) localStorage.setItem('pulse_engagements', JSON.stringify(data.engagements));
      if (data.issues) localStorage.setItem('pulse_issues', JSON.stringify(data.issues));
      
      // If the dashboard is open, trigger a silent re-render automatically!
      if (typeof window.updateDashboard === 'function') {
        window.updateDashboard();
      }
    } catch(e) { console.warn('Cloud pull failed'); }
  },

  addEngagement(type, title, subtitle, icon = 'event', color = 'primary') {
    const list = this.getEngagements();
    list.unshift({ id: 'eng_' + Date.now(), type, title, subtitle, icon, color, status: 'Confirmed' });
    localStorage.setItem('pulse_engagements', JSON.stringify(list));
    this.syncToCloud();
  },

  removeEngagement(id) {
    let list = this.getEngagements();
    list = list.filter(e => e.id !== id);
    localStorage.setItem('pulse_engagements', JSON.stringify(list));
    this.syncToCloud();
  },

  addIssue(title, subtitle) {
    const list = this.getIssues();
    list.unshift({ id: 'iss_' + Date.now(), status: 'In Progress', title, subtitle });
    localStorage.setItem('pulse_issues', JSON.stringify(list));
    this.syncToCloud();
  },

  removeIssue(id) {
    let list = this.getIssues();
    list = list.filter(e => e.id !== id);
    localStorage.setItem('pulse_issues', JSON.stringify(list));
    this.syncToCloud();
  }
};

DB.init();

// Automatically pull from cloud on startup to sync immediately across devices!
if (DB.CLOUD_URL) {
  document.addEventListener('DOMContentLoaded', () => {
    DB.syncFromCloud();
  });
}
