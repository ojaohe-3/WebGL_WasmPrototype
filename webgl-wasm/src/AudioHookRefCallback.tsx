import React, {useCallback, useRef, useState} from "react";

type AudioHookReturn = [any | undefined, Float32Array | undefined]

export default function audioHookRefCallback(): AudioHookReturn{
    const ref = useRef(null);
    const [buff, setBuff] = useState<Float32Array>();

    const aRefCallback = useCallback((node) => {
      if (ref.current){
        ref.current = null;
      }
      if(node){
        
      }
      ref.current = node;
    },[ref])
    return [ref, buff]
  }
  