<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $user = $this->user();
        $customer = $user->customer;

        return [
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'email'      => [
                'required',
                'email',
                Rule::unique('customers', 'email')->ignore($customer->id),
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'phone'      => 'required|digits_between:10,13',
            'address'    => 'nullable|string|max:255',
        ];
    }
}