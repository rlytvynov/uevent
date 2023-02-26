import React, {useState} from 'react'
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth)
  return (
    <header>
      <Nav>
        <img src={require('../assets/logo.png')} alt="logo" />
        <ul className={`${isOpen && "open"}`}>
          <li onClick={() => setIsOpen(!isOpen)}><NavLink to='/'>Events</NavLink></li>
          <li onClick={() => setIsOpen(!isOpen)}><NavLink to='/'>Companies</NavLink></li>
          <li onClick={() => setIsOpen(!isOpen)}><NavLink to='/'>Orders</NavLink></li>
          <li onClick={() => setIsOpen(!isOpen)}><NavLink to='/user-profile'>Account</NavLink></li>
          <li onClick={() => setIsOpen(!isOpen)}><NavLink to='/login'> {userInfo ? 'Sign In ' : 'Sign Out' }</NavLink></li>
          <div onClick={() => setIsOpen(!isOpen)}>
            <NavLink to='/basket'>
              <img src={require('../assets/basket.png')} alt="logo" />
              <div className= {Object.keys(userInfo).length !== 0 ? 'auth' : ''}><p>2</p></div>
            </NavLink>
            </div>
        </ul>
        <div
          className={`nav-toggle ${isOpen && "open"}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="bar"></div>
        </div>
      </Nav>
    </header>
  )
}

const Nav = styled.nav`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ul {
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
            color: #ffffff;
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
        color: black;
      }
    }
  }
  
  .nav-toggle {
    display: none
  }

  @media (max-width: 800px) {
    ul {
      position: absolute;
      top: 92px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      background: #cbc6c0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: translateX(-100%);
      transition: all .45s;
      padding-top: 20px;

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
    width: 72px;
    height: 72px;
  }
`;