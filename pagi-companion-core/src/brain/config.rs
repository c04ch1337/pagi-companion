use anyhow::Result;
use std::env;
use url::Url;

/// Configuration settings for the external Tactical LLM API.
#[derive(Debug, Clone)]
pub struct TacticalLLMConfig {
    pub api_url: Url,
    pub api_key: String,
    pub model_name: String,
}

impl TacticalLLMConfig {
    /// Loads configuration from environment variables.
    ///
    /// - `TACTICAL_LLM_API_URL` (default: `http://127.0.0.1:8000/v1/generate`)
    /// - `TACTICAL_LLM_API_KEY` (default: `DEV_MOCK_KEY`)
    /// - `TACTICAL_LLM_MODEL` (default: `llama-3-8b-research`)
    pub fn load() -> Result<Self> {
        let api_url = env::var("TACTICAL_LLM_API_URL")
            .unwrap_or_else(|_| "http://127.0.0.1:8000/v1/generate".to_string());

        let api_key = env::var("TACTICAL_LLM_API_KEY").unwrap_or_else(|_| "DEV_MOCK_KEY".to_string());

        let model_name = env::var("TACTICAL_LLM_MODEL").unwrap_or_else(|_| "llama-3-8b-research".to_string());

        Ok(Self {
            api_url: Url::parse(&api_url)?,
            api_key,
            model_name,
        })
    }
}

