<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
       if (! $request->user() || $request->user()->role !== $role) {
           return response()->json([
                'message' => 'You do not have permission to access this.',
           ], 403);
       }
       return $next($request);
    }
}
