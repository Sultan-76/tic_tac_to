let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ];
  
  function init() {
    render();
  };
  
  function render() {
    // HTML-Code für die Tabelle
    let tableHTML = '<table>';
    for (let i = 0; i < 3; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < 3; j++) {
        const index = i * 3 + j;
        let symbol = '';
        if (fields[index] === 'circle') {
          symbol = generateCircleSVG();
        } else if (fields[index] === 'cross') {
          symbol = generateCrossSVG();
        }
        tableHTML += `<td onclick="handleClick(${index})">${symbol}</td>`;
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</table>';
  
    // HTML-Code in den "content"-Container einfügen
    document.getElementById('content').innerHTML = tableHTML;
  
    checkGameEnd();
  }
  
  function handleClick(index) {
    if (fields[index] === null) {
      const currentPlayer = getCurrentPlayer();
      fields[index] = currentPlayer;
      const symbol = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
      document.getElementById('content').querySelectorAll('td')[index].innerHTML = symbol;
      document.getElementById('content').querySelectorAll('td')[index].removeAttribute('onclick');
      checkGameEnd();
    }
  }
  
  function getCurrentPlayer() {
    const circleCount = fields.filter(field => field === 'circle').length;
    const crossCount = fields.filter(field => field === 'cross').length;
    return circleCount > crossCount ? 'cross' : 'circle';
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
      [2, 4, 6]  // Diagonal from top-right to bottom-left
    ];
  
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        
        if (fields[a] !== null && fields[a] === fields[b] && fields[a] === fields[c])  {
          drawWinningLine(a, b, c);
          setTimeout (() =>
          showWinner(fields[a]), 600);
          return;
        }
      }
    
      if (fields.every(field => field !== null)) setTimeout (() => {
        showNoWinner();
      }, 400);
  }
  
  function drawWinningLine(a, b, c) {
    const table = document.getElementsByTagName('table')[0];
    const tdElements = table.getElementsByTagName('td');
    const tdA = tdElements[a];
    const tdB = tdElements[b];
    const tdC = tdElements[c];
  
    const rectA = tdA.getBoundingClientRect();
    const rectB = tdB.getBoundingClientRect();
    const rectC = tdC.getBoundingClientRect();
  
    const line = document.createElement('div');
    line.className = 'winning-line';
  
    const startX = rectA.left + rectA.width / 2;
    const startY = rectA.top + rectA.height / 2;
    const endX = rectC.left + rectC.width / 2;
    const endY = rectC.top + rectC.height / 2;
  
    line.style.left = startX + 'px';
    line.style.top = startY + 'px';
    line.style.width = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) + 'px';
    line.style.transformOrigin = '0 0';
    line.style.transform = 'rotate(' + Math.atan2(endY - startY, endX - startX) + 'rad)';
  
    table.parentNode.appendChild(line);
  }
  
  function showWinner(winner) {
    const contentDiv = document.getElementById('content');
    const winnerDiv = document.createElement('div');
    const image = document.createElement('img');

    image.src = 'img/game_over.png';  
    winnerDiv.innerText = 'Gewonen!';
    winnerDiv.appendChild(image);
    contentDiv.innerHTML = '';
    contentDiv.appendChild(winnerDiv);
  }
  
  function showNoWinner() {
    const contentDiv = document.getElementById('content');
    const noWinnerDiv = document.createElement('div');
    const image = document.createElement('img');
    
    image.src = 'img/game_over.png'; 
    
    
    noWinnerDiv.innerText = 'Kein Gewinner!';
    contentDiv.innerHTML = '';
    noWinnerDiv.appendChild(image);
    contentDiv.appendChild(noWinnerDiv);
  }
 
  function resetGame() {
    const currentPlayer = getCurrentPlayer();
    fields = [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];
    render();
  }

  function generateCrossSVG() {
    const svgCode = `
      <svg width="70" height="70">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color: #DAA520; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #DAA520; stop-opacity: 0" />
          </linearGradient>
          <mask id="mask">
            <rect x="15" y="15" width="40" height="40" fill="white" />
          </mask>
        </defs>
        <g stroke="#DAA520" stroke-width="5">
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
            <stop offset="0%" style="stop-color: #00B0EF; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #00B0EF; stop-opacity: 0" />
          </linearGradient>
          <mask id="mask">
            <circle cx="35" cy="35" r="30" fill="white" />
          </mask>
        </defs>
        <circle cx="35" cy="35" r="30" fill="none" stroke="#00B0EF" stroke-width="5" stroke-dasharray="0 188.5">
          <animate attributeName="stroke-dasharray" attributeType="XML" from="0 188.5" to="188.5 0" dur="0.3s" fill="freeze" />
        </circle>
      </svg>
    `;
  
    return svgCode;
  }

 
  
  