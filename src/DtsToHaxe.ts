/// <reference path="../typings/globals/node/index.d.ts" />

import {readFileSync} from "fs";
import * as ts from "typescript";
import { DtsFileParser } from "./DtsFileParser";

console.log("----------------------------------------------");

const fileNames = process.argv.slice(2);
fileNames.forEach(fileName => {
    console.log("Process file " + fileName);
    let sourceFile = ts.createSourceFile(fileName, readFileSync(fileName).toString(), ts.ScriptTarget.ES6, /*setParentNodes */ true);
    
    var parser = new DtsFileParser(sourceFile);
    for (var klass of parser.parse())
    {
        console.log("\nRESULT:\n" + klass.toString());
    }
});
