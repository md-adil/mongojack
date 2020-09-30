import { resolve } from "path"

export const wait = (t: number) => {
    return new Promise(resolve => setTimeout(resolve, t));
}
