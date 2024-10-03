/// This script detects changes in the Schedule 2.0 sheet and sorts/deletes the tasks.

function onEdit(detectedChange) {

  // Tests to check if the change should trigger this script.
  const changedCol = detectedChange.range.getColumn();
  const changedRow = detectedChange.range.getRow();
  if (!isTriggerRange(changedCol, changedRow))
    return;

  const changedSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (!isTriggerSheet(changedSheet))
    return;
  
  // Tests passed. The script is triggered.

  // Check if the value is deleted.
  const changedValue = detectedChange.range.getValue();
  if (changedValue == "")
    // Delete the entire task (shift lower tasks up).
    tasks_deleteTask(changedSheet, changedCol, changedRow);
  else
    // Re-sort the tasks.
    tasks_sortTasks(changedSheet, changedCol);
}