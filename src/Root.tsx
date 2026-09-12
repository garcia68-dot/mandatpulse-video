import React from 'react';
import {Composition} from 'remotion';
import {MandatPulse} from './MandatPulse';

export const Root: React.FC = () => (
  <Composition
    id="MandatPulse"
    component={MandatPulse}
    durationInFrames={720}
    fps={30}
    width={1080}
    height={1350}
  />
);
