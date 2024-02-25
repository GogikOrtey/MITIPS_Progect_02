// let i = 1;

// function changeBackground() {
//   // Устанавливаем задний фон для элемента header::before
//   document.querySelector('header::before').style.backgroundImage = `url("img/Header_Photo/B (${i}).jpg")`;

//   // Увеличиваем i на 1 или сбрасываем его до 1, если достигнуто 22
//   i = i < 22 ? i + 1 : 1;
// }

// // Вызываем функцию changeBackground каждые 5 секунд
// setInterval(changeBackground, 5000);

// JavaScript
let i = 1;

function changeBackground() {
  // Удаляем все классы bg с элемента header
  for (let j = 1; j <= 17; j++) {
    document.querySelector('header').classList.remove(`bg${j}`);
  }

  // Добавляем новый класс bg к элементу header
  document.querySelector('header').classList.add(`bg${i}`);

  // Увеличиваем i на 1 или сбрасываем его до 1, если достигнуто 20
  i = i < 17 ? i + 1 : 1;
}

// Вызываем функцию changeBackground каждые 5 секунд
setInterval(changeBackground, 1500);