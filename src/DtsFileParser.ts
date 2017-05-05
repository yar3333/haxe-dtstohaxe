/// <reference path="../typings/globals/node/index.d.ts" />

import * as ts from "typescript";
import { Tokens } from "./Tokens";
import { HaxeClassOrInterface, HaxeVar } from "./HaxeClassOrInterface";

export class DtsFileParser
{
    private tokens : string[];
    private indent = "";

    private imports = new Array<string>();
    private classesAndInterfaces = new Array<HaxeClassOrInterface>();

    constructor(private sourceFile: ts.SourceFile)
    {
        this.tokens = Tokens.getAll();
    }

    public parse() : Array<HaxeClassOrInterface>
    {
        var node = this.sourceFile;

        this.processNode(node, () => {
            switch (node.kind) {
                case ts.SyntaxKind.SourceFile:
                    this.processChildren(node, new Map<number, (node:any) => void>(
                    [
                        [ ts.SyntaxKind.ImportDeclaration, (x:ts.ImportDeclaration) => this.processImportDeclaration(x) ],
                        [ ts.SyntaxKind.InterfaceDeclaration, (x:ts.InterfaceDeclaration) => this.processInterfaceDeclaration(x) ],
                        [ ts.SyntaxKind.ClassDeclaration, (x:ts.ClassDeclaration) => this.processClassDeclaration(x) ],
                        [ ts.SyntaxKind.EndOfFileToken, (x) => {} ]
                    ]));
                    break;

                default:
                    console.log(this.indent + "^----- UNKNOW ROOT ELEMENT");
                    this.logSubTree(node);
            }
        });

        return this.classesAndInterfaces;
    }
    
    private processImportDeclaration(node:ts.ImportDeclaration)
    {
        var ids = new Array<string>();
        
        this.processChildren(node, new Map<number, (node:any) => void>(
        [
            [ ts.SyntaxKind.ImportClause, (x) => {
                this.processChildren(x, new Map<number, (node:any) => void>(
                [
                    [ ts.SyntaxKind.NamedImports, (y:ts.NamedImports) => {
                        this.processChildren(y, new Map<number, (node:any) => void>(
                        [
                            [ ts.SyntaxKind.ImportSpecifier, (z:ts.ImportSpecifier) => {
                                this.processChildren(z, new Map<number, (node:any) => void>(
                                [
                                    [ ts.SyntaxKind.Identifier, (t:ts.Identifier) => {
                                        ids.push(t.text);
                                    }]
                                ]))
                            }]
                        ]))
                    }]
                ]))
            }],

            [ ts.SyntaxKind.StringLiteral, (x:ts.StringLiteral) => {
                this.addImports(x.text, ids);
            }]
        ]));
    }

    private processInterfaceDeclaration(node:ts.InterfaceDeclaration)
    {
        var item = new HaxeClassOrInterface("interface");
        
        this.processChildren(node, new Map<number, (node:any) => void>(
        [
            [ ts.SyntaxKind.ExportKeyword, (x) => {} ],
            [ ts.SyntaxKind.Identifier, (x:ts.Identifier) => item.fullClassName = x.text ],
            [ ts.SyntaxKind.HeritageClause, (x:ts.HeritageClause) => item.baseFullInterfaceNames = x.types.map(y => y.getText()) ],
            [ ts.SyntaxKind.PropertySignature, (x:ts.PropertySignature) => this.processPropertySignature(x, item) ],
            [ ts.SyntaxKind.MethodSignature, (x:ts.MethodSignature) => this.processMethodSignature(x, item)]
        ]));

        this.classesAndInterfaces.push(item);
    }

    private processClassDeclaration(node:ts.ClassDeclaration)
    {
        var item = new HaxeClassOrInterface("class");
        
        this.processChildren(node, new Map<number, (node:any) => void>(
        [
            [ ts.SyntaxKind.ExportKeyword, (x) => {} ],
            [ ts.SyntaxKind.Identifier, (x:ts.Identifier) => item.fullClassName = x.text ],
            [ ts.SyntaxKind.HeritageClause, (x:ts.HeritageClause) => item.baseFullInterfaceNames = x.types.map(y => y.getText()) ],
            [ ts.SyntaxKind.PropertyDeclaration, (x:ts.PropertyDeclaration) => this.processPropertyDeclaration(x, item) ],
            [ ts.SyntaxKind.MethodDeclaration, (x:ts.MethodDeclaration) => this.processMethodDeclaration(x, item)]
        ]));

        this.classesAndInterfaces.push(item);
    }

    private processPropertySignature(x:ts.PropertySignature, dest:HaxeClassOrInterface)
    {
        dest.addVar(this.createVar(x.name.getText(), x.type.getText()));
    }

    private processMethodSignature(x:ts.MethodSignature, dest:HaxeClassOrInterface)
    {
        dest.addMethod(x.name.getText(), x.parameters.map(p => this.createVar(p.name.getText(), p.type ? p.type.getText() : "")), x.type ? x.type.getText() : "", null);
    }

    private processPropertyDeclaration(x:ts.PropertyDeclaration, dest:HaxeClassOrInterface)
    {
        dest.addVar(this.createVar(x.name.getText(), x.type.getText()));
    }

    private processMethodDeclaration(x:ts.MethodDeclaration, dest:HaxeClassOrInterface)
    {
        dest.addMethod(x.name.getText(), x.parameters.map(p => this.createVar(p.name.getText(), p.type ? p.type.getText() : "")), x.type ? x.type.getText() : "", null);
    }

    private processChildren(node:ts.Node, map:Map<number, (node:any) => void>)
    {
         ts.forEachChild(node, x =>
         {
             var f = map.get(x.kind);
             if (f)
             {
                 this.processNode(x, () => f(x));
             }
             else {
                console.log(this.indent + "vvvvv----IGNORE ----vvvvv");
                this.processNode(x, () => this.logSubTree(x));
                console.log(this.indent + "^^^^^----IGNORE ----^^^^^");
             }
         });
    }

    private logSubTree(node: ts.Node)
    {
        ts.forEachChild(node, x =>
        {
           this.processNode(x, () => this.logSubTree(x));
        });
    }

    private processNode(node: ts.Node, callb:any)
    {
        console.log(this.indent + this.tokens[node.kind]);
        this.indent += "    ";
        callb();
        this.indent = this.indent.substring(0, this.indent.length - 4);
    }

    private report(node: ts.Node, message: string)
    {
        let obj = this.sourceFile.getLineAndCharacterOfPosition(node.getStart());
        console.log(`${this.sourceFile.fileName} (${obj.line + 1},${obj.character + 1}): ${message}`);
    }

    private addImports(moduleFilePath:string, ids:Array<string>)
    {
        for (let id of ids) this.imports.push(moduleFilePath.replace("/", ".") + "." + id);
    }

    private createVar(name:string, type:string, defaultValue?:string) : HaxeVar
    {
        return {
            haxeName: name,
            haxeType: type,
            haxeDefVal: defaultValue
        };
    }
}