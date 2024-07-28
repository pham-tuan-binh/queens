let root = document.querySelector(":root");
let boardWidth = 9;
let colorArray = null;

let board = undefined;
let playing_board = create2DArray(boardWidth);
// Byte size of int in C
const intSize = 4;

// Create a 2 dim square array with board width
function create2DArray(boardWidth) {
  let arr = new Array(boardWidth).fill(0);
  for (let i = 0; i < boardWidth; i++) {
    arr[i] = new Array(boardWidth).fill(0);
  }
  return arr;
}

// Print array to console as string
function printArray(arr) {
  let str = "";
  for (let i = 0; i < arr.length; i++) {
    str += arr[i].join(" ") + "\n";
  }
  console.log(str);
}

// Create a function for setting a variable value
function setRowAndColumn(numCells) {
  boardWidth = numCells;
  // Set the value of variable --blue to another value (in this case "lightblue")
  root.style.setProperty("--rows", boardWidth);
  root.style.setProperty("--columns", boardWidth);
}

// Board Win Check

function checkWin(board) {
  // Count number of 2 in the playing board
  let count = 0;
  for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardWidth; j++) {
      if (playing_board[i][j] == 2) {
        count++;
      }

      if (playing_board[i][j] == 2 && board[i][j] < 0) {
        return false;
      }
    }
  }

  if (count != boardWidth) {
    return false;
  }

  return true;
}

// Check if there are more than 1 queen in the region
function checkQueensInOneRegion(board) {
  let values = [];
  for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardWidth; j++) {
      if (playing_board[i][j] == 2) {
        values.push(board[i][j] > 0 ? board[i][j] : -board[i][j]);
      }
    }
  }

  // check duplicate
  for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) {
      if (values[i] == values[j]) {
        return true;
      }
    }
  }

  return false;
}

// Check if queens can eat eachother
function checkQueens(board) {
  for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardWidth; j++) {
      if (playing_board[i][j] == 2) {
        // Check row
        for (let k = 0; k < boardWidth; k++) {
          if (playing_board[i][k] == 2 && k != j) {
            return true;
          }
        }

        // Check column
        for (let k = 0; k < boardWidth; k++) {
          if (playing_board[k][j] == 2 && k != i) {
            return true;
          }
        }

        // Check diagonal box
      }
    }
  }

  return false;
}

// inject cols x rows div into element
function createGrid(board) {
  document.getElementsByClassName("game-grid")[0].innerHTML = "";
  for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardWidth; j++) {
      let item = document.createElement("div");
      item.boardCoordX = i;
      item.boardCoordY = j;

      item.className = "game-item";
      item.style.backgroundColor =
        colorArray[board[i][j] > 0 ? board[i][j] : -board[i][j]];

      item.count = 0;

      // Add a border to the item if it is a region boundary
      if (i > 0 && Math.abs(board[i][j]) !== Math.abs(board[i - 1][j])) {
        item.style.borderTop = "1px solid black";
      }

      if (j > 0 && Math.abs(board[i][j]) !== Math.abs(board[i][j - 1])) {
        item.style.borderLeft = "1px solid black";
      }

      // Add a border to the item if it is a region boundary
      if (
        i < boardWidth - 1 &&
        Math.abs(board[i][j]) !== Math.abs(board[i + 1][j])
      ) {
        item.style.borderBottom = "1px solid black";
      }

      if (
        j < boardWidth - 1 &&
        Math.abs(board[i][j]) !== Math.abs(board[i][j + 1])
      ) {
        item.style.borderRight = "1px solid black";
      }

      let content = document.createElement("div");
      //   if (board[i][j] > 0) {
      //     content.innerHTML = board[i][j];
      //   }

      item.addEventListener("click", () => {
        // get id lose element
        let lose = document.getElementById("lose");
        let win = document.getElementById("win");

        if (item.count == 2) {
          item.count = 0;
          content.innerHTML = "";
          return;
        }

        item.count++;

        if (item.count == 1) {
          playing_board[item.boardCoordX][item.boardCoordY] = 1;
          content.innerHTML = "x";
        }
        if (item.count == 2) {
          playing_board[item.boardCoordX][item.boardCoordY] = 2;
          content.innerHTML = "Q";
        }

        if (checkQueensInOneRegion(board) || checkQueens(board)) {
          console.log("Error");

          // set display to block
          lose.style.display = "block";
        } else {
          lose.style.display = "none";
        }

        if (checkWin(board)) {
          // set display to block
          win.style.display = "block";
        } else {
          win.style.display = "none";
        }
      });

      content.className = "game-content";
      item.appendChild(content);

      document.getElementsByClassName("game-grid")[0].appendChild(item);
    }
  }
}

// HSV to Hex
function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Generate color array
function generateColorArray() {
  colorArray = [];
  let steps = 360 / (boardWidth + 1);

  for (let i = 0; i < boardWidth; i++) {
    colorArray.push(hslToHex(0 + i * steps, 60, 60));
  }
}

Module().then((mod) => {
  function getBoard(pointer, boardWidth) {
    let board = [];
    for (let i = 0; i < boardWidth; i++) {
      let columnPointer = mod.HEAP32[pointer / intSize + i];
      let columns = [];
      for (let j = 0; j < boardWidth; j++) {
        columns.push(mod.HEAP32[columnPointer / intSize + j]);
      }
      board.push(columns);
    }

    return board;
  }

  function generateBoard(boardWidth) {
    let pointer = mod._malloc(intSize);

    let dataPointer = mod.ccall(
      "initializeBoard",
      "number",
      ["number", "number"],
      [pointer, boardWidth]
    );

    mod.ccall(
      "generateRandomBoardWithRegion",
      null,
      ["number", "number"],
      [dataPointer, boardWidth]
    );

    let board = getBoard(dataPointer, boardWidth);

    mod.ccall(
      "deinitializeBoard",
      null,
      ["number", "number"],
      [dataPointer, boardWidth]
    );

    mod._free(pointer);

    return board;
  }

  mod._main();

  let board = generateBoard(boardWidth);
  setRowAndColumn(boardWidth);
  generateColorArray();
  createGrid(board);

  document.getElementById("solve").addEventListener("click", () => {
    board = generateBoard(boardWidth);
    setRowAndColumn(boardWidth);
    generateColorArray();
    createGrid(board);
    console.log(board);
  });
});
