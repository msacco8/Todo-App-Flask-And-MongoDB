const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

//models
const TodoTask = require("./models/TodoTask");

const mongoose = require("mongoose");

//connection to db, much stricter connection rules than sqlite it appears?
mongoose.connect(process.env.DB_CONNECT, () => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
});

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

// view engine configuration
app.set("view engine", "ejs");

// modifying items in the database then allowing UI to reflect these changes
// is clearly unique to a framework like MongoDB and not present in something
// like Svelte.

// GET METHOD - render the todo items
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

// POST method - allows creation of new todos
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        // calling redirect on results, similar to flask's return of redirects
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

//UPDATE method - modifies current todos
app.route("/edit/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
}).post((req, res) => {
    const id = req.params.id;
    // built in methods for searching documents is a great feature
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

//DELETE method - deletes a todo
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

