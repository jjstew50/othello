const { getCoordinates } = require('./ai.js');

const readline = require('node:readline');

class Coordinate {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }

  toString() {
    return `Coordinate(row=${this.row}, col=${this.col})`;
  }
}

class Color {
  static BLACK = new Color('B');
  static WHITE = new Color('W');

  constructor(name) {
    this.name = name;
  }

  abbreviation() {
    return this.name;
  }

  toString() {
    switch (this.name) {
      case 'B':
        return 'black';
      case 'W':
        return 'white';
    }
    throw new Error(`Unknown color: ${this.name}`);
  }
}

class Board {
  constructor(size) {
    this.size = size;
    this.positions = new Array(size).fill(null).map(() => new Array(size).fill(null));
  }

  toString() {
    let result = '';
    result += '  ';
    for (let col = 0; col < this.size; col++) {
      result += String.fromCharCode('a'.charCodeAt(0) + col);
      result += ' ';
    }
    result += '\n';
    for (let row = 0; row < this.size; row++) {
      result += String.fromCharCode('1'.charCodeAt(0) + row);
      result += ' ';
      for (let col = 0; col < this.size; col++) {
        const position = this.positions[row][col];
        result += position !== null ? position.abbreviation() : ' ';
        if (col < this.size - 1) {
          result += ' ';
        }
      }
      result += '\n';
    }
    return result;
  }
}

class CoordinateParseException extends Error {}

class Othello {
  static SIZE = 8;

  parseCoordinate(input) {
    if (input.length !== 2) {
      throw new CoordinateParseException("Input must be length 2");
    }
    const row = input.charCodeAt(1) - '1'.charCodeAt(0);
    if (row < 0 || Othello.SIZE <= row) {
      throw new CoordinateParseException("Row out of bounds");
    }
    const col = input.charCodeAt(0) - 'a'.charCodeAt(0);
    if (col < 0 || Othello.SIZE <= col) {
      throw new CoordinateParseException("Column out of bounds");
    }
    return new Coordinate(row, col);
  }

  async play() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'Othello > ',
    });

    const board = new Board(Othello.SIZE);
    board.positions[3][3] = Color.WHITE;
    board.positions[3][4] = Color.BLACK;
    board.positions[4][3] = Color.BLACK;
    board.positions[4][4] = Color.WHITE;

    let turn = Color.BLACK;
    const aiGame = await new Promise(res => rl.question(`Do you want to play against an AI (y/n): `, res));
    var aiColor;
    if(aiGame == "y" || aiGame == "yes"){
      const color = await new Promise(res => rl.question(`Enter what color would you like to be (b/w): `, res));  
      console.log("COLOR: ", color)
      console.log(color.toLocaleLowerCase())
      console.log(Color.BLACK.abbreviation().toLocaleLowerCase())
      aiColor = color.toLocaleLowerCase() == Color.BLACK.abbreviation().toLocaleLowerCase() ? Color.WHITE : Color.BLACK 
      console.log("AI COLOR: ", aiColor)
    } 

    while (true) {
      console.log(board.toString());
      try {
        var input;

        if (aiColor == turn){
          //TODO: pipe in the needed data and prompt for the AI to make a move
          console.log("GETTING AI INPUT")
          input = await getCoordinates(board, turn); 
          console.log("AI INPUT: ", input)
        } else {
          input = await new Promise(res => rl.question(`Enter move for ${turn}: `, res));       
        }
        
        const move = this.parseCoordinate(input);
         
        const piecesChanged = getChangedPieces(move, board, turn)
        if(piecesChanged.length > 0){
          piecesChanged.forEach(coord => board.positions[coord.row][coord.col] = turn);
          board.positions[move.row][move.col] = turn
        } else{
          throw new CoordinateParseException("No pieces would be turned or coordinate already taken.")
        }

        turn = opponentsColor(turn)

        if(skipTurn(board, turn)){
          turn = opponentsColor(turn)
          if(skipTurn(board, turn)){
            console.log("Game is over no more possible moves.")
            endGame(board)
            break
          }
        }
      } catch (e) {
        console.log("ERROR: ", e)
        if (e instanceof CoordinateParseException) {
          console.log(`Invalid move: ${e.message}`);
          console.log();
          continue;
        } else {
          throw e;
        }
      }
      
    }
  }
}

function opponentsColor(turn){
  return turn == Color.BLACK ? Color.WHITE : Color.BLACK
}

function skipTurn(board, turn){
  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      const move = new Coordinate(row, col)
      if(board.positions[move.row][move.col] == null){
        const piecesChanged = getChangedPieces(move, board, turn);
        if(piecesChanged.length > 0){
          return false
        }
      }

    }
  }
  return true
}

function getChangedPieces(move, board, turn){
  var piecesChanged = []
  if (board.positions[move.row][move.col] != null){
    return piecesChanged;
  } 
  const opponentColor = opponentsColor(turn)
  options.forEach(option => {
    const changesArr = trackPiecesChanged(board, { ...move }, option, opponentColor, []);
    piecesChanged = [...piecesChanged, ...changesArr];
  });

  return piecesChanged;
}

function trackPiecesChanged(board, coordinate, option, opponentColor, coordArr){
  coordinate.row = coordinate.row+option[0]
  coordinate.col = coordinate.col+option[1]
  if(coordinate.row > board.size-1 || coordinate.row < 0 || coordinate.col > board.size-1 || coordinate.col < 0){
    return []
  }

  if (board.positions[coordinate.row][coordinate.col] !== opponentColor) {
    if (board.positions[coordinate.row][coordinate.col] === null) {
      return [];
    }
    return coordArr.length > 0 ? coordArr : [];
  }
  coordArr.push({ ...coordinate })
  return trackPiecesChanged(board, coordinate, option, opponentColor, coordArr);
}

function endGame(board){
  console.log(board.toString())
  var blackScore = 0
  var whiteScore = 0
  var winner = "ITS A TIE!"

  board.positions.forEach(row => {
    row.forEach(position => {
      if (position === Color.BLACK) blackScore++;
      else if (position === Color.WHITE) whiteScore++;
    });
  });

  if(blackScore > whiteScore){
    winner = "The winner is " + Color.BLACK
  } else if(whiteScore > blackScore){
    winner = "The winner is " + Color.WHITE
  }

  console.log("Black score: ", blackScore);
  console.log("White score: ", whiteScore)
  console.log(winner)
}

//these are the options for checking if moves are valid and which pieces are turned
const options = [
  [0,1],
  [0,-1],
  [1,0],
  [-1,0],
  [1,1],
  [-1,-1],
  [-1,1],
  [1,-1]
]

const othello = new Othello();
othello.play();