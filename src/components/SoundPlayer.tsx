import * as React from 'react';
import MIDISounds from './MIDISounds';

/*Kan köra map med toMidi för att få array av midinummer? 
(om jag nu behöver den, finns nog enkla sätta att lägga in alla noter från låt som midinummer direkt.*/

/* Om det behövs kan jag skicka ref för varje markerad Square till SP så den vet vilken som ska pulsera? 
   Om ett ackord spelas pulserar alla markerade rutor samtidigt. */

// Convert string to pitch-array notation
function parse (str: string): Array<number> | null {
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
}

class Note {
    notes: Array<number>;   // midi number
    value: number;          // in seconds
    instr: number;          /* Vet ej vilken typ den bör va än, eller om den ens kommer behövas 
                               Kanske bör skapa ny typ för denna sen? */

    constructor(notes: Array<number>, value: number, instr?: number) {
        this.notes = notes;
        this.value = value;
        this.instr = instr ? instr : 1;
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
    private midiSounds = React.createRef<MIDISounds>();
    
    constructor(props: {}) {
        super(props);
        this.state = {
            bpm: 150,
            currentNoteIndex: 0,
            track: [
                new Note([1], this.duration4th, 111),
                new Note([60], this.duration8th, 111),
                new Note([1], this.duration16th, 111),
                new Note([60], this.duration4th, 111),
                new Note([1], this.duration8th, 111),
                new Note([60], this.duration16th, 111),
                new Note([1], this.duration4th, 111),
                new Note([60], this.duration8th, 111),
                new Note([1], this.duration16th, 111),
            ]
        };

        this.updateDurations();
    }

    updateDurations() {
        this.duration16th = 4 * 60 / this.state.bpm;
        this.duration8th = this.duration16th * 4;
        this.duration4th = this.duration8th * 4;
    }

    // TODO: Gör om denna funktion
    playNotes() {
        if (this.midiSounds.current)
            this.midiSounds.current.playChordNow([1], [60], this.duration16th);
    }

    componentDidUpdate(prevState: Readonly<SoundPlayerState>) {
        if(prevState.bpm !== this.state.bpm)
            this.updateDurations();
    }

    componentDidMount() {
		console.log('componentDidMount SoundPlayer');
        this.setState(this.state);

        if(this.midiSounds.current)
            this.midiSounds.current.setMasterVolume(0.1);
    }
    
    render() {
        return (
            <div>
                <MIDISounds ref={this.midiSounds} appElementName="root" instruments={[123]} />
                <p><button onClick={this.playNotes.bind(this)}>TEST</button></p>
            </div>
        )
    }
}