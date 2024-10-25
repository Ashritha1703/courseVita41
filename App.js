import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3002'); // Updated port number

function App() {
    const [content, setContent] = useState('');
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);

    useEffect(() => {
        socket.on('updateContent', (updatedContent) => {
            setContent(updatedContent);
        });
        socket.on('updateStyleBold', (bold) => {
            setBold(bold);
        });
        socket.on('updateStyleItalic', (italic) => {
            setItalic(italic);
        });
        socket.on('updateStyleUnderline', (underline) => {
            setUnderline(underline);
        });

        return () => {
            socket.off('updateContent');
            socket.off('updateStyleBold');
            socket.off('updateStyleItalic');
            socket.off('updateStyleUnderline');
        };
    }, []);

    const handleEdit = (event) => {
        const updatedContent = event.target.value;
        setContent(updatedContent);
        socket.emit('edit', updatedContent);
    };

    const handleBold = () => {
        const newBold = !bold;
        setBold(newBold);
        socket.emit('bold', newBold);
    };

    const handleItalic = () => {
        const newItalic = !italic;
        setItalic(newItalic);
        socket.emit('italic', newItalic);
    };

    const handleUnderline = () => {
        const newUnderline = !underline;
        setUnderline(newUnderline);
        socket.emit('underline', newUnderline);
    };

    return (
        <div className="App">
            <h1>Real-time Collaborative Editor</h1>
            <div className="toolbar">
                <button onClick={handleBold} className={`control-button ${bold ? 'active' : ''}`}>
                    Bold
                </button>
                <button onClick={handleItalic} className={`control-button ${italic ? 'active' : ''}`}>
                    Italic
                </button>
                <button onClick={handleUnderline} className={`control-button ${underline ? 'active' : ''}`}>
                    Underline
                </button>
            </div>
            <textarea
                className="editor"
                value={content}
                onChange={handleEdit}
                rows={10}
                cols={50}
                style={{
                    fontWeight: bold ? 'bold' : 'normal',
                    fontStyle: italic ? 'italic' : 'normal',
                    textDecoration: underline ? 'underline' : 'none'
                }}
            />
        </div>
    );
}

export default App;
