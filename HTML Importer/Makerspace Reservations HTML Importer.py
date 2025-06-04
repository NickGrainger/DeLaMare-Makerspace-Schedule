

def extract_lines(html_path):
    with open(html_path, 'r') as html_file:
        lines = [line.replace('\t', '').strip() for line in html_file]

    return lines

def parse_lines(array):
    parsedArray = []
    for i in range(len(array) - 1):
        if array[i] == "<h2>":
            parsedArray.append(array[i + 1])
        elif array[i] == "<tr class=\"status-2\">":
            parsedArray.append(array[i+2])

    return parsedArray


# Usage
lines = extract_lines('test1.html')
parsed = parse_lines(lines)
for items in parsed:
    print(items)
