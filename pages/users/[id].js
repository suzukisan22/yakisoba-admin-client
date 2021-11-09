import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from "next/router";
import axios from 'axios';
import styles from '../../styles/UserDetail.module.scss';
// import queryString from 'query-string';
import {ArrowBackIos} from '@material-ui/icons';
import { useForm } from 'react-hook-form';

export default function Id() {
  const router = useRouter();
  const [id, setId] = useState(0);
  const [user, setUser] = useState('');
  const [passwordFormMessage, setPasswordFormMessage] = useState('');
  const [commentFormMessage, setCommentFormMessage] = useState('');
  const [comment, setComment] = useState('');

  const isGroomSide = user.account_detail && user.account_detail.is_groom_side;
  const {handleSubmit, register, formState: { errors }, watch} = useForm();

  const password = useRef({});
  password.current = watch("password", "");

  // この部分を追加
  useEffect(() => {
    // idがqueryで利用可能になったら処理される
    if (router.asPath !== router.route) {
      setId(Number(router.query.id));
    }
  }, [router]);

  console.log(errors)

  // idが取得されてセットされたら処理される
  useEffect(() => {
    if (id != 0) {
      const authToken = localStorage.getItem('r_to_a_admin_key')
      const f = async () => {
        await axios.get(`${process.env.API_SERVER_ENDPOINT}/v1/admin/users/${id}`,
        {
          headers: {
            Authorization: authToken
          }
        }).then((response) => {
          setUser(response.data)
        }).catch(() => {
          router.push('/login')
        })
      }
      f()
    }
  }, [id]);

  const onClickUpdatePassword = (data) => {
    const authToken = localStorage.getItem('r_to_a_admin_key')
    axios.post(`${process.env.API_SERVER_ENDPOINT}/v1/admin/users/attendances/password_update`, {
      user: {
        id: user.id,
        password: data.password
      }
    },
      {
      headers: {
        Authorization: authToken
      }
    }).then((response) => {
      setPasswordFormMessage("パスワードの更新に成功しました")
    }).catch((e) => {
      console.log(e)
      router.push('/login')
    })
  }

  const submitComment = () => {
    const authToken = localStorage.getItem('r_to_a_admin_key')
    axios.post(`${process.env.API_SERVER_ENDPOINT}/v1/admin/users/attendances/comment_update`, {
      user: {
        id: user.id,
        account_detail: {
          comment
        }
      }
    },
      {
      headers: {
        Authorization: authToken
      }
    }).then((response) => {
      setCommentFormMessage("コメントの更新に成功しました")
    }).catch((e) => {
      console.log(e)
      router.push('/login')
    })
  }


  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <div>
      <header className={styles.header}>
        <span>鈴木家・大河内家結婚式 管理画面</span>
      </header>
      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <div className={styles.arrowBackIcon} onClick={() => router.back()}>
            <ArrowBackIos />
          </div>
          <div className={isGroomSide ? styles.groomSideIcon : styles.brideSideIcon}>
            <span className={styles.sideIconText}>{user?.account_detail?.relation_name}</span>
          </div>
          <div className={styles.nameGroup}>
            <span className={styles.nameFurigana}>{user.last_name_kana}&nbsp;{user.first_name_kana}</span>
            <h3 className={styles.nameKanji}>{user.last_name}&nbsp;{user.first_name}</h3>
          </div>
        </div>
        <div className={styles.panelGroup}>
          <div className={styles.panelHeader}>
            出欠関係情報
          </div>
          <div className={styles.panelBody}>
            <div className={styles.informationRow}>
              <div className={styles.informationGroup}>
                <p className={styles.informationLabel}>出欠状態</p>
                <p className={styles.informationContext}>
                  {!!user.attendance ? (user.attendance.is_attende_on_that_day ? "受付済み" : "受付が未完了") : "未回答"}
                </p>
              </div>
              <div className={styles.informationGroup} style={{borderLeft: '2px solid #ebebeb', paddingLeft: '16px'}}>
                <p className={styles.informationLabel}>お車代を提供有無</p>
                <p className={styles.informationContext}>
                  {!!user.transfer_fee_manager ? (user.transfer_fee_manager.cost == 0 ? "提供の必要なし" : (user.transfer_fee_manager.is_guest_accepted ? "提供済み" : "未提供")) : "未回答"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.panelGroup}>
          <div className={styles.panelHeader}>
            アカウント情報
          </div>
          <div className={styles.panelBody}>
            <div className={styles.accountRow}>
              <div className={styles.accountGroup}>
                <p className={styles.informationLabel}>Username</p>
                <p className={styles.informationContext}>
                  {user.username}
                </p>
              </div>
            </div>
            <div className={styles.informationRow}>
              <div className={styles.accountGroup}>
                <div className={styles.accountLabelGroup}>
                  <p className={styles.accountLabel}>Password</p>
                  <span className={styles.accountDescription}>パスワードを紛失した場合、こちらから新しいパスワードに変更してください</span>
                </div>
                <form className={styles.passwordChangeForm} onSubmit={handleSubmit(onClickUpdatePassword)}>
                  {passwordFormMessage && <p className={styles.passwordUpdateMessage}>{passwordFormMessage}</p>}
                  <div>
                    <label className={styles.passwordChangeLabel}>
                      <span>新しいパスワード</span>
                      <div style={{display: 'flex', flexFlow: 'column'}}>
                        <input type="password" className={styles.inputPassword} {...register("password", {required: "パスワードは必須入力です"})} />
                        {errors && errors.password && <p style={{fontSize: '12px', color: 'red'}}>{errors.password.message}</p>}
                      </div>
                    </label>
                  </div>
                  <div>
                    <label className={styles.passwordChangeLabel}>
                      <span>新しいパスワード(確認)</span>
                      <div style={{display: 'flex', flexFlow: 'column'}}>
                        <input 
                          type="password"
                          className={styles.inputPassword}
                          {...register("confirmed_password", 
                            {required: "パスワード(確認)は必須入力です",
                            validate: value => value === password.current || "パスワードが合っていません"
                            })} />
                        {errors && errors.confirmed_password && <p style={{fontSize: '12px', color: 'red'}}>{errors.confirmed_password.message}</p>}
                      </div>
                    </label>
                  </div>
                  <div className={styles.submitButtonGroup}>
                    <input type="submit" value="変更する" className={styles.submitButton} />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.panelGroup}>
          <div className={styles.panelHeader}>
            メモ
          </div>
          <div className={styles.panelBody}>
            <div className={styles.textInputArea}>
              {commentFormMessage && <p className={styles.commentUpdateMessage}>{commentFormMessage}</p>}
              <textarea className={styles.textareaComment} rows={5} value={comment} onChange={(e) => setComment(e.target.value)}/>
              <button className={styles.submitButton} onClick={() => submitComment()}>
                保存する
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
