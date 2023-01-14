import Express, { Request } from "express"
import bodyParser from "body-parser";
import cors from "cors"
import Database from "./Database";
import path from "path";
import formidable from 'formidable';
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
    // console.log(form);
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

app.get("/file", async (req: Request<{}, {}, { id: string }>, res) => {
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

app.listen(3000, () => {
    console.log("Listening on 3000");
})