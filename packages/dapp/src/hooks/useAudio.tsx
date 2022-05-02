import { useEffect, useState } from "react";

const useAudio = (url: string, vol: number = 0.2) => {
  const [audio] = useState<HTMLAudioElement>(new Audio(url));
  const [playing, setPlaying] = useState<boolean>(false);

  const pause = () => {
    setPlaying(false);
  };

  const play = () => {
    setPlaying(true);
  };

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing, audio]);

  useEffect(() => {
    audio.volume = vol;

    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, [audio, vol]);

  return {
    playing,
    play: () => play(),
    pause: () => pause(),
  };
};

export default useAudio;
