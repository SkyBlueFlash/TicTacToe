// add an onclick event for each cell to register clicks and call playMove on the clicked cell
// ,onclick event for reset button, and onclick event for edit/save button
function setupEventHandler() {
  const cells = document.querySelectorAll("td");
  cells.forEach(function (cell) {
    cell.onclick = () => {
      board.playMove(cell);
    };
  });

  board.render();

  const btn = document.getElementById("reset");
  btn.addEventListener('click',  board.reset);

  // if button text is 'edit' make text box editable and change button name to save
  // if button text is 'save' save the text box version in the player name variable
  // and make text box readonly and revert button text to 'edit'
  const btn1 = document.getElementById("edit1");
  btn1.addEventListener('click',  function() {
    const pname = document.getElementById("name1");
    if (btn1.textContent == 'Edit') {
        pname.readOnly = false;
        pname.value = '';
        btn1.textContent = 'Save';
    } else if (btn1.textContent == 'Save') {
        pname.readOnly = true;
        btn1.textContent = 'Edit';
        player1.edit(pname.value);

    }
  });

  const btn2 = document.getElementById("edit2");
  btn2.addEventListener('click',  function() {
    const pname = document.getElementById("name2");
    if (btn2.textContent == 'Edit') {
        pname.readOnly = false;
        pname.value = '';
        btn2.textContent = 'Save';
    } else if (btn2.textContent == 'Save') {
        pname.readOnly = true;
        btn2.textContent = 'Edit'
        player2.edit(pname.value);

    }
  
  });
}

// player object contains player data and functions to set or get the data
const Player = (val) => {
  let name = val;
  let wins = 0;
  let losses = 0;
  let draws = 0;

  const Won = () => {
    wins++;
  };
  const Lost = () => {
    losses++;
  };
  const Drawed = () => {
    draws++;
  };
  const getInfo = () => {
    let data = [wins, losses, draws,name];
    return data;
  };
  const zero = () => {
    wins = 0;
    losses = 0;
    draws = 0;
  };
  const edit = (x) => {
    name = x;
    board.render();
  }
  return { Won, Lost, Drawed, getInfo, zero, edit };
};

const player1 = Player("Player 1");
const player2 = Player("Player 2");

// board object contains gameplay data such as cell values and current turn in addition to
// the playMove, checkWin, and Finish fucntions
let board = (() => {
  let remainingMoves = 9;
  let turn = "X";
  let winner = null;
  let values = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  // sets the cell to either X or O depending on the turn and update the board array accordingly
  var playMove = function (cell) {
    if ((turn == "X") & (cell.innerText == "")) {
      cell.innerText = "X";
      turn = "O";
      remainingMoves -= 1;
      var id = [2];
      id[0] = cell.id[0];
      id[1] = cell.id[1];
      values[id[0]][id[1]] = cell.innerText;
    } else if ((turn == "O") & (cell.innerText == "")) {
      cell.innerText = "O";
      turn = "X";
      remainingMoves -= 1;
      var id = [2];
      id[0] = cell.id[0];
      id[1] = cell.id[1];
      values[id[0]][id[1]] = cell.innerText;
    }

    winner = checkWin(values);
    if (winner != null) {
      Finish("win");
    } else if (remainingMoves == 0) {
      Finish("draw");
    }
  };

  // loop through the board to check for 3 equal cells
  function checkWin(values) {
    for (var colomn = 0; colomn < 3; ++colomn) {
      if (
        (values[0][colomn] == values[1][colomn]) &
        (values[1][colomn] == values[2][colomn]) &
        (values[1][colomn] != "")
      ) {
        return values[0][colomn];
      }
    }
    for (var row = 0; row < 3; ++row) {
      if (
        (values[row][0] == values[row][1]) &
        (values[row][1] == values[row][2]) &
        (values[row][1] != "")
      ) {
        return values[row][0];
      }
    }
    if (
      (values[0][0] == values[1][1]) &
      (values[1][1] == values[2][2]) &
      (values[1][1] != "")
    )
      return values[1][1];
    if (
      (values[0][2] == values[1][1]) &
      (values[1][1] == values[2][0]) &
      (values[1][1] != "")
    )
      return values[1][1];
  }

  // reset remaining moves and stored values for each table cell, and reset players score to zero
  function reset() {
    remainingMoves = 9;
    values = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    player1.zero();
    player2.zero();

    const cells = document.querySelectorAll("td");
    cells.forEach(function (cell) {
      cell.innerText = "";
    });

    render();
  }

  // Update the score boxes using data from each player object
  function render() {
    var p1Data = player1.getInfo();
    var p1Wins = document.getElementById("p1Win");
    p1Wins.textContent = "Wins: " + p1Data[0];
    var p1Loss = document.getElementById("p1Loss");
    p1Loss.textContent = "Losses: " + p1Data[1];
    var p1Draw = document.getElementById("p1Draw");
    p1Draw.textContent = "Draws: " + p1Data[2];
    

    var p2Data = player2.getInfo();
    var p2Wins = document.getElementById("p2Win");
    p2Wins.textContent = "Wins: " + p2Data[0];
    var p2Loss = document.getElementById("p2Loss");
    p2Loss.textContent = "Losses: " + p2Data[1];
    var p2Draw = document.getElementById("p2Draw");
    p2Draw.textContent = "Draws: " + p2Data[2];

    var p1name = document.getElementById("name1");
    p1name.value = p1Data[3];
    
    var p2name = document.getElementById("name2");
    p2name.value = p2Data[3];
  }

  // does post game functions
  function Finish(state) {
    reset();

    // if the game is won or drawed notify the players and update the scores
    if (state == "win") {
      alert(winner + " Wins!");
      if (winner == "X") {
        player1.Won();
        player2.Lost();
      } else {
        player2.Won();
        player1.Lost();
      }
    } else if (state == "draw") {
      player1.Drawed();
      player2.Drawed();
      alert("Draw!");
    }

    render();

  }

  return { playMove, reset, render };
})();
