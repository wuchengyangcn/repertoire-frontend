# repertoire-frontend

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Deploy as iOS application

```
ionic capacitor run ios
```

### Build docker image

```
docker build -t musicnbrain/repertoire-frontend .
```

### Run docker image

```
docker run -d -p 8080:8080 --name repertoire-frontend musicnbrain/repertoire-frontend
```

### Deploy

```
./build.sh
```

### CI/CD

```
echo "0 * * * * ~/repertoire-frontend/sync.sh" | crontab -
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
