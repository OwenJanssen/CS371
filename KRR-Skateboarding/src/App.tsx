import React, { useState } from 'react'
import Papa from "papaparse";
import './App.css'
import { createPortal } from 'react-dom';

// Allowed extensions for input file
const allowedExtensions = ["csv"];

function App() {
  const [name, setName] = useState("");

  // This state will store the parsed data
  const [tricks, setTricks] = useState([]);

  // It state will contain the error when
  // correct file extension is not used
  const [error, setError] = useState("");

  // It will store the file uploaded by the user
  const [file, setFile] = useState("");

  const [selectedTricks, setSelectedTricks] = useState<string[]>([])

  const [parsed, setParsed] = useState(false)

  // This function will be called when
  // the file input changes
  const handleFileChange = (e) => {
    setError("");

    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      // If input type is correct set the state
      setFile(inputFile);
    }
  };

  const handleParse = () => {
    setParsed(true)
    // If user clicks the parse button without
    // a file we show a error
    if (!file) return setError("Enter a valid file");

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      const columns = Object.keys(parsedData[0]);
      setTricks(parsedData.filter((trick) => trick["Trick Name"] != ""));
      console.log(parsedData.filter((trick) => trick["Trick Name"] != ""))
    };
    reader.readAsText(file);
  };

  const updateSelectedTricks = (trick: string) => {
    console.log(selectedTricks)
    setSelectedTricks(s => (s.includes(trick)) ? [...s.filter(t => t != trick)] : [...s, trick])
  }

  const writePersonalFactsFile = () => {
    const element = document.createElement("a");

    var contents = "(in-microtheory NU-Skateboarding)\n\n"
    const nameWithoutSpaces = name.replaceAll(" ", "")
    contents += `(isa ${nameWithoutSpaces} Person)\n`
    for (const trick of tricks) {
      if (selectedTricks.includes(trick["Trick Name"])) {
        contents += `(personKnowsTrick ${nameWithoutSpaces} ${trick["Trick Name"].replaceAll(" ", "")})\n`
      }
      else {
        contents += `(personNotKnowsTrick ${nameWithoutSpaces} ${trick["Trick Name"].replaceAll(" ", "")})\n`
      }
    }

    const file = new Blob([contents], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${nameWithoutSpaces}.krf`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  const writeGeneralFactsFile = () => {
    const element = document.createElement("a");

    var facts = "(in-microtheory NU-Skateboarding)\n\n"

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

    facts += "(isa trickDifficulty Predicate)\n"
    facts += "(arity trickDifficulty 2)\n"
    facts += "(arg1Isa trickDifficulty SkateboardingTrick)\n"
    facts += "(arg2Isa trickDifficulty Integer)\n\n"

    if (!error) {
      for (const trick of tricks) {
        var name = String(trick["Trick Name"]).replaceAll(" ", "")
        var rotationDirection = String(trick["Rotation Direction"]) != "" ? String(trick["Rotation Direction"]) : "Clockwise"
        var boardRotation = String(trick["Board Rotation"]) != "" ? String(trick["Board Rotation"]).replace(".0", "") : "0"
        var bodyRotation = String(trick["Body Rotation"]) != "" ? String(trick["Body Rotation"]).replace(".0", "") : "0"
        var boardFlip = String(trick["Board Flip"]) != "" ? String(trick["Board Flip"]) : "0"

        facts += "(genls " + name + " SkateboardingTrick)\n"
        facts += "(isa " + name + " FirstOrderCollection)\n"
        var alternativeName = String(trick["Alternative Name"]).replaceAll(" ", "")
        if (alternativeName != "") {
          facts += "(genls " + alternativeName + " SkateboardingTrick)\n"
          facts += "(isa " + alternativeName + " FirstOrderCollection)\n"
          facts += "(equals " + name + " " + alternativeName + ")\n"
        }

        if (boardRotation == "0") {
          facts += "(trickContains " + name + " (BoardRotation " + (rotationDirection == "Clockwise" ? "Counter-clockwise" : "Clockwise") + " " + boardRotation + "))\n"
        }
        facts += "(trickContains " + name + " (BoardRotation " + rotationDirection + " " + boardRotation + "))\n"
        if (bodyRotation == "0") {
          facts += "(trickContains " + name + " (BodyRotation " + (rotationDirection == "Clockwise" ? "Counter-clockwise" : "Clockwise") + " " + bodyRotation + "))\n"
        }
        facts += "(trickContains " + name + " (BodyRotation " + rotationDirection + " " + bodyRotation + "))\n"

        var boardFlipDirection = "Clockwise"
        if (boardFlip == "Kickflip") {
          boardFlip = "360"
        }

        else if (boardFlip == "Heelflip") {
          boardFlip = "360"
          boardFlipDirection = "Counter-clockwise"
        }

        else if (boardFlip == "2 Kickflips") {
          boardFlip = "720"
        }

        else if (boardFlip == "2 Heelflips") {
          boardFlip = "720"
          boardFlipDirection = "Counter-clockwise"
        }

        else {
          boardFlip = "0"
        }

        if (boardFlip == "0") {
          facts += "(trickContains " + name + " (BoardFlip " + "Counter-clockwise" + " " + boardFlip + "))\n"
        }
        facts += "(trickContains " + name + " (BoardFlip " + boardFlipDirection + " " + boardFlip + "))\n"

        facts += "(trickDifficulty " + name + " " + trick["Difficulty"] + ")\n\n"
      }
    }

    facts += "(isa personKnowsTrick Predicate)\n(arity personKnowsTrick 2)\n(arg1Isa personKnowsTrick Person)\n(arg2Isa personKnowsTrick SkateboardingTrick)\n\n"
    facts += "(isa personKnowsTrickComponent Predicate)\n(arity personKnowsTrickComponent 2)\n(arg1Isa personKnowsTrickComponent Person)\n(arg2Isa personKnowsTrickComponent TrickComponent)\n\n"
    facts += "(<== (personKnowsTrickComponent ?person ?trickComponent)\n (personKnowsTrick ?person ?trick)\n (trickContains ?trick ?trickComponent))\n\n"

    facts += "(isa personNotKnowsTrick Predicate)\n(arity personNotKnowsTrick 2)\n(arg1Isa personNotKnowsTrick Person)\n(arg2Isa personNotKnowsTrick SkateboardingTrick)\n\n"

    facts += "(isa personCanLearnTrick Predicate)\n(arity personCanLearnTrick 2)\n(arg1Isa personCanLearnTrick Person)\n(arg2Isa personCanLearnTrick SkateboardingTrick)\n"
    facts += "(<== (personCanLearnTrick ?person ?trick)\n(personNotKnowsTrick ?person ?trick)\n(personKnowsTrickComponent ?person (BoardRotation ?direction ?boardRotation))\n (personKnowsTrickComponent ?person (BodyRotation ?direction ?bodyRotation))\n (personKnowsTrickComponent ?person (BoardFlip ?flip-direction ?boardFlip))\n"
    facts += " (trickContains ?trick (BoardRotation ?direction ?boardRotation))\n (trickContains ?trick (BodyRotation ?direction ?bodyRotation))\n (trickContains ?trick (BoardFlip ?flip-direction ?boardFlip)))\n\n"

    facts += "(isa personShouldLearnTrick Predicate)\n(arity personShouldLearnTrick 3)\n(arg1Isa personShouldLearnTrick Person)\n(arg2Isa personShouldLearnTrick Integer)\n(arg3Isa personShouldLearnTrick Skateboarding)"
    facts += "(<== (personShouldLearnTrick ?person ?difficulty ?trick)\n (trickDifficulty ?trick ?trick-difficulty)\n (lessThanOrEqualTo ?trick-difficuly ?difficulty))"

    const file = new Blob([facts], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `SkateboardingFacts.krf`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  return (
    <div>
      <div style={{display: "flex", flexDirection: "row", marginTop: "3rem"}}>
        <h1>SkateS</h1><h1 style={{color: "green"}}>KOOL</h1>
      </div>

      <label htmlFor="csvInput" style={{ display: "block" }}>
        Enter Skateboarding Tricks CSV File
      </label>
      <input
        onChange={handleFileChange}
        id="csvInput"
        name="file"
        type="File"
      />

      {file !== "" && <div>
        <button onClick={handleParse}>Parse</button>
      </div>}

      {parsed &&
        <div style={{ display: "flex", flexDirection: "row", marginTop: "3rem", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <div style={{ whiteSpace: "pre", fontSize: "Large" }}>Name: </div>
            <input type="text" value={name} onChange={e => (setName(e.target.value))} style={{ fontSize: "Large" }} />
          </div>
          <div>Highest Difficulty of Known Trick: {Math.max(...selectedTricks.map(t => {
            return parseInt(tricks.filter(trick => trick["Trick Name"] == t)[0]["Difficulty"])
          }), 0)}</div>
          <button style={{ backgroundColor: "green" }} onClick={() => { writePersonalFactsFile(); writeGeneralFactsFile(); }}>Download .krf files</button>
        </div>
      }

      <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "auto auto auto auto", columnGap: "50px", rowGap: "25px" }}>
        {error ? error : tricks.map((trick, idx) =>
          <div key={idx}>
            <button style={{ backgroundColor: selectedTricks.includes(trick["Trick Name"]) ? "green" : "black", color: "white", width: "200px" }}
              onClick={() => updateSelectedTricks(trick["Trick Name"])}>
              {trick["Trick Name"]}
            </button>
          </div>)
        }
      </div>
    </div>
  );
}

export default App

