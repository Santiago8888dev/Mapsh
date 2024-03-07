// 'use strict';

import Cycling from "./class/Cicling.js";
import Running from "./class/Running.js";
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
    #workouts = [];

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
        const validateInputs = (...inputs)=> inputs.every(inp => Number.isFinite(inp))
        const allPositive = (...inputs) => inputs.every(inp => inp > 0)
        
        e.preventDefault()
        let workout ;
        const type = inputType.value;
        const distance = +inputDistance.value
        const duration = +inputDuration.value
        const { lat, lng } = this.#mapEvent.latlng

        if (type === 'running') {
            const cadense = +inputCadence.value
            if (!validateInputs(distance, duration,cadense) || !allPositive(distance, duration , cadense)) {
                return alert('error value not is number')
            }
             workout = new Running([lat,lng], distance, duration, cadense)
        }
        
        if (type === 'cycling') {
            const elevation = +inputElevation.value
            
            if (!validateInputs(distance, duration,elevation) || !allPositive(distance,duration)) {
                return alert('error value not is number')
            }
            workout = new Cycling([lat,lng], distance, duration ,elevation)
            
        }
        
        this.#workouts.push(workout)
        
        

        this.renderWorkoutMArker(workout)
    }

    renderWorkoutMArker(workout){
        L.marker(workout.coords).addTo(this.#map)
            .bindPopup(L.popup({ maxWidth: 250, minWidth: 100, autoclose: false, closeOnClick: false, className: `${workout.type}-popup ` }))
            .setPopupContent(`${workout.distance}`)
            .openPopup();

        inputElevation.value = inputCadence.value = inputDistance.value = inputDuration.value = '';
    }
}

const app = new App();