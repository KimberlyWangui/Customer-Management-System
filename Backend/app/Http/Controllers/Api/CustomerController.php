<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    // LIST + SEARCH: GET /api/customers?search=jane
    public function index(Request $request)
    {
        $search = $request->query('search');

        $customers = Customer::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10);

        return response()->json($customers);
    }

    // ADD: POST /api/customers
    public function store(StoreCustomerRequest $request)
    {
        $customer = Customer::create($request->validated());

        return response()->json([
            'message'  => 'Customer created successfully',
            'customer' => $customer,
        ], 201);
    }

    // VIEW ONE: GET /api/customers/{id}
    public function show(Customer $customer)
    {
        return response()->json($customer);
    }

    // UPDATE: PUT /api/customers/{id}
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $customer->update($request->validated());

        // If this customer has a login, keep its name and email in sync
        if ($customer->user) {
            $customer->user->update([
                'name'  => $customer->first_name . ' ' . $customer->last_name,
                'email' => $customer->email,
            ]);
        }

        return response()->json([
            'message'  => 'Customer updated successfully',
            'customer' => $customer,
        ]);
    }

    // DELETE: DELETE /api/customers/{id}
    public function destroy(Customer $customer)
    {
        // Log them out everywhere, if they have a login
        $customer->user?->tokens()->delete();

        $customer->delete(); // soft delete: fills in deleted_at

        return response()->json(['message' => 'Customer deleted successfully']);
    }
}