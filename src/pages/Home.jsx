import Header from "../components/Header";
import About from "../components/About";
import Skills from "../components/Skills";
import Footer from "../components/Footer";

function Home() {
  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React"
  ];

  return (
    <>
      <Header name="Poojan Dave" />
      <About />
      <Skills skillList={skills} />
      <Footer />
    </>
  );
}

export default Home;