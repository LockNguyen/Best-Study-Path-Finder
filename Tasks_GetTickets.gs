/* Sorts tickets in "📚" by due date, then by points */

function tasks_getTickets() {

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // 1. Get user's requested date range
  const lowerDate = sheet.getRange(2, 27).getValue();
  const upperDate = sheet.getRange(2, 32).getValue();

  // 2. Hard-coded task lists to draw from
  const startRow = 7;
  const numRows = 50;
  const numTicketListRows = 200;               
  const cols = [3, 9, 15, 21];

  // 3. Add tasks to 'ticketList' if meets 2 criteria:
    // module enabled && due_date in [lowerDate, upperDate]
      // ? Append
      // : Break

  let ticketList = new Array();

  // Cycle through 4 classes...
  for (col of cols)             
  {
    // (I) Only add tasks if the module is enabled.
    if (sheet.getRange(4, col+3).getValue() == false)
      continue;

    // Get module name.
    const moduleName = sheet.getRange(4, col-1).getValue();

    // Get all module tasks.
    let data = sheet.getRange(startRow, col, numRows, 4).getValues();

    for (let i = 0; i < numRows; ++i)
    {
      const dueDate = data[i][3];
      
      // (II) Only add task if the dueDate is in bound.
      if (dueDate == "") break;
      if (dueDate > upperDate) break;
      if (dueDate < lowerDate) continue;
      
      ticketList.push([moduleName+": "+data[i][0], null, data[i][1], data[i][2], dueDate]);
        // [ticketName, _, points, task duration, dueDate]
    }
  }

  // 4. Sort 'ticketList' by due date
  ticketList.sort(byDueDate);
  
  // 5. Output 'ticketList' onto sheet
  const taskCount = ticketList.length;
  if (taskCount > 0)
    sheet.getRange(4, 28, taskCount, 5).setValues(ticketList);

  // SpreadsheetApp.getUi().alert(`Successfully queried ${taskCount} tasks.`);
  
  // 6. Clear potential old tickets on sheet
  sheet.getRange(4+taskCount, 28, numTicketListRows-taskCount, 5).clearContent();
}