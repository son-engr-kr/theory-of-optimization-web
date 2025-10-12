import { useState } from 'react';
import Plot from 'react-plotly.js';
import './Theorem228.css';

function Theorem228() {
  const [matrix, setMatrix] = useState([[1, 0], [0, 1]]);
  const [coneAngle, setConeAngle] = useState(90);

  const handleMatrixChange = (i, j, value) => {
    const newMatrix = matrix.map(row => [...row]);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      newMatrix[i][j] = numValue;
      setMatrix(newMatrix);
    }
  };

  const generateCone = (angleInDegrees, rayLength = 20) => {
    const angleRad = (angleInDegrees * Math.PI) / 180;
    const numRays = 100;
    const rays = [];
    
    for (let i = 0; i <= numRays; i++) {
      const theta = (i / numRays) * angleRad;
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

  const generatePolarCone = (angleInDegrees, rayLength = 20) => {
    const angleRad = (angleInDegrees * Math.PI) / 180;
    const numRays = 100;
    const rays = [];
    
    // C가 0 ~ θ일 때, C°는 (θ + 90°) ~ 270°
    const startAngle = angleRad + Math.PI / 2;  // θ + 90°
    const endAngle = 3 * Math.PI / 2;            // 270°
    
    for (let i = 0; i <= numRays; i++) {
      const theta = startAngle + (i / numRays) * (endAngle - startAngle);
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

  const coneC = generateCone(coneAngle);
  const coneK = transformCone(coneC);
  const polarConeC = generatePolarCone(coneAngle);
  const polarConeK = transformPolarCone(polarConeC);

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
      range: [-25, 25], 
      zeroline: true,
      title: 'x₁',
      scaleanchor: 'y'
    },
    yaxis: { 
      range: [-25, 25], 
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
          <label>Cone C Angle: {coneAngle}°</label>
          <input 
            type="range" 
            min="10" 
            max="180" 
            value={coneAngle}
            onChange={(e) => setConeAngle(parseInt(e.target.value))}
            className="slider"
          />
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

