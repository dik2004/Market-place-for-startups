<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class EOI extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'eois';

    protected $fillable = [
        'investor_id',
        'startup_id',
        'message',
        'status',
    ];
}