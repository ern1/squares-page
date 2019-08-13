import * as React from 'react';
import MIDISounds from './MIDISounds';

// Can contain more than 1 note. (Change class name?)
class Note {
    notes: Array<number>;   // midi number
    value: number;          // in seconds
    instr: number;          // TODO: Vet ej vilken typ denna bör vara än, så får testa mig fram.

    constructor(notes: Array<number>, value: number, instr?: number) {
        this.notes = notes;
        this.value = value;
        this.instr = instr ? instr : 3;
    }
}

interface SoundPlayerState {
    bpm: number;
    track: Array<Note>;
    currentNoteIndex: number;
}

export class SoundPlayer extends React.Component<{}, SoundPlayerState> {
    private duration16th = 0;
    private duration8th = 0;
    private duration4th = 0;
    private midiSoundsRef = React.createRef<MIDISounds>();
    
    constructor(props: {}) {
        super(props);
        this.state = {
            // Gör dessa till private också?! Finns väl ingen anledning att köra render igen?
            bpm: 150,
            currentNoteIndex: 0,
            track: [
                new Note([1], this.duration16th),
                new Note([1], this.duration8th),
                new Note([1], this.duration16th),
                new Note([1], this.duration4th),
                new Note([1], this.duration8th),
                new Note([1], this.duration16th),
                new Note([1], this.duration4th),
                new Note([1], this.duration8th),
                new Note([1], this.duration16th),
            ]
        };

        this.updateDurations();
    }

    updateDurations() {
        this.duration16th = 4 * 60 / this.state.bpm;
        this.duration8th = this.duration16th * 4;
        this.duration4th = this.duration8th * 4;
    }

    resetTrack(){
        this.setState({currentNoteIndex: 0});
    }

    // TODO: Gör om denna funktion
    playNotes(n: Note) {
        if (this.midiSoundsRef.current) {
            this.midiSoundsRef.current.playChordNow([n.instr], n.notes, n.value);
            //this.midiSoundsRef.current.playChordNow([1], [60], this.duration16th);
        }
    }

    playNextNotes() {
        console.log("playNextNotes: currentNoteIndex = " + this.state.currentNoteIndex)
        if(this.state.currentNoteIndex >= this.state.track.length)
            this.setState({currentNoteIndex: 0})

        this.playNotes(this.state.track[this.state.currentNoteIndex]);
        this.setState({currentNoteIndex: this.state.currentNoteIndex + 1})
    }

    // TODO: FIXA NU (så att playNextNotes() fungerar)
    playTestNote() {
        //this.playNextNotes();
        this.playNotes(new Note([1], this.duration4th));
    }

    componentDidUpdate(prevState: Readonly<SoundPlayerState>) {
        if(prevState.bpm !== this.state.bpm)
            this.updateDurations();
    }

    componentDidMount() {
		console.log('componentDidMount SoundPlayer');
        this.setState(this.state);

        if(this.midiSoundsRef.current)
            this.midiSoundsRef.current.setMasterVolume(0.1);
    }
    
    render() {
        return (
            <div>
                <MIDISounds ref={this.midiSoundsRef} appElementName="root" instruments={[123]} />
                <p><button onClick={this.playTestNote.bind(this)}>TEST</button></p>
            </div>
        )
    }
}


/*Kan köra map (higher order function) med toMidi för att få array av midinummer? 
(om jag nu behöver den, finns nog enkla sätta att lägga in alla noter från låt som midinummer direkt.*/
// Convert string to pitch-array notation
/*function parse (str: string): Array<number> | null {
    let LETTERS = 'CDEFGAB';
    let REGEX = /^([a-gA-G])(#{1,4}|b{1,4}|x{1,2}|)(\d*)$/;
    var m = REGEX.exec(str);
    if (!m) 
        return null;
    var step = LETTERS.indexOf(m[1].toUpperCase());
    var alt = m[2].replace(/x/g, '##').length;
    if (m[2][0] === 'b') 
        alt *= -1;
    var oct = m[3] ? +m[3] : 0; // 0 istället för null
    return [step, alt, oct];
}
function toMidi(notes: Array<string>) {
    let SEMITONES = [ 0, 2, 4, 5, 7, 9, 11 ];
    let midiArray: Array<number> = [];
    for (let note of notes) {
        let pitchArr = parse(note);
        if(pitchArr) {
            if(!pitchArr[2] && (pitchArr[2] !== 0))
                continue;
            midiArray.push(SEMITONES[pitchArr[0]] + pitchArr[1] + 12 * (pitchArr[2] + 1));
        }    
    }
    return midiArray;
}*/