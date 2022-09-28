const link ="http://api.weatherstack.com/current?access_key=ae9383896b16bbf4d8473f7cb9027b3f";

const root = document.getElementById("root");
const popup = document.getElementById("popup");
const textInput = document.getElementById("text-input");
const form = document.getElementById("form");

let store = {
    city: "Kyiv",
    temperature: 0,
    observationTime: "00:00 AM",
    is_day: "yes",
    description: "",
    properties: {
        cloudcover: {},
        humidity: {},
        windSpeed: {},
        visibility: {},
        uvIndex: {},
        pressure: {},
    },
};

const fetchData = async () => {
try {
    const query = localStorage.getItem("query") || store.city;
    const result = await fetch(`${link}&query=${query}`);
    const data = await result.json();

    const {
        current: {
            cloudcover,
            temperature,
            observation_time: observationTime,
            pressure,
            uv_index: uvIndex,
            visibility,
            humidity,
            is_day: isDay,
            weather_descriptions: description,
            wind_speed: windSpeed,
        },
        location: { name },
    } = data;

    store = {
        ...store,
        temperature,
        observationTime,
        isDay,
        city: name,
        description: description[0],
        properties: {
            cloudcover: {
                title: "cloudcover",
                value: `${cloudcover}%`,
                icon: "cloud.png",
            },
            humidity: {
                title: "humidity",
                value: `${humidity}%`,
                icon: "humidity.png",
            },
            windSpeed: {
                title: "windSpeed",
                value: `${windSpeed} km/h`,
                icon: "wind.png",
            },
            visibility: {
                title: "visibility",
                value: `${visibility}%`,
                icon: "visibility.png",
            },
            uvIndex: {
                title: "uvIndex",
                value: `${uvIndex} / 100`,
                icon: "uv-index.png",
            },
            pressure: {
                title: "pressure",
                value: `${pressure}%`,
                icon: "gauge.png",
            },
        },

    };

    renderComponent();
} catch(err) {
    console.log(err);
}

};

const getImage = (description) => {
    const value = description.toLowerCase();

    switch(value) {
        case "partly cloudy":
            return "partly.png";
            case "cloud":
                return "cloud.png";
                case "fog":
                    return "fog.png";
                    case "sunny":
                return "sunny.png";
                    case "cloud":
                    return "cloud.png";
        default:
            return "the.png";
    }
};

const renderProperty = (properties) => {
    return Object.values(properties).map(({title, value, icon}) => {


        return ` <div class="property">
        <div class="property-icon">
        <img src="./img/icons/${icon}" alt="">
        </div>
        <div class="property-info">
        <div class="property-info__value">${value}</div>
        <div class="property-info__description">${title}</div>
        </div>
        </div>`
    })
    .join("");
};

const markup = () => {
    const { city, description, observationTime, temperature, isDay, properties} = store;

    const containerClass = isDay === "yes" ? "is-day" : "";


   return  `<div class="container ${containerClass}">
    <div class="top">
    <div class="city">
            <div class="city-subtitle">Weather Today in</div>
            <div class="city-title" id="city">
            <span>${city}</span>
            </div>
        </div>
        <div class="city-info>
            <div class="top-left">
            <img class="icon" src="./img/${getImage(description)}" alt"" />
            <div class="description">${description}</div>
            </div>

            <div class=""top-right>
            <div class="city-info__subtitle">as of ${observationTime}</div>
            <div class="city-info__title">${temperature}°</div>
            </div>
        </div>
        </div>
        <div id="properties">${renderProperty(properties)}</div>
        </div>`;
};

const togglePopupClass = () => {
    popup.classList.toggle("active");
};

const renderComponent = () => {
    root.innerHTML = markup();


const city = document.getElementById("city");
    city.addEventListener("click", togglePopupClass);
};

const handleInput = (e) => {
    store = {
        ...store,
        city: e.target.value,
    };
};

const handleSubmit = (e) => {
    e.preventDefault();
    const value = store.city;

    if(!value) return null;

    localStorage.setItem("query", value);
    fetchData();
    togglePopupClass();
};

form.addEventListener("submit", handleSubmit);
textInput.addEventListener("input", handleInput);

fetchData();