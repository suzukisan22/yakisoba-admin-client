import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router';
import Link from 'next/link';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {Popover} from '@material-ui/core';

export default function Home() {
  const [users, setUsers] = useState([])
  const [isGroomTabSelected, setIsGroomTabSelected] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
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

  const handleMoreVertClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <header className={styles.header}>
        <span>鈴木家・大河内家結婚式 管理画面</span>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>出席者一覧</h1>
        <div className={styles.listFilterTab}>
          <div className={isGroomTabSelected ? styles.groomTabSelected : styles.groomTab} onClick={() => !isGroomTabSelected && setIsGroomTabSelected(!isGroomTabSelected)}>
            <span className={isGroomTabSelected ? styles.tabSelectedText : styles.tabText}>新郎側</span>
          </div>
          <div className={isGroomTabSelected ? styles.brideTab : styles.brideTabSelected} onClick={() => isGroomTabSelected && setIsGroomTabSelected(!isGroomTabSelected)}>
            <span className={isGroomTabSelected ? styles.tabText : styles.tabSelectedText}>新婦側</span>
          </div>
        </div>
        <table className={styles.attendanceListTable}>
          <thead>
            <tr>
              <th>名前</th>
              <th>出席予定か</th>
              <th>受付済み</th>
              <th>お車代の提供有無</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className={users.length != index + 1 && styles.borderBottomRequired}>
                <td>
                  <Link href={`/users/${user.id}`} key={index}>
                    <a style={{display: 'block', width: '100%'}}>
                      <span style={{display: 'block', fontSize: '12px', textAlign: "center"}}>{user.last_name_kana}&nbsp;{user.first_name_kana}</span>
                      {user.last_name}&nbsp;{user.first_name}
                    </a>
                  </Link>
                </td>
                <td>
                  <Link href={`/users/${user.id}`} key={index}>
                    <a style={{display: 'block', width: '100%'}}>
                      {!!user.attendance ? (user.attendance.will_attende ? "出席予定" : "欠席予定") : "未回答"}
                    </a>
                  </Link>
                </td>
                <td>
                  <Link href={`/users/${user.id}`} key={index}>
                    <a style={{display: 'block', width: '100%'}}>
                      {!!user.attendance ? (user.attendance.is_attende_on_that_day ? "受付済み" : "受付が未完了") : "未回答"}
                    </a>
                  </Link>
                </td>
                <td>
                  <Link href={`/users/${user.id}`} key={index}>
                    <a style={{display: 'block', width: '100%'}}>
                      {!!user.transfer_fee_manager ? (user.transfer_fee_manager.cost == 0 ? "提供の必要なし" : (user.transfer_fee_manager.is_guest_accepted ? "受領済み" : "未受領")) : "未回答"}
                    </a>
                  </Link>
                </td>
                <td>
                  <MoreVertIcon onClick={handleMoreVertClick}/>
                  <Popover 
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                  >
                    <ul className={styles.popoverList}>
                      <li>受付完了にする</li>
                      <li>お車代を提供済みにする</li>
                    </ul>
                  </Popover>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  )
}
