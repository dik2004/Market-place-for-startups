<?php
namespace App\Http\Controllers;

use App\Models\EOI;
use App\Models\Startup;
use Illuminate\Http\Request;

class EOIController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'startup_id' => 'required',
            'message'    => 'required|string|max:500',
        ]);

        $exists = EOI::where('investor_id', auth()->id())
                     ->where('startup_id', $request->startup_id)
                     ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already sent EOI'], 409);
        }

        $eoi = EOI::create([
            'investor_id' => auth()->id(),
            'startup_id'  => $request->startup_id,
            'message'     => $request->message,
            'status'      => 'pending',
        ]);

        return response()->json($eoi, 201);
    }

    public function forStartup($startupId)
    {
        $startup = Startup::findOrFail($startupId);

        if ($startup->founder_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $eois = EOI::where('startup_id', $startupId)->get();
        return response()->json($eois);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:accepted,rejected']);

        $eoi     = EOI::findOrFail($id);
        $startup = Startup::findOrFail($eoi->startup_id);

        if ($startup->founder_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $eoi->update(['status' => $request->status]);
        return response()->json($eoi);
    }

    public function mine()
    {
        return response()->json(
            EOI::where('investor_id', auth()->id())->get()
        );
    }
}