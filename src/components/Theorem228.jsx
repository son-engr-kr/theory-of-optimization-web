import { useState } from 'react';
import Plot from 'react-plotly.js';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import './Theorem228.css';

function Theorem228() {
  const [matrix, setMatrix] = useState([[1, 0], [1, 1]]);
  const [coneStart, setConeStart] = useState(0);
  const [coneEnd, setConeEnd] = useState(90);

  const handleMatrixChange = (i, j, value) => {
    const newMatrix = matrix.map(row => [...row]);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      newMatrix[i][j] = numValue;
      setMatrix(newMatrix);
    }
  };

  const generateCone = (startDeg, endDeg, rayLength = 1) => {
    const startRad = (startDeg * Math.PI) / 180;
    const endRad = (endDeg * Math.PI) / 180;
    const numRays = 100;
    const rays = [];
    
    for (let i = 0; i <= numRays; i++) {
      const theta = startRad + (i / numRays) * (endRad - startRad);
      rays.push({
        x: rayLength * Math.cos(theta),
        y: rayLength * Math.sin(theta)
      });
    }
    return rays;
  };

  const transformCone = (cone) => {
    const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    if (Math.abs(det) < 0.0001) {
      return [];
    }

    const invA = [
      [matrix[1][1] / det, -matrix[0][1] / det],
      [-matrix[1][0] / det, matrix[0][0] / det]
    ];

    return cone.map(point => ({
      x: invA[0][0] * point.x + invA[0][1] * point.y,
      y: invA[1][0] * point.x + invA[1][1] * point.y
    }));
  };

  const generatePolarCone = (startDeg, endDeg, rayLength = 1) => {
    const coneSpan = endDeg - startDeg;
    
    // If cone angle span >= 180°, polar cone is empty or only origin
    if (coneSpan > 180) {
      return [];
    }
    
    const startRad = (startDeg * Math.PI) / 180;
    const endRad = (endDeg * Math.PI) / 180;
    const numRays = 100;
    const rays = [];
    
    // When C spans from α to β, C° spans from (β + 90°) to (α + 270°)
    const polarStart = endRad + Math.PI / 2;      // β + 90°
    const polarEnd = startRad + 3 * Math.PI / 2;  // α + 270°
    
    for (let i = 0; i <= numRays; i++) {
      const theta = polarStart + (i / numRays) * (polarEnd - polarStart);
      rays.push({
        x: rayLength * Math.cos(theta),
        y: rayLength * Math.sin(theta)
      });
    }
    return rays;
  };

  const transformPolarCone = (polarCone) => {
    const AT = [[matrix[0][0], matrix[1][0]], [matrix[0][1], matrix[1][1]]];
    
    return polarCone.map(point => ({
      x: AT[0][0] * point.x + AT[0][1] * point.y,
      y: AT[1][0] * point.x + AT[1][1] * point.y
    }));
  };

  const coneC = generateCone(coneStart, coneEnd);
  const coneK = transformCone(coneC);
  const polarConeC = generatePolarCone(coneStart, coneEnd);
  const polarConeK = transformPolarCone(polarConeC);
  
  const coneSpan = coneEnd - coneStart;
  const isPolarConeEmpty = coneSpan > 180;

  const plotData = [
    {
      x: [0, ...coneC.map(r => r.x), 0],
      y: [0, ...coneC.map(r => r.y), 0],
      fill: 'toself',
      fillcolor: 'rgba(255, 0, 0, 0.15)',
      line: { color: 'red', width: 2 },
      mode: 'lines',
      name: 'Cone C',
      hoverinfo: 'name'
    },
    {
      x: [0, ...coneK.map(r => r.x), 0],
      y: [0, ...coneK.map(r => r.y), 0],
      fill: 'toself',
      fillcolor: 'rgba(0, 0, 255, 0.15)',
      line: { color: 'blue', width: 2 },
      mode: 'lines',
      name: 'Cone K = {x : Ax ∈ C}',
      hoverinfo: 'name'
    },
    {
      x: [0, ...polarConeC.map(r => r.x), 0],
      y: [0, ...polarConeC.map(r => r.y), 0],
      fill: 'toself',
      fillcolor: 'rgba(255, 165, 0, 0.15)',
      line: { color: 'orange', width: 2 },
      mode: 'lines',
      name: 'Polar C°',
      hoverinfo: 'name'
    },
    {
      x: [0, ...polarConeK.map(r => r.x), 0],
      y: [0, ...polarConeK.map(r => r.y), 0],
      fill: 'toself',
      fillcolor: 'rgba(0, 128, 128, 0.15)',
      line: { color: 'teal', width: 2 },
      mode: 'lines',
      name: 'Polar K° = {Aᵀλ : λ ∈ C°}',
      hoverinfo: 'name'
    }
  ];

  const layout = {
    width: 1200,
    height: 800,
    xaxis: { 
      range: [-2, 2], 
      zeroline: true,
      title: 'x₁',
      scaleanchor: 'y'
    },
    yaxis: { 
      range: [-2, 2], 
      zeroline: true,
      title: 'x₂'
    },
    showlegend: true,
    legend: {
      x: 1.05,
      y: 1
    },
    hovermode: 'closest',
    title: 'Theorem 2.28: K = {x : Ax ∈ C} and K° = {Aᵀλ : λ ∈ C°}'
  };

  return (
    <div className="theorem-container">
      <div className="theorem-header">
        <h2>Theorem 2.28</h2>
        <div className="theorem-statement">
          <p>
            <strong>Assume that</strong> <InlineMath math="C" /> is a closed convex cone in <InlineMath math="\mathbb{R}^m" /> 
            and <InlineMath math="A" /> is an <InlineMath math="m \times n" /> matrix.
          </p>
          <p>
            <strong>Let</strong>
          </p>
          <BlockMath math="K = \{x \in \mathbb{R}^n : Ax \in C\}" />
          <p>
            <strong>Then</strong> <InlineMath math="K" /> is a closed convex cone and
          </p>
          <BlockMath math="K^\circ = \{A^T\lambda : \lambda \in C^\circ\}" />
        </div>
      </div>

      <div className="controls">
        <div className="control-group">
          <label>Matrix A:</label>
          <div className="matrix-input">
            <span>[</span>
            <input
              type="number"
              step="0.1"
              value={matrix[0][0]}
              onChange={(e) => handleMatrixChange(0, 0, e.target.value)}
            />
            <input
              type="number"
              step="0.1"
              value={matrix[0][1]}
              onChange={(e) => handleMatrixChange(0, 1, e.target.value)}
            />
            <span>]</span>
          </div>
          <div className="matrix-input">
            <span>[</span>
            <input
              type="number"
              step="0.1"
              value={matrix[1][0]}
              onChange={(e) => handleMatrixChange(1, 0, e.target.value)}
            />
            <input
              type="number"
              step="0.1"
              value={matrix[1][1]}
              onChange={(e) => handleMatrixChange(1, 1, e.target.value)}
            />
            <span>]</span>
          </div>
        </div>

        <div className="control-group">
          <label>Cone C Start: {coneStart}°</label>
          <input 
            type="range" 
            min="0" 
            max="360" 
            value={coneStart}
            onChange={(e) => setConeStart(parseInt(e.target.value))}
            className="slider"
          />
          
          <label>Cone C End: {coneEnd}°</label>
          <input 
            type="range" 
            min="0" 
            max="360" 
            value={coneEnd}
            onChange={(e) => setConeEnd(parseInt(e.target.value))}
            className="slider"
          />
          
          <div className="cone-info">
            Cone span: {coneSpan}°
            {isPolarConeEmpty && (
              <div className="warning">
                ⚠️ Polar cone is {'{'}0{'}'} (span {'>'} 180°)
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="plot-wrapper">
        <Plot
          data={plotData}
          layout={layout}
          config={{ responsive: true }}
        />
      </div>
    </div>
  );
}

export default Theorem228;

