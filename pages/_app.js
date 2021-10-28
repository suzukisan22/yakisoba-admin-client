import React from 'react'
import Head from 'next/head'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <Head>
        <title>R To A管理画面</title>
        <meta name="robots" content="noindex" />
        <link href="https://fonts.googleapis.com/css?family=Noto+Sans+JP&amp;subset=japanese" rel="stylesheet" />
      </Head>
      <div className='container'>
        <Component {...pageProps} />
      </div>
    </React.Fragment>
  )
}

export default MyApp
