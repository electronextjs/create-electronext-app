# Electron + Next + Typescript application example

![ElectroNext.js Example](https://electronextjs.github.io/.github/public/preview.png)

This example show how you can use Next.js inside an Electron application to avoid a lot of configuration, use Next.js router as view and use server-render to speed up the initial render of the application. Both Next.js and Electron layers are written in TypeScript and compiled to JavaScript during the build process.

| Part        | Source code (Typescript) | Builds (JavaScript)   |
| ----------- | ------------------------ | --------------------- |
| Electron.js | `/Electron`              | `/Electron/.electron` |
| Next.js     | `/Next`                  | `/Next/.next`         |
| Production  |                          | `/dist`               |

For development it's going to run a HTTP server and let Next.js handle routing. In production it use `next export` to pre-generate HTML static files and use them in your app instead of running an HTTP server.

## Install
```
npm i -g create-electronext-app
```
or 
### Usage

```
npx create-electronext-app app-name
```

```
cd app-name
npm run dev
#or
yarn dev
```

### Available commands:

```bash
"build-next": build and transpile Next.js layer
"build-electron": transpile electron layer
"build": build both layers
"dev": start dev version
"dist": create production electron build
"type-check": check TypeScript in project
```

## Notes

You can create the production app using `npm run dist`.

_note regarding types:_

- Electron provides its own type definitions, so you don't need @types/electron installed!
  source: https://www.npmjs.com/package/@types/electron
- There were no types available for `electron-next` at the time of creating this example, so until they are available there is a file `electron-next.d.ts` in `Electron` directory.


## Related
- [Electron.js](https://www.electronjs.org)
- [Next.js](https://nextjs.org)
## License
ElectroNext.js is licensed under the MIT License

##

![ElectroNext.js Example](https://electronextjs.github.io/.github/public/preview.desktop.830x.png)
