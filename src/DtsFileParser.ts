/// <reference path="../typings/globals/node/index.d.ts" />

import * as ts from "typescript";
import { Tokens } from "./Tokens";
import { TsToHaxeStdTypes } from "./TsToHaxeStdTypes";
import { HaxeClassOrInterface, HaxeVar } from "./HaxeClassOrInterface";

export class DtsFileParser
{
    private tokens : string[];
    private typeMapper : Map<string, string>;
    private indent = "";

    private imports = new Array<string>();
    private classesAndInterfaces = new Array<HaxeClassOrInterface>();

    constructor(private sourceFile: ts.SourceFile, private typeChecker: ts.TypeChecker)
    {
        this.tokens = Tokens.getAll();
        this.typeMapper = TsToHaxeStdTypes.getAll();
    }

    public parse() : Array<HaxeClassOrInterface>
    {
        const node = this.sourceFile;

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
        
        item.docComment = this.getJsDoc(node.name);

        this.processChildren(node, new Map<number, (node:any) => void>(
        [
            [ ts.SyntaxKind.ExportKeyword, (x) => {} ],
            [ ts.SyntaxKind.Identifier, (x:ts.Identifier) => item.fullClassName = x.text ],
            [ ts.SyntaxKind.HeritageClause, (x:ts.HeritageClause) => this.processHeritageClauseForClass(x, item) ],
            [ ts.SyntaxKind.PropertyDeclaration, (x:ts.PropertyDeclaration) => this.processPropertyDeclaration(x, item) ],
            [ ts.SyntaxKind.MethodDeclaration, (x:ts.MethodDeclaration) => this.processMethodDeclaration(x, item)],
            [ ts.SyntaxKind.Constructor, (x:ts.ConstructorDeclaration) => this.processConstructor(x, item)]
        ]));

        this.classesAndInterfaces.push(item);
    }

    private processHeritageClauseForClass(x:ts.HeritageClause, dest:HaxeClassOrInterface)
    {
        switch (x.token)
        {
            case ts.SyntaxKind.ExtendsKeyword:
                dest.baseFullClassName = x.types.map(y => y.getText()).toString();
                break;

            case ts.SyntaxKind.ImplementsKeyword:
                dest.baseFullInterfaceNames = x.types.map(y => y.getText());
                break;
        }
    }

    private processPropertySignature(x:ts.PropertySignature, dest:HaxeClassOrInterface)
    {
        dest.addVar(this.createVar(x.name.getText(), x.type, null, this.getJsDoc(x.name)));
    }

    private processMethodSignature(x:ts.MethodSignature, dest:HaxeClassOrInterface)
    {
        dest.addMethod(
            x.name.getText(),
            x.parameters.map(p => this.createVar(p.name.getText(), p.type, null, this.getJsDoc(p.name))),
            this.convertType(x.type),
            null,
            this.isFlag(x.modifiers, ts.NodeFlags.Private),
            this.isFlag(x.modifiers, ts.NodeFlags.Static),
            this.getJsDoc(x.name)
        );
    }

    private processPropertyDeclaration(x:ts.PropertyDeclaration, dest:HaxeClassOrInterface)
    {
        dest.addVar(this.createVar(x.name.getText(), x.type, null, this.getJsDoc(x.name)));
    }

    private processMethodDeclaration(x:ts.MethodDeclaration, dest:HaxeClassOrInterface)
    {
        dest.addMethod(
            x.name.getText(),
            x.parameters.map(p => this.createVar(p.name.getText(), p.type, null, this.getJsDoc(p.name))),
            this.convertType(x.type),
            null,
            this.isFlag(x.modifiers, ts.NodeFlags.Private),
            this.isFlag(x.modifiers, ts.NodeFlags.Static),
            this.getJsDoc(x.name)
        );
    }

    private processConstructor(x:ts.ConstructorDeclaration, dest:HaxeClassOrInterface)
    {
        dest.addMethod(
            "new",
            x.parameters.map(p => this.createVar(p.name.getText(), p.type, null, this.getJsDoc(p.name))),
            "Void",
            null,
            this.isFlag(x.modifiers, ts.NodeFlags.Private),
            this.isFlag(x.modifiers, ts.NodeFlags.Static),
            this.getJsDoc(x.getFirstToken())
        );
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

    private createVar(name:string, type:ts.Node, defaultValue:string, jsDoc:string) : HaxeVar
    {
        return {
            haxeName: name,
            haxeType: this.convertType(type),
            haxeDefVal: defaultValue,
            jsDoc: jsDoc
        };
    }

    private convertType(node:ts.Node) : string
    {
        if (!node) return "Dynamic";

        switch (node.kind)
        {
            case ts.SyntaxKind.FunctionType:
            {
                let t = <ts.FunctionTypeNode>node;
                let types = [];
                for (var p of t.parameters) types.push(this.convertType(p.type));
                types.push(this.convertType(t.type));
                return types.join("->");
            }

            case ts.SyntaxKind.ArrayType:
            {
                let t = <ts.ArrayTypeNode>node;
                return "Array<" + this.convertType(t.elementType) + ">";
            }

            default:
                var s = node.getText();
                return this.typeMapper.get(s) ? this.typeMapper.get(s) : s;
        }
    }

    private getJsDoc(node:ts.Node)
    {
        var symbol = this.typeChecker.getSymbolAtLocation(node);
        return symbol ? ts.displayPartsToString(symbol.getDocumentationComment()) : "";
    }

    private isFlag(mods:ts.ModifiersArray, f:ts.NodeFlags) : boolean
    {
        return mods && mods.flags && (mods.flags & f) !== 0;
    }
}