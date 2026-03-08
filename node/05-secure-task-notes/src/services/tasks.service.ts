import db from "../config/db";

export function createTask(title: string, description: string, userId: number) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO tasks(title,description,user_id) VALUES(?,?,?)",
      [title, description, userId],
      function (err) {
        if (err) return reject(err);

        resolve({ id: this.lastID });
      },
    );
  });
}

export function getTasks(user: any) {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM tasks";
    let params: any[] = [];

    if (user.role !== "admin") {
      query += " WHERE user_id=?";
      params.push(user.id);
    }

    db.all(query, params, (err, rows) => {
      if (err) return reject(err);

      resolve(rows);
    });
  });
}
