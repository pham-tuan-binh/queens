// Elements Selector
let root = document.querySelector(":root");
const incorrectNotificationBox = document.getElementById(
  "incorrect-notification-box"
);
const winNotificationBox = document.getElementById("win-notification-box");
const timerDisplay = document.getElementById("timer-display");
const numberInput = document.getElementById("number-input");
const gameGrid = document.getElementsByClassName("game-grid")[0];

// SVG
const queenIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ff9f00" class="size-6">
  <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
</svg>`;
const flagIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" class="size-6">
  <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
</svg>`;

let boardWidth = 4;
let colorArray = [];

let board = undefined;
let playing_board = create2DArray(boardWidth);

// Byte size of int in C
const intSize = 4;

// --------------- Timer Variables ---------------
let timer;
let seconds = 0;
let minutes = 0;

// --------------- Timer Functions ---------------
function startTimer() {
  timer = setInterval(() => {
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
    updateDisplay();
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function resetTimer() {
  clearInterval(timer);
  seconds = 0;
  minutes = 0;
  updateDisplay();
}

function updateDisplay() {
  timerDisplay.textContent = `${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(num) {
  return num < 10 ? "0" + num : num;
}

// --------------- Utils Functions ---------------

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
  root.style.setProperty("--boardwidth", boardWidth);

  // Force reflow
  document.body.offsetHeight;
}

// inject cols x rows div into element
function createGrid(board) {
  gameGrid.innerHTML = "";

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

      item.addEventListener("click", (e) => {
        e.preventDefault();

        // Reset count
        if (item.count == 2) {
          item.count = 0;

          playing_board[item.boardCoordX][item.boardCoordY] = 0;
          content.innerHTML = "";
        } else {
          // On click increase count
          item.count++;
        }

        if (item.count == 1) {
          playing_board[item.boardCoordX][item.boardCoordY] = 1;
          content.innerHTML = flagIcon;
        }

        if (item.count == 2) {
          playing_board[item.boardCoordX][item.boardCoordY] = 2;
          content.innerHTML = queenIcon;
        }

        // If the player put queen in wrong position
        if (checkQueensInOneRegion(board) || checkQueens(board)) {
          // set display to block
          incorrectNotificationBox.style.display = "block";
        } else {
          incorrectNotificationBox.style.display = "none";
        }

        // If the player win
        if (checkWin(board)) {
          stopTimer();
          // set display to block
          winNotificationBox.style.display = "block";
        } else {
          winNotificationBox.style.display = "none";
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
  let steps = 360 / boardWidth;
  console.log(steps / boardWidth);
  console.log(boardWidth);

  for (let i = 0; i < boardWidth; i++) {
    colorArray.push(hslToHex(i * steps, 80, 60));
  }
}

function restartBoard(generateBoard) {
  winNotificationBox.style.display = "none";

  board = generateBoard(boardWidth);
  playing_board = create2DArray(boardWidth);
  numberInput.value = boardWidth;
  setRowAndColumn(boardWidth);
  generateColorArray();
  createGrid(board);

  console.log(colorArray);

  resetTimer();
  startTimer();
}

// --------------- Board Rule Check Functions ---------------

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
        const directions = [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1], // Diagonal directions
        ];

        for (let [dx, dy] of directions) {
          let x = i + dx;
          let y = j + dy;

          if (
            x >= 0 &&
            y >= 0 &&
            x < boardWidth &&
            y < boardWidth &&
            playing_board[x][y] == 2
          ) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

// --------------- Main Functions ---------------

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

  restartBoard(generateBoard);

  document.getElementById("restart-button").addEventListener("click", () => {
    restartBoard(generateBoard);
  });
});

// Prevent text highlighting on the whole site
gameGrid.addEventListener("mousedown", (event) => {
  event.preventDefault();
});

// Add event listener for value change
numberInput.addEventListener("input", function () {
  if (numberInput.value < 4) {
    numberInput.value = 4;
  }

  boardWidth = numberInput.value;

  document.getElementById("restart-button").click();
});
