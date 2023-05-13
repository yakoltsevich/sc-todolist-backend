const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const TaskScheme = new Schema({text: String}, {versionKey: false});
const Task = mongoose.model("Task", TaskScheme);

async function main() {
    try {
        // await mongoose.connect("mongodb+srv://qwert:qwert123@cluster0.qadq9ep.mongodb.net/usersdb?retryWrites=true&w=majority");
        await mongoose.connect("mongodb://127.0.0.1:27017/tasks");
        app.listen(8000);
        console.log("Сервер запущен...");
    } catch (err) {
        return console.log(err);
    }
}

// получаем весь список задач
app.get("/api/tasks", async (req, res) => {
    const tasks = await Task.find({});
    res.send(tasks);
});

// получаем задачу по id
app.get("/api/tasks/:id", async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (task) res.send(task);
    else res.sendStatus(404);
});

// сохраняем в бд
app.post("/api/tasks", jsonParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const taskText = req.body.text;
    const task = new Task({text: taskText});
    await task.save();
    res.send(task);
});

// удаляем по id
app.delete("/api/tasks/:id", async (req, res) => {
    const id = req.params.id;
    const task = await Task.findByIdAndDelete(id);
    if (task) res.send(task);
    else res.sendStatus(404);
});

// обновляем задачу по id
app.put("/api/tasks", jsonParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const newText = req.body.text;
    const newTask = {text: newText};
    const task = await Task.findOneAndUpdate({_id: id}, newTask, {new: true});
    if (task) res.send(task);
    else res.sendStatus(404);
});

main();
// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", async () => {
    await mongoose.disconnect();
    console.log("Приложение завершило работу");
    process.exit();
});