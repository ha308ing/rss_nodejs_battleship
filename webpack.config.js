import { resolve } from "node:path";

const __dirname = import.meta.dirname;

/** @type {import("webpack").Configuration} */
export default {
    entry: resolve(__dirname, "src/index.ts"),
    output: {
        clean: true,
        filename: "index.cjs",
        path: resolve(__dirname, "dist"),
    },
    target: ["es6", "node22.9"],
    mode: "production",
    resolve: {
        extensions: [".ts"],
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    module: {
        rules: [{ test: /\.ts$/, loader: "ts-loader" }],
    },
};
