/* ============================================
   IIT Delhi Academic Pulse — Database Module
   ============================================ */

const DB = {
  // To sync across devices, user will add backend URL here later
  CLOUD_URL: null, 
  
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

  addEngagement(type, title, subtitle, icon = 'event', color = 'primary') {
    const list = this.getEngagements();
    list.unshift({ id: 'eng_' + Date.now(), type, title, subtitle, icon, color, status: 'Confirmed' });
    localStorage.setItem('pulse_engagements', JSON.stringify(list));
    
    // Attempt cloud sync if configured
    if (this.CLOUD_URL) {
      fetch(this.CLOUD_URL + '?action=addBooking', {
        method: 'POST', body: JSON.stringify({ user: Session.getUser(), type, title, subtitle })
      }).catch(e => console.warn('Cloud sync failed'));
    }
  },

  removeEngagement(id) {
    let list = this.getEngagements();
    list = list.filter(e => e.id !== id);
    localStorage.setItem('pulse_engagements', JSON.stringify(list));
  },

  addIssue(title, subtitle) {
    const list = this.getIssues();
    list.unshift({ id: 'iss_' + Date.now(), status: 'In Progress', title, subtitle });
    localStorage.setItem('pulse_issues', JSON.stringify(list));
    
    // Attempt cloud sync if configured
    if (this.CLOUD_URL) {
      fetch(this.CLOUD_URL + '?action=addIssue', {
        method: 'POST', body: JSON.stringify({ user: Session.getUser(), title, subtitle })
      }).catch(e => console.warn('Cloud sync failed'));
    }
  },

  removeIssue(id) {
    let list = this.getIssues();
    list = list.filter(e => e.id !== id);
    localStorage.setItem('pulse_issues', JSON.stringify(list));
  }
};

DB.init();
