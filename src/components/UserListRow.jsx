import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios'
import styles from '../../styles/Home.module.scss'
import Link from 'next/link';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {Popover} from '@material-ui/core';

export function UserListRow({propsUser, propsAttendance, isLastRow, propsTransferFeeManager}){
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState(null)
  const [user, setUser] = useState(propsUser)
  const [attendance, setAttendance] = useState(propsAttendance)
  const [transferFeeManager, setTransferFeeManager] = useState(propsTransferFeeManager)

  const handleMoreVertClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const onClickAttendance = () => {
    const authToken = localStorage.getItem('r_to_a_admin_key')
    axios.post(`${process.env.API_SERVER_ENDPOINT}/v1/admin/users/attendances/update`, {
      user: {
        id: user.id,
        attendance: {
          is_attende_on_that_day: !attendance.is_attende_on_that_day
        },
        transfer_fee_manager: {
          is_guest_accepted: transferFeeManager.is_guest_accepted
        },
      }
    },
      {
      headers: {
        Authorization: authToken
      }
    }).then((response) => {
      setUser(response.data)
      setAttendance({...response.data.attendance})
      setTransferFeeManager({...response.data.transfer_fee_manager})
      setAnchorEl(null);
    }).catch((e) => {
      console.log(e)
    })
  }

  const onClickFeeAccepted = () => {
    const authToken = localStorage.getItem('r_to_a_admin_key')
    axios.post(`${process.env.API_SERVER_ENDPOINT}/v1/admin/users/attendances/update`, {
      user: {
        id: user.id,
        attendance: {
          is_attende_on_that_day: attendance.is_attende_on_that_day
        },
        transfer_fee_manager: {
          is_guest_accepted: !transferFeeManager.is_guest_accepted
        },
      }
    },
      {
      headers: {
        Authorization: authToken
      }
    }).then((response) => {
      setUser(response.data)
      setAttendance({...response.data.attendance})
      setTransferFeeManager({...response.data.transfer_fee_manager})
      setAnchorEl(null);
    }).catch((e) => {
      console.log(e)
    })
  }

  return (
    <tr key={user.id} className={isLastRow ? '' : styles.borderBottomRequired}>
      <td>
        <Link href={`/users/${user.id}`}>
          <a style={{display: 'block', width: '100%'}}>
            <span style={{display: 'block', fontSize: '12px', textAlign: "center"}}>{user.last_name_kana}&nbsp;{user.first_name_kana}</span>
            {user.last_name}&nbsp;{user.first_name}
          </a>
        </Link>
      </td>
      <td>
        <Link href={`/users/${user.id}`}>
          <a style={{display: 'block', width: '100%'}}>
            {!!user.attendance ? (user.attendance.will_attende ? "????????????" : "????????????") : "?????????"}
          </a>
        </Link>
      </td>
      <td>
        <Link href={`/users/${user.id}`}>
          <a style={{display: 'block', width: '100%'}}>
            {!!user.attendance ? (user.attendance.is_attende_on_that_day ? "????????????" : "??????????????????") : "?????????"}
          </a>
        </Link>
      </td>
      <td>
        <Link href={`/users/${user.id}`}>
          <a style={{display: 'block', width: '100%'}}>
            {!!transferFeeManager ? (transferFeeManager.cost == 0 ? "?????????????????????" : (user.transfer_fee_manager.is_guest_accepted ? "????????????" : "?????????")) : "?????????"}
          </a>
        </Link>
      </td>
      <td key={user.id}>
        {(!!attendance || transferFeeManager.cost != 0) &&
          (
          <span>
            <MoreVertIcon onClick={handleMoreVertClick} />
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
                {attendance.is_attende_on_that_day ? <li onClick={onClickAttendance}>???????????????????????????</li> : <li onClick={() => onClickAttendance(user)}>?????????????????????</li>}
                {
                  (transferFeeManager.cost != 0) && (transferFeeManager.is_guest_accepted ?
                  <li onClick={onClickFeeAccepted}>??????????????????????????????</li> :
                  <li onClick={onClickFeeAccepted}>?????????????????????????????????</li>)
                }
            </ul>
          </Popover>
          </span>
          )
        }
      </td>
    </tr>
  )
}
