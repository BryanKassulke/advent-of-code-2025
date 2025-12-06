import * as fs from "fs";

/**
 * --- Day 2: Gift Shop ---
 * https://adventofcode.com/2025/day/2
 */

/**
 * --- Part 1 ---
 * Certainly a lot harder already! The problem outlines that an invalid id is made
 * ONLY of a digit sequence repeated twice. We generate invalid IDs by taking the
 * first half of the min, repeating it twice, and incrementing until we exceed the max.
 * We then do a simple sum to get our answer. Definitely overthought this one!
 */
fs.readFile("./day-02-input.txt", "utf8", (error, data) => {
  if (error) {
    console.error("Error reading file:", error);
    return;
  }
  const result = data
    .split(",")
    .flatMap((range) => {
      let [min, max] = range.split("-");
      const subranges = [];
      for (let i = min.length; i <= max.length; i++) {
        subranges.push([
          String(Math.max(min, Number("1".padEnd(i, "0")))),
          String(Math.min(max, Number("9".padEnd(i, "9")))),
        ]);
      }
      return subranges;
    })
    .flatMap(([min, max]) => {
      const invalidIds = [];
      const minSequences = MIN_SEQUENCES;
      const maxSequences = Math.min(MAX_SEQUENCES, min.length);
      const uniqueIds = new Set();
      for (
        let sequences = minSequences;
        sequences <= maxSequences;
        sequences++
      ) {
        // If the length of min can't be evenly divided by the number of sequences, skip.
        if (min.length % sequences !== 0) {
          continue;
        }
        let sequence = Number(min.substring(0, min.length / sequences));
        let id = Number(String(sequence).repeat(sequences));
        while (id <= max) {
          if (id >= min && !uniqueIds.has(id)) {
            invalidIds.push(id);
            uniqueIds.add(id);
          }
          id = Number(String(++sequence).repeat(sequences));
        }
      }
      return invalidIds;
    })
    .reduce((sum, id) => sum + id, 0);
  console.log("Sum of all invalid IDs:", result);
});

// Part one answer for my input: 18951763203

/**
 * --- Part 2 ---
 * The problem is expanded to include ids as invalid that are a sequence occuring AT LEAST twice.
 * We to adjust the way we generate invalid IDs to account for this. We just need to generalise our
 * algorithm to allow for any number of sequences greater than or equal to two. We can also skip
 * cases where the Id range is not divisible by the number of sequences we want to test. I
 * included a set to avoid duplicates since some IDs can be formed from different sequence counts
 * (1 + 1 + 1 + 1 === 11 + 11) and also split ranges into subranges based on length to avoid edge cases.
 */
const MIN_SEQUENCES = 2;
const MAX_SEQUENCES = Infinity; // Was 2 for part one.

// Part two answer for my input: 28858486244
