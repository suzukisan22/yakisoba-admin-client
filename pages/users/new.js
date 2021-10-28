import styles from '../../styles/Home.module.scss';
import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import axios from 'axios';
import { Button, TextField } from '@material-ui/core';

export default function New() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem('r_to_a_admin_key')
    const f = async () => {
      await axios.get(`${process.env.API_SERVER_ENDPOINT}/v1/admin/users`, {
        headers: {
          Authorization: authToken
        }
      }).catch(() => {
        router.push('/login')
      })
    }
    f()
  }, [])

  const submitCreateUser = () => {
    const authToken = localStorage.getItem('r_to_a_admin_key')
    axios.post(`${process.env.API_SERVER_ENDPOINT}/v1/admin/users`, {
      username,
      password,
      last_name: lastName,
      first_name: firstName
    },{
      headers: {
        Authorization: authToken
      }
    }).then((response) => {
      router.push(`/users/${response.data.id}`)
    }).catch((response) => {
    })
  }

  return (
    <div className={styles.container}>
      <h1>ユーザー新規作成</h1>
      <TextField 
        label="username"
        name="username"
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
      <TextField
        label="lastName"
        name="lastName"
        onChange={
          (e) => { setLastName(e.target.value) }
        }
      />
      <TextField
        label="firstName"
        name="firstName"
        onChange={
          (e) => { setFirstName(e.target.value) }
        }
      />
      <Button variant="contained" color="primary" onClick={submitCreateUser} >
        作成する
      </Button>
    </div>
  );
}
