<?php
namespace Dullahan\Model;

use Cartalyst\Sentinel\Users\EloquentUser;

class User extends EloquentUser {
	function content(){
		return $this->hasMany('Dullahan\Model\Content');
	}
}