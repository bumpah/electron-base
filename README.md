## Typescript/Electron App development base project

**Minimalistic custom base project for Electron desktop -application development with Typescript and React.(whitout any useless dependencies outside of Nodejs core, as many seem to favor pull in)**  
All development files are placed under src-folder and by default `npm run start / yarn start` -script will launch code compiling, Electron application and reload application on code/file -changes.

- devDependencies `@types/node, @types/react, @types/react-dom, electron, typescript@next`
- dependencies `react, react-dom`
- scripts `start` which will start Electron app and watch for code/file -changes and reload app onchange
