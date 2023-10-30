import { useEffect, useState } from 'react';
import '../styles/globals.css'
import Layout from './components/layout';
 
export default function MyApp({ Component, pageProps }:any) {
 
    return (
      // <Layout>
        <Component {...pageProps}  />
      // </Layout>
    );
  
}