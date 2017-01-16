<?php

use \Dullahan\Migration\Migration;

class InitialMigration extends Migration
{
    public function up()
    {
        $this->capsule->schema()->create('users', function (\Illuminate\Database\Schema\Blueprint $table) {
            $table->char('id', 32);
            $table->string('email', 191);
            $table->string('password');
            $table->timestamp('last_login')->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->timestamps();
            $table->unique('email');
            $table->primary('id');
            $table->charset = DB_CHARSET;
            $table->collation = DB_COLLATION;
            $table->engine = 'InnoDB';
        });

        $this->capsule->schema()->create('user_tokens', function (\Illuminate\Database\Schema\Blueprint $table) {
            $table->string('value', 191);
            $table->char('user_id', 32);
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users');
            $table->unique('value');
            $table->primary('value');
            $table->charset = DB_CHARSET;
            $table->collation = DB_COLLATION;
            $table->engine = 'InnoDB';
        });

        $this->capsule->schema()->create('content', function(\Illuminate\Database\Schema\Blueprint $table){
            $table->char('id', 32);
            $table->longtext('fields');
            $table->boolean('is_published');
            $table->char('user_id', 32);
            $table->string('content_type');
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users');
            $table->primary('id');
            $table->charset = DB_CHARSET;
            $table->collation = DB_COLLATION;
            $table->engine = 'InnoDB';
        });

        $this->capsule->schema()->create('apps', function(\Illuminate\Database\Schema\Blueprint $table){
            $table->char('id', 32);
            $table->string('name');
            $table->boolean('has_icon')->default(false);
            $table->text('description')->nullable();
            $table->string('token', 191);
            $table->timestamps();
            $table->unique('token');
            $table->primary('id');
            $table->charset = DB_CHARSET;
            $table->collation = DB_COLLATION;
            $table->engine = 'InnoDB';
        });
    }
}
