<?php
  $servername = "gogortv0.beget.tech";
  $username = "gogortv0_db_pl_2";
  $password = "Nnd&4M%m";
  $dbname = "gogortv0_db_pl_2";

  // Этот скрипт использовать только для получения данных
  // Для добавления/удаления - использовать другой

  // Создаем соединение
  $conn = new mysqli($servername, $username, $password, $dbname);

  // Проверяем соединение
  if ($conn->connect_error) {
    die("Ошибка подключения: " . $conn->connect_error);
  }

  // Плохие слова. Если хоть одно из них попадётся в SQL-запросе - то он не выполнится
  $keywords = ['ADD','ALTER','BACKUP','CONSTRAINT','DATABASE','DEFAULT','DROP','EXEC','FOREIGN KEY','PROCEDURE','TRUNCATE','VALUES','VIEW'];

  foreach ($keywords as $keyword) {
    if (stripos($sql, $keyword) !== false) {
      return "Неверный запрос, SQL-инъекция была отклонена: ";
    }
  }

  $sql = $_POST['sql_query']; // Получаем SQL запрос из POST запроса
  $result = $conn->query($sql);

  if ($result === TRUE) {
    echo "Добавление или удаление успешно";
  } else {
    echo "Ошибка, при добавлении или удалении: " . $conn->error;
  }

  $data = array(); // Массив для хранения данных

  if ($result->num_rows > 0) {
    // Выводим данные каждой строки
    while($row = $result->fetch_assoc()) {
      $data[] = $row;
    }
  } else {
    echo "0 results";
  }

  header('Content-Type: application/json');
  echo json_encode($data); // Возвращаем данные в формате JSON

  $conn->close();
?>