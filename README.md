# adChain Registry Web App

> Interface for applying, voting, and challenging domain entries into the adChain Registry.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[ ![Codeship Status for AdChain/AdChainRegistryDapp](https://app.codeship.com/projects/3bdbcb30-abc8-0135-1d7c-326c62bbc0df/status?branch=master)](https://app.codeship.com/projects/256831)

# Live

[https://publisher.adchain.com](https://publisher.adchain.com)

# Install

```bash
npm install
```

# Development

```bash
npm run start:dev
```

Then head over to [http://localhost:3000/](http://localhost:3000/)

Lint and test

```bash
npm run lint:fix && npm test
```

## Docker Development

To test build locally:
   - install Docker 
   - ```cd ``` into the project root
   - run ```docker build ./```
   - copy the **container id**

To see your container on host environment:
   - run ```docker run -it --expose 8000 -p 8000:8000``` **put container id here**
   - Open browser and navigate to [http://localhost:8000](http://localhost:8000/)


# License

MIT
