// backend/PulseDB.gs
// Instructions:
// 1. Go to script.google.com and open your existing project.
// 2. Paste this updated code.
// 3. Deploy > Manage Deployments > Edit (pencil icon) > New Version > Deploy.
// 4. Your GitHub site will now securely have full remote control over the database schema.

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Overwrite Cell A1 tightly with the entire GitHub database JSON block
    sheet.getRange(1, 1).setValue(data.payload);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }));
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }));
  }
}

function doGet() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    // Return precisely the entire JSON payload to the GitHub site
    const payload = sheet.getRange(1, 1).getValue();
    
    return ContentService.createTextOutput(payload || JSON.stringify({ engagements: [], issues: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
