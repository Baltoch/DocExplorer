import express from "express";
import { HuggingFaceInference } from "langchain/llms/hf";
import PDFDocument from "pdfjs-dist";

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:3000';
const FILE_DIRECTORY = process.env.FILE_DIRECTORY || '/app/docexplorer/';
const app = express();

function correctJsonSyntax(jsonString) {
    // Get rid of previous text
    jsonString = jsonString.split('{')[1];

    // Check for missing closing quotes
    jsonString = jsonString.replace('/("[^"]*")(?![^[]*\])/g', '$1"');

    // Check for missing closing braces
    const openingBraceCount = (jsonString.match('/{/g') || []).length;
    const closingBraceCount = (jsonString.match('/}/g') || []).length;

    if (openingBraceCount > closingBraceCount) {
        const missingBraceCount = openingBraceCount - closingBraceCount;
        jsonString += '}'.repeat(missingBraceCount);
    }

    return jsonString;
}

app.post('/', async (req, res) => {
    let job = {
        title: req.body.title,
        images: req.body.images,
        result: req.body.result,
        id: req.body.id,
        userid: req.body.userid,
        tags: req.body.tags,
        status: req.body.status
    };
    try {
        const response = await axios.get(`${BACKEND_URL}/${job.result}`, { responseType: 'stream' });

        // Initialize an array to store extracted text
        const textContent = [];

        // Load the PDF document from the stream
        const pdfDocument = await PDFDocument.load(response.data);

        // Iterate through each page of the PDF
        for (let i = 0; i < pdfDocument.numPages; i++) {
            // Get the text content of each page
            const page = await pdfDocument.getPage(i + 1); // Page indices are 1-based
            const content = await page.getTextContent();

            // Extract text from the content items
            for (const item of content.items) {
                textContent.push(item.str);
            }
        }

        // Join all extracted text items into a single string
        const documentText = textContent.join('\n');

        // Set up LangChain
        const model = new HuggingFaceInference({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        });

        // Sends request to the LLM
        const llmRes = await model.invoke(`
        Here's the content of a document titled ${job.title} :
    
        ${documentText}
    
        Based on the previous content, create a json file with the following fields :
        - title: Title of the document or null
        - authors: Authors of the document names separated by ',' or null if not found
        - creation_date: Creation date of the document or null if not found
        - modification_date: Modification date of the document or null if not found
        - type: Type of the document (invoice, research paper, etc...) or "other" if unknown
        - summary: A short summary of the document
        - keywords: Keywords associated with the document separated by ','
    
        Your response should be a functionnal json file starting with a curly bracket and ending with a curly bracket with the following structure:
        {
            "title": ,
            "authors": ,
            "creation_date": ,
            "modification_date": ,
            "type": ,
            "summary": ,
            "keywords": ,
        }
        `);
        const metadataJSON = correctJsonSyntax(llmRes);
        res.json(metadataJSON);
    } catch (error) {
        console.error('Error:', error);
        res.sendStatus(500).send(`Error: ${error}`);
    }
})