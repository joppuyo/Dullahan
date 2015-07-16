<?php

use \Dullahan\Migration\Migration;

class AddApiKeyMigration extends Migration
{
    public function up()
    {
		$this->capsule->schema()->create('api_keys', function($table){
			$table->increments('id');
			$table->string('name');
			$table->string('api_key');
			$table->timestamps();
		});
    }
}
