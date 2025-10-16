import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Plot from 'react-plotly.js';
import { Plotly } from 'plotly.js-dist-min';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import './Lemma270.css';

function Lemma270() {
  const [selectedFunction, setSelectedFunction] = useState('x2');
  const [x, setX] = useState(1);
  const [delta, setDelta] = useState(0.5); // Linear slider value (0-1)
  const [y, setY] = useState(1.5);
  const [L, setL] = useState(0.5); // Linear slider value (0-1)
  const [autoL, setAutoL] = useState(false);
  const [showOnlyRadius, setShowOnlyRadius] = useState(true);
  const [useLogScale, setUseLogScale] = useState(true);
  
  // Convert linear slider value to actual value
  const deltaValue = useLogScale ? Math.pow(10, delta * 4 - 2) : delta; // 0.01 to 100
  const LValue = useLogScale ? Math.pow(10, L * 4 - 2) : L; // 0.01 to 100

  const functions = {
    'x2': {
      name: 'x²',
      f: (x) => x * x,
      convex: true,
      domain: { min: -3, max: 3 }
    },
    'exp': {
      name: 'e^x',
      f: (x) => Math.exp(x),
      convex: true,
      domain: { min: -2, max: 2 }
    },
    'neglog': {
      name: '-log(x)',
      f: (x) => x > 0 ? -Math.log(x) : null,
      convex: true,
      domain: { min: 0.1, max: 3 }
    },
    'abs': {
      name: '|x|',
      f: (x) => Math.abs(x),
      convex: true,
      domain: { min: -3, max: 3 }
    },
    'relu': {
      name: 'max(0,x)',
      f: (x) => Math.max(0, x),
      convex: true,
      domain: { min: -2, max: 3 }
    },
    'negx2': {
      name: '-x²',
      f: (x) => -(x * x),
      convex: false,
      domain: { min: -2, max: 2 }
    },
    'x3': {
      name: 'x³',
      f: (x) => x * x * x,
      convex: false,
      domain: { min: -2, max: 2 }
    },
    'sin': {
      name: 'sin(x)',
      f: (x) => Math.sin(x),
      convex: false,
      domain: { min: -Math.PI, max: Math.PI }
    },
    'x23': {
      name: 'x^(2/3)',
      f: (x) => Math.sign(x) * Math.pow(Math.abs(x), 2/3),
      convex: false,
      domain: { min: -2, max: 2 }
    },
    'sqrtabs': {
      name: '√|x|',
      f: (x) => Math.sqrt(Math.abs(x)),
      convex: true,
      domain: { min: -2, max: 2 }
    },
    'x2sin1x': {
      name: 'x²sin(1/x)',
      f: (x) => x === 0 ? 0 : x * x * Math.sin(1 / x),
      convex: false,
      domain: { min: -0.5, max: 0.5 }
    },
    'logx': {
      name: 'log(x)',
      f: (x) => x > 0 ? Math.log(x) : null,
      convex: true,
      domain: { min: 0.1, max: 3 }
    },
    'sqrtx': {
      name: '√x',
      f: (x) => x >= 0 ? Math.sqrt(x) : null,
      convex: true,
      domain: { min: 0, max: 3 }
    }
  };

  const currentFunc = functions[selectedFunction];

  // Calculate function values
  const fx = currentFunc.f(x);
  const fy = currentFunc.f(y);

  // Calculate actual slope
  const actualSlope = Math.abs((fy - fx) / (y - x));

  // Calculate minimum L needed for the interval [x-delta, x+delta]
  const calculateMinL = useMemo(() => {
    const numSamples = 100;
    let maxSlope = 0;
    const xMin = Math.max(x - deltaValue, currentFunc.domain.min);
    const xMax = Math.min(x + deltaValue, currentFunc.domain.max);
    
    // Test boundary points first (x-delta and x+delta)
    const boundaryPoints = [xMin, xMax];
    for (const testY of boundaryPoints) {
      const testFy = currentFunc.f(testY);
      if (testFy !== null && fx !== null && testY !== x) {
        const slope = Math.abs((testFy - fx) / (testY - x));
        maxSlope = Math.max(maxSlope, slope);
      }
    }
    
    // Test interior points
    for (let i = 1; i < numSamples; i++) {
      const testY = xMin + (i / numSamples) * (xMax - xMin);
      const testFy = currentFunc.f(testY);
      
      if (testFy !== null && fx !== null && testY !== x) {
        const slope = Math.abs((testFy - fx) / (testY - x));
        maxSlope = Math.max(maxSlope, slope);
      }
    }
    
    return maxSlope;
  }, [x, deltaValue, selectedFunction, fx]);

  const effectiveL = autoL ? calculateMinL : LValue;

  // Check if Lipschitz condition is satisfied
  const conditionSatisfied = actualSlope <= effectiveL;

  // Check if y is within the Lipschitz cone
  const isInCone = Math.abs(fy - fx) <= effectiveL * Math.abs(y - x);

  // Generate function plot data
  const generateFunctionPlot = () => {
    const points = 500;
    const xData = [];
    const yData = [];
    
    if (showOnlyRadius) {
      // Show only within radius range
      const xMin = Math.max(x - deltaValue * 1.5, currentFunc.domain.min);
      const xMax = Math.min(x + deltaValue * 1.5, currentFunc.domain.max);
      
      for (let i = 0; i <= points; i++) {
        const xVal = xMin + (i / points) * (xMax - xMin);
        const yVal = currentFunc.f(xVal);
        if (yVal !== null) {
          xData.push(xVal);
          yData.push(yVal);
        }
      }
    } else {
      // Show full domain
      for (let i = 0; i <= points; i++) {
        const xVal = currentFunc.domain.min + (i / points) * (currentFunc.domain.max - currentFunc.domain.min);
        const yVal = currentFunc.f(xVal);
        if (yVal !== null) {
          xData.push(xVal);
          yData.push(yVal);
        }
      }
    }
    
    return { x: xData, y: yData };
  };

  // Generate Lipschitz cone lines
  const generateConeLines = () => {
    const xMin = Math.max(x - deltaValue * 1.5, currentFunc.domain.min);
    const xMax = Math.min(x + deltaValue * 1.5, currentFunc.domain.max);
    
    const upperLine = {
      x: [xMin, xMax],
      y: [fx + effectiveL * (xMin - x), fx + effectiveL * (xMax - x)]
    };
    
    const lowerLine = {
      x: [xMin, xMax],
      y: [fx - effectiveL * (xMin - x), fx - effectiveL * (xMax - x)]
    };
    
    return { upperLine, lowerLine };
  };

  const funcPlot = generateFunctionPlot();
  const { upperLine, lowerLine } = generateConeLines();

  // Interval bounds
  const xMin = Math.max(x - deltaValue, currentFunc.domain.min);
  const xMax = Math.min(x + deltaValue, currentFunc.domain.max);

  // Create vertical region for interval highlight
  const yAxisMin = Math.min(...funcPlot.y) - 1;
  const yAxisMax = Math.max(...funcPlot.y) + 1;

  // Generate Lipschitz cone filled region
  const generateConeRegion = () => {
    const numPoints = 50;
    const xVals = [];
    const upperY = [];
    const lowerY = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const xVal = xMin + (i / numPoints) * (xMax - xMin);
      xVals.push(xVal);
      upperY.push(fx + effectiveL * (xVal - x));
      lowerY.push(fx - effectiveL * (xVal - x));
    }
    
    return {
      x: [...xVals, ...xVals.slice().reverse()],
      y: [...upperY, ...lowerY.slice().reverse()]
    };
  };

  const coneRegion = generateConeRegion();

  const plotData = [
    // Lipschitz cone filled region
    {
      x: coneRegion.x,
      y: coneRegion.y,
      fill: 'toself',
      fillcolor: 'rgba(0, 255, 0, 0.1)',
      line: { width: 0 },
      mode: 'lines',
      name: 'Lipschitz Cone Region',
      hoverinfo: 'name',
      showlegend: true
    },
    // Interval highlight
    {
      x: [xMin, xMax, xMax, xMin, xMin],
      y: [yAxisMin, yAxisMin, yAxisMax, yAxisMax, yAxisMin],
      fill: 'toself',
      fillcolor: 'rgba(200, 200, 200, 0.2)',
      line: { width: 0 },
      mode: 'lines',
      name: 'Interval [x-δ, x+δ]',
      hoverinfo: 'name',
      showlegend: true
    },
    // Function plot
    {
      x: funcPlot.x,
      y: funcPlot.y,
      mode: 'lines',
      line: { color: 'black', width: 3 },
      name: `f(x) = ${currentFunc.name}`,
      hoverinfo: 'name'
    },
    // Upper Lipschitz cone line
    {
      x: upperLine.x,
      y: upperLine.y,
      mode: 'lines',
      line: { color: 'red', width: 2, dash: 'dash' },
      name: `Slope +L (${effectiveL.toFixed(2)})`,
      hoverinfo: 'name'
    },
    // Lower Lipschitz cone line
    {
      x: lowerLine.x,
      y: lowerLine.y,
      mode: 'lines',
      line: { color: 'blue', width: 2, dash: 'dash' },
      name: `Slope -L (${(-effectiveL).toFixed(2)})`,
      hoverinfo: 'name'
    },
    // Point (x, f(x))
    {
      x: [x],
      y: [fx],
      mode: 'markers',
      marker: { color: 'purple', size: 12, symbol: 'circle' },
      name: '(x, f(x))',
      hovertemplate: `x: ${x.toFixed(2)}<br>f(x): ${fx.toFixed(2)}<extra></extra>`
    },
    // Point (y, f(y))
    {
      x: [y],
      y: [fy],
      mode: 'markers',
      marker: { 
        color: isInCone ? 'green' : 'red', 
        size: 12, 
        symbol: 'circle',
        line: { color: 'white', width: 2 }
      },
      name: '(y, f(y))',
      hovertemplate: `y: ${y.toFixed(2)}<br>f(y): ${fy.toFixed(2)}<extra></extra>`
    },
    // Connecting line
    {
      x: [x, y],
      y: [fx, fy],
      mode: 'lines',
      line: { color: isInCone ? 'green' : 'red', width: 2 },
      name: 'Connection',
      hoverinfo: 'skip',
      showlegend: false
    },
     // Right triangle
     {
       x: [x, y, y, x],
       y: [fx, fx, fy, fx],
       mode: 'lines',
       line: { color: 'gray', width: 1, dash: 'dot' },
       name: 'Right Triangle',
       hoverinfo: 'skip',
       showlegend: false
     },
     // Delta length text (at bottom of y-axis)
     {
       x: [x],
       y: [Math.min(...funcPlot.y) + deltaValue * 0.05],
       mode: 'text',
       text: [`δ = ${deltaValue.toFixed(3)}`],
       textfont: { color: 'purple', size: 12 },
       hoverinfo: 'skip',
       showlegend: false
     },
     // L|y-x| arrow indicator (from f(x) to slope line)
     {
       x: [y, y],
       y: [fx, fx + effectiveL * Math.abs(y - x)],
       mode: 'lines',
       line: { color: 'orange', width: 2 },
       name: 'L|y-x| arrow',
       hoverinfo: 'skip',
       showlegend: false
     },
     // L|y-x| arrow head (upward)
     {
       x: [y - deltaValue * 0.02, y, y + deltaValue * 0.02],
       y: [fx + effectiveL * Math.abs(y - x) - deltaValue * 0.02, fx + effectiveL * Math.abs(y - x), fx + effectiveL * Math.abs(y - x) - deltaValue * 0.02],
       mode: 'lines',
       line: { color: 'orange', width: 2 },
       hoverinfo: 'skip',
       showlegend: false
     },
     // L|y-x| length text (left aligned)
     {
       x: [y + deltaValue * 0.05],
       y: [fx + effectiveL * Math.abs(y - x) / 2],
       mode: 'text',
       text: [`L|y-x| = ${(effectiveL * Math.abs(y - x)).toFixed(3)}`],
       textfont: { color: 'orange', size: 12 },
       textposition: 'middle right',
       hoverinfo: 'skip',
       showlegend: false
     }
  ];

  // Calculate proper axis ranges based on actual data
  const getAxisRanges = () => {
    if (showOnlyRadius) {
      // X-axis: include y if it's further than radius
      const radiusXMin = Math.max(x - deltaValue * 1.5, currentFunc.domain.min);
      const radiusXMax = Math.min(x + deltaValue * 1.5, currentFunc.domain.max);
      const xMin = Math.min(radiusXMin, y);
      const xMax = Math.max(radiusXMax, y);
      
      // Y-axis: include slope if it's higher than function values
      const funcYMin = Math.min(...funcPlot.y);
      const funcYMax = Math.max(...funcPlot.y);
      const slopeYMax = fx + effectiveL * Math.abs(y - x);
      const yMin = Math.min(funcYMin, fx);
      const yMax = Math.max(funcYMax, slopeYMax);
      
      const xMargin = deltaValue * 0.1;
      const yRange = yMax - yMin;
      const yMargin = yRange * 0.1;  // y축 range의 10%
      return {
        x: [xMin - xMargin, xMax + xMargin],
        y: [yMin - yMargin, yMax + yMargin]
      };
    } else {
      return {
        x: [currentFunc.domain.min - 0.5, currentFunc.domain.max + 0.5],
        y: 'auto'
      };
    }
  };

  const axisRanges = getAxisRanges();

  const layout = {
    width: 1200,
    height: 700,
    xaxis: { 
      title: 'x',
      zeroline: true,
      range: axisRanges.x
    },
    yaxis: { 
      title: 'f(x)',
      zeroline: true,
      range: axisRanges.y
    },
    showlegend: true,
    legend: {
      x: 1.05,
      y: 1
    },
    hovermode: 'closest',
    title: `Lemma 2.70: Local Lipschitz Continuity - ${currentFunc.name} (${currentFunc.convex ? 'Convex' : 'Non-convex'})`
  };

  return (
    <div className="lemma-container">
      <Link to="/" className="back-button">
        ← Back
      </Link>
      <div className="lemma-header">
        <h2>Lemma 2.70: Local Lipschitz Continuity of Convex Functions</h2>
        <div className="lemma-statement">
          <p>
            <strong>Let</strong> <InlineMath math="f : \mathbb{R}^n \to \mathbb{R}" /> be a convex function.
          </p>
          <p>
            <strong>For every</strong> <InlineMath math="x \in \text{int dom } f" /> there exist <InlineMath math="\delta > 0" /> and <InlineMath math="L" /> such that
          </p>
          <BlockMath math="|f(y) - f(x)| \leq L \|y - x\| \quad \text{whenever} \quad \|y - x\| < \delta." />
        </div>
      </div>

      {/* Real-time calculations display */}
      <div className={`calculations ${conditionSatisfied ? 'satisfied' : 'violated'}`}>
         <div className="calc-row">
           <span><strong>Current Values:</strong></span>
           <span>x = {x.toFixed(2)}</span>
           <span>δ = {deltaValue.toFixed(4)}</span>
           <span>y = {y.toFixed(2)}</span>
         </div>
        <div className="calc-row">
          <span><strong>Actual Slope:</strong> |f(y) - f(x)| / |y - x| = {actualSlope.toFixed(4)}</span>
          <span><strong>Lipschitz L:</strong> {effectiveL.toFixed(4)}</span>
        </div>
         <div className="calc-row">
           <span className="condition-check">
             {conditionSatisfied ? '✅ Inequality satisfied' : '❌ Inequality violated'}
           </span>
           <span className="distance-check">
             Distance: |y - x| = {Math.abs(y - x).toFixed(4)} {Math.abs(y - x) < deltaValue ? '< δ ✓' : '≥ δ ✗'}
             {Math.abs(y - x) < deltaValue && conditionSatisfied ? ' → Lipschitz condition satisfied' : ''}
           </span>
        </div>
      </div>

      <div className="controls">
        <div className="control-group">
          <label>Function:</label>
          <select 
            value={selectedFunction} 
            onChange={(e) => setSelectedFunction(e.target.value)}
            className="function-select"
          >
            <optgroup label="Convex Functions">
              <option value="x2">x²</option>
              <option value="exp">e^x</option>
              <option value="neglog">-log(x) (x &gt; 0)</option>
              <option value="abs">|x|</option>
              <option value="relu">max(0,x)</option>
            </optgroup>
             <optgroup label="Non-convex Functions">
               <option value="x3">x³</option>
               <option value="sin">sin(x)</option>
               <option value="negx2">-x²</option>
               <option value="x23">x^(2/3)</option>
             </optgroup>
             <optgroup label="Additional Functions">
               <option value="sqrtabs">√|x|</option>
               <option value="x2sin1x">x²sin(1/x)</option>
               <option value="logx">log(x)</option>
               <option value="sqrtx">√x</option>
             </optgroup>
          </select>
          <span className={`function-type ${currentFunc.convex ? 'convex' : 'non-convex'}`}>
            {currentFunc.convex ? 'CONVEX' : 'NON-CONVEX'}
          </span>
        </div>

         <div className="control-group">
           <label>Center Point x</label>
           <div className="value-display">{x.toFixed(2)}</div>
           <input 
             type="number" 
             min={currentFunc.domain.min} 
             max={currentFunc.domain.max} 
             step="0.01"
             value={x}
             onChange={(e) => {
               const newX = parseFloat(e.target.value);
               if (!isNaN(newX) && newX >= currentFunc.domain.min && newX <= currentFunc.domain.max) {
                 setX(newX);
               }
             }}
             className="number-input"
           />
           <input 
             type="range" 
             min={currentFunc.domain.min} 
             max={currentFunc.domain.max} 
             step="0.01"
             value={x}
             onChange={(e) => setX(parseFloat(e.target.value))}
             className="slider"
           />
         </div>

         <div className="control-group">
           <label>Radius δ</label>
           <div className="value-display">{deltaValue.toFixed(4)}</div>
           <div></div>
           <input 
             type="range" 
             min="0" 
             max="1" 
             step="0.01"
             value={delta}
             onChange={(e) => {
               setDelta(parseFloat(e.target.value));
             }}
             className="slider"
           />
         </div>

         <div className="control-group">
           <label>Point y</label>
           <div className="value-display">{y.toFixed(2)}</div>
           <input 
             type="number" 
             min={Math.max(x - deltaValue * 2, currentFunc.domain.min)} 
             max={Math.min(x + deltaValue * 2, currentFunc.domain.max)} 
             step={deltaValue * 0.01}
             value={y}
             onChange={(e) => {
               const newY = parseFloat(e.target.value);
               const yMin = Math.max(x - deltaValue * 2, currentFunc.domain.min);
               const yMax = Math.min(x + deltaValue * 2, currentFunc.domain.max);
               if (!isNaN(newY) && newY >= yMin && newY <= yMax) {
                 setY(newY);
               }
             }}
             className="number-input"
           />
           <input 
             type="range" 
             min={Math.max(x - deltaValue * 2, currentFunc.domain.min)} 
             max={Math.min(x + deltaValue * 2, currentFunc.domain.max)} 
             step={deltaValue * 0.01}
             value={y}
             onChange={(e) => setY(parseFloat(e.target.value))}
             className="slider"
           />
         </div>

         <div className="control-group">
           <label>Lipschitz Constant L</label>
           <div className="value-display">{effectiveL.toFixed(4)}</div>
           <div className="auto-l-toggle">
             <input 
               type="checkbox" 
               checked={autoL}
               onChange={(e) => setAutoL(e.target.checked)}
             />
             Auto-calculate
           </div>
           {!autoL && (
             <input 
               type="range" 
               min="0" 
               max="1" 
               step="0.01"
               value={L}
               onChange={(e) => {
                 setL(parseFloat(e.target.value));
               }}
               className="slider"
             />
           )}
           {autoL && (
             <div className="auto-l-info">
               <div>Minimum L for this interval: {calculateMinL.toFixed(4)}</div>
               <div>Current L: {effectiveL.toFixed(4)} (exact minimum)</div>
             </div>
           )}
         </div>

         <div className="control-group">
           <label>
             <input 
               type="checkbox" 
               checked={showOnlyRadius}
               onChange={(e) => setShowOnlyRadius(e.target.checked)}
             />
             Show only radius region (x ± 1.5δ)
           </label>
         </div>

         <div className="control-group">
           <label>
             <input 
               type="checkbox" 
               checked={useLogScale}
               onChange={(e) => setUseLogScale(e.target.checked)}
             />
             Use logarithmic scale for δ and L (0.01 to 100)
           </label>
         </div>
      </div>

      <div className="plot-wrapper">
        <Plot
          data={plotData}
          layout={layout}
          config={{ responsive: true }}
        />
      </div>

       <div className="insights">
         <h3>Insights:</h3>
         <ul>

         </ul>
       </div>
    </div>
  );
}

export default Lemma270;

