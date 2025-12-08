--[[
  --- Day 3: Lobby ---
  https://adventofcode.com/2025/day/3
]]

--[[
  --- Part 1 ---
  Here we have to essentially find the two highest digits in a row of numbers
  to produce the highest 2-digit number possible chosing two digits left-to-right.
  Handy cheat sheet: https://devhints.io/lua
]]

local joltage, rowLength, digits = 0, 100, 12
for line in io.lines("./day-03-input.txt") do
  local best = {}
  for i = 1, rowLength do
    local digit = tonumber(line:sub(i, i))
    local betterFound = false
    for j = 1, digits do
      -- We clear out if we can no longer use these numbers
      if (betterFound) then
        best[j] = nil
        -- We fill if we don't have enough digits
      elseif (best[j] == nil) then
        best[j] = digit
        break
        -- A new best?
      elseif (digit > best[j]) then
        -- We can only find better when there's enough digits left
        if (i <= (rowLength - digits) + j) then
          best[j] = digit
          betterFound = true
        end
      end
    end
  end
  local value = ""
  for k, v in pairs(best) do
    if (#value > digits) then break end
    value = value .. tostring(v)
  end
  joltage = joltage + tonumber(value)
end
print(joltage)

-- Result: 17343

--[[
  --- Part 2 ---
  Hahahaha, now we need 12 digits. Easy-peasy since that was a parameter all along.
]]

-- Result: 172664333119298
