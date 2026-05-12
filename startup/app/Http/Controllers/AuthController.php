<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email',
            'password' => 'required|min:6',
            'role'     => 'required|in:founder,investor,collaborator',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
        ]);

        $token = Str::random(60);

        $user->tokens()->create([
            'name'       => 'auth_token',
            'token'      => hash('sha256', $token),
            'abilities'  => ['*'],
        ]);

        return response()->json([
            'user'  => $user,
            'token' => $user->getKey() . '|' . $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = Str::random(60);

        $user->tokens()->create([
            'name'      => 'auth_token',
            'token'     => hash('sha256', $token),
            'abilities' => ['*'],
        ]);

        return response()->json([
            'user'  => $user,
            'token' => $user->getKey() . '|' . $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}