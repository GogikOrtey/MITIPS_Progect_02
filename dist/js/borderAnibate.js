// document.addEventListener("DOMContentLoaded", function() {
//     var block = document.querySelector('.butt-start');
//     var dashArray = ['red 10px', 'transparent 10px'];
//     var dashOffset = 0;

//     function animateBorder() {
//         dashOffset = (dashOffset + 1) % 20;
//         dashArray[1] = 'transparent ' + dashOffset + 'px';
//         var borderStyle = '10px dashed ' + dashArray.join(', ');
//         block.style.border = borderStyle;
//         block.style.borderRadius = '15px';
//         block.style.WebkitBorderImage = 
//         block.style.borderImage = 
//             'linear-gradient(45deg, ' + dashArray.join(', ') + ') 1';
//         requestAnimationFrame(animateBorder);
//     }

//     animateBorder();
// });

// document.addEventListener("DOMContentLoaded", function() {
//     var block = document.querySelector('.butt-start');
//     var dashArray = ['red 10px', 'transparent 10px'];
//     var dashOffset = 0;

//     function animateBorder() {
//         dashOffset = (dashOffset + 1) % 20;
//         dashArray[1] = 'transparent ' + ((dashOffset % 10) + 10) + 'px';
//         var borderStyle = '10px dashed ' + dashArray.join(', ');
//         block.style.border = borderStyle;
//         block.style.borderRadius = '15px';
//         block.style.WebkitBorderImage = 
//         block.style.borderImage = 
//             'linear-gradient(45deg, ' + dashArray.join(', ') + ') 1';
//         requestAnimationFrame(animateBorder);
//     }

//     animateBorder();
// });



// document.addEventListener("DOMContentLoaded", function() {
//     // Создаем элемент div для каждой линии
//     for (let i = 0; i < 50; i++) {
//         let div = document.createElement('div');
//         div.style.width = '100vw';
//         div.style.height = '10px';
//         div.style.position = 'absolute';
//         div.style.top = `${i * 10}px`;
//         div.style.background = i % 2 === 0 ? 'red' : 'transparent';
//         div.style.transform = 'rotate(45deg)';
//         div.style.animation = `move 5s linear infinite`;
//         document.body.appendChild(div);
//     }
    
//     // Добавляем анимацию
//     let style = document.createElement('style');
//     style.innerHTML = `
//         @keyframes move {
//             100% { transform: rotate(45deg) translateX(-50vw); }
//             100% { transform: rotate(45deg) translateX(50vw); }
//         }
//     `;

//     var block = document.querySelector('.butt-start');
//     block.appendChild(style);
// });


// document.addEventListener("DOMContentLoaded", function() {
//     let distance = 16;
//     setInterval(function() {
//         let element = document.querySelector('.butt-start');
//         let backgroundStyle = `linear-gradient(white, white), repeating-linear-gradient(-45deg, #20f00d, #20f00d 10px, transparent 5px, transparent ${distance}px)`;
//         element.style.background = backgroundStyle;
//         distance++;
//         if (distance > 20) {
//             distance = 16;
//         }
//     }, 10);
// });

document.addEventListener("DOMContentLoaded", function() {
    let distance = 12;
    let distance_2 = 3;
    setInterval(function() {
        var element = document.querySelector('.butt-start');
        if (element) {
            element.style.borderRadius = '15px';
            element.style.border = '3px solid transparent';
            element.style.background = `linear-gradient(white, white), repeating-linear-gradient(-45deg, #20f00d, #20f00d ${distance_2}%, transparent 5px, transparent ${distance}%)`;
            element.style.backgroundClip = 'padding-box, border-box';
            element.style.backgroundOrigin = 'padding-box, border-box';
            element.style.boxSizing = 'border-box';
            element.style.backgroundPosition = '0 0';
        }

        distance+=2;
        if (distance > 15) {
            distance = 10;
        }

        distance_2+=1;
        if (distance_2 > 7) {
            distance_2 = 3;
        }
    }, 75);
});
