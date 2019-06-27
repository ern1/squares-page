import React from 'react';
import MIDISounds from 'midi-sounds-react';

class SoundPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            noteNr: 0,
            midiSoundsRef: React.createRef()
        };
    }

    //const notes[] = {}
    
    //var numNotes = 0;

    playNote() {
        //this.state.midiSoundsRef.playChords(3, [60], 2.5);
    }

    componentDidMount() {
		console.log('rerender after init');
        this.setState(this.state);
	}

    render() {
        this.playNote(); // temp

        return (
            <MIDISounds 
	            ref={(ref) => (this.midiSoundsRef = ref)} 
	            appElementName="root" instruments={[3]} 
	        />
        )
    }
}

export default SoundPlayer;