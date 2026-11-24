# Transcendence
This project has been created as part of the 42 curriculum by lguerbig, tle-floc, pchalmin, ael-atmi and tilegran.

> [!CAUTION]
> This project anwser to the v18 of the project with is not the latest vesion nowadays. 

## Desciption

## Content
[Table of contents]


## Compiling and Running the Project
You can use make commands to build, run, and manage your front-end and back-end containers, as well as to recompile source files during development.

### Build and run containers
```bash
make
```
or,
```bash
make up
```
Both commands will build the front-end and back-end containers and start them.

### Development mode
You can also use:
```bahs
make dev
```
Use this for development. It recompiles all TypeScript (`.ts`) and CSS (`.css`) files from `src` (for both front-end and back-end) and `public` (front-end only) directories without rebuilding the containers.

> [!TIP]
> The containers will stay attached to your terminal. Press `Ctrl+C` to stop them.

### Full rebuild
```bash
make re
```
This runs:
	`make clean` – removes all built containers and compiled files.
	`make up` – rebuilds and starts the containers from scratch.

### Retry running in dev mode
```bash
make retry
```
This runs:
	`make down` – stops and removes running containers.
	`make dev` – restarts the containers in development mode and recompiles source files.

## Subject
[Global directives] (based on the PDF)
[Our goals]

## Technologies used

## Project architecture
[tree]

...

## Sources
### Documentation
- TypeScript : https://www.typescriptlang.org/docs/
- HTMLint : https://htmlhint.com/
- ESLint : https://eslint.org/docs/latest/
- ESLint Parser : https://typescript-eslint.io/packages/parser/
- ESLint Stylistic : https://eslint.style/

### Convention
- TypeScript : https://ts.dev/style/
- SQLite : https://nodejs.org/api/sqlite.html
- HTML : https://www.w3schools.com/htmL/html5_syntax.asp
- CSS : https://www.w3schools.com/css/css_syntax.asp

### Utils
- Figma : https://www.figma.com/design/wg7bGU0KpypDmY3oOYij7i/Squelette?node-id=0-1&t=qWQYNu3hxw5eczve-1
- Excalidraw : https://excalidraw.com/#room=5d70f3e7c32fd3e972c9,rHn_zBCNQYGJspL2u9MZBQ
- Google Sheets : https://docs.google.com/spreadsheets/d/1ktLkwKtNEt1qTSRgfhirjpgNRBK502MYdi7dMi4ijN4/edit?usp=sharing

### Elo
- The Glicko system : https://www.glicko.net/glicko/glicko.pdf
- Glicko rating system : https://en.wikipedia.org/wiki/Glicko_rating_system
- Elo rating system : https://fr.wikipedia.org/wiki/Classement_Elo
- Glicko (1 & 2) documentation : https://www.glicko.net/glicko.html

### Images
- Cropping and Resizing Animated Gifs with Gifsicle : https://stevegrunwell.com/blog/cropping-resizing-gifsicle
- High performance Node.js image processing : https://sharp.pixelplumbing.com/
