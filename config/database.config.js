const mysql = require("mysql2");

const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'mark_agro',
});

db.connect(function (error) {
	if (error) {
		console.log(error);
	} else {
		console.log('Database Connected!');
	}
});

module.exports = db;
