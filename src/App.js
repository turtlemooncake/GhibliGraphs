import './App.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Bar, Pie, PolarArea, Doughnut, Line, Radar } from 'react-chartjs-2'
import home from './ghibliHome.png'

function App() {

  const [hook, setHook] = useState('')
  const [films, setFilms] = useState([])
  const [people, setPeople] = useState([])
  const [loco, setLoco] = useState([])
  const endpoints = ["films", "people", "locations"]
  const setters = [setFilms, setPeople, setLoco]
  
   /*
  PROCESSING STUDIO GHIBLI API ///////////////////////////////////////////////////////////////////////
  */
  let count = 0
  useEffect(() => {
    setters.map( (each) => {
      axios
        .get(`https://ghibliapi.herokuapp.com/${endpoints[count]}`)
        .then(response => {
          each(response.data)
        })
        .catch(error => {
          console.log(error)
        })
      count += 1
    })
  }, [])

   /*
  LOCATION DATA SORTING ///////////////////////////////////////////////////////////////////////
  */
  let surfaceWater = [] // line, y axis 
  let terrain = {} // radar 
  let placeNames = [] // line, x axis 

  loco.forEach( (each) => {
    surfaceWater.push(each.surface_water)
    if (each.terrain in terrain){
      terrain[each.terrain] += 1
    } else {
      terrain[each.terrain] = 1
    }
    placeNames.push(each.name)
  })

  delete terrain["TODO"]
  const waterData = {
    labels: placeNames,
    datasets: [
      {
        label: 'Surface Water Level',
        data: surfaceWater,
        fill: false,
        backgroundColor: 'rgb(30, 144, 255)',
        borderColor: 'rgba(30, 144, 255, 0.2)',
      },
    ],
  };

  const terrainData = {
    labels: Object.keys(terrain),
    datasets: [
      {
        label: 'Terrain Count',
        data: Object.values(terrain),
        backgroundColor: 'rgba(139, 69, 19, 0.2)',
        borderColor: 'rgba(139, 69, 19, 1)',
        borderWidth: 1,
      },
    ],
  };

   /*
  PEOPLE DATA SORTING ///////////////////////////////////////////////////////////////////////
  */
  let gender = {"Female": 0, "Male": 0, "NA": 0} // pie chart
  let eyeColor = {} // polar graph  
  let hairColor = {"Brown": 0, "Blue": 0, "Black": 0, "Grey": 0, "Orange": 0, "White": 0, "Yellow": 0, "None": 0} // doughnut
  
  people.forEach( (each) => {
    gender[each.gender] += 1
    if (each.hair_color.toLowerCase().includes("br") || each.hair_color.toLowerCase().includes("be")){
      hairColor["Brown"] += 1
    } else if (each.hair_color.toLowerCase().includes("pe") || each.hair_color.toLowerCase().includes("or")){
      hairColor["Orange"] += 1
    } else{
      hairColor[each.hair_color] += 1
    }
    if (each.eye_color in eyeColor){
      eyeColor[each.eye_color] += 1
    } else {
      eyeColor[each.eye_color] = 1
    }
  })
  
  const genderData = {
    labels: Object.keys(gender),
    datasets: [
      {
        label: 'Gender Distribution',
        data: Object.values(gender),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const eyeData = {
    labels: Object.keys(eyeColor),
    datasets: [
      {
        label: 'Character Eye Color',
        data: Object.values(eyeColor),
        backgroundColor: [
          'rgba(0, 0, 0, 0.5)',
          'rgba(139, 69, 19, 0.5)',
          'rgba(160, 82, 45, 0.5)',
          'rgba(210, 105, 30, 0.5)',
          'rgba(105, 105, 105, 0.5)',
          'rgba(255, 0, 0, 0.5)',
          'rgba(255, 215, 0, 0.5)',
          'rgba(230, 230, 250, 0.5)',
          'rgba(0, 128, 0, 0.5)',
          'rgba(0, 206, 209, 0.5)',
          'rgba(0, 100, 0, 0.5)',
        ],
        borderWidth: 1,
      },
    ],
  }
 
  const hairData = {
    labels: Object.keys(hairColor),
    datasets: [
      {
        label: 'Character Hair Color',
        data: Object.values(hairColor),
        backgroundColor: [
          'rgba(160, 82, 45, 0.2)',
          'rgba(100, 149, 237, 0.2)',
          'rgba(0, 0, 0, 0.2)',
          'rgba(128, 128, 128, 0.2)',
          'rgba(255, 140, 0, 0.2)',
          'rgba(230, 230, 250, 0.2)',
          'rgba(255, 215, 0, 0.2)',
          'rgba(238, 130, 238, 0.2)',
        ],
        borderColor: [
          'rgba(160, 82, 45, 0.2)',
          'rgba(100, 149, 237, 0.2)',
          'rgba(0, 0, 0, 0.2)',
          'rgba(128, 128, 128, 0.2)',
          'rgba(255, 140, 0, 0.2)',
          'rgba(230, 230, 250, 0.2)',
          'rgba(255, 215, 0, 0.2)',
          'rgba(238, 130, 238, 0.2)',
        ],
        borderWidth: 1,
      },
    ],
  }

  /*
  FILM DATA SORTING ///////////////////////////////////////////////////////////////////////
  */
  let titles = []
  let rating = []
  let length = []
  let directors = {"Hayao Miyazaki": 0, "Isao Takahata": 0, "Yoshifumi Kondō": 0, "Hiroyuki Morita": 0, "Gorō Miyazaki": 0, "Hiromasa Yonebayashi": 0, "Michaël Dudok de Wit": 0} 
  films.forEach((each) => {
    titles.push(each.title)
    rating.push(each.rt_score)
    length.push(each.running_time)
    directors[each.director] += 1
  })

  const ratingsData = {
    labels: titles,
    datasets: [
      {
        label: 'Rotton Tomato Scores',
        data: rating,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const lengthData = {
    labels: titles,
    datasets: [
      {
        label: 'minutes',
        data: length,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const directorsData = {
    labels: Object.keys(directors),
    datasets: [
      {
        label: 'Studio Ghibli Directors',
        data: Object.values(directors),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(90, 230, 230, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(90, 230, 230, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

   /*
  GRAPH CONFIGURATIONS ///////////////////////////////////////////////////////////////////////
  */
  const verticalBarOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }
  
  const horBarOptions = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      }
    },
  }

  const radarOptions = {
    scale: {
      ticks: { beginAtZero: true, max: 6, min: 0, stepSize: 1}
    },
  };

  /*
  GRAPH CREATION ///////////////////////////////////////////////////////////////////////
  */
  const GCreate = () => {
    if (hook.includes("director")){
      return(
        <div class="chart-container">
          <Pie data={directorsData}/>
        </div>
      )
    }
    if (hook.includes("rating")){
      return(
        <div class="chart-container2">
          <Bar data={ratingsData} options={verticalBarOptions}/>
        </div>
      )
    }
    if (hook.includes("length")){
      return(
        <div class="chart-container2">
          <Bar data={lengthData} options={horBarOptions}/>
        </div>
      )
    }
    if (hook.includes("gender")){
      return(
        <div class="chart-container">
          <Pie data={genderData} />
        </div>
      )
    }
    if (hook.includes("eye")){
      return(
        <div class="chart-container">
          <PolarArea data={eyeData} />
        </div>
      )
    }
    if (hook.includes("hair")){
      return(
        <div class="chart-container">
          <Doughnut data={hairData} />
        </div>
      )
    }
    if (hook.includes("water")){
      return(
        <div class="chart-container2">
          <Line data={waterData} options={verticalBarOptions} />
        </div>
      )
    }
    if (hook.includes("terrain")){
      return(
        <div class="chart-container">
          <Radar data={terrainData} options={radarOptions} />
        </div>
      )
    }

    return(
      <div>
        <img src={home} alt="home screen" class="homeScreen"/>
      </div>
    )
  }

  const FilterHelper = (event) =>{ // obtains input value; bounces back and stores in hook
    setHook(event.target.value)
  }

  return (
    <div>
      <input onChange={FilterHelper} class="userInput"/> 
      <GCreate/>
      <p class="lowerBar">directors . water . hair . eye . length . gender . rating . terrain</p>
    </div>
  );
} 

export default App
