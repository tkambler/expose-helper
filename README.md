# Expose Helper

[Expose](https://github.com/Jack000/Expose) is a static site generator with which beautiful photo-essay web
sites can be created. This repository contains a helper application that assists with the creation of such
sites. When launched, the application allows the user to drag over a photo to be included as part of an
Expose-based site. The user can then use their mouse to define the desired polygon dimensions within which the
photo's text will be displayed.

The resulting metadata can be saved to the appropriate location by choosing File -> Save Metadata.

## Getting Started

A build process that compiles the application into a finished OS X / Windows binary has not yet been put in place - that will be done shortly. In the meantime, the application can be launched from the terminal. You'll
need Node.js installed.

If you don't already have Grunt installed, install it with:

```
$ npm i grunt-cli --global
```

```
$ git clone git@github.com:tkambler/expose-helper.git
$ cd expose-helper
$ npm start
```

Afterwards, the application can be launched with:

```
$ grunt
```

## Additional Notes

- When you are done defining your polygon's dimensions, double-click to finish. If you are not happy with the
result, you can begin clicking to define new dimensions.

## License

The MIT License (MIT)
Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
