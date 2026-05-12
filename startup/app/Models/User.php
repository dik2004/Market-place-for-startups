<?php
namespace App\Models;

use MongoDB\Laravel\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'name', 'email', 'password',
        'role', 'bio', 'linkedin',
        'domain', 'ticket_size'
    ];

    protected $hidden = ['password', 'remember_token'];

    public function tokens()
    {
        return $this->morphMany(PersonalAccessToken::class, 'tokenable');
    }

    public function currentAccessToken()
    {
        return $this->accessToken;
    }

    public function withAccessToken($accessToken)
    {
        $this->accessToken = $accessToken;
        return $this;
    }
}