<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $customer = $this->route('customer');

        return [
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'email'      => [
                'required',
                'email',
                Rule::unique('customers', 'email')->ignore($customer->id),
                Rule::unique('users', 'email')->ignore($customer->user_id),
            ],
            'phone'      => 'required|digits_between:10,13',
            'address'    => 'nullable|string|max:255',
        ];
    }
}