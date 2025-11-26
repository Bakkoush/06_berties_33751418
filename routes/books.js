// Create a new router
const express = require("express");
const router = express.Router();

// SEARCH PAGE
router.get('/search', function(req, res, next){
    res.render("search.ejs");
});

// SEARCH RESULT SIMPLE
router.get('/search-result', function (req, res, next) {
    res.send("You searched for: " + req.query.keyword);
});

// LIST ALL BOOKS
router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books";
    db.query(sqlquery, (err, result) => {
        if (err) next(err);
        res.render("list.ejs", { availableBooks: result });
    });
});

// ADD BOOK PAGE
router.get('/addbook', function(req, res, next) {
    res.render('addbook', { message: null });
});

// ADD BOOK HANDLER
router.post('/bookadded', (req, res, next) => {
    const name = req.body.bookname;
    const price = req.body.price;

    const sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
    db.query(sqlquery, [name, price], (err, result) => {
        if (err) next(err);
        else {
            const message = `This book is added to database, name: ${name} price ${price}`;
            res.render('addbook', { message });
        }
    });
});

// SEARCH EXACT MATCH
router.get('/search_result', function (req, res, next) {
    const keyword = req.query.search_text;

    if (!keyword) {
        return res.render("search_result.ejs", { searchTerm: "", results: [] });
    }

    const sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    const searchValue = "%" + keyword + "%";

    db.query(sqlquery, [searchValue], (err, result) => {
        if (err) next(err);
        else {
            res.render("search_result.ejs", {
                searchTerm: keyword,
                results: result
            });
        }
    });
});

// Export router
module.exports = router;
