import Express, { Request } from "express"
import bodyParser from "body-parser";
import cors from "cors"
import Database from "./Database";
import path from "path";
import formidable from 'formidable';
import sha256, { HMAC } from "fast-sha256";
import { v4 as uuidv4 } from 'uuid';

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


const database = new Database();

app.post("/register", async (req: Request<{}, {}, { username: string, password: string }>, res) => {
    // Check if user exists
    const getUserResult = await database.getUserId(req.body.username)
    if (getUserResult.success === false || getUserResult.data.length === 1) {
        return res.status(400).send({ description: "User already exists" });
    }

    // Register
    let uintPass = nacl.util.decodeUTF8(req.body.password);
    let shaPasswd = sha256(uintPass)
    let stringPasswd = new TextDecoder().decode(shaPasswd);

    const registerResult = await database.register(
        req.body.username,
        stringPasswd,
    )
    if (registerResult.success === false || registerResult.data.length !== 1) {
        return res.status(400).send({ description: "Registration error occured" });
    }

    return res.status(200).send();
})

app.post("/login", async (req: Request<{}, {}, { username: string, password: string }>, res) => {
    if (req.body.username.length > 30) {
        return res.status(400).send({ description: "Username over 30 characters" })
    }

    let uintPass = nacl.util.decodeUTF8(req.body.password)
    let shaPasswd = sha256(uintPass)
    let stringPasswd = new TextDecoder().decode(shaPasswd);

    const result = await database.login(
        req.body.username,
        stringPasswd,
    )

    if (result.success === false || result.data.length !== 1) {
        return res.status(400).send();
    }

    return res.status(200).send({
        id: result.data[0].id
    });
})

app.get("/", (_, res) => {
    res.send("Hello world!");
})

app.post("/file", (req, res) => {
    const form = new formidable.IncomingForm();
    // console.log(form);

    form.parse(req)

    form.on('fileBegin', function (name, file) {
        file.filepath = __dirname + '/uploads/' + file.originalFilename;
    });

    form.on('file', function (name, file) {
        console.log('Uploaded ' + file.filepath);
    });
})

app.listen(3000, () => {
    console.log("Listening on 3000");
})