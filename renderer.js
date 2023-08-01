'use strict';

let childWindow = null;
let on_click = () => {
    childWindow = window.open('aux-win.html', "opened window", "_OWTag");

    setTimeout( () => {
        location.reload();
    }, 1000 );
};

document.getElementById('window_open_btn').addEventListener('click', on_click);

window.onbeforeunload = () => {
    childWindow.close();
    document.getElementById('window_open_btn').removeEventListener('click', on_click);
};