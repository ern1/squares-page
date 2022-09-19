import * as React from 'react';
import { SoundPlayer } from './SoundPlayer';
import { Square } from './Square';
import './Grid.css';

const el = React.createElement;

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

interface GridState {
    width: number;
    height: number;
}

export class Grid extends React.Component<{}, GridState> {
    //private squares: Array<any> = [];
    static pressedSquares: Array<Square> = []; // Todo: Ska denna ligga här? Finns nog bättre sätt att göra det på.
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
