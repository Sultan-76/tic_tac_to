let fields = [null, null, null, null, null, null, null, null, null];

function init() {
  render();
}

function render() {
  // HTML-Code für die Tabelle
  let tableHTML = "<table>";
  for (let i = 0; i < 3; i++) {
    tableHTML += "<tr>";
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      let symbol = "";
      if (fields[index] === "circle") {
        symbol = generateCircleSVG();
      } else if (fields[index] === "cross") {
        symbol = generateCrossSVG();
      }
      tableHTML += `<td onclick="handleClick(${index})">${symbol}</td>`;
    }
    tableHTML += "</tr>";
  }
  tableHTML += "</table>";

  // HTML-Code in den "content"-Container einfügen
  document.getElementById("content").innerHTML = tableHTML;

  checkGameEnd();
}

function handleClick(index) {
  if (fields[index] === null) {
    const currentPlayer = getCurrentPlayer();
    fields[index] = currentPlayer;
    const symbol = currentPlayer === "circle" ? generateCircleSVG() : generateCrossSVG();
    document.getElementById("content").querySelectorAll("td")[index].innerHTML = symbol;
    document
      .getElementById("content")
      .querySelectorAll("td")
      [index].removeAttribute("onclick");
    checkGameEnd();
  }
}

function getCurrentPlayer() {
  const circleCount = fields.filter((field) => field === "circle").length;
  const crossCount = fields.filter((field) => field === "cross").length;
  return circleCount > crossCount ? "cross" : "circle";
}

function checkGameEnd() {
  const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left to bottom-right
    [2, 4, 6], // Diagonal from top-right to bottom-left
  ];

  checkWinningCombinations(winningCombinations);
  checkDraw();
}

function checkWinningCombinations(winningCombinations) {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

    if (
      fields[a] !== null &&
      fields[a] === fields[b] &&
      fields[a] === fields[c]
    ) {
      drawWinningLine(a, b, c);
      setTimeout(() => showResult(fields[a]), 600);
      return;
    }
  }
}

function checkDraw() {
  if (fields.every((field) => field !== null))
    setTimeout(() => {
      showResult(false);
    }, 400);
}

function showResult(winner) {
  const contentDiv = document.getElementById("content");
  const resultDiv = document.createElement("div");
  const image = document.createElement("img");

  image.src = "img/game_over.png";
  resultDiv.innerHTML = winner ? "Gewonnen!" : "Kein Gewinner!";
  resultDiv.appendChild(image);
  contentDiv.innerHTML = "";
  contentDiv.appendChild(resultDiv);
}

function drawWinningLine(a, b, c) {
  const tdElements = document.getElementsByTagName("td");
  const [tdA, tdB, tdC] = [tdElements[a], tdElements[b], tdElements[c]];
  const [rectA, rectB, rectC] = [
    tdA.getBoundingClientRect(),
    tdB.getBoundingClientRect(),
    tdC.getBoundingClientRect(),
  ];

  const line = document.createElement("div");
  line.className = "winning-line";

  const [startX, startY] = [rectA.left + rectA.width / 2,rectA.top + rectA.height / 2,];
  const [endX, endY] = [rectC.left + rectC.width / 2,rectC.top + rectC.height / 2,];

  setLineStyles(line, startX, startY, endX, endY);

  tdA.parentNode.parentNode.appendChild(line);
}

function setLineStyles(line, startX, startY, endX, endY) {
  Object.assign(line.style, {
    left: startX + "px",
    top: startY + "px",
    width:
      Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) + "px",
    transformOrigin: "0 0",
    transform: "rotate(" + Math.atan2(endY - startY, endX - startX) + "rad)",
  });
}

function resetGame() {
  const currentPlayer = getCurrentPlayer();
  fields = [null, null, null, null, null, null, null, null, null];
  render();
}

function generateCrossSVG() {
    const fireColors = ["#ffd729", "#ff8917", "#ff9c1b", "#ffb621", "#ffe92d"];
    const svgCode = `
        <svg width="70" height="70">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              ${fireColors.map((color, index) => `<stop offset="${index * 25}%" style="stop-color: ${color}; stop-opacity: 1" />`).join('')}
            </linearGradient>
            <mask id="mask">
              <rect x="15" y="15" width="40" height="40" fill="white" />
            </mask>
          </defs>
          <g stroke="url(#grad)" stroke-width="5">
            <line x1="15" y1="15" x2="55" y2="55" stroke-dasharray="0 71.1">
              <animate attributeName="stroke-dasharray" attributeType="XML" from="0 71.1" to="71.1 0" dur="0.3s" fill="freeze" />
            </line>
            <line x1="55" y1="15" x2="15" y2="55" stroke-dasharray="0 71.1">
              <animate attributeName="stroke-dasharray" attributeType="XML" from="0 71.1" to="71.1 0" dur="0.3s" fill="freeze" />
            </line>
          </g>
        </svg>
      `;
  
    return svgCode;
  }
  
  

  function generateCircleSVG() {
    const svgCode = `
        <svg width="70" height="70">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color: #ffd729; stop-opacity: 1" />
              <stop offset="25%" style="stop-color: #ff8917; stop-opacity: 1" />
              <stop offset="50%" style="stop-color: #ff9c1b; stop-opacity: 1" />
              <stop offset="75%" style="stop-color: #ffb621; stop-opacity: 1" />
              <stop offset="100%" style="stop-color: #ffe92d; stop-opacity: 1" />
            </linearGradient>
            <mask id="mask">
              <circle cx="35" cy="35" r="30" fill="white" />
            </mask>
          </defs>
          <circle cx="35" cy="35" r="30" fill="none" stroke="url(#grad)" stroke-width="5" stroke-dasharray="0 188.5">
            <animate attributeName="stroke-dasharray" attributeType="XML" from="0 188.5" to="188.5 0" dur="0.3s" fill="freeze" />
          </circle>
        </svg>
      `;
  
    return svgCode;
  }
  
