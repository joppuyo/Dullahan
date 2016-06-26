<?php

use \Dullahan\Migration\Migration;

class AddAppTokenMigration extends Migration
{
    public function up()
    {
        $this->capsule->schema()->rename('tokens', 'user_tokens');

        $this->capsule->schema()->create('apps', function(\Illuminate\Database\Schema\Blueprint $table){
            $table->increments('id');
            $table->string('name');
            $table->boolean('has_icon')->default(false);
            $table->text('description')->nullable();
            $table->string('token', 191);
            $table->timestamps();
            $table->charset = DB_CHARSET;
            $table->collation = DB_COLLATION;
            $table->engine = 'InnoDB';
            $table->unique('token');
        });
    }
}
