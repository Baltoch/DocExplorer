import express from "express";
import amqp from 'amqplib/callback_api.js';

const JOBBROKER_URL = process.env.JOBBROKER_URL || 'amqp://jobbroker:5672';

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
        db.query(sql, [title, status, nextstep, userid, result, images], (err, queryResult) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            amqp.connect(JOBBROKER_URL, function(error0, connection) {
                if (error0) {
                    res.status(500).send(`Error: ${error0}`);
                }
                connection.createChannel(function(error1, channel) {
                    if (error1) {
                        res.status(500).send(`Error: ${error1}`);
                    }

                    var queue = 'ocr';

                    const job = {
                        id: queryResult.insertId,
                        title: title,
                        status: status,
                        nextstep: nextstep,
                        userid: userid,
                        result: result,
                        images: images,
                    }
                    var msg = JSON.stringify(job);

                    channel.assertQueue(queue, {
                        durable: false
                    });
                    channel.sendToQueue(queue, Buffer.from(msg));

                    console.log(" [x] Sent %s", msg);
                });
                setTimeout(function() {
                    connection.close();
                }, 500);
            });
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