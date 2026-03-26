// backend/PulseDB.gs
// Instructions:
// 1. Go to script.google.com and create a new project.
// 2. Paste this code.
// 3. Deploy > New Deployment > Web App (Execute as: Me, Access: Anyone).
// 4. Copy the Web App URL and paste it into js/db.js as CLOUD_URL.

function doPost(e) {
  try {
    const action = e.parameter.action;
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    if (action === 'addBooking') {
      sheet.appendRow([new Date(), data.user, data.type, data.title, data.subtitle]);
      return ContentService.createTextOutput(JSON.stringify({ success: true }));
    }
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }));
  }
}

function doGet() {
  return ContentService.createTextOutput("IITD Pulse Cloud Backend is Active");
}
