### API DOCs

| HTTP Method | Route                            | Description                           |
|-------------|-----------------------------------|---------------------------------------|
| GET         | `/api/users`                     | Fetch all users                      |
| GET         | `/api/users/:userId`             | Fetch a user by ID                   |
| GET         | `/api/users/:userId/notes`       | Fetch all notes for a user           |
| GET         | `/api/users/:userId/tags`        | Fetch all tags for a user            |
| GET         | `/api/users/:userId/notes/filter`| Fetch filtered notes for a user      |
| GET         | `/api/tags/:tagId`               | Fetch a tag by ID                    |
| POST        | `/api/users`                     | Create a new user                    |
| POST        | `/api/notes`                     | Create a new note                    |
| POST        | `/api/tags`                      | Create a new tag                     |
| POST        | `/api/tags/bulk`                 | Create multiple new tags             |
| PUT         | `/api/notes/:noteId`             | Update a note                        |
| PUT         | `/api/notes/:noteId/archive`     | Archive or unarchive a note          |
| PUT         | `/api/tags/:tagId`               | Update a tag                         |
| DELETE      | `/api/notes/:noteId`             | Delete a note                        |
| DELETE      | `/api/tags/:tagId`               | Delete a tag                         |


### **README: Command Cheat Sheet**
#### File Structure
my-project/
├── db/
│   ├── pool.js         # Database connection pool setup
│   ├── queries.js      # CRUD operations for users/comments
│   ├── populate_db.js  # Example usage: create tables, insert seed data
│   ├── update_db.js    # Update database schema or data
├── data/
│   ├── app_data.json   # Optional: JSON file for seed data
├── .env                # Environment variables (template provided)
├── index.js            # Main app entry point
├── Procfile            # Heroku process file
├── package.json        # Node.js package configuration
└── README.md           # Project setup and instructions


#### **1. Initialize Node.js Project and Install Dependencies**
1. Navigate to the project directory in your terminal:
   ```bash
   cd <project-folder>
   ```

2. Initialize a new Node.js project:
   ```bash
   npm init -y
   ```

3. Install necessary dependencies:
   ```bash
   npm install express pg dotenv cors
   ```


---

#### **2. Initialize Git Repository**
Go to github and create a new repo 
https://github.com/new

1. Initialize a new Git repository:
   ```bash
   git init
   ```


3. Stage and commit the initial files:
   ```bash
   git add .
   git commit -m "Initial project setup"
   ```

4. Set the remote repository:
   ```bash
   git remote add origin <your-github-repo-url>
   ```

5. Push the code to the remote repository:
   ```bash
   git branch -M main
   git push -u origin main
   ```

---

#### **3. Setup Database Functions Using PostgreSQL**
1. **Update `db/queries.js`**:
   - imports pool.js code
   - Add functions to create the required tables for the project, and functions for queries that can create data in each of the tables
   - Include proper error handling and meaningful logs for debugging.

2. **Update `db/populate_db.js`**:
   - Use functions from `queries.js` to create the tables and add initial data.
   - Include logs to confirm successful operations or errors.
    - 
---


#### **4. Set Up Heroku Database**
1. **Create Heroku App and Add Database**:
   - Log in to Heroku CLI:
     ```bash
     heroku login
     ```
   - Create a new Heroku app:
     ```bash
     heroku create <your-app-name>
     ```
   - Add a Heroku Postgres add-on:
     ```bash
     heroku addons:create heroku-postgresql:essential-0 --app <your-app-name>

     ```
   - Retrieve the `DATABASE_URL`(db can take a min to setup, be patient) :
     ```bash
     heroku config --app <your-app-name>
     ```
   - Add the `DATABASE_URL` to your local `.env` file:
     ```plaintext
     DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<database>
     ```

2. **Populate the Database Locally**:
   - Run the `populate_db.js` script locally to create tables and insert sample data:
     ```bash
     node db/populate_db.js
     ```


#### **5. Deploy and Test on Heroku**
1. Push the code to Heroku:
   ```bash
   git push heroku main
   ```

2. Run the `populate_db.js` script on Heroku to populate the remote database:
   ```bash
   heroku run node db/populate_db.js --app <your-app-name>
   ```

3. Verify the database tables and data:
   ```bash
   heroku pg:psql --app <your-app-name>
   \dt  -- List tables
   SELECT * FROM movies;  -- Check data
   ```

4. Open the app in your browser to verify it works:
   ```bash
   heroku open --app <your-app-name>
   ```

---

#### **6. Test the App**
1. Open the app in your browser:
   ```bash
   heroku open --app <your-app-name>
   ```

2. Test API endpoints using tools like `curl` or Postman:
   ```bash
   curl https://<your-app-name>.herokuapp.com/api/users
   ```

3. Check logs for debugging:
   ```bash
   heroku logs --tail --app <your-app-name>
   ```

---

### **UI Notes: Frontend Note CRUD**

#### **1. Define Classes**
- Create classes for `User` and `Note` to organize and structure data.
- Example Data Types:
  - **Users**: `[ { id: 1, username: 'jane_23' } ]`
  - **Notes** for user ID 1:
    ```json
    {
      "id": 1,
      "title": "Meeting Notes",
      "content": "Discuss project deadlines.",
      "createdat": "2024-12-31T01:41:29.634Z",
      "updatedat": "2024-12-31T01:41:29.634Z",
      "isarchived": false,
      "userid": 1,
      "tagids": []
    }
    ```

---

#### **2. Initialize User**
- **Init Function**: Create a function that initializes the test user data.
- **Fetch User by ID**: Use `GET /api/users/:userId` to fetch a user by their ID.
- Assign the user data to a **global variable** to simplify incremental testing of the notes app.
- Example Test User:
  ```json
  {
    "id": 1,
    "username": "jane_23"
  }
  ```

---

#### **3. Build UI for Viewing Notes**
- **UI Components**:
  - **Vertical List of Notes**:
    - Each note is displayed as a button (container).
    - Show the title and the first 80 characters of the note content.
  - **Where to Get Data**:
    - API Endpoint: `/api/users/:userId/notes`
    - Example Data Object:
      ```json
      {
        "id": 1,
        "title": "Meeting Notes",
        "content": "Discuss project deadlines.",
        "createdat": "2024-12-31T01:41:29.634Z",
        "updatedat": "2024-12-31T01:41:29.634Z",
        "isarchived": false,
        "userid": 1,
        "tagids": []
      }
      ```

---

#### **4. View States**
- **Enum for View States**:
  - Use an enum to manage and identify different UI states.
  - Initial view state: `'home'`.
- **Track Current View State**:
  - Maintain a global variable for the current view state.
  - Components are conditionally rendered based on the view state.

#### **5. Home Section UI**
- **Component Structure**:
  - Header
  - Notes List (conditionally rendered based on the view state).
- **Preparing for Extensibility**:
  - Move existing UI into the home section component.
  - Simplify future expansion of view states.

---

#### **6. Build UI for Viewing a Note**
- **View State**:
  - Called `'note'`.
  - Triggered by clicking a note in the home view.
- **UI Components**:
  - **Top Row**:
    - **Go Back Button**: Changes the view state to `'home'`.
    - **Delete Button**:
      - Black-on-white trash icon.
      - URL: [https://play.rosebud.ai/assets/icon-delete.jpg?Xvlb](https://play.rosebud.ai/assets/icon-delete.jpg?Xvlb).
  - **Note Section**:
    - Header displaying the note title.
    - Vertical list of note details:
      - Tags
      - Last edited timestamp (formatted).
    - Text content:
      - Style: `whitespace: pre-wrap`.
      - Scrollable if necessary.
