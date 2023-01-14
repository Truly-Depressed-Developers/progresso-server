import mysql from "mysql"

export type QueryResult<T> = { success: false, error: string | undefined } | { success: true, data: T[] };

const host = "localhost"
const user = "root"
const password = ""
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
}