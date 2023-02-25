import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister } from '../utils/authActions';
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { loading, error, success } = useSelector((state) => state.register)
  const { userInfo } = useSelector((state) => state.auth)

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    // redirect user to login page if registration was successful
    if (success) navigate('/login')
    // redirect authenticated user to profile screen
    if (Object.keys(userInfo).length !==0) navigate(`/users/${userInfo.id}`)
  }, [navigate, userInfo, success])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(handleValidation()) {
        const data = await dispatch(fetchRegister(firstName, email, password, passwordConfirm))
        console.log(data?.payload)
      }
    } catch (error) {
      handleValidation()
    }
  };

  const handleValidation = () => {
    if (password !== passwordConfirm) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (firstName.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    } else if (error) {
      toast.error(error, toastOptions);
      return false;
    }
    return true;
  }

  return (
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
          <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder="Repeat password"/>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
        <ToastContainer />
      </FormContainer>
  )
}

const FormContainer = styled.div`
  margin: 0 auto;
  width: fit-content;
  background-color: black;
  padding: 10px;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    button {
      width: 100%;
    }
  }
`;