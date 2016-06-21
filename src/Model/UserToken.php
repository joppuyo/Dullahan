<?php
namespace Dullahan\Model;

use Illuminate\Database\Eloquent\Model;

class UserToken extends Model
{
    function user()
    {
        return $this->belongsTo('Dullahan\Model\User');
    }
}
