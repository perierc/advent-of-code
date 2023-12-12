import re

spelled_out_numbers = "one two three four five six seven eight nine".split()
regex = "(?=(" + "|".join(spelled_out_numbers) + "|\\d))"

sum_calibration_values_part_1 = 0
sum_calibration_values_part_2 = 0


def to_digit_str(string):
    if string in spelled_out_numbers:
        return str(spelled_out_numbers.index(string) + 1)
    return string


with open("input.txt") as input:
    for line in input:
        digits = [ch for ch in line if ch.isdigit()]
        sum_calibration_values_part_1 += int(digits[0] + digits[-1])
        digits_including_spelled_out = [*map(to_digit_str, re.findall(regex, line))]
        sum_calibration_values_part_2 += int(
            digits_including_spelled_out[0] + digits_including_spelled_out[-1]
        )

print("Part 1:", sum_calibration_values_part_1)
print("Part 2:", sum_calibration_values_part_2)
