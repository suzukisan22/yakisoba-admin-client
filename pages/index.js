import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default function Home() {
  const [users, setUsers] = useState([])
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem('r_to_a_admin_key')
    const f = async () => {
      await axios.get(`${process.env.API_SERVER_ENDPOINT}/v1/admin/users`, {
        headers: {
          Authorization: authToken
        }
      }).then((response) => {
        setUsers(response.data)
      }).catch(() => {
        router.push('/login')
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
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>名前</TableCell>
                <TableCell>回答</TableCell>
                <TableCell>受付済み</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell component="th" scope="row">
                    {user.last_name}&nbsp;{user.first_name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {!!user.attendance ? (user.attendance.will_attende ? "出席" : "欠席") : "未回答"}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {!!user.attendance ? (user.attendance.is_attende_on_that_day ? "受付済み" : "受付が未完了") : "未回答"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </main>
    </div>
  )
}
