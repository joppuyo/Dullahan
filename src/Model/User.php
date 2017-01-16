<?php
namespace Dullahan\Model;

use Illuminate\Database\Eloquent\Model;
use Alsofronie\Uuid\Uuid32ModelTrait;

class User extends Model
{
    use Uuid32ModelTrait;

    protected $hidden = [
        'password'
    ];

    public function user_tokens()
    {
        return $this->hasMany('Dullahan\Model\UserToken');
    }

    public function content()
    {
        return $this->hasMany('Dullahan\Model\Content');
    }
}
