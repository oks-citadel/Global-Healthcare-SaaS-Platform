import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelWithResponseStreamCommand,
} from '@aws-sdk/client-bedrock-runtime';

export interface BedrockRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stopSequences?: string[];
}

export interface BedrockResponse {
  completion: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface BedrockEmbeddingRequest {
  text: string;
}

export interface BedrockEmbeddingResponse {
  embedding: number[];
}

@Injectable()
export class BedrockProvider {
  private readonly logger = new Logger(BedrockProvider.name);
  private readonly client: BedrockRuntimeClient;
  private readonly defaultModel: string;

  constructor(private configService: ConfigService) {
    this.client = new BedrockRuntimeClient({
      region: this.configService.get('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY', ''),
      },
    });
    this.defaultModel = this.configService.get(
      'BEDROCK_MODEL_ID',
      'anthropic.claude-3-sonnet-20240229-v1:0',
    );
  }

  async invoke(
    request: BedrockRequest,
    modelId?: string,
  ): Promise<BedrockResponse> {
    const model = modelId || this.defaultModel;

    try {
      const body = this.buildRequestBody(model, request);

      const command = new InvokeModelCommand({
        modelId: model,
        body: JSON.stringify(body),
        contentType: 'application/json',
        accept: 'application/json',
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      return this.parseResponse(model, responseBody);
    } catch (error) {
      this.logger.error(`Bedrock invoke failed: ${error}`);
      throw error;
    }
  }

  async invokeStream(
    request: BedrockRequest,
    modelId?: string,
  ): AsyncGenerator<string> {
    const model = modelId || this.defaultModel;

    try {
      const body = this.buildRequestBody(model, request);

      const command = new InvokeModelWithResponseStreamCommand({
        modelId: model,
        body: JSON.stringify(body),
        contentType: 'application/json',
        accept: 'application/json',
      });

      const response = await this.client.send(command);

      if (response.body) {
        for await (const event of response.body) {
          if (event.chunk?.bytes) {
            const chunk = JSON.parse(
              new TextDecoder().decode(event.chunk.bytes),
            );
            yield this.extractChunkText(model, chunk);
          }
        }
      }
    } catch (error) {
      this.logger.error(`Bedrock stream failed: ${error}`);
      throw error;
    }
  }

  async generateEmbedding(
    request: BedrockEmbeddingRequest,
  ): Promise<BedrockEmbeddingResponse> {
    const embeddingModel = this.configService.get(
      'BEDROCK_EMBEDDING_MODEL',
      'amazon.titan-embed-text-v1',
    );

    try {
      const body = {
        inputText: request.text,
      };

      const command = new InvokeModelCommand({
        modelId: embeddingModel,
        body: JSON.stringify(body),
        contentType: 'application/json',
        accept: 'application/json',
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      return {
        embedding: responseBody.embedding,
      };
    } catch (error) {
      this.logger.error(`Bedrock embedding failed: ${error}`);
      throw error;
    }
  }

  async generateJson<T>(
    prompt: string,
    schema: string,
    maxTokens = 4096,
  ): Promise<T> {
    const systemPrompt = `You are a JSON generator. Always respond with valid JSON that matches this schema:
${schema}

Do not include any text before or after the JSON. Only output the JSON object.`;

    const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;

    const response = await this.invoke({
      prompt: fullPrompt,
      maxTokens,
      temperature: 0.2,
    });

    try {
      return JSON.parse(response.completion) as T;
    } catch {
      this.logger.error(
        `Failed to parse JSON response: ${response.completion}`,
      );
      throw new Error('Invalid JSON response from model');
    }
  }

  private buildRequestBody(model: string, request: BedrockRequest): unknown {
    if (model.startsWith('anthropic.claude')) {
      return {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: request.maxTokens || 4096,
        temperature: request.temperature ?? 0.7,
        top_p: request.topP ?? 0.9,
        messages: [
          {
            role: 'user',
            content: request.prompt,
          },
        ],
        stop_sequences: request.stopSequences,
      };
    }

    if (model.startsWith('amazon.titan')) {
      return {
        inputText: request.prompt,
        textGenerationConfig: {
          maxTokenCount: request.maxTokens || 4096,
          temperature: request.temperature ?? 0.7,
          topP: request.topP ?? 0.9,
          stopSequences: request.stopSequences || [],
        },
      };
    }

    if (model.startsWith('meta.llama')) {
      return {
        prompt: request.prompt,
        max_gen_len: request.maxTokens || 4096,
        temperature: request.temperature ?? 0.7,
        top_p: request.topP ?? 0.9,
      };
    }

    // Default format
    return {
      prompt: request.prompt,
      max_tokens: request.maxTokens || 4096,
      temperature: request.temperature ?? 0.7,
    };
  }

  private parseResponse(model: string, responseBody: unknown): BedrockResponse {
    const body = responseBody as Record<string, unknown>;

    if (model.startsWith('anthropic.claude')) {
      const content = body.content as Array<{ text: string }>;
      const usage = body.usage as {
        input_tokens: number;
        output_tokens: number;
      };
      return {
        completion: content[0]?.text || '',
        usage: {
          inputTokens: usage?.input_tokens || 0,
          outputTokens: usage?.output_tokens || 0,
        },
      };
    }

    if (model.startsWith('amazon.titan')) {
      const results = body.results as Array<{
        outputText: string;
        tokenCount: number;
      }>;
      return {
        completion: results[0]?.outputText || '',
        usage: {
          inputTokens: (body.inputTextTokenCount as number) || 0,
          outputTokens: results[0]?.tokenCount || 0,
        },
      };
    }

    if (model.startsWith('meta.llama')) {
      return {
        completion: (body.generation as string) || '',
        usage: {
          inputTokens: (body.prompt_token_count as number) || 0,
          outputTokens: (body.generation_token_count as number) || 0,
        },
      };
    }

    // Default parsing
    return {
      completion: (body.completion as string) || (body.text as string) || '',
      usage: {
        inputTokens: 0,
        outputTokens: 0,
      },
    };
  }

  private extractChunkText(model: string, chunk: unknown): string {
    const data = chunk as Record<string, unknown>;

    if (model.startsWith('anthropic.claude')) {
      if (data.type === 'content_block_delta') {
        const delta = data.delta as { text: string };
        return delta.text || '';
      }
      return '';
    }

    if (model.startsWith('amazon.titan')) {
      return (data.outputText as string) || '';
    }

    return (data.generation as string) || (data.text as string) || '';
  }
}
