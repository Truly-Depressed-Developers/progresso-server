import Express from "express"
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


app.get("/", (_, res) => {
    res.send("Hello world!");
})

app.post("/fileUpload", (req, res) => {
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