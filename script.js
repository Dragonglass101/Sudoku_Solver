// Creating table in html document
// document.write("<table class='tbl-initial'>");
// for (var a = 0; a < 9; a++) {
//   document.write("<tr>");
//   for (var b = 0; b < 9; b++) {
//     document.write(
//       `<td><input type='text' size='1' name='input${a}_${b}' onchange='Change(this)' placeholder='0'></td>`
//     );
//   }
//   document.write("</tr>");
// }
// document.write("</table>");

// var table = document.createElement("table");
// table.classList.add("tbl-initial");
// for (var i = 0; i < 9; i++) {
//   var tr = document.createElement("tr");
//   var td = [];
//   for (let j = 0; j < 9; j++){
//     td[j] = document.createElement("td");
//     var input = document.createElement("input");
//     input.id = `input_${i}_${j}`;
//     input.placeholder = "0";
    
//     var text1 = document.createTextNode("0");
//     td[j].appendChild(text1);

//     tr.appendChild(td[j]);
//   }
//   table.appendChild(tr);
// }
// document.body.appendChild(table);
var attempts = 0;

var rows = document.querySelector('.tbl-initial').rows;
for (var i = 0; i < rows.length; i++) {
  var row = rows[i];
  for (var j = 0; j < row.cells.length; j++) {
    var input = document.createElement('input');
    input.name = `input_${i}_${j}`;
    input.id = `input_${i}_${j}`;
    input.type = "text";
    input.size = '1';
    input.onchange = function () {
      Change(this);
    };
    row.cells[j].appendChild(input);
  }
}

// initializing sudoku board
const brd = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];
const N = 9;
const UNASSIGNED = 0;
// updating board
function Change(ele) {
  let a, b;
  [, , , , , , a, , b] = ele.name;
  brd[a][b] = ele.value;
  document.getElementById(`input_${a}_${b}`).style.backgroundColor = 'blue';
}

document.querySelector(".btn-solve").addEventListener("click", function () {
  console.log("solve", attempts);
  let x = SolveSudoku(brd);
  if (!x) {
    console.log("invalid sudoku", attempts);
    document.querySelector('.warning-msg').classList.remove('hidden');
  }
});
document.querySelector(".btn-ref").addEventListener("click", function () {
  location.reload();
});

/*Solving partially filled Sudoku Board*/

function SolveSudoku(grid) {
  if (attempts > 20000) {
    console.log("20000!");
    return false;
  }
  attempts++;
  let temp_grid = grid;
  let x, row, col;
  [x, row, col] = FindUnassignedLocation(temp_grid);
  if (!x) {
    print_solved_board(temp_grid);
    return true;
  }
  for (let num = 1; num <= 9; num++) {
    if (isSafe(temp_grid, row, col, num)) {
      temp_grid[row][col] = num;
      if (SolveSudoku(temp_grid)) return true;
      temp_grid[row][col] = UNASSIGNED;
    }
  }
  return false;
}

function UsedInRow(grid, row, num) {
  for (let col = 0; col < N; col++)
    if (grid[row][col] == num) return true;
  return false;
}

function UsedInCol(grid, col, num) {
  for (let row = 0; row < N; row++) if (grid[row][col] == num) return true;
  return false;
}

function UsedInBox(grid, boxStartRow, boxStartCol, num) {
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 3; col++)
      if (grid[row + boxStartRow][col + boxStartCol] == num) return true;
  return false;
}

function isSafe(grid, row, col, num) {
  return (
    !UsedInRow(grid, row, num) &&
    !UsedInCol(grid, col, num) &&
    !UsedInBox(grid, row - (row % 3), col - (col % 3), num) &&
    grid[row][col] == UNASSIGNED
  );
}

function FindUnassignedLocation(grid) {
  for (row = 0; row < N; row++)
    for (col = 0; col < N; col++)
      if (grid[row][col] == UNASSIGNED) return [true, row, col];
  return [false, row, col];
}

function print_solved_board(grid) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      document.getElementById(`input_${i}_${j}`).value = brd[i][j];
    }
  }
}