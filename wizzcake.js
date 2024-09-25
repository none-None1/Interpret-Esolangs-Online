// Slight modification of public domain Wizzcake interpreter by esolang user RainbowDash
function wizzcake(inputPrgm){
    // Usage
    let reg = 0;
    let stack = [];
    let words = inputPrgm.toUpperCase().split(" ");
    let output = "";
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
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
            let instruction = Math.round(outputSeed * 8)+1;
            switch(instruction) {
                case 2: // Pop stack
                    if (stack.length > 0){
                        output+=stack.join(" ")+'\n';
                        stack = [];
                    }
                break;
                case 3: // Set reg to number
                    var newRandom = Math.sin(outputSeed * 10000) * 10000;
                    reg = Math.round((newRandom - (Math.floor(newRandom)))*10000000);
                break;
                case 4: // Push reg to stack
                    stack.push(reg);
                    reg = 0;
                break
                case 5: // Subtract number from reg
                    var newRandom = Math.sin(outputSeed * 10000) * 10000;
                    reg -= Math.round((newRandom - (Math.floor(newRandom)))*10000000);
                break
                case 6: // Clear reg
                    reg = 0;
                break
                case 7: // Clear stack
                    stack = [];
                break
                case 8: //Pop stack but in ASCII letters
                    if (stack.length > 0){
                        stack.forEach(number => {
                            output+=String.fromCharCode(Math.abs(number)*0.0149878)+'\n';
                        });
                        stack = [];
                    }
                break;
            }
            seed++;
        }
    }
    return output;
}