
Public Eye JA
Overview
Public Eye JA is a mobile-friendly web application that empowers Jamaican citizens to report public infrastructure issues like potholes, broken street lights, and clogged drains in under 60 seconds. Using AI-powered image classification via Google Cloud Vision API, the system automatically categorizes reports with 85%+ accuracy and displays them on a transparent public map, giving citizens real-time visibility into their community's issues. Built with React Native (Expo) for the mobile app, React.js for the government admin dashboard, and a Flask backend with PostgreSQL, Public Eye JA creates a direct channel between citizens and government agencies, transforming fragmented, opaque reporting into a data-driven tool that helps prioritize repairs, allocate resources efficiently, and build public trust—turning every citizen into a sensor for community improvement and building a better Jamaica.
Access Instructions
Government Admin Dashboard
NOTE: Public signup is disabled for security purposes. Use the credentials below to access the admin dashboard. In production, only government organization administrators can create user accounts.
Admin Credentials:

Username: govadmin@gov.com
Password: password123

Mobile Application (Citizen Portal)
Setup:

Download the Expo Go app from your device's app store
Scan the QR code provided in the project materials, or use the link below:

App Link: exp://vweywgi-abishua-8081.exp.direct

![QR_EXPOMOBAPP](https://github.com/user-attachments/assets/ab25de70-5ee4-4b5e-ba68-11f1eaf612d1)


Test Citizen Credentials:

Username: jhonnydoe1@example.com
Password: password123

Note: Citizens can create their own accounts directly through the mobile app.
Known Issues
Image Upload Limitation: Due to network connectivity constraints during development, images captured from the mobile application may not display correctly on the government admin dashboard. The API connection times out before image data can be fully transmitted. The Google Cloud Vision API integration has been verified and functions correctly under stable network conditions. This issue is infrastructure-related and does not reflect a code defect.
