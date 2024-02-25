//window.plantCards_isCardVisible = false;

// Ждём, пока DOM-модель полностью загрузится
document.addEventListener('DOMContentLoaded', function() { 
    //plantCards_isCardVisible = true;
    // randomImgPlantsCard();
    // SetNamePlants(plantCards_plantNames);
});

window.setCards = function() {
    console.log("Получили такую строку: " + plantCards_plantNames);
    randomImgPlantsCard();
    SetNamePlants(plantCards_plantNames);
}

function randomImgPlantsCard() {
    //document.querySelector('.result-cards')

    // Получаем все элементы img внутри .card
    let images = document.querySelectorAll('.card img');

    // Создаем массив с именами файлов изображений
    let imageNames = Array.from({length: 13}, (_, i) => `img/plant-image/P_${String(i+1).padStart(2, '0')}.png`);

    // Перемешиваем массив
    imageNames.sort(() => Math.random() - 0.5);

    // Присваиваем каждому элементу img случайное изображение из массива
    images.forEach((img, index) => {
        img.src = imageNames[index];
    });
}

window.plantCards_plantNames = ""; //"Геликония, Бувардия, Будра, Жакаранда, Камнеломка, Лаванда, Осока";

function SetNamePlants(plantNames) {
    // Получаем все элементы span внутри .card
    let spans = document.querySelectorAll('.card span');

    // Получаем строку с названиями растений

    // Преобразуем строку в массив
    plantNames_mass = plantNames.split(', ');

    console.log("Разбили на такой массив: " + plantNames_mass);
    console.log("Его длинна: " + plantNames_mass.length);

    // Присваиваем каждому элементу span название растения из массива
    spans.forEach((span, index) => {
        if (index < plantNames_mass.length) {
            span.textContent = plantNames_mass[index];
            span.parentElement.style.display = 'grid';
        } else {
            span.parentElement.style.display = 'none'; // скрываем лишние карточки
        }
    });

    // Если названий растений меньше 7, но больше 3, показываем только первые 3 карточки
    if (plantNames_mass.length < 7 && plantNames_mass.length > 3) {
        for (let i = 3; i < spans.length; i++) {
            spans[i].parentElement.style.display = 'none';
        }
    }
}