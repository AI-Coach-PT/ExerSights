filenames=['pose1',
           'pose2',
           'pose3',
           'pose4',
           'pose5',
           'pose6',
           'pose7',
           'pose8',
           'pose9',
           'pose10',
           'tasksVision1',
           'tasksVision2',
           'tasksVision3',
           'tasksVision4',
           'tasksVision5',
           'tasksVision6',
           'tasksVision7',
           'tasksVision8',
           'tasksVision9',
           'tasksVision10',
           'test']

def parse_and_measure(filename):
    # Open the file in read mode
    with open(f'{filename}.txt', 'r') as file:
        # Read all lines from the file
        lines = file.readlines()

    # Initialize an empty list to store the extracted numbers
    numbers = []

    # Extract numbers from the file
    for line in lines:
        parts = line.split()
        if len(parts) > 1:
            try:
                number = int(parts[1])  # Extract the number
                numbers.append(number)
            except ValueError:
                continue  # Skip lines that don't contain valid numbers

    # Calculate differences between adjacent elements
    differences = [numbers[i + 1] - numbers[i] for i in range(len(numbers) - 1)]

    # Calculate the average difference
    if differences:
        average_difference = sum(differences) / len(differences)
    else:
        average_difference = 0

    # Output results
    # print("Differences:", differences)
    print(f"{filename}:{average_difference} milliseconds")

if __name__=="__main__":
    for filename in filenames:
        parse_and_measure(filename)
