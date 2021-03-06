/// <reference path="../typings/globals/node/index.d.ts" />

import * as fs from "fs";
const mkdirp = require('mkdirp');
import * as path from "path";
import * as ts from "typescript";
import { DtsFileParser } from "./DtsFileParser";
import { CmdOptions } from "./CmdOptions";

var options = new CmdOptions();
options.add("target", "ES5", ["--target"], "ES3, ES5, ES6, ES2015 or Latest. Default is ES5.")
options.add("outDir", "hxclasses", ["--out-dir"], "Output directory. Default is 'hxclasses'.")
options.addRepeatable("filePaths", null, "Typescript definition file paths.");

if (process.argv.length <= 2)
{
    console.log("TypeScript definition files (*.d.ts) to haxe convertor.");
    console.log("Usage: DtsToHaxe <options> (<file.d.ts> | <source_dir>) ...");
    console.log("Options:");
    console.log(options.getHelpMessage());
    process.exit(1);
}

var params = options.parse(process.argv.slice(2));

const compilerOptions: ts.CompilerOptions =
{
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
    noLib: true
};

switch (params.get("target").toUpperCase())
{
    case "ES3": compilerOptions.target = ts.ScriptTarget.ES3; break;
    case "ES5": compilerOptions.target = ts.ScriptTarget.ES5; break;
    case "ES6": compilerOptions.target = ts.ScriptTarget.ES6; break;
    case "ES2015": compilerOptions.target = ts.ScriptTarget.ES2015; break;
    case "LATEST": compilerOptions.target = ts.ScriptTarget.Latest; break;
    default: error("Unknow target.");
}

let filePaths : Array<string> = params.get("filePaths");
for (var i = 0; i < filePaths.length; i++)
{
    if (fs.statSync(filePaths[i]).isDirectory())
    {
        var allFiles = [];
        walkSync(filePaths[i], (start, dirs, files) => allFiles = allFiles.concat(files.filter(x => x.endsWith(".d.ts")).map(x => start + "/" + x)));
        var after = filePaths.slice(i + 1);
        filePaths = filePaths.slice(0, i).concat(allFiles).concat(after);
        i += allFiles.length - 1;
    }
}

const program = ts.createProgram(filePaths, compilerOptions);
const typeChecker = program.getTypeChecker();

for (let sourceFile of program.getSourceFiles()) {
    console.log("Process file " + sourceFile.path);
    
    var parser = new DtsFileParser(sourceFile, typeChecker);
    for (var klass of parser.parse())
    {
        let destFilePath = params.get("outDir") + "/" + klass.fullClassName.split(".").join("/") + ".hx";
        mkdirp(path.dirname(destFilePath));
        fs.writeFileSync(destFilePath, klass.toString());
    }
}

function error(s:string)
{
    console.log(s);
    process.exit(1);
}


type WalkSyncCallback = (start:string, dirs:Array<string>, files:Array<string>) => void;

function walkSync(start:string, callback:WalkSyncCallback) : void
{
    var stat = fs.statSync(start);

    if (stat.isDirectory())
    {
        var filenames = fs.readdirSync(start);

        var coll = filenames.reduce(function (acc, name)
        {
            var abspath = path.join(start, name);

            if (fs.statSync(abspath).isDirectory())
            {
                acc.dirs.push(name);
            }
            else
            {
                acc.names.push(name);
            }

            return acc;
        }, {"names": [], "dirs": []});

        callback(start, coll.dirs, coll.names);

        coll.dirs.forEach(function (d)
        {
            var abspath = path.join(start, d);
            exports.walkSync(abspath, callback);
        });
    }
    else
    {
        throw new Error("path: " + start + " is not a directory");
    }
}