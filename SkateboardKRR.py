# Import skateboarding tricks
import os
import os.path
import pandas as pd
script_path = os.path.abspath(__file__)
script_dir = os.path.dirname(script_path)
os.chdir(script_dir)
tricks = pd.read_csv("Skateboarding Tricks.csv")

# ACTUAL CODE
# Import companionsKQML package
from companionsKQML import *

# Define a class for your Pythonian agent
class MyAgent(Pythonian):

    # Define the constructor
    def __init__(self, **kwargs):
        # Call the parent constructor with your agent's name
        super().__init__(**kwargs)

        # Add some facts using insert performative
        self.insert(Expression(["isa", "John", "Person"]))
        self.insert(Expression(["likes", "John", "Pizza"]))

        # Do some reasoning using ask_one performative
        answer = self.ask_one(Expression(["likes", "?x", "Pizza"]))
        
        # Print out the answer
        print(answer)

# Use convenience function to create an instance of your agent 
agent = MyAgent.parse_command_line_args()

# Start listening for KQML messages from Companion 
agent.listen()