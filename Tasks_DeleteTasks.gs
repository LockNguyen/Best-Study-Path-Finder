// Delete all contents associated with the deleted task due date
function tasks_deleteTask(sheet, col, startRow)
{
  const lastRow = 56;

  // Move all tasks below the deleted task up
  const rangeToMoveUp = sheet.getRange(startRow+1, col-3, lastRow-startRow, 4).getValues();
  sheet.getRange(startRow, col-3, lastRow-startRow, 4).setValues(rangeToMoveUp);
  
  // Delete the bottom row to get rid of duplicate residue (in the corner case when all 50 tasks are filled).
  sheet.getRange(lastRow, col-3, 1, 4).clearContent();
}