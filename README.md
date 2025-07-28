# Taqwim DZ

Taqwim DZ is a mobile application designed to provide a robust event reminder system for users in Algeria and beyond. Built with React Native, it supports both Android and iOS platforms and integrates an intelligent SMS gateway for multi-channel notifications (SMS, Telegram, WhatsApp). The app leverages edge computing and IoT-based delivery to ensure reliable reminders, even offline, addressing limitations of traditional reminder systems.

## Features

- **Multi-Channel Notifications**: Receive reminders via SMS, Telegram, and WhatsApp for maximum reachability.
- **Offline Functionality**: Ensures reminders are delivered without internet access using IoT-based delivery (Raspberry Pi, GSM module, MQTT).
- **Google Calendar Synchronization**: Automatically fetches and caches events for seamless integration and offline operation.
- **Edge Computing**: Processes data locally to reduce latency and reliance on cloud infrastructure.
- **User-Friendly Mobile App**: Intuitive interface for managing events, notification preferences, and user profiles.
- **Customizable Notifications**: Choose delivery channels and access detailed event information.
- **Multi-Calendar & Time Zone Support**: Syncs multiple calendars and handles different time zones with real-time updates via API Webhooks.

For more details, visit the [Taqwim DZ website](https://taqwim-dz.vercel.app).

## Project Structure

```
├── .idea/                    # IDE configuration files
├── .vscode/                  # VS Code settings
├── android/                  # Android-specific code and resources
├── ios/                      # iOS-specific code and resources
├── assets/                   # Images, fonts, and other static assets
├── src/                      # Source code for the React Native app
├── .env.example              # Example environment variables
├── .gitignore                # Git ignore file
├── App.tsx                   # Main app component
├── app.config.ts             # App configuration
├── app.json                  # Expo app configuration
├── babel.config.js           # Babel configuration
├── eas.json                  # Expo Application Services configuration
├── global.css                # Global CSS styles
├── index.ts                  # Entry point for the app
├── metro.config.js           # Metro bundler configuration
├── nativewind-env.d.ts       # TypeScript declarations for NativeWind
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Locked dependency versions
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn or npm
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development)
- Raspberry Pi and GSM module (for IoT-based delivery)
- MQTT broker setup (for message transmission)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/khaledbenmachiche/taqwim-mobile.git
   cd taqwim-mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Copy `.env.example` to `.env` and configure required values (e.g., API keys for Google Calendar, Telegram, WhatsApp, MQTT broker credentials).

4. **Run the app**:
   - For development:
     ```bash
     npx expo start
     ```
   - For Android:
     ```bash
     npx expo run:android
     ```
   - For iOS:
     ```bash
     npx expo run:ios
     ```

### Configuration

- **Tailwind CSS**: Styling is handled via NativeWind, configured in `tailwind.config.js`.
- **Notifications**: Multi-channel notification logic is implemented in `App.tsx` and `src/` components.
- **Google Calendar API**: Configure API credentials in `.env` for event synchronization.
- **IoT Setup**: Set up Raspberry Pi with GSM module and MQTT for offline SMS delivery.
- **Edge Computing**: Ensure local processing is enabled for low-latency reminders.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Contact

For support or inquiries, visit [Taqwim DZ](https://taqwim-dz.vercel.app) or contact the development team at support@taqwim-dz.com.

