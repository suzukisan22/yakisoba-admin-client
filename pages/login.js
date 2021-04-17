import { useState } from 'react';
import styles from '../styles/Home.module.css';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Login() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter();

  const submitLogin = () => {
     axios.post('http://localhost:3000/v1/admin/login', {
      username,
      password
    }).then(async (response) => {
      await localStorage.setItem("r_to_a_admin_key", response.data.auth_token)
      router.push('http://localhost:8080/')
    }).catch((response) => {
    })
  }

  return (
    <div className={styles.container}>
      <h1>ログイン</h1>
      <TextField 
        label="username"
        name="username"
        value={username}
        onChange={ (e) => { 
          setUsername(e.target.value)
        }}
      />
      <TextField
        label="password"
        name="password"
        type="password"
        onChange={
          (e) => { setPassword(e.target.value) }
        }
      />
      <Button variant="contained" color="primary" onClick={submitLogin} >
        ログイン
      </Button>
    </div>
  )
}
