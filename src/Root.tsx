import React from 'react';
import {Composition} from 'remotion';
import {MandatPulse} from './MandatPulse';
import {LighAuraStory} from './LighAuraStory';

export const Root: React.FC = () => (
  <>
    <Composition
      id="MandatPulse"
      component={MandatPulse}
      durationInFrames={720}
      fps={30}
      width={1080}
      height={1350}
    />
    <Composition
      id="LighAuraStory"
      component={LighAuraStory}
      durationInFrames={360}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
