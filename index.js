
class City {
    constructor(name, url, urlBackground) {
        this.name = name;
        this.url = url;
        this.urlBackground = urlBackground;
    }

    // getBackground() {
    //     document.querySelector(".weatherInfoBlock").style.backgroundImage = `url(${this.urlBackground})`;
    // }

    getBackground(div) {
        div.style.backgroundImage = `url(${this.urlBackground})`;
    }


}

class CityInfo extends City {
    constructor(name, temp, img, wind_direction, wind_speed, pressure, sunrise, sunset) {
        super(name);
        this.temp = temp;
        this.img = img;
        this.wind_direction = wind_direction;
        this.wind_speed = wind_speed;
        this.pressure = pressure;
        this.sunrise = sunrise;
        this.sunset = sunset;
    }

    renderIn(divCity) {
        let html = Mustache.render(document.getElementById("block").innerHTML, this);
        divCity.innerHTML += html;
    }
}

getWeather();

async function getWeather() {

    let kyiv = new City("Киев", "http://api.openweathermap.org/data/2.5/weather?id=703448&appid=bf35cac91880cb98375230fb443a116f", "img/Kyiv.jpg");
    await getWeatherInfo(kyiv);

    let london = new City("Лондон", "http://api.openweathermap.org/data/2.5/weather?id=2643743&appid=bf35cac91880cb98375230fb443a116f", "img/London.jpg");
    //london.getBackground();
    await getWeatherInfo(london);

    let newYork = new City("Нью-Йорк", "http://api.openweathermap.org/data/2.5/weather?id=5128638&appid=bf35cac91880cb98375230fb443a116f", "img/NY.jpg");
    await getWeatherInfo(newYork);

}

async function getWeatherInfo(object) {
    await fetch(object.url)
        .then(response => response.json())
        .then(json => {
            let temp = json.main.temp;
            let img = getImgURL(json.weather[0].icon);
            let wind_direction = getWindDirection(json.wind.deg);
            let wind_speed = json.wind.speed;
            let pressure = json.main.pressure;
            let sunrise = getTime(json.sys.sunrise);
            let sunset = getTime(json.sys.sunset);

            let cityInfo = new CityInfo(object.name, temp, img, wind_direction, wind_speed, pressure, sunrise, sunset);

            let div = document.createElement("div");
            div.setAttribute("class", "weatherInfoBlock");
            // let maindiv = document.getElementsByClassName("main_background");
            let maindiv = document.querySelector(".main_background");
            // maindiv[0].appendChild(div);
            maindiv.appendChild(div);

            object.getBackground(div);
            cityInfo.renderIn(div);


            // let template = document.getElementById("block").innerHTML;
            // let output = Mustache.render(template, cityInfo);
            // let mainDiv = document.querySelector(".weatherInfoBlock").innerHTML = output;

        })
        .catch(error => console.log(error.message));
}

function getImgURL(icon) {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`
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
        return "CЗ"
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

function testTime(item) {
    item = item.toString();
    if (item.length > 1) {
        return item;
    } else {
        return "0" + item;
    }

}

