<div align="center">

# Fuel Rewards Mobile App

**React Native / Expo loyalty-app prototype for a fuel-station customer experience.**

Authentication, points, promotions, coupon redemption, notifications, profile settings, and bilingual ES/EN UI in a mobile-first application.

![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Android](https://img.shields.io/badge/Android-mobile-3DDC84?logo=android&logoColor=white)
![iOS](https://img.shields.io/badge/iOS-mobile-000000?logo=apple&logoColor=white)

</div>

## What It Does

The app models a customer loyalty flow for a fuel-station brand:

- register and sign in against a backend API;
- keep the active profile on-device with AsyncStorage;
- view accumulated points and a personal customer code;
- browse promotions and point requirements;
- redeem eligible coupons and generate redemption codes;
- receive local notifications when new promotions are detected;
- update profile information and profile picture;
- switch between Spanish and English;
- navigate through native stack/tab screens.

The project is a prototype and is **not an official Shell application**.

## Mobile Flow

```mermaid
flowchart LR
    LOGIN[Login / registration] --> HOME[Points dashboard]
    HOME --> PROMOS[Promotions]
    HOME --> COUPONS[Coupon redemption]
    HOME --> SETTINGS[Profile settings]
    PROMOS --> NOTIFY[Local notifications]
    LOGIN --> API[Backend API]
    HOME --> STORE[(AsyncStorage)]
    SETTINGS --> STORE
```

## App Structure

| Area | Implementation |
| --- | --- |
| Mobile UI | React Native + Expo |
| Navigation | React Navigation stack + bottom tabs |
| Authentication | Backend login/register API boundary |
| Local state | AsyncStorage |
| Promotions | Local mock-data service boundary |
| Coupon flow | Points validation + generated redemption codes |
| Notifications | Expo Notifications |
| Profile media | Expo Image Picker |
| Localization | Spanish / English translation layer |

## Tech Stack

`React Native` `Expo` `TypeScript` `React Navigation` `AsyncStorage` `Expo Notifications` `Expo Image Picker`

## Running the App

```bash
npm install
npm start
```

Then launch through Expo on the target platform:

```bash
npm run android
npm run ios
npm run web
```

The client resolves its backend URL from `EXPO_PUBLIC_API_URL` when configured and otherwise uses development host defaults.

## Running App

These screenshots are generated from the current application build by the repository's screenshot workflow. The workflow launches the local FastAPI backend, creates a synthetic demo account through the real registration endpoint, exports the Expo web application, signs in through the UI, and captures the authenticated screens.

<table>
  <tr>
    <td width="33%" align="center">
      <a href="assets/screenshots/fuel-rewards-login.png"><img src="assets/screenshots/fuel-rewards-login.png" width="240" alt="Fuel Rewards login screen"></a><br>
      <strong>Login</strong>
    </td>
    <td width="33%" align="center">
      <a href="assets/screenshots/fuel-rewards-register.png"><img src="assets/screenshots/fuel-rewards-register.png" width="240" alt="Fuel Rewards registration screen"></a><br>
      <strong>Register</strong>
    </td>
    <td width="33%" align="center">
      <a href="assets/screenshots/fuel-rewards-home.png"><img src="assets/screenshots/fuel-rewards-home.png" width="240" alt="Fuel Rewards points dashboard"></a><br>
      <strong>Home / Points</strong>
    </td>
  </tr>
  <tr>
    <td width="33%" align="center">
      <a href="assets/screenshots/fuel-rewards-promotions.png"><img src="assets/screenshots/fuel-rewards-promotions.png" width="240" alt="Fuel Rewards promotions screen"></a><br>
      <strong>Promotions</strong>
    </td>
    <td width="33%" align="center">
      <a href="assets/screenshots/fuel-rewards-coupons.png"><img src="assets/screenshots/fuel-rewards-coupons.png" width="240" alt="Fuel Rewards coupon exchange screen"></a><br>
      <strong>Coupon Exchange</strong>
    </td>
    <td width="33%" align="center">
      <a href="assets/screenshots/fuel-rewards-settings.png"><img src="assets/screenshots/fuel-rewards-settings.png" width="240" alt="Fuel Rewards account settings screen"></a><br>
      <strong>Settings</strong>
    </td>
  </tr>
</table>

The screenshots come from the running project, not design mockups. The account and promotion/coupon content shown are synthetic demo data. This project is not an official Shell application.

## Main Screens

The implemented screen set is: Login · Registration · Home / Points · Promotions · Coupon Exchange · Account Settings.

## Scope

This project demonstrates mobile application structure and customer-loyalty workflows. Promotion and coupon data includes prototype/demo content, and the repository should not be interpreted as a connection to Shell production systems.
