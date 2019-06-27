import React from 'react';
import MIDISounds from 'midi-sounds-react';

class Sound extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            noteNr: 0
        };
    }

    //const notes[] = {}
    
    //var numNotes = 0;

    playNote() {
        //this.midiSounds.playChords(3, [60], 2.5);
    }

    componentDidMount() {
		console.log('rerender after init');
		this.setState(this.state);
	}

    render() {
        this.playNote(); // temp

        return (
            <MIDISounds 
	            ref={(ref) => (this.midiSounds = ref)} 
	            appElementName="root" instruments={[3]} 
	        />
        )
    }
}

export default Sound;