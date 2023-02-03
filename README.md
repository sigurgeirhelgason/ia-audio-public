# ia-audio

[![Build and deploy backend to Azure Web App](https://github.com/tomasdanjonsson/ia-audio/actions/workflows/main_iaaudio.yml/badge.svg?branch=main)](https://github.com/tomasdanjonsson/ia-audio/actions/workflows/main_iaaudio.yml)

## Requirements

- [Expo](https://expo.dev/) (SDK44) - "Framework to build React Native apps"
- [git](https://git-scm.com/) (2.x.x) - Úgáfustjórnunarkerfi
- [NodeJS](https://nodejs.org/en/) (16.x.x) - "asynchronous event-driven JavaScript runtime"
- [npm](https://www.npmjs.com/) (8.x.x) - Pakkastjórnunarkerfi fyrir Nodejs
- [Python](https://www.python.org/) (3.9.x) - Python er túlkað, hlutbundið, æðra forritunarmál með kviklegt gildissvið.
- [Pip](https://pypi.org/project/pip/) (20.x.x) - Pakkastjórnunarkerfi fyrir Python
- [Just](https://github.com/casey/just) (1.0.0) - Keyrslu skipari "Command runner"

## Frontend

React Native Expo

## Backend

Django rest framework

### Getting Started

Run `npm install` inside the folder `src/frontend` then `expo start`

## Directory Structure

```text
.
├── .github
│   └── ISSUE_TEMPLATE
│       └── workflows
│           └── main_iaaudio.yml
├── docs
│   ├── assets
│   └── skyrsla.pdf
├── scripts
│   ├── README.md
│   └── verify_local_dev_env.sh
├── src
│   ├── frontend
│   │   ├── assets
│   │   ├── src
│   │   │   ├── components
│   │   │   ├── constants
│   │   │   ├── hooks
│   │   │   ├── screens
│   │   │   ├── store
│   │   │   └── util
│   │   ├── App.js
│   │   ├── Justfile
│   │   └── package.json
│   └── backend
│       ├── auth
│       ├── book
│       ├── ia_audio
│       ├── media
│       ├── static
│       ├── tests
│       ├── userAPI
│       ├── Justfile
│       ├── manage.py
│       └── requirements.txt
├── .gitignore
├── Justfile
└── README.md
```
