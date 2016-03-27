<?php
namespace Dullahan\Model;

use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    function user()
    {
        return $this->belongsTo('Dullahan\Model\User');
    }
}