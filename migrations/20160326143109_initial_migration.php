<?php

use \Dullahan\Migration\Migration;

class InitialMigration extends Migration
{
    public function up()
    {
        $this->capsule->schema()->create('users', function (\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id');
            $table->string('email', 191);
            $table->string('password');
            $table->timestamp('last_login')->nullable();
            $table->string('name')->nullable();
            $table->timestamps();
            $table->charset = DB_CHARSET;
            $table->collation = DB_COLLATION;
            $table->engine = 'InnoDB';
            $table->unique('email');
        });

        $this->capsule->schema()->create('tokens', function (\Illuminate\Database\Schema\Blueprint $table) {
            $table->string('value', 191);
            $table->integer('user_id')->unsigned();
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users');
            $table->charset = DB_CHARSET;
            $table->collation = DB_COLLATION;
            $table->engine = 'InnoDB';
            $table->unique('value');
        });

        $this->capsule->schema()->create('contents', function(\Illuminate\Database\Schema\Blueprint $table){
            $table->increments('id');
            $table->longtext('fields');
            $table->boolean('is_published');
            $table->integer('user_id')->unsigned();
            $table->string('content_type');
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users');
            $table->charset = DB_CHARSET;
            $table->collation = DB_COLLATION;
            $table->engine = 'InnoDB';
        });
    }
}
