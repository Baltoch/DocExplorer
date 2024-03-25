import express from "express";

export default (db) => {
    const router = express.Router();

    // Get a specific user by ID
    router.get('/:id', (req, res) => {
        const id = req.params.id;
        const sql = `SELECT * FROM users WHERE id = ?`;
        db.query(sql, id, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            res.json(result);
        });
    });

    // Get webpage data for a specific user by ID
    router.get('/:id/load', (req, res) => {
        let response = {};
        const id = req.params.id;
        const sql1 = `SELECT * FROM users WHERE id = ?`;
        const sql2 = `SELECT * FROM jobs WHERE userid = ?`;
        const sql3 = `SELECT status, COUNT(*) AS count FROM jobs WHERE userid = ? GROUP BY status`;
        db.query(sql1, id, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            response.user = result[0];
            db.query(sql2, id, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                }
                response.jobs = result;
                db.query(sql3, id, (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send(err);
                    }
                    result.forEach(element => {
                        response = {
                            ...response,
                            [element.status]: element.count
                        }
                    });
                    res.json(response);
                });
            });
        });
    });

    // Get all users
    router.get('/', (req, res) => {
        const sql = 'SELECT * FROM users';
        db.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            res.json(results);
        });
    });

    // Create a new user
    router.post('/', (req, res) => {
        const { first_name, last_name, email, password } = req.body;
        const sql = `INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)`;
        db.query(sql, [first_name, last_name, email, password], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            res.send('User created successfully');
        });
    });

    // Update a user
    router.put('/:id', (req, res) => {
        const id = req.params;
        const { first_name, last_name, email, password } = req.body;
        const sql = `UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ? WHERE id = ?`;
        db.query(sql, [first_name, last_name, email, password, id], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            res.send('User updated successfully');
        });
    });

    // Delete a user
    router.delete('/:id', (req, res) => {
        const id = req.params;
        const sql = `DELETE FROM users WHERE id = ?`;
        db.query(sql, id, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            res.send('User deleted successfully');
        });
    });
    return router;
};