<?php

namespace Dullahan\Migration;

use Illuminate\Database\Capsule\Manager as Capsule;
use Phinx\Migration\AbstractMigration;

class Migration extends AbstractMigration {
	/**
	 * @property $capsule Illuminate\Database\Capsule\Manager
	 */
	public $capsule;
	public function init(){
		$this->capsule = new Capsule;

		$this->capsule->addConnection([
		  'driver'    => 'mysql',
		  'host'      => DB_HOST,
		  'port'      => DB_PORT,
		  'database'  => DB_NAME,
		  'username'  => DB_USER,
		  'password'  => DB_PASSWORD,
		  'charset'   => 'utf8',
		  'collation' => 'utf8_unicode_ci',
		]);

		$this->capsule->bootEloquent();
		$this->capsule->setAsGlobal();
	}
}