'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image'

async function getDataPopulationGDP(countryCode: string, indicator: string) {
  const actualYear = new Date().getFullYear()
  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&date=${actualYear - 5}:${actualYear}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}


async function getDataExchangeRate(api_key: string) {
  const url = `http://api.exchangeratesapi.io/v1/latest?accesds_key=${api_key}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}


export default function Home() {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY_OPENWEATHER
  const API_KEY_Exchange = process.env.NEXT_PUBLIC_API_KEY_EXCHANGERATE
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [weatherIcon, setWeatherIcon] = useState<string>('');
  const [country, setCountry] = useState<string>('maputo');  
  const [rate, setRate] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [population, setPopulation] = useState<any>('');
  const [gdp, setGdp] = useState<any>('');
  const [countryCode, setcountryCode] = useState<string>('MZ');


  useEffect(() => {
    (async ()=>{
      const res =await getDataPopulationGDP('SP.POP.TOTL', countryCode)
      setPopulation(res.data)
      const resp =await getDataPopulationGDP('NY.GDP.MKTP.CD', countryCode)
      setGdp(resp.data)
    })
  }, []);

  useEffect(() => {
    (async ()=>{
      const res =await getDataExchangeRate(API_KEY_Exchange!)
      console.log(res.data)
      setRate(res.data) 
    })
  }, []);

  useEffect(() => {
    (async () => {
      try {
        var res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${country}&units=metric&appid=${API_KEY}`)

        const response: WeatherData = await res.json() 
        setWeather(response)
      } catch (error) {
        console.log(error)
      }
    })()



    setBackgroundImage('default-background.jpg');
    setWeatherIcon('/sunny.png')
    if (weather && weather?.weather) {
      const weatherCondition = weather.weather[0].description;
      console.log(weatherCondition)
      if (weatherCondition.includes('rain')) {
        setBackgroundImage('rainy-background.jpg');
        setWeatherIcon('/rain.png')
      } else if (weatherCondition.includes('cloud')) {
        setBackgroundImage('cloudy-background.jpg');
        setWeatherIcon('/cloud.png')
      } else if (weatherCondition.includes('clear')) {
        setBackgroundImage('sunny-background.jpg');
        setWeatherIcon('/clear.png')
      } else {
        setBackgroundImage('default-background.jpg');
        setWeatherIcon('/sunny.png')
      }
    }
  }, [country]);
  if (!weather?.weather) {
    return (<main className="flex min-h-screen flex-col items-center  p-24 background-image-div" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="flex flex-row w-full">
        <input id="search" name="search" onChange={(e) => setSearch(e.target.value)} className="m-2 block p-2.5 w-full  text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder='search country'></input>
        <button onClick={() => { setCountry(search) }} type="submit" className="inline-flex items-center m-2   p-2.5 text-sm font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-900 ">          Search
          <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>

        </button>
      </div>
      <div className="w-full  bg-opacity-20 bg-white md:m-2 backdrop-blur-lg rounded-lg md:p-10 shadow-md">
        <div className="flex justify-evenly items-center">
          <p className="text-5xl p capitalize font-bold">Country not found</p>
        </div>
      </div>

    </main>)
  }
  return (
    <main className="flex min-h-screen flex-col items-center  p-5 md:p-24 background-image-div" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="flex flex-row w-full">
        <input id="search" name="search" onChange={(e) => setSearch(e.target.value)} className="m-2 block p-2.5 w-full  text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder='search country'></input>
        <button onClick={() => { setCountry(search) }} type="submit" className="inline-flex items-center m-2   p-2.5 text-sm font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-900 ">          Search
          <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>

        </button>
      </div>
      <div className="w-full  bg-opacity-20 bg-white m-2 backdrop-blur-lg rounded-lg p-10 shadow-md">
        <div className="flex justify-evenly items-center">
          <div className="text-3xl md:text-4xl p-2  font-bold">
            <p className='h-[100px]'>{weather?.main?.temp} ºC</p>
            <div className=''>
              <p className="text-xl md:text-3xl p capitalize font-bold">{country}</p>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <Image
              src={weatherIcon}
              width={100}
              height={100}
              alt="Icon Weather" />
            <p className="text-sm md:text-xl capitalize font-bold">{weather?.weather[0].description}</p>
          </div>
        </div>
      </div>

      <div className="w-full  bg-opacity-20 bg-white m-2 backdrop-blur-lg rounded-lg p-10 shadow-md">
        <div className="flex flex-col md:flex-row justify-evenly ">
        <div className="text-3xl md:text-4xl p-2  font-bold">
            <h2 className="text-2xl font-semibold">Exchange Rate</h2>
            <p className="text-xl font-semibold" >Rate: {rate}</p> 
          </div>
          <div className="flex justify-center items-center w-full md:hidden">
            <hr className="w-full border-t border-gray-300" />
          </div>
          <div className="text-3xl md:text-4xl p-2  font-bold">
            <h2 className="text-2xl font-semibold">Economic Data</h2>
            <p className="text-xl font-semibold" >Population: {population}</p>
            <p className="text-xl font-semibold">GDP: {gdp}</p>
          </div>

        </div>
      </div>



    </main>
  )
}
