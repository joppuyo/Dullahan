<?php
namespace Dullahan\Model;

use Illuminate\Database\Eloquent\Model;
use Alsofronie\Uuid\Uuid32ModelTrait;

/**
 * Class Content
 *
 * @package Dullahan\Model
 * @property string $title
 * @property array  $fields
 * @property string $slug
 *
 *
 */
class Content extends Model
{
    use Uuid32ModelTrait;

    protected $table = 'content';

    public function user()
    {
        return $this->belongsTo('Dullahan\Model\User');
    }

    protected $casts = [
        'fields' => 'array',
        'is_published' => 'boolean',
      ];
}
