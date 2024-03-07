import Workout from './Wokout.js';

export default class Running extends Workout{
    type = 'running'
    constructor(coords,distance,duration, cadense){
        super(coords,distance,duration)
        this.cadense = cadense
        this.calcPace();
    }

    calcPace(){
        this.pace = this.duration / this.distance;
        return this.pace
    }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);

// console.log(run1);

