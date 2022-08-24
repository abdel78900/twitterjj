
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Feed from '../components/Feed'
import Login from '../components/Login'
import Modal from '../components/Modal'
import Widgets from '../components/Widgets'
import { getProviders, getSession, useSession } from "next-auth/react";
import ModalDelete from '../components/ModalDelete'

const Home = ({trendingResults, followResults, providers}) => {

  const { data: session } = useSession();

  if(!session) return <Login providers = {providers}/>
  return (
    <div className="">
      <Head>
        <title>{session.user.name} (@{session.user.tag})</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <main className='bg-black min-h-screen flex max-w-[1500px] mx-auto'>
      <Sidebar/>
      <Feed/>
      <Widgets trendingResults={trendingResults}
          followResults={followResults}/>

      <Modal trendingResults={trendingResults} followResults={followResults}/>
      <ModalDelete/>
    </main>
     
    </div>
  )
}

export default Home

export async function getServerSideProps(context) {
  const trendingResults = await fetch("https://jsonkeeper.com/b/C0VY").then(
    (res) => res.json()
  );
  const followResults = await fetch("https://jsonkeeper.com/b/LO00").then(
    (res) => res.json()
  );
  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      trendingResults: JSON.parse(JSON.stringify(trendingResults)),
      followResults: JSON.parse(JSON.stringify(followResults)),
      session: JSON.parse(JSON.stringify(session)),
      providers: JSON.parse(JSON.stringify(providers)),
    },
  };
}