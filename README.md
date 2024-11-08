# node-xdf
Extensible Data Format (XDF) for persisting multi-modal, time-series data with metadata

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
  - [XdfReader](#xdfreader)
- [Test Doubles](#test-doubles)

## Overview

This package is a Node wrapper around the C++ [libxdf](https://github.com/sccn/libxdf) library. It uses a [fork](https://github.com/neurodevs/libxdf) of the library to serialize the XDF data to a JSON string that Node can use. It was developed and tested on a macOS system with an M-series chip.

## Installation (macOS)

First, you need to install the [forked libxdf](https://github.com/neurodevs/libxdf) library.

```bash
git clone https://github.com/neurodevs/libxdf.git
cd libxdf && cmake -S . -B build && cmake --build build
sudo mkdir -p /opt/local/lib/
sudo cp build/libxdf.dylib /opt/local/lib/
```

Then, install the package with your preferred package manager:

`npm install @neurodevs/node-xdf` 

or 

`yarn add @neurodevs/node-xdf`

## Usage

### XdfReader

```typescript
import { XdfReaderImpl } from '@neurodevs/node-xdf'

async function loadXdf() {
    const reader = await XdfReaderImpl.Create()

    const data = await reader.load('/path/to/xdf')
    console.log('XDF Data:', data)
}
```

## Test Doubles

This package was developed using test-driven development (TDD). If you also follow TDD, you'll likely want test doubles to fake, mock, or spy certain behaviors for these classes.

```typescript
import { XdfReaderImpl, FakeXdfReader } from '@neurodevs/node-lsl'

async function someTestFunction() {
    XdfReaderImpl.Class = FakeXdfReader
    const fake = await XdfReaderImpl.Create()
}
```
