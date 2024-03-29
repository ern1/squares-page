import * as React from 'react';
import { SoundPlayer } from './SoundPlayer';
import './Grid.css';

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

class Square extends React.Component<{}, SquareState> {
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

interface GridState {
    width: number;
    height: number;
}

export class Grid extends React.Component<{}, GridState> {
    //private squares: Array<any> = [];
    static pressedSquares: Array<Square> = []; // Ska denna ligga här? Finns nog bättre sätt att göra det på.
    private tableCells: Array<any> = [];
    private soundPlayerRef = React.createRef<SoundPlayer>();
    
    constructor(props: {}) {
        super(props);
        this.state = {
            width: 0,
            height: 0
        };

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    fillGrid() {
        if(!this.tableCells.length) {
            // TODO: fixa så att det blir rätt storlek
            for (let i = 0; i < this.state.height / 80; i++){
                let squaresRow = [];
                let tableRow = [];

                for (let j = 0; j < this.state.width / 80; j++){
                    squaresRow.push(el(Square, {}));

                    tableRow.push(el('td', { 
                        key: i * Math.ceil(this.state.width / 40) + j,
                        style: { padding: '-100px' },
                    }, squaresRow[squaresRow.length -1]));
                }

                this.tableCells[i] = el('tr', { key: i * -1 }, tableRow)
            }
        }
    }

    // Spela melodi allt eftersom man markerar fler rutor. Klickar man på en spelas den noten högre och den rutan pulserar samtidigt som noten spelas etc. 
    async audioVisualAnimation() {
        // Play each note once
        if(Grid.pressedSquares.length > 0) {
            for(let sq of Grid.pressedSquares) {
                console.log("audioVisualAnimation: " + sq);
                if(this.soundPlayerRef.current) {
                    this.soundPlayerRef.current.playTestNote(); //temp
                    //this.soundPlayerRef.current.playNextNotes();
                }

                /* TODO - FIXA DETTA FÖRST:
                 * Vet inte om async/await behövs, verkar vara sleep som ej fungerar (kolla hur man kör sleep i typescript).
                 * Är nog även så att playNextNotes() krånglar i SoundPlayer-klassen, så kolla på den också nu.
                 * När jag fått min sleep att fungera som tänkt, test med playTestNote() först ovan, sen ändra till playNextNotes() när det fungerar. */
                await sq.pulse(3);
            }

            // Reset track in SoundPlayer
            if(this.soundPlayerRef.current)
                this.soundPlayerRef.current.resetTrack();
        }
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }
      
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
      
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {
        this.fillGrid();
        this.audioVisualAnimation(); // temp

        return (
            <div>
                <table className='grid' cellSpacing='0' cellPadding='0'>
                    <tbody>
                        {this.tableCells}
                    </tbody>
                </table>

                <div>
                    <SoundPlayer ref={this.soundPlayerRef} />
                </div>
            </div>
        )
    }
}
