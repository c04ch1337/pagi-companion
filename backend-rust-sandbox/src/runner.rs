use anyhow::Result;
use tokio::time::{self, Duration};
use tracing::{error, info};

use pagi_companion_core::companion::agent::CompanionAgent;
use pagi_companion_core::verify_rag_pipeline;

/// Minimal bare-metal runtime that hosts the `CompanionAgent` and simulates I/O.
///
/// This is intentionally NOT wired to HTTP yet; it is a local async loop useful for
/// validating persistence + Agentic RAG + psychological updates end-to-end.
pub struct CompanionRunner {
    agent: CompanionAgent,
    user_id: String,
}

impl CompanionRunner {
    pub async fn new(user_id: String) -> Result<Self> {
        info!(user_id = user_id.as_str(), "companion_runner_init");
        let agent = CompanionAgent::new(user_id.clone()).await?;
        Ok(CompanionRunner { agent, user_id })
    }

    /// The main asynchronous loop simulating user interaction.
    pub async fn run(&mut self) -> Result<()> {
        info!(user_id = self.user_id.as_str(), "companion_runner_start");

        // Final verification step: store->save->load->retrieve RAG persistence.
        info!(user_id = self.user_id.as_str(), "rag_verification_start");
        match verify_rag_pipeline(&self.user_id).await {
            Ok(retrieved) => {
                info!(
                    retrieved = retrieved.len(),
                    example = ?retrieved.get(0),
                    "rag_verification_success"
                );
            }
            Err(e) => {
                error!(error = %e, "rag_verification_failed");
                return Err(e);
            }
        }

        // Mock conversation history to demonstrate state persistence.
        let conversation = vec![
            "Hello, Skylar. What do you think about the progress we've made on this project?",
            "I feel like we're getting close to a breakthrough, but I'm a little anxious.",
            "I love that you are so supportive and smart. Also, my dog's name is Sparky.",
            "I'm feeling flirty tonight. What do you want to do?",
            "Wait, what is my dog's name?",
        ];

        for (i, input) in conversation.into_iter().enumerate() {
            info!(step = i + 1, user_input = input, "companion_runner_step");

            match self.agent.execute_response(input).await {
                Ok(result) => {
                    info!(ai_response = result.report_summary.as_str(), status = ?result.status, "companion_runner_ok");
                }
                Err(e) => {
                    error!(error = %e, "companion_runner_err");
                }
            }

            time::sleep(Duration::from_millis(1500)).await;
        }

        info!(user_id = self.user_id.as_str(), "companion_runner_done");
        Ok(())
    }
}

