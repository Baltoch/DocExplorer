import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { PDFDocument } from "pdf-lib";
import axios from 'axios';
import { getDocument } from "pdfjs-dist/build/pdf.mjs";

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

    return `{${jsonString}}`;
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
    pdfBuffer = Uint8Array.from(pdfBuffer);
    const loadingTask = getDocument({ data: pdfBuffer });
    const pdfDocument = await loadingTask.promise;

    const numPages = pdfDocument.numPages;
    let fullText = '';

    for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        const pageText = strings.join(' ');
        fullText += pageText + '\n'; // Add page text and newline
    }

    return fullText;
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
        console.log(`llmRes: ${llmRes}`);
        const metadataJSON = correctJsonSyntax(llmRes);
        console.log(`metadataJSON: ${metadataJSON}`);
        const metadata = JSON.parse(metadataJSON);
        console.log(`metadata: ${metadata}`);
        PDFDocument.load(Uint8Array.from(pdfBuffer))
        .then(async (pdfDoc) => {
            // Set Metadata
            if(metadata.title) pdfDoc.setTitle(job.title);
            if(metadata.authors) pdfDoc.setAuthor(metadata.authors);
            if(metadata.creation_date) pdfDoc.setCreationDate(metadata.creation_date);
            if(metadata.modification_date) pdfDoc.setModificationDate(metadata.modification_date);
            if(metadata.summary) pdfDoc.setSubject(metadata.summary);
            if(metadata.keywords) pdfDoc.setKeywords(metadata.keywords.split(','));

            // Save the modified PDF document
            const array = await pdfDoc.save();
            const form = new FormData();
            form.append('file', new File([new Blob([array], { type: 'application/pdf' })], job.result, { type: 'application/pdf' }));
            axios.post(`${BACKEND_URL}/files`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
            .catch((err) => {
                console.error('Error: %s', err);
                job = {
                    ...job,
                    status: 'Failed',
                }
                axios.put(`${BACKEND_URL}/jobs/${job.id}`, job).catch((err) => {
                    console.error(err);
                    reject(err);
                });
                return;
            })
        })
        .catch((err) => {
            console.error('Error: %s', err);
            job = {
                ...job,
                status: 'Failed',
            }
            axios.put(`${BACKEND_URL}/jobs/${job.id}`, job).catch((err) => {
                console.error(err);
                reject(err);
            });
            return;
        })
    } catch (error) {
        console.error('Error: %s', error);
        job = {
            ...job,
            status: 'Failed',
        }
        axios.put(`${BACKEND_URL}/jobs/${job.id}`, job).catch((err) => {
            console.error(err);
            reject(err);
        });
        return;
    }
    job = {
        ...job,
        status: 'Succeeded',
    }
    axios.put(`${BACKEND_URL}/jobs/${job.id}`, job).catch((err) => {
        console.error(err);
        reject(err);
    });
    return job;
};