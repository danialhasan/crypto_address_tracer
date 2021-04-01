/**
 * This file fixes the process.env.key type problem that typescript was giving us. 
 */
declare namespace NodeJS
{
    // Merge the existing `ProcessEnv` definition with ours
    // https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
    export interface ProcessEnv
    {
        NODE_ENV: "development" | "production" | "test";
        API_KEY: String
        // ...
    }
}
