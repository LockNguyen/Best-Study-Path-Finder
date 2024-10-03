/* Sorts tickets in "⌚" by due date, then by points */

function scheduleMaker_sortTicketsByDatePoints(range) {

  //sort by Pts desc
  range.sort((a, b) => b[2] - a[2]);
  //sort by Due asc
  range.sort((a, b) => a[4] - b[4]);
  
  return range;
}