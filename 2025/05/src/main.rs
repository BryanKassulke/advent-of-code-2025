use std::fs::File;
use std::io::{BufRead, BufReader};

/*
 --- Day 5: Cafeteria ---
 https://adventofcode.com/2025/day/5
*/

fn main() {
    let filename = "./day-05-input.txt";
    println!("Part one result: {}", calculate(1, filename));
    println!("Part two result: {}", calculate(2, filename));
}

/*
 --- Part 1 ---
 We just need to compare the ids to the ranges specified above. I'd like to think
 I could come up with a way to intelligently index these ranges somehow for faster
 comparison but let's just bruteforce it for now.
*/

fn calculate(part: i32, filename: &str) -> i64 {
    let file = File::open(filename).unwrap();
    let reader = BufReader::new(file);
    let mut total = 0;
    let mut ranges: Vec<[i64; 2]> = Vec::new();
    let mut range_region = true;
    for (_, line) in reader.lines().enumerate() {
        let line = line.unwrap();
        //println!("{}", line);
        if line.len() == 0 {
            range_region = false;
            if part == 2 {
                break;
            }
        } else {
            if range_region {
                let parts: Vec<&str> = line.split("-").collect::<Vec<&str>>();
                let min = parts[0].parse().unwrap();
                let max = parts[1].parse().unwrap();
                ranges.push([min, max]);
            } else {
                let id: i64 = line.parse().unwrap();
                let mut in_ranges = false;
                for range in ranges.iter() {
                    if id >= range[0] && id <= range[1] {
                        in_ranges = true;
                        break;
                    }
                }
                if in_ranges {
                    total += 1;
                }
            }
        }
    }
    if part == 2 {
        //let count = range[1] - range[0] + 1;
        //println!("{} -> {} = {}", range[0], range[1], count);
        //total += range[1] - range[0] + 1;
        ranges.sort_by(|a, b| a[0].cmp(&b[0]));
        for index in 0..ranges.len() {
            let range = ranges[index];
            // look ahead to see if we need to adjust ranges
            let mut ahead_index = index;
            let min: i64 = range[0];
            let mut max: i64 = range[1];

            loop {
                ahead_index += 1;
                if ahead_index >= ranges.len() {
                    break;
                }
                // There are three overlap states
                // No overlap - all mins after will not overlap with this one
                if max < ranges[ahead_index][0] {
                    break;
                } else {
                    // Full overlap - let the next one have the higher range
                    if max > ranges[ahead_index][1] {
                        ranges[ahead_index] = [ranges[ahead_index][0], max];
                        max = ranges[ahead_index][0] - 1;
                        // Partial overlap
                    } else {
                        max = ranges[ahead_index][0] - 1;
                    }
                }
            }
            //println!("{} => {} = {}", min, max, max - min + 1);
            total += max - min + 1;
        }
    }

    return total;
}

// Result: 529

/*
  --- Part 2 ---
  Now we just need to find the total number of ids that are in the acceptable ranges.
  There appears to be overlap in the ranges so we should just prune ranges to fall
  outside of where they clash - just imagine they're like overlapping scheduled events.
  If we order it before hand we can reduce the average number of comparisons still O(n^2).
*/

// Result: 344260049617193
