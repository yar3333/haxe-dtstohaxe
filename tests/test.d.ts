import { Scene, MyIden2 } from "./three-core";

export interface ColladaLoaderReturnType extends BaseInt, Abc {
    myfield: string;
    myfunc(a:number, b) : void;
}

export class ColladaLoader extends BaseInt implements Abc {
    animations: any[];
    kinematics: any;
    scene: Scene;
    
    constructor();

    load(url: string, onLoad: (model: ColladaModel) => void, onProgress?: (request: ProgressEvent) => void): void;
    setCrossOrigin(value: any): void;
    parse(text: string): ColladaModel;
}

class BaseInt {}
interface Abc {}
