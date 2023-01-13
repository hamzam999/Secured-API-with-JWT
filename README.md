Tech Stack: Node JS, Express JS
Authentication: JSON Web Tokens
DB used: MongoDB
Sensitive variables are stored in a .env file which is not uploaded in this repo.

This application is tested on POSTMAN and the screenshots of the same are provided below.

Signup: when a user signup the DB is checked for existing username and email if the user does not exits then a new user is created along with a JWT along with a payload that will expire in 24 hours.
![image](https://user-images.githubusercontent.com/40526398/212409732-e268320e-c00a-4e54-b892-1bab1e1f12df.png)

Login route: when a user tries to login the credentials are verified and a JWT is created along with a payload that will expire in 24 hours.
![image](https://user-images.githubusercontent.com/40526398/212409618-34c53c04-a632-4e71-b848-230c3084cdc9.png)

User route: After logging in a user can view its information by passing the token a header 'x-auth-token'.
![image](https://user-images.githubusercontent.com/40526398/212411191-f3ec2c06-d0d4-4c3b-ae6e-8b6ab2fb71b1.png)

Logout route: Since JWT cannot be destroyed or expired manually on the server side.
A message is displayed 'you are logged out'