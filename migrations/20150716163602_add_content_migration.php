<?php

use \Dullahan\Migration\Migration;

class AddContentMigration extends Migration
{
    public function up()
    {
		$this->capsule->schema()->create('contents', function($table){
			$table->increments('id');
			$table->string('title');
			$table->string('slug');
			$table->longtext('fields');
			$table->boolean('is_published');
			$table->integer('user_id')->unsigned();
			$table->string('content_type');
			$table->timestamps();
			$table->foreign('user_id')->references('id')->on('users');
		});
    }
}
