# Textile Shop Backend

Spring Boot REST API backend for the Textile Shop application.

## Features

- **Authentication**: JWT-based authentication with login/register endpoints
- **Product Management**: CRUD operations for textile products with barcode support
- **Billing System**: Invoice generation with PDF export
- **Security**: Spring Security with JWT token validation
- **Database**: MySQL with JPA/Hibernate

## Prerequisites

- Java 11 or higher
- Maven 3.6+
- MySQL 8.0+

## Setup Instructions

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE textile_db;
```

### 2. Configure Database

Update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/textile_db?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

### 3. Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The server will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/register` - Register new user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/barcode/{code}` - Get product by barcode
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/search?q={query}` - Search products
- `GET /api/products/barcode/{code}/image` - Generate barcode image

### Billing
- `POST /api/billing/invoice` - Create new invoice
- `GET /api/billing/invoices` - Get all invoices
- `GET /api/billing/invoice/{id}` - Get invoice by ID
- `GET /api/billing/invoice/{id}/pdf` - Download invoice as PDF

## Default Credentials

The application creates a default admin user on first run (check `data.sql`):
- Username: `admin`
- Password: `admin`

## Technologies

- Spring Boot 2.7.12
- Spring Security
- Spring Data JPA
- MySQL
- JWT (jjwt)
- ZXing (Barcode generation)
- iText (PDF generation)
- Lombok

## Project Structure

```
src/main/java/com/example/textile/
├── controller/        # REST Controllers
├── model/            # JPA Entities
├── repository/       # Spring Data Repositories
├── security/         # Security configuration & JWT
├── service/          # Business logic services
└── TextileBackendApplication.java
```

## CORS Configuration

The backend is configured to accept requests from the Angular frontend running on `http://localhost:5200`.
