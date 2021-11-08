import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import axios from 'axios';
import styles from '../../styles/UserDetail.module.scss';
// import queryString from 'query-string';
import {ArrowBackIos} from '@material-ui/icons';

export default function Id() {
  const router = useRouter();
  const [id, setId] = useState(0);
  const [user, setUser] = useState('');

  // この部分を追加
  useEffect(() => {
    // idがqueryで利用可能になったら処理される
    if (router.asPath !== router.route) {
      setId(Number(router.query.id));
    }
  }, [router]);

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

  return (
    <div>
      <header className={styles.header}>
        <span>鈴木家・大河内家結婚式 管理画面</span>
      </header>
      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <div className={styles.arrowBackIcon}>
            <ArrowBackIos />
          </div>
          <div className={styles.groomSideIcon}>
            <span className={styles.sideIconText}>新郎友人</span>
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
                <div className={styles.passwordChangeForm}>
                  <div>
                    <label className={styles.passwordChangeLabel}>
                      <span>新しいパスワード</span>
                      <input type="password" name="password" className={styles.inputPassword}/>
                    </label>
                  </div>
                  <div>
                    <label className={styles.passwordChangeLabel}>
                      <span>新しいパスワード(確認)</span>
                      <input type="password" name="confirm_password" className={styles.inputPassword}/>
                    </label>
                  </div>
                  <div className={styles.submitButtonGroup}>
                    <button className={styles.submitButton}>
                      変更する
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.panelGroup}>
          <div className={styles.panelHeader}>
            コメント
          </div>
          <div className={styles.panelBody}>
            <div className={styles.textInputArea}>
              <textarea className={styles.textareaComment} rows={5} />
              <button className={styles.submitButton}>
                保存する
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
