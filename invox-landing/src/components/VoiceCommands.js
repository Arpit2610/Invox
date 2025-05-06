import React from 'react';

const VoiceCommands = () => {
    const startListening = () => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            if (command.includes('generate invoice')) {
                // Navigate to invoice generation
            } else if (command.includes('show dashboard')) {
                // Navigate to dashboard
            }
        };
        recognition.start();
    };

    return (
        <button onClick={startListening}>
            🎤 Voice Commands
        </button>
    );
}; 