import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useState} from 'react'
import axios from 'axios'
import { useRouter } from 'next/router';

export default function Home() {
  const [users, setUsers] = useState([])
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem('r_to_a_admin_key')
    const f = async () => {
      await axios.get('http://localhost:3000/v1/admin/users', {
        headers: {
          Authorization: authToken
        }
      }).then((response) =>
        setUsers(response.data.users)
      ).catch(() => {
        router.push('http://localhost:8080/login')
      })
    }
    f()
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>R To A管理画面</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          管理画面 HOME
        </h1>
      </main>
    </div>
  )
}
