# Garment Samples Database

A scalable, cloud-based database system for managing garment samples using Firebase Firestore with a RESTful API.

## Features

- Store all sample garment information
- Use unique style ID as the key for fast lookups
- RESTful API for CRUD operations
- Scalable design that can be extended with images, QR metadata, status, etc.

## Tech Stack

- Firebase Firestore (NoSQL database)
- Node.js
- Express.js
- Joi (validation)
- JavaScript

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Firebase account

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Navigate to Firestore Database and click "Create database"
4. Start in test mode for development (switch to production rules later)
5. Choose a location for your database
6. From the Project Overview, add a web app
7. Register the app with a nickname
8. Copy the Firebase configuration (apiKey, authDomain, etc.)

### Project Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   # Server configuration
   PORT=3000

   # Firebase configuration
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Samples

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/samples | Get all samples |
| GET    | /api/samples/:styleId | Get sample by style ID |
| POST   | /api/samples | Create a new sample |
| PUT    | /api/samples/:styleId | Update a sample |
| DELETE | /api/samples/:styleId | Delete a sample |

### Sample API Requests

#### Create a Sample
```
POST /api/samples
Content-Type: application/json

{
  "style_id": "ABC123",
  "price": 29.99,
  "available_colors": ["Red", "Blue", "Black"],
  "quantity": 100,
  "packaging": {
    "type": "Poly Bag",
    "dimensions": {
      "length": 30,
      "width": 20,
      "height": 5
    },
    "weight": 250
  }
}
```

#### Get a Sample
```
GET /api/samples/ABC123
```

## Testing the API

A Postman collection is included in the repository (`postman_collection.json`). Import this collection into Postman to test the API endpoints.

## Data Schema

Each document in the `samples` collection represents a garment sample with the following fields:

- `style_id`: Unique identifier for the style (document ID)
- `price`: Price of the garment
- `available_colors`: Array of available colors
- `quantity`: Available quantity
- `packaging`: Object containing packaging details
  - `type`: Type of packaging
  - `dimensions`: Object containing dimensions
    - `length`: Length in cm
    - `width`: Width in cm
    - `height`: Height in cm
  - `weight`: Weight in grams
- `created_at`: Timestamp when the record was created
- `updated_at`: Timestamp when the record was last updated

## Future Extensions

The schema is designed to be easily extended with additional fields such as:

- Image URLs
- QR code data
- Supplier information
- Status tracking
- Manufacturing details
- Location data

## Security Rules

For production deployment, update the Firestore security rules to restrict access based on authentication and authorization requirements.

## License

MIT
