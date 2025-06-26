import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

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

    // Get README content for summarization
    const readmeContent = await getReadmeContent(githubUrl);
    const summary = await generateSummary(readmeContent);
    const { shortSummary, top3Takeaways } = await generateShortSummaryAndTakeaways(readmeContent);

    // Return the response with AI-generated summary
    return NextResponse.json({
      status: 200,
      message: 'GitHub repository summarization endpoint',
      data: {
        githubUrl,
        summary: summary,
        readmePreview: await getReadmePreview(githubUrl),
        shortSummary: shortSummary,
        top3Takeaways: top3Takeaways,
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

    // Get README content for summarization
    const readmeContent = await getReadmeContent(githubUrl);
    const summary = await generateSummary(readmeContent);
    const { shortSummary, top3Takeaways } = await generateShortSummaryAndTakeaways(readmeContent);

    // Return the response with AI-generated summary
    return NextResponse.json({
      status: 200,
      message: 'GitHub repository summarization endpoint',
      data: {
        githubUrl,
        summary: summary,
        readmePreview: await getReadmePreview(githubUrl),
        shortSummary: shortSummary,
        top3Takeaways: top3Takeaways,
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

async function generateSummary(readmeContent) {
  try {
    const prompt = PromptTemplate.fromTemplate(`
You are an AI that reads GitHub README files.

Based on the README below, do two things:
1. Write a concise **summary** of what this project is.
2. Under the heading 'Top 3 Takeaways', list 5–7 **bullet points** of cool or notable facts about the project.

README:
{readme}
    `);

    const chain = prompt.pipe(model).pipe(new StringOutputParser());
    const summary = await chain.invoke({ readme: readmeContent });
    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    
    // Check for specific OpenAI API errors
    if (error.message && error.message.includes('401')) {
      return 'Error: Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.';
    } else if (error.message && error.message.includes('429')) {
      return 'Error: OpenAI API rate limit exceeded. Please try again later.';
    } else if (error.message && error.message.includes('500')) {
      return 'Error: OpenAI API server error. Please try again later.';
    } else if (!process.env.OPENAI_API_KEY) {
      return 'Error: OpenAI API key not configured. Please set OPENAI_API_KEY in your environment.';
    }
    
    return 'Unable to generate summary at this time. Please check your OpenAI API configuration.';
  }
}

async function generateShortSummaryAndTakeaways(readmeContent) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant that analyzes GitHub README files and provides concise summaries and key takeaways.'
          },
          {
            role: 'user',
            content: `Please analyze this GitHub README file and provide:

1. A short summary in 140 words or less
2. A top 3 key takeaways bullet list

README Content:
${readmeContent}

Please format your response as:
Short Summary: [your 140-word summary here]

Top 3 Key Takeaways:
• [first takeaway]
• [second takeaway]
• [third takeaway]`
          }
        ],
        temperature: 0.4,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the response to extract summary and takeaways
    const summaryMatch = content.match(/Short Summary:\s*(.*?)(?=\n\n|Top 3 Key Takeaways:|$)/s);
    const takeawaysMatch = content.match(/Top 3 Key Takeaways:\s*((?:•.*?\n?)+)/s);

    const shortSummary = summaryMatch ? summaryMatch[1].trim() : 'Unable to generate summary';
    const top3Takeaways = takeawaysMatch ? takeawaysMatch[1].trim() : 'Unable to generate takeaways';

    return { shortSummary, top3Takeaways };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return {
      shortSummary: 'Error generating summary',
      top3Takeaways: 'Error generating takeaways'
    };
  }
}
