import { exec } from 'child_process';
import axios from 'axios';
import fs from 'node:fs';
import FormData from 'form-data';

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:3000';
const FILE_DIRECTORY = process.env.FILE_DIRECTORY || '/app/docexplorer/';

export default async function handleJob(job) {
    return new Promise((resolve, reject) => {
        // Get Images from File Storage
        axios.get(`${BACKEND_URL}/files/${job.images}`, { responseType: 'stream' }).then((res) => {
            res.data.pipe(fs.createWriteStream(`${FILE_DIRECTORY}/${job.images}`));
        })
        .catch((err) =>{
            console.error(err);
            reject(err);
        });

        // Execute OCR
        const tesseract = exec(`tesseract "${FILE_DIRECTORY}/${job.images}" "${FILE_DIRECTORY}/${job.id}" pdf`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                reject(error.message);
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                reject(stderr);
            }
        });

        tesseract.on('close', (code) => {
            console.log('Tesseract exited with code', code);

            // Save PDF to File Storage
            const form = new FormData();
            form.append('file', fs.createReadStream(`${FILE_DIRECTORY}/${job.id}.pdf`));
            axios.post(`${BACKEND_URL}/files`, form, { headers: form.getHeaders() })
            .then((res) => {
                if(code == 0) {
                    job.result = `${job.id}.pdf`;
                    job.status = 'Processing';
                }
                else {
                    job.result = null;
                    job.status = 'Failed';
                }
                axios.put(`${BACKEND_URL}/jobs/${job.id}`, job).catch((err) => {
                    console.error(err);
                    reject(err);
                });
                fs.rm(`${FILE_DIRECTORY}/${job.id}.pdf`, () => {console.log(`${job.id}.pdf deleted from local storage`)});
                fs.rm(`${FILE_DIRECTORY}/${job.images}`, () => {console.log(`${job.images} deleted from local storage`)});
                resolve(job);
            })
            .catch((err) => {
                console.error(err);
                reject(err);
            });
        });
    })
};