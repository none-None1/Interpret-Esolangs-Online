// Slight modification of public domain Wizzcake+ interpreter by esolang user RainbowDash
function wizzcakep(inputPrgm){
    // Usage
    let words = inputPrgm.toUpperCase().split(" ");
    let cells = [0]; // Initalize cells
    let stack = [];
    let cursorPos = 0 // Set pointer
    let i = 0;
    let output="";
    while (i < words.length) {
        let word = words[i];
        if(word != "[" && word != "]" && word != ","){
            i++
            let hash = 0;
            for (let j = 0; j < word.length; j++) {
                hash = (hash << 5) - hash + word.charCodeAt(j);
                hash |= 0; // Convert to 32-bit integer
            }
            let seed = Math.abs(hash) / Math.pow(2, 31); // Unique number generated for every word
            if (word.length === 1) {
                seed = (word.charCodeAt(0) * 2654435761) % Math.pow(2, 31);
            }
            var x = Math.sin(seed) * 10000;
            var outputSeed = x - Math.floor(x);
            var amountOfLoops = Math.round(outputSeed * 5)+1;
            for (let i = 0; i < amountOfLoops; i++) {
                outputSeed = seed;
                x = Math.sin(outputSeed) * 10000;
                outputSeed = x - Math.floor(x);
                let instruction = Math.round(outputSeed * 9)+1;
                switch(instruction) {
                    case 1: // Move pointer right
                        cursorPos += 1 
                    break;
                    case 2: // Move pointer left
                        cursorPos -= 1 
                    break;
                    case 3: // Increment pointer cell
                        cells[cursorPos] = (cells[cursorPos] || 0) + 1;
                    break;
                    case 4: // Decrement pointer cell
                        cells[cursorPos] = Math.max(((cells[cursorPos] || 0) - 1),0);
                    break;
                    case 5: // Print out pointer cell
                        output+=(cells[cursorPos] ?? 0)+'\n';
                    break;
                    case 6: // Print out pointer cell ASCII
                        output+=(String.fromCharCode(cells[cursorPos] ?? 0))+'\n';
                    break;
                    case 7: // Pop stack
                        if (stack.length > 0){
                            output+=(stack.join(" "))+'\n';
                            stack = [];
                        }
                    break;
                    case 8: // Push cell to stack
                        stack.push(cells[cursorPos]);
                        cells[cursorPos] = 0;
                    break;
                    case 9: // Clear cell
                        cells[cursorPos] = 0;
                    break;
                    case 10: //Pop stack ASCII
                        if (stack.length > 0){
                            stack.forEach(number => {
                                output+=String.fromCharCode(number)+'\n';
                            });
                            stack = [];
                        }
                    break;
                }
                seed++;
            }
        } else {
          if(word == ","){
            var input = prompt("");
            var inputASSCI = input.split('');
            for (let h = 0; h < inputASSCI.length; h++) {
                 cells[cursorPos] = (inputASSCI[h].charCodeAt(0));
                 cursorPos += 1 
            }
            cursorPos -= 1
            i++
          } else if (word == "]") {
            if ((cells[cursorPos] || 0) <= 0) {
                i++; // Move to the next instruction
            } else {
                let loopDepth = 1;
                while (loopDepth > 0) {
                    i--; // Move back to find the matching [
                    if (words[i] === "]") {
                        loopDepth++;
                    } else if (words[i] === "[") {
                        loopDepth--;
                    }
                }
            }
          } else { i++ }
        }
    }
}