import "./audio-player.css";
import { useState, useCallback, useRef } from "react";
import Sketch from "react-p5";
import { frequencyBands, PlayerType } from "./constants";
import PlayButton from "./play-button";

const playerBgColor = "#312f32";
const chartsColor = "#3D3C3D";
const instrumentalSource = "/songs/queen-dsmn_no_vocals.mp3";
const vocalSource = "/songs/queen-dsmn_vocals.mp3";

const AudioPlayer = ({ type, colored }) => {
  const [isPlaying, setIsPlaying] = useState();
  const [analyser, setAnalyser] = useState();
  const [audioContext, setAudioContext] = useState();
  const [signalData, setSignalData] = useState();
  const [currentTime, setCurrentTime] = useState();
  const [signals, setSignals] = useState();

  const containerRef = useRef();
  const audioRef = useRef();

  const setup = useCallback(async (p5, canvasParentRef) => {
    p5.createCanvas(
      containerRef.current.offsetWidth,
      containerRef.current.offsetHeight,
    ).parent(canvasParentRef);
  }, []);

  const handleResize = useCallback(async (p5) => {
    p5.resizeCanvas(
      containerRef.current.offsetWidth,
      containerRef.current.offsetHeight,
    );
  }, []);

  const draw = useCallback(
    (p5) => {
      p5.background(playerBgColor);

      const dim = p5.min(p5.width, p5.height);
      if (audioContext && analyser) {
        if (type === PlayerType.Instrumental) {
          signals.forEach(({ analyser, data, color }, i) => {
            // Get the waveform
            analyser.getFloatTimeDomainData(data);

            const signal = rootMeanSquaredSignal(data);
            const scale = 10;
            const size = dim * scale * signal;

            p5.fill(color);
            p5.noStroke();
            p5.rectMode(p5.CENTER);
            const sliceWidth = (p5.width / (signals.length - 1)) * 0.75;
            const x =
              signals.length <= 1
                ? p5.width / 2
                : p5.map(
                    i,
                    0,
                    signals.length - 1,
                    sliceWidth / 2,
                    p5.width - sliceWidth / 2,
                  );
            p5.rect(x, p5.height, sliceWidth, size);
          });
        } else {
          // Get the *time domain* data (not the frequency)
          analyser.getFloatTimeDomainData(signalData);

          const signal = rootMeanSquaredSignal(signalData);
          const scale = 10; // scale the data a bit so the circle is bigger
          const size = dim * scale * signal;

          p5.stroke(chartsColor);
          p5.noFill();
          p5.strokeWeight(size * 0.035);
          p5.circle(p5.width / 2, p5.height / 2, size);
        }
      } else {
        p5.fill(chartsColor);
        p5.noStroke();
      }
    },
    [audioContext, analyser, signalData, signals, type],
  );

  const togglePlay = useCallback(() => {
    if (!audioContext) {
      const audioContext = new AudioContext();
      setAudioContext(audioContext);

      const audio = audioRef.current;

      audio.src = type === PlayerType.Vocal ? vocalSource : instrumentalSource;

      audio.crossOrigin = "Anonymous";

      audio.play();

      const source = audioContext.createMediaElementSource(audio);

      const analyserNode = audioContext.createAnalyser();
      analyserNode.smoothingTimeConstant = 1;

      if (type === PlayerType.Instrumental) {
        source.connect(audioContext.destination);

        const signals = frequencyBands.map(({ frequency, color }) => {
          const analyser = audioContext.createAnalyser();
          analyser.smoothingTimeConstant = 1;
          setAnalyser(analyser);

          const data = new Float32Array(analyser.fftSize);

          const filter = audioContext.createBiquadFilter();
          filter.frequency.value = frequency;
          filter.Q.value = 1;
          filter.type = "bandpass";

          source.connect(filter);
          filter.connect(analyser);

          return {
            analyser,
            color: colored ? color : chartsColor,
            data,
            filter,
          };
        });
        setSignals(signals);
      } else {
        setAnalyser(analyserNode);

        const signalData = new Float32Array(analyserNode.fftSize);
        setSignalData(signalData);

        source.connect(audioContext.destination);

        source.connect(analyserNode);
      }

      setIsPlaying(true);
    } else {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [audioContext, type, colored]);

  const handleFinishPlaying = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(null);
  }, []);

  return (
    <div ref={containerRef} className="player-container">
      <div className="player-header">
        <PlayButton isPlaying={isPlaying} onClick={togglePlay} />
        <h3 className="player-title">{type}</h3>
      </div>
      <Sketch
        setup={setup}
        draw={draw}
        windowResized={handleResize}
        className="p5-sketch"
      />
      <div className="player-footer">
        <span>{currentTime ?? "00:00"}</span>
      </div>
      <audio
        ref={audioRef}
        onTimeUpdate={(e) =>
          setCurrentTime(
            `${new Date(e.target.currentTime * 1000)
              .toISOString()
              .substring(14, 19)}`,
          )
        }
        onEnded={handleFinishPlaying}
      ></audio>
    </div>
  );
};

function rootMeanSquaredSignal(data) {
  let rms = 0;
  for (let i = 0; i < data.length; i++) {
    rms += data[i] * data[i];
  }
  return Math.sqrt(rms / data.length);
}

export default AudioPlayer;
