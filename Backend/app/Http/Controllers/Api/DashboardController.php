<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;

class DashboardController extends Controller
{
    // GET /api/dashboard/stats
    public function stats()
    {
        return response()->json([
            'total_customers'  => Customer::count(),
            'new_last_7_days'  => Customer::where('created_at', '>=', now()->subDays(7))->count(),
            'new_last_30_days' => Customer::where('created_at', '>=', now()->subDays(30))->count(),
            'self_registered'  => Customer::whereNotNull('user_id')->count(),
            'recent_customers' => Customer::latest()
                ->take(5)
                ->get(['id', 'first_name', 'last_name', 'email', 'created_at']),
        ]);
    }
}