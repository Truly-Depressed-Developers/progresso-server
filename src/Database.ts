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

    // Login / register
    async register(id: string, username: string, password: string) {
        const sql = "INSERT INTO users (id, username, password) VALUES (?, ?, ?)"
        return await this.query(sql, [id, username, password]);
    }

    async login(username: string, password: string) {
        const sql = "SELECT id FROM users WHERE username =? AND password=?"
        return await this.query<{ id: string }>(sql, [username, password]);
    }

    // User data
    async getSingleData(id: string) {
        const single_sql = `SELECT u.username, t.title, u.bio, u.profile_photo_id FROM users AS u JOIN titles AS t ON u.title = t.id WHERE u.id = ?`
        return await this.query<{ data: string }>(single_sql, [id]);
    }

    async getSkills(id: string) {
        const skills = `SELECT s.id, s.name, u.points FROM user_skills AS u JOIN skills AS s ON u.skill_id = s.id WHERE u.user_id = ?`
        return await this.query<{ skills: string }>(skills, [id]);
    }

    async getAchievements(id: string) {
        const achievements = `SELECT a.id, a.name, a.description, a.photo_url FROM user_achievements AS u JOIN achievements AS a ON u.achievement_id = a.id WHERE u.user_id = ?`
        return await this.query<{ achievements: string }>(achievements, [id]);
    }
    // end user data

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
}