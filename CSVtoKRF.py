# Import skateboarding tricks
import os
import os.path
import pandas as pd
script_path = os.path.abspath(__file__)
script_dir = os.path.dirname(script_path)
os.chdir(script_dir)
tricks = pd.read_csv("Skateboarding Tricks.csv")

facts = "(in-microtheory NU-Skateboarding)\n\n"

facts += "(genls SkateboardingTrick (TransporterStuntFn Skateboard))\n"
facts += "(isa SkateboardingTrick TemporalObjectType)\n\n"

facts += "(isa RotationDirection FirstOrderCollection)\n"
facts += "(isa Clockwise Collection)\n"
facts += "(genls Clockwise RotationDirection)\n"
facts += "(isa Counter-clockwise Collection)\n"
facts += "(genls Counter-clockwise RotationDirection)\n\n"

facts += "(isa TrickComponent FirstOrderCollection)\n\n"

facts += "(isa BoardRotation FunctionOrFunctionalPredicate)\n"
facts += "(arity BoardRotation 2)\n"
facts += "(arg1isa BoardRotation RotationDirection)\n"
facts += "(arg2isa BoardRotation Integer)\n"
facts += "(resultIsa BoardRotation TrickComponent)\n\n"

facts += "(isa BodyRotation FunctionOrFunctionalPredicate)\n"
facts += "(arity BoardRotation 2)\n"
facts += "(arg1isa BoardRotation RotationDirection)\n"
facts += "(arg2isa BoardRotation Integer)\n"
facts += "(resultIsa BoardRotation TrickComponent)\n\n"

facts += "(isa BoardFlip FunctionOrFunctionalPredicate)\n"
facts += "(arity BoardFlip 2)\n"
facts += "(arg1isa BoardFlip RotationDirection)\n"
facts += "(arg2isa BoardFlip Integer)\n"
facts += "(resultIsa BoardFlip TrickComponent)\n\n"

facts += "(isa trickContains Predicate)\n"
facts += "(arity trickContains 2)\n"
facts += "(arg1Isa trickContains SkateboardingTrick)\n"
facts += "(arg2Isa trickContains TrickComponent)\n\n"

for index, trick in tricks.iterrows():
    name = str(trick["Trick Name"]).replace(" ", "")
    rotationDirection = str(trick["Rotation Direction"]) if str(trick["Rotation Direction"])!="nan" else "Clockwise"
    boardRotation = str(trick["Board Rotation"]).replace(".0", "") if str(trick["Board Rotation"])!="nan" else "0"
    bodyRotation = str(trick["Body Rotation"]).replace(".0", "") if str(trick["Body Rotation"])!="nan" else "0"
    boardFlip = str(trick["Board Flip"]) if str(trick["Board Flip"])!="nan" else "0"
    
    facts += "(genls " + name + " SkateboardingTrick)\n"
    facts += "(isa " + name + " FirstOrderCollection)\n"
    alternativeName = str(trick["Alternative Name"]).replace(" ", "")
    if alternativeName != "nan":
        facts += "(genls " + alternativeName + " SkateboardingTrick)\n"
        facts += "(isa " + alternativeName + " FirstOrderCollection)\n"
        facts += "(equals " + name + " " + alternativeName + ")\n"

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

    facts += "(trickContains " + name + " (BoardFlip " + boardFlipDirection + " " + boardFlip + "))\n\n"

facts += "(isa personKnowsTrick Predicate)\n(arity personKnowsTrick 2)\n(arg1Isa personKnowsTrick Person)\n(arg2Isa personKnowsTrick SkateboardingTrick)\n"
facts += "(isa personKnowsTrickComponent Predicate)\n(arity personKnowsTrickComponent 2)\n(arg1Isa personKnowsTrickComponent Person)\n(arg2Isa personKnowsTrickComponent TrickComponent)\n"
facts += "(<== (personKnowsTrickComponent ?person ?trickComponent)\n (personKnowsTrick ?person ?trick)\n (trickContains ?trick ?trickComponent))"

f = open("skateboardfacts.krf", "w")
f.write(facts)
f.close()