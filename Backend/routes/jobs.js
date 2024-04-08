import express from "express";
import axios from "axios";

export default (db) => {
    const router = express.Router();

    // Get all jobs
    router.get('/', (req, res) => {
        const sql = 'SELECT * FROM jobs';
        db.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            res.json(results);
        });
    });

    // Get all jobs submited by a specific user
    router.get('/:id', (req, res) => {
        const { userid } = req.params;
        const sql = `SELECT * FROM jobs WHERE userid = ?`;
        db.query(sql, userid, (err, result) => {
        if (err) {
            console.log(err);
                res.status(500).send(err);
        }
        res.json(result);
        });
    });

    // Get a specific job by ID
    router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM jobs WHERE id = ?`;
    db.query(sql, id, (err, result) => {
        if (err) {
            console.log(err);
                res.status(500).send(err);
        }
        res.json(result);
    });
    });

    // Create a new job
    router.post('/', (req, res) => {
        const { title, status, nextstep, userid, result, images } = req.body;
        const sql = `INSERT INTO jobs (title, status, nextstep, userid, result, images) VALUES (?, ?, ?, ?, ?, ?);`;
        db.query(sql, [title, status, nextstep, userid, result, images], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            axios.post('ocr:3030', {
                title: title, 
                status: status, 
                nextstep: nextstep, 
                userid: userid, 
                result: result, 
                images: images,
            })
            .then(() => {
                res.json(result);
            }
            )
            .catch((err) => {
                res.status(500).send(err);
            })
        });
    });

    // Update a job
    router.put('/:id', (req, res) => {
        const { id } = req.params;
        const { status, userid, result, images } = req.body;
        const sql = `UPDATE jobs SET status = ?, userid = ?, result = ?, images = ? WHERE id = ?`;
        db.query(sql, [status, userid, result, images, id], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            res.send('Job updated successfully');
        });
    });

    // Delete a job
    router.delete('/:id', (req, res) => {
        const { id } = req.params;
        const sql = `DELETE FROM jobs WHERE id = ?`;
        db.query(sql, id, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            res.send('Job deleted successfully');
        });
    });
    return router;
};