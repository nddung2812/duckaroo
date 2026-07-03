import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children, className = "" }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-grow ${className}`}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
