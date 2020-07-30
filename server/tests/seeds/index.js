import userSeed from "./userSeed";

export async function seed(db) {
    await userSeed.up(db);
}

export async function unseed(db) {
    await userSeed.down(db);
}
