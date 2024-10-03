/* End goal: 
  Preference (1.4): If possible, make removed tasks re-locate dynamically.
  Preference (1.3): If possible, fit in NON-mandatory tasks (readings) if has space.
  Preference (1.2): If possible, spread tasks out for free days, as long as has space.
  Preference (1.1): If fit in and still has room, alternate.
  Base (1.0): Greedily fit in as much MANDATORY work as possible, warn about impossible tasks.
*/

function createGreedySchedule() {
  /* Version 1.0 - Greedy, naive */

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("⚙️");

  // 1. Get counter variables
  const taskCount = sheet.getRange(2, 1).getValue();
  const oldDaysCount = sheet.getRange(4, 1).getValue();
  const oldTaskCount = sheet.getRange(6, 1).getValue();

  const startScheduleCol = 10;
  const startScheduleRow = 2;
  const startTaskRow = 2;
  const startTaskCol = 2;

  // 2. Wipe old schedule
  if (oldDaysCount > 0 && oldTaskCount > 0)
    sheet.getRange(startScheduleRow-1, startScheduleCol, 1+oldTaskCount, oldDaysCount).clearContent();

  // Reset counters
  if (taskCount == 0) {
    // Wipe and Reset only.
    sheet.getRange(4, 1).setValue(0);
    sheet.getRange(6, 1).setValue(0);
    return; 
  }

  // Get user schedule (Available hours each day)
  const userWeeklySchedule = configSheet.getRange(2, 1, 1, 7).getValues();

  // Get mandatory-only tickets (Name, _, (Pts), Len, Due) (Pts > 0, Sorted by Due desc & Pts desc) (Note: Array index = Id)
  let taskList = new Array();
  let range = sheet.getRange(startTaskRow, startTaskCol, taskCount, 5).getValues();

  //remove all pts == 0
  for (let i = range.length-1; i > 0; i--) {
    if (range[i][2] > 0)
      taskList.push([range[i][0], range[i][2], range[i][3], range[i][4]]);
  }

  //sort by Pts desc
  taskList.sort((a, b) => b[1] - a[1]);
  //sort by Due desc
  taskList.sort((a, b) => b[3] - a[3]);

  //sheet.getRange(2, 10, taskList.length, 4).setValues(taskList);


  // Result: ScheduleArr is initialized with 1 week. (Append = Append front because we're traveling backwards)
  let finalSchedule = [];
  let hoursInWeek = [].concat(userWeeklySchedule);
  let currWeek = new Array(7).fill([]);
  let maxCount = new Array(7).fill(0);
  let dayIndex = 6; // Start at Saturday, work backwards.

  // Travel backwards, first task = latest due date.
  for (let i = taskList.length-1; i > 0; i--) {
    let taskLen = taskList[i][2];
    // SpreadsheetApp.getUi().alert(taskLen);
    while (taskLen > 0) {

      // OOB Check.
      if (dayIndex < 0) {
        // Add another week. Reset all variables.
        finalSchedule.push(currWeek);
        // SpreadsheetApp.getUi().alert(currWeek);
        hoursInWeek = [].concat(userWeeklySchedule);
        currWeek = new Array(7).fill([]);
        dayIndex = 6;
      }

      // If no hours available (no work possible), just move on.
      if (hoursInWeek[dayIndex] == 0) {
        dayIndex--;
      }
      else {
        // Task time and available time "cancel" each other out.
        origTaskLen = taskLen;
        taskLen -= hoursInWeek[dayIndex];

        // Add task (**with time).
        currWeek[dayIndex].push(`(${origTaskLen - taskLen} hrs) ${taskList[i][0]}`);

        // There is still extra available time (for next task)          
        if (taskLen < 0) {
          hoursInWeek[dayIndex] -= origTaskLen;
        }
      }
    }
  }

  finalSchedule.push(currWeek);
  // SpreadsheetApp.getUi().alert(currWeek);

  // Make into schedule (GetSchedule 2.0)
  finalSchedule.reverse();

  sheet.getRange(2, 10, finalSchedule.length, 7).setValues(finalSchedule);
}
