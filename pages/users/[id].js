import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import axios from 'axios';
// import queryString from 'query-string';

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
        await axios.get(`http://localhost:3000/v1/admin/users/${id}`,
        {
          headers: {
            Authorization: authToken
          }
        }).then((response) => {
          setUser(response.data)
        }).catch(() => {
          router.push('http://localhost:8080/login')
        })
      }
      f()
    }
  }, [id]);

  return (
    <h1>ユーザー{router.query.id}のページです</h1>
  );
}
