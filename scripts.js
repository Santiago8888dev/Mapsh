'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map, mapEvent;

navigator?.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    const coords = [latitude, longitude]
    map = L.map('map').setView(coords, 13);

    // console.log(`https://www.google.pt/maps/@${latitude},${longitude}z?entry=ttu`)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('click', (mapE) => {
        mapEvent = mapE
        form.classList.remove('hidden')
        inputDistance.focus()
    })

}, () => {
    alert('error con la coneccion')
})

form.addEventListener('submit', function (e) {
    e.preventDefault()
    const { lat, lng } = mapEvent.latlng
    L.marker([lat, lng]).addTo(map)
        .bindPopup(L.popup({ maxWidth: 250, minWidth: 100, autoclose: false, closeOnClick: false, className: 'running-popup ' }))
        .setPopupContent('Sh Programing')
        .openPopup();

    inputElevation.value = inputCadence.value =inputDistance.value = inputDuration.value= '';
})

inputType.addEventListener('change', function(){
    // Luego, usa classList.toggle() para alternar la presencia de la clase form__row--hidden. Esto significa que si la clase está presente, se eliminará; y si no está presente, se agregará. 
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
})