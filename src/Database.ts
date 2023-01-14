import mysql from "mysql"
import sha256, { HMAC } from "fast-sha256";
import { v4 as uuidv4 } from 'uuid';

var nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

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

    async register(username: string, password: string) {
        // TODO: max username length: 30
        // TODO check if user exists

        let uintPass = nacl.util.decodeUTF8(password)

        let shaPasswd = sha256(uintPass)
        let stringPasswd = new TextDecoder().decode(shaPasswd);

        const sql = "INSERT INTO users (username, password) VALUES (?, ?)"
        return await this.query(sql, [username, stringPasswd]);
    }

    async login(username: string, password: string) {
        // TODO: max username length: 30
        let uintPass = nacl.util.decodeUTF8(password)

        let shaPasswd = sha256(uintPass)
        let stringPasswd = new TextDecoder().decode(shaPasswd);

        const sql = "SELECT id FROM users WHERE username =? AND password=?"
        return await this.query<{ id: number }>(sql, [username, stringPasswd]);
    }

}