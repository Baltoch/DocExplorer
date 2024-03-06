import express from "express";

export default (db) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        const sql = 'SELECT * FROM jobs WHERE status = "awaitingocr" ORDER BY date LIMIT 1';
        db.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            res.json(results);
        });
    });
    
    return router;
};