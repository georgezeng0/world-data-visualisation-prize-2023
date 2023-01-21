import React, { useEffect, useRef } from 'react'

const PlotOutput = ({ props: { form } }) => {
    const dict = {
        "inf_vs_exp": "infant_exp.html",
        "mat_vs_exp": "mat_exp.html",
        "life_vs_exp": "life_exp.html"
    }

    const plotRef = useRef(null)

    useEffect(() => {
        const data = document.querySelectorAll("script[type='application/json']");
    }, [plotRef.current,form])
    
  return (
      <iframe ref={plotRef} src={`/plots/${dict[form.plotId]}`} height={600} width={900} />
  )
}

export default PlotOutput