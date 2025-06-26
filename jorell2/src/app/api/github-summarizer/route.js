import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper function to validate API key
async function validateApiKey(key) {
  if (!key || typeof key !== 'string') {
    return { valid: false, error: 'API key is required and must be a string', status: 400 };
  }

  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', key.trim())
      .single();

    if (error) {
      console.error('Database error:', error);
      return { valid: false, error: 'Failed to validate API key', status: 500 };
    }

    if (data) {
      return { valid: true, data };
    } else {
      return { valid: false, error: 'API Key not valid', status: 404 };
    }
  } catch (error) {
    console.error('Error validating API key:', error);
    return { valid: false, error: 'Internal server error', status: 500 };
  }
}

export async function POST(request) {
  try {
    const { githubUrl } = await request.json();
    // Get API key from request header
    const key = request.headers.get('x-api-key');

    if (!key) {
      return NextResponse.json(
        { error: 'API Key is required' },
        { status: 401 }
      );
    }

    // Validate API key first
    const keyValidation = await validateApiKey(key);
    if (!keyValidation.valid) {
      return NextResponse.json(
        { error: keyValidation.error },
        { status: keyValidation.status }
      );
    }

    // Validate GitHub URL
    if (!githubUrl || typeof githubUrl !== 'string') {
      return NextResponse.json(
        { error: 'GitHub URL is required and must be a string' },
        { status: 400 }
      );
    }

    // Basic GitHub URL validation
    const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[^\/]+\/[^\/]+/;
    if (!githubUrlPattern.test(githubUrl)) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL format. Expected: https://github.com/username/repository' },
        { status: 400 }
      );
    }

    // TODO: Implement GitHub repository summarization logic here
    // This is where you would:
    // 1. Fetch repository data from GitHub API
    // 2. Process the repository information
    // 3. Generate a summary using LangChain/AI

    // For now, return a placeholder response
    return NextResponse.json({
      status: 200,
      message: 'GitHub repository summarization endpoint',
      data: {
        githubUrl,
        summary: "Summary of the repository coming soon...",
        readmePreview: await getReadmePreview(githubUrl),
        apiKeyInfo: {
          name: keyValidation.data.name,
          monthly_limit: keyValidation.data.monthly_limit,
          current_usage: keyValidation.data.current_usage
        }
      }
    });

  } catch (error) {
    console.error('Error in GitHub summarizer:', error);
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
  const githubUrl = searchParams.get('githubUrl');

  // Validate API key first
  const keyValidation = await validateApiKey(key);
  if (!keyValidation.valid) {
    return NextResponse.json(
      { error: keyValidation.error },
      { status: keyValidation.status }
    );
  }

  // Validate GitHub URL
  if (!githubUrl) {
    return NextResponse.json(
      { error: 'GitHub URL is required. Use ?githubUrl=https://github.com/username/repository' },
      { status: 400 }
    );
  }

  // Basic GitHub URL validation
  const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[^\/]+\/[^\/]+/;
  if (!githubUrlPattern.test(githubUrl)) {
    return NextResponse.json(
      { error: 'Invalid GitHub URL format. Expected: https://github.com/username/repository' },
      { status: 400 }
    );
  }

  try {
    // TODO: Implement GitHub repository summarization logic here
    // This is where you would:
    // 1. Fetch repository data from GitHub API
    // 2. Process the repository information
    // 3. Generate a summary using LangChain/AI

    // For now, return a placeholder response
    return NextResponse.json({
      status: 200,
      message: 'GitHub repository summarization endpoint',
      data: {
        githubUrl,
        summary: 'Repository summarization feature coming soon...',
        readmePreview: await getReadmePreview(githubUrl),
        apiKeyInfo: {
          name: keyValidation.data.name,
          monthly_limit: keyValidation.data.monthly_limit,
          current_usage: keyValidation.data.current_usage
        }
      }
    });

  } catch (error) {
    console.error('Error in GitHub summarizer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 

async function getReadmeContent(githubUrl) {
  try {
    // Extract owner and repo from GitHub URL
    const urlParts = githubUrl.replace('https://github.com/', '').split('/');
    const owner = urlParts[0];
    const repo = urlParts[1];

    // Construct raw content URL for README.md
    const readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
    
    // Fetch README content
    const response = await fetch(readmeUrl);
    
    if (!response.ok) {
      // Try fallback to master branch if main doesn't exist
      const fallbackUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`;
      const fallbackResponse = await fetch(fallbackUrl);
      
      if (!fallbackResponse.ok) {
        throw new Error('README.md not found in main or master branch');
      }
      
      return await fallbackResponse.text();
    }

    return await response.text();

  } catch (error) {
    console.error('Error fetching README:', error);
    throw new Error('Failed to fetch README content');
  }
}

async function getReadmePreview(githubUrl) {
  try {
    const readmeContent = await getReadmeContent(githubUrl);
    const words = readmeContent.split(/\s+/);
    return words.slice(0, 100).join(' ');
  } catch (error) {
    console.error('Error fetching readme preview:', error);
    throw new Error('Failed to fetch readme preview');
  }
}
