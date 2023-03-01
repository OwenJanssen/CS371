# TODO:
# Remove spaces from trick names
# Fix NaNs in equals expressions

# Import skateboarding tricks
import os
import os.path
import pandas as pd
script_path = os.path.abspath(__file__)
script_dir = os.path.dirname(script_path)
os.chdir(script_dir)
tricks = pd.read_csv("Skateboarding Tricks.csv")

print(tricks)
facts = ""

facts += "(genls SkateboardingTrick (TransporterStuntFn Skateboard))\n"
facts += "(isa SkateboardingTrick TemporalObjectType)\n"

facts += "(isa RotationDirection FirstOrderCollection)\n"
facts += "(isa Clockwise Collection)\n"
facts += "(genls Clockwise RotationDirection)\n"
facts += "(isa Counter-clockwise Collection)\n"
facts += "(genls Counter-clockwise RotationDirection)\n"

facts += "(isa TrickComponent FirstOrderCollection)\n"

facts += "(isa BoardRotation FunctionOrFunctionalPredicate)\n"
facts += "(arity BoardRotation 2)\n"
facts += "(arg1isa BoardRotation RotationDirection)\n"
facts += "(arg2isa BoardRotation Integer)\n"
facts += "(resultIsa BoardRotation TrickComponent)\n"

facts += "(isa BodyRotation FunctionOrFunctionalPredicate)\n"
facts += "(arity BoardRotation 2)\n"
facts += "(arg1isa BoardRotation RotationDirection)\n"
facts += "(arg2isa BoardRotation Integer)\n"
facts += "(resultIsa BoardRotation TrickComponent)\n"

facts += "(isa BoardFlip FunctionOrFunctionalPredicate)\n"
facts += "(arity BoardFlip 2)\n"
facts += "(arg1isa BoardFlip RotationDirection)\n"
facts += "(arg2isa BoardFlip Integer)\n"
facts += "(resultIsa BoardFlip TrickComponent)\n"

facts += "(isa trickContains Predicate)\n"
facts += "(arity trickContains 2)\n"
facts += "(arg1Isa trickContains SkateboardingTrick)\n"
facts += "(arg2Isa trickContains TrickComponent)\n"

for index, trick in tricks.iterrows():
    name = str(trick["Trick Name"])
    rotationDirection = str(trick["Rotation Direction"]) if trick["Rotation Direction"]!="NaN" else "Clockwise"
    boardRotation = str(trick["Board Rotation"]) if trick["Board Rotation"]!="NaN" else "0"
    bodyRotation = str(trick["Body Rotation"]) if trick["Body Rotation"]!="NaN" else "0"
    boardFlip = str(trick["Board Flip"]) if trick["Board Flip"]!="NaN" else "0"
    
    facts += "(genls " + name + " SkateboardingTrick)\n"
    if trick["Alternative Name"] != "NaN":
        # define the trick having another name
        facts += "(equals " + name + str(trick["Alternative Name"]) + ")\n"

    if rotationDirection == "BS":
        rotationDirection = "Clockwise"
    
    elif rotationDirection == "BS":
        rotationDirection = "Counter-Clockwise"

    facts += "(trickContains " + name + " (BoardRotation " + rotationDirection + " " + boardRotation + "))\n"
    facts += "(trickContains " + name + " (BodyRotation " + rotationDirection + " " + bodyRotation + "))\n"
    
    boardFlipDirection = "Clockwise"
    if boardFlip == "None":
        boardFlip == "0"

    elif boardFlip == "Kickflip":
        boardFlip = "360"
        
    elif boardFlip == "Heelflip":
        boardFlip = "360"
        boardFlipDirection = "Counter-clockwise"

    elif boardFlip == "2 Kickflips":
        boardFlip = "720"
    
    elif boardFlip == "2 Heelflips":
        boardFlip = "720"
        boardFlipDirection = "Counter-clockwise"

    facts += "(trickContains " + name + " (BoardFlip " + boardFlipDirection + " " + boardFlip + "))\n"

f = open("skateboardfacts.krf", "w")
f.write(facts)
f.close()