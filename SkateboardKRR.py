# Import skateboarding tricks
import os
import os.path
import pandas as pd
script_path = os.path.abspath(__file__)
script_dir = os.path.dirname(script_path)
os.chdir(script_dir)
tricks = pd.read_csv("Skateboarding Tricks.csv")
from typing import Any
from logging import getLogger, DEBUG, INFO



# ACTUAL CODE
# Import companionsKQML package
from companionsKQML import *

LOGGER = getLogger(__name__)

# Define a class for your Pythonian agent
class MyAgent(Pythonian):

    # Define the constructor
    def __init__(self, **kwargs):
        # Call the parent constructor with your agent's name
        super().__init__(**kwargs)
        if self.debug:
            LOGGER.setLevel(DEBUG)
        else:
            LOGGER.setLevel(INFO)

        # Add some facts using insert performative
        self.send(listify(["isa", "John", "Person"]))
        self.send(listify(["likes", "John", "Pizza"]))

        # Do some reasoning using ask_one performative
        answer = self.add_ask(self.test_ask_return_list1)
        
        # Print out the answer
        #print(answer)

    @staticmethod
    def test_ask_return_list1(_input: Any):
        
       
        LOGGER.info('testing ask with _input %s', _input)
        return [_input]

# Use convenience function to create an instance of your agent 
agent = MyAgent(host='localhost', port=9100)
# Start listening for KQML messages from Companion 
agent.connect()