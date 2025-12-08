package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
)

/*
--- Day 3: Printing Department ---
https://adventofcode.com/2025/day/3
*/

/*
--- Part 1 ---
I've made it so that we read and compare surrounds with a circular buffer so that we only have a bound
area of concern. I predict that the radius/threshold of the operation may change in part 2.
*/

const rowSize = 139
const threshold = 4
const radius = 1

func main() {
	fmt.Println("Part one result:", partOne())
	fmt.Println("Part two result:", partTwo())
}

func partOne() int {
	file, error := os.Open("./day-04-input.txt")
	if error != nil {
		log.Fatal(error)
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	scanner.Split(bufio.ScanLines)

	const bufferSize = 2*radius + 1

	totalCount := 0
	buffer := [bufferSize]string{}
	currentRow := 0
	readAheadRow := 0

	for {
		// Read ahead so we can check radius
		for ; readAheadRow <= currentRow+radius && scanner.Scan(); readAheadRow++ {
			buffer[readAheadRow%bufferSize] = scanner.Text()
		}
		// check surrounds
		for currentChar := range rowSize {
			cellCount := 0
			if string(buffer[currentRow%bufferSize][currentChar]) == "@" {
				for checkRow := max(currentRow-radius, 0); checkRow <= min(currentRow+radius, readAheadRow-1); checkRow++ {
					if cellCount >= threshold {
						break
					}
					for checkChar := max(currentChar-radius, 0); checkChar <= min(currentChar+radius, rowSize-1); checkChar++ {
						if cellCount >= threshold {
							break
						}
						if checkChar == currentChar && checkRow == currentRow {
							continue
						}
						if string(buffer[checkRow%bufferSize][checkChar]) == "@" {
							cellCount++
						}
					}
				}
				if cellCount < threshold {
					totalCount++
				}
			}
		}
		currentRow++
		if currentRow >= readAheadRow {
			break
		}
	}

	return totalCount
}

// Result: 1467

/*
--- Part 2 ---
Bad news, we don't care about radius/threshold at all, we instead perform a replace operation for each char.
Not only that, since we need to run the same operation multiple times on the input, we can't actually use a
circular localised buffer since we need to store f(x)'s result: x' and then run f(x') to get x'' until no more removals.
*/

func partTwo() int {
	file, error := os.Open("./day-04-input.txt")
	if error != nil {
		log.Fatal(error)
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	scanner.Split(bufio.ScanLines)

	buffer := []string{}
	for {
		if !scanner.Scan() {
			break
		}
		buffer = append(buffer, scanner.Text())
	}

	totalRemoved := 0
	for {
		removed := 0
		buffer, removed = partTwoIterate(buffer)
		if removed > 0 {
			totalRemoved += removed
		} else {
			break
		}
	}
	return totalRemoved
}

func partTwoIterate(buffer []string) ([]string, int) {
	totalCount := 0
	bufferPrime := make([]string, len(buffer), cap(buffer))
	for rowIndex := range buffer {
		row := buffer[rowIndex]
		bufferPrime[rowIndex] = row
		for colIndex := range len(row) {
			cellCount := 0
			col := string(row[colIndex])
			if col == "@" {
				for checkRow := max(rowIndex-radius, 0); checkRow <= min(rowIndex+radius, len(buffer)-1); checkRow++ {
					if cellCount >= threshold {
						break
					}
					for checkCol := max(colIndex-radius, 0); checkCol <= min(colIndex+radius, len(row)-1); checkCol++ {
						if cellCount >= threshold {
							break
						}
						if checkCol == colIndex && checkRow == rowIndex {
							continue
						}
						if string(buffer[checkRow][checkCol]) == "@" {
							cellCount++
						}
					}
				}
				if cellCount < threshold {
					totalCount++
					replaced := []rune(bufferPrime[rowIndex])
					replaced[colIndex] = '.'
					bufferPrime[rowIndex] = string(replaced)
				}
			}
		}
	}
	return bufferPrime, totalCount
}
