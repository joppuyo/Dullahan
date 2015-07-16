<?php

use \Dullahan\Migration\Migration;

class InitialMigration extends Migration
{
	public function up()
	{
		$this->capsule->schema()->create('activations', function ($table) {
			$table->increments('id');
			$table->integer('user_id')->unsigned();
			$table->string('code');
			$table->boolean('completed')->default(0);
			$table->timestamp('completed_at')->nullable();
			$table->timestamps();

			$table->engine = 'InnoDB';
		});

		$this->capsule->schema()->create('persistences', function ($table) {
			$table->increments('id');
			$table->integer('user_id')->unsigned();
			$table->string('code');
			$table->timestamps();

			$table->engine = 'InnoDB';
			$table->unique('code');
		});

		$this->capsule->schema()->create('reminders', function ($table) {
			$table->increments('id');
			$table->integer('user_id')->unsigned();
			$table->string('code');
			$table->boolean('completed')->default(0);
			$table->timestamp('completed_at')->nullable();
			$table->timestamps();
		});

		$this->capsule->schema()->create('roles', function ($table) {
			$table->increments('id');
			$table->string('slug');
			$table->string('name');
			$table->text('permissions')->nullable();
			$table->timestamps();

			$table->engine = 'InnoDB';
			$table->unique('slug');
		});

		$this->capsule->schema()->create('role_users', function ($table) {
			$table->integer('user_id')->unsigned();
			$table->integer('role_id')->unsigned();
			$table->nullableTimestamps();

			$table->engine = 'InnoDB';
			$table->primary(['user_id', 'role_id']);
		});

		$this->capsule->schema()->create('throttle', function ($table) {
			$table->increments('id');
			$table->integer('user_id')->unsigned()->nullable();
			$table->string('type');
			$table->string('ip')->nullable();
			$table->timestamps();

			$table->engine = 'InnoDB';
			$table->index('user_id');
		});

		$this->capsule->schema()->create('users', function ($table) {
			$table->increments('id');
			$table->string('email');
			$table->string('password');
			$table->text('permissions')->nullable();
			$table->timestamp('last_login')->nullable();
			$table->string('first_name')->nullable();
			$table->string('last_name')->nullable();
			$table->timestamps();

			$table->engine = 'InnoDB';
			$table->unique('email');
		});
	}
}
