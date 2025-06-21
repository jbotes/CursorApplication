import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { key } = await request.json();

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { error: 'API key is required and must be a string' },
        { status: 400 }
      );
    }

    // Check if the API key exists in the database
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', key.trim())
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to validate API key' },
        { status: 500 }
      );
    }

    if (data) {
      // API key found - return success response
      return NextResponse.json({
        status: 200,
        message: 'API Key valid!',
        data: {
          key: data.key,
          name: data.name,
          monthly_limit: data.monthly_limit,
          current_usage: data.current_usage,
          created_at: data.created_at
        }
      });
    } else {
      // API key not found
      return NextResponse.json(
        {
          status: 404,
          error: 'API Key not valid'
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also support GET requests for testing
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json(
      { error: 'API key is required. Use ?key=your_api_key' },
      { status: 400 }
    );
  }

  try {
    // Check if the API key exists in the database
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', key.trim())
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to validate API key' },
        { status: 500 }
      );
    }

    if (data) {
      // API key found - return success response
      return NextResponse.json({
        status: 200,
        message: 'API Key valid!',
        data: {
          key: data.key,
          name: data.name,
          monthly_limit: data.monthly_limit,
          current_usage: data.current_usage,
          created_at: data.created_at
        }
      });
    } else {
      // API key not found
      return NextResponse.json(
        {
          status: 404,
          error: 'API Key not valid'
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 