/// <reference path="../typings/globals/node/index.d.ts" />

import * as fs from "fs";
import * as ts from "typescript";
import { DtsFileParser } from "./DtsFileParser";

console.log("----------------------------------------------");

const options: ts.CompilerOptions =
{
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
    noLib: true
};

const fileNames = process.argv.slice(2);

const program = ts.createProgram(fileNames, options);
const typeChecker = program.getTypeChecker();

for (let sourceFile of program.getSourceFiles()) {
    console.log("Process file " + sourceFile.path);
    
    var parser = new DtsFileParser(sourceFile, typeChecker);
    for (var klass of parser.parse())
    {
        console.log("\nRESULT:\n" + klass.toString());
    }
}
