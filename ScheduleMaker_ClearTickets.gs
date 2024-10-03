/* Clear all tickets in "⌚"*/

function scheduleMaker_clearTickets() {

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const oldDaysCount = sheet.getRange(4, 1).getValue();
  const oldTicketCount = sheet.getRange(6, 1).getValue();

  const startScheduleCol = 9;
  const startScheduleRow = 2;

  const startTicketRow = 2;
  const startTicketCol = 2;
  const numTicketCols = 6;

  // 1. Wipe old schedule
  if (oldDaysCount > 0 && oldTicketCount > 0) // avoid 'range <= 0' error
    sheet.getRange(startScheduleRow-1, startScheduleCol, 1+oldTicketCount, oldDaysCount).clearContent();

  // 2. Wipe old ticket list
  sheet.getRange(startTicketRow, startTicketCol, oldTicketCount, numTicketCols).clearContent();

  // 3. Reset 'OldDaysCount' & 'OldTicketCount'
  sheet.getRange(4, 1).setValue(0);
  sheet.getRange(6, 1).setValue(0);
}