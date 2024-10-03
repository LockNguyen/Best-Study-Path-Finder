// This script contains helper functions for OnEditHandler.gs and sorting.

function isTriggerRange(changedCol, changedRow) {
  const triggerColumns = [6, 12, 18, 24];
  const rowUpperBound = 7;
  const rowLowerBound = 56;

  return triggerColumns.includes(changedCol) && rowUpperBound <= changedRow && changedRow <= rowLowerBound;
}

function isTriggerSheet(changedSheet) {
  return changedSheet.getSheetName() == "📚 Task List";
}

function byDueDate(elem1, elem2) {
  const a = elem1[4];
  const b = elem2[4];
  
  if (a == b) return 0;
  if (a < b) return -1;
  return 1;
}