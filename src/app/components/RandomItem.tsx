import React, { useState, useEffect } from 'react';

const items: string[] = ["Where emotions meet humans!", "Where humans meet emotions!", "Open Source Everything", "que?", "eek"];

const getRandomItem = (arr: string[]): string => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

const RandomItem: React.FC = () => {
    const [randomItem, setRandomItem] = useState<string>('');

    useEffect(() => {
        setRandomItem(getRandomItem(items));
    }, []);

    return (
        <p>{randomItem}</p>
    );
}

export default RandomItem;