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



class App {

    #map;
    #mapEvent;

    constructor() {
        this._getPosition();

        form.addEventListener('submit', this._newWorkout.bind(this))

        inputType.addEventListener('change',this._toggleElevationField )


    }

    _getPosition() {
        if (navigator.geolocation) {                   //callback el this es de _getPosition
            navigator?.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
                alert('error')
            })
        }
    }

    _loadMap(position) {
        console.log(this);
        const { latitude, longitude } = position.coords
        const coords = [latitude, longitude]
        this.#map = L.map('map').setView(coords, 13);
        // console.log(`https://www.google.pt/maps/@${latitude},${longitude}z?entry=ttu`)

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        this.#map.on('click', this._showForm.bind(this))

    }

    _showForm(mapE) {
        this.#mapEvent = mapE
        form.classList.remove('hidden')
        inputDistance.focus()
    }

    _toggleElevationField() {
        //? Luego, usa classList.toggle() para alternar la presencia de la clase form__row--hidden. Esto significa que si la clase está presente, se eliminará; y si no está presente, se agregará. 
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
        
    }

    _newWorkout(e) {
        e.preventDefault()
        const { lat, lng } = this.#mapEvent.latlng

        L.marker([lat, lng]).addTo(this.#map)
            .bindPopup(L.popup({ maxWidth: 250, minWidth: 100, autoclose: false, closeOnClick: false, className: 'running-popup ' }))
            .setPopupContent('Sh Programing')
            .openPopup();

        inputElevation.value = inputCadence.value = inputDistance.value = inputDuration.value = '';
    }
}

const app = new App();