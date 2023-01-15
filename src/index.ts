import Express, { Request } from "express"
import bodyParser from "body-parser";
import cors from "cors"
import Database from "./Database";
import path from "path";
import formidable from 'formidable';
import { v4 as uuidv4 } from 'uuid';
import sha256, { Hash, HMAC } from "fast-sha256";
import * as fs from 'fs';
import { isDeepStrictEqual } from "util";
var nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');


const app = Express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors({
    origin: "*",
    credentials: true,
}))
app.use("/static", Express.static('public'));

const database = new Database();


const QUIZ_ACTIVITY_ID = 1

//#region login / register
app.post("/register", async (req: Request<{}, {}, { username: string, password: string }>, res) => {
    // Check if user exists
    const getUserResult = await database.getUserId(req.body.username)
    if (getUserResult.success === false || getUserResult.data.length === 1) {
        return res.status(400).send({ description: "User already exists" });
    }

    // Check if username isn't too long
    if (req.body.username.length > 30) {
        return res.status(400).send({ description: "Username over 30 characters" })
    }

    // Register
    let uintPass = nacl.util.decodeUTF8(req.body.password);
    let shaPasswd = sha256(uintPass)
    let stringPasswd = new TextDecoder().decode(shaPasswd);

    const registerResult = await database.register(
        uuidv4(),
        req.body.username,
        stringPasswd,
    )
    if (registerResult.success === false) {
        return res.status(400).send({ description: "Registration error occured" });
    }

    return res.status(200).send({ description: "Registration successful" });
})

app.post("/login", async (req: Request<{}, {}, { username: string, password: string }>, res) => {
    let uintPass = nacl.util.decodeUTF8(req.body.password)
    let shaPasswd = sha256(uintPass)
    let stringPasswd = new TextDecoder().decode(shaPasswd);

    const result = await database.login(
        req.body.username,
        stringPasswd,
    )

    if (result.success === false || result.data.length !== 1) {
        return res.status(400).send({ description: "Wrong login data" });
    }

    return res.status(200).send({
        description: "Successful login",
        id: result.data[0].id,
        username: req.body.username
    });
})
//#endregion

//#region Display user data
app.post("/getUserData", async (req: Request<{}, {}, { id: string }>, res) => {
    // Single data
    const resultSingle = await database.getSingleData(req.body.id)
    if (resultSingle.success === false || resultSingle.data.length !== 1) {
        return res.status(400).send({ description: "Get single data error" });
    }
    // Skills
    const resultSkills = await database.getSkills(req.body.id)
    if (resultSkills.success === false) {
        return res.status(400).send({ description: "Get skills data error" });
    }
    // Achievements
    const resultAchievements = await database.getAchievements(req.body.id)
    if (resultAchievements.success === false) {
        return res.status(400).send({ description: "Get achievements data error" });
    }

    return res.status(200).send({
        description: "Get data successful",
        data: {
            single: resultSingle.data,
            skills: resultSkills.data,
            achievements: resultAchievements.data
        }
    });
})

app.get("/getUserData", async (req: Request<{}, {}, { username: string }>, res) => {
    if (typeof req.query.username != "string") {
        return res.status(400).send({ description: "username musi być stringiem" });
    }
    const resultUserId = await database.getUserId(req.query.username)
    if (resultUserId.success === false || resultUserId.data.length !== 1) {
        return res.status(400).send({ description: `User ${req.query.username} doesn't exist` });
    }

    // Single data
    const resultSingle = await database.getSingleData(resultUserId.data[0].id)
    if (resultSingle.success === false || resultSingle.data.length !== 1) {
        return res.status(400).send({ description: "Get single data error" });
    }
    // Skills
    const resultSkills = await database.getSkills(resultUserId.data[0].id)
    if (resultSkills.success === false) {
        return res.status(400).send({ description: "Get skills data error" });
    }
    // Achievements
    const resultAchievements = await database.getAchievements(resultUserId.data[0].id)
    if (resultAchievements.success === false) {
        return res.status(400).send({ description: "Get achievements data error" });
    }
    // Points history
    const resultPointsHistory = await database.getPointsHistory(resultUserId.data[0].id)
    if (resultPointsHistory.success === false) {
        return res.status(400).send({ description: "Get points history data error" });
    }

    return res.status(200).send({
        description: "Get data successful",
        data: {
            single: resultSingle.data,
            skills: resultSkills.data,
            achievements: resultAchievements.data,
            points_history: resultPointsHistory.data,
        }
    });
})
//#endregion

//#region Add quiz and its stuff
app.post("/addQuiz", async (req: Request<{}, {}, { skill_id: number, name: string, questionCount: number, reward: number }>, res) => {
    const result = await database.addQuiz(req.body.skill_id, req.body.name, req.body.questionCount, req.body.reward)
    if (result.success === false) {
        return res.status(400).send({ description: "Error adding the quiz" });
    }

    return res.status(200).send({ description: "Successfully added a quiz" });
})

app.post("/addWholeQuestion", async (req: Request<{}, {}, { quiz_id: number, question: string, answers: string[], correctAnswer: string }>, res) => {
    // Add a question -> determine correct answer id -> add anaswers
    const resultAddQ = await database.addQuestion(req.body.quiz_id, req.body.question)
    if (resultAddQ.success === false) {
        return res.status(400).send({ description: "Error adding the question" });
    }

    // Get question id
    const resultGetQID = await database.getQuestionIdByName(req.body.question)
    if (resultGetQID.success === false || resultGetQID.data.length !== 1) {
        return res.status(400).send({ description: "Error getting question id" });
    }

    // Determine correct answerw
    let correct_ans_id;
    for (let i = 0; i < req.body.answers.length; i++) {
        if (req.body.answers[i] === req.body.correctAnswer) {
            correct_ans_id = i;
            break;
        }
    }

    // Add answers to the database
    for (let i = 0; i < req.body.answers.length; i++) {
        let correct;
        i == correct_ans_id ? correct = 1 : correct = 0
        const result = await database.addAnswer(resultGetQID.data[0].id, req.body.answers[i], correct)
        if (result.success === false) {
            return res.status(400).send({ description: "Error adding an answer" });
        }
    }

    return res.status(200).send({ description: "Successfully added a question with answers" });
})
//#endregion

//#region get stuff for select display
app.get("/getCategories", async (req: Request<{}, {}, {}>, res) => {
    const result = await database.getAvailableCategories()
    if (result.success === false || result.data.length === 0) {
        return res.status(400).send({ description: "Error loading available categories" });
    }

    return res.status(200).send({
        description: "Success getting categories",
        data: result.data
    });
})

app.get("/getQuizes", async (req: Request<{}, {}, {}>, res) => {
    const result = await database.getAvailableQuizes()
    if (result.success === false || result.data.length === 0) {
        return res.status(400).send({ description: "Error loading available quizes" });
    }

    return res.status(200).send({
        description: "Success getting quizes",
        data: result.data
    });
})

app.get("/getQuestions", async (req: Request<{}, {}, {}>, res) => {
    const result = await database.getAvailableQuestions()
    if (result.success === false || result.data.length === 0) {
        return res.status(400).send({ description: "Error loading available questions" });
    }

    return res.status(200).send({
        description: "Success getting questions",
        data: result.data
    });
})
//#endregion

app.get("/", (_, res) => {
    res.send("Hello world!");
})

//#region file stuff
app.get("/fileUpload", (_, res) => {
    let text = ""
    text += '<form action="file" method="POST" enctype="multipart/form-data">'
    text += '<input type="file" name = "filetoupload"> <br>'
    text += '<input type="submit">'
    text += '</form>'
    res.send(text);
})

app.post("/file", (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req)

    const id = uuidv4();
    let extension = "";
    let originalName = "";

    form.on('fileBegin', (name, file) => {
        const splitted = file.originalFilename!.split(".")
        extension = splitted.at(-1)!
        originalName = splitted.splice(0, splitted.length - 1).join(".")
        file.filepath = __dirname + '/uploads/' + id + "." + extension;
    });

    form.on('file', async (name, file) => {
        const result = await database.addFileInfo(id, extension, originalName!);

        if (result.success === false) {
            return res.status(500).send();
        }

        console.log(`Uploaded ${file.originalFilename} as ${id}.${extension} extension'`);
        return res.send();
    });
})

var extensionToMimeType: { [x: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'pdf': 'application/pdf'
}

app.get("/file", async (req: Request<{}, {}, { id: string }>, res) => {
    if (typeof req.query.id != "string") {
        return res.status(400).send({ description: "id musi być stringiem" });
    }

    const fileInfo = await database.getFileInfo(req.query.id)
    if (fileInfo.success === false) {
        return res.status(400).send({ description: "Brak takiego pliku" });
    }

    const file = __dirname + '/uploads/' + req.query.id + "." + fileInfo.data[0].extension;
    console.log("zwracam plik " + file)
    var data = fs.readFileSync(file);
    if (extensionToMimeType[fileInfo.data[0].extension] == undefined) {
        return res.status(400).send({ description: `Rozszerzenie ${fileInfo.data[0].extension} nie jest obsługiwane` });
    } else {
        res.contentType(extensionToMimeType[fileInfo.data[0].extension]);
        return res.send(data);
    }
})

app.get("/fileDownload", async (req: Request<{}, {}, { id: string }>, res) => {
    if (typeof req.query.id != "string") {
        return res.status(400).send({ description: "id musi być stringiem" });
    }

    const fileInfo = await database.getFileInfo(req.query.id)
    if (fileInfo.success === false) {
        return res.status(400).send({ description: "Brak takiego pliku" });
    }

    const file = __dirname + '/uploads/' + req.query.id + "." + fileInfo.data[0].extension;
    const downloadName = fileInfo.data[0].originalName + '.' + fileInfo.data[0].extension;
    console.log("zwracam plik " + file + " jako " + downloadName)
    return res.download(file, downloadName);
})

app.get("/allPdfs", async (_, res) => {
    const files = await database.getAllPdfs()
    if (files.success === false) {
        return res.status(400).send({ description: "Błąd pobierania wszystkich pdfów" });
    }
    return res.send(files)
})
//#endregion

app.post("/evaluateQuiz", async (req: Request<{}, {}, { id: string, ids: number[], quiz_id: number }>, res) => {
    if (!req.body.ids || req.body.ids.length === 0) {
        return res.status(400).send({ description: "ids are undefined" });
    }
    if (!req.body.id) {
        return res.status(400).send({ description: "id is undefined" });
    }
    if (!req.body.quiz_id) {
        return res.status(400).send({ description: "quiz_id is undefined" });
    }

    const answerPoints = await database.getQuizData(req.body.quiz_id)
    if (answerPoints.success === false || answerPoints.data.length !== 1) {
        return res.status(400).send({ description: "Error getting answer" });
    }

    let correct = false;
    for (let i = 0; i < req.body.ids.length; i++) {
        const answer = await database.getAnswer(req.body.ids[i])
        if (answer.success === false || answer.data.length !== 1) {
            return res.status(400).send({ description: "Error getting answer" });
        }

        if (answer.data[0].correct) {
            correct = answer.data[0].correct;
            break;
        }
    }

    let description;
    if (correct) {
        description = `The quiz is all correct! Added ${answerPoints.data[0].reward} points`
        addPoints(req.body.id, answerPoints.data[0].reward, answerPoints.data[0].skill_id, QUIZ_ACTIVITY_ID, answerPoints.data[0].name);
    } else {
        description = "The quiz is not correct!"
    }

    return res.send({
        description: description,
        correct: correct
    })
})

function addPoints(user_id: string, points: number, skill_id: number, activity_id: number, activity_name: string) {
    database.addPoints(user_id, points, skill_id, activity_id, activity_name);
}

app.get("/getCompleteQuiz", async (req: Request<{}, {}, { id: number }>, res) => {
    if (!req.query.id) {
        return res.status(400).send({ description: "id is undefined" });
    }

    const resultQuestions = await database.getQuestions(parseInt(req.query.id as string))
    if (resultQuestions.success === false || resultQuestions.data.length === 0) {
        return res.status(400).send({ description: `Error: no questions or no quiz with id ${req.query.id}` });
    }


    type answerType = {
        [x: number]: {
            id: number,
            answer: string,
        }[]
    }

    let answers: answerType = {};
    for (let i = 0; i < resultQuestions.data.length; i++) {
        (resultQuestions.data[i].id)
        const result = await database.getAnswers(resultQuestions.data[i].id)
        if (result.success === false || result.data.length === 0) {
            return res.status(400).send({ description: "Error loading answer" });
        }
        for (let answer of result.data) {
            answers[resultQuestions.data[i].id] = []
        }
        for (let answer of result.data) {
            answers[resultQuestions.data[i].id].push({
                id: answer.id,
                answer: answer.answer
            })
        }
    }

    return res.status(200).send({
        description: "Success getting the whole quiz",
        quizId: req.query.id,
        questions: resultQuestions.data,
        answers: answers
    });
})

app.listen(3000, () => {
    console.log("Listening on 3000");
})