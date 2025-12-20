# Installation Instructions for Laravel Backend

## Prerequisites

1. **PHP 8.2 or higher** - Required for Laravel 12
2. **Composer** - PHP dependency manager
3. **Database** (MySQL, PostgreSQL, or SQLite)

## Step 1: Install PHP

### Option A: Laravel Herd (Recommended)
- Download from: https://herd.laravel.com/windows
- Includes PHP 8.2+ and Composer pre-configured
- Best option for Laravel development

### Option B: Manual PHP Installation
- Download PHP 8.2+ from: https://windows.php.net/download/
- Extract to `C:\php`
- Add `C:\php` to your system PATH:
  1. Open System Properties → Environment Variables
  2. Edit "Path" variable
  3. Add `C:\php`

### Option C: XAMPP
- Download from: https://www.apachefriends.org/
- Includes PHP, Apache, and MySQL
- PHP is usually located at `C:\xampp\php`

## Step 2: Install Composer

1. Download Composer-Setup.exe from: https://getcomposer.org/download/
2. Run the installer
3. The installer will detect your PHP installation
4. Composer will be added to your PATH automatically

## Step 3: Verify Installation

Open a new PowerShell/Command Prompt and run:
```powershell
php -v
composer --version
```

Both commands should show version information.

## Step 4: Install Laravel Dependencies

Navigate to the backend folder and run:
```powershell
cd backend
composer install
```

## Step 5: Configure Environment

1. Copy `.env.example` to `.env` (if it exists):
   ```powershell
   copy .env.example .env
   ```

2. Generate application key:
   ```powershell
   php artisan key:generate
   ```

3. Configure your database in `.env` file

## Step 6: Run Migrations

```powershell
php artisan migrate
```

## Troubleshooting

- If `php` or `composer` commands are not recognized, restart your terminal after installation
- Make sure PHP and Composer are added to your system PATH
- For XAMPP users, you may need to use full path: `C:\xampp\php\php.exe artisan migrate`


