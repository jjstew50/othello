/**
 * Othello, also known as Reversi, is a game between two players, denoted by black
 * and white.
 *
 * Play happens on an 8x8 grid. Game pieces are discs with a black side and a
 * white side. The face-up side of a piece indicates its current owner.
 *
 * The game begins with two black pieces and two white pieces, as shown:
 *
 *   a b c d e f g h
 * 1
 * 2
 * 3
 * 4      B W
 * 5      W B
 * 6
 * 7
 * 8
 *
 * Players alternate turns, beginning with black.
 *
 * A player's turn consists of placing a new piece of their color on an empty space
 * and then flipping the opponent's pieces.
 *
 * A player flips lines of one or more opposing pieces when they are bookended
 * (surrounded) by the newly placed piece and one of their existing pieces. The line
 * including the bookends must be contiguous (no gaps). Lines of flipped pieces
 * can be othogonal or diagonal. Multiple lines may be flipped in a single turn.
 * (Note: One of the two surrounding pieces MUST be the newly placed piece.)
 *
 * For example, in the following game, black plays g6. This move flips the white
 * pieces at c6, d6, e6, f5, and f6 to black.
 *
 *   a b c d e f g h       a b c d e f g h       a b c d e f g h
 * 1                     1                     1
 * 2                     2                     2
 * 3       W B W         3       W B W         3       W B W
 * 4     W B B W B       4     W B B W B       4     W B B W B
 * 5   W B W B W         5   W B W B *         5   W B W B B
 * 6   B W W W W         6   B * * * * B       6   B B B B B B
 * 7                     7                     7
 * 8                     8                     8
 *
 * Every move must flip at least one piece. If a player cannot move, their turn is
 * skipped.
 *
 * For example, in the following game, white has no legal move:
 *
 *   a b c d e f g h
 * 1       W W W   W
 * 2     W W W W   W
 * 3   W W W B W W W
 * 4     W B B W B W
 * 5 W W W W W W B W
 * 6   W W W W W W W
 * 7     W W W W W W
 * 8 B B B B B B B W
 *
 * When neither player can move, the game ends.
 *
 * At the end of the game, the player with the most pieces wins. If players have
 * the same number of pieces, the game is a tie.
 *
 * Write a program that two people can use to play a game of Othello.
 *
 * A fully working program should:
 *   * validate attempted moves
 *   * execute moves
 *   * skip turns
 *   * end the game
 *   * display the winner
 *
 * If you have extra time, create a simple AI to play the game.
 *
 * Pace your development such that the program works as much as possible by the
 * end of the alloted time; i.e. it should not be in a "broken" state.
 *
 * The beginnings of a program are provided. Feel free to modify the program as desired.
 */