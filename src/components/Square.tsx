import * as React from 'react';
import { SoundPlayer } from './SoundPlayer';
import './Square.css';

const el = React.createElement;

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

interface SquareState {
    size: string;
    pressed: boolean;
    color: string;
    borderColor: string;
}

export class Square extends React.Component<{}, SquareState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            size: '4',
            pressed: false,
            color: '#fff',
            borderColor: '#fff',
        };
    }

    // TODO: (1) Gör inte på det sätt jag tänkte först här, borde finnas någon CSS-animation (istället
    //       för transition) för att få ett HTML-element att "pulsera" direkt. (Vill ju att dom som
    //       är större ska pulsera så dom blir ännu större.)
    //       ---> JAG GJORDE ÄVEN ETT "PROOF-OF-CONCEPT" SOM BORDE FUNGERA (se fil "pulse-animation_example" i root av detta projekt).
    //       Kolla även: https://css-tricks.com/controlling-css-animations-transitions-javascript/
    // TODO: (2) Skulle vara nice om jag typ har en bakgrund i body som skiftas lite varje gång denna metod körs?
    //       Har ju dock en vit border på rektanglarna nu (när dom är mindre), så det skulle då behöva ändras. Kan man göra border transparent istället för att göra den vit?
    pulse(animation_s: number) {
        console.log("pulse: " + this);

        // Temp
        this.setState({ pressed: false, borderColor: '#fff'});
        sleep(animation_s * 1000);
        this.setState({ pressed: true, borderColor: this.state.color});
    }

    // TODO: Gör detta i Grid-klassen istället så att man även kan ändra dom i närheten? (avvakta med detta, låter krävande..)
    // Set random color if not already pressed
    updateSquare() {
        if (!this.state.pressed) {
            this.setState({ color: '#' + Math.random().toString(16).substr(-6) })
        }
    }

    squarePressed() {
        if (!this.state.pressed) {
            this.setState({ pressed: true, borderColor: this.state.color});
            Grid.pressedSquares.push(this);
        }
        else {
            this.setState({ pressed: false, borderColor: '#fff'});
            Grid.pressedSquares = Grid.pressedSquares.filter(obj => obj !== this); // remove object from array
        }
    }

    render() {
        return el(
            'div',
            { 
                onClick: () => this.squarePressed(), 
                onMouseEnter: () => this.updateSquare(),
                style: {
                    backgroundColor: this.state.color,
                    border: '6px solid' + this.state.borderColor,
                    height: this.state.size+'em',
                    width: this.state.size+'em',
                    transition: '0.5s' } 
            },
            null
        );
    }
}