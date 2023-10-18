const WordExtractor = require("word-extractor");
const extractor = new WordExtractor();
const express = require("express");
const multer = require("multer");
const app = express();
const port = 4000;

const storage = multer.memoryStorage(); // This stores the file in memory.
const upload = multer({ storage: storage });

// Replace "sample.docx" with the path to your .docx file.
// const filePath = "sample.docx";

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/upload', upload.single('wordFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    extractor.extract(req.file.buffer).then((document) => {
        // Get the full text content from the document.
        const textContent = document.getBody();

        // Split the text content into lines to process each line.
        const lines = textContent.split('\n');

        // Initialize arrays to store questions and answers.
        const questions = [];
        //   const answers = [];
        const option1 = [];
        const option2 = [];
        const option3 = [];
        const option4 = [];
        // (•*)| O1+:
        // Define a simple rule to identify questions and answers.
        // You may need to adapt this based on the format of your document.
        const questionRegex = /^(Q[0-9]+:|Question:)\s*(.*)/i;
        //   const answerRegex = /^(A[0-9]+:|Answer:)\s*(.*)/i;
        const option1Regex = /^(Option1:)\s*(.*)/i;
        const option2Regex = /^(Option2:)\s*(.*)/i;
        const option3Regex = /^(Option3:)\s*(.*)/i;
        const option4Regex = /^(Option4:)\s*(.*)/i;


        for (const line of lines) {
            if (questionRegex.test(line)) {
                // This line appears to be a question.
                const match = line.match(questionRegex);
                questions.push(match[2].trim());
            }
            // } else if (answerRegex.test(line)) {
            //   // This line appears to be an answer.
            //   const match = line.match(answerRegex);
            //   answers.push(match[2].trim());}
            else if (option1Regex.test(line)) {
                // This line appears to be an answer.
                const match = line.match(option1Regex);
                option1.push(match[2].trim());
            } else if (option2Regex.test(line)) {
                // This line appears to be an answer.
                const match = line.match(option2Regex);
                option2.push(match[2].trim());
            } else if (option3Regex.test(line)) {
                // This line appears to be an answer.
                const match = line.match(option3Regex);
                option3.push(match[2].trim());
            } else if (option4Regex.test(line)) {
                // This line appears to be an answer.
                const match = line.match(option4Regex);
                option4.push(match[2].trim());
            }
        }

        //Process the extracted questions and answers.
          console.log("Questions:");
          console.log(questions);

        //   console.log("Answers:");
        //   console.log(answers);

          console.log("Option1:");
          console.log(option1);

          console.log("Option2:");
          console.log(option2);

          console.log("Option3:");
          console.log(option3);

          console.log("Option4:");
          console.log(option4);
        res.send(`Text extracted from the document: <pre>Questions: ${questions} \nOption1:${option1} \nOption2:${option2} \nOption3:${option3} \nOption4:${option4}</pre>`);
    }).catch((error) => {
        res.status(500).send('Error extracting text from the document.');
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




    // }).catch((error) => {
    //     console.error("Error extracting text:", error);
    // });