<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    // VIEW MY PROFILE: GET /api/profile
    public function show(Request $request)
    {
        return response()->json($request->user()->customer);
    }

    // UPDATE MY PROFILE: PUT /api/profile
    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();
        $customer = $user->customer;

        $customer->update($request->validated());

        // Keep the login's name and email in sync
        $user->update([
            'name'  => $customer->first_name . ' ' . $customer->last_name,
            'email' => $customer->email,
        ]);

        return response()->json([
            'message'  => 'Profile updated successfully',
            'customer' => $customer,
        ]);
    }

    // DELETE MY ACCOUNT: DELETE /api/profile
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The password is incorrect.'],
            ]);
        }

        $user->tokens()->delete();   // log out everywhere
        $user->customer->delete();   // soft delete

        return response()->json(['message' => 'Your account has been deleted']);
    }
}