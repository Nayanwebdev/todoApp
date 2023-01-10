const express = require("express");

const expressLayouts = require("express-ejs-layouts");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

require("dotenv/config");

const app = express();

const port = process.env.PORT || 4000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URL_STRING);

const todoSchema = mongoose.Schema({
    task_title: {
        type: String,
        required: true,
    },
    task_content: {
        type: String,
        required: true,
    },
});
const task = mongoose.model("task", todoSchema);

app.get("/", function (req, res) {
    res.render("index");
});

app.post("/addTask", function (req, res) {
    try {
        const title = req.body.task_title;
        const content = req.body.task_content;
        task.create({ task_title: title, task_content: content }, res.redirect("/"));
    } catch (error) {
        res.send(error.message);
    }
});

app.get("/showTask", function (req, res) {
    try {
        task.find({}, (err, foundTask) => {
            // console.log(foundTask);
            res.render("showTask", { newTask: foundTask });
        });
    } catch (error) {
        res.send(error.message);
    }
});

app.get("/deleteTask/:id", (req, res) => {
    let id = req.params.id;

    task.findByIdAndDelete(id, (err) => {
        res.redirect("back");
    });
});

app.listen(port, function (err) {
    if (err) {
        console.log("something went wrong");
    } else {
        console.log("listening on port " + port);
    }
});
