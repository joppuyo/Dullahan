<?php

namespace Dullahan\Model;

use Illuminate\Database\Eloquent\Model;
use Alsofronie\Uuid\Uuid32ModelTrait;

class App extends Model
{
    use Uuid32ModelTrait;

    protected $casts = [
        'has_icon' => 'boolean',
    ];
}
