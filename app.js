async function compileCode() {
    const code = editor.getValue();
    const outputElement = document.getElementById('output');
    outputElement.textContent = "Compiling...";

    try {
        const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': '9576f4c951mshc522115a1c1304ep115810jsna27b8579699b',
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            body: JSON.stringify({
                language_id: 62, // Java language ID for Judge0 API
                source_code: code,
                stdin: "",
                redirect_stderr_to_stdout: true
            })
        });
        
        const { token } = await response.json();
        setTimeout(async () => {
            const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '9576f4c951mshc522115a1c1304ep115810jsna27b8579699b',
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                }
            });
            const result = await resultResponse.json();
            
            // Check for errors
            if (result.stderr) {
                outputElement.textContent = `Error: \n${result.stderr}`;
            } else if (result.compile_output) {
                outputElement.textContent = `Compilation Error: \n${result.compile_output}`;
            } else {
                outputElement.textContent = result.stdout || "No output.";
            }
        }, 3000); // Wait for 3 seconds for compilation
    } catch (error) {
        outputElement.textContent = "Error connecting to the API.";
        console.error(error);
    }
}
