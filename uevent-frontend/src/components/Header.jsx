import React, {useEffect, useState} from 'react'
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLogout } from '../utils/authActions';
import api from '../utils/apiSetting';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth)
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchValue, setSearchValue] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState('close')
  const [searchResults, setSearchResults] = useState({data: [], isLoading: true})
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const handleOnClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const li = [
    { id: 1, label: "Events", path: '/'},
    { id: 2, label: "Companies", path: '/companies' },
    { id: 3, label: "Account", path: '/user-profile' }
  ];


  const handleSign = async (e) => {
    if(Object.keys(userInfo).length === 0) {
      if(isOpen) {
        setIsOpen(!isOpen)
      }
      setActiveIndex(null);
      navigate('/login')
    } else {
        const data = await dispatch(fetchLogout())
        console.log(data)
        if(isOpen) {
          setIsOpen(!isOpen)
        }
        setActiveIndex(null)
        navigate('/login')
    }
  }

  useEffect(() => {
    if(searchValue !== '') {
      api.post(`/search/`, {query: searchValue})
        .then(response => {
          console.log(response.data)
          const mergedArray = response.data.events.concat(response.data.organizations);
          mergedArray.sort((a, b) => {
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;
            return 0;
          });
          setSearchResults({
            data: mergedArray,
            isLoading: false
          })
          if(response.data.events.length !== 0 || response.data.organizations.length !== 0) {
            console.log('hello')
            setIsSearchOpen('open')
          }
        })
        .catch(error => {
          console.log(error.message)
        })
      // console.log(searchValue)
    } else {
      setIsSearchOpen('close')
    }
  }, [searchValue])

  const handleCheck = (id, type) => {
    setIsSearchOpen('close')
    navigate(`/${type}/${id}`)
  }

  return (
    <Head>
      <img src={require('../assets/logo.png')} alt="logo" />
      <ul className={`${isOpen && "open"}`}>
        <div className="search-box">
          <input value={searchValue} type="search" onChange={(e) => setSearchValue(e.target.value)}/>
          <img src={require('../assets/search-icon.png')} alt="search" />
          <div className={`found-info ${isSearchOpen}`}>
            {
              searchResults.isLoading ?
              <div className='loading'>Loading...</div> 
              :
              <>
                {
                  searchResults.data.map((item, index) => {
                    return (
                      <div className='found-item' key={index}> 
                      {item.title}
                      {item.admin_id ? 
                        <span style={{color: "red", fontSize: "12px", border: '1px solid red', padding: '0px 5px'}}>compnay</span> 
                        :
                        <span style={{color: "#FFD100", fontSize: "12px", border: '1px solid #FFD100', padding: '0px 5px'}}>event</span> 
                      }
                      <button onClick={() => handleCheck(item.id, item.admin_id ? 'companies' : 'events')}>More</button>
                      </div>
                    )
                  })
                }
              </>
            }
          </div>
        </div>
        {
          li.map(({ id, label, path }, index) => (
            <li
              key={id}
              onClick=
              {
                id !== 5 ?
                  (
                    isOpen ? 
                    () => { setIsOpen(!isOpen); handleOnClick(index) } 
                    : 
                    () => handleOnClick(index)
                  ) 
                  : 
                  (
                    isOpen ? 
                    () => { setIsOpen(!isOpen); handleOnClick(index); handleSign()} 
                    : 
                    () => { handleOnClick(index); handleSign()}
                  )
              }
              className= {index === activeIndex ? "active" : ""}
            >
              <NavLink to={path}>{label}</NavLink>
              {/* {
                id !== 5 ? <NavLink to={path}>{label}</NavLink> : `${label}`
              } */}
            </li>
          ))
        }
        <button> <NavLink onClick={handleSign} to='/login'> {Object.keys(userInfo).length !== 0 ? 'Sign Out ' : 'Sign In' }</NavLink></button>
      </ul>
      <div
        className={`nav-toggle ${isOpen && "open"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="bar"></div>
      </div>
    </Head>
  )
}

const Head = styled.nav`
  max-width: 1480px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px;
  margin-top: 35px;
  margin-bottom: 115px;
  font-weight: 700;
  ul {
    z-index: 10;
    display: flex;
    align-items: center;
    div {
      position: relative;
      opacity: 0.9;
      display: inline-block;
      list-style: none;
      margin: 10px 30px;
      a {
        text-decoration: none;
        position: relative;
        img {
          display: inline-block;
          width: 32px;
          height: 32px;
        }
        div {
          display: none;
          &.auth {
            margin: 0;

            display: flex;
            justify-content: center; 
            align-items: center; 

            position: absolute;
            right: -15px;
            top: 10px;

            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: red;
          }
        }
      }
    }
    li {
      position: relative;
      opacity: 0.9;
      display: inline-block;
      list-style: none;
      margin: 10px 30px;
      cursor: pointer;
      &.active {
          &::after {
          content: "";
          position: absolute;
          left: 0;
          top: 120%;
          width: 100%;
          opacity: 1;
          height: 2px;
          background: #ffffff;
          transition: all 0.45s;
        }
      }

      &:hover {
        opacity: 1;
        &::after {
          width: 100%;
        }
      }

      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 120%;
        width: 0;
        height: 2px;
        background: #ffffff;
        transition: all 0.45s;
      }

      a {
        text-decoration: none;
      }
    }

    div {
      &.search-box {
        position: relative;
        input {
          outline: none;
          background: transparent;
          padding: 8px 12px;
          border: none;
          border-bottom: 1px solid #ccc; 
          font-size: 16px; 
          color: #fff; 
          box-shadow: none;
          appearance: none;
          &::-webkit-search-cancel-button {
            -webkit-appearance: none;
          }
        }
        img {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          background-image: url("../assets/search-icon.png");
          background-size: cover;
        }
        .found-info {
          position: absolute;
          top: 50px;
          left: 0;
          width: 200%;
          margin: 0;
          display: none;

          &.open {
            display: flex;
            flex-direction: column;
            gap: 10px;
            overflow-y: scroll;
            opacity: 1;

            background-color: #353535;
            border-radius: 5px;
            padding: 10px;
            height: 130px;
            .found-item {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              gap: 10px;
              margin: 0;
              button {
                all: unset;
                margin-left: auto;
                background-color: #FFD100;
                color: #ffffff;
                padding: 0 10px;
                cursor: pointer;
              }
            }

          }

          &::-webkit-scrollbar {
            display: none;
          }
        }
      }
    }

    button{
      padding: 8px 30px;
      background-color: #FFD100;
      margin: 10px 30px;
      border: none;
      cursor: pointer;
      a {
        text-decoration: none;
        font-weight: 700;
      }
    }
  }
  
  .nav-toggle {
    display: none;
    z-index: 10;
  }

  @media (max-width: 850px) {
    ul {
      z-index: 10;
      position: absolute;
      top: 0;
      left: 0;
      padding-top: 120px;
      padding-left: 0px !important;
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      background: rgb(32, 32, 32);
      width: 100vw;
      height: 100vh;
      transform: translateX(-100%);
      transition: all .45s;

      li {
        &::before {
          background: transparent;
        }
      }

      &.open {
        transform: translateX(0);
      }
    }

    .nav-toggle {
      display: flex;
      width: 50px;
      height: 50px;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      .bar {
        position: relative;
        width: 32px;
        height: 2px;
        background: #ffffff;
        transition: all 0.45s ease-in-out;

        &::before,
        &::after {
          content: "";
          position: absolute;
          height: 2px;
          background: #ffffff;
          border-radius: 2px;
          transition: all 0.45s ease-in-out;
        }

        &::before {
          width: 25px;
          transform: translateY(-8px);
          right: 0;
        }
        &::after {
          width: 32px;
          transform: translateY(8px);
        }
      }

      &.open {
        .bar {
          transform: translateX(-40px);
          background: transparent;
          &::before {
            width: 32px;
            transform: rotate(45deg) translate(26px, -26px);
          }
          &::after {
            transform: rotate(-45deg) translate(26px, 26px);
          }
        }
      }
    }
  }

  img {
    z-index: 12;
    width: 72px;
    height: 72px;
  }
`;