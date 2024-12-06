import os

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))
script_name = os.path.basename(__file__)

# List all .txt files in the directory except the script itself
filenames = sorted([f for f in os.listdir(script_dir) if f.endswith('.txt') and f != script_name])

def parse_and_measure(filename):
    # Open the file in read mode
    with open(f'./{filename}', 'r') as file:
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
                continue                # Skip lines that don't contain valid numbers

    # Calculate differences between adjacent elements
    differences = [numbers[i + 1] - numbers[i] for i in range(len(numbers) - 1)]

    # Calculate the average difference
    if differences:
        average_difference = sum(differences) / len(differences)
    else:
        average_difference = 0

    # Output results
    print(f"{filename:20}: {average_difference:15} milliseconds")

if __name__=="__main__":
    for filename in filenames:
        parse_and_measure(filename)
