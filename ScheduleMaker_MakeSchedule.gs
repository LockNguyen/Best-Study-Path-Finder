function scheduleMaker_makeSchedule() {

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // 1. Get essential variables
  const ticketCount = sheet.getRange(2, 1).getValue();
  const startTicketRow = 2;
  const startTicketCol = 2;
  const numTicketCols = 6;
  const startScheduleCol = 9;
  const startScheduleRow = 2;
  const workBlockLen = 1.5;
  let divisions = [];

  // 2. Essential functions
  // Ticket: [TicketName, _, pts, len, due, space]
  let getTicket = (row) => tickets[row][0];
  let getLen = (row) => Number(tickets[row][3]);
  let getDueDate = (row) => tickets[row][4];
  let getNumSpace = (row) => Number(tickets[row][5]) + 1;
  let getNumDivisions = (row) => Number(divisions[row]);

  // 3. Get range
  let ticketsRange = sheet.getRange(startTicketRow, startTicketCol, ticketCount, numTicketCols);
  tickets = ticketsRange.getValues();

  // Clear everything
  scheduleMaker_clearTickets();

  // Sort range
  tickets = scheduleMaker_sortTicketsByDatePoints(tickets);

  // Set range
  ticketsRange.setValues(tickets);

  // 4. Calculate divisions for tickets
  for (let i = 0; i < tickets.length; ++i) {
    divisions.push(Math.ceil(getLen(i) / workBlockLen));
  }
  // SpreadsheetApp.getUi().alert(divisions);
  
  // 5. Calculate the schedule span (= maxDueDate - minDueDate)
  const minDueDate = getDueDate(0);
  const maxDueDate = getDueDate(tickets.length - 1);
  const daysCount = getDayDiff(maxDueDate, minDueDate) + 1;

  // 6. Create the new schedule
  sheet.getRange(startScheduleRow-1, startScheduleCol).setValue(minDueDate).activate().autoFill(sheet.getRange(startScheduleRow-1, startScheduleCol, 1, daysCount), SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);
  // sheet.getActiveRange().autoFill(sheet.getRange(startScheduleRow-1, startScheduleCol, 1, daysCount), SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);

  // Fill in shedule (ith-Position = due_date - daysBetweens * ith-Division)
  for (let row = 0; row < ticketCount; ++row)
  {
    // Find the position to print the final division
    let position = getDayDiff(getDueDate(row), minDueDate);

    // Print the final division (the actual due date)
    sheet.getRange(startScheduleRow+row, startScheduleCol+position).setValue(`${getTicket(row)}`);

    // Fill in divisions leading up to the final division
    numDivisions = getNumDivisions(row) - 1; // num divisions (excluding the final division)
    if (numDivisions > 0)
    {
      numSpace = getNumSpace(row);

      // Calculate max num divisions (avoid 'Too many divisions (OOB!)' error)
      numDivisionsMax = Math.floor(position / numSpace);
      if (numDivisionsMax < numDivisions) {
        sheet.getRange(startTicketRow+row, startTicketCol).setValue(`(Missing ${numDivisions - numDivisionsMax}) ${getTicket(row)}`);
        numDivisions = numDivisionsMax;
      } 

      // If no OOB error AND there's still space, try to expand to spread out tasks a bit!
      else if (numSpace == 1) {
        numDivisionsMax_tryExpand = Math.floor(position / (numSpace+1));
        if (numDivisionsMax_tryExpand >= numDivisions)
          numSpace++;
      }

      // Create divisions leading up to the final division
      for (let i = numDivisions; i > 0; --i)
      {
        position -= numSpace;
        sheet.getRange(startScheduleRow+row, startScheduleCol+position).setValue(`[${i}/${numDivisions+1}] ${getTicket(row)}`);
      }
    }
  }
  
  // 7. Update 'OldDaysCount' & 'OldTicketCount', done!
  sheet.getRange(4, 1).setValue(daysCount);
  sheet.getRange(6, 1).setValue(ticketCount);
}

function getDayDiff(a, b) 
{
  // Returns difference (in days) between day a and day b 
  return Math.floor((a.getTime() + (1000 * 60 * 60 * 1) - b.getTime()) / (1000 * 60 * 60 * 24));
}