
// Ждём, пока DOM-модель загрузится
document.addEventListener('DOMContentLoaded', function() { 

    // Задаём событие по клику, на элемент на Кнопка назад
    document.querySelector('.butt_back.n_but').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // Получаю все названия растений, и вывожу их в консоль
    //SQL_RQ_FromSwever("select * from Allelopathy")
    SQL_RQ_FromSwever("select * from MainTable_2", "Название растения", 1)

    HideYellowBlock() /// ------------------ Потом раскомментировать эту строчку
    //ShowYellBlock()

    SetCorrCahgeAnyValues()

    // Обработчик сворачивания жёлтого блока
    YellBlockHideFunc() 



    // Получение значений, и их вставка в таблицы, для ключевых признаков
    KeyValues_GetAndInsertIntoTable() 

    
    //ProcessSelectObjectForBlueBlock();

    // Обработчик нажатия на кнопки "Добавить", для блоков Аллелопатии, типа климата, и цвета
    ProcessClickToButtonADDAnOther();

    // Обработка текста об ошибке, для полей ввода новых значений для ключевых признаков
    ProcessHideErrorTextForKeyAdds()

    //ShowOrHideLoaderDisplay(false);    
    //ShowOrHideLoaderDisplay(true);    



    // let elements2 = document.querySelectorAll('.el-pl-cont-4:hover, .butt-4-1:hover, .el-pl-cont-4:hover span, .butt-4-1:hover span');
    // elements2.forEach(function(element2) {
    //     element2.style.setProperty('cursor', 'wait', 'important');
    // });
    
    
});



loader = document.querySelector(".loader");

function ShowOrHideLoaderDisplay(isShow) {
    if(isShow == true) {
        loader.style.display = "flex";
        console.log("Показываем загрузчик")
    } else {
        loader.style.display = "none";
        console.log("Скрываем загрузчик")
    }
}



function SetWaitCursor() {
    document.body.style.cursor = 'wait';

    let elements = document.querySelectorAll('body *');
    elements.forEach(function(element) {
        element.style.cursor = 'wait';
    });
}

function SetDefaultCursor() {
    document.body.style.cursor = 'default';

    let elements = document.querySelectorAll('body *');
    elements.forEach(function(element) {
        element.style.cursor = 'default';
    });

    // Также, установка курсора типа pointer, для некоторых элементов (кнопок):
    const targetElements = [
        '.el-pl-cont-4', '.butt-4-1', '.n_but', '.p-4-2-add', '.butt-4-close',
        '.loader', '.loader *' // Включаем элементы внутри .loader
    ];
  
  // Функция для установки курсора "pointer"
  function setPointerCursor(elements) {
    elements.forEach(function(selector) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(function(element) {
        element.style.cursor = 'pointer';
      });
    });
  }
  
  // Вызов функции
  setPointerCursor(targetElements);
}


// Запрос к БД растений:
function SQL_RQ_FromSwever(sql_2, selector, mode) {
    // Показывает окно загрузки, только если это не операция обновления жёлтого окна свойств растения
    if(mode != 2) ShowOrHideLoaderDisplay(true)

    if(mode == 2) {
        SetWaitCursor()
    }

    // Используем асинхронную функцию для запроса-ответа к серверу
    $.ajax({

        // Подключаемся к php файлу на сервере
        type: "POST",
        url: "https://gogortey.ru/res/execute_4.php",
        
        // Отправляем туда наш SQL-запрос
        data: { sql: sql_2 },

        // Когда получим ответ:
        success: function(data_inp) {
            //console.log(data_inp);
            let decodeData
            if(data_inp != "0 results[]" && data_inp != "Неверный запрос: ") {
                try { decodeData = JSON.parse(data_inp);} // Преобразуем строку JSON в объект JavaScript
                catch {
                    console.error("Ошибка при декодировании ответа из JSON формата: Сервер отправил нетипичный ответ.")
                    if(data_inp != "Неверный запрос: ") {
                        console.error("На запрос: '" + sql_2 + "', cервер отправил некорректный ответ: " + data_inp);
                    }
                }
            } else {
                //console.error("На запрос: '" + sql_2 + "', cервер отправил некорректный ответ: " + data_inp);
            }
            
            if(mode == 0) { // Когда запрос не требует ответа
                console.log("Запрос выполнен, получен ответ: " + data_inp)

            } else if(mode == 1) {
                resultMass = ConvertJSON_to_massiv(decodeData, selector)
                GetPlantList_andInsertFromLabel(resultMass);
                // Обработка выделения элементов в синем блоке
                ProcessSelectObjectForBlueBlock();
                //console.log(resultMass)
                
            } else if(mode == 2) {
                resultMass = jsonToArray(decodeData)
                console.log(resultMass);
                SetAllInputValues(resultMass);         
                GrayingInputElement_Show()     

            } else if(mode == 3) {
                resultMass = ConvertJSON_to_massiv(decodeData, selector)
                KeyValues_GetAndInsertIntoTable_Return(resultMass)
                massAllelop = resultMass
                FullingDropListsForYellowBlock_Allelop();
            
            } else if(mode == 4) {
                resultMass = ConvertJSON_to_massiv(decodeData, selector)
                KeyValues_GetAndInsertIntoTable_Return_2(resultMass)
                massClimat = resultMass
                FullingDropListsForYellowBlock_ClimatType()
            
            } else if(mode == 5) {
                // console.log(data_inp)
                // console.log(decodeData);
                resultMass = ConvertJSON_to_massiv(decodeData, selector)
                KeyValues_GetAndInsertIntoTable_Return_3(resultMass)
                massivColors = resultMass
                FullingDropListsForYellowBlock_Color()

            } else if(mode == 10) {
                KeyValues_GetAndInsertIntoTable();

            } else {
                console.log(decodeData);
            }
            
            ShowOrHideLoaderDisplay(false); // Скрывает окно загрузки, когда все элементы были получены и обработаны
            if(mode == 2) {
                SetDefaultCursor()
            }
        }
    })
}

massAllelop = [];
massClimat = [];
massivColors = [];

// Автоматическая функция, которая извлекает из каждой записи в JSON формате, данные
// по одному (указанному) полю
// response - ответ в формате JSON, selector - то поле, из которого мы извлекаем данные в массив
function ConvertJSON_to_massiv(response, selector) {
    const result = response.map(item => item[selector]);
    return result;
}

// Заполняем синий список названиями растений
function GetPlantList_andInsertFromLabel(inputMass) {
    // Получаем контейнер, в котором находятся элементы
    const container = document.querySelector('.main-pl-list-cont-pg4');

    // Удаляем все элементы .el-pl-cont-4
    const elementsToRemove = container.querySelectorAll('.el-pl-cont-4');
    for (const element of elementsToRemove) {
      element.remove();
    }

    // Создаем новые элементы из массива значений
    //const values = ['Нейтральная', 'Положительная', 'Отрицательная'];
    for (const value of inputMass) {
      const element = document.createElement('div');
      element.classList.add('el-pl-cont-4');
      element.textContent = value;
      container.appendChild(element);
    }

    // Добавляет к каждому элементу обработчик событий, на показ жёлтого блока
    ShowYellBlock();
}

// Скрывает жёлтый блок с вводом характеристик
function HideYellowBlock() {
    document.querySelector('#yell-block').style.display = "none"

    document.querySelector('#key-haract').style.display = "none"
    document.querySelector('#key-haract-button').addEventListener('click', () => {
        document.querySelector('#key-haract').style.display = "grid"
        document.querySelector('#key-haract-button').style.display = "none"
    })
}

// Добавляет обработчик событий, на показ жёлтого блока
function ShowYellBlock() {
    reqButt = document.querySelectorAll(".el-pl-cont-4");
    //console.log(reqButt);

    reqButt.forEach(elem => {
        elem.addEventListener('click', () => {
            ShowYellowBlock_cont(elem)
        })
    })
}

// Отдельно функция, которая показывает жёлтый блок
function ShowYellowBlock_cont(elem) {
    GrayingInputElement_Hide()

    bool_isChangeAnyInputValues = false;
    document.querySelector('.butt-4-close#b-4-not-edit').style.display = "block" 
    document.querySelector('#b-4-witch-not-save').style.display = "none"
    document.querySelector('#b-4-witch-save').style.display = "none"   

    console.log(elem.textContent);
    document.querySelector('#yell-block').style.display = "grid"
    document.querySelector('#yell-block #param-1 input').value = elem.textContent

    //bool_setPlantList = false;
    //SQL_RQ_FromSwever("select * from MainTable_2")

    sql_req = "select * from MainTable_2 WHERE `Название растения` = '" + elem.textContent + "'";
    console.log(sql_req);

    SQL_RQ_FromSwever(sql_req, "", 2);
}

// Достаёт все значения из JSON формата, и переводит их в массив
function jsonToArray(json) {
    let array = [];

    for (const element of json) {
        array = Object.values(element)
    }

    //console.log("Обработанный массив: ")
    //console.log(array)
    return array;
}

function SetAllInputValues(massAttr) {

    //SetInputValue(1, "000")

    for (let i = 1; i < massAttr.length; i++) {
        if(i != 4 && i != 9 && i != 10 && i < 14) {
            SetInputValue(i, massAttr[i]);
        } else if(i == 4) {
            console.log("mass[4] = " + massAttr[4]);

            const selectElement = document.querySelector(`#yell-block #param-4 select`);

            Array.from(selectElement.options).forEach((option) => {
                if (option.textContent === massAttr[4]) {
                  option.selected = true;
                }
            });
        } else if(i == 9) {
            console.log("mass[9] = " + massAttr[9]);

            const selectElement = document.querySelector(`#yell-block #param-9 select`);

            Array.from(selectElement.options).forEach((option) => {
                if (option.textContent === massAttr[9]) {
                  option.selected = true;
                }
            });
        } else if(i == 17) {
            console.log("mass[17] = " + massAttr[17]);

            const selectElement = document.querySelector(`#yell-block #param-17 select`);

            Array.from(selectElement.options).forEach((option) => {
                if(massAttr[17] == 0) {
                    if (option.textContent == "Нет") {
                        option.selected = true;
                    }
                }
                if(massAttr[17] == 1) {
                    if (option.textContent == "Да") {
                        option.selected = true;
                    }
                }                
            });
        } else if(i == 16) {
            console.log("mass[16] = " + massAttr[16]);

            const selectElement = document.querySelector(`#yell-block #param-16 select`);

            Array.from(selectElement.options).forEach((option) => {
                if (option.textContent === massAttr[16]) {
                  option.selected = true;
                }
            });
        } else if(i == 15) {
            console.log("mass[15] = " + massAttr[15]);

            const selectElement = document.querySelector(`#yell-block #param-15 select`);

            Array.from(selectElement.options).forEach((option) => {
                if (option.textContent === massAttr[15]) {
                  option.selected = true;
                }
            });
        } else if(i == 14) {
            console.log("mass[14] = " + massAttr[14]);

            const selectElement = document.querySelector(`#yell-block #param-14 select`);

            Array.from(selectElement.options).forEach((option) => {
                if (option.textContent === massAttr[14]) {
                  option.selected = true;
                }
            });
        } 
    }    
}

function SetInputValue(id, value) {
    document.querySelector(`#yell-block #param-${id} input`).value = value;
}

bool_isChangeAnyInputValues = false;

function SetCorrCahgeAnyValues() {
    let mass1 = document.querySelectorAll('#yell-block input')
    let mass2 = document.querySelectorAll('#yell-block select')

    let resMass = [... mass1, ... mass2]
    //console.log(resMass);

    document.querySelector('.butt-4-close#b-4-not-edit').style.display = "block" 
    document.querySelector('#b-4-witch-not-save').style.display = "none"
    document.querySelector('#b-4-witch-save').style.display = "none"    

    resMass.forEach(elem => {
        elem.addEventListener('click', () => {
            bool_isChangeAnyInputValues = true;

            document.querySelector('.butt-4-close#b-4-not-edit').style.display = "none"         
            document.querySelector('#b-4-witch-not-save').style.display = "block"
            document.querySelector('#b-4-witch-save').style.display = "block"
        })
    })
}


// Обработчик сворачивания жёлтого блока
function YellBlockHideFunc() {
    let mass1 = document.querySelector('.butt-4-close#b-4-not-edit')  
    let mass2 = document.querySelector('#b-4-witch-not-save')

    let resMass = [mass1, mass2]

    resMass.forEach(elem => {
        elem.addEventListener('click', () => {
            bool_isChangeAnyInputValues = false;

            document.querySelector('#yell-block').style.display = "none" 
        })
    })
}

// Печатаются ли в консоли получаемые от сервера значения таблиц, которые далее выводятся на странице
bool_isPrintGivetTablesValues = false

// Аллелопатия

// Получение значений, и их вставка в таблицы, для ключевых признаков
function KeyValues_GetAndInsertIntoTable() {
    resultMass = SQL_RQ_FromSwever("SELECT * FROM `Allelopathy`", "allelopathy_description", 3)

    KeyValues_GetAndInsertIntoTable_2();
    KeyValues_GetAndInsertIntoTable_3();
}

// Дальше, из асинхронной функции вызывается эта функция
function KeyValues_GetAndInsertIntoTable_Return(resultMass) {
    if(bool_isPrintGivetTablesValues) console.log(resultMass);

    // Получаем таблицу
    const table = document.getElementById('a12');

    // Очищаем тело таблицы
    const tbody = table.querySelector('tbody');
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    // Добавляем новые строки
    for (const value of resultMass) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
}

// Тип климата

// Получение значений, и их вставка в таблицы, для ключевых признаков
function KeyValues_GetAndInsertIntoTable_2() {
    resultMass = SQL_RQ_FromSwever("SELECT * FROM `ClimateTypes`", "climate_type_name", 4)
    //console.log(resultMass);
}

// Дальше, из асинхронной функции вызывается эта функция
function KeyValues_GetAndInsertIntoTable_Return_2(resultMass) {
    if(bool_isPrintGivetTablesValues) console.log(resultMass);

    // Получаем таблицу
    const table = document.getElementById('a14');

    // Очищаем тело таблицы
    const tbody = table.querySelector('tbody');
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    // Добавляем новые строки
    for (const value of resultMass) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
}

// Цвет

// Получение значений, и их вставка в таблицы, для ключевых признаков
function KeyValues_GetAndInsertIntoTable_3() {
    resultMass = SQL_RQ_FromSwever("SELECT * FROM `PlantColors_2`", "plant_color_description", 5)
    //console.log(resultMass);
}

// Дальше, из асинхронной функции вызывается эта функция
function KeyValues_GetAndInsertIntoTable_Return_3(resultMass) {
    if(bool_isPrintGivetTablesValues) console.log(resultMass);

    // Получаем таблицу
    const table = document.getElementById('a16');

    // Очищаем тело таблицы
    const tbody = table.querySelector('tbody');
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    // Добавляем новые строки
    for (const value of resultMass) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
}


// // Наполнение выпадающих списков в жёлтом окне
// function FullingDropListsForYellowBlock() {
    
// }

function FullingDropListsForYellowBlock_Allelop() {
    //console.log(massAllelop);

    const selectAllel = document.getElementById('select-allel');

    // Очистка существующих опций
    while (selectAllel.firstChild) {
      selectAllel.removeChild(selectAllel.firstChild);
    }
    
    // Добавление новых опций из массива
    massAllelop.forEach((allelop) => {
      const option = document.createElement('option');
      option.value = allelop;
      option.textContent = allelop;
      selectAllel.appendChild(option);
    });
    
    // Установка первой опции как выбранной
    selectAllel.selectedIndex = 0;
}

function FullingDropListsForYellowBlock_ClimatType() {
    if(bool_isPrintGivetTablesValues) console.log(massClimat);

    const selectAllel = document.getElementById('select-type-cl');

    // Очистка существующих опций
    while (selectAllel.firstChild) {
      selectAllel.removeChild(selectAllel.firstChild);
    }
    
    // Добавление новых опций из массива
    massClimat.forEach((allelop) => {
      const option = document.createElement('option');
      option.value = allelop;
      option.textContent = allelop;
      selectAllel.appendChild(option);
    });
    
    // Установка первой опции как выбранной
    selectAllel.selectedIndex = 0;
}

function FullingDropListsForYellowBlock_Color() {
    if(bool_isPrintGivetTablesValues) console.log(massivColors);

    const selectAllel = document.getElementById('select-color');

    // Очистка существующих опций
    while (selectAllel.firstChild) {
      selectAllel.removeChild(selectAllel.firstChild);
    }
    
    // Добавление новых опций из массива
    massivColors.forEach((allelop) => {
      const option = document.createElement('option');
      option.value = allelop;
      option.textContent = allelop;
      selectAllel.appendChild(option);
    });
    
    // Установка первой опции как выбранной
    selectAllel.selectedIndex = 0;
}



// Обработка выделения элементов в синем блоке
function ProcessSelectObjectForBlueBlock() {
    reqButt = document.querySelectorAll(".el-pl-cont-4");
    //console.log(reqButt);

    reqButt.forEach(elem => {
        elem.addEventListener('click', () => {
            //console.log("123");

            // Удаляем выделение у старого элемента
            const oldElem = document.querySelector(".el-blue-button-selected");
            if (oldElem) {
              oldElem.classList.remove('el-blue-button-selected');
            }

            // Добавляем выделение
            elem.classList.add('el-blue-button-selected');
            
        })
    })

    let currentIndex = 0;
    const elements = document.querySelectorAll('.el-pl-cont-4');
    
    function selectElement(index) {
      // Удаляем выделение у старого элемента
      const oldElem = document.querySelector(".el-blue-button-selected");
      if (oldElem) {
        oldElem.classList.remove('el-blue-button-selected');
      }
    
      // Добавляем выделение
      const elem = elements[index];
      elem.classList.add('el-blue-button-selected');
      //elem.scrollIntoView({ behavior: 'auto' });
      //elem.scrollIntoView({ behavior: 'auto', inline: 'nearest'});


    //   element.scrollTo({
    //     top: elem.offsetTop,
    //     behavior: 'auto',
    //     inline: 'start'
    //   });

      ShowYellowBlock_cont(elem)
    }


    document.querySelector("#butt-go-top").addEventListener('click', () => {
        goToFirst()
    })

    document.querySelector("#butt-go-bottom").addEventListener('click', () => {
        goToLast()
    })


    
    function goToFirst() {
      currentIndex = 0;
      selectElement(currentIndex);
      const element = document.querySelector('.main-pl-list-cont-pg4');
      element.scrollTop = 0;
    }
    
    function goToLast() {
      currentIndex = elements.length - 1;
      selectElement(currentIndex);
      const element = document.querySelector('.main-pl-list-cont-pg4');
      element.scrollTop = element.scrollHeight;
    }    
}


reqelement_oi1 = document.querySelectorAll("#yell-block input");
reqelement_oi2 = document.querySelectorAll("#yell-block select");

// function GrayingInputElement() {
//     let resMass = [... reqelement_oi1, ... reqelement_oi2]

//     console.log("Меняю цвет текста");

//     resMass.forEach(element => {
//         //element.style.setProperty('color', 'lightgray');
//         element.style.setProperty('color', 'white');
//         setTimeout(() => {
//           element.style.setProperty('color', 'black');
//         }, 200); 
//       });
// }
function GrayingInputElement_Hide() {
    let resMass = [... reqelement_oi1, ... reqelement_oi2]

    console.log("Меняю цвет текста");

    resMass.forEach(element => {
        //element.style.setProperty('color', 'lightgray');
        element.style.setProperty('color', 'white');
    });
}

function GrayingInputElement_Show() {
    let resMass = [... reqelement_oi1, ... reqelement_oi2]

    console.log("Меняю цвет текста");

    resMass.forEach(element => {
        //element.style.setProperty('color', 'lightgray');
        element.style.setProperty('color', 'black');
    });
}



// ---------  Код для обработки добавления ключевых признаков


errTextAllelop = document.querySelector('#allelop .err-4-4-2')
errTextClType = document.querySelector('#cl-type .err-4-4-2')
errTextColorType = document.querySelector('#color-type .err-4-4-2')


// Обработка текста об ошибке, для полей ввода новых значений для ключевых признаков
function ProcessHideErrorTextForKeyAdds() {
    //.err-4-4-2
    
    errTextAllelop.style.display = "none"
    errTextClType.style.display = "none"
    errTextColorType.style.display = "none"
}


// Обработчик нажатия на кнопки "Добавить", для блоков Аллелопатии, типа климата, и цвета
function ProcessClickToButtonADDAnOther() {
    buttAllelop = document.querySelector('#allelop-butt-add')
    buttClType = document.querySelector('#cl-type-butt-add')
    buttAddColor = document.querySelector('.color-butt-add')

    buttAllelop.addEventListener('click', () => { 
        PostReqToAddAllelopValue();
    })

    buttClType.addEventListener('click', () => { 
        PostReqToAddClTypeValue();
    })

    buttAddColor.addEventListener('click', () => { 
        PostReqToAddColotTypeValue();
    })
}

// Посылаю на сервер запрос, на добавление нового признака - аллелопатии
function PostReqToAddAllelopValue() {
    textNewAllelopPr = document.querySelector('#allelop input').value

    if(textNewAllelopPr == "") {
        errTextAllelop.style.display = "block"
    } else {
        errTextAllelop.style.display = "none"
        SQL_reqToAddAllelopElem = "INSERT INTO `Allelopathy` (`allelopathy_description`) VALUES ('" + 
        textNewAllelopPr + "');";
    
        //console.log("SQL_reqToAddAllelopElem = " + SQL_reqToAddAllelopElem);
    
        SQL_RQ_FromSwever(SQL_reqToAddAllelopElem, "", 10);
    
        //KeyValues_GetAndInsertIntoTable(); // - это вызывается после SQL запроса, это обновление всех 3х таблиц
    }
}

// Посылаю на сервер запрос, на добавление нового признака - типа климата
function PostReqToAddClTypeValue() {
    textNewPr = document.querySelector('#cl-type input').value

    if(textNewPr == "") {
        errTextClType.style.display = "block"
    } else {
        errTextClType.style.display = "none"
        SQL_reqToAddAllelopElem = "INSERT INTO `ClimateTypes` (`climate_type_name`) VALUES ('" + 
        textNewPr + "');";
    
        //console.log("SQL_reqToAddAllelopElem = " + SQL_reqToAddAllelopElem);
    
        SQL_RQ_FromSwever(SQL_reqToAddAllelopElem, "", 10);
    
        //KeyValues_GetAndInsertIntoTable(); // - это вызывается после SQL запроса, это обновление всех 3х таблиц
    }
}

// Посылаю на сервер запрос, на добавление нового признака - цвета
function PostReqToAddColotTypeValue() {
    textNewPr = document.querySelector('#color-type input').value

    if(textNewPr == "") {
        errTextColorType.style.display = "block"
    } else {
        errTextColorType.style.display = "none"
        SQL_reqToAddAllelopElem = "INSERT INTO `PlantColors_2` (`plant_color_description`) VALUES ('" + 
        textNewPr + "');";
    
        //console.log("SQL_reqToAddAllelopElem = " + SQL_reqToAddAllelopElem);
    
        SQL_RQ_FromSwever(SQL_reqToAddAllelopElem, "", 10);
    
        //KeyValues_GetAndInsertIntoTable(); // - это вызывается после SQL запроса, это обновление всех 3х таблиц
    }
}



// ----------





// В синем списке сделать сортировку по возрастанию 1го поля - имени






















































