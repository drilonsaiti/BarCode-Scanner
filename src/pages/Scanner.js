import React, { Component } from 'react';
import Quagga from 'quagga';
import successSound from '../sounds/Barcode-scanner-beep-sound.mp3'; // Replace with your sound file path
import errorSound from '../sounds/Error-sound.mp3';
class Scanner extends Component {
    audioRef = React.createRef(); // Ref for the audio element
    errorAudioRef = React.createRef();
    cooldown = false; // Flag to track cooldown state
    cooldownTimeout = null; // Timeout reference for cooldown


    componentDidMount() {
        this.startScanning();
    }

    componentWillUnmount() {
        this.stopScanning();
    }

    startScanning = () => {
        Quagga.init(
            {
                inputStream: {
                    type: 'LiveStream',
                    constraints: {
                        width: 640,
                        height: 320,
                        facingMode: 'environment',
                    },
                },
                locator: {
                    halfSample: true,
                    patchSize: 'large',
                },
                numOfWorkers: 4,
                decoder: {
                    readers: ['ean_reader'],
                },
                locate: true,
            },
            (err) => {
                if (err) {
                    return console.log(err);
                }
                Quagga.start();
            }
        );
        Quagga.onDetected(this.onDetected);
    };

    stopScanning = () => {
        Quagga.offDetected(this.onDetected);
        Quagga.stop();
    };

    onDetected = (result) => {
        if (!this.cooldown) {
            const productFound = this.props.onDetected(result);
            console.log("PROUCT");
            console.log(productFound);
            if (productFound) {
                this.playSound(this.audioRef); // Play success sound
            } else {
                this.playSound(this.errorAudioRef); // Play error sound
            }
            this.startCooldown();
        }
    };

    playSound = (audioElement) => {
        audioElement.current.play();
    };

    startCooldown = () => {
        this.cooldown = true;

        // Wait for 1 second (adjust the delay as needed)
        this.cooldownTimeout = setTimeout(() => {
            this.cooldown = false;
        }, 1000);
    };

    render() {
        return (
            <div>
                <div id="interactive" className="viewport" />
                <audio ref={this.audioRef} src={successSound} />
                <audio ref={this.errorAudioRef} src={errorSound} />
            </div>
        );
    }
}

export default Scanner;
