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
    (state, line) => {
      const direction = line[0] === "R" ? 1 : -1;
      const steps = parseInt(line.slice(1), 10);
      const index = (state.index + direction * steps + 100) % 100;
      if (index === 0) {
        state.count += 1;
      }
      return { ...state, index };
    },
    { index: 50, count: 0 }
  );
  console.log("Number of times result way:", result.count);
});

// Result for my input: 1071
