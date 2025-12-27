<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Disable foreign key checks for MySQL
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // SQLite doesn't support ALTER COLUMN for enum, so we need to recreate the table
        // Step 1: Create new table with updated enum
        Schema::create('users_new', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->enum('role', ['admin', 'user'])->default('user');
            $table->enum('status', ['active', 'disabled'])->default('active');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('avatar')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // Step 2: Copy data and convert roles
        \DB::statement("
            INSERT INTO users_new (id, name, email, role, status, email_verified_at, password, avatar, remember_token, created_at, updated_at)
            SELECT 
                id, 
                name, 
                email, 
                CASE 
                    WHEN role = 'admin' THEN 'admin'
                    ELSE 'user'
                END as role,
                status,
                email_verified_at,
                password,
                avatar,
                remember_token,
                created_at,
                updated_at
            FROM users
        ");

        // Step 3: Drop old table and rename new one
        Schema::drop('users');
        Schema::rename('users_new', 'users');

        // Step 4: Recreate indexes and foreign keys
        Schema::table('users', function (Blueprint $table) {
            $table->unique('email');
        });
        
        // Re-enable foreign key checks
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Disable foreign key checks for MySQL
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Revert to old roles
        Schema::create('users_old', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->enum('role', ['admin', 'owner', 'tenant'])->default('tenant');
            $table->enum('status', ['active', 'disabled'])->default('active');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('avatar')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        \DB::statement("
            INSERT INTO users_old (id, name, email, role, status, email_verified_at, password, avatar, remember_token, created_at, updated_at)
            SELECT 
                id, 
                name, 
                email, 
                CASE 
                    WHEN role = 'admin' THEN 'admin'
                    ELSE 'tenant'
                END as role,
                status,
                email_verified_at,
                password,
                avatar,
                remember_token,
                created_at,
                updated_at
            FROM users
        ");

        Schema::drop('users');
        Schema::rename('users_old', 'users');

        Schema::table('users', function (Blueprint $table) {
            $table->unique('email');
        });
        
        // Re-enable foreign key checks
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
};
