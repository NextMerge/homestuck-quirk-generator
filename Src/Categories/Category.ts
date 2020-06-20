import { Quirk } from "../Quirks/Quirk";
import { setCookieStr } from "../CookieManager";
import {renderHTML as renderTab} from "../Templates/Tab";

export class Category {
    tabName: string;
    onlyButtonName: string;
    public quirks: Array<Quirk>;
    optionalCheckboxes: Array<HTMLTableRowElement>;

    constructor(tabName: string, onlyBtnName: string) {
        this.tabName = tabName;
        this.onlyButtonName = onlyBtnName;
        this.quirks = new Array<Quirk>();
        this.optionalCheckboxes = new Array<HTMLTableRowElement>();
    }

    public render() {
        let low: string = this.tabName.toLocaleLowerCase();

        // Button to select this category only.
        let btn = document.createElement("input");
        btn.type = "button";
        btn.value = this.onlyButtonName;
        btn.onclick = (e) => this.toggleCat(true, low);
        document.getElementById("button-list").insertAdjacentElement('beforeend', btn);

        // The tab's content.
        document.getElementById("tab").insertAdjacentHTML('beforeend', renderTab(this.tabName));

        for (let i = 0; i < this.quirks.length; i++) {
            this.quirks[i].render(this);
        }
    }

    public getMainCheckboxSetElement(): HTMLElement {
        return document.getElementById(this.tabName.toLocaleLowerCase() + "-checkboxes");
    }

    public getOptionalCheckboxSetElement(): HTMLElement {
        return document.getElementById(this.tabName.toLocaleLowerCase() + "-optional-table");
    }

    // Opening tabs for the floating-box.
    static openTab(event: MouseEvent): any {
        // Get all elements with class="tab-content" and hide them.
        let tabContent: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("tab-content") as HTMLCollectionOf<HTMLElement>;

        let i: number = 0;
        for (i = 0; i < tabContent.length; i++) {
            tabContent[i].style.display = "none";
        }

        // Get all elements with class="tab-links" and remove the class "active."
        let tabLinks: HTMLCollectionOf<Element> = document.getElementsByClassName("tab-links");
        for (i = 0; i < tabLinks.length; i++) {
            tabLinks[i].className = tabLinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the link that opened the tab
        let id: string = (<HTMLElement>event.currentTarget).id;
        setCookieStr("currTab", id, 31);
        document.getElementById(id + "-content").style.display = "block";
        (<HTMLElement>event.currentTarget).className += " active";
    }

    toggleCat(finalState: boolean, tabName: string, disableOthers: boolean = true) {
        if (disableOthers) {
            Category.toggleAll(false);
            document.getElementById(tabName + "-tab").click();
        }

        for (let i = 0; i < this.quirks.length; i++) {
            // Don't just set the checked boolean directly because that prevents event firing.
            if (this.quirks[i].activeCheckbox.checked != finalState) {
                this.quirks[i].activeCheckbox.click();
            }
        }
    }

    static toggleAll(finalState: boolean): void {
        for (let i = 0; i < list.length; i++) {
            list[i].toggleCat(finalState, list[i].tabName.toLocaleLowerCase(), false);
        }
    }
}

export let list: Array<Category> = new Array<Category>();