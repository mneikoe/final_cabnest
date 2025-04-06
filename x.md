Here's a comprehensive Postman API testing guide for your application:

1. Postman Environment Setup
   Create a new environment with these variables:

json
Copy
{
"base_url": "http://localhost:5000",
"token": "JWT_TOKEN_VALUE",
"student_id": "",
"admin_id": "",
"slot_id": "",
"booking_id": ""
} 2. Authentication API Tests

1. Student Registration

http
Copy
POST {{base_url}}/api/auth/register
Content-Type: application/json

{
"name": "John Student",
"email": "john@student.com",
"password": "123456",
"location": "Delhi"
} 2. Admin Registration (if allowed)

http
Copy
POST {{base_url}}/api/auth/register
Content-Type: application/json

{
"name": "Admin User",
"email": "admin@college.com",
"password": "admin123",
"role": "admin"
} 3. Login (Student)

http
Copy
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
"email": "john@student.com",
"password": "123456"
} 4. Login (Admin)

http
Copy
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
"email": "admin@college.com",
"password": "admin123"
} 5. Get User Profile

http
Copy
GET {{base_url}}/api/auth/profile
Authorization: Bearer {{token}} 3. Student API Tests

1. Get Available Slots

http
Copy
GET {{base_url}}/api/students/slots?date=2024-03-20
Authorization: Bearer {{token}} 2. Book Ride

http
Copy
POST {{base_url}}/api/students/book
Authorization: Bearer {{token}}
Content-Type: application/json

{
"goSlotId": "{{slot_id}}",
"returnSlotId": "{{slot_id}}",
"date": "2024-03-20"
} 3. Get My Bookings

http
Copy
GET {{base_url}}/api/students/bookings
Authorization: Bearer {{token}} 4. Cancel Booking

http
Copy
DELETE {{base_url}}/api/students/bookings/{{booking_id}}
Authorization: Bearer {{token}} 4. Admin API Tests

1. Generate Slots

http
Copy
POST {{base_url}}/api/admin/generate-slots
Authorization: Bearer {{token}}
Content-Type: application/json

{
"location": "Delhi",
"date": "2024-03-20"
} 2. Get All Slots

http
Copy
GET {{base_url}}/api/admin/slots?date=2024-03-20
Authorization: Bearer {{token}} 3. Update Slot

http
Copy
PUT {{base_url}}/api/admin/slots/{{slot_id}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
"capacity": 15
} 4. Get All Students

http
Copy
GET {{base_url}}/api/admin/students
Authorization: Bearer {{token}} 5. Get Booking Stats

http
Copy
GET {{base_url}}/api/admin/stats
Authorization: Bearer {{token}} 6. Add Rides to Student

http
Copy
POST {{base_url}}/api/admin/students/{{student_id}}/add-rides
Authorization: Bearer {{token}}
Content-Type: application/json

{
"rides": 10
} 5. Postman Collection Structure
Create these folders in your Postman collection:

Authentication

Register Student

Register Admin

Login Student

Login Admin

Get Profile

Student Operations

Get Available Slots

Book Ride

Get Bookings

Cancel Booking

Admin Operations

Generate Slots

Get All Slots

Update Slot

Delete Slot

Get Students

Get Stats

Add Rides

6. Testing Flow Recommendations
   Start with Authentication

Register test users

Login and save tokens to environment variables

Admin Setup

Generate slots for test date

Verify slots creation

Student Flow

Get available slots

Book rides

Check bookings

Cancel booking

Admin Monitoring

Check booking stats

Modify slots

Manage student rides
