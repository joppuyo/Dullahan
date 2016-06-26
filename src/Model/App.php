<?php

namespace Dullahan\Model;

use Illuminate\Database\Eloquent\Model;

class App extends Model
{
    protected $casts = [
        'has_icon' => 'boolean',
    ];
}
