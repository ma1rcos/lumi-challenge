## Observations and instructions

##### Observation:

The project carried out meets the functional requirements of the documentation. The front-end does what needs to be done and the same goes for the back-end. However, some points are worth noting. Are they:

1. Only controller unit tests were implemented. Why? The backend service layer has many private methods. Only service class methods can call these methods. Therefore, it was not possible to unit test these methods. And, as the controller's methods necessarily call the service's public methods, only tests in the controller would cover the testing stage.
2. To test private attributes, I could change the encapsulation to public, but the test would be in an unrealistic scenario.

##### Wireframe link in figma:

https://www.figma.com/file/6Wk5Kola2a9BMuwN3Sez1R/PNG-to-SVG-(Community)?type=design&node-id=0%3A1&mode=design&t=AkSjniKu2IuBZbzR-1

###### Some observations about wireframe:

Despite knowing how to prototype screens in figma, I do not have knowledge of UI and UX. So, I made a simple interface.

##### Instructions:

1. If you have Docker installed and configured, create a Docker image for the database. To do this, run the following commands, in root backend directory, in the order they appear: 
1 => `docker build -t postgres-image .`
2 => `docker run -d -p 5432:5432 --name postgres-container postgres-image`

2. If you are unable to use Docker, use a local or cloud database, with the appropriate credentials configured and modify the .env file to authenticate to the created database.

3. Run the following commands in the root of the backend directory:

1 => `npm i`
2 => `npx prisma migrate dev --name init`
3 => `npm run start:dev`

4. For more details, access the readme.md file contained in the backend directory.
5. In the root of the frontend directory, run the command `yarn`.
6. Afterwards, execute the command in the root of the previous directory: `yarn start`.
7. For more details, access the readme.md file contained in the frontend directory.
8. Use the application.

If any point is not clear, contact me by email: mfbdcarvalho@gmail.com, or whatasapp (11) 973821072.