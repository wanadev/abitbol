---
title: Getting Started
autotoc: true
menuOrder: 1
---

# Getting Started

## Standalone Version (browser)

To use the standalone version, first [download the latest zip][dl-zip] or clone
the git repository:

    git clone https://github.com/wanadev/abitbol.git

Then, just include one of the javascript of the `dist/` folder:

```html
<script src="dist/abitbol.js"></script>
```

## NPM

To use Abitbol with Node.js (or in the browser using Browserify), first install
the library:

    npm install --save abitbol

Then require it when needed:

```javascript
var Class = require("abitbol");
```

[dl-zip]: https://github.com/wanadev/abitbol/archive/master.zip
