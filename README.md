<img height="150px" src="https://res.cloudinary.com/bytefury/image/upload/v1574149856/Crater/craterframe.png">

## Disclaimer

This repo is a personal project I started on my React Native learning path.
It is not meant to release a production-ready application (at least not yet), but instead for educational purpose.

Here the changes I've planned (there's no change on the backend side).

- [x] Move some features in dedicated directories.
- [x] Convert class components into functional components.
- [x] Upgrade navigation to v5
- [x] Improve translations
- [ ] Replace the redux-form package (form data should not be stored in global state)
- [ ] Improve calls to the API (by caching for example)
- [ ] Upgrade or remove deprecated packages
- [ ] Optimize data access in redux store  with memoization
- [ ] Optimize data access in redux store  with normalization (use [normalizr](https://github.com/paularmstrong/normalizr))
- [ ] Add tests

## Introduction

Crater is an open-source web & mobile app that helps you track expenses, payments & create professional invoices & estimates.

This repository contains the source code for the mobile app clients for [Crater](https://craterapp.com).

Its built with Expo (React Native).

*Please note:* To use this app on your mobile device, you need to have the crater app installed on your server. Once the app is installed and configured on your server. You can simply input your endpoint URL and use your app login credentials to log into your account. See [here](#web) to know more about the web version.

# Table of Contents

1. [Installation](#installation)
2. [Web Version Link](#web)
3. [Mobile App Links](#mobile-app-links)
4. [Credits](#credits)
5. [License](#license)

## Installation
Below are the steps for starting up the crater app locally for development. If you aren't looking to customise or contribute to mobile apps then you can ignore the steps below and use the Crater [IOS & Android Apps](#mobile-app-links) directly.

- Clone this repository
- Install Expo CLI : `npm install -g expo-cli`
- Change your current working directly in terminal to the cloned folder: `cd crater`
- run command: `npm start`

## Web
- [Repository Link](https://github.com/bytefuryco/crater)
- [Download Link](https://craterapp.com/downloads)

## Mobile App Links
- [Android](https://play.google.com/store/apps/details?id=com.craterapp.app)
- [IOS](https://apps.apple.com/app/id1489169767)

## Credits
Crater is a product of [Bytefury](https://bytefury.com)

## License
Crater is released under the Attribution Assurance License.
See [LICENSE](LICENSE) for details.
