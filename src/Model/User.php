<?php
namespace Dullahan\Model;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $hidden = [
        'password'
    ];

    function tokens()
    {
        return $this->hasMany('Dullahan\Model\Token');
    }

    function content()
    {
        return $this->hasMany('Dullahan\Model\Content');
    }
}