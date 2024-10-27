## How to setup a new Typerscript and Express project

1.

```
npm init -y
```

2.

```
npm install -D typescript
npm i concurrently
```

3.

```
npx tsc --init
```

4.

```
Add the following scripts in package.json

{
    "build": "npx tsc",
    "watch": "npx tsc -w",
    "prestart": "npm run build",
    "start": "npx nodemon dist/index.js",
    "dev": "npx concurrently --kill-others \"npm run watch\" \"npm start\""
}
```

Note: Make relevant config changes in tsconfig.json

5.

```
npm run dev
```

## To start redis server

1.

```
ubuntu
```

2. 
```
sudo service redis-server start
```