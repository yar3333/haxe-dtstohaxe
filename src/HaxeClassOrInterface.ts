export interface HaxeVar
{
	haxeName : string;
	haxeType : string;
	haxeDefVal : string;
}

export interface HaxeVarGetter
{
	haxeName : string;
	haxeType : string;
	haxeBody : string;
}

export class HaxeClassOrInterface
{
	public type : "class" | "interface";

	fullClassName = "";
	baseFullClassName = "";
	baseFullInterfaceNames = new Array<string>();
	
	private imports = new Array<string>();
	private metas = new Array<string>();
	private vars = new Array<string>();
	private methods = new Array<string>();
	private customs = new Array<string>();
	
	constructor(type:"class"|"interface")
	{
		this.type = type;
	}
	
	public addImport(packageName:string) : void
	{
		this.imports.push("import " + packageName + ";");
	}
	
	public addMeta(meta:string) : void
	{
		this.metas.push(meta);
	}
	
	public addVar(v:HaxeVar, isPrivate:boolean=false, isStatic=false, isReadOnlyProperty=false) : void
	{
		var s = (isPrivate ? "" : "public ")
			  + (isStatic ? "static " : "")
			  + "var " + v.haxeName + (isReadOnlyProperty ? "(default, null)" : "") + " : " + v.haxeType
			  + (isStatic && v.haxeDefVal != null ? " = " + v.haxeDefVal : "")
			  + ";";
		this.vars.push(s);
 	}
	
	public addVarGetter(v:HaxeVarGetter, isPrivate = false, isStatic = false, isInline = false) : void
	{
		var s = "\n\t"
		      + (isPrivate ? "" : "public ")
			  + (isStatic ? "static " : "")
			  + "var " + v.haxeName + "(get_" + v.haxeName + ", null)" + " : " + v.haxeType
			  + ";\n";
		
		s += (isInline ? "\tinline " : "\t")
		   + "function get_" + v.haxeName + "() : " + v.haxeType + "\n"
		   + "\t{\n"
		   + this.indent(v.haxeBody.trim(), "\t\t") + "\n"
		   + "\t}";
		
		this.vars.push(s);
	}
	
	public addMethod(name:string, vars:Array<HaxeVar>, retType:string, body:string, isPrivate=false, isStatic=false) : void
	{
		var header = 
				(isPrivate ? '' : 'public ')
			  + (isStatic ? 'static  ' : '')
			  + 'function ' + name + '('
			  + vars.map((v:HaxeVar) => v.haxeName + ":" + v.haxeType + (v.haxeDefVal != null ? '=' + v.haxeDefVal : '')).join(', ')
			  + ') : ' + retType;
		var s = header;
		if (body !== null)
		{
			s += '\n';
			s += '\t{\n';
			s += this.indent(body.trim(), '\t\t') + '\n';
			s += '\t}';
		}
		else
		{
			s += ";";
		}
		
		this.methods.push(s);
 	}
	
	public addCustom(code:string) : void
	{
		this.customs.push(code);
	}
	
	public toString() : string
	{
		var clas = this.splitFullClassName(this.fullClassName);
		
		var s = "";

		if (clas.packageName) s += "package " + clas.packageName + ";\n\n";
		
		s += this.imports.join("\n") + (this.imports.length > 0 ? "\n\n" : "");
		
		s += this.metas.map(m => m + "\n").join("\n");
		s += this.type + " " + clas.className;

		switch (this.type)
		{
			case "class":
				s += (this.baseFullClassName ? " extends " + this.baseFullClassName : "") + "\n";
				if (this.baseFullInterfaceNames.length > 0) s += "\timplements " + this.baseFullInterfaceNames.join(", ") + "\n";
				break;

			case "interface":
				if (this.baseFullInterfaceNames.length > 0) s += " extends " + this.baseFullInterfaceNames.join(", ") + "\n";
				break;
		}

		s += "{\n";
		s += (this.vars.length > 0 ? "\t" + this.vars.join("\n\t") + "\n\n" : "");
		s += (this.methods.length > 0 ? "\t" + this.methods.join("\n\n\t") + "\n" : "");
		s += (this.customs.length > 0 ? "\t" + this.customs.join("\n\n\t") + "\n" : "");
		s += "}";

		return s;
	}
	
	private indent(text:string, ind = "\t") : string
    {
        if (text == '') return '';
		return ind + text.replace("\n", "\n" + ind);
    }
	
	private splitFullClassName(fullClassName:string) : { packageName:string, className:string }
	{
		var packageName = '';
		var className = fullClassName;
		
		if (fullClassName.lastIndexOf('.') != -1)
		{
			packageName = fullClassName.substr(0, fullClassName.lastIndexOf('.'));
			className = fullClassName.substr(fullClassName.lastIndexOf('.') + 1);
		}
		
		return { packageName:packageName, className:className };
	}
}