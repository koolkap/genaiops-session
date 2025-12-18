from promptflow import tool
import requests

# openweathermap.org API: 959b6a836f775fe65ec9263c8f6bf404
@tool
def fetch_weather_data(location: str, api_key: str) -> dict:
    base_url = "http://api.openweathermap.org/data/2.5/"
    params = {'q': location, 'appid': api_key, 'units': 'metric'}

    # Fetch current weather
    weather_response = requests.get(base_url + "weather", params=params)
    weather_data = weather_response.json()

    # Fetch air pollution data
    coord = weather_data.get('coord', {})
    pollution_params = {
        'lat': coord.get('lat'),
        'lon': coord.get('lon'),
        'appid': api_key
    }
    pollution_response = requests.get(
        base_url + "air_pollution",
        params=pollution_params
    )
    pollution_data = pollution_response.json()

    # Fetch UV index data
    uv_response = requests.get(
        base_url + "uvi",
        params=pollution_params
    )
    uv_data = uv_response.json()

    return {
        'weather': weather_data,
        'pollution': pollution_data,
        'uv_index': uv_data
    }
