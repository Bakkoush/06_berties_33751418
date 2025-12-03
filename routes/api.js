const express = require("express");
const router = express.Router();
const request = require("request");

// ⭐ TASK 2: Friend’s API (optional)
router.get("/friendsbooks", (req, res) => {
    const friendAPI = "http://YOUR_FRIENDS_IP:8000/api/books";  // <-- replace

    request(friendAPI, (err, response, body) => {
        if (err) {
            return res.json({ error: "Could not contact friend's API" });
        }

        try {
            const data = JSON.parse(body);
            res.json(data);
        } catch (e) {
            res.json({ error: "Invalid JSON returned from friend API" });
        }
    });
});


// ⭐ TASK 3, 4, 5: Enhanced Book API
router.get("/books", (req, res, next) => {

    // Start base SQL
    let sqlquery = "SELECT * FROM books";
    let conditions = [];
    let params = [];

    // -----------------------------
    // TASK 3: Keyword Search
    // -----------------------------
    if (req.query.search) {
        conditions.push("name LIKE ?");
        params.push("%" + req.query.search + "%");
    }

    // -----------------------------
    // TASK 4: Price Range Filter
    // -----------------------------
    if (req.query.minprice) {
        conditions.push("price >= ?");
        params.push(req.query.minprice);
    }

    if (req.query.maxprice) {
        conditions.push("price <= ?");
        params.push(req.query.maxprice);
    }

    // If conditions exist, append WHERE clause
    if (conditions.length > 0) {
        sqlquery += " WHERE " + conditions.join(" AND ");
    }

    // -----------------------------
    // TASK 5: Sorting
    // -----------------------------
    if (req.query.sort) {
        const allowedSorts = ["name", "price"];
        if (allowedSorts.includes(req.query.sort)) {
            sqlquery += " ORDER BY " + req.query.sort;
        }
    }

    // Execute SQL
    db.query(sqlquery, params, (err, result) => {
        if (err) {
            return res.json({ error: err });
        }
        res.json(result);
    });
});

module.exports = router;
