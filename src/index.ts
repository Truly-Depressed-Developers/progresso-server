import Express from "express"
import bodyParser from "body-parser";
import cors from "cors"
// import Database from "./Database";

const app = Express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors({
    origin: "*",
    credentials: true,
}))


// const database = new Database();


app.get("/", (_, res) => {
    res.send("Hello world!");
})

app.listen(3000, () => {
    console.log("Listening on 3000");
})