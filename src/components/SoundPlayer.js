import React, { Component } from 'react';
import MIDISounds from 'midi-sounds-react';


/*Kan köra map med toMidi för att få äran av midinummer. 
Men behöver jag ens toMidi? Borde finnas något enkelt sätt att få fram alla nummer ur en låt (och behöver ju bara en just nu).
Kanske bättre att lägga in alla noter som typ defines i egen fil istället.*/

/* Om det behövs kan jag skicka ref för varje markerad Square till SP så den vet vilken som ska pulsera? 
   Om ett ackord spelas pulserar alla markerade rutor samtidigt.*/

class Note {
    // Får se om denna dataklass behövs.
    // Innehålla note, instrType (enum? ska dock vara simpelt så skippa denna till att börja med)
}

class SoundPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noteNr: 0,
            bpm: 120,
            duration16th: 0, duration8th: 0, duration4th: 0
        };

        this.state.duration16th = 4 * 60 / this.state.bpm;
        this.state.duration8th = this.state.duration16th * 4;
        this.state.duration4th = this.state.duration8th * 4;
    }

    // Från music-pitch. Exempel toMidi('A5'), tror sharps/flats blir +/-1. 
    toMidi (p) {
        let SEMITONES = [ 0, 2, 4, 5, 7, 9, 11 ];
        if (!p[2] && p[2] !== 0) 
            return null    
        return SEMITONES[p[0]] + p[1] + 12 * (p[2] + 1);
    }

    //const notes[] = {}

    playNotes() {
        console.log(toMidi('A4'));
        if (this.midiSounds)
            this.midiSounds.playChordNow(3, [toMidi('A8')], this.state.duration16th);
    }

    componentDidMount() {
		console.log('componentDidMount SoundPlayer');
        this.setState(this.state);
	}

    render() {
        return (
            <div>
                <MIDISounds ref={(ref) => (this.midiSounds = ref)} appElementName="root" instruments={[3]} />
                <p><button onClick={this.playNotes.bind(this)}>TEST</button></p>
            </div>
        )
    }
}

export default SoundPlayer;