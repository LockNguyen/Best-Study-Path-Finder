// Sort range
function tasks_sortTasks(sheet, col)
{
  const startRow = 7;
  const numRows = 50;

  var range = sheet.getRange(startRow, col-3, numRows, 4);
    // start_row, start_col, row_distance_covered, col_distance_covered

  range.sort({column: col, ascending: true}); 
    // sort by whatever column was changed
}