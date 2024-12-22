#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <time.h>
#include <emscripten.h>

// #define EMSCRIPTEN_KEEPALIVE

// Function to initialize the board with value
EMSCRIPTEN_KEEPALIVE int32_t **initializeBoard(int32_t ***board, int32_t boardWidth)
{
    // Allocate memory for board pointers
    *board = (int32_t **)malloc(boardWidth * sizeof(int32_t *));
    for (int32_t i = 0; i < boardWidth; i++)
    {
        // Allocate memory for boardWidth columns
        (*board)[i] = (int32_t *)malloc(boardWidth * sizeof(int32_t));
    }

    // Initialize the board with value
    for (int32_t i = 0; i < boardWidth; i++)
    {
        for (int32_t j = 0; j < boardWidth; j++)
        {
            (*board)[i][j] = 0;
        }
    }

    return *board;
}

// Function to deinitialize the board
EMSCRIPTEN_KEEPALIVE void deinitializeBoard(int32_t **board, int32_t boardWidth)
{
    // Free memory for each row
    for (int32_t i = 0; i < boardWidth; i++)
    {
        free(board[i]);
    }

    // Free memory for board pointers
    free(board);

    return;
}

// 0 is empty, 1 is queen

// Check if the position is valid
int32_t isThisBoxValid(int32_t x, int32_t y, int32_t **board, int32_t boardWidth)
{
    // Check if the position is out of board
    if (x < 0 || x >= boardWidth || y < 0 || y >= boardWidth)
    {
        return 0;
    }

    // Scan horizontal and vertical line
    for (int32_t i = 0; i < boardWidth; i++)
    {
        if (board[x][i] == 1 && i != y)
        {
            return 0;
        }

        if (board[i][y] == 1 && i != x)
        {
            return 0;
        }
    }

    // Check top right
    if ((x < boardWidth - 1) && (y > 0) && board[x + 1][y - 1] == 1)
    {
        return 0;
    }

    // Check top left
    if ((x > 0) && (y > 0) && board[x - 1][y - 1] == 1)
    {
        return 0;
    }

    // Check bottom right
    if ((x < boardWidth - 1) && (y < boardWidth - 1) && board[x + 1][y + 1] == 1)
    {
        return 0;
    }

    // Check bottom left
    if ((x > 0) && (y < boardWidth - 1) && board[x - 1][y + 1] == 1)
    {
        return 0;
    }

    return 1;
}

int32_t placeQueenHere(int32_t x, int32_t y, int32_t **board, int32_t boardWidth)
{
    // Check if the position is valid
    if (!isThisBoxValid(x, y, board, boardWidth))
    {
        return 0;
    }

    // Place the queen
    board[x][y] = 1;

    return 1;
}

// mode 0 with notation
// mode 1 without notation
void printBoard(int32_t **board, int32_t boardWidth, int32_t mode)
{
    for (int32_t i = 0; i < boardWidth; i++)
    {
        for (int32_t j = 0; j < boardWidth; j++)
        {
            // Print the board with notation
            if (mode == 0)
            {

                if (board[j][i] == 1)
                {
                    printf("Q ");
                }
                else if (board[j][i] == 2)
                {
                    printf("* ");
                }
                else
                {
                    printf(". ");
                }
            }
            else if (mode == 1)
            {
                printf("%d ", board[j][i]);
            }
        }
        printf("\n");
    }
}

// Generate all possible boards
void generateAllQueensBoard(int32_t **board, int32_t boardWidth, int32_t currentColumn)
{
    // Base case
    if (currentColumn == boardWidth)
    {
        // printf("Board generated %d\n", counter);
        // printBoard(board, boardWidth);
        // counter++;
        return;
    }

    // Traverse every row of a column
    for (int32_t i = 0; i < boardWidth; i++)
    {

        // Skip if position is not valid for queen
        if (isThisBoxValid(currentColumn, i, board, boardWidth))
        {
            // If valid then place the queen
            placeQueenHere(currentColumn, i, board, boardWidth);

            // Recursively call the function
            generateAllQueensBoard(board, boardWidth, currentColumn + 1);

            // Reset the board
            board[currentColumn][i] = 0;
        }
    }
}

// Pick a random position inside a column that is empty and valid
int32_t pickRandomValidPosition(int32_t **board, int32_t boardWidth, int32_t column)
{
    int32_t randomPosition = rand() % boardWidth;

    while (!(board[column][randomPosition] == 0 && isThisBoxValid(column, randomPosition, board, boardWidth)))
    {
        randomPosition = rand() % boardWidth;
    }

    return randomPosition;
}

// Check if column has empty position and valid
int32_t hasValidPosition(int32_t **board, int32_t boardWidth, int32_t column)
{
    for (int32_t i = 0; i < boardWidth; i++)
    {
        if (board[column][i] == 0 && isThisBoxValid(column, i, board, boardWidth))
        {
            return 1;
        }
    }

    return 0;
}

// Clear subsequent columns
void clearSubsequentColumns(int32_t **board, int32_t boardWidth, int32_t column)
{
    for (int32_t i = column + 1; i < boardWidth; i++)
    {
        for (int32_t j = 0; j < boardWidth; j++)
        {
            board[i][j] = 0;
        }
    }
}

// Generate a random board
int32_t generateRandomQueensBoard(int32_t **board, int32_t boardWidth, int32_t currentColumn)
{
    // Base Case
    if (currentColumn == boardWidth)
    {

        // printf("Board generated %d\n", counter);
        // printBoard(board, boardWidth);
        return 1;
    }

    int32_t result = 0;

    // printf("Current Column: %d\n", currentColumn);

    while (hasValidPosition(board, boardWidth, currentColumn))
    {
        // pre placing queen
        // printf("Pre placing queen\n");
        // printBoard(board, boardWidth, 1);
        // printf("\n");

        int32_t randomPosition = pickRandomValidPosition(board, boardWidth, currentColumn);

        // Place the queen
        placeQueenHere(currentColumn, randomPosition, board, boardWidth);

        // after placing queen
        // printf("after placing queen\n");
        // printBoard(board, boardWidth);
        // printf("\n");

        // Recursively call the function
        if (generateRandomQueensBoard(board, boardWidth, currentColumn + 1) == 1)
        {
            return 1;
        };

        board[currentColumn][randomPosition] = 2;

        // after placing invalid
        // printf("after placing invalid\n");
        // printBoard(board, boardWidth);
        // printf("\n");
        clearSubsequentColumns(board, boardWidth, currentColumn);
    }

    // printf("End of column\n");
    // printf("\n");

    return result;
}

void fillBoard(int32_t **board, int32_t boardWidth)
{
    for (int32_t i = 0; i < boardWidth; i++)
    {
        for (int32_t j = 0; j < boardWidth; j++)
        {
            board[i][j] = 0;
        }
    }
}

void measureBoardGeneration(int32_t **board, int32_t boardWidth)
{
    clock_t start, end;
    double cpu_time_used;

    // print csv header with board width, time taken 1st time -> 500 time
    int32_t maxBoardWidth = 1000;
    int32_t step = 20;

    printf("Board Width");
    for (int32_t i = 0; i <= maxBoardWidth; i += step)
    {
        printf(", %dth measurement", i / step);
    }
    printf("\n");

    for (int32_t width = 0; width <= maxBoardWidth; width += step)
    {
        // Print the board
        initializeBoard(&board, width);

        printf("%d, ", width);

        for (int32_t i = 0; i < 100; i++)
        {
            start = clock();
            generateRandomQueensBoard(board, width, 0);
            end = clock();

            cpu_time_used = ((double)(end - start)) / CLOCKS_PER_SEC;

            printf("%f, ", cpu_time_used);

            fillBoard(board, width);
        }

        printf("\n");

        deinitializeBoard(board, width);
    }
}

void prepBoardForRegioning(int32_t **board, int32_t boardWidth)
{
    int32_t count = 1;
    for (int32_t i = 0; i < boardWidth; i++)
    {
        for (int32_t j = 0; j < boardWidth; j++)
        {
            if (board[i][j] == 1)
            {
                board[i][j] = count;
                count++;
            }
            else
            {
                board[i][j] = 0;
            }
        }
    }
}

int32_t noEmptyCellInBoard(int32_t **board, int32_t boardWidth)
{
    for (int32_t i = 0; i < boardWidth; i++)
    {
        for (int32_t j = 0; j < boardWidth; j++)
        {
            if (board[i][j] == 0)
            {
                return 0;
            }
        }
    }

    return 1;
}

void growRegion(int32_t **board, int32_t boardWidth)
{
    while (!noEmptyCellInBoard(board, boardWidth))
    {
        for (int32_t i = 0; i < boardWidth; i++)
        {
            for (int32_t j = 0; j < boardWidth; j++)
            {
                if (board[i][j] != 0)
                {
                    int32_t rowOffset = rand() % 3 - 1;
                    int32_t columnOffset = rand() % 3 - 1;

                    if (i + columnOffset >= 0 && i + columnOffset < boardWidth && j + rowOffset >= 0 && j + rowOffset < boardWidth)
                    {
                        if (board[i + columnOffset][j + rowOffset] == 0)
                        {
                            board[i + columnOffset][j + rowOffset] = board[i][j] > 0 ? -board[i][j] : board[i][j];
                        }
                    }
                }
            }
        }
    }
}

EMSCRIPTEN_KEEPALIVE void generateRandomBoardWithRegion(int32_t **board, int32_t boardWidth)
{
    generateRandomQueensBoard(board, boardWidth, 0);
    prepBoardForRegioning(board, boardWidth);
    growRegion(board, boardWidth);
}

int main()
{
    // int32_t **board;
    // int32_t boardWidth = 8;

    // printf("Hello, World!\n");
    // srand(time(NULL));

    // // Initialize the board
    // initializeBoard(&board, boardWidth);

    // generateRandomBoardWithRegion(board, boardWidth);

    // deinitializeBoard(board, boardWidth);

    return 0;
}