import React from 'react';
import MIDISounds from 'midi-sounds-react';

// Får se om denna dataklass behövs.
// Innehålla note, instrType (enum? ska dock vara simpelt så skippa denna till att börja med)
class Note {
    // ...
}

class SoundPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            noteNr: 0,
            bpm: 120
            //midiSoundsRef: React.createRef()
        };
    }

    //const notes[] = {}
    //var numNotes = 0;

    // Denna ska köra evig loop (byt namn)? Fast beror lite på hur allt ska fungera sen.
    playNote() {
        if (this.midiSounds)
            this.midiSounds.playChords(3, [60], 2.5);
    }

    componentDidMount() {
		console.log('rerender after init');
        this.setState(this.state);
	}

    render() {
        //this.playNote(); // temp

        return (
            <MIDISounds ref={(ref) => (this.midiSounds = ref)} appElementName="root" instruments={[3]} />
        )
    }
}

export default SoundPlayer;