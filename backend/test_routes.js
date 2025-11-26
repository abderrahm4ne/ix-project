import express from 'express';

const app = express();

async function test() {
    try {
        console.log("Testing /:path(.*)");
        app.get("/:path(.*)", (_, res) => { });
        console.log("Success /:path(.*)");
    } catch (e) { console.error("Failed /:path(.*)", e.message); }

    try {
        console.log("Testing RegExp /.*/");
        app.get(/.*/, (_, res) => { });
        console.log("Success RegExp /.*/");
    } catch (e) { console.error("Failed RegExp /.*/", e.message); }
}

test();
