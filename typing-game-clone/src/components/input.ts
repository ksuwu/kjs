import React, { useState, useEffect } from 'react';

const Input = ({ currentWord, onCorrectInput, onGameOver }) => {
    const [inputValue, setInputValue] = useState('');
    const [isGameActive, setIsGameActive] = useState(true);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (!isGameActive) return;

            if (event.key === 'Backspace') {
                setInputValue(inputValue.slice(0, -1));
            } else if (event.key.length === 1) {
                setInputValue(inputValue + event.key);
            }

            if (inputValue + event.key === currentWord) {
                onCorrectInput();
                setInputValue('');
            }
        };

        window.addEventListener('keypress', handleKeyPress);

        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, [inputValue, currentWord, isGameActive, onCorrectInput]);

    useEffect(() => {
        if (!isGameActive) {
            onGameOver();
        }
    }, [isGameActive, onGameOver]);

    return (
        <div className="input-container">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={!isGameActive}
                placeholder="Type here..."
            />
        </div>
    );
};

export default Input;