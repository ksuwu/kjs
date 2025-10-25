import React from 'react';

interface WordProps {
    word: string;
    isActive: boolean;
}

const Word: React.FC<WordProps> = ({ word, isActive }) => {
    return (
        <span className={isActive ? 'active-word' : 'word'}>
            {word}
        </span>
    );
};

export default Word;