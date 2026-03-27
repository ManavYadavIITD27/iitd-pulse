// backend/PulseDB.gs

function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const lock = LockService.getScriptLock();
    
    // Protect against overlap: queues simultaneous bookings logically so no data is ever lost
    lock.waitLock(3000); 
    
    // Read current overarching database state
    let dbString = sheet.getRange(1, 1).getValue();
    let db = dbString ? JSON.parse(dbString) : {};

    const action = request.action;      // 'INSERT', 'UPDATE', 'DELETE'
    const table = request.table;        // e.g., 'engagements', 'users', 'auth'
    const payload = request.payload;    // The JSON data

    // Dynamically generate new tables if the GitHub code invents them in the future!
    if (table && !db[table]) {
      db[table] = [];
    }

    if (action === 'INSERT') {
      db[table].push(payload);
    } 
    else if (action === 'UPDATE') {
      const index = db[table].findIndex(item => item.id === payload.id);
      if (index !== -1) db[table][index] = { ...db[table][index], ...payload };
    } 
    else if (action === 'DELETE') {
      db[table] = db[table].filter(item => item.id !== payload.id);
    }
    else if (action === 'OVERWRITE') {
      db = payload;
    }

    // Save strictly structured data back to the sheet
    sheet.getRange(1, 1).setValue(JSON.stringify(db));
    
    lock.releaseLock();
    return ContentService.createTextOutput(JSON.stringify({ success: true, action, table }));

  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }));
  }
}

function doGet() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const dbString = sheet.getRange(1, 1).getValue();
    return ContentService.createTextOutput(dbString || "{}").setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput("{}").setMimeType(ContentService.MimeType.JSON);
  }
}
