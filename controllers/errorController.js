module.exports = app => {
    app.use((req, res, next) => {
        res.render("error404");
    });
}
