# 1️⃣ CREATE – Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js and resources.js)
    participant B as Backend (Express Route)
    participant V as express-validator
    participant DB as PostgreSQL
    participant L as Log Service

    U->>F: Submit form
    F->>F: Client-side validation
    F->>B: POST /api/resources (JSON)

    B->>V: Validate request
    V-->>B: Validation result

    alt Validation fails
        B-->>F: 400 Bad Request + errors[]
        F-->>U: Show validation message
    else Validation OK
        B->>DB: INSERT INTO resources
        DB-->>B: Created resource / duplicate error
        alt Duplicate
            B->>L: logEvent("duplicate blocked")
            L-->>B: OK
            B-->>F: 409 Conflict
            F-->>U: Show duplicate message
        else Success
            B->>L: logEvent("resource created")
            L-->>B: OK
            B-->>F: 201 Created
            F-->>U: Show success message
        end
    end
```

# 2️⃣ READ — Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js and resources.js)
    participant B as Backend (Express Route)
    participant DB as PostgreSQL

    U->>F: open resource page
    F->>B: GET /api/resources

    B->>DB: SELECT * FROM resources ORDER BY created_at DESC
    DB-->>B: data / DB error

    alt DB Error
        B-->>F: 500 Internal Server Error + "Database error"
    else Success
        B-->>F: 200 OK + data
        F-->>U: show resource list
    end



```

# 3️⃣ UPDATE — Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js and resources.js)
    participant B as Backend (Express Route)
    participant V as express-validator
    participant DB as PostgreSQL
    participant L as Log Service

    U->>F: Submit form
    F->>F: Client-side validation
    F->>B: PUT /api/resources/:id

    B->>V: Validate request
    V-->>B: Validation result

    alt Validation fails
        B-->>F: 400 Bad Request + errors[]
        F-->>U: Show validation message
    else Validation OK
        B->>DB: UPDATE resources
        DB-->>B: updated resource / duplicate error
        alt Duplicate
            
            B-->>F: 409 Conflict
            F-->>U: Show duplicate message
        else Success
            B->>L: logEvent("resource updated")
            L-->>B: OK
            B-->>F: 200 OK
            F-->>U: Show success message
        end
    end
```

# 4️⃣ DELETE — Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js and resources.js)
    participant B as Backend (Express Route)
    participant DB as PostgreSQL
    participant L as Log Service

    U->>F: Submit delete request
    F->>B: DELETE /api/resources/:id
    B->>DB: DELETE FROM resources WHERE id=$1
    DB-->>B: rowCount

        alt Resource not found
            B-->>F: 404 Not Found + "Resource not fiound"
        else Success
            B->>L: logEvent("resource deleted")
            L-->>B: OK
            B-->>F: 204 No content
            F-->>U: Show success message
        end
    
```