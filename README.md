# Chat-App
Chat-app with nestjs along with mongoDB.

# Description
This backend application provides

1. Authentication with jwt
2. Admin can invite user by email as well as any user can sign up using public sign up.
3. Chats with users (individual)
4. Chats in groups 
5. Group Admins (that can add users, remove users, remove messages)
6. Users can create groups. The user which create group will be admin of this group.
7. Further admin role can be given to multiple users and revoke as well
8. It also have real time audio call and video call feature
9. Real time subtitiles in video call

# Status
In process... Please wait while dev completed. 

1. Authentication (developed)
2. Sign Up / login / whoami (developed)
3. Real time chat between users (In process)
4. Group creation (TODO)
5. Real time chat in groups (TODO)
6. Group admin features (TODO)
7. Audio calls (TODO)
8. Video calls (TODO) 

# Database
1. Mongo 

# Getting started

## Pre-requisites
1. Node 20.17.0
2. Nestjs 10.4.4
3. MongoDB 7.0.12 Community

## Running the app

1. npm i
2. create db and update env accordingly
3. seed data using npm run seed (script in package.json)
4. nest start

## Authentication
For authentication JWT is used with passport strategy

## APi-Documentation
Swagger documentation, accessible via {baseurl}/api-documentation e.g. http://localhost:3000/api-documentation