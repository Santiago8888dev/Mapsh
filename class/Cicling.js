import Workout from './Wokout.js';

export default class Cycling extends Workout{
    type = 'cycling'
    constructor(coords,distance,duration, elevationGain){
        super(coords,distance,duration)
        this.elevationGain = elevationGain
        this.calcSpeed();
    }

    calcSpeed(){
        this.speed = this.distance/ (this.duration / 60 )
        return this.speed;
    }
}


// const cycling1 = new Cycling([39, -12], 27, 95, 523);
// console.log( cycling1);
