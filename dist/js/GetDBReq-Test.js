// var xhr = new XMLHttpRequest();
// //xhr.open('GET', 'js/php/getdata_2.php', true);
// xhr.open('GET', 'https://gogortey.ru/res/getdata_2.php', true);
// xhr.send();




// xhr.onload = function() {
//   if (xhr.status != 200) {
//     alert('Ошибка: ' + xhr.status + ': ' + xhr.statusText);
//   } else {
//     console.log(xhr.responseText);
//   }
// };

// xhr.onerror = function() {
//   alert('Запрос не удался');
// };

// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'js/php/getdata_2.php', true);
// xhr.send();




// xhr.onload = function() {
//   if (xhr.status != 200) {
//     alert('Ошибка: ' + xhr.status + ': ' + xhr.statusText);
//   } else {
//     var data = JSON.parse(xhr.responseText); // преобразуем ответ в JSON
//     for (var i = 0; i < data.length; i++) {
//       console.log(data[i]); // выводим каждую строку в консоль
//     }
//   }
// };

// xhr.onerror = function() {
//   alert('Запрос не удался');
// };



// var sql_2 = "SELECT plant_name FROM MainTable";// WHERE plant_type_description = 'Домашнее' AND min_humidity >= 35 AND min_light >= 3 ORDER BY is_famous DESC, CASE allelopathy_description WHEN 'Положительная' THEN 1 WHEN 'Нейтральная' THEN 2 ELSE 3 END, CASE plant_color_description WHEN 'разноцветный' THEN 1 WHEN 'белый' THEN 2 WHEN 'жёлтый' THEN 3 WHEN 'голубой' THEN 4 WHEN 'серебристый' THEN 5 WHEN 'бордовый' THEN 6 WHEN 'красный' THEN 7 WHEN 'оранжевый' THEN 8 WHEN 'пёстрый' THEN 9 WHEN 'пурпурный' THEN 10 WHEN 'розовый' THEN 11 WHEN 'синий' THEN 12 WHEN 'фиолетовый' THEN 13 WHEN 'Зелёный с белой каймой' THEN 14 WHEN 'Зелёный с белыми или розовыми разводами' THEN 15 WHEN 'Зелёный с красными прицветниками' THEN 16 WHEN 'Зелёный с пятнами' THEN 17 WHEN 'Зелёный с разноцветными прожилками' THEN 18 WHEN 'Зелёный с серебристым оттенком' THEN 19 ELSE 20 END, area_covered ASC, oxygen_production DESC;";
var sql_2 = "SELECT plant_name FROM MainTable WHERE plant_type_description = 'Домашнее' AND min_humidity >= 35 AND min_light >= 3 ORDER BY is_famous DESC, CASE allelopathy_description WHEN 'Положительная' THEN 1 WHEN 'Нейтральная' THEN 2 ELSE 3 END, CASE plant_color_description WHEN 'разноцветный' THEN 1 WHEN 'белый' THEN 2 WHEN 'жёлтый' THEN 3 WHEN 'голубой' THEN 4 WHEN 'серебристый' THEN 5 WHEN 'бордовый' THEN 6 WHEN 'красный' THEN 7 WHEN 'оранжевый' THEN 8 WHEN 'пёстрый' THEN 9 WHEN 'пурпурный' THEN 10 WHEN 'розовый' THEN 11 WHEN 'синий' THEN 12 WHEN 'фиолетовый' THEN 13 WHEN 'Зелёный с белой каймой' THEN 14 WHEN 'Зелёный с белыми или розовыми разводами' THEN 15 WHEN 'Зелёный с красными прицветниками' THEN 16 WHEN 'Зелёный с пятнами' THEN 17 WHEN 'Зелёный с разноцветными прожилками' THEN 18 WHEN 'Зелёный с серебристым оттенком' THEN 19 ELSE 20 END, area_covered ASC, oxygen_production DESC;";

//var sql = "SELECT * FROM PlantColors";

$.ajax({
    type: "POST",
    url: "https://gogortey.ru/res/getdata_2.php",
    data: { sql: sql_2 },
    success: function(data_inp) {
        if(data_inp == "0 results[]") {
          console.log("Пустой ответ");
        } else {
          var data = JSON.parse(data_inp);
          JSON_Parser_OnConsole(data);
        }
        //console.log(data);
    }
});

function JSON_Parser_OnConsole(data) {
  //var data = JSON.parse(xhr.responseText); // преобразуем ответ в JSON
  for (var i = 0; i < data.length; i++) {
    console.log(data[i]); // выводим каждую строку в консоль
  }
}
