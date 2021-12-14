import SPCImg from "../assets/tokens/SPC.png";
import SPICYImg from "../assets/tokens/SPICY.png";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "spc") {
        return toUrl(SPCImg);
    }

    if (name === "spicy") {
        return toUrl(SPICYImg);
    }

    throw Error(`Token url doesn't support: ${name}`);
}
