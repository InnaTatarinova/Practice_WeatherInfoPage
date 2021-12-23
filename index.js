let spanTemp = document.querySelector(".temperature");
let imgWeather = document.querySelector(".img_weather");
let wind_direction = document.querySelector("#wind_direction");
let wind_speed = document.querySelector("#wind_speed");
let pressure = document.querySelector("#pressure");
let sunrise = document.querySelector("#sunrise");
let sunset = document.querySelector("#sunset");

class City{
    constructor(name,url){
        this.name = name;
        this.url = url;
    }


}

let kyiv = new City("Київ", "http://api.openweathermap.org/data/2.5/weather?id=703448&appid=bf35cac91880cb98375230fb443a116f");
let london = new City("Лондон", "http://api.openweathermap.org/data/2.5/weather?id=2643743&appid=bf35cac91880cb98375230fb443a116f");
let newYork = new City("Нью-Йорк", "http://api.openweathermap.org/data/2.5/weather?id=5128638&appid=bf35cac91880cb98375230fb443a116f");

getWeatherInfo(kyiv);

function getWeatherInfo(object){
    fetch(object.url)
    .then(response => response.json())
    .then(json =>{
        spanTemp.textContent = json.main.temp;
        
    })
}

