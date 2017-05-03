/// <reference path="typings/globals/node/index.d.ts" />
"use strict";
const fs_1 = require("fs");
const ts = require("typescript");
class Tokens {
    static getAll() {
        var r = [];
        r[0] = "Unknown";
        r[1] = "EndOfFileToken";
        r[2] = "SingleLineCommentTrivia";
        r[3] = "MultiLineCommentTrivia";
        r[4] = "NewLineTrivia";
        r[5] = "WhitespaceTrivia";
        r[6] = "ShebangTrivia";
        r[7] = "ConflictMarkerTrivia";
        r[8] = "NumericLiteral";
        r[9] = "StringLiteral";
        r[10] = "RegularExpressionLiteral";
        r[11] = "NoSubstitutionTemplateLiteral";
        r[12] = "TemplateHead";
        r[13] = "TemplateMiddle";
        r[14] = "TemplateTail";
        r[15] = "OpenBraceToken";
        r[16] = "CloseBraceToken";
        r[17] = "OpenParenToken";
        r[18] = "CloseParenToken";
        r[19] = "OpenBracketToken";
        r[20] = "CloseBracketToken";
        r[21] = "DotToken";
        r[22] = "DotDotDotToken";
        r[23] = "SemicolonToken";
        r[24] = "CommaToken";
        r[25] = "LessThanToken";
        r[26] = "LessThanSlashToken";
        r[27] = "GreaterThanToken";
        r[28] = "LessThanEqualsToken";
        r[29] = "GreaterThanEqualsToken";
        r[30] = "EqualsEqualsToken";
        r[31] = "ExclamationEqualsToken";
        r[32] = "EqualsEqualsEqualsToken";
        r[33] = "ExclamationEqualsEqualsToken";
        r[34] = "EqualsGreaterThanToken";
        r[35] = "PlusToken";
        r[36] = "MinusToken";
        r[37] = "AsteriskToken";
        r[38] = "AsteriskAsteriskToken";
        r[39] = "SlashToken";
        r[40] = "PercentToken";
        r[41] = "PlusPlusToken";
        r[42] = "MinusMinusToken";
        r[43] = "LessThanLessThanToken";
        r[44] = "GreaterThanGreaterThanToken";
        r[45] = "GreaterThanGreaterThanGreaterThanToken";
        r[46] = "AmpersandToken";
        r[47] = "BarToken";
        r[48] = "CaretToken";
        r[49] = "ExclamationToken";
        r[50] = "TildeToken";
        r[51] = "AmpersandAmpersandToken";
        r[52] = "BarBarToken";
        r[53] = "QuestionToken";
        r[54] = "ColonToken";
        r[55] = "AtToken";
        r[56] = "EqualsToken";
        r[57] = "PlusEqualsToken";
        r[58] = "MinusEqualsToken";
        r[59] = "AsteriskEqualsToken";
        r[60] = "AsteriskAsteriskEqualsToken";
        r[61] = "SlashEqualsToken";
        r[62] = "PercentEqualsToken";
        r[63] = "LessThanLessThanEqualsToken";
        r[64] = "GreaterThanGreaterThanEqualsToken";
        r[65] = "GreaterThanGreaterThanGreaterThanEqualsToken";
        r[66] = "AmpersandEqualsToken";
        r[67] = "BarEqualsToken";
        r[68] = "CaretEqualsToken";
        r[69] = "Identifier";
        r[70] = "BreakKeyword";
        r[71] = "CaseKeyword";
        r[72] = "CatchKeyword";
        r[73] = "ClassKeyword";
        r[74] = "ConstKeyword";
        r[75] = "ContinueKeyword";
        r[76] = "DebuggerKeyword";
        r[77] = "DefaultKeyword";
        r[78] = "DeleteKeyword";
        r[79] = "DoKeyword";
        r[80] = "ElseKeyword";
        r[81] = "EnumKeyword";
        r[82] = "ExportKeyword";
        r[83] = "ExtendsKeyword";
        r[84] = "FalseKeyword";
        r[85] = "FinallyKeyword";
        r[86] = "ForKeyword";
        r[87] = "FunctionKeyword";
        r[88] = "IfKeyword";
        r[89] = "ImportKeyword";
        r[90] = "InKeyword";
        r[91] = "InstanceOfKeyword";
        r[92] = "NewKeyword";
        r[93] = "NullKeyword";
        r[94] = "ReturnKeyword";
        r[95] = "SuperKeyword";
        r[96] = "SwitchKeyword";
        r[97] = "ThisKeyword";
        r[98] = "ThrowKeyword";
        r[99] = "TrueKeyword";
        r[100] = "TryKeyword";
        r[101] = "TypeOfKeyword";
        r[102] = "VarKeyword";
        r[103] = "VoidKeyword";
        r[104] = "WhileKeyword";
        r[105] = "WithKeyword";
        r[106] = "ImplementsKeyword";
        r[107] = "InterfaceKeyword";
        r[108] = "LetKeyword";
        r[109] = "PackageKeyword";
        r[110] = "PrivateKeyword";
        r[111] = "ProtectedKeyword";
        r[112] = "PublicKeyword";
        r[113] = "StaticKeyword";
        r[114] = "YieldKeyword";
        r[115] = "AbstractKeyword";
        r[116] = "AsKeyword";
        r[117] = "AnyKeyword";
        r[118] = "AsyncKeyword";
        r[119] = "AwaitKeyword";
        r[120] = "BooleanKeyword";
        r[121] = "ConstructorKeyword";
        r[122] = "DeclareKeyword";
        r[123] = "GetKeyword";
        r[124] = "IsKeyword";
        r[125] = "ModuleKeyword";
        r[126] = "NamespaceKeyword";
        r[127] = "NeverKeyword";
        r[128] = "ReadonlyKeyword";
        r[129] = "RequireKeyword";
        r[130] = "NumberKeyword";
        r[131] = "SetKeyword";
        r[132] = "StringKeyword";
        r[133] = "SymbolKeyword";
        r[134] = "TypeKeyword";
        r[135] = "UndefinedKeyword";
        r[136] = "FromKeyword";
        r[137] = "GlobalKeyword";
        r[138] = "OfKeyword";
        r[139] = "QualifiedName";
        r[140] = "ComputedPropertyName";
        r[141] = "TypeParameter";
        r[142] = "Parameter";
        r[143] = "Decorator";
        r[144] = "PropertySignature";
        r[145] = "PropertyDeclaration";
        r[146] = "MethodSignature";
        r[147] = "MethodDeclaration";
        r[148] = "Constructor";
        r[149] = "GetAccessor";
        r[150] = "SetAccessor";
        r[151] = "CallSignature";
        r[152] = "ConstructSignature";
        r[153] = "IndexSignature";
        r[154] = "TypePredicate";
        r[155] = "TypeReference";
        r[156] = "FunctionType";
        r[157] = "ConstructorType";
        r[158] = "TypeQuery";
        r[159] = "TypeLiteral";
        r[160] = "ArrayType";
        r[161] = "TupleType";
        r[162] = "UnionType";
        r[163] = "IntersectionType";
        r[164] = "ParenthesizedType";
        r[165] = "ThisType";
        r[166] = "LiteralType";
        r[167] = "ObjectBindingPattern";
        r[168] = "ArrayBindingPattern";
        r[169] = "BindingElement";
        r[170] = "ArrayLiteralExpression";
        r[171] = "ObjectLiteralExpression";
        r[172] = "PropertyAccessExpression";
        r[173] = "ElementAccessExpression";
        r[174] = "CallExpression";
        r[175] = "NewExpression";
        r[176] = "TaggedTemplateExpression";
        r[177] = "TypeAssertionExpression";
        r[178] = "ParenthesizedExpression";
        r[179] = "FunctionExpression";
        r[180] = "ArrowFunction";
        r[181] = "DeleteExpression";
        r[182] = "TypeOfExpression";
        r[183] = "VoidExpression";
        r[184] = "AwaitExpression";
        r[185] = "PrefixUnaryExpression";
        r[186] = "PostfixUnaryExpression";
        r[187] = "BinaryExpression";
        r[188] = "ConditionalExpression";
        r[189] = "TemplateExpression";
        r[190] = "YieldExpression";
        r[191] = "SpreadElementExpression";
        r[192] = "ClassExpression";
        r[193] = "OmittedExpression";
        r[194] = "ExpressionWithTypeArguments";
        r[195] = "AsExpression";
        r[196] = "NonNullExpression";
        r[197] = "TemplateSpan";
        r[198] = "SemicolonClassElement";
        r[199] = "Block";
        r[200] = "VariableStatement";
        r[201] = "EmptyStatement";
        r[202] = "ExpressionStatement";
        r[203] = "IfStatement";
        r[204] = "DoStatement";
        r[205] = "WhileStatement";
        r[206] = "ForStatement";
        r[207] = "ForInStatement";
        r[208] = "ForOfStatement";
        r[209] = "ContinueStatement";
        r[210] = "BreakStatement";
        r[211] = "ReturnStatement";
        r[212] = "WithStatement";
        r[213] = "SwitchStatement";
        r[214] = "LabeledStatement";
        r[215] = "ThrowStatement";
        r[216] = "TryStatement";
        r[217] = "DebuggerStatement";
        r[218] = "VariableDeclaration";
        r[219] = "VariableDeclarationList";
        r[220] = "FunctionDeclaration";
        r[221] = "ClassDeclaration";
        r[222] = "InterfaceDeclaration";
        r[223] = "TypeAliasDeclaration";
        r[224] = "EnumDeclaration";
        r[225] = "ModuleDeclaration";
        r[226] = "ModuleBlock";
        r[227] = "CaseBlock";
        r[228] = "NamespaceExportDeclaration";
        r[229] = "ImportEqualsDeclaration";
        r[230] = "ImportDeclaration";
        r[231] = "ImportClause";
        r[232] = "NamespaceImport";
        r[233] = "NamedImports";
        r[234] = "ImportSpecifier";
        r[235] = "ExportAssignment";
        r[236] = "ExportDeclaration";
        r[237] = "NamedExports";
        r[238] = "ExportSpecifier";
        r[239] = "MissingDeclaration";
        r[240] = "ExternalModuleReference";
        r[241] = "JsxElement";
        r[242] = "JsxSelfClosingElement";
        r[243] = "JsxOpeningElement";
        r[244] = "JsxText";
        r[245] = "JsxClosingElement";
        r[246] = "JsxAttribute";
        r[247] = "JsxSpreadAttribute";
        r[248] = "JsxExpression";
        r[249] = "CaseClause";
        r[250] = "DefaultClause";
        r[251] = "HeritageClause";
        r[252] = "CatchClause";
        r[253] = "PropertyAssignment";
        r[254] = "ShorthandPropertyAssignment";
        r[255] = "EnumMember";
        r[256] = "SourceFile";
        r[257] = "JSDocTypeExpression";
        r[258] = "JSDocAllType";
        r[259] = "JSDocUnknownType";
        r[260] = "JSDocArrayType";
        r[261] = "JSDocUnionType";
        r[262] = "JSDocTupleType";
        r[263] = "JSDocNullableType";
        r[264] = "JSDocNonNullableType";
        r[265] = "JSDocRecordType";
        r[266] = "JSDocRecordMember";
        r[267] = "JSDocTypeReference";
        r[268] = "JSDocOptionalType";
        r[269] = "JSDocFunctionType";
        r[270] = "JSDocVariadicType";
        r[271] = "JSDocConstructorType";
        r[272] = "JSDocThisType";
        r[273] = "JSDocComment";
        r[274] = "JSDocTag";
        r[275] = "JSDocParameterTag";
        r[276] = "JSDocReturnTag";
        r[277] = "JSDocTypeTag";
        r[278] = "JSDocTemplateTag";
        r[279] = "JSDocTypedefTag";
        r[280] = "JSDocPropertyTag";
        r[281] = "JSDocTypeLiteral";
        r[282] = "JSDocLiteralType";
        r[283] = "JSDocNullKeyword";
        r[284] = "JSDocUndefinedKeyword";
        r[285] = "JSDocNeverKeyword";
        r[286] = "SyntaxList";
        r[287] = "Count";
        r[56] = "FirstAssignment";
        r[68] = "LastAssignment";
        r[70] = "FirstReservedWord";
        r[105] = "LastReservedWord";
        r[70] = "FirstKeyword";
        r[138] = "LastKeyword";
        r[106] = "FirstFutureReservedWord";
        r[114] = "LastFutureReservedWord";
        r[154] = "FirstTypeNode";
        r[166] = "LastTypeNode";
        r[15] = "FirstPunctuation";
        r[68] = "LastPunctuation";
        r[0] = "FirstToken";
        r[138] = "LastToken";
        r[2] = "FirstTriviaToken";
        r[7] = "LastTriviaToken";
        r[8] = "FirstLiteralToken";
        r[11] = "LastLiteralToken";
        r[11] = "FirstTemplateToken";
        r[14] = "LastTemplateToken";
        r[25] = "FirstBinaryOperator";
        r[68] = "LastBinaryOperator";
        r[139] = "FirstNode";
        r[257] = "FirstJSDocNode";
        r[282] = "LastJSDocNode";
        r[273] = "FirstJSDocTagNode";
        r[285] = "LastJSDocTagNode";
        return r;
    }
}
class DtsFileProcessor {
    constructor(sourceFile) {
        this.sourceFile = sourceFile;
        this.indent = "";
        this.tokens = Tokens.getAll();
        this.processRoot(sourceFile);
    }
    processRoot(node) {
        this.processNode(node, () => {
            switch (node.kind) {
                case ts.SyntaxKind.SourceFile:
                    this.processChildren(node, new Map([
                        [ts.SyntaxKind.ImportDeclaration, (x) => this.processImportDeclaration(x)],
                        [ts.SyntaxKind.EndOfFileToken, (x) => { }]
                    ]));
                    break;
                default:
                    console.log(this.indent + "^----- UNKNOW ROOT ELEMENT");
                    this.logSubTree(node);
            }
        });
    }
    processImportDeclaration(node) {
        this.processChildren(node, new Map([
            [ts.SyntaxKind.ImportClause, (x) => {
                    this.processChildren(x, new Map([
                        [ts.SyntaxKind.NamedImports, (y) => {
                                this.processChildren(y, new Map([
                                    [ts.SyntaxKind.ImportSpecifier, (z) => {
                                            this.processChildren(z, new Map([
                                                [ts.SyntaxKind.Identifier, (t) => {
                                                        console.log("IDEN = " + t.text);
                                                    }]
                                            ]));
                                        }]
                                ]));
                            }]
                    ]));
                }],
            [ts.SyntaxKind.StringLiteral, (x) => {
                    console.log("TEXT = " + x.text);
                }]
        ]));
    }
    processChildren(node, map) {
        ts.forEachChild(node, x => {
            var f = map.get(x.kind);
            if (f) {
                this.processNode(x, () => f(x));
            }
            else {
                console.log(this.indent + "vvvvv----IGNORE ----vvvvv");
                this.processNode(x, () => this.logSubTree(x));
                console.log(this.indent + "^^^^^----IGNORE ----^^^^^");
            }
        });
    }
    logSubTree(node) {
        ts.forEachChild(node, x => {
            this.processNode(x, () => this.logSubTree(x));
        });
    }
    processNode(node, callb) {
        console.log(this.indent + this.tokens[node.kind]);
        this.indent += "    ";
        callb();
        this.indent = this.indent.substring(0, this.indent.length - 4);
    }
    report(node, message) {
        let obj = this.sourceFile.getLineAndCharacterOfPosition(node.getStart());
        console.log(`${this.sourceFile.fileName} (${obj.line + 1},${obj.character + 1}): ${message}`);
    }
}
console.log("----------------------------------------------");
const fileNames = process.argv.slice(2);
fileNames.forEach(fileName => {
    console.log("Process file " + fileName);
    let sourceFile = ts.createSourceFile(fileName, fs_1.readFileSync(fileName).toString(), ts.ScriptTarget.ES6, /*setParentNodes */ true);
    new DtsFileProcessor(sourceFile);
});
////////////////////////////////////////////////////////////////////////
