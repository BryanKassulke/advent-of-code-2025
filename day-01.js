import * as fs from "fs";

/**
 * --- Day 1: Secret Entrance ---
 * https://adventofcode.com/2025/day/1
 * Since the scenario outlines an initial state and a series of simple movement
 * instructions, this seemed like a good candidate for a reduce approach.
 */
fs.readFile("./day-01-input.txt", "utf8", (error, data) => {
  if (error) {
    console.error("Error reading file:", error);
    return;
  }
  const result = data.split("\n").reduce(
    ({ index, count }, line) => {
      const direction = line[0];
      let steps = parseInt(line.slice(1), 10);
      if (steps >= 100) {
        if (PART === 2) {
          count += Math.floor(steps / 100);
        }
        steps = steps % 100;
      }
      let newIndex;
      if (direction === "R") {
        newIndex = index + steps;
        if (newIndex >= 100) {
          if (PART === 2 && newIndex != 100) {
            count++;
          }
          newIndex = newIndex % 100;
        }
      } else if (direction === "L") {
        newIndex = index - steps;
        if (newIndex < 0) {
          if (PART === 2 && index > 0) {
            count++;
          }
          newIndex = newIndex + 100;
        }
      }
      if (newIndex === 0) {
        count++;
      }
      index = newIndex;
      return { index, count };
    },
    { index: 50, count: 0 }
  );
  console.log("Number of times result way:", result.count);
});

// Result for my input: 1071

/**
 * --- Part Two ---
 * We now also have to count the number of times we end up on 0 OR turn past it
 * (including multiple turns in a single instruction). This was was pretty tedious
 * to troubleshoot and it was challenging pinpoint certain edge cases. If in doubt
 * reduce the by parsing/simplifying the input as much as possible.
 */

const PART = 2; // 1 or 2
