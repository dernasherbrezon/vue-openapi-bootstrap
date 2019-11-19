## Screenshots

![screen1](/doc/1.png?raw=true)
![screen2](/doc/2.png?raw=true)

## Usage

```javascript
<template>
  <vue-openapi-bootstrap :openapi="openapi"></vue-openapi-bootstrap>
</template>

<script>
import vueOpenapiBootstrap from 'vue-openapi-bootstrap/src/vue-openapi-bootstrap'
export default {
  components: {vueOpenapiBootstrap},
  data () {
    return {
      openapi: {}
    }
  }
}
</script>
```

## Build Setup

``` bash
# install dependencies
npm install

# build for production with minification
npm run build

```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader). 
