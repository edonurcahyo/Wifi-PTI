@extends('layouts.admin')

@section('title', 'Dashboard')

@section('content')
    <h2>Selamat datang, {{ Auth::guard('admin')->user()->nama_admin }} 👋</h2>
    <p>Ini adalah halaman dashboard utama Admin WiFian.</p>
@endsection
