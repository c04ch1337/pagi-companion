use anyhow::Result;
use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};
use tracing::{info, warn};

use crate::brain::config::TacticalLLMConfig;
use crate::companion::models::StructuredLLMOutput;

/// The complete prompt input structure sent to the external LLM API.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TacticalLLMRequest {
    pub model: String,
    pub temperature: f32,
    pub system_prompt: String,
    pub user_input: String,
}

/// The central component for interacting with the underlying LLM (external API).
pub struct TacticalLLM {
    config: TacticalLLMConfig,
    http_client: Client,
}

impl TacticalLLM {
    pub fn new() -> Result<Self> {
        let config = TacticalLLMConfig::load()?;
        let http_client = Client::builder()
            .timeout(std::time::Duration::from_secs(30))
            .build()?;
        Ok(TacticalLLM { config, http_client })
    }

    /// Specialized method for the Companion Agent to generate structured responses using RAG context.
    pub async fn generate_structured_output(
        &self,
        system_prompt: &str,
        memory_context: &str,
        user_input: &str,
    ) -> Result<StructuredLLMOutput> {
        // 1) Build the complete prompt augmented with RAG context.
        let full_user_input = format!("CONTEXT: {}\nUSER REQUEST: {}", memory_context, user_input);

        // 2) Build the API request payload.
        let request_payload = TacticalLLMRequest {
            model: self.config.model_name.clone(),
            temperature: 0.8,
            system_prompt: system_prompt.to_string(),
            user_input: full_user_input,
        };

        info!(
            api_url = self.config.api_url.as_str(),
            model = self.config.model_name.as_str(),
            "tactical_llm_request_send"
        );

        // 3) Make the API call.
        let response = self
            .http_client
            .post(self.config.api_url.clone())
            .header("Authorization", format!("Bearer {}", self.config.api_key))
            .json(&request_payload)
            .send()
            .await?;

        // 4) Handle response.
        if response.status() != StatusCode::OK {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            anyhow::bail!("LLM API request failed (status={status}): {body}");
        }

        let raw_llm_text = response.text().await?;

        // 5) Robustly parse the structured JSON output.
        let json_block = extract_json_block(&raw_llm_text);
        let output: StructuredLLMOutput = serde_json::from_str(json_block.trim()).map_err(|e| {
            warn!(error = %e, raw = raw_llm_text.as_str(), "tactical_llm_parse_failed");
            anyhow::anyhow!("Failed to deserialize structured LLM output: {e}")
        })?;

        info!("tactical_llm_response_parsed");
        Ok(output)
    }
}

fn extract_json_block(raw: &str) -> &str {
    // Common case: fenced markdown.
    if let Some(start) = raw.find("```json") {
        let start = start + "```json".len();
        if let Some(end) = raw[start..].find("```") {
            return &raw[start..start + end];
        }
    }

    // Fallback: try first '{' to last '}' extraction.
    if let (Some(l), Some(r)) = (raw.find('{'), raw.rfind('}')) {
        if l < r {
            return &raw[l..=r];
        }
    }

    // Last resort: assume raw is JSON.
    raw
}

