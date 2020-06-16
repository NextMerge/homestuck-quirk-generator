import { Quirk } from "../Quirk";
import { OptionalCheckbox } from "../OptionalCheckbox";


export class Meenah extends Quirk {
    puns: OptionalCheckbox;

    constructor() {
        super("Meenah Peixes", "feferi");
        this.puns = this.addCheckbox("Fish Puns", "Shellf-explanatory!", true)
    }

    quirkify(): void {
        if (this.puns.isChecked()) { this.fishPuns(); }
        this.replaceStr("H", ")(");
        this.replaceStr("E", "-E");
        this.tiaraEmotes();
    }
}