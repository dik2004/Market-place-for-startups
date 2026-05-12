<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Laravel\Sanctum\Contracts\HasAbilities;

class PersonalAccessToken extends Model implements HasAbilities
{
    protected $connection = 'mongodb';
    protected $collection = 'personal_access_tokens';
    protected $guarded = [];

    protected $casts = [
        'abilities'    => 'array',
        'expires_at'   => 'datetime',
        'last_used_at' => 'datetime',
    ];

    public function tokenable()
    {
        return $this->morphTo('tokenable');
    }

    public function can($ability): bool
    {
        return in_array('*', $this->abilities ?? []) ||
               in_array($ability, $this->abilities ?? []);
    }

    public function cant($ability): bool
    {
        return !$this->can($ability);
    }

   public static function findToken($token)
{

    if (str_contains($token, '|')) {
        [$id, $plainToken] = explode('|', $token, 2);
        
        // Search all tokens and find matching one
        $tokens = static::all();
        foreach ($tokens as $instance) {
            if (hash_equals($instance->token, hash('sha256', $plainToken))) {
                return $instance;
            }
        }
    }
    
    return static::where('token', hash('sha256', $token))->first();
}
}