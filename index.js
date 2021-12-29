
class City {
    constructor(name, url, urlBackgroundDay, urlBackgroundNight) {
        this.name = name;
        this.url = url;
        this.urlBackgroundDay = urlBackgroundDay;
        this.urlBackgroundNight = urlBackgroundNight;
    }

    getBackground(div) {
        const d = new Date();
        let hour = d.getHours();
        if (hour > 7 && hour < 19) {
            div.style.backgroundImage = `url(${this.urlBackgroundDay})`;
            div.style.color = "black";
        } else {
            div.style.backgroundImage = `url(${this.urlBackgroundNight})`;
        }
    }
}

class CityInfo extends City {
    constructor(name, temp, img, wind_direction, wind_speed, pressure, sunrise, sunset, day1, day2, day3, day4, day5, temp1, temp2, temp3, temp4, temp5, img1, img2, img3, img4, img5) {
        super(name);
        this.temp = temp;
        this.img = img;
        this.wind_direction = wind_direction;
        this.wind_speed = wind_speed;
        this.pressure = pressure;
        this.sunrise = sunrise;
        this.sunset = sunset;
        this.Day1 = day1;
        this.Day2 = day2;
        this.Day3 = day3;
        this.Day4 = day4;
        this.Day5 = day5;
        this.temperature1 = temp1;
        this.temperature2 = temp2;
        this.temperature3 = temp3;
        this.temperature4 = temp4;
        this.temperature5 = temp5;
        this.img1 = img1;
        this.img2 = img2;
        this.img3 = img3;
        this.img4 = img4;
        this.img5 = img5;
    }

    renderIn(divCity) {
        let html = Mustache.render(document.getElementById("block").innerHTML, this);
        divCity.innerHTML += html;
    }
}

getWeather();

let radioBtnTemp = document.querySelectorAll('input[name="tempMeasure"]');
for (let i = 0; i < radioBtnTemp.length; i++) {
    radioBtnTemp[i].addEventListener("change", function () {
        
        let val = this.value;
        let arr = document.querySelectorAll(".temp");
        for (let item of arr) {
            let i = item.textContent.split("°");
            switch (val) {
                case "Cel":
                    item.innerHTML = Math.round((Number(i[0]) - 32) * 5 / 9) + "°";
                    break;

                case "Far":
                    item.innerHTML = Math.round(Number(i[0]) * 9 / 5 + 32) + "°";
                    break;
            }
        }
        console.log(val);
    });
}

let radioBtnSpeed = document.querySelectorAll('input[name="speedMeasure"]');
for (let i = 0; i < radioBtnSpeed.length; i++) {
    radioBtnSpeed[i].addEventListener("change", function () {
        let val = this.value;
        let arr = document.querySelectorAll("#wind_speed");
        for (let item of arr) {
            let i = item.textContent;
            switch (val) {
                case "m/sec":
                    i = i.split("км/час");
                    item.innerHTML = Math.round(Number(i[0]) / 3, 6) + "м/сек";
                    break;

                case "km/hours":
                    i = i.split("м/сек");
                    item.innerHTML = Math.round(Number(i[0]) * 3, 6) + "км/час";
                    break;
            }
        }
        console.log(val);
    });
}



async function getWeather() {

    let kyiv = new City("Киев", "http://api.openweathermap.org/data/2.5/weather?id=703448&appid=bf35cac91880cb98375230fb443a116f", "img/Kyiv_day1.jpg", "img/Kyiv.jpg");
    await getWeatherInfo(kyiv);

    let london = new City("Лондон", "http://api.openweathermap.org/data/2.5/weather?id=2643743&appid=bf35cac91880cb98375230fb443a116f", "img/London_day2.jpg", "img/London3.jpg");

    await getWeatherInfo(london);

    let newYork = new City("Нью-Йорк", "http://api.openweathermap.org/data/2.5/weather?id=5128638&appid=bf35cac91880cb98375230fb443a116f", "img/NY_day2.jpg", "img/NY.jpg");
    await getWeatherInfo(newYork);

}


async function getWeatherInfo(object) {
    await fetch(object.url)
        .then(response => response.json())
        .then(async (json) => {
            let temp = getTempCel(json.main.temp);
            let img = getImgURL(json.weather[0].icon);
            let wind_direction = getWindDirection(json.wind.deg);
            let wind_speed = Math.round(json.wind.speed);
            let pressure = json.main.pressure;
            let sunrise = getTimeForDate(json.sys.sunrise);
            let sunset = getTimeForDate(json.sys.sunset);

            let lon = json.coord.lon;
            let lat = json.coord.lat;
            let weatherFor5Day = await getInfoFor5Day(lon, lat);

            let Day1 = weatherFor5Day[0].Day;
            let Day2 = weatherFor5Day[1].Day;
            let Day3 = weatherFor5Day[2].Day;
            let Day4 = weatherFor5Day[3].Day;
            let Day5 = weatherFor5Day[4].Day;

            let temperature1 = weatherFor5Day[0].temperature;
            let temperature2 = weatherFor5Day[1].temperature;
            let temperature3 = weatherFor5Day[2].temperature;
            let temperature4 = weatherFor5Day[3].temperature;
            let temperature5 = weatherFor5Day[4].temperature;

            let img1 = weatherFor5Day[0].img;
            let img2 = weatherFor5Day[1].img;
            let img3 = weatherFor5Day[2].img;
            let img4 = weatherFor5Day[3].img;
            let img5 = weatherFor5Day[4].img;

            let cityInfo = new CityInfo(object.name, temp, img, wind_direction, wind_speed, pressure, sunrise, sunset, Day1, Day2, Day3, Day4, Day5, temperature1, temperature2, temperature3, temperature4, temperature5, img1, img2, img3, img4, img5);

            let div = document.createElement("div");
            div.setAttribute("class", "weatherInfoBlock");
            let maindiv = document.querySelector(".divForCity");
            maindiv.appendChild(div);

            object.getBackground(div);

            cityInfo.renderIn(div);
        })
        .catch(error => console.log(error.message));
}




async function getInfoFor5Day(lon, lat) {

    let jsonTxt = "{\"lat\":50.4333,\"lon\":30.5167,\"timezone\":\"Europe/Kiev\",\"timezone_offset\":7200,\"minutely\":[{\"dt\":1640631000,\"precipitation\":0},{\"dt\":1640631060,\"precipitation\":0},{\"dt\":1640631120,\"precipitation\":0},{\"dt\":1640631180,\"precipitation\":0},{\"dt\":1640631240,\"precipitation\":0},{\"dt\":1640631300,\"precipitation\":0},{\"dt\":1640631360,\"precipitation\":0},{\"dt\":1640631420,\"precipitation\":0},{\"dt\":1640631480,\"precipitation\":0},{\"dt\":1640631540,\"precipitation\":0},{\"dt\":1640631600,\"precipitation\":0},{\"dt\":1640631660,\"precipitation\":0},{\"dt\":1640631720,\"precipitation\":0},{\"dt\":1640631780,\"precipitation\":0},{\"dt\":1640631840,\"precipitation\":0},{\"dt\":1640631900,\"precipitation\":0},{\"dt\":1640631960,\"precipitation\":0},{\"dt\":1640632020,\"precipitation\":0},{\"dt\":1640632080,\"precipitation\":0},{\"dt\":1640632140,\"precipitation\":0},{\"dt\":1640632200,\"precipitation\":0},{\"dt\":1640632260,\"precipitation\":0},{\"dt\":1640632320,\"precipitation\":0},{\"dt\":1640632380,\"precipitation\":0},{\"dt\":1640632440,\"precipitation\":0},{\"dt\":1640632500,\"precipitation\":0},{\"dt\":1640632560,\"precipitation\":0},{\"dt\":1640632620,\"precipitation\":0},{\"dt\":1640632680,\"precipitation\":0},{\"dt\":1640632740,\"precipitation\":0},{\"dt\":1640632800,\"precipitation\":0},{\"dt\":1640632860,\"precipitation\":0},{\"dt\":1640632920,\"precipitation\":0},{\"dt\":1640632980,\"precipitation\":0},{\"dt\":1640633040,\"precipitation\":0},{\"dt\":1640633100,\"precipitation\":0},{\"dt\":1640633160,\"precipitation\":0},{\"dt\":1640633220,\"precipitation\":0},{\"dt\":1640633280,\"precipitation\":0},{\"dt\":1640633340,\"precipitation\":0},{\"dt\":1640633400,\"precipitation\":0},{\"dt\":1640633460,\"precipitation\":0},{\"dt\":1640633520,\"precipitation\":0},{\"dt\":1640633580,\"precipitation\":0},{\"dt\":1640633640,\"precipitation\":0},{\"dt\":1640633700,\"precipitation\":0},{\"dt\":1640633760,\"precipitation\":0},{\"dt\":1640633820,\"precipitation\":0},{\"dt\":1640633880,\"precipitation\":0},{\"dt\":1640633940,\"precipitation\":0},{\"dt\":1640634000,\"precipitation\":0},{\"dt\":1640634060,\"precipitation\":0},{\"dt\":1640634120,\"precipitation\":0},{\"dt\":1640634180,\"precipitation\":0},{\"dt\":1640634240,\"precipitation\":0},{\"dt\":1640634300,\"precipitation\":0},{\"dt\":1640634360,\"precipitation\":0},{\"dt\":1640634420,\"precipitation\":0},{\"dt\":1640634480,\"precipitation\":0},{\"dt\":1640634540,\"precipitation\":0},{\"dt\":1640634600,\"precipitation\":0}],\"daily\":[{\"dt\":1640595600,\"sunrise\":1640584686,\"sunset\":1640613580,\"moonrise\":0,\"moonset\":1640600040,\"moon_phase\":0.75,\"temp\":{\"day\":267.79,\"min\":265.08,\"max\":269.02,\"night\":266.84,\"eve\":266.81,\"morn\":265.37},\"feels_like\":{\"day\":267.79,\"night\":262.27,\"eve\":263.78,\"morn\":265.37},\"pressure\":1023,\"humidity\":86,\"dew_point\":265.65,\"wind_speed\":2.82,\"wind_deg\":99,\"wind_gust\":7.72,\"weather\":[{\"id\":801,\"main\":\"Clouds\",\"description\":\"few clouds\",\"icon\":\"02d\"}],\"clouds\":18,\"pop\":0,\"uvi\":0.51},{\"dt\":1640682000,\"sunrise\":1640671096,\"sunset\":1640700027,\"moonrise\":1640645820,\"moonset\":1640687400,\"moon_phase\":0.8,\"temp\":{\"day\":267.34,\"min\":266.61,\"max\":267.84,\"night\":266.89,\"eve\":266.9,\"morn\":266.88},\"feels_like\":{\"day\":261.05,\"night\":260.56,\"eve\":259.98,\"morn\":261.31},\"pressure\":1021,\"humidity\":75,\"dew_point\":263.43,\"wind_speed\":5.73,\"wind_deg\":56,\"wind_gust\":14.51,\"weather\":[{\"id\":601,\"main\":\"Snow\",\"description\":\"snow\",\"icon\":\"13d\"}],\"clouds\":100,\"pop\":0.97,\"snow\":3.4,\"uvi\":0.35},{\"dt\":1640768400,\"sunrise\":1640757503,\"sunset\":1640786477,\"moonrise\":1640737020,\"moonset\":1640774940,\"moon_phase\":0.83,\"temp\":{\"day\":267.17,\"min\":264.98,\"max\":268.34,\"night\":264.98,\"eve\":266.24,\"morn\":266.16},\"feels_like\":{\"day\":263.65,\"night\":264.98,\"eve\":266.24,\"morn\":261.45},\"pressure\":1014,\"humidity\":90,\"dew_point\":265.45,\"wind_speed\":4.16,\"wind_deg\":58,\"wind_gust\":10.21,\"weather\":[{\"id\":600,\"main\":\"Snow\",\"description\":\"light snow\",\"icon\":\"13d\"}],\"clouds\":71,\"pop\":0.94,\"snow\":0.3,\"uvi\":0.51},{\"dt\":1640858400,\"sunrise\":1640843907,\"sunset\":1640872930,\"moonrise\":1640828580,\"moonset\":1640862720,\"moon_phase\":0.87,\"temp\":{\"day\":266.93,\"min\":263.33,\"max\":269.97,\"night\":269.97,\"eve\":266.46,\"morn\":263.5},\"feels_like\":{\"day\":264.52,\"night\":267.09,\"eve\":263.41,\"morn\":263.5},\"pressure\":1020,\"humidity\":84,\"dew_point\":264.47,\"wind_speed\":1.95,\"wind_deg\":190,\"wind_gust\":5.12,\"weather\":[{\"id\":801,\"main\":\"Clouds\",\"description\":\"few clouds\",\"icon\":\"02d\"}],\"clouds\":24,\"pop\":0,\"uvi\":0.46},{\"dt\":1640944800,\"sunrise\":1640930307,\"sunset\":1640959385,\"moonrise\":1640920260,\"moonset\":1640950920,\"moon_phase\":0.91,\"temp\":{\"day\":272.79,\"min\":270.01,\"max\":274.94,\"night\":274.94,\"eve\":274.22,\"morn\":271.11},\"feels_like\":{\"day\":268.54,\"night\":270.91,\"eve\":270.97,\"morn\":267.74},\"pressure\":1017,\"humidity\":96,\"dew_point\":272.25,\"wind_speed\":4.25,\"wind_deg\":212,\"wind_gust\":10.69,\"weather\":[{\"id\":616,\"main\":\"Snow\",\"description\":\"rain and snow\",\"icon\":\"13d\"}],\"clouds\":100,\"pop\":0.98,\"rain\":0.98,\"snow\":0.21,\"uvi\":0.32},{\"dt\":1641031200,\"sunrise\":1641016705,\"sunset\":1641045843,\"moonrise\":1641011880,\"moonset\":1641039780,\"moon_phase\":0.95,\"temp\":{\"day\":276.95,\"min\":273.86,\"max\":276.97,\"night\":273.86,\"eve\":275.82,\"morn\":275.48},\"feels_like\":{\"day\":273.01,\"night\":267.89,\"eve\":271.03,\"morn\":271.6},\"pressure\":1002,\"humidity\":97,\"dew_point\":276.46,\"wind_speed\":7.63,\"wind_deg\":318,\"wind_gust\":14.02,\"weather\":[{\"id\":616,\"main\":\"Snow\",\"description\":\"rain and snow\",\"icon\":\"13d\"}],\"clouds\":100,\"pop\":1,\"rain\":3.86,\"snow\":0.32,\"uvi\":1},{\"dt\":1641117600,\"sunrise\":1641103099,\"sunset\":1641132304,\"moonrise\":1641103080,\"moonset\":1641129720,\"moon_phase\":0,\"temp\":{\"day\":270.13,\"min\":269.42,\"max\":271.85,\"night\":269.42,\"eve\":270.11,\"morn\":270.83},\"feels_like\":{\"day\":263.19,\"night\":263.17,\"eve\":263.27,\"morn\":263.93},\"pressure\":1016,\"humidity\":70,\"dew_point\":265.43,\"wind_speed\":7.94,\"wind_deg\":321,\"wind_gust\":13.14,\"weather\":[{\"id\":600,\"main\":\"Snow\",\"description\":\"light snow\",\"icon\":\"13d\"}],\"clouds\":100,\"pop\":0.28,\"snow\":0.6,\"uvi\":1},{\"dt\":1641204000,\"sunrise\":1641189490,\"sunset\":1641218767,\"moonrise\":1641193260,\"moonset\":1641220500,\"moon_phase\":0.03,\"temp\":{\"day\":269.32,\"min\":267.74,\"max\":270.34,\"night\":268.93,\"eve\":269.25,\"morn\":268.22},\"feels_like\":{\"day\":269.32,\"night\":264.13,\"eve\":266.11,\"morn\":263.81},\"pressure\":1029,\"humidity\":72,\"dew_point\":264.87,\"wind_speed\":4.43,\"wind_deg\":350,\"wind_gust\":9.63,\"weather\":[{\"id\":804,\"main\":\"Clouds\",\"description\":\"overcast clouds\",\"icon\":\"04d\"}],\"clouds\":90,\"pop\":0,\"uvi\":1}]}";
    //let json = JSON.parse(jsonTxt);

    let weatherFor5Day = [];

    let url = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current, minutely,hourly,alerts&appid=bf35cac91880cb98375230fb443a116f`;
    await fetch(url)
        .then(responce => responce.json())
        .then(json => {

            for (let i = 0; i < 5; i++) {
                let d = new Date();
                let tom = new Date();
                tom.setDate(d.getDate() + i + 1);

                let day = tom.toLocaleDateString();
                let temp = getTempCel(json.daily[i].temp.day);
                let icon = getImgURL(json.daily[i].weather[0].icon);
                let obj = {
                    'Day': day,
                    'temperature': temp,
                    'img': icon,
                };
                weatherFor5Day.push(obj);
            }
        })
        .catch(error => console.log(error.message));
    return weatherFor5Day;
}

function getImgURL(icon) {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`
}

function getWindDirection(degree) {
    if (degree == 90) {
        return "В"
    } else if (degree == 360 || degree == 0) {
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

function getTimeForDate(ms) {
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

function getTempCel(item) {
    return Math.round(item - 273.15);
}

