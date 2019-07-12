import * as React from "react";
import { SoundPlayer } from './SoundPlayer';
import './Grid.css';

const el = React.createElement

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

    pulse(time: number) {
        this.setState({ pressed: false, borderColor: '#fff'});
        // sleep for time seconds
        this.setState({ pressed: true, borderColor: this.state.color});
    }

    // Set random color if not already pressed
    updateSquare() {
        if (!this.state.pressed) {
            this.setState({ color: '#' + Math.random().toString(16).substr(-6) })
        }
    }

    squarePressed() {
        if (!this.state.pressed)
            this.setState({ pressed: true, borderColor: this.state.color});
        else
            this.setState({ pressed: false, borderColor: '#fff'});
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

// TODO: Kör onMouseBlabla-event för alla Square, men gör det i Grid-klassen istället så att man kan ändra dom i närheten? Vänta lite med detta, kanske är lite för krävande.. 
// TODO: Spela melodi allt eftersom man eller rutor? Klickar man på en spelas den noten högre och den rutan pulserar samtidigt som noten spelas (vänta lite med det) etc. 
//       Lägg till alla rutor i en array som man klickat på, upprepa så många noter ifrån låten och låt de man klickat på pulsera.
//       Istället för en loop i en funktion i SoundPlayer-klassen så har jag currentNote så den vet vilken som ska spela här näst?
export class Grid extends React.Component<{}, GridState> {
    private squares: Array<any>;
    private tableCells: Array<any>;
    private soundPlayerRef = React.createRef<SoundPlayer>();
    
    constructor(props: {}) {
        super(props);
        this.state = {
            width: 0,
            height: 0
        };

        this.squares = [];
        this.tableCells = [];
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    fillGrid() {
        if(!this.tableCells.length) {
            // TODO: fixa så att det blir rätt storlek
            for (let i = 0; i < this.state.height / 80; i++){
                let tableRow = [];
                let squaresRow = [];

                for (let j = 0; j < this.state.width / 80; j++){
                    //squaresRow.push(el(Square, {posx: i, posy: j}));
                    squaresRow.push(el(Square, {}));

                    tableRow.push(el('td', { 
                        key: i * Math.ceil(this.state.width / 40) + j,
                        style: { padding: '-100px' },
                    }, squaresRow[squaresRow.length -1]));
                }

                this.squares[i] = squaresRow;
                this.tableCells[i] = el('tr', { key: i * -1 }, tableRow)
            }
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
        // TODO: Fixa så fillGrid() endast körs en enda gång.
        this.fillGrid();

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