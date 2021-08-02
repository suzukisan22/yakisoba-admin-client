import React from 'react'
import Head from 'next/head'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <Head>
        <title>R To A管理画面</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Component {...pageProps} />
    </React.Fragment>
  )
}

export default MyApp
