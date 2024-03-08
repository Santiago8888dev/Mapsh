export default class Workout{
    data = new Date();
    id = ( Date.now() + '').slice(-10)
    clicks = 0;
    

    constructor(coords, distance, duration){
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }

    _setDescription() {
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on  ${months[this.data.getMonth()]} ${this.data.getDate()}`
        console.log(this.description);

    }

    click(){
        this.clicks++;
    }
}
