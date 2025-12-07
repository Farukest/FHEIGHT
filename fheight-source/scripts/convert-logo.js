const fs = require('fs');
const path = require('path');

// Read the SVG file
const svgPath = path.join(__dirname, '../app/resources/ui/brand_fheight.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Create an HTML file that can be opened in browser to save as PNG
const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>FHEIGHT Logo Generator</title>
  <style>
    body {
      background: #1a1a2e;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      font-family: Arial, sans-serif;
      color: white;
    }
    .logo-container {
      margin: 20px;
      padding: 20px;
      background: transparent;
    }
    canvas {
      display: block;
      margin: 10px auto;
      background: transparent;
    }
    .instructions {
      margin: 20px;
      padding: 20px;
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
      max-width: 600px;
    }
    button {
      padding: 10px 20px;
      margin: 5px;
      cursor: pointer;
      background: #00ffff;
      border: none;
      border-radius: 4px;
      font-size: 16px;
    }
    button:hover {
      background: #00cccc;
    }
  </style>
</head>
<body>
  <h1>FHEIGHT Logo Generator</h1>

  <div class="logo-container">
    <h3>brand_fheight.png (387x84)</h3>
    <canvas id="canvas1" width="387" height="84"></canvas>
    <button onclick="downloadCanvas('canvas1', 'brand_fheight.png')">Download brand_fheight.png</button>
  </div>

  <div class="logo-container">
    <h3>brand_fheight@2x.png (774x168)</h3>
    <canvas id="canvas2" width="774" height="168"></canvas>
    <button onclick="downloadCanvas('canvas2', 'brand_fheight@2x.png')">Download brand_fheight@2x.png</button>
  </div>

  <div class="logo-container">
    <h3>brand_fheight_preloading.png (387x84)</h3>
    <canvas id="canvas3" width="387" height="84"></canvas>
    <button onclick="downloadCanvas('canvas3', 'brand_fheight_preloading.png')">Download brand_fheight_preloading.png</button>
  </div>

  <div class="logo-container">
    <h3>brand_fheight_preloading@2x.png (774x168)</h3>
    <canvas id="canvas4" width="774" height="168"></canvas>
    <button onclick="downloadCanvas('canvas4', 'brand_fheight_preloading@2x.png')">Download brand_fheight_preloading@2x.png</button>
  </div>

  <div class="instructions">
    <h3>Instructions:</h3>
    <ol>
      <li>Click each "Download" button to save the PNG files</li>
      <li>Copy the downloaded files to: <code>app/resources/ui/</code></li>
      <li>Run <code>npm run build</code> to rebuild the game</li>
    </ol>
  </div>

  <script>
    const svgString = \`${svgContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;

    function renderSVGToCanvas(canvasId, scale) {
      const canvas = document.getElementById(canvasId);
      const ctx = canvas.getContext('2d');

      const img = new Image();
      const blob = new Blob([svgString], {type: 'image/svg+xml'});
      const url = URL.createObjectURL(blob);

      img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }

    function downloadCanvas(canvasId, filename) {
      const canvas = document.getElementById(canvasId);
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    // Render all canvases
    renderSVGToCanvas('canvas1', 1);
    renderSVGToCanvas('canvas2', 2);
    renderSVGToCanvas('canvas3', 1);
    renderSVGToCanvas('canvas4', 2);
  </script>
</body>
</html>`;

// Write the HTML file
const htmlPath = path.join(__dirname, '../logo-generator.html');
fs.writeFileSync(htmlPath, htmlContent);

console.log('FHEIGHT Logo generator HTML created at:', htmlPath);
console.log('Open this file in a browser to download the PNG logos.');
