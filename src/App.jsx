import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [disp, setDisp] = useState('0');
  const [formula, setFormula] = useState('');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForNext, setWaitingForNext] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleDigit = (digit) => {
    if (waitingForNext) {
      setDisp(String(digit));
      setWaitingForNext(false);
    } else {
      if (digit === '.' && disp.includes('.')) return;
      setDisp(disp === '0' && digit !== '.' ? String(digit) : disp + digit);
    }
  };

  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(disp);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
      setFormula(`${inputValue} ${nextOperator}`);
    } else if (operator && !waitingForNext) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisp(String(result));
      setFirstOperand(result);
      setFormula(`${result} ${nextOperator}`);
    } else {
      setFormula(`${firstOperand} ${nextOperator}`);
    }

    setWaitingForNext(true);
    setOperator(nextOperator);
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '✕': return a * b;
      case '÷': return b !== 0 ? a / b : 'Error';
      default: return b;
    }
  };

  const handleEquals = () => {
    if (firstOperand === null || operator === null) return;

    const inputValue = parseFloat(disp);
    const result = calculate(firstOperand, inputValue, operator);

    const calcString = `${firstOperand} ${operator} ${inputValue} = ${result}`;
    setHistory(prev => [calcString, ...prev]);

    setDisp(String(result));
    setFormula(`${firstOperand} ${operator} ${inputValue} =`);
    setFirstOperand(null);
    setOperator(null);
    setWaitingForNext(true);
  };

  const handleClear = () => {
    setDisp('0');
    setFormula('');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForNext(false);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') handleDigit(parseInt(e.key));
      if (e.key === '.') handleDigit('.');
      if (e.key === '+') handleOperator('+');
      if (e.key === '-') handleOperator('-');
      if (e.key === '*') handleOperator('✕');
      if (e.key === '/') handleOperator('÷');
      if (e.key === 'Enter' || e.key === '=') handleEquals();
      if (e.key === 'Escape') handleClear();
      if (e.key === 'Backspace') {
        setDisp(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disp, firstOperand, operator, waitingForNext]);

  return (
    <div className="app-container">
      <div className="calc-card">
        {/* Header */}
        <div className="calc-header">
          <div className="title-group">
            <h1 className="header-title">Calculator</h1>
            <p className="header-subtitle">Shanreel Evangelista - WMD3A</p>
          </div>
          
          <button 
            className={`history-btn ${showHistory ? 'active' : ''}`}
            onClick={() => setShowHistory(!showHistory)}
            title="History"
          >
            📜 History
          </button>
        </div>

        {/* Display Area */}
        <div className="display-box">
          <div className="formula-text">{formula}</div>
          <div className="main-digit">{disp}</div>
        </div>

        {/* Keypad */}
        <div className="keypad-grid">
          <button className="btn btn-action" onClick={handleClear}>CLR</button>
          <button className="btn btn-action" onClick={() => setDisp(d => String(-parseFloat(d)))}>±</button>
          <button className="btn btn-action" onClick={() => setDisp(d => String(parseFloat(d) / 100))}>%</button>
          <button className={`btn btn-op ${operator === '÷' ? 'active-op' : ''}`} onClick={() => handleOperator('÷')}>÷</button>

          <button className="btn" onClick={() => handleDigit(7)}>7</button>
          <button className="btn" onClick={() => handleDigit(8)}>8</button>
          <button className="btn" onClick={() => handleDigit(9)}>9</button>
          <button className={`btn btn-op ${operator === '✕' ? 'active-op' : ''}`} onClick={() => handleOperator('✕')}>✕</button>

          <button className="btn" onClick={() => handleDigit(4)}>4</button>
          <button className="btn" onClick={() => handleDigit(5)}>5</button>
          <button className="btn" onClick={() => handleDigit(6)}>6</button>
          <button className={`btn btn-op ${operator === '-' ? 'active-op' : ''}`} onClick={() => handleOperator('-')}>-</button>

          <button className="btn" onClick={() => handleDigit(1)}>1</button>
          <button className="btn" onClick={() => handleDigit(2)}>2</button>
          <button className="btn" onClick={() => handleDigit(3)}>3</button>
          <button className={`btn btn-op ${operator === '+' ? 'active-op' : ''}`} onClick={() => handleOperator('+')}>+</button>

          <button className="btn btn-zero" onClick={() => handleDigit(0)}>0</button>
          <button className="btn" onClick={() => handleDigit('.')}>.</button>
          <button className="btn btn-equals" onClick={handleEquals}>=</button>
        </div>

        {/* History Drawer */}
        {showHistory && (
          <div className="history-drawer">
            <div className="history-header">
              <span>Calculation Tape</span>
              <button className="clear-hist" onClick={() => setHistory([])}>Clear</button>
            </div>
            <div className="history-list">
              {history.length === 0 ? (
                <p className="empty-hist">No past calculations</p>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} className="history-item">{item}</div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}