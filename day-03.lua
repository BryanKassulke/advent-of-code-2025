

local f = io.open("./day-03-input.txt", "r")
local joltage = 0;
for line in f:lines() do
	local firstValue;
	local firstIndex;
	local secondValue;
	local secondIndex;
	for i = 1, #line do
		local char = line:sub(i, i)
		if (firstValue == nil) then
			firstValue = char;
			firstIndex = i;
		elseif (secondValue == nil)
		
		print(char);
	end
end