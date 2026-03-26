/* ===================================================================
   IITD Pulse — Demo Data & Notification Simulator
   Central data store + SMS/Email notification simulation
   =================================================================== */

const DemoData = {
  // ── Current logged-in student ──
  student: {
    name: 'Manav Yadav',
    roll: '2024CS10284',
    email: 'manav.yadav27@dmsiitd.org',
    phone: '+91 98765 43210',
    hostel: 'Nilgiri Hostel, Room 312'
  },

  // ── Hospital / Medical ──
  doctors: [
    { name: 'Dr. Sameer Khurana', specialty: 'General Physician', available: ['10:00 AM', '11:30 AM', '2:00 PM'], avatar: 'SK', status: 'available' },
    { name: 'Dr. Anita Sharma', specialty: 'Dermatologist', available: ['9:00 AM', '3:30 PM'], avatar: 'AS', status: 'available' },
    { name: 'Dr. Rajendra Verma', specialty: 'Orthopedic', available: ['11:00 AM', '4:00 PM'], avatar: 'RV', status: 'busy' },
    { name: 'Dr. Priya Singh', specialty: 'Psychiatrist', available: ['10:30 AM', '1:00 PM', '3:00 PM'], avatar: 'PS', status: 'available' }
  ],

  pastAppointments: [
    { doctor: 'Dr. Sameer Khurana', date: 'Mar 18, 2026', type: 'General Checkup', prescription: 'Paracetamol 500mg, Vitamin C', status: 'completed' },
    { doctor: 'Dr. Anita Sharma', date: 'Feb 24, 2026', type: 'Skin Consultation', prescription: 'Clindamycin Gel, Sunscreen SPF 50', status: 'completed' }
  ],

  // ── Sports Facility ──
  sportsSlots: {
    football: [
      { time: '5:30 – 7:00 PM', status: 'available', booked: 8, capacity: 22 },
      { time: '7:00 – 8:30 PM', status: 'full', booked: 22, capacity: 22 }
    ],
    badminton: [
      { time: '6:00 – 7:00 PM', court: 'Court #1', status: 'available' },
      { time: '6:00 – 7:00 PM', court: 'Court #2', status: 'booked' },
      { time: '7:00 – 8:00 PM', court: 'Court #1', status: 'available' },
      { time: '7:00 – 8:00 PM', court: 'Court #3', status: 'available' }
    ],
    gym: [
      { time: '6:00 – 7:30 AM', status: 'available', occupancy: '12/30' },
      { time: '5:00 – 6:30 PM', status: 'available', occupancy: '25/30' },
      { time: '7:00 – 8:30 PM', status: 'full', occupancy: '30/30' }
    ],
    pool: [
      { time: '7:00 – 8:00 AM', lane: 'Lane 1-3', status: 'available' },
      { time: '6:00 – 7:00 PM', lane: 'Lane 1-3', status: 'available' }
    ]
  },

  equipment: [
    { name: 'Football', total: 5, rented: 3, icon: 'sports_soccer' },
    { name: 'Tennis Racket', total: 12, rented: 4, icon: 'sports_tennis' },
    { name: 'TT Bat', total: 8, rented: 6, icon: 'table_rows' },
    { name: 'Yoga Mat', total: 15, rented: 2, icon: 'self_improvement' }
  ],

  // ── Campus Care Complaints ──
  complaints: [
    { id: '#8842', title: 'Water Leakage — Nilgiri 3rd Floor Washroom', dept: 'Plumbing', date: 'Mar 25, 2026', status: 'in-progress', priority: 'medium', description: 'Continuous water dripping from ceiling pipe in the 3rd floor washroom near room 312.' },
    { id: '#8838', title: 'Corridor Lights — Nilgiri Wing B', dept: 'Electrical', date: 'Mar 22, 2026', status: 'resolved', priority: 'high', description: 'All corridor lights in Wing B 2nd floor non-functional at night.' },
    { id: '#8830', title: 'Broken Window Latch — Room 312', dept: 'Civil', date: 'Mar 15, 2026', status: 'resolved', priority: 'low', description: 'Window latch broken, cannot close properly during rain.' }
  ],

  // ── Active Engagements (Hub) ──
  activeEngagements: [
    { type: 'medical', icon: 'medical_services', title: 'Follow-up with Dr. Khurana', detail: 'Tomorrow, 10:00 AM', color: 'primary' },
    { type: 'sports', icon: 'sports_kabaddi', title: 'Badminton Court #1', detail: 'Today, 6:00 PM', color: 'secondary' },
    { type: 'complaint', icon: 'campaign', title: 'Ticket #8842 — In Progress', detail: 'Plumbing team assigned', color: 'tertiary' }
  ]
};

/* ===================================================================
   Notification Simulator — SMS & Email Previews
   =================================================================== */

const NotifSim = {
  _overlay: null,

  _createOverlay() {
    if (this._overlay) return this._overlay;
    const overlay = document.createElement('div');
    overlay.id = 'notif-sim-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s ease;pointer-events:none;backdrop-filter:blur(4px);';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) this.close(); });
    this._overlay = overlay;
    return overlay;
  },

  show(type, { to, subject, body }) {
    const overlay = this._createOverlay();
    const isSMS = type === 'sms';
    const phone = to || DemoData.student.phone;
    const email = to || DemoData.student.email;

    const card = document.createElement('div');
    card.style.cssText = 'max-width:420px;width:90%;border-radius:24px;overflow:hidden;box-shadow:0 25px 80px rgba(0,0,0,0.3);transform:scale(0.9);transition:transform .3s ease;';

    if (isSMS) {
      card.innerHTML = `
        <div style="background:#1a1a2e;color:white;padding:20px 24px;display:flex;align-items:center;gap:12px;">
          <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#00629d,#00a2fd);display:flex;align-items:center;justify-content:center;">
            <span class="material-symbols-outlined" style="color:white;font-size:20px;">sms</span>
          </div>
          <div>
            <div style="font-size:12px;opacity:0.6;text-transform:uppercase;letter-spacing:2px;">SMS Preview</div>
            <div style="font-weight:700;font-family:Manrope,sans-serif;">IITD Pulse</div>
          </div>
          <div style="margin-left:auto;font-size:11px;opacity:0.4;">Just now</div>
        </div>
        <div style="background:#0f0f23;color:white;padding:24px;">
          <div style="font-size:11px;opacity:0.5;margin-bottom:8px;">To: ${phone}</div>
          <div style="background:#1e1e3a;border-radius:16px;padding:16px;font-size:14px;line-height:1.6;border-left:3px solid #00629d;">
            ${body}
          </div>
          <div style="margin-top:16px;text-align:center;font-size:11px;opacity:0.3;">— Simulated notification for demo purposes —</div>
        </div>
      `;
    } else {
      card.innerHTML = `
        <div style="background:white;padding:20px 24px;border-bottom:1px solid #eee;display:flex;align-items:center;gap:12px;">
          <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#570000,#800000);display:flex;align-items:center;justify-content:center;">
            <span class="material-symbols-outlined" style="color:white;font-size:20px;">mail</span>
          </div>
          <div>
            <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:2px;">Email Preview</div>
            <div style="font-weight:700;font-family:Manrope,sans-serif;color:#191c1e;">IITD Pulse Notifications</div>
          </div>
        </div>
        <div style="background:white;padding:24px;">
          <div style="font-size:12px;color:#888;margin-bottom:4px;">To: ${email}</div>
          <div style="font-size:12px;color:#888;margin-bottom:16px;">Subject: <strong style="color:#191c1e;">${subject}</strong></div>
          <div style="background:#f7f9fb;border-radius:12px;padding:20px;font-size:14px;line-height:1.7;color:#333;border-left:3px solid #570000;">
            ${body}
          </div>
          <div style="margin-top:16px;text-align:center;font-size:11px;color:#bbb;">— Simulated notification for demo purposes —</div>
        </div>
      `;
    }

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = 'position:absolute;top:12px;right:16px;background:none;border:none;color:rgba(255,255,255,0.7);font-size:20px;cursor:pointer;z-index:10;';
    closeBtn.onclick = () => this.close();

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;';
    wrapper.appendChild(closeBtn);
    wrapper.appendChild(card);

    overlay.innerHTML = '';
    overlay.appendChild(wrapper);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
      card.style.transform = 'scale(1)';
    });

    // Auto-close after 6 seconds
    this._timer = setTimeout(() => this.close(), 6000);
  },

  close() {
    if (this._timer) clearTimeout(this._timer);
    if (this._overlay) {
      this._overlay.style.opacity = '0';
      this._overlay.style.pointerEvents = 'none';
    }
  },

  // Convenience methods
  sendAppointmentConfirmation(doctorName, time) {
    if (typeof DB !== 'undefined') {
      DB.addEngagement('medical', doctorName, 'Tomorrow at ' + time + ' · IITD Hospital', 'event', 'error');
    }
    Toast.show('Appointment confirmed! SMS & Email sent.', 'success');
    setTimeout(() => {
      this.show('sms', {
        subject: 'Appointment Confirmed',
        body: `✅ <strong>Appointment Confirmed</strong><br><br>Doctor: ${doctorName}<br>Time: ${time}<br>Location: IIT Delhi Health Centre<br><br>Please carry your ID card. Arrive 5 min early.<br><br>— IITD Pulse`
      });
    }, 800);
  },

  sendBookingConfirmation(facility, slot) {
    Toast.show('Booking confirmed! Notification sent.', 'success');
    setTimeout(() => {
      this.show('email', {
        subject: `Sports Booking Confirmed — ${facility}`,
        body: `Dear ${DemoData.student.name},<br><br>Your booking has been confirmed:<br><br>🏟️ <strong>${facility}</strong><br>🕐 <strong>${slot}</strong><br>📍 IIT Delhi Sports Complex<br><br>Remember to bring your student ID and sports gear.<br><br>Best,<br>IITD Sports Cell`
      });
    }, 800);
  },

  sendComplaintUpdate(ticketId, status) {
    if (typeof DB !== 'undefined') {
       // Optional: Could update DB here if we track statuses
    }
    Toast.show(`Ticket ${ticketId} — ${status}`, 'success');
    setTimeout(() => {
      this.show('sms', {
        subject: `Ticket ${ticketId} Update`,
        body: `📋 <strong>Campus Care Update</strong><br><br>Ticket: ${ticketId}<br>Status: ${status}<br><br>Our team is working on your request. You will be notified on resolution.<br><br>— IITD Campus Care`
      });
    }, 800);
  },

  sendPrescriptionReady(patientName) {
    Toast.show(`Prescription dispensed! SMS sent to ${patientName}.`, 'success');
    setTimeout(() => {
      this.show('sms', {
        to: '+91 98765 XXXXX',
        subject: 'Prescription Ready',
        body: `💊 <strong>Prescription Ready for Pickup</strong><br><br>Dear ${patientName},<br><br>Your medicines have been dispensed at the IIT Delhi Pharmacy Counter.<br><br>Please collect within 48 hours with your student ID.<br><br>— IITD Health Centre`
      });
    }, 800);
  }
};
