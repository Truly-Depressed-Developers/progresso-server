import mysql from "mysql"

export type QueryResult<T> = { success: false, error: string | undefined } | { success: true, data: T[] };

const host = "10.230.17.186"
const user = "bitehack2023"
const password = "28pTQYMQH9qomf"
const database = "bitehack2023"


export default class Database {
    connection: mysql.Connection

    constructor() {
        this.connection = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database
        });

        this.connection.connect(err => {
            if (err) throw err;
            console.log("Connected!");
        });
    }

    async addFileInfo(id: string, extension: string, originalName: string) {
        const sql = "INSERT INTO files (id, extension, originalName) VALUES (?, ?, ?)"
        return await this.query(sql, [id, extension, originalName]);
    }

    async getFileInfo(id: string) {
        const sql = "SELECT extension, originalName FROM files WHERE id=?"
        return await this.query<{ extension: string, originalName: string }>(sql, [id]);
    }

    query = <T>(query: string, values: any[] = []) => {
        return new Promise<QueryResult<T>>((resolve) => {
            return this.connection.query(query, values, (err, result) => {
                if (err) {
                    return resolve({
                        success: false,
                        error: err.sqlMessage
                    });
                }
                return resolve({
                    success: true,
                    data: result
                });
            });
        })
    }

    async getUserId(username: string) {
        const sql = "SELECT id FROM users WHERE username=?"
        return await this.query<{ id: string }>(sql, [username]);
    }

    //#region Login / register
    async register(id: string, username: string, password: string) {
        const sql = "INSERT INTO users (id, username, password) VALUES (?, ?, ?)"
        return await this.query(sql, [id, username, password]);
    }

    async login(username: string, password: string) {
        const sql = "SELECT id FROM users WHERE username =? AND password=?"
        return await this.query<{ id: string }>(sql, [username, password]);
    }
    //#endregion

    //#region User data
    async getSingleData(id: string) {
        const single_sql = `SELECT u.username, t.title, u.bio, u.profile_photo_id FROM users AS u JOIN titles AS t ON u.title = t.id WHERE u.id = ?`
        return await this.query<{ data: string }>(single_sql, [id]);
    }

    async getAchievements(id: string) {
        const achievements = `SELECT a.id, a.name, a.description, a.photo_url FROM user_achievements AS u JOIN achievements AS a ON u.achievement_id = a.id WHERE u.user_id = ?`
        return await this.query<{ achievements: string }>(achievements, [id]);
    }

    async getPointsHistory(id: string) {
        const pointsHistory = `
        SELECT h.id, h.points, s.name as skill, a.name as activity_type, h.activity_name, h.timestamp FROM points_history as h
        JOIN users as u ON u.id=h.user_id
        JOIN points_history_activitites as a ON a.id=h.activity_id
        JOIN skills as s ON s.id=h.skill_id
        WHERE u.id=?
        ORDER BY timestamp DESC`
        type pointsHistoryType = {
            id: number,
            points: number,
            skill: string,
            activity_type: string,
            activity_name: string,
            timestamp: string,
        }
        return await this.query<pointsHistoryType>(pointsHistory, [id]);
    }
    //#endregion

    //#region Add quiz stuff
    async addQuiz(skill_id: number, name: string, questionCount: number, reward: number) {
        const sql = "INSERT INTO quizes (skill_id, name, question_count, reward) VALUES (?, ?, ?, ?)"
        return await this.query(sql, [skill_id, name, questionCount, reward]);
    }

    async addQuestion(quiz_id: number, question: string) {
        const sql = "INSERT INTO questions (quiz_id, question) VALUES (?, ?)"
        return await this.query(sql, [quiz_id, question]);
    }

    async addAnswer(questionId: number, answer: string, correct: number) {
        const sql = "INSERT INTO answers (question_id, answer, correct) VALUES (?, ?, ?)"
        return await this.query(sql, [questionId, answer, correct]);
    }

    async getQuestionIdByName(question: string) {
        const sql = "SELECT id FROM questions WHERE question = ?";
        return await this.query<{ id: number }>(sql, [question]);
    }
    //#endregion

    //#region get select options
    async getAvailableCategories() {
        const sql = "SELECT id, name FROM skills"
        return await this.query<{ id: string }>(sql, []);
    }

    async getAvailableQuizes() {
        const sql = "SELECT id, name FROM quizes"
        return await this.query<{ id: string }>(sql, []);
    }

    async getAvailableQuestions() {
        const sql = "SELECT id, question FROM questions"
        return await this.query<{ id: string }>(sql, []);
    }
    //#endregion

    //#region Points management
    async getSkills(id: string) {
        const sql = `
            SELECT skill_id as id, skills.name as name, sum(points) as points, user_id FROM points_history
            JOIN skills ON skills.id=points_history.skill_id
            WHERE user_id=?
            GROUP BY skill_id`
        return await this.query<{ id: number, name: string, points: number, user_id: number }>(sql, [id]);
    }

    async addPoints(user_id: string, points: number, skill_id: number, activity_id: number, activity_name: string) {
        const sql = "INSERT INTO points_history (user_id, points, skill_id, activity_id, activity_name) VALUES (?, ?, ?, ?, ?)"
        return await this.query(sql, [user_id, points, skill_id, activity_id, activity_name]);
    }
    //#endregion

    async getAllPdfs() {
        const sql = "SELECT * FROM files WHERE extension='pdf'"
        type file = {
            id: string,
            extension: string,
            originalName: string,
            uploadTimestsamp: string,
        }
        return await this.query<file>(sql);
    }

    async getAnswer(id: number) {
        const sql = `SELECT correct FROM answers WHERE id=?`
        return await this.query<{ correct: boolean }>(sql, [id]);
    }

    //#region Generate quiz
    async getQuestions(id: number) {
        const sql = "SELECT id, question FROM questions WHERE quiz_id = ?"
        type question = {
            id: number,
            question: string
        }
        return await this.query<question>(sql, [id]);
    }

    async getAnswers(id: number) {
        const sql = "SELECT id, answer, question_id FROM answers WHERE question_id = ?"
        type answer = {
            id: number,
            answer: string,
            question_id: number,
        }
        return await this.query<answer>(sql, [id]);
    }
    //#endregion

    async getQuizData(quiz_id: number) {
        const sql = "SELECT reward, skill_id, name FROM quizes WHERE id = ?";
        return await this.query<{ reward: number, skill_id: number, name: string }>(sql, [quiz_id])
    }
}