
## About
## Environment Setup (Requirements)

Before running the task management project ensure that these requirement are met:
- **Node.js** (recommended version: 18.x or later)  
  Check version:  
    ```
    node -v
    ```

- **.NET SDK** (recommended version: 8.0 or later)  
  Check version:  
    ```
    dotnet --version
    ```

- **Microsoft SQL Server**


## Setup Instructions
### Step 1: Create the Database (Optional)
Run the script to ensure the database exists and it will create automatically if it doesnt :

 [`scripts/ensure-db-exists.sql`](task_management_kpmg.Server/Scripts/ensure-db-exists.sql)

 ```sql
 -- Content of ensure-db-exist.sql
DECLARE @dbName NVARCHAR(128)
SET @dbName = 'TaskDb'

IF NOT EXISTS (
    SELECT name FROM sys.databases WHERE name = @dbName
)
BEGIN
    EXEC('CREATE DATABASE [' + @dbName + ']')
    PRINT 'Database created.'
END
ELSE
BEGIN
    PRINT 'Database already exists.'
END
```

two option of executing the script:

1. Bash

```
sqlcmd -S localhost -d master -i scripts/ensure-db-exists.sql
```

2. Alternatively, you can run the SQL script manually using a graphical tool like SQL Server Management Studio (SSMS) or Azure Data Studio

### Step 2: Configure Connection String
This project uses Dapper (not Entity Framework), and it connects to a Microsoft SQL Server using the connection string in [`/appsettings.json`](task_management_kpmg.Server/appsettings.json):

```
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost\\MSSQLSERVER01;Database=TaskDb;Trusted_Connection=True;TrustServerCertificate=True;"
}

```

#### How to configure:
- Replace localhost\\MSSQLSERVER01 with your SQL Server instance name
    - Use localhost, . or localhost\\SQLEXPRESS if you're using SQL Express.
- Trusted_Connection=True enables Windows Authentication.
    - To use SQL Server authentication instead, use:
```ini
Server=localhost;Database=TaskDb;User Id=sa;Password=your_password;TrustServerCertificate=True;
```

#### Override via environment variable (optional):

You can override the connection string by setting an environment variable.

By default, the app reads the connection string from `appsettings.json`. To override, set the environment variable `ConnectionStrings__DefaultConnection` (note the double underscore).

For example (Windows PowerShell):

```powershell
$Env:ConnectionStrings__DefaultConnection="Server=localhost;Database=TaskDb;Trusted_Connection=True;"
dotnet run
```


### Step 3: Run the Backend (Migrations Apply Automatically)


cd into backend directory

```bash
cd .\task_management_kpmg.Server\
```

Once the database exists, to avoid SSL errors, run the command below to trust the ssl certificates


```bash
dotnet dev-certs https --trust
```

and then, we can start the backend project (Migration will apply automatically):

```bash
dotnet run --project task_management_server
```

### Step 4: Run the Frontend Application
Once the backend is up and running, the front-end is next, return to the project directory and cd to Front end directory


```bash
cd .\task_management_kpmg.Client\
```

Install dependencies 

```bash
npm install 
```

run application, which will be assigned to Port 59247
```bash
npm run dev
```

Open your browser and go to https://localhost:59247 to view the app.



## API Documentation

The API collection file can be found inside the `HAR` directory. You can import this file into tools like Postman to explore and test the available endpoints.

---

### Available Endpoints

#### 1. Get All Tasks
- **URL:** `GET /api/tasks`
- **Description:** Retrieves a list of all tasks.
- **Response:** Returns an array of task objects.
- **Example:**
  ```bash
  curl -X GET https://localhost:7232/api/tasks
  ```

#### 2. Get Task by ID
- **URL:** `GET /api/tasks/{id}`
- **Description:** Retrieves a single task by its unique ID.
- **Response:** Returns the task object if found.
- **Example:**
  ```bash
  curl -X GET https://localhost:7232/api/tasks/1
  ```

#### 2. Create a Task
- **URL:** `POST /api/tasks`
- **Description:** Creates a new task with the provided details.
- **Body:**
  ```json
  {
    "title": "Fix user login bug",
    "description": "Users are unable to log in when their passwords contain special characters...",
    "status": "toDo",
    "priority": "high",
    "dueDate": "2025-07-23"
  }
  ```

#### 3. Update a Task
- **URL:** `PUT /api/tasks/{id}`
- **Description:** Updates an existing task with the provided details.
- **Body:**
  ```json
  {
    "title": "Fix user login bug",
    "description": "Update: Add more logging for debugging.",
    "status": "inProgress",
    "priority": "medium",
    "dueDate": "2025-07-30"
  }
  ```
- **Example:**
  ```bash
  curl -X PUT https://localhost:7232/api/tasks/1 \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Fix user login bug",
      "description": "Update: Add more logging for debugging.",
      "status": "inProgress",
      "priority": "medium",
      "dueDate": "2025-07-30"
    }'
  ```

#### 4. Delete a Task
- **URL:** `DELETE /api/tasks/{id}`
- **Description:** Deletes a task by its ID.
- **Response:** Returns a success message or status.
- **Example:**
  ```bash
  curl -X DELETE https://localhost:7232/api/tasks/1
  ```




## Usage Examples
## Assumption and Limitations

