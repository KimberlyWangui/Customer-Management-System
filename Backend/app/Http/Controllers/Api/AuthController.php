<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // 1. REGISTER: create a login + a customer record, then return a token
    public function register(Request $request)
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'email'      => 'required|email|unique:users,email|unique:customers,email',
            'phone'      => 'required|digits_between:10,13',
            'address'    => 'nullable|string|max:255',
            'password'   => 'required|string|min:8|confirmed',
        ]);

        $user = DB::transaction(function () use ($data) {
            $user = User::create([
                'name'     => $data['first_name'] . ' ' . $data['last_name'],
                'email'    => $data['email'],
                'password' => Hash::make($data['password']),
                'role'     => 'customer',
            ]);

            $user->customer()->create([
                'first_name' => $data['first_name'],
                'last_name'  => $data['last_name'],
                'email'      => $data['email'],
                'phone'      => $data['phone'],
                'address'    => $data['address'] ?? null,
            ]);

            return $user;
        });

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user'    => $user->load('customer'),
            'token'   => $token,
        ], 201);
    }

    // 2. LOGIN: check email + password, then return a token
    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The email or password is incorrect.'],
            ]);
        }

        if ($user->role === 'customer' && ! $user->customer) {
            throw ValidationException::withMessages([
            'email' => ['This account has been deleted.'],
          ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user'    => $user->load('customer'),
            'token'   => $token,
        ]);
    }

    // 3. LOGOUT: delete the token that was used for this request
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }

    // 4. ME: return whoever is logged in
    public function me(Request $request)
    {
        return response()->json($request->user()->load('customer'));
    }
}