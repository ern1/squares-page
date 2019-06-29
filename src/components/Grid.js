import React from 'react';
import SoundPlayer from './SoundPlayer';
import './Grid.css';

const el = React.createElement

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: '4',
            pressed: false,
            color: '#fff',
            borderColor: '#fff',
        };
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
                    transition: '1s' } 
            },
            null
        );
    }
}

// TODO: Kör onMouseBlabla-event för alla Square, men gör det i Grid-klassen istället så att man kan ändra dom i närheten? Vänta lite med detta, kanske är lite för krävande.. 
// TODO: Spela melodi allt eftersom man eller rutor? Klickar man på en spelas den noten högre etc.
class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            squares: [],
            tableCells: [],
            midiPlayer: new SoundPlayer()
        };

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    fillGrid() {
        if(!this.state.tableCells.length) {
            // TODO: fixa så att det blir rätt storlek
            for (let i = 0; i < this.state.height / 80; i++){
                let tableRow = [];
                let squaresRow = [];

                for (let j = 0; j < this.state.width / 80; j++){
                    squaresRow.push(el(Square, {posx: i, posy: j}));

                    tableRow.push(el('td', { 
                        key: i * Math.ceil(this.state.width / 40) + j,
                        style: { padding: '-100px' },
                    }, squaresRow[squaresRow.length -1]));
                }

                // TODO: Använd setState istället
                this.state.squares[i] = squaresRow;
                this.state.tableCells[i] = el('tr', { key: i * -1 }, tableRow)

                /*this.setState(prevState => ({
                    squares: [...this.state.squares, squaresRow],
                    tableCells: [...this.state.tableCells, el('tr', { key: i * -1 }, tableRow)]
                }))*/
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
        this.fillGrid(); // TODO: Fixa så fillGrid() endast körs en enda gång.

        return (
            <div>
                <table className='grid' cellSpacing='0' cellPadding='0'>
                    <tbody>
                        {this.state.tableCells}
                    </tbody>
                </table>

                <div>
                    <SoundPlayer></SoundPlayer>
                </div>
            </div>
        )
    }
}

export default Grid;