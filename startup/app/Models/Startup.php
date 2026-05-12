<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Startup extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'startups';

    protected $fillable = [
        'founder_id',
        'name',
        'tagline',
        'domain',
        'stage',
        'funding_ask',
        'team_size',
        'pitch_deck_url',
        'tags',
        'dipp_registered',
        'badge_verified',
        'views',
        'description'
    ];

    protected $casts = [
        'tags'            => 'array',
        'dipp_registered' => 'boolean',
        'badge_verified'  => 'boolean',
    ];
}