import React from 'react';
import { Composition } from 'remotion';
import { ProductDemoVideo } from './ProductDemoVideo';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="SaaSProductDemo"
        component={ProductDemoVideo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
