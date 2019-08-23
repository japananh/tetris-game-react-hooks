import { useState, useEffect } from "react";
import { createStage } from "../gameHelpers";

export const useStage = (player, resetPlayer) => {
  const [stage, setStage] = useState(createStage());
  const [rowsCleared, setRowsCleared] = useState(0);

  useEffect(() => {
    setRowsCleared(0);

    const sweepRows = newStage =>
      newStage.reduce((acc, row) => {
        if (row.findIndex(cell => cell[0] === 0) === -1) {
          setRowsCleared(prev => prev + 1);
          acc.unshift(new Array(newStage[0].length).fill([0, "clear"]));

          return acc;
        }

        acc.push(row);

        return acc;
      }, []);

    const updateStage = prevStage => {
      // should use for loop here for performance
      // const newStage = prevStage.map(row => {

      //   return row.map(cell => (cell[1] === "clear" ? [0, "clear"] : cell));
      // });

      let newStage = [];

      for (let y = 0; y < prevStage.length; y++) {
        for (let x = 0; x < prevStage[x].length; x++) {
          prevStage[y][x] =
            prevStage[y][x][1] === "clear" ? [0, "clear"] : prevStage[y][x];
        }
        newStage.push(prevStage[y]);
      }
      // Then draw the tetromino
      // player.tetromino.forEach((row, y) => {
      //   row.forEach((value, x) => {
      //     if (value !== 0) {
      //       newStage[y + player.pos.y][x + player.pos.x] = [
      //         value,
      //         `${player.collided ? "merged" : "clear"}`
      //       ];
      //     }
      //   });
      // });

      for (let y = 0; y < player.tetromino.length; y++) {
        for (let x = 0; x < player.tetromino[y].length; x++) {
          if (player.tetromino[y][x] !== 0 && y + player.pos.y >= 0) {
            newStage[y + player.pos.y][x + player.pos.x] = [
              player.tetromino[y][x],
              `${player.collided ? "merged" : "clear"}`
            ];
          }
        }
      }
      // Then check if we collided
      if (player.collided) {
        // Avoid a useless tetromino when player hits the ceiling
        if (player.pos.y > 0) {
          resetPlayer(player);
        }

        return sweepRows(newStage);
      }

      return newStage;
    };

    setStage(prev => updateStage(prev));
  }, [player, resetPlayer]);

  return [stage, setStage, rowsCleared];
};
