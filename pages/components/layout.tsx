import Head from "next/head";
import SideNav from "./sideNav";
import TopNav from "./topNav";

export default function Layout({ children }: any) {

  return (
    <>
    <Head>
      <title>Bondaf Admin</title>
      <link rel="icon" href="/assets/logo_symbol_dark.svg" />
    </Head>
      <div className="flex ">
        <SideNav />
        <div className="lg:w-[79.63vw] h-screen ">
          <TopNav />
          <main>{children}</main>
        </div>
      </div>

    </>
  )
}