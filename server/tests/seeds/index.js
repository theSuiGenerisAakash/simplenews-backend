import userSeed from "./userSeed";

export function seed(db) {
    userSeed.up(db);
}

export function unseed(db) {
    userSeed.down(db);
}
