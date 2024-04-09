import { HuggingFaceInference } from "langchain/llms/hf";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:3000';
const FILE_DIRECTORY = process.env.FILE_DIRECTORY || '/app/docexplorer/';

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

// Function to load a PDF file from a URL and convert response data to a buffer
async function fetchPDFFromURL(url) {
    const response = await axios.get(url, {
        responseType: 'arraybuffer'
    });
    return response.data;
}

// Function to extract text content from all pages of a PDF
async function extractTextFromPDF(pdfBuffer) {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const numPages = pdfDoc.getPages().length;
    let allText = '';

    for (let i = 0; i < numPages; i++) {
        const page = pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        allText += textContent.items.map((item) => item.str).join(' ') + '\n';
    }

    return allText;
}

export default async function handleJob(job) {
    try {
        const pdfBuffer = await fetchPDFFromURL(`${BACKEND_URL}/files/${job.result}`);
        const documentText = await extractTextFromPDF(pdfBuffer);

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
        pdfDoc = PDFDocument.load(pdfBuffer).then((pdfDoc) => {
            const metadata = pdfDoc.catalog.getOrCreateDict('Metadata');
            for (const [key, value] of Object.entries(JSON.parse(metadataJSON))) {
                if (typeof value === 'object') {
                  metadata.set(PDFName.of(key), PDFString.of(JSON.stringify(value)));
                } else {
                  metadata.set(PDFName.of(key), PDFString.of(value));
                }
            }
            // Save the modified PDF document
            const modifiedPdfBytes = pdfDoc.save();
            axios.post(`${BACKEND_URL}/files/`, modifiedPdfBytes)
            .catch((err) => {
                console.error('Error: %s', err);
                return;
            })
        })
    } catch (error) {
        console.error('Error: %s', error);
        return;
    }
    return job;
};