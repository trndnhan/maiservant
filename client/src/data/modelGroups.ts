// client\src\data\modelGroups.ts
export type Model = {
  value: string
  label: string
  provider: string
}

export type ModelGroup = {
  family: string
  models: Model[]
}

export const modelGroups: ModelGroup[] = [
  {
    family: 'Gemini',
    models: [
      { label: 'Gemini 1.5 Flash-8B', value: 'gemini-1.5-flash-8b', provider: 'Google' },
      { label: 'Gemini 2.0 Flash-Lite', value: 'gemini-2.0-flash-lite', provider: 'Google' }
    ]
  },
  {
    family: 'Command',
    models: [
      { label: 'Command A', value: 'command-a-03-2025', provider: 'Cohere' },
      { label: 'Command R7B', value: 'command-r7b-12-2024', provider: 'Cohere' },
      { label: 'Command Light', value: 'command-light-nightly', provider: 'Cohere' }
    ]
  },
  {
    family: 'Mistral',
    models: [
      { label: 'Mistral Large', value: 'mistral-large-latest', provider: 'Mistral' },
      { label: 'Mistral Small', value: 'mistral-small-latest', provider: 'Mistral' },
      { label: 'Codestral Mamba', value: 'open-mistral-nemo', provider: 'Mistral' }
    ]
  },
  {
    family: 'DeepSeek',
    models: [
      {
        label: 'DeepSeek R1 Distill Qwen 14B',
        value: 'deepseek/deepseek-r1-distill-qwen-14b:free',
        provider: 'OpenRouter'
      },
      {
        label: 'DeepSeek V3',
        value: 'deepseek/deepseek-chat-v3-0324:free',
        provider: 'OpenRouter'
      }
    ]
  },
  {
    family: 'Llama',
    models: [
      {
        label: 'Llama 3.1 8B Instruct',
        value: 'meta-llama/llama-3.1-8b-instruct:free',
        provider: 'OpenRouter'
      },
      {
        label: 'Llama 3.2 1B Instruct',
        value: 'meta-llama/llama-3.2-1b-instruct:free',
        provider: 'OpenRouter'
      },
      {
        label: 'Llama 3.3 Nemotron Super 49B',
        value: 'nvidia/llama-3.3-nemotron-super-49b-v1:free',
        provider: 'OpenRouter'
      },
      {
        label: 'Llama 4 Scout',
        value: 'meta-llama/llama-4-scout:free',
        provider: 'OpenRouter'
      }
    ]
  },
  {
    family: 'Qwen',
    models: [
      {
        label: 'Qwen2.5 7B Instruct',
        value: 'qwen/qwen-2.5-7b-instruct:free',
        provider: 'OpenRouter'
      },
      { label: 'Qwen2.5 Coder 32B Instruct', value: 'qwen/qwen-2.5-coder-32b-instruct:free', provider: 'OpenRouter' },
      {
        label: 'Qwen2.5 VL 3B Instruct',
        value: 'qwen/qwen2.5-vl-3b-instruct:free',
        provider: 'OpenRouter'
      },
      {
        label: 'Qwen3 0.6B',
        value: 'qwen/qwen3-0.6b-04-28:free',
        provider: 'OpenRouter'
      }
    ]
  }
]
