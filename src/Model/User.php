<?php
namespace Dullahan\Model;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $hidden = [
        'password'
    ];

    function user_tokens()
    {
        return $this->hasMany('Dullahan\Model\UserToken');
    }

    function content()
    {
        return $this->hasMany('Dullahan\Model\Content');
    }
}
