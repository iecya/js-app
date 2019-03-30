# M&S

### Running

Node is necessary to run this application.

In order to run the application, first install the packages.
Navigate to the root directory and run:

```
npm install
```

To start the application run the following:

```
node ./server.js
```

Then navigate to http://localhost:3000/ in your browser


### General comments

On page load a request is sent to the server to get product's data based on product id; the product id is randomly selected.

#### Test requirements

Accordingly to the test description provided, I understand no framework should have been used both for the frontend and the backend. Unfortunately, I have not being able to do so and ended up using Express.
Please, bear in mind that my experience with JS application is limited to a single project for which a scaffold app was provided, full of existing functionality (i.e. routing, building, server, etc etc).
I put all my effort in trying to achieve my goal using vanilla JS but it took quite a long time and, at some point, I decided to move on with other things.
The first 2-3 commits will show my attempts with vanilla JS, hope it will be satisfying.

#### Security

For the test purpose I included the credential to access the API in the `server.js` file; as also commented in the file itself, credentials should never leave in plain text in the code.
Based on my experience those should be stored as environment variables in the machine/container where the app is running; assuming deployment in K8s, my approach would be to store the credentials in K8s secret and retrieve them when the pod starts up to store them in the pod env.


### Missing parts

#### Client side validation
The form at the moment doesn't set a default product/variant, nor is validated on submit. On submit the form should be validated to verify that a variant is selected (either by color, size or both).

#### Images
Each variant might have multiple images. To improve the UX a carousel/slideshow should be provided to allow them to have a full view of the product.

#### UI
I did my best to match the designs provided, however some minor parts won't look the same. For example, I used the default fonts as I couldn't access the one used in M&S website (used as reference during the test).
