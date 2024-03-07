export default class Workout{
    data = new Date();
    id = ( Date.now() + '').slice(-10)
    

    constructor(coords, distance, duration){
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }
}
