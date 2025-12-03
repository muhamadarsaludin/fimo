import BackToTop from "@/components/back-to-top/BackToTop";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <main className="g-main">
      <Header/>
      <div className="g-container g-page-wrapper">
        <Outlet/>
      </div>
      <Footer/>
      <BackToTop/>
    </main>
  )
}