<?php
namespace Dullahan\Model;

use Illuminate\Database\Eloquent\Model;

class User extends Model {
	function content(){
		return $this->hasMany('Dullahan\Model\Content');
	}
}