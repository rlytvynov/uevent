import React, { useEffect } from 'react'
import { useState } from 'react';
import styled from 'styled-components';
import api from '../utils/apiSetting';
import { useNavigate } from 'react-router-dom';

import { IconContext } from 'react-icons';
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import axios from 'axios';

export default function MainPage() {
  const navigate = useNavigate()
  const [loading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Event Name',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, vitae libero. Dolore, quasi. Facilis cumque doloremque ab ipsam? Labore tenetur quis nulla possimus aut laboriosam suscipit doloribus quisquam saepe fugiat!',
      location: 'Kharkov',

      date: '15.03.2023 15:30',
      price: 340
    },
    {
      id: 2,
      title: 'Event Name',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, vitae libero. Dolore, quasi. Facilis cumque doloremque ab ipsam? Labore tenetur quis nulla possimus aut laboriosam suscipit doloribus quisquam saepe fugiat!',
      location: 'Kharkov',

      date: '15.03.2023 15:30',
      price: 340
    },
    {
      id: 3,
      title: 'Event Name',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, vitae libero. Dolore, quasi. Facilis cumque doloremque ab ipsam? Labore tenetur quis nulla possimus aut laboriosam suscipit doloribus quisquam saepe fugiat!',
      location: 'Kharkov',

      date: '15.03.2023 15:30',
      price: 340
    }
  ])

  const handleCreateEvent = () => {
    navigate(`/create-event`)
  }
  
  const handleEventClick = (id) => {
    navigate(`/events/${id}`)
  }

  useEffect(() => {
    api.get(`/events`)
    .then(function(response) {
      console.log(response.data)
      setEvents(response.data.data)
      setIsLoading(false)
    
    })
    .catch(function(error) {
        console.log(error.message)
    })
  }, [])

  return (
    <Container>
      <div className="background">
        <img src = {require("../assets/main-back.png")} alt="" />
      </div>
      <div className="slogan">
        <h1>Let's Make Live Happen</h1>
        <br />
        <p>Shop millions of live events and discover can't-miss concerts, games, theater and more.</p>
        <div className="search-event">
          <input type="search" placeholder='Search for an event'/>
          <button>Search</button>
        </div>
      </div>
      <div className="options">
        <div className="options-filters">

          <div className="dropdown">
            <button className="dropdown-button">Themes</button>
            <div className="dropdown-content">
              <a href="/">Опция 1</a>
              <a href="/">Опция 2</a>
              <a href="/">Опция 3</a>
            </div>
          </div>
          <div className="dropdown">
            <button className="dropdown-button">Formats</button>
            <div className="dropdown-content">
              <a href="/">Опция 1</a>
              <a href="/">Опция 2</a>
              <a href="/">Опция 3</a>
            </div>
          </div>
          <div className="dropdown">
            <button className="dropdown-button">Dates</button>
            <div className="dropdown-content">
              <a href="/">Опция 1</a>
              <a href="/">Опция 2</a>
              <a href="/">Опция 3</a>
            </div>
          </div>
        </div>
        <button onClick={handleCreateEvent}>+ New Event</button>
      </div>
      {
        loading ? 
        <div className='loading'>Loading...</div> 
        : 
        <div className="event-list">
        {
          events.map((item, index) => {
            return (
              <div className="event" key={index}>
              <img src={require("../assets/ev_img.jpg")} alt="" />
              <div className='time-location'>
                <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px" } }}>
                  <p>
                    <FaMapMarkerAlt/>{item.location}
                  </p>
                </IconContext.Provider>
                <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px" } }}>
                  <p>
                    <FaClock/>{item.date}
                  </p>
                </IconContext.Provider>
              </div>
              <div className='description'>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
              <div className='price'>
                <button onClick={() => handleEventClick(item.id)}>More</button>
                <p>{item.price}$</p>
              </div>
            </div>
            )
          })
        }
      </div>
      }
    </Container>
  )
}

const Container = styled.div`
  z-index: -1;
  margin-top: -250px;
  div {
    &.background {
      overflow: hidden;
      img {
        width: 100%;
        height: 650px;
        background-size: cover;
        object-fit: cover;
        filter: brightness(50%);
      }
    }
    &.slogan {
      white-space: nowrap;
      p {
        white-space: normal;
        margin-bottom: 20px;
      }
      position: absolute;
      line-height: 0.8;
      text-align: center;
      top: 325px;
      left: 50%;
      transform: translate(-50%, -50%);
      .search-event {
        display: inline-block;
        margin-top: 20px;
        input {
          display: inline-block;
          vertical-align: middle;
          color: #fff;
          background: rgba(0,0,0,0.3);
          border: none;

          width: 380px;
          height: 60px;
          padding: 0px 25px;
          font-weight: 400;
          font-size: 16px;

          appearance: none;
          outline: none;

          &::-webkit-search-cancel-button {
            -webkit-appearance: none;
          }
          &::placeholder {
            color: rgba(255, 255, 255, 0.43);
          }
        }
        button {
          display: inline-block;
          vertical-align: middle;
          font-weight: 700;
          font-size: 24px;
          width: 140px;
          height: 60px;
          background-color: #FFD100;
          border: none;
          color: #fff;
        }
        @media (max-width: 850px) {
          input{
            width: 190px;
            height: 30px;
            font-size: 8px;
            padding: 0px 12px;
          }
          button {
            width: 70px;
            height: 30px;
            font-size: 12px;
          }
        }
      }
    }
    &.options {
      max-width: 1480px;
      margin: 0 auto;
      padding-left: 22px;
      padding-top: 55px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 60px;
      .options-filters {
        width: 520px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .dropdown {
          position: relative;
          display: inline-block;
          .dropdown-content {
            position: absolute;
            display: none;
            width: 100%;
            background-color: rgb(32, 32, 32);
            z-index: 1;
            a {
              display: block;
            }
          }
          .dropdown-button {
            background-color: transparent;
            border: 1px solid #fff;
            color: white;
            padding: 10px;
            font-size: 16px;
            cursor: pointer;
            &:hover {
              background-color: #fff;
              color: black;
            }
          }
          &:hover {
            .dropdown-content {
              display: block;
            }
          }

        }
      }

      button {
        width: 160px;
        height: 45px;
        background-color: #FFD100;
        border: none;
        color: #fff;
        font-weight: 700;
        font-size: 16px;
        cursor: pointer;
      }
    }
    &.event-list {
      max-width: 1480px;
      margin: 0 auto;
      padding-left: 22px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 10px;
      justify-content: space-between;
      .event {
        width: 100%;
        height: 490px;
        background-color: #ffffff;
        border: 1px solid #000000;
        background: #333533;
        box-shadow: 0px 4px 50px 4px rgba(0, 0, 0, 0.25);
        img {
          display: block;
          width: 100%;
          margin-bottom: 25px;
        }
        div {
          width: 100%;
          &.time-location {
            max-width: 100%;
            padding: 0px 25px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          } 
          &.description {
            padding: 0px 25px;
            margin-bottom: 10px;
            h2 {
              margin: 0;
            }
            p {
              margin: 0;
              -ms-text-overflow: ellipsis;
              -o-text-overflow: ellipsis;
              text-overflow: ellipsis;
              overflow: hidden;
              -ms-line-clamp: 2;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              display: -webkit-box;
              display: box;
              word-wrap: break-word;
              -webkit-box-orient: vertical;
              box-orient: vertical;
            }
          }
          &.price {
            padding: 0px 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            button {
              width: 330px;
              height: 40px;
              font-weight: 700;
              font-size: 20px;

              border: none;
              color: #fff;
              background-color: #FFD100;
              cursor: pointer;
            }
            p {
              font-weight: 700;
              font-size: 20px;
              color: #fff;
            }
          }
        }
      }
    }
  }
`
