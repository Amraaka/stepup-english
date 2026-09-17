import { Composition } from "remotion";
import sample from "../quizzes/car-parts.json";
import { FPS } from "./theme";
import type { Quiz } from "./types";
import { VocabQuiz, quizDuration } from "./VocabQuiz";

export const RemotionRoot = () => (
  <Composition
    id="VocabQuiz"
    component={VocabQuiz}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={quizDuration(sample as Quiz)}
    defaultProps={sample as Quiz}
    calculateMetadata={({ props }) => ({ durationInFrames: quizDuration(props) })}
  />
);
