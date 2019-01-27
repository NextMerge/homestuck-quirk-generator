import { Quirk } from "./Quirks/Quirk";
import { Category, list, CAT_ALT, CAT_BEF, CAT_CHE } from "./Quirks/Category";
import { Aradia } from "./Quirks/Alternia/Aradia";
import { Tavros } from "./Quirks/Alternia/Tavros";
import { Sollux } from "./Quirks/Alternia/Sollux";
import { Karkat } from "./Quirks/Alternia/Karkat";
import { Nepeta } from "./Quirks/Alternia/Nepeta";
import { Kanaya } from "./Quirks/Alternia/Kanaya";
import { Terezi } from "./Quirks/Alternia/Terezi";
import { Vriska } from "./Quirks/Alternia/Vriska";
import { Equius } from "./Quirks/Alternia/Equius";
import { Gamzee } from "./Quirks/Alternia/Gamzee";
import { Eridan } from "./Quirks/Alternia/Eridan";
import { Feferi } from "./Quirks/Alternia/Feferi";
import { Rufioh } from "./Quirks/Beforus/Rufioh";
import { Mituna } from "./Quirks/Beforus/Mituna";

document.addEventListener('DOMContentLoaded', function() {
    loadTabs();
    loadQuirkFields();

    // // Have they accessed the page before?
    // var previousTime = isBool(localStorage.getItem("previousTimeSave"));

    // // Reload their previous options then.
    // if (previousTime) {
    //     var checkboxes = document.getElementsByName('toggleBox');

    //     for(var i = 0; i < checkboxes.length; i++) {
    //         var saveName = "ID " + JSON.stringify(i);
    //         checkboxes[i].checked = isBool(localStorage.getItem(saveName));
    //     }
    // } else {
    //     previousTime = true;
    // }
});

function updateText(event: MouseEvent): void {
    let input = <HTMLTextAreaElement>event.currentTarget;
    let inputStr: string = input.value;
    Quirk.autoSize(input);

    // Wipe all inputs if empty. (stops deleted text from not updating the outputs)
    if (inputStr.length < 1) {
        let txts = <HTMLCollectionOf<HTMLTextAreaElement>>document.getElementsByClassName("textOutput");
        for (let i = 0; i < txts.length; i++) {
            txts[i].value = "";
            Quirk.autoSize(txts[i]);
        }

        return;
    }

    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].quirks.length; j++) {
            list[i].quirks[j].update(inputStr);
        }
    }
}

function loadTabs(): void {
    // Load buttons here also.
    document.getElementById("btnAll").onclick = (e) => Category.toggleAll(true);
    document.getElementById("btnNone").onclick = (e) => Category.toggleAll(false);

    list.push(new Category(CAT_ALT, "Alternian Trolls only"));
    list.push(new Category(CAT_BEF, "Beforan Trolls only"));
    list.push(new Category(CAT_CHE, "Cherubs only"));

    document.getElementById("alterniaTab").click();
}

function loadQuirkFields(): void {
    (<HTMLTextAreaElement>document.getElementById("textInput")).oninput = updateText;
    Quirk.textFields = <HTMLFieldSetElement>document.getElementById("textFields");

    list[0].addQuirk(new Aradia());
    list[0].addQuirk(new Tavros());
    list[0].addQuirk(new Sollux());
    list[0].addQuirk(new Karkat());
    list[0].addQuirk(new Nepeta());
    list[0].addQuirk(new Kanaya());
    list[0].addQuirk(new Terezi());
    list[0].addQuirk(new Vriska());
    list[0].addQuirk(new Equius());
    list[0].addQuirk(new Gamzee());
    list[0].addQuirk(new Eridan());
    list[0].addQuirk(new Feferi());

    list[1].addQuirk(new Rufioh());
    list[1].addQuirk(new Mituna());
}