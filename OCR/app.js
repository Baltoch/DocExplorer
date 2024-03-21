import { exec } from 'child_process';
import axios from 'axios';
import fs from 'node:fs';
import FormData from 'form-data';

const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:3000';
const FILE_DIRECTORY = process.env.FILE_DIRECTORY || '/app/docexplorer/';

function handleJob(job) {
    // Get Images from File Storage
    axios.get(`${BACKEND_URL}/files/${job.images}`, { responseType: 'stream' }).then((res) => {
        res.data.pipe(fs.createWriteStream(`${FILE_DIRECTORY}/${job.images}`));
    })
    .catch((err) =>{
        console.error(err);
        return;
    });

    // Execute OCR
    const tesseract = exec(`tesseract "${FILE_DIRECTORY}/${job.images}" "${FILE_DIRECTORY}/${job.id}" pdf`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
    });

    tesseract.on('close', (code) => {
        console.log('Tesseract exited with code', code);
    });

    // Save PDF to File Storage
    const form = new FormData();
    form.append('file', fs.createReadStream(`${FILE_DIRECTORY}/${job.id}.pdf`));
    axios.post(`${BACKEND_URL}/files`, form, { headers: form.getHeaders() }).then((res) => {
        job.result = `${job.id}.pdf`;
        job.status = 'Done';
        axios.put(`${BACKEND_URL}/jobs/${job.id}`, job).catch((err) => {
            console.error(err);
            return;
        });
        fs.rm(`${FILE_DIRECTORY}/${job.id}.pdf`, () => {console.log(`${job.id}.pdf deleted from local storage`)});
        fs.rm(`${FILE_DIRECTORY}/${job.images}`, () => {console.log(`${job.images} deleted from local storage`)});
    })
    .catch((err) => {
        console.error(err);
        return;
    });
}

setInterval(() => {
    axios.get(`${BACKEND_URL}/ocr`).then((res) => {
        if(res.data[0] != undefined) handleJob(res.data[0]);
        else console.log("Waiting for a job...");
    })
    .catch((err) => {
        console.error(err);
    })
}, 1000);