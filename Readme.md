### Mongodb project: https://cloud.mongodb.com/v2/68f621a0136c7104effa19f3#/overview

### Installation (one-time only)
- `npm i` from each of project root , client and server folder 

### Local setup
(Instead of going to each 'client' and 'server' and run `npm run dev`)
- Using `concurrently` we can do `npm run dev` (from project root) to simultaneously run without any hassle 😃

## Project overview : Learning management system (like Udemy)
- As a student user, can login, view, buy and see course 
- As a instructor, can create, organize, and manage course content and structure
- Course viewer where student can complete his/her course lectures , rewatch course
- Payment is handled by a dummy api call
- Bulk course videos import functionality
- Built features including video streaming for purchased courses, real-time progress tracking, and enrollment management

### [Screenshots 📸 ](./screenshots/)

## Backend Techstack
- Cloudinary (images/video assets)
- mongodb + mongoose
- Nodejs + express
- Payments (dummy call)

## Frontend Techstack
- React + Typescript + Vite
- Tailwind + Shadcn
- React Player 

### Notes:
1) For backend, running locally,  create a .env.local file and populate values with the following: 
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.lsv3m63.mongodb.net/
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
