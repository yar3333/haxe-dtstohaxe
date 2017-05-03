build: DtsToHaxe.js

run: DtsToHaxe.js
	node DtsToHaxe.js test.d.ts

DtsToHaxe.js: DtsToHaxe.ts
	tsc $<
