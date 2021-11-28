import Head from 'next/head'
import styles from '../../../styles/Home.module.scss'
import React, { useEffect, useState, SyntheticEvent } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { UserListRow } from "../UserListRow";

export default function UserList() {
  const [users, setUsers] = useState([])
  const [isGroomTabSelected, setIsGroomTabSelected] = useState(true)
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem('r_to_a_admin_key')
    const f = async () => {
      await axios.get(`${process.env.API_SERVER_ENDPOINT}/v1/admin/users?is_groom_side=true`, {
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

  const setUserByInvitationSide = ({isGroomSide})  => {
    const authToken = localStorage.getItem('r_to_a_admin_key')

    axios.get(`${process.env.API_SERVER_ENDPOINT}/v1/admin/users?is_groom_side=${isGroomSide}`, {
      headers: {
        Authorization: authToken
      }
    }).then((response) => {
      setIsGroomTabSelected(isGroomSide)
      setUsers(response.data)
    }).catch((e) => {
    })
  }

  return (
    <div>
      <header className={styles.header}>
        <span>鈴木家・大河内家結婚式 管理画面</span>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>出席者一覧</h1>
        <div className={styles.listFilterTab}>
          <div className={isGroomTabSelected ? styles.groomTabSelected : styles.groomTab} onClick={() => setUserByInvitationSide({isGroomSide: true})}>
            <span className={isGroomTabSelected ? styles.tabSelectedText : styles.tabText}>新郎側</span>
          </div>
          <div className={isGroomTabSelected ? styles.brideTab : styles.brideTabSelected} onClick={() => setUserByInvitationSide({isGroomSide: false})}>
            <span className={isGroomTabSelected ? styles.tabText : styles.tabSelectedText}>新婦側</span>
          </div>
        </div>
        <table className={styles.attendanceListTable}>
          <thead>
            <tr>
              <th>名前</th>
              <th>当日出席予定か</th>
              <th>当日受付状態</th>
              <th>お車代の提供有無</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              return (
                <UserListRow
                  propsUser={user}
                  key={user.id}
                  propsAttendance={user.attendance}
                  isLastRow={index + 1 == users.length}
                  propsTransferFeeManager={user.transfer_fee_manager}
                />
              )
            })}
          </tbody>
        </table>
      </main>
    </div>
  )
}
