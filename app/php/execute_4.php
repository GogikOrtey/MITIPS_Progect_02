<?php
  header('Access-Control-Allow-Origin: *');

  $servername = "gogortv0.beget.tech";
  $username = "gogortv0_db_pl_2";
  $password = "Nnd&4M%m";
  $dbname = "gogortv0_db_pl_2";

// Создание соединения
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка соединения
if ($conn->connect_error) {
  die("Ошибка подключения: " . $conn->connect_error);
}

function checkSqlQuery($sql, $conn) {
    $keywords = ['ALTER','BACKUP','CONSTRAINT','DATABASE','DEFAULT','DELETE','DROP', 'EXEC','FOREIGN KEY','PROCEDURE','TRUNCATE','VIEW'];
    //$keywords = ['VIEW'];

    foreach ($keywords as $keyword) {
        if (stripos($sql, $keyword) !== false) {
            return "Неверный запрос: ";// . $keyword; // Расскомментировать, для отладки
        }
    }

    // Экранирование специальных символов в строке для использования в SQL-выражении
    //$sql = mysqli_real_escape_string($conn, $sql);

    $result = $conn->query($sql);

    $data = array(); // создаем массив

    if ($result->num_rows > 0) {
      // выводим данные каждой строки
      while($row = $result->fetch_assoc()) {
        $data[] = $row; // добавляем каждую строку в массив
      }
    } else {
      echo "0 results";
    }
    return json_encode($data);
    //echo json_encode($data); // преобразуем массив в JSON
}

$sql = $_POST['sql']; // Получение SQL-запроса из POST-запроса

echo checkSqlQuery($sql, $conn);

$conn->close();
?>