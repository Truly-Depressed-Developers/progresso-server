import Express, { Request } from "express"
import bodyParser from "body-parser";
import cors from "cors"
import Database from "./Database";
import path from "path";
import formidable from 'formidable';

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
    const result = await database.register(
        req.body.username,
        req.body.password,
    )

    if (result.success === false || result.data.length !== 1) {
        return res.status(400).send({ description: "Registration error occured" });
    }

    return res.send({
        status: true
    });
})

app.post("/login", async (req: Request<{}, {}, { username: string, password: string }>, res) => {
    const result = await database.login(
        req.body.username,
        req.body.password,
    )

    if (result.success === false || result.data.length !== 1) {
        return res.status(400).send({
            status: false,
        });
    }

    console.log(result);

    return res.send({
        status: true,
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