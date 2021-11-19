import Head from 'next/head'
import styles from '../../styles/Home.module.scss'
import React, { useEffect, useState, SyntheticEvent } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router';
import Link from 'next/link';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {Popover} from '@material-ui/core';

export default function UserList(): JSX.Element {
  const [users, setUsers] = useState([])
  const [isGroomTabSelected, setIsGroomTabSelected] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
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

  const handleMoreVertClick = (event: SyntheticEvent):void => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = ():void => {
    setAnchorEl(null);
  };

  const onClickAttendance = (user):void => {
    const authToken = localStorage.getItem('r_to_a_admin_key')
    axios.post(`${process.env.API_SERVER_ENDPOINT}/v1/admin/users/attendances/update`, {
      user: {
        id: user.id,
        attendance: {
          is_attende_on_that_day: !user.attendance.is_attende_on_that_day
        },
        transfer_fee_manager: {
          is_guest_accepted: user.transfer_fee_manager.is_guest_accepted
        },
      }
    },
      {
      headers: {
        Authorization: authToken
      }
    }).then((response) => {
      setUsers(response.data)
      setAnchorEl(null);
    }).catch(() => {
      router.push('/login')
    })
  }

  const onClickFeeAccepted = (user):void => {
    const authToken = localStorage.getItem('r_to_a_admin_key')
    axios.post(`${process.env.API_SERVER_ENDPOINT}/v1/admin/users/attendances/update`, {
      user: {
        id: user.id,
        attendance: {
          is_attende_on_that_day: user.attendance.is_attende_on_that_day
        },
        transfer_fee_manager: {
          is_guest_accepted: !user.transfer_fee_manager.is_guest_accepted
        },
      }
    },
      {
      headers: {
        Authorization: authToken
      }
    }).then((response) => {
      setUsers(response.data)
      setAnchorEl(null);
    }).catch(() => {
      router.push('/login')
    })
  }

  const setUserByInvitationSide = ({isGroomSide}):void  => {
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

  const open: boolean = Boolean(anchorEl);
  const id: string | undefined = open ? 'simple-popover' : undefined;

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
              <th>出席予定か</th>
              <th>受付済み</th>
              <th>お車代の提供有無</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className={users.length != index + 1 ? styles.borderBottomRequired : ''}>
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
                      {!!user.transfer_fee_manager ? (user.transfer_fee_manager.cost == 0 ? "提供の必要なし" : (user.transfer_fee_manager.is_guest_accepted ? "提供済み" : "未提供")) : "未回答"}
                    </a>
                  </Link>
                </td>
                <td>
                  {(!!user.attendance || user.transfer_fee_manager.cost != 0) &&
                    (
                    <><MoreVertIcon onClick={handleMoreVertClick} />
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
                        {user.attendance.is_attende_on_that_day ? 
                        <li onClick={() => onClickAttendance(user)}>受付が未完了に戻す</li> : 
                        <li onClick={() => onClickAttendance(user)}>受付済みにする</li>}
                        {
                          user.transfer_fee_manager.is_guest_accepted ?
                          <li onClick={() => onClickFeeAccepted(user)}>お車代を未提供に戻す</li> :
                          <li onClick={() => onClickFeeAccepted(user)}>お車代を提供済みにする</li>
                        }
                      </ul>
                    </Popover></>)
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  )
}
