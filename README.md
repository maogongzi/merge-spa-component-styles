<h2>Installation</h2>

<div>
  Before mount this plugin You'll need to run `extract-text-webpack-plugin` inside Vue section in order to extract component styles first.
</div>

```js
  const MergeSPAComponentStyles = require('merge-spa-component-styles');

  // inside your webpack **plugins** list:
  new MergeSPAComponentStyles({
    // check whether current chunk is a SPA
    // assetName format: css/pages/home.css, css/base.css, etc.
    // you'll need to return a regex instance containing the SPA's name like
    // the `(.+)` group below.
    // but return `false` if current chunk is not a SPA
    spaTester: (assetName) => {
      let res = assetName.match(/css\/pages\/(.+)?\.css/);
      if (res) {
        return res;
      }

      res = assetName.match(/css\/(base)\.css/);
      if (res) {
        return res;
      }

      return false;
    },

    // define a resolver to solve the found SPA's corresponding component
    // styles which have already been extracted from inside the `vue` loaders.
    // which will receive the aforementioned SPA name as it's parameter in order to find the SPA's components chunk.
    comsResolver: (spaName) => {
      return 'css/components/' + spaName +'.css';
    }
  })
```

<h2>What will the result be like?</h2>
<div>
  <h3>Before using it</h3>

inside `css/pages/home.css`:
```css
body {
  color: airblue;
}
```

inside `css/components/home.css`:
```css
.MyNiceVueComponent {
  font-size: 20px;
  border: 1px solid red;
}
```

  <h3>After using it</h3>

inside `css/pages/home.css`:
```css
body {
  color: airblue;
}

.MyNiceVueComponent {
  font-size: 20px;
  border: 1px solid red;
}
```
</div>