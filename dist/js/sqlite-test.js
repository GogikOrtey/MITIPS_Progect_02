// // Подключаем модуль sqlite3
// var sqlite3 = require('sqlite3').verbose();

// // Открываем базу данных SQLite
// var db = new sqlite3.Database('sql/Plants_01.db');

// db.serialize(function() {
//   // Выполняем запрос SELECT
//   db.each("SELECT * FROM PlantList", function(err, row) {
//     // Выводим результаты в консоль
//     console.log(row.id + ": " + row.info);
//   });
// });

// // Закрываем базу данных
// db.close();

//var mysql = require('mysql');