import React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { wavify } from "./wavify";

gsap.registerPlugin(ScrollTrigger);

const AnimatedSection = React.memo(() => {
  const cancellables = useRef([]);
  const waveRef1 = useRef();
  const waveRef2 = useRef();
  const waveRef3 = useRef();
  const waveRef4 = useRef();
  const waveRef5 = useRef();
  const waveRef6 = useRef();
  const wavesContainerREf = useRef();
  const contentRef = useRef();
  const logoRef = useRef();

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: contentRef.current,
        start: "top 40%",
      },
    });

    tl.addLabel("colors", 2)
      .fromTo(
        logoRef.current,
        {
          opacity: 0,
          scale: 0,
        },
        {
          opacity: 1,
          scale: 1.1,
          duration: 1,
        },
      )
      .to(logoRef.current, {
        scale: 1,
      })
      .to(
        waveRef1.current,
        {
          stroke: "#F3B614",
        },
        "colors",
      )
      .to(
        waveRef2.current,
        {
          stroke: "#F32C14",
        },
        "colors",
      )
      .to(
        waveRef3.current,
        {
          stroke: "#EB4623",
        },
        "colors",
      )
      .to(
        waveRef4.current,
        {
          stroke: "#14C9F3",
        },
        "colors",
      )
      .to(
        waveRef5.current,
        {
          stroke: "#1D54D8",
        },
        "colors",
      )
      .to(
        waveRef6.current,
        {
          stroke: "#6D1DD8",
        },
        "colors",
      )
      .addLabel("move")
      .to(
        waveRef6.current,
        {
          y: -40,
          duration: 1,
        },
        "move+=1",
      )
      .to(
        waveRef5.current,
        {
          y: -20,
          duration: 1,
        },
        "move+=1",
      )
      .to(
        waveRef1.current,
        {
          y: 20,
          duration: 1,
        },
        "move+=1",
      )
      .to(
        waveRef3.current,
        {
          y: 80,
          duration: 1,
        },
        "move+=1",
      )
      .to(
        waveRef2.current,
        {
          y: 140,
          duration: 1,
        },
        "move+=1",
      )
      .addLabel("select")
      .to(
        waveRef6.current,
        {
          stroke: "#333",
        },
        "select",
      )
      .to(
        waveRef5.current,
        {
          stroke: "#333",
        },
        "select",
      )
      .to(
        waveRef4.current,
        {
          stroke: "#333",
        },
        "select",
      )
      .to(
        waveRef2.current,
        {
          stroke: "#333",
        },
        "select",
      )
      .to(
        waveRef3.current,
        {
          stroke: "#333",
        },
        "select",
      );

    const wave1Cancellable = wavify(waveRef1.current, {
      height: 70,
      bones: 5,
      amplitude: 20,
      speed: 0.5,
      container: wavesContainerREf.current,
    });
    const wave2Cancellable = wavify(waveRef2.current, {
      height: 70,
      bones: 6,
      amplitude: 22,
      speed: 0.6,
      container: wavesContainerREf.current,
    });
    const wave3Cancellable = wavify(waveRef3.current, {
      height: 70,
      bones: 7,
      amplitude: 20,
      speed: 0.55,
      container: wavesContainerREf.current,
    });
    const wave6Cancellable = wavify(waveRef6.current, {
      height: 70,
      bones: 4,
      amplitude: 20,
      speed: 0.3,
      container: wavesContainerREf.current,
    });
    const wave5Cancellable = wavify(waveRef5.current, {
      height: 70,
      bones: 6,
      amplitude: 18,
      speed: 0.2,
      container: wavesContainerREf.current,
    });
    const wave4Cancellable = wavify(waveRef4.current, {
      height: 70,
      bones: 6,
      amplitude: 16,
      speed: 0.4,
      container: wavesContainerREf.current,
    });

    cancellables.current = [
      wave1Cancellable,
      wave2Cancellable,
      wave3Cancellable,
      wave4Cancellable,
      wave5Cancellable,
      wave6Cancellable,
    ];

    return () => {
      cancellables.current.forEach((cancellable) => {
        cancellable.cancel();
      });
    };
  }, []);

  return (
    <section ref={contentRef} className="content">
      <div className="content-text">
        <h1>What is LALAL.AI?</h1>
        <p>
          A next-generation vocal remover and music source separation service
          for fast, easy and precise stem extraction. Remove vocal,
          instrumental, drums, bass, piano, electric guitar, acoustic guitar,
          and synthesizer tracks without quality loss.
        </p>
      </div>
      <div ref={wavesContainerREf} className="waves-container">
        <div ref={logoRef} className="logo-container">
          <img src="https://s.lalal.ai/img/home/logo_ai.svg" alt="logo" />
        </div>
        <svg
          width="100%"
          height="100%"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path ref={waveRef4} d="" />
        </svg>
        <svg
          width="100%"
          height="100%"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path ref={waveRef1} d="" />
        </svg>
        <svg
          width="100%"
          height="100%"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path ref={waveRef2} d="" />
        </svg>
        <svg
          width="100%"
          height="100%"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path ref={waveRef3} d="" />
        </svg>
        <svg
          width="100%"
          height="100%"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path ref={waveRef5} d="" />
        </svg>
        <svg
          width="100%"
          height="100%"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path ref={waveRef6} d="" />
        </svg>
      </div>
    </section>
  );
});

export default AnimatedSection;
