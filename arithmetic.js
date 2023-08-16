// A slight modification of a JavaScript interpreter (https://esolangs.org/wiki/Talk:Arithmetic) by the esolang user PythonshellDebugwindow, which is put in the public domain.
function arithmetic(program,input)
{
    const lines = program.split("\n");
    let output = "";
    let state = 0, currentExam = 0;
    let currentProblem, currentChoice, pointsEarned;
    let correctAnswer, problemPoints, answerDict;
    let m; //Holds the result of RegExp matches
    let currentLineNumber = 0;
    
    for(const line of lines)
    {
        ++currentLineNumber;
        //Skip empty lines
        if(line === "")
        {
            continue;
        }
        //State 0 (begin exam)
        else if(state === 0)
        {
            if(line === `==Begin Exam ${currentExam + 1}==`)
            {
                ++currentExam;
                state = 1;
                currentProblem = 1;
                pointsEarned = 0;
                continue;
            }
        }
        //State 1 (begin problem, end exam)
        else if(state === 1)
        {
            //Match a problem declaration, e.g. 1. 2+3=? (100 points)
            if((m = line.match(/^([0-9]+). ([0-9]+)\+([0-9]+)=\? \(([0-9]+) points\)$/)))
            {
                //Must be positive integers
                if((+m[2]) > 0 && (+m[3]) > 0)
                {
                    //Check if the problem number is correct
                    if((+m[1]) === currentProblem)
                    {
                        ++currentProblem;
                        answerDict = {};
                        currentChoice = 0;
                        correctAnswer = (+m[2]) + (+m[3]);
                        problemPoints = m[4];
                        ++state;
                        continue;
                    }
                }
            }
            else if(line === `==End Exam ${currentExam}==`)
            {
                state = 0;
                output += String.fromCharCode(pointsEarned % 256);
                continue;
            }
        }
        //State 2 (problem choices)
        else if(state === 2)
        {
            //Match the current choice letter (A, B, etc.) followed by a period, space, then number
            if(m = line.match(new RegExp("^(" + String.fromCharCode(currentChoice + 65) + ")\. ([0-9]+)$")))
            {
                //Problems can have up to 26 choices
                if(currentChoice < 26)
                {
                    ++currentChoice;
                    //Must be a positive integer
                    if(+m[2] > 0)
                    {
                        //Check for duplicate correct answers
                        if(!(Object.values(answerDict).indexOf(m[2]) > -1 && (+m[2]) === correctAnswer))
                        {
                            answerDict[m[1]] = m[2];
                            continue;
                        }
                    }
                }
            }
            else if((m = line.match(/^Answer: ([A-Z])$/)))
            {
                //Check whether the chosen answer is a valid choice
                if(m[1].charCodeAt(0) - 65 < currentChoice)
                {
                    //Check whether the chosen answer is correct
                    if((+answerDict[m[1]]) === correctAnswer)
                    {
                        pointsEarned += (problemPoints % 256);
                    }
                    --state;
                    continue;
                }
            }
        }
        throw new Error("Invalid syntax on line " + currentLineNumber);
    }
    if(state !== 0)
    {
        //The last line was not the end of an exam
        throw new Error("Unexpected end of input");
    }
    return output;
}