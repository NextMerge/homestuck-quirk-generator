import { useState, MouseEvent } from "react";
import { Button, Checkbox, ListItemText, MenuItem, Popover } from "@mui/material";
import Quirk, { ModList, QuirkMod } from "quirks/Quirk";

type ReactSetter<T> = (newState: T | ((prevState: T) => T)) => void;

type QuirkModListPopoverProps = {
    quirk: Quirk;
    mods: ModList;
    setMods: ReactSetter<ModList>;
};

export default function QuirkModListPopover({ quirk, mods, setMods }: QuirkModListPopoverProps): JSX.Element {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <div>
            <Button aria-describedby={id} variant={"contained"} onClick={handleClick}>
                {"Open Popover"}
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {Object.keys(mods).map((key) => {
                    const quirkMod = quirk.mods.find((mod) => mod.id === key) as QuirkMod;

                    return (
                        <MenuItem key={key} onClick={() => setMods((prevState: ModList) => ({ ...prevState, [key]: !prevState[key] }))}>
                            <Checkbox checked={mods[key]} />
                            <ListItemText primary={quirkMod.title} />
                        </MenuItem>
                    );
                })}
            </Popover>
        </div>
    );
}