// let cityDiv = document.querySelector(".weatherInfoBlock");
// let spanTemp = document.querySelector(".temperature");
// let imgWeather = document.querySelector(".img_weather");
// let wind_direction = document.querySelector("#wind_direction");
// let wind_speed = document.querySelector("#wind_speed");
// let pressure = document.querySelector("#pressure");
// let sunrise = document.querySelector("#sunrise");
// let sunset = document.querySelector("#sunset");

class City {
    constructor(name, url, urlBackground) {
        this.name = name;
        this.url = url;
        this.urlBackground = urlBackground;
    }

    getBackground() {
        document.querySelector(".weatherInfoBlock").style.backgroundImage = `url(${this.urlBackground})`;
    }



}

class CityInfo extends City {
    constructor(name, temp, wind_direction, wind_speed, pressure, sunrise, sunset) {
        super(name);
        this.temp = temp;
        //this.img = img;
        this.wind_direction = wind_direction;
        this.wind_speed = wind_speed;
        this.pressure = pressure;
        this.sunrise = sunrise;
        this.sunset = sunset;
    }
}

let kyiv = new City("Киев", "http://api.openweathermap.org/data/2.5/weather?id=703448&appid=bf35cac91880cb98375230fb443a116f", "img/Kyiv.jpg");
kyiv.getBackground();
getWeatherInfo(kyiv);

let london = new City("Лондон", "http://api.openweathermap.org/data/2.5/weather?id=2643743&appid=bf35cac91880cb98375230fb443a116f", "img/London.jpg");
let newYork = new City("Нью-Йорк", "http://api.openweathermap.org/data/2.5/weather?id=5128638&appid=bf35cac91880cb98375230fb443a116f", "img/NY.jpg");



function getWeatherInfo(object) {
    fetch(object.url)
        .then(response => response.json())
        .then(json => {
            let temp = json.main.temp;
            // let img = json.main.icon;
            let wind_direction = getWindDirection(json.wind.deg);
            let wind_speed = json.wind.speed;
            let pressure = json.main.pressure;
            let sunrise = getTime(json.sys.sunrise);
            let sunset = getTime(json.sys.sunset);
            let cityInfo = new CityInfo("Киев", temp, wind_direction, wind_speed, pressure, sunrise, sunset);


            let template = document.getElementById("block").innerHTML;
            let output = Mustache.render(template, cityInfo);
            let mainDiv = document.querySelector(".weatherInfoBlock").innerHTML = output;
            let i = document.querySelector(".weatherInfoBlock");



        })
        .catch(error => console.log(error.message));
}

function getWindDirection(degree) {
    if (degree == 90) {
        return "В"
    } else if (degree == 360) {
        return "C"
    } else if (degree == 270) {
        return "З"
    } else if (degree == 180) {
        return "Ю"
    } else if (degree > 270 && degree < 360) {
        return "CP"
    } else if (degree > 180 && degree < 270) {
        return "ЮЗ"
    } else if (degree > 90 && degree < 180) {
        return "ЮВ"
    } else if (degree > 0 && degree < 90) {
        return "СВ"
    }
}

function getTime(ms) {

    let date = new Date(ms * 1000);
    let hours = testTime(date.getHours());
    let minutes = testTime(date.getMinutes());
    let seconds = testTime(date.getSeconds());
    let time = hours + ':' + minutes + ':' + seconds;

    console.log(time);

    return time;

}

function testTime(item){
    item = item.toString();
    if(item.length >1){
        return item;
    } else {
        return "0"+item;
    }

}

