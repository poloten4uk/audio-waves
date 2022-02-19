import AnimatedSection from "./animated-section";
import AudioPlayer from "./audio-player";
import { PlayerType } from "./constants";

function App() {
  return (
    <main className="app-container">
      <section className="fake-content">
        <div className="players-container">
          <AudioPlayer type={PlayerType.Instrumental} />
          <AudioPlayer type={PlayerType.Vocal} />
        </div>
      </section>
      <AnimatedSection />
      <section className="fake-content"></section>
    </main>
  );
}

export default App;
