import React from "react";
import LazyLoad from "react-lazy-load";
import "./styles.css";

require('dotenv').config()
const api_key = process.env.REACT_APP_SECRET;

async function GetData(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw Error(res.statusText);
        }
        const json = await res.json();
        return json;
    } catch (err) {
        throw Error(err);
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined
        };
    }

    async componentDidMount() {
        if (!api_key)
            throw Error("Invalid API Key: " + JSON.stringify(api_key));
        const weather = await GetData(
            "https://api.openweathermap.org/data/2.5/weather?units=metric&q=Hanoi,VN&appid=" +
                api_key
        );
        const forecast = await GetData(
            "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=Hanoi,VN&appid=" +
                api_key
        );
        this.setState({
            data: weather,
            forecast: forecast
        });
    }
    renderImage(data) {
        let weather = data.weather;
        weather = weather[0];
        let icon_url =
            "https://openweathermap.org/img/w/" + weather.icon + ".png";
        return (
            <div>
                <img
                    src={icon_url}
                    className="w_img"
                    alt={weather.description}
                />
            </div>
        );
    }
    renderMain(data) {
        let main = data.main;
        return (
            <div>
                <span className="w_text">Nhiệt độ: {main.temp} ºC</span>
                <span className="w_text">Áp suất: {main.pressure} hpa</span>
                <span className="w_text">Độ ẩm: {main.humidity} %</span>
            </div>
        );
    }
    renderSys(data) {
        let sys = data.sys;
        const sunrise = new Date(sys.sunrise * 1000);
        const sunset = new Date(sys.sunset * 1000);
        return (
            <div>
                <span className="w_text">
                    Bình minh: {sunrise.toLocaleTimeString()}
                </span>
                <span className="w_text">
                    Hoàng hôn: {sunset.toLocaleTimeString()}
                </span>
            </div>
        );
    }
    renderTime(data) {
        let UpdateTime = new Date(data.dt * 1000).toLocaleString();
        return (
            <div>
                <span className="w_text">{UpdateTime}</span>
            </div>
        );
    }
    renderForcast() {
        const map_w = data => (
            <LazyLoad
                key={"Load-" + data.dt}
                height={160}
                throttle={15}
                offsetVertical={500}
            >
                <div className="w_div float-up" key={data.dt}>
                    <h3>{this.renderTime(data)}</h3>
                    {this.renderImage(data)}
                    {this.renderMain(data)}
                </div>
            </LazyLoad>
        );
        let list = this.state.forecast.list.map(map_w);
        return list;
    }
    render() {
        if (!this.state.data) return null;
        if (!this.state.forecast) return null;
        const data = this.state.data;
        return (
            <div>
                <h1 className="w_cen float-up">Weather</h1>
                <div className="w_div float-up">
                    <h3>{this.renderTime(data)}</h3>
                    {this.renderImage(data)}
                    {this.renderMain(data)}
                </div>
                <h2 className="w_cen float-up">Dự báo</h2>
                {this.renderForcast()}
                <h5 className="w_cen">Powered by OpenWeatherMap</h5>
            </div>
        );
    }
}

export default App;
