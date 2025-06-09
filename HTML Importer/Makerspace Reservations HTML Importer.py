#############################################
#                                           #
#   Makerspace Reservations HTML Importer   #
#        Designed by Nathan Gomez           #
#             copywrite 2025                #
#                                           #
#############################################

#global vars
#list of spaces (can add more if needed)
spaces = ("*00: Maker Wrangler", "*00: Maker Wrangler: 3D Modeling", "*01", "*02", "*03", "*04", "*05", "*06", "*07", "*08", "*09", "*10", "*11", "*12")

#file path to html file
filePath = "HTML Importer/LibCal_ Print Bookings.htm"

#number of 30min intervals
timeSlots = 26

#dimensions of reservation table
rows, cols = (len(spaces), timeSlots)

#reservation table (initialized to all false)
arr = [[False for i in range(cols)] for j in range(rows)]


#function extract_lines
#input: path to html file; Output: list of strings; function: reads html code line by line, removes indentations, and stores results in a list
def extract_lines(html_path):
    with open(html_path, 'r') as html_file:
        lines = [line.replace('\t', '').strip() for line in html_file]

    return lines

#function parse_lines
#input: list of strings; output: list of strings; function: Searches for only necessary strings (machine and times) and returns new list
def parse_lines(array):
    parsedArray = []
    for i in range(len(array) - 1):
        if array[i] == "<h2>":
            markedStr = array[i+1]
            symbol = "*"
            markedStr = symbol + markedStr
            parsedArray.append(markedStr)
        elif array[i] == "<tr class=\"status-2\">":
            parsedArray.append(array[i + 2])

    return parsedArray

#function: padding
#input: string; output: string; function: makes lenght of chars consistent (9:30 -> 09:30) and removes unnecessary chars
def padding(str):

    paddedStr = str
    finalChars = []
    finalStr = paddedStr
    
    if(paddedStr[1] == ':'):
        paddedStr = '0' + paddedStr
        finalStr = paddedStr

    if(paddedStr[11] == ':'):
        for i in range(0, 10):
            finalChars.append(paddedStr[i])

        finalChars.append('0')
        
        for i in range (11, 17):
            finalChars.append(paddedStr[i-1])
    
        finalStr = ''.join(finalChars)

    if(len(finalStr) > 17):
        n = len(finalStr) - 17
        finalStr = finalStr[:-n]

    return finalStr

#function: convert_to_table_index
#Input: string; Output: Tuple of 2 integers; function: calculates start and end indexes that correspond to the times given
def convert_to_table_index(str):
    #pre-process
    #note: len(str) should be 17 chars at this point
    if(len(str) != 17):
        raise TypeError("Error: Did not recieve expected data format!") 
    
    startInd = 0.0
    endInd = 0.0

    if(str[0] == '1'):
        startInd += 10.0

    if(str[10] == '1'):
        endInd += 10.0
    
    startIntValue = ord(str[1]) - ord('0')
    startInd += startIntValue

    endIntValue = ord(str[11]) - ord('0')
    endInd += endIntValue

    if(str[3] == '3'):
        startInd += 0.5

    if(str[13] == '3'):
        endInd += 0.5

    #am/pm check
    if(str[5] == 'p' and (startInd < 12)):
        startInd += 12.0

    if(str[15] == 'p' and (endInd < 12)):
        endInd += 12.0

    #convert to whole numbers
    startInd *= 2
    endInd *= 2

    #shift to fit within table (lowest value becomes 0)
    startInd -= 16
    endInd -= 16
    
    return (startInd, endInd)

#function update_table
#input: 2d array, int, int, bool; output: none; function: sets an index of 2d array to boolean value
def update_table(table, row, col, val):
    table[row][col] = val

#function load_data
#input: 3-tuple, 2d array; output: none; function: runs update_table() for each index in data
def load_data(data, table):
    #data is a 3 element tuple (machine, start time, end time)
    row, start, end = data

    start = int(start)
    end = int(end)

    for i in range (start, end):
        update_table(table, row, i, True)

#function display_table
#input: 2d array, int, int; output: none; function: (for debugging purposes) displays 2d array (1:true, 0:false)
def display_table(table, rows, cols):
    for i in range (0, rows):
        for j in range (0, cols):
            print(int(table[i][j]), end = "")

        print("\n")

#function prepareData
#input: 2d array, string, int; output: none; function: helper function that prepares strings (that contain time information)
#into a 3-tuple for load_data()
def prepareData(table, tempStr, row):
    paddedStr = padding(tempStr)
    index = convert_to_table_index(paddedStr)
    prepData = (row, )
    prepData = prepData + index
    load_data(prepData, table)

def main():
    lines = extract_lines(filePath)
    parsed = parse_lines(lines)

    print("\n")
    print("Data extracted:")
    print("---------------------------", end="")
    for i in parsed:
        for j in spaces:
            if j in i:
                print("\n")
        print(i)

    parsedCounter = 0
    machineIndex = 0

    for i in range(0, 13):
        if(spaces[i] in parsed[parsedCounter]):
            machineIndex = i
            parsedCounter += 1
            if(parsedCounter < len(parsed)):
                tempStr = parsed[parsedCounter]
                while(tempStr[0] != '*' and parsedCounter < len(parsed)-1):
                    prepareData(arr, tempStr, i)
                    tempStr = parsed[parsedCounter+1]
                    parsedCounter += 1
        
    tempStr = parsed[parsedCounter]
    prepareData(arr, tempStr, machineIndex)

    print("\n")
    print("Reservations Table:")
    display_table(arr, rows, cols)

if __name__=="__main__":
    main()