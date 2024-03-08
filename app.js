// 'use strict';

import Cycling from "./class/Cicling.js";
import Running from "./class/Running.js";

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');



class App {

    #map;
    #mapZoom = 13;
    #mapEvent;
    #workouts = [];

    constructor() {
        this._getPosition();
        this._get_LocalStorage()
        form.addEventListener('submit', this._newWorkout.bind(this))
        inputType.addEventListener('change', this._toggleElevationField)
        containerWorkouts.addEventListener('click', this._moveToPopup.bind(this))
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
        this.#map = L.map('map').setView(coords, this.#mapZoom);
        // console.log(`https://www.google.pt/maps/@${latitude},${longitude}z?entry=ttu`)

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        this.#map.on('click', this._showForm.bind(this))

        this.#workouts.forEach((work) => {
            this.renderWorkoutMArker(work)
        })

    }

    _showForm(mapE) {
        this.#mapEvent = mapE
        form.classList.remove('hidden')
        inputDistance.focus()
    }

    _hiddeForms(){
        inputElevation.value = inputCadence.value = inputDistance.value = inputDuration.value = '';
        form.style.display = 'none'
        form.classList.add('hidden')
        setTimeout(()=> form.style.display = 'grid' ,1000)
    }

    _toggleElevationField() {
        //? Luego, usa classList.toggle() para alternar la presencia de la clase form__row--hidden. Esto significa que si la clase está presente, se eliminará; y si no está presente, se agregará. 
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')

    }

    _newWorkout(e) {
        const validateInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp))
        const allPositive = (...inputs) => inputs.every(inp => inp > 0)

        e.preventDefault()
        let workout;
        const type = inputType.value;
        const distance = +inputDistance.value
        const duration = +inputDuration.value
        const { lat, lng } = this.#mapEvent.latlng

        if (type === 'running') {
            const cadense = +inputCadence.value
            if (!validateInputs(distance, duration, cadense) || !allPositive(distance, duration, cadense)) {
                return alert('error value not is number')
            }
            workout = new Running([lat, lng], distance, duration, cadense)
        }

        if (type === 'cycling') {
            const elevation = +inputElevation.value

            if (!validateInputs(distance, duration, elevation) || !allPositive(distance, duration)) {
                return alert('error value not is number')
            }
            workout = new Cycling([lat, lng], distance, duration, elevation)

        }
        this._renderWorkout(workout)

        this.#workouts.push(workout)

        this.renderWorkoutMArker(workout)

        this._setLocalStorage()
    }

    _renderWorkout(workout) {
        let html = ` 
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>`

        if (workout.type === 'running') {
            html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadense}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`
        }

        if (workout.type === 'cycling') {
            html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li> -->`
        }

        form.insertAdjacentHTML('afterend', html)
    }


    renderWorkoutMArker(workout) {
        L.marker(workout.coords).addTo(this.#map)
            .bindPopup(L.popup({ maxWidth: 250, minWidth: 100, autoclose: false, closeOnClick: false, className: `${workout.type}-popup` }))
            .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`)
            .openPopup();

        this._hiddeForms();
    }

    _moveToPopup(e){
        const workoutEl = e.target.closest('.workout')
        if (!workoutEl) return 
        const workout = this.#workouts.find(work => work.id === workoutEl.dataset.id)
        console.log(workout);
        this.#map.setView(workout.coords, this.#mapZoom, {animation : true , pan:{ duration : 1,} })
        // workout.click()
    }

    _setLocalStorage(){
        localStorage.setItem('workouts', JSON.stringify(this.#workouts))
    }

    _get_LocalStorage(){
        let data =JSON.parse(localStorage.getItem('workouts'))
        
        if (!data) return

        this.#workouts = data

        this.#workouts.forEach((work) => {
            this._renderWorkout(work)
            
        })
       
    }

    reset(){
        localStorage.removeItem('workouts')
        location.reload()
    }
}


(() =>{
    const app = new App();

})()